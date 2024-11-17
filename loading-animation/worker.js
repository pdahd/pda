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
      /* 去除 margin，改用 transform 控制间距 */
      animation: stretch 3s infinite ease-in-out;
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .dot:nth-child(4) { animation-delay: 0.6s; }
    .dot:nth-child(5) { animation-delay: 0.8s; }
    .dot:nth-child(6) { animation-delay: 1.0s; }

    @keyframes stretch {
      0% {
        transform: translateX(calc((var(--index) * 20px) - 100px)); /* 初始拉伸状态 */
      }
      50% {
        transform: translateX(calc(50vw - 30px + (var(--index) * 0px))); /* 中间聚集 */
      }
      70% {
        transform: translateX(calc(50vw - 30px + (var(--index) * 0px))); /* 中间停留 */
      }
      100% {
        transform: translateX(calc(100vw + (var(--index) * 20px) - 130px)); /* 拉伸飞出右侧 */
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
  <script>
    // 动态调整中间位置，避免硬编码
    const dots = document.querySelectorAll('.dot');
    const centerPosition = `calc(50vw - ${dots.length * 5}px)`; // 每个点 10px 宽，无间距
    const endPosition = `calc(100vw + ${dots.length * 10}px - 30px)`;

    dots.forEach(dot => {
      dot.style.setProperty('--center-position', centerPosition);
      dot.style.setProperty('--end-position', endPosition);
    });
  </script>
</body>
</html>
`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  })
    }
