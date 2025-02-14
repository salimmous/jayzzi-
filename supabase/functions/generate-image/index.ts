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
    const { model, prompt, size, referenceImage } = await req.json()

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

    let imageUrl: string

    switch (model) {
      case 'ideogram':
        if (!settings?.stability_key) {
          throw new Error('Stability API key not configured')
        }
        // Implement Stability AI call
        break

      case 'midjourney':
        if (!settings?.midjourney_key) {
          throw new Error('Midjourney API key not configured')
        }
        // Implement Midjourney call
        break

      case 'imagefx':
        if (!settings?.google_ai_key) {
          throw new Error('Google AI API key not configured')
        }
        
        const imageFxResponse = await fetch('https://api.labs.google/v1/images/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${settings.google_ai_key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt,
            size: size === '3:4' ? '768x1024' : '1024x768',
            num_images: 1,
            reference_image: referenceImage ? {
              content: referenceImage,
              weight: 0.5
            } : undefined
          })
        })

        if (!imageFxResponse.ok) {
          throw new Error('Failed to generate image with Google ImageFX')
        }

        const imageFxData = await imageFxResponse.json()
        imageUrl = imageFxData.images[0].url
        break

      default: // OpenAI DALL-E
        if (!settings?.openai_key) {
          throw new Error('OpenAI API key not configured')
        }
        const configuration = new Configuration({
          apiKey: settings.openai_key,
        })
        const openai = new OpenAIApi(configuration)

        const completion = await openai.createImage({
          prompt,
          n: 1,
          size: size === '3:4' ? '1024x1024' : '1024x1024',
        })
        imageUrl = completion.data.data[0].url
    }

    return new Response(
      JSON.stringify({ url: imageUrl }),
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
