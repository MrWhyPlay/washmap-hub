import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOMINATIM_ENDPOINT = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT = 'WashmapHub/1.0'

// Rate limiting map to store last request timestamps
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_WINDOW = 1000; // 1 second in milliseconds

function checkRateLimit(address: string): boolean {
  const now = Date.now();
  const lastRequest = rateLimitMap.get(address);
  
  if (lastRequest && now - lastRequest < RATE_LIMIT_WINDOW) {
    return false;
  }
  
  rateLimitMap.set(address, now);
  return true;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { address } = await req.json()
    
    if (!address) {
      console.error('Missing address in request');
      return new Response(
        JSON.stringify({ error: 'Address is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Check rate limit
    if (!checkRateLimit(address)) {
      console.log(`Rate limit exceeded for address: ${address}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please try again in a moment.' }),
        { 
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Geocoding address: ${address}`);

    const params = new URLSearchParams({
      format: 'json',
      q: address,
      limit: '1',
      addressdetails: '1'
    });

    const response = await fetch(
      `${NOMINATIM_ENDPOINT}?${params.toString()}`,
      {
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`Nominatim API error: ${response.status} ${response.statusText}`);
      throw new Error(`Geocoding service error: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType?.includes('application/json')) {
      console.error(`Unexpected content type: ${contentType}`);
      throw new Error('Invalid response from geocoding service');
    }

    const data = await response.json();
    
    if (!data || data.length === 0) {
      console.log(`No results found for address: ${address}`);
      return new Response(
        JSON.stringify({ error: 'Address not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    console.log(`Found coordinates for ${address}: ${data[0].lat}, ${data[0].lon}`);

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
    console.error('Geocoding error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})