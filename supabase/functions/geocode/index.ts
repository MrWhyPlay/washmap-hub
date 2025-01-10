import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'WashmapHub/1.0'

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    
    if (!address) {
      throw new Error('Address is required')
    }

    // Add a small delay to respect rate limiting (1 request per second)
    await new Promise(resolve => setTimeout(resolve, 1000))

    const params = new URLSearchParams({
      format: 'json',
      q: address,
      limit: '1'
    })

    console.log(`Geocoding address: ${address}`)

    const response = await fetch(
      `${NOMINATIM_ENDPOINT}?${params.toString()}`,
      {
        headers: {
          'User-Agent': USER_AGENT
        }
      }
    )

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status} ${response.statusText}`)
      throw new Error(`Geocoding service error: ${response.status}`)
    }

    const data = await response.json()
    
    if (!data || data.length === 0) {
      console.log(`No results found for address: ${address}`)
      return new Response(
        JSON.stringify({ error: 'Address not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Found coordinates for ${address}: ${data[0].lat}, ${data[0].lon}`)

    return new Response(
      JSON.stringify({
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Geocoding error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})