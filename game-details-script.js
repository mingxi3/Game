// 游戏详情页面JavaScript功能

// 全局变量
let currentGame = null;
let currentUser = null;
let isLoggedIn = false;

// 页面初始化
function initGameDetails() {
    console.log('初始化游戏详情页面...');
    
    // 检查用户登录状态
    checkLoginStatus();
    
    // 初始化粒子背景
    initParticles();
    
    // 加载游戏数据
    loadGameData();
    
    // 绑定事件监听器
    bindEventListeners();
}

// 检查用户登录状态
function checkLoginStatus() {
    const loggedInUser = localStorage.getItem('gameforge_logged_in_user');
    isLoggedIn = !!loggedInUser;
    
    if (isLoggedIn) {
        const users = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
        currentUser = users.find(user => user.username === loggedInUser);
    }
    
    // 更新导航栏显示
    updateNavbar();
}

// 更新导航栏显示
function updateNavbar() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (isLoggedIn) {
        if (loginBtn) loginBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'inline-block';
    } else {
        if (loginBtn) loginBtn.style.display = 'inline-block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

// 初始化粒子背景
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: '#00ccff' },
                shape: { type: 'circle' },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#00ccff',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'repulse' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                }
            },
            retina_detect: true
        });
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 退出登录按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // 下载按钮
    const downloadBtn = document.getElementById('downloadBtn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', handleDownload);
    }
    
    // 移动菜单
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
}

// 加载游戏数据
function loadGameData() {
    const urlParams = new URLSearchParams(window.location.search);
    const gameId = parseInt(urlParams.get('id'));
    
    if (!gameId) {
        showError('游戏ID无效');
        return;
    }
    
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    currentGame = games.find(game => game.id === gameId);
    
    if (!currentGame) {
        showError('游戏不存在');
        return;
    }
    
    renderGameDetails();
}

// 渲染游戏详情
function renderGameDetails() {
    if (!currentGame) return;
    
    // 更新游戏标题和基本信息
    document.getElementById('gameTitle').textContent = currentGame.title;
    document.getElementById('gameDeveloper').textContent = currentGame.developer;
    document.getElementById('gameCategory').textContent = currentGame.category || '未分类';
    document.getElementById('gameVersion').textContent = currentGame.version || '1.0.0';
    
    // 更新游戏横幅
    const bannerImage = document.getElementById('gameBannerImage');
    if (bannerImage) {
        bannerImage.src = currentGame.coverImage || 'https://via.placeholder.com/1200x600/0a0a1a/00ccff?text=Game+Banner';
        bannerImage.alt = `${currentGame.title} 横幅`;
    }
    
    // 更新统计数据
    document.getElementById('downloadCount').textContent = currentGame.downloads || 0;
    document.getElementById('rating').textContent = currentGame.rating || '4.5';
    document.getElementById('fileSize').textContent = currentGame.fileSize || '500 MB';
    
    // 更新游戏描述
    document.getElementById('gameDescription').textContent = currentGame.fullDescription || currentGame.description || '暂无详细描述';
    
    // 更新游戏信息卡片
    document.getElementById('releaseDate').textContent = currentGame.releaseDate || '2024-01-01';
    document.getElementById('updateDate').textContent = currentGame.updateDate || currentGame.releaseDate || '2024-01-01';
    document.getElementById('versionNumber').textContent = currentGame.version || '1.0.0';
    document.getElementById('fileSizeInfo').textContent = currentGame.fileSize || '500 MB';
    document.getElementById('platforms').textContent = currentGame.platforms || 'Windows, macOS, Linux';
    
    // 更新开发者信息
    document.getElementById('devName').textContent = currentGame.developer;
    document.getElementById('devDescription').textContent = `由 ${currentGame.developer} 开发的精彩游戏`;
    
    const devAvatar = document.getElementById('devAvatar');
    if (devAvatar) {
        devAvatar.textContent = currentGame.developer.charAt(0).toUpperCase();
    }
    
    // 渲染游戏截图
    renderScreenshots();
    
    // 更新下载按钮状态
    updateDownloadButton();
}

// 渲染游戏截图
function renderScreenshots() {
    const screenshotsGrid = document.getElementById('screenshotsGrid');
    if (!screenshotsGrid) return;
    
    // 使用默认截图或游戏提供的截图
    const screenshots = currentGame.screenshots || [
        'https://via.placeholder.com/400x300/0a0a1a/00ccff?text=Screenshot+1',
        'https://via.placeholder.com/400x300/0a0a1a/00ccff?text=Screenshot+2',
        'https://via.placeholder.com/400x300/0a0a1a/00ccff?text=Screenshot+3',
        'https://via.placeholder.com/400x300/0a0a1a/00ccff?text=Screenshot+4'
    ];
    
    screenshotsGrid.innerHTML = screenshots.map((screenshot, index) => `
        <div class="screenshot-item" onclick="openScreenshot('${screenshot}')">
            <img src="${screenshot}" alt="游戏截图 ${index + 1}" loading="lazy">
        </div>
    `).join('');
}

