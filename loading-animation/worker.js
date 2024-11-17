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
  <title>Elastic Bead Animation</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #f3f3f3;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .loading-container {
      display: flex;
      position: relative;
      width: 100%;
      height: 100%;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      position: absolute;
      animation: beadAnimation 4.5s ease-in-out infinite; /* 提速动画 */
    }

    /* 设置每个点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.3s; }
    .dot:nth-child(3) { animation-delay: 0.6s; }
    .dot:nth-child(4) { animation-delay: 0.9s; }
    .dot:nth-child(5) { animation-delay: 1.2s; }

    @keyframes beadAnimation {
      0% {
        transform: translateX(-100vw) scale(0.8);
        opacity: 0;
      }
      15% {
        transform: translateX(calc(50vw - 20px * var(--order))) scale(1.5); /* 增强弹性收缩 */
        opacity: 1;
      }
      30% {
        transform: translateX(calc(50vw - 20px * var(--order))) scale(1); /* 完全到达中间位置 */
      }
      60% {
        transform: translateX(calc(50vw - 20px * var(--order))) scale(1); /* 停留中间位置 */
      }
      85% {
        transform: translateX(calc(100vw + 25px * var(--order))) scale(1.2); /* 散开效果 */
      }
      100% {
        transform: translateX(100vw) scale(0.8);
        opacity: 0;
      }
    }

    /* 动态设置点的序号，调整偏移量以确保没有缝隙 */
    .dot:nth-child(1) { --order: 0; }
    .dot:nth-child(2) { --order: -1; }
    .dot:nth-child(3) { --order: -2; }
    .dot:nth-child(4) { --order: -3; }
    .dot:nth-child(5) { --order: -4; }
  </style>
</head>
<body>
  <div class="loading-container">
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
  });
}
