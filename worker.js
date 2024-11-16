addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>OpenStreetMap with Cloudflare Workers</title>
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
            .custom-pin {
                width: 15px; /* 缩小圆的直径 */
                height: 15px;
                background-color: #FF0000;
                border-radius: 50%;
                position: absolute;
                transform: translate(-50%, -50%); /* 保证图标中心对准坐标点 */
                box-shadow: 0 0 0 2px white; /* 添加白色边框使圆更明显 */
            }
            .custom-pin::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 15px;
                height: 15px;
                background-color: rgba(255, 0, 0, 0.5);
                border-radius: 50%;
                transform: translate(-50%, -50%) scale(1);
                animation: pulse 2s infinite; /* 添加动画 */
            }
            /* CSS 动画效果 */
            @keyframes pulse {
                0% {
                    transform: translate(-50%, -50%) scale(1);
                    opacity: 1;
                }
                100% {
                    transform: translate(-50%, -50%) scale(2);
                    opacity: 0;
                }
            }
        </style>
    </head>
    <body>
        <input type="text" id="searchBox" placeholder="Enter location">
        <div id="map"></div>
        <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            // 设置地图为世界地图并初始缩放铺满屏幕
            var map = L.map('map').setView([20, 0], 2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);
            
            // 全局变量来跟踪上一个标记
            var previousMarker;

            document.getElementById('searchBox').addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    var location = e.target.value;
                    fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + location)
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                var lat = data[0].lat;
                                var lon = data[0].lon;
                                map.setView([lat, lon], 3); // 调整缩放级别以适应国家视图

                                // 如果存在之前的标记，移除它
                                if (previousMarker) {
                                    map.removeLayer(previousMarker);
                                }

                                // 添加新的红色位置标记并添加地震动画
                                previousMarker = L.marker([lat, lon], {
                                    icon: L.divIcon({
                                        className: 'custom-pin',
                                        iconSize: [15, 15], // 修改图标大小以匹配圆的大小
                                        iconAnchor: [7.5, 7.5] // 修改锚点以匹配圆心位置
                                    })
                                }).addTo(map);
                            } else {
                                alert('Location not found');
                            }
                        });
                }
            });
        </script>
    </body>
    </html>`;

    return new Response(html, {
        headers: { 'content-type': 'text/html' }
    });
                  }
