addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { method, url } = request;

  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    return new Response(null, { headers });
  }

  // 检查请求是否为POST
  if (method === 'POST') {
    const body = await request.json();
    if (!body.message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400, headers });
    }

    // 这里使用x.ai的API密钥
    const apiKey = 'xai-wRCptaYtRq8mYntFYF7UTwMCN7TOjJZZ34pnnCPtWVFWf4cKhcxAsLCwNVOUmptinRU0ieoT27WZMP0U';
    
    // 发送请求到x.ai API
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
    
    // 检查API响应是否成功
    if (response.ok) {
      // 只返回AI的回答文本
      const aiResponse = result.choices[0].message.content;
      return new Response(aiResponse, {
        headers: { ...headers, 'Content-Type': 'text/plain' }
      });
    } else {
      // 如果API返回错误，返回错误信息
      return new Response(JSON.stringify({ error: result.error }), {
        status: response.status,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  } else {
    // 如果不是POST请求，返回一个简单的HTML页面或错误信息
    return new Response('Please send a POST request with a message.', { status: 405, headers });
  }
      }
