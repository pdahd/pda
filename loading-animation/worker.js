addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { method, url } = request;

  if (method === 'OPTIONS') {
    return new Response(null);
  }

  if (method === 'GET') {
    // 使用 request.url 构建 index.html 的完整 URL
    const indexHTMLUrl = new URL(request.url);
    indexHTMLUrl.pathname = '/index.html';

    return fetch(new Request(indexHTMLUrl))
      .then(response => {
        if (response.ok) {
          return response;
        } else {
          return new Response('Failed to load index.html', { status: 500 });
        }
      })
      .catch(error => {
        return new Response(`An error occurred: ${error.message}`, { status: 500 });
      });
  }

  if (method === 'POST') {
    const body = await request.json();
    if (!body.message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    const apiKey = 'xai-wRCptaYtRq8mYntFYF7UTwMCN7TOjJZZ34pnnCPtWVFWf4cKhcxAsLCwNVOUmptinRU0ieoT27WZMP0U'; // **请替换为你自己的 API 密钥**

    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: body.message }],
      })
    });

    const result = await response.json();

    if (response.ok) {
      const aiResponse = result.choices[0].message.content;
      return new Response(aiResponse, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      return new Response(JSON.stringify({ error: result.error }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    return new Response('Please send a GET request for the page or a POST request with a message.', { status: 405 });
  }
                  }
