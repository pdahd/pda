addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <!-- ... (其他部分不变) -->
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
    // **修正：移除 calc() 周围的 `` 和 ${}**
    const dots = document.querySelectorAll('.dot');
    const centerPosition = 'calc(50vw - ' + (dots.length * 5) + 'px)';
    const endPosition = 'calc(100vw + ' + (dots.length * 10) + 'px - 30px)';

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
