const HTML_NAMESPACE = 'HTML_CONTENT'; // 确保这个名称与wrangler.toml中的绑定名称匹配

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { method, url } = request;

  // 如果是GET请求，返回index.html
  if (method === 'GET') {
    const htmlContent = await HTML_CONTENT.get('index.html');
    if (!htmlContent) {
      return new Response('Failed to load index.html', { status: 500 });
    }
    return new Response(htmlContent, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 如果是POST请求，返回一个简单的响应
  if (method === 'POST') {
    return new Response('This is a POST response', {
      headers: { 'Content-Type': 'text/plain' }
    });
  }

  // 如果不是GET或POST请求，返回错误
  return new Response('Method Not Allowed', { status: 405 });
}
