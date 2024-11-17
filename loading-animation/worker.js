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
    }

    .dot:nth-child(2) { animation-delay: 0.2s; }
    .dot:nth-child(3) { animation-delay: 0.4s; }
    .dot:nth-child(4) { animation-delay: 0.6s; }
    .dot:nth-child(5) { animation-delay: 0.8s; }
    .dot:nth-child(6) { animation-delay: 1.0s; }

    @keyframes stretch {
      0% {
        transform: translateX(calc((var(--index) * var(--dot-spacing))); /* 初始分散 */
      }
      50% {
        transform: translateX(calc(50vw - var(--total-width) / 2 + var(--index) * 10px)); /* 中间对齐，无缝隙 */
      }
      70% {
        transform: translateX(calc(50vw - var(--total-width) / 2 + var(--index) * 10px)); /* 中间停留 */
      }
      100% {
        transform: translateX(calc(100vw + (var(--index) * var(--dot-spacing)) - var(--total-width) - var(--dot-spacing))); /* 向右分散 */
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
    const dots = document.querySelectorAll('.dot');
    const dotSpacing = 20; // 点与点之间的间距
    const totalWidth = dots.length * 10; // 所有点的总宽度

    dots.forEach(dot => {
      dot.style.setProperty('--dot-spacing', dotSpacing + 'px');
      dot.style.setProperty('--total-width', totalWidth + 'px');
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
