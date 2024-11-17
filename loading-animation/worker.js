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
  <title>Bead Animation with Elastic Effect</title>
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
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      position: absolute;
      animation: beadAnimation 6s ease-in-out infinite;
    }

    /* 动态设置点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.4s; }
    .dot:nth-child(3) { animation-delay: 0.8s; }
    .dot:nth-child(4) { animation-delay: 1.2s; }
    .dot:nth-child(5) { animation-delay: 1.6s; }

    @keyframes beadAnimation {
      0% {
        transform: translateX(-100vw) scale(0.8);
        opacity: 0;
      }
      25% {
        transform: translateX(calc(50vw - var(--order) * 15px)) scale(1.2); /* 略过目标位置，增加弹性 */
        opacity: 1;
      }
      35% {
        transform: translateX(calc(50vw - var(--order) * 15px)) scale(1); /* 弹回到目标位置 */
      }
      40% {
        transform: translateX(calc(50vw)) scale(1); /* 短暂堆叠 */
      }
      50% {
        transform: translateX(calc(50vw - var(--order) * 10px)) scale(1); /* 排成紧密一串 */
      }
      70% {
        transform: translateX(calc(50vw - var(--order) * 10px)) scale(1); /* 保持展示 */
      }
      80% {
        transform: translateX(calc(100vw + var(--order) * 20px)) scale(1.2); /* 向右散开，略过目标位置 */
      }
      100% {
        transform: translateX(100vw) scale(0.8);
        opacity: 0;
      }
    }

    /* 动态设置点的序号 */
    .dot:nth-child(1) { --order: 2; }
    .dot:nth-child(2) { --order: 1; }
    .dot:nth-child(3) { --order: 0; }
    .dot:nth-child(4) { --order: -1; }
    .dot:nth-child(5) { --order: -2; }
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