// 更新下载按钮状态
function updateDownloadButton() {
    const downloadBtn = document.getElementById('downloadBtn');
    const downloadNote = document.querySelector('.download-note');
    
    if (!downloadBtn || !downloadNote) return;
    
    if (isLoggedIn) {
        downloadBtn.disabled = false;
        downloadBtn.style.opacity = '1';
        downloadBtn.style.cursor = 'pointer';
        downloadNote.style.display = 'none';
    } else {
        downloadBtn.disabled = true;
        downloadBtn.style.opacity = '0.5';
        downloadBtn.style.cursor = 'not-allowed';
        downloadNote.style.display = 'block';
    }
}

// 处理下载
function handleDownload() {
    if (!isLoggedIn) {
        // 未登录，跳转到登录页
        window.location.href = `auth.html?redirect=game-details.html?id=${currentGame.id}`;
        return;
    }
    
    if (!currentGame) {
        showNotification('游戏信息无效', 'error');
        return;
    }
    
    // 模拟下载过程
    simulateDownload();
}

// 模拟下载过程
function simulateDownload() {
    const downloadBtn = document.getElementById('downloadBtn');
    const originalText = downloadBtn.querySelector('.btn-text').textContent;
    
    // 开始下载动画
    downloadBtn.disabled = true;
    downloadBtn.querySelector('.btn-text').textContent = '下载中...';
    
    // 记录下载
    recordDownload();
    
    // 模拟下载完成
    setTimeout(() => {
        downloadBtn.disabled = false;
        downloadBtn.querySelector('.btn-text').textContent = originalText;
        showNotification(`开始下载 ${currentGame.title}`, 'success');
        
        // 模拟文件下载（实际项目中这里会触发真实的文件下载）
        const downloadUrl = currentGame.downloadUrl || '#';
        if (downloadUrl !== '#') {
            window.open(downloadUrl, '_blank');
        }
    }, 2000);
}

// 记录下载记录
function recordDownload() {
    const downloads = JSON.parse(localStorage.getItem('gameforge_downloads') || '[]');
    
    // 检查是否已经下载过
    const existingDownload = downloads.find(
        download => download.username === currentUser.username && download.gameId === currentGame.id
    );
    
    if (!existingDownload) {
        downloads.push({
            username: currentUser.username,
            gameId: currentGame.id,
            gameTitle: currentGame.title,
            downloadDate: new Date().toISOString()
        });
        
        localStorage.setItem('gameforge_downloads', JSON.stringify(downloads));
        
        // 更新游戏下载计数
        updateGameDownloadCount();
    }
}

// 更新游戏下载计数
function updateGameDownloadCount() {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const gameIndex = games.findIndex(game => game.id === currentGame.id);
    
    if (gameIndex !== -1) {
        games[gameIndex].downloads = (games[gameIndex].downloads || 0) + 1;
        localStorage.setItem('gameforge_games', JSON.stringify(games));
        
        // 更新页面显示
        document.getElementById('downloadCount').textContent = games[gameIndex].downloads;
    }
}

// 处理退出登录
function handleLogout() {
    // 清除所有登录相关数据，确保完全退出
    localStorage.removeItem('gameforge_logged_in_user'); // 清除统一登录标识
    localStorage.removeItem('currentUser');              // 清除当前用户信息
    
    // 重置登录状态
    isLoggedIn = false;
    currentUser = null;
    
    // 更新导航栏
    updateNavbar();
    
    // 更新下载按钮
    updateDownloadButton();
    
    showNotification('已退出登录', 'info');
}

// 打开截图查看
function openScreenshot(screenshotUrl) {
    // 创建模态框显示大图
    const modal = document.createElement('div');
    modal.className = 'screenshot-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = screenshotUrl;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 10px;
        box-shadow: 0 0 30px rgba(0, 204, 255, 0.5);
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    // 点击关闭
    modal.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

// 显示错误信息
function showError(message) {
    const main = document.querySelector('.game-details-main');
    if (main) {
        main.innerHTML = `
            <div class="error-state">
                <h2>错误</h2>
                <p>${message}</p>
                <a href="games.html">返回游戏库</a>
            </div>
        `;
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 2rem;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        animation: slideInRight 0.3s ease-out;
    `;
    
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #00ff4c, #00cc6a)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff4757, #ff3742)';
            break;
        case 'info':
            notification.style.background = 'linear-gradient(45deg, #00ccff, #0099ff)';
            break;
    }
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画
const detailsStyle = document.createElement('style');
detailsStyle.id = 'details-notification-style';
if (!document.getElementById('details-notification-style')) {
    detailsStyle.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        }
        .notification-success {
            background: linear-gradient(45deg, #00ff4c, #00cc6a);
        }
        .notification-error {
            background: linear-gradient(45deg, #ff4757, #ff3742);
        }
        .notification-info {
            background: linear-gradient(45deg, #00ccff, #0099ff);
        }
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(detailsStyle);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initGameDetails);