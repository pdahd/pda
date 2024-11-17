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
  <title>Elastic Loading Animation</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background-color: #f3f3f3; /* 背景色 */
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .loading-container {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      width: 100%;
      height: 100%;
      position: relative;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: red; /* 修改为红色 */
      position: absolute; /* 使用绝对定位便于精确控制弹性 */
      animation: bounce 3s cubic-bezier(0.68, -0.55, 0.27, 1.55) infinite; /* 弹性缓动曲线 */
    }

    /* 修改点的延迟，增加延迟时间 */
    .dot:nth-child(1) { animation-delay: 0s; }
    .dot:nth-child(2) { animation-delay: 0.4s; } /* 延迟增加 */
    .dot:nth-child(3) { animation-delay: 0.8s; } /* 延迟增加 */
    .dot:nth-child(4) { animation-delay: 1.2s; } /* 延迟增加 */

    @keyframes bounce {
      0% {
        transform: translateX(-100vw) scale(0.5); /* 从屏幕外左侧开始，缩小 */
        opacity: 0.3;
      }
      30% {
        transform: translateX(calc(50vw - 35px)) scale(1); /* 回弹至中间，变大 */
        opacity: 1;
      }
      50% {
        transform: translateX(calc(50vw - 35px)) scale(1); /* 中间停留 */
      }
      70% {
        transform: translateX(100vw) scale(0.5); /* 弹出屏幕外右侧，缩小 */
        opacity: 0.3;
      }
      100% {
        transform: translateX(100vw) scale(0.5); /* 完全消失 */
        opacity: 0;
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
