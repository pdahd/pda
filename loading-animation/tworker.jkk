addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const { method, url } = request;

  // 处理OPTIONS请求
  if (method === 'OPTIONS') {
    return new Response(null);
  }

  // 如果是GET请求，返回index.html
  if (method === 'GET') {
    return new Response(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>𝕏AI</title>
    <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/default.min.css">
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/highlight.min.js"></script>
    <script>hljs.highlightAll();</script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/languages/shell.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/marked/4.0.1/marked.min.js"></script>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            height: 100vh;
            background-color: #e0e0e0;
            background-image: linear-gradient(to bottom, #e0e0e0, #d0d0d0);
        }
        #chat-container {
            flex: 1;
            overflow-y: auto;
            padding: 20px 25px;
            background-color: white;
            word-wrap: break-word;
        }
        #message {
            width: calc(100% - 60px);
            padding: 5px;
            resize: vertical;
            min-height: 30px;
            max-height: 200px;
            border: 1px solid #ccc;
            border-radius: 4px;
            background-color: #f8f8f8;
        }
        #send-button {
            padding: 5px 10px;
            margin-left: 5px;
            background-color: #0077cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
        }
        .input-container {
            display: flex;
            padding: 10px;
            background-color: #e6e6e6;
            position: sticky;
            bottom: 0;
        }
        h1 {
            position: absolute;
            top: 10px;
            right: 15px;
            margin: 0;
            color: #333;
            font-size: 24px;
            z-index: 1000;
        }
        /* 调整Markdown样式 */
        #chat-container p, #chat-container li {
            font-size: 14px;
            line-height: 1.3;
            word-break: break-word;
            overflow-wrap: break-word;
        }
        #chat-container ul, #chat-container ol {
            margin-left: 20px;
            padding-left: 20px;
        }
        #chat-container li {
            margin-bottom: 5px;
        }
        #chat-container h1, #chat-container h2, #chat-container h3 {
            margin-top: 10px;
            margin-bottom: 10px;
        }
        /* 自定义关键词样式 */
        #chat-container code:not(.hljs) {
            color: #0077cc;
            font-size: 14px;
            font-weight: normal;
            display: inline-block;
            max-width: 100%;
            overflow-x: auto;
            vertical-align: middle;
            line-height: 1.3;
            padding: 0;
            background-color: transparent;
        }
        /* 代码块样式 */
        #chat-container pre {
            white-space: pre;
            overflow-x: auto;
            border: none;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            background-color: #f5f5f5;
            margin-top: 0;
        }
        /* 调整代码块内部的代码样式 */
        #chat-container pre code {
            display: block;
            padding: 10px;
            background-color: #f5f5f5;
            color: #000;
            font-family: 'Courier New', monospace;
        }
        /* 代码块表头样式 */
        .code-header {
            background: #ff0000;
            color: white;
            padding: 5px 10px;
            border-top-left-radius: 5px;
            border-top-right-radius: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: inset 0 1px 0 rgba(255,255,255,0.2), inset 0 -1px 0 rgba(0,0,0,0.2);
        }
        .copy-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 2px 6px;
            border-radius: 3px;
            cursor: pointer;
            font-size: 12px;
        }
        /* 用户发送的文字信息背景 */
        #chat-container p strong {
            background-color: transparent;
            padding: 0;
            border-radius: 0;
        }
    </style>
</head>
<body>
    <h1>𝕏</h1>
    <div id="chat-container"></div>
    <div class="input-container">
        <textarea id="message" placeholder="Type your message here" rows="3"></textarea>
        <button id="send-button" onclick="sendMessage()">Send</button>
    </div>

    <script>
        async function sendMessage() {
            const message = document.getElementById('message').value;
            if (!message) return;

            const chatContainer = document.getElementById('chat-container');
            const newMessage = document.createElement('p');
            newMessage.innerHTML = '<strong>🤡:</strong> ' + message;
            chatContainer.appendChild(newMessage);

            // 使用 scrollIntoView 方法确保新消息在视口中可见
            newMessage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });

            try {
                const response = await fetch('/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: message })
                });

                if (!response.ok) {
                    throw new Error('HTTP error! status: ' + response.status);
                }

                const aiResponse = await response.text();
                // 使用marked.js解析Markdown
                let processedResponse = marked.parse(aiResponse);
                
                // 处理代码块并添加表头
                processedResponse = processedResponse.replace(/<pre><code class="language-([^\s]+)">/g, '<pre><div class="code-header"><span>$1</span><button class="copy-btn" onclick="copyCode(this)">Copy</button></div><code class="language-$1 hljs">');
                
                const aiMessage = document.createElement('p');
                aiMessage.innerHTML = '<strong>Grok:</strong>';
                const aiMessageContent = document.createElement('div');
                aiMessageContent.innerHTML = processedResponse;
                aiMessage.appendChild(aiMessageContent);
                chatContainer.appendChild(aiMessage);
                
                // 确保聊天区域滚动到底部
                chatContainer.scrollTop = chatContainer.scrollHeight;
                
                // 触发highlight.js来高亮代码
                hljs.highlightAll();
            } catch (error) {
                const errorMessage = document.createElement('p');
                errorMessage.innerHTML = '<strong>Error:</strong> ' + error.message;
                chatContainer.appendChild(errorMessage);
                // 确保聊天区域滚动到底部
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }

            document.getElementById('message').value = ''; // 清空输入框
        }

        function copyCode(button) {
            const pre = button.closest('pre');
            const codeBlock = pre.querySelector('code');
            const code = codeBlock.textContent;
            navigator.clipboard.writeText(code).then(() => {
                button.textContent = 'Copied!';
                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 1000);
            }).catch(err => {
                console.error('Failed to copy: ', err);
            });
        }
    </script>
</body>
</html>`, {
      headers: { 'Content-Type': 'text/html' }
    });
  }

  // 如果是POST请求，处理聊天逻辑
  if (method === 'POST') {
    const body = await request.json();
    if (!body.message) {
      return new Response(JSON.stringify({ error: "Message is required" }), { status: 400 });
    }

    // 这里使用x.ai的API密钥
    const apiKey = 'xai-wRCptaYtRq8mYntFYF7UTwMCN7TOjJZZ34pnnCPtWVFWf4cKhcxAsLCwNVOUmptinRU0ieoT27WZMP0U';
    
    // 发送请求到x.ai API
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "grok-beta",
        messages: [{ role: "user", content: body.message }],
      })
    });

    const result = await response.json();
    
    // 检查API响应是否成功
    if (response.ok) {
      // 只返回AI的回答文本
      const aiResponse = result.choices[0].message.content;
      return new Response(aiResponse, {
        headers: { 'Content-Type': 'text/plain' }
      });
    } else {
      // 如果API返回错误，返回错误信息
      return new Response(JSON.stringify({ error: result.error }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } else {
    // 如果不是GET或POST请求，返回一个简单的HTML页面或错误信息
    return new Response('Please send a GET request for the page or a POST request with a message.', { status: 405 });
  }
}
