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
  <title>Color Changing Loading Animation</title>
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
      margin: 0 10px;
      animation: colorChange 2s ease-in-out infinite; /* 设置动画 */
    }

    /* 设置每个点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }
    .dot:nth-child(4) { animation-delay: 0.9s; }

    @keyframes colorChange {
      0% {
        background-color: #e74c3c; /* 红色 */
        transform: scale(1); /* 初始大小 */
      }
      25% {
        background-color: #f39c12; /* 橙色 */
        transform: scale(1.2); /* 放大 */
      }
      50% {
        background-color: #2ecc71; /* 绿色 */
        transform: scale(1); /* 恢复原始大小 */
      }
      75% {
        background-color: #3498db; /* 蓝色 */
        transform: scale(1.2); /* 放大 */
      }
      100% {
        background-color: #9b59b6; /* 紫色 */
        transform: scale(1); /* 恢复原始大小 */
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
