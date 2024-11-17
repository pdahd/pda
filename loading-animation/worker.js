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
  <title>Loading Animation</title>
  <style>
    body {
      margin: 0; /* 去除默认 body margin */
      overflow: hidden; /* 防止滚动条出现 */
    }
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: flex-start; /* 从左边开始 */
      height: 100vh; /* 充满屏幕高度 */
      width: 100vw; /* 充满屏幕宽度 */
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      margin: 0 5px;
      animation: slide 3s infinite ease-in-out; /* 调整动画时间和缓动函数 */
    }

    /* 为每个点设置延迟 */
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .dot:nth-child(4) { animation-delay: 0.6s; }
    .dot:nth-child(5) { animation-delay: 0.8s; }
    .dot:nth-child(6) { animation-delay: 1.0s; }


    @keyframes slide {
      0% { transform: translateX(0); }
      50% { transform: translateX(calc(50vw - 35px)); } /* 滑动到中间并考虑自身宽度和margin */
      70% { transform: translateX(calc(50vw - 35px)); } /* 中间停留 */
      100% { transform: translateX(calc(100vw - 70px)); } /* 滑动到最右边并考虑自身宽度和margin */
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="dot"></div>
    <div class="dot"></div>
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
  })
}
