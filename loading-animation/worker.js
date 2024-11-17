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
  <title>Heartbeat Animation</title>
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

    .heartbeat {
      width: 100px;
      height: 100px;
      position: relative;
      animation: heartbeat 1.5s ease-in-out infinite;
    }

    .heartbeat:before, .heartbeat:after {
      content: "";
      position: absolute;
      width: 100px;
      height: 100px;
      border-radius: 50%;
      background-color: #e74c3c;
    }

    .heartbeat:before {
      left: 0;
      top: -50px;
    }

    .heartbeat:after {
      right: 0;
      top: -50px;
    }

    @keyframes heartbeat {
      0%, 100% {
        transform: scale(1); /* 正常大小 */
      }
      25% {
        transform: scale(1.1); /* 略微放大 */
      }
      50% {
        transform: scale(1.3); /* 最大放大，模拟心跳的峰值 */
      }
      75% {
        transform: scale(1.1); /* 略微缩小 */
      }
    }
  </style>
</head>
<body>
  <div class="heartbeat"></div>
</body>
</html>
`;

  return new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  });
}
