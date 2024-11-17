addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Wave Loading Animation</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f3f3f3;
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #e74c3c;
      margin: 0 10px;
      animation: wave 1.5s ease-in-out infinite;
    }

    /* 设置每个点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }
    .dot:nth-child(4) { animation-delay: 0.9s; }

    @keyframes wave {
      0%, 100% {
        transform: translateY(0); /* 默认位置 */
        opacity: 0.7;
      }
      50% {
        transform: translateY(-20px); /* 向上波动 */
        opacity: 1;
      }
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
    <div class="dot"></div>
  </div>
</body>
</html>
`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
