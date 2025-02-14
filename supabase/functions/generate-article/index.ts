import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { title, sections, imagePrompt, textPrompt, keywords, checkPlagiarism, imageCount, imageSize } = await req.json()

    // Get settings for API keys
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data: settings } = await supabaseClient
      .from('decrypted_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!settings?.openai_key) {
      throw new Error('OpenAI API key not configured')
    }

    // Initialize OpenAI
    const configuration = new Configuration({
      apiKey: settings.openai_key,
    })
    const openai = new OpenAIApi(configuration)

    // Generate article content
    const articlePrompt = `Write an article about "${title}" with the following sections:\n\n${
      sections.map(s => `- ${s.title}`).join('\n')
    }\n\nStyle/Tone: ${textPrompt || 'Professional and engaging'}\n\nInclude these keywords: ${keywords.join(', ')}`

    const completion = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: articlePrompt }],
    })

    const articleContent = completion.data.choices[0].message?.content

    // Generate images
    const imagePromises = Array(imageCount).fill(0).map(async () => {
      const imageCompletion = await openai.createImage({
        prompt: imagePrompt || `High quality image related to: ${title}`,
        n: 1,
        size: imageSize === '3:4' ? '1024x1024' : '1024x1024',
      })
      return imageCompletion.data.data[0].url
    })

    const images = await Promise.all(imagePromises)

    // Create article record
    const { data: article, error } = await supabaseClient
      .from('articles')
      .insert({
        user_id: user.id,
        title,
        sections: sections.map((s, i) => ({
          ...s,
          content: articleContent?.split('\n\n')[i] || ''
        })),
        options: {
          imagePrompt,
          textPrompt,
          keywords,
          checkPlagiarism,
          imageCount,
          imageSize
        },
        images,
        status: 'completed'
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify(article),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
