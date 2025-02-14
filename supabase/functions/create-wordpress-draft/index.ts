import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { article } = await req.json()

    // Get WordPress settings
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

    if (!settings?.wordpress_url || !settings?.wordpress_token) {
      throw new Error('WordPress credentials not configured')
    }

    // Format content
    const content = article.sections.map(section => `
      <!-- wp:heading -->
      <h2>${section.title}</h2>
      <!-- /wp:heading -->

      <!-- wp:paragraph -->
      ${section.content}
      <!-- /wp:paragraph -->
    `).join('\n\n')

    const imageGallery = article.images.map(url => `
      <!-- wp:image -->
      <figure class="wp-block-image">
        <img src="${url}" alt="${article.title}" />
      </figure>
      <!-- /wp:image -->
    `).join('\n')

    // Create WordPress draft
    const response = await fetch(`${settings.wordpress_url}/wp-json/wp/v2/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`admin:${settings.wordpress_token}`)}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: article.title,
        content: `${content}\n\n${imageGallery}`,
        status: 'draft',
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create WordPress draft')
    }

    const postData = await response.json()

    // Update article status
    await supabaseClient
      .from('articles')
      .update({ wordpress_draft: true })
      .eq('id', article.id)

    return new Response(
      JSON.stringify(postData),
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
