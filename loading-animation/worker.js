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
        <!-- 加载 Google 字体 -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Bungee+Outline&display=swap" rel="stylesheet">
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

            /* 地震波动画样式 */
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
                background-color: rgba(255, 0, 0, 0.8); /* 增加饱和度 */
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
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background-color: #FF5800;
                margin: 0 5px;
                animation: wave 1.5s ease-in-out infinite;
                box-shadow: 0 0 4px rgba(0, 0, 0, 0.7); /* 添加阴影 */
                border: 1px solid rgba(0, 0, 0, 0.5); /* 外边框增加深色轮廓 */
            }

            /* 设置每个点的延迟，创建波浪效果 */
            .dot:nth-child(1) { animation-delay: 0s; }
            .dot:nth-child(2) { animation-delay: 0.2s; }
            .dot:nth-child(3) { animation-delay: 0.4s; }
            .dot:nth-child(4) { animation-delay: 0.6s; }
            .dot:nth-child(5) { animation-delay: 0.8s; }

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
                    rgba(0, 0, 0, 0) 50%,      
                    rgba(0, 0, 0, 0.2) 60%,    
                    rgba(0, 0, 0, 0.5) 70%,    
                    rgba(0, 0, 0, 0.75) 85%,   
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
                animation: fadeIn 2s ease forwards;
            }

            /* 包裹名称和说明的整体容器 */
            #projectContainer {
                position: fixed;
                left: 10px;
                bottom: 10px;
                z-index: 1000;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                height: 28px; /* 设置容器的高度 */
                line-height: 28px; /* 确保上下居中 */
                background: rgba(50, 50, 50, 0.7); /* 半透明深灰色背景 */
                padding: 4px; /* 微调内边距 */
                border-radius: 8px; /* 圆角背景 */
                border: 2px solid rgba(255, 255, 255, 0.3);
                box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8), inset 1px 1px 4px rgba(255, 255, 255, 0.1);
                box-sizing: border-box;
            }
            /* 项目标题 MapMyIP */
            #projectName {
                font-family: 'Bungee Outline', sans-serif;
                font-size: 24px;
                color: #f5f5f5; /* 浅灰白色，适配深浅背景 */
                text-shadow: 3px 3px 4px rgba(0, 0, 0, 0.8), /* 深色阴影增强深色背景可读性 */
                             -1px -1px 2px rgba(255, 255, 255, 0.5); /* 浅色阴影适配浅色背景 */
            }
            /* 副标题 你的IP地图 */
            #projectSubtitle {
                font-size: 16px;
                font-family: sans-serif;
                color: #dcdcdc; /* 浅灰色文字，清晰但不抢眼 */
                text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.6); /* 增强可读性 */
                margin-left: 5px; /* 缩小间距，紧贴主标题 */
            }
        </style>
    </head>
    <body>
        <input type="text" id="searchBox" placeholder="输入IP或位置并敲回车键定位">
        <div class="loading-container" id="loadingAnimation">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
        <div id="map"></div>
        <div id="projectContainer">
            <div id="projectName">MapMyIP</div>
            <div id="projectSubtitle">你的IP地图</div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/leaflet@1.7.1/dist/leaflet.js"></script>
        <script>
            var map = L.map('map').setView([20, 0], 8); // 默认国家地图视图
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            var previousMarker;
            var previousAnimatedMarker;
            var searchBox = document.getElementById('searchBox');
            var loadingAnimation = document.getElementById('loadingAnimation');
            
            // 通用弹出框生成函数
            function generatePopupContent(title, data, lat, lon) {
                
                var flagUrl = data.country 
                    ? "https://flagcdn.com/" + data.country.toLowerCase() + ".svg"
                    : null;
                
                return (
                    "<div style='background-color: #f0f0f0; padding: 15px; border-radius: 5px; border: 2px solid #ddd; " + 
                    "box-shadow: inset -5px -5px 10px rgba(0, 0, 0, 0.2);'>" + // 去掉倾斜，保持内容平直
                    "<strong style='color: " + (title === "这是您当前的 IP 地址定位信息:" ? "#00693E" : "#000000") + ";'>" + title + "</strong><br>" + // 标题颜色和加粗
                    "IP 地址: " + (data.ip || "未知") + "<br>" +
                    "城市: " + (data.city || "未知") + "<br>" +
                    "区域: " + (data.region || "未知") + "<br>" +
                    "国家: " + (data.country || "未知") + 
                    (flagUrl ? " <img src='" + flagUrl + "' alt='Flag of " + (data.country || "Unknown") + "' width='20' style='vertical-align:middle;'>" : "") + "<br>" +
                    "ISP: " + (data.org || "未知") + "<br>" +
                    "时区: " + (data.timezone || "未知") + "<br>" +
                    "经纬度: " + (lat || "未知") + ", " + (lon || "未知")
                );
            }
            
            // 自动检测用户 IP 并定位
            loadingAnimation.style.display = 'flex';
            fetch('https://ipinfo.io?token=8f72f481863e3d') // 替换为你的 token
                .then(response => response.json())
                .then(data => {
                    if (data.loc) {
                        var [lat, lon] = data.loc.split(',').map(coord => parseFloat(coord)); // 提取经纬度
                        var popupText = generatePopupContent(
                            "这是您当前的 IP 地址定位信息:",
                            data, 
                            lat, 
                            lon
                        );
                        updateMap(lat, lon, popupText); 
                    } else {
                        alert('Could not detect your location automatically');
                    }
                })
                .catch(error => {
                    console.error('Error detecting user location:', error);
                    alert('Error detecting your location');
                });
            
            var highlightMask = document.createElement('div');
            highlightMask.className = 'highlight-mask';
            document.body.appendChild(highlightMask);

            // 用户编辑输入框时，淡出遮罩
            searchBox.addEventListener('input', function() {
                highlightMask.classList.remove('active');
            });

            searchBox.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    var input = e.target.value.trim();
                    
                    // 启动加载动画
                    loadingAnimation.style.display = 'flex';
                    
                    var ipPattern = /^(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)\\.(25[0-5]|2[0-4][0-9]|[0-1]?[0-9][0-9]?)$/;

                    if (ipPattern.test(input)) {
                        fetch('https://ipinfo.io/' + input + '?token=8f72f481863e3d') // 用你自己的 token
                            .then(response => response.json())
                            .then(data => {
                                if (data.loc) {
                                    var [lat, lon] = data.loc.split(',').map(coord => parseFloat(coord)); // 提取经纬度
                                    var popupText = generatePopupContent(
                                        "这是您输入的 IP 地址定位信息:",
                                        data, 
                                        lat, 
                                        lon
                                    );
                                    updateMap(lat, lon, popupText);
                                } else {
                                    alert('Could not locate IP address');
                                }
                             })
                             .catch(error => {
                                 console.error('Error fetching IP location:', error);
                                 alert('Error fetching IP location');
                             });
                    } else {
                        fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + input)
                            .then(response => response.json())
                            .then(data => {
                                if (data.length > 0) {
                                    var lat = parseFloat(data[0].lat);
                                    var lon = parseFloat(data[0].lon);
                                   
                                    updateMap(lat, lon, "位置: " + input);
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

                map.panTo([lat, lon]);

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
