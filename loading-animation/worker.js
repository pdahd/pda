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
  <title>Improved Bead Animation</title>
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
      animation: beadAnimation 3s ease-in-out infinite;
    }

    /* 动态设置点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .dot:nth-child(4) { animation-delay: 0.6s; }
    .dot:nth-child(5) { animation-delay: 0.8s; }
    .dot:nth-child(6) { animation-delay: 1s; }

    @keyframes beadAnimation {
      0% {
        transform: translateX(-100vw) scale(0.8); /* 从屏幕外左侧开始 */
        opacity: 0.3;
      }
      20% {
        transform: translateX(calc(50vw - var(--order) * 15px - 10px)) scale(1.1); /* 略过头，模拟弹性 */
        opacity: 1;
      }
      30% {
        transform: translateX(calc(50vw - var(--order) * 15px)) scale(1); /* 回到中间，连成珠子 */
      }
      50% {
        transform: translateX(calc(50vw - var(--order) * 15px)) scale(1); /* 在中间停留 */
      }
      70% {
        transform: translateX(calc(100vw + var(--order) * 15px)) scale(1.1); /* 向右略过头 */
      }
      100% {
        transform: translateX(100vw) scale(0.8); /* 消失 */
        opacity: 0.3;
      }
    }

    /* 动态设置点的序号，用于计算排列 */
    .dot:nth-child(1) { --order: 3; }
    .dot:nth-child(2) { --order: 2; }
    .dot:nth-child(3) { --order: 1; }
    .dot:nth-child(4) { --order: 0; }
    .dot:nth-child(5) { --order: -1; }
    .dot:nth-child(6) { --order: -2; }
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
  });
}
