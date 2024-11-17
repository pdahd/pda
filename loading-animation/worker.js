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
      height: 100vh;
      width: 100vw;
      position: relative; /* 允许绝对定位子元素 */
    }
    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      position: absolute; /* 绝对定位 */
      left: 0; /* 初始位置 */
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
  <script>
    const dots = document.querySelectorAll('.dot');
    const containerWidth = document.querySelector('.loading-container').offsetWidth;
    const midPoint = containerWidth / 2;
    const numDots = dots.length;
    const spacing = 20; // 圆点间距

    function animateDots(start, end, duration, delay) {
      let startTime = null;

      function animate(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const easedProgress = easeInOutElastic(progress); // 使用弹性缓动函数

        for (let i = 0; i < numDots; i++) {
          const offset = i * spacing;
          const x = start + (end - start) * easedProgress + offset;
          dots[i].style.transform = \`translateX(\${x}px)\`;
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            animateDots(end, end > midPoint ? containerWidth : 0, duration, delay); // 反向动画
          }, delay);
        }
      }

      requestAnimationFrame(animate);
    }

    // 弹性缓动函数 (easeInOutElastic)
    function easeInOutElastic(t) {
      const c5 = (2 * Math.PI) / 4.5;
      return t === 0
        ? 0
        : t === 1
        ? 1
        : t < 0.5
        ? -(Math.pow(2, 20 * t - 10) * Math.sin((20 * t - 11.125) * c5)) / 2
        : (Math.pow(2, -20 * t + 10) * Math.sin((20 * t - 11.125) * c5)) / 2 + 1;
    }

    animateDots(0, midPoint, 1000, 500); // 初始动画，从左边到中间
  </script>
</body>
</html>
`;

  return new Response(html, { headers: { 'content-type': 'text/html;charset=UTF-8' } });
}
