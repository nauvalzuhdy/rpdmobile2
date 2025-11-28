export async function GET() {
  try {
    const streamUrl = 'http://s1.voscast.com:8080/stream';
    
    const response = await fetch(streamUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      return new Response('Stream not available', { status: 503 });
    }

    // Get the readable stream from the response
    const stream = response.body;

    if (!stream) {
      return new Response('No stream available', { status: 503 });
    }

    // Return the stream with proper headers
    return new Response(stream, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('Radio stream error:', error);
    return new Response('Failed to connect to radio stream', { status: 500 });
  }
}

export const runtime = 'edge';