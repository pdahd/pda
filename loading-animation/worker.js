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
  <title>Bead Animation Optimized Timing</title>
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
      animation: beadAnimation 3.5s ease-in-out infinite; /* 总时长缩短为 3.5s */
    }

    /* 动态设置点的延迟 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.25s; }
    .dot:nth-child(3) { animation-delay: 0.5s; }
    .dot:nth-child(4) { animation-delay: 0.75s; }
    .dot:nth-child(5) { animation-delay: 1s; }

    @keyframes beadAnimation {
      0% {
        transform: translateX(-100vw) scale(0.8);
        opacity: 0;
      }
      12% {
        transform: translateX(calc(50vw - var(--order) * 12px)) scale(1.1); /* 快速到达中间 */
        opacity: 1;
      }
      18% {
        transform: translateX(calc(50vw - var(--order) * 12px)) scale(1); /* 弹回到中间 */
      }
      35% {
        transform: translateX(calc(50vw - var(--order) * 12px)) scale(1); /* 中间停留时间缩短 */
      }
      60% {
        transform: translateX(calc(100vw + var(--order) * 20px)) scale(1.1); /* 向右加速 */
      }
      100% {
        transform: translateX(100vw) scale(0.8);
        opacity: 0;
      }
    }

    /* 动态设置点的序号，从右到左 */
    .dot:nth-child(1) { --order: -2; } /* 最右 */
    .dot:nth-child(2) { --order: -1; }
    .dot:nth-child(3) { --order: 0; }  /* 中间 */
    .dot:nth-child(4) { --order: 1; }
    .dot:nth-child(5) { --order: 2; } /* 最左 */
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
