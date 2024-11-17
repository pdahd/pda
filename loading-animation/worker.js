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
    body { margin: 0; overflow: hidden; }

    .loading-container {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      height: 100vh;
      width: 100vw;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      animation: stretch 3s infinite ease-in-out;
      opacity: 0; /* 初始状态透明 */
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .dot:nth-child(4) { animation-delay: 0.6s; }
    .dot:nth-child(5) { animation-delay: 0.8s; }
    .dot:nth-child(6) { animation-delay: 1.0s; }

    @keyframes stretch {
      0% {
        transform: translateX(calc((var(--index) * 20px) - 100px));
        opacity: 0; /* 淡入 */
      }
      10% { opacity: 1; } /*  完全显示 */
      50% {
        transform: translateX(calc(50vw - 30px + (var(--index) * 0px))); /* 中间聚集，无间隙 */
      }
      70% {
        transform: translateX(calc(50vw - 30px + (var(--index) * 0px)));
      }
      90% { opacity: 1; }
      100% {
        transform: translateX(calc(100vw + (var(--index) * 20px) - 130px));
        opacity: 0; /* 淡出 */
      }
    }
  </style>
</head>
<body>
  <div class="loading-container">
    <div class="dot" style="--index: 0;"></div>
    <div class="dot" style="--index: 1;"></div>
    <div class="dot" style="--index: 2;"></div>
    <div class="dot" style="--index: 3;"></div>
    <div class="dot" style="--index: 4;"></div>
    <div class="dot" style="--index: 5;"></div>
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
