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

            /* 加载动画样式 - 波浪动画 */
            .loading-container {
                position: absolute;
                top: 50px;
                left: 50%;
                transform: translateX(-50%);
                display: none;
                z-index: 1000;
                text-align: center;
            }

            .dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #e74c3c;
                margin: 0 5px;
                animation: wave 1.5s ease-in-out infinite;
            }

            /* 设置每个点的延迟，创建波浪效果 */
            .dot:nth-child(1) { animation-delay: 0s; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            .dot:nth-child(4) { animation-delay: 0.6s; }

            @keyframes wave {
                0% { transform: scale(1); opacity: 0.3; }
                50% { transform: scale(1.4); opacity: 1; }
                100% { transform: scale(1); opacity: 0.3; }
            }

            /* 高光遮罩层样式 */
            .highlight-mask {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle, 
                   rgba(0, 0, 0, 0) 30%,      
                   rgba(0, 0, 0, 0.3) 50%,    
                   rgba(0, 0, 0, 0.7) 70%,    
                   rgba(0, 0, 0, 0.9) 90%,    
                   rgba(0, 0, 0, 1) 100%      
                );   
                pointer-events: none;
                z-index: 900;
                opacity: 0;
                animation: fadeOut 1s ease forwards;
            }

            @keyframes fadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }

            @keyframes fadeOut {
                0% { opacity: 1; }
                100% { opacity: 0; }
            }

            .highlight-mask.active {
                animation: fadeIn 1s ease forwards;
            }
        </style>
    </head>
    <body>
        <input type="text" id="searchBox" placeholder="Enter location or IP address">
        <div class="loading-container" id="loadingAnimation">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div id="map"></div>
        <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([20, 0], 2); // 默认世界地图视图
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var previousMarker;
            var previousAnimatedMarker;
            var highlightMask = document.createElement('div');
            highlightMask.className = 'highlight-mask';
            document.body.appendChild(highlightMask);

            var searchBox = document.getElementById('searchBox');
            var loadingAnimation = document.getElementById('loadingAnimation');

            searchBox.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    var input = e.target.value.trim();
                    
                    // 启动加载动画
                    loadingAnimation.style.display = 'flex';
                    
                    var ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

                    if (ipPattern.test(input)) {
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
                if (previousMarker) {
                    map.removeLayer(previousMarker);
                }
                if (previousAnimatedMarker) {
                    map.removeLayer(previousAnimatedMarker);
                }

                var pulseDiv = L.divIcon({
                    className: 'pulse-container',
                    html: '<div class="pulse-circle"></div>',
                    iconSize: [50, 50],
                    iconAnchor: [25, 25]
                });

                previousAnimatedMarker = L.marker([lat, lon], { icon: pulseDiv, interactive: false }).addTo(map);

                previousMarker = L.marker([lat, lon], { zIndexOffset: 1000 })
                    .addTo(map)
                    .bindPopup(popupText)
                    .openPopup();
                
                map.flyTo([lat, lon], 5); // 执行平移动画

                // 停止加载动画
                loadingAnimation.style.display = 'none';

                highlightMask.classList.add('active');
            }
        </script>
    </body>
    </html>`;

    return new Response(html, {
        headers: { 'content-type': 'text/html' }
    });
}
