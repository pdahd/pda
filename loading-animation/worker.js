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
    .loading-container {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100px;
      margin: 50px auto;
    }

    .dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #3498db;
      margin: 0 5px;
      animation: slide 1.5s infinite linear;
    }

    .dot:nth-child(2) {
      animation-delay: 0.25s;
    }

    .dot:nth-child(3) {
      animation-delay: 0.5s;
    }

    @keyframes slide {
      0% { transform: translateX(0); }
      50% { transform: translateX(20px); }
      100% { transform: translateX(0); }
    }
  </style>
</head>
<body>
  <div class="loading-container">
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
  })
}
