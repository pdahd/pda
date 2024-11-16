addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenStreetMap with IP and Geocoding</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.css" />
        <style>
            #map {
                height: 100vh; /* Full screen height */
            }
            #searchBox {
                position: absolute;
                top: 10px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
            }
            .pulse-container {
                position: absolute;
                width: 50px;
                height: 50px;
                transform: translate(-50%, -50%); /* 居中对齐 */
                z-index: 0; /* 地震波作为背景 */
            }
            .pulse-circle {
                position: absolute;
                width: 50px;
                height: 50px;
                background-color: rgba(255, 0, 0, 0.7); /* 增加饱和度 */
                border-radius: 50%; /* 圆形 */
                animation: pulse-animation 2s infinite; /* 动画效果 */
            }
            @keyframes pulse-animation {
                0% {
                    transform: scale(1); /* 起始大小 */
                    opacity: 1; /* 完全不透明 */
                }
                100% {
                    transform: scale(3); /* 扩大三倍 */
                    opacity: 0; /* 完全透明 */
                }
            }

            /* 高光遮罩层样式 */
            .highlight-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, 
                   rgba(0, 0, 0, 0) 30%,      /* 中心完全透明 */
                   rgba(0, 0, 0, 0.3) 50%,    /* 过渡至较浅的暗色 */
                   rgba(0, 0, 0, 0.7) 70%,    /* 逐渐变暗 */
                   rgba(0, 0, 0, 0.9) 90%,    /* 更深的暗色 */
                   rgba(0, 0, 0, 1) 100%      /* 完全黑色 */
                );   
                pointer-events: none; /* 不阻挡交互 */
                z-index: 900; /* 覆盖地图但不影响交互 */
                opacity: 0; /* 初始透明 */
                animation: fadeOut 1s ease forwards; /* 默认淡出动画 */
            }
            
            /* 定义遮罩淡入动画 */
            @keyframes fadeIn {
                0% {
                    opacity: 0;
                }
                100% {
                    opacity: 1;
                }
            }

            /* 定义遮罩淡出动画 */
            @keyframes fadeOut {
                0% {
                    opacity: 1;
                }
                100% {
                    opacity: 0;
                }
            }
            
            .highlight-mask.active {
                animation: fadeIn 1s ease forwards; /* 激活时淡入 */
            }
        </style>
    </head>
    <body>
        <input type="text" id="searchBox" placeholder="Enter location or IP address">
        <div id="map"></div>
        <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([20, 0], 2); // 默认世界地图视图
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var previousMarker; // 上一个静态标记
            var previousAnimatedMarker; // 上一个地震波动画容器

            // 添加高光遮罩层
            var highlightMask = document.createElement('div');
            highlightMask.className = 'highlight-mask';
            document.body.appendChild(highlightMask);

            var searchBox = document.getElementById('searchBox');

            // 用户编辑输入框时，淡出遮罩
            searchBox.addEventListener('input', function() {
                highlightMask.classList.remove('active');
            });

            searchBox.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    var input = e.target.value.trim();
                    
                    // 判断输入内容是否是IP地址
                    var ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

                    if (ipPattern.test(input)) {
                        // 输入为IP地址，调用Geolocation-db API
                        fetch('https://geolocation-db.com/json/' + input + '&position=true')
                            .then(response => response.json())
                            .then(data => {
                                var lat = parseFloat(data.latitude);
                                var lon = parseFloat(data.longitude);
                                if (!isNaN(lat) && !isNaN(lon)) {
                                    updateMap(lat, lon, "IP Location: " + input);
                                } else {
                                    alert('Could not locate IP address');
                                }
                            });
                    } else {
                        // 输入为地名，调用Nominatim地理编码API
                        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + input)
                            .then(response => response.json())
                            .then(data => {
                                if (data.length > 0) {
                                    var lat = parseFloat(data[0].lat);
                                    var lon = parseFloat(data[0].lon);
                                    updateMap(lat, lon, "Location: " + input);
                                } else {
                                    alert('Location not found');
                                }
                            });
                    }
                }
            });

            function updateMap(lat, lon, popupText) {
                // 移除之前的标记
                if (previousMarker) {
                    map.removeLayer(previousMarker);
                }
                if (previousAnimatedMarker) {
                    map.removeLayer(previousAnimatedMarker);
                }

                // 添加地震波动画容器
                var pulseDiv = L.divIcon({
                    className: 'pulse-container',
                    html: '<div class="pulse-circle"></div>', // 动态地震波
                    iconSize: [50, 50],
                    iconAnchor: [25, 25] // 锚点居中
                });

                previousAnimatedMarker = L.marker([lat, lon], { icon: pulseDiv, interactive: false }).addTo(map);

                // 添加默认 Leaflet marker 图标，显示在地震波上方
                previousMarker = L.marker([lat, lon], { zIndexOffset: 1000 }) // 提高 z-index
                    .addTo(map)
                    .bindPopup(popupText)
                    .openPopup();
                
                // 修改标记的阴影效果
                previousMarker._icon.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0)';  // 增强标记图标阴影

                // 修改弹出框的阴影效果
                var popup = previousMarker.getPopup().getElement();
                popup.style.boxShadow = '0 6px 15px rgba(0, 0, 0, 0)';  // 增强弹出框阴影
                
                map.flyTo([lat, lon], 5); //执行平移动画
                
                // 激活遮罩层（淡入显示）
                highlightMask.classList.add('active');
            }
        </script>
    </body>
    </html>`;

    return new Response(html, {
        headers: { 'content-type': 'text/html' }
    });
}
