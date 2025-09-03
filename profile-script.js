// 个人中心页面JavaScript功能

// 全局变量和状态管理
let currentUser = null;
let isDeveloper = false;
let userGames = [];
let downloadedGames = [];

// 页面初始化
function initProfile() {
    console.log('初始化个人中心页面...');
    
    // 防重定向保护：检查是否已经在处理中
    if (window.location.href.includes('profile.html') && 
        !window.location.href.includes('auth.html')) {
        // 检查用户登录状态
        checkLoginStatus();
        
        // 初始化粒子背景
        initParticles();
        
        // 绑定事件监听器
        bindEventListeners();
        
        // 加载用户数据
        loadUserData();
    }
}

// 检查用户登录状态 - 完全重写的防重定向逻辑
function checkLoginStatus() {
    // 关键：防止重复执行，添加会话锁
    if (window._loginCheckRunning) {
        console.log('登录检查已在进行中，跳过...');
        return;
    }
    window._loginCheckRunning = true;
    
    // 检查URL参数，避免循环重定向
    const urlParams = new URLSearchParams(window.location.search);
    const redirectFrom = urlParams.get('redirect');
    
    // 如果刚刚从登录页跳转过来，不重复检查
    if (redirectFrom === 'profile.html') {
        console.log('刚从登录页跳转，跳过检查');
        // 清理URL参数，防止刷新时再次触发
        window.history.replaceState({}, document.title, '/profile.html');
        window._loginCheckRunning = false;
        return;
    }
    
    // 获取登录状态
    const users = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
    const loggedInUser = localStorage.getItem('gameforge_logged_in_user');
    
    console.log('=== 登录状态检查 ===');
    console.log('存储的用户列表:', users);
    console.log('当前登录用户:', loggedInUser);
    
    // 检查多种可能的登录状态存储格式
    let isLoggedIn = false;
    let validUser = null;
    
    if (loggedInUser) {
        // 尝试从用户列表中找到匹配用户
        validUser = users.find(user => 
            user.username === loggedInUser || 
            user.username === (typeof loggedInUser === 'string' ? loggedInUser : loggedInUser.username)
        );
        
        if (validUser) {
            isLoggedIn = true;
            console.log('找到有效用户:', validUser.username);
        } else {
            console.log('登录用户不存在于用户列表中');
        }
    }
    
    // 检查另一种可能的登录存储格式
    if (!isLoggedIn) {
        const currentUserData = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (currentUserData && currentUserData.username) {
            validUser = users.find(user => user.username === currentUserData.username);
            if (validUser) {
                isLoggedIn = true;
                console.log('从currentUser找到有效用户:', validUser.username);
                // 同步登录状态
                localStorage.setItem('gameforge_logged_in_user', validUser.username);
            }
        }
    }
    
    if (!isLoggedIn) {
        console.log('未找到有效登录状态，准备重定向');
        // 添加标记，避免循环
        const redirectUrl = 'auth.html?from=profile&timestamp=' + Date.now();
        
        // 使用更安全的重定向方式
        setTimeout(() => {
            if (!window._redirectExecuted) {
                window._redirectExecuted = true;
                console.log('执行重定向到:', redirectUrl);
                window.location.href = redirectUrl;
            }
        }, 200);
        
        return;
    }
    
    // 成功找到用户
    currentUser = validUser;
    isDeveloper = currentUser.isDeveloper || false;
    
    console.log('✅ 登录验证成功:', {
        username: currentUser.username,
        email: currentUser.email,
        isDeveloper: isDeveloper
    });
    
    // 释放锁
    setTimeout(() => {
        window._loginCheckRunning = false;
    }, 1000);
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
    // 编辑资料按钮
    const editBtn = document.querySelector('.btn-edit');
    if (editBtn) {
        editBtn.addEventListener('click', openEditModal);
    }
    
    // 关闭模态框按钮
    const closeBtn = document.querySelector('.close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeEditModal);
    }
    
    // 模态框背景点击关闭
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeEditModal();
            }
        });
    }
    
    // 编辑资料表单提交
    const editForm = document.getElementById('edit-form');
    if (editForm) {
        editForm.addEventListener('submit', handleProfileEdit);
    }
    
    // 取消按钮
    const cancelBtn = document.querySelector('.btn-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', closeEditModal);
    }
}

// 加载用户数据 - 添加安全DOM操作
function loadUserData() {
    // 更新用户信息显示
    updateUserInfo();
    
    // 加载用户游戏数据
    loadUserGames();
    
    // 加载下载的游戏
    loadDownloadedGames();
    
    // 更新开发者面板（如果是开发者）
    if (isDeveloper) {
        updateDeveloperPanel();
    }
}

// 安全设置文本内容的辅助函数
function safeSetTextContent(elementId, text) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = text;
    } else {
        console.warn(`元素 ${elementId} 未找到`);
    }
}

// 安全设置innerHTML的辅助函数
function safeSetInnerHTML(elementId, html) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = html;
    } else {
        console.warn(`元素 ${elementId} 未找到`);
    }
}

// 更新用户信息显示
function updateUserInfo() {
    if (!currentUser) return;
    
    // 更新头像和用户名 - 使用正确的元素ID
    const avatar = document.querySelector('.user-avatar .avatar-icon');
    const username = document.getElementById('username');
    const email = document.getElementById('user-email');
    
    if (avatar) {
        avatar.textContent = currentUser.username.charAt(0).toUpperCase();
    }
    if (username) {
        username.textContent = currentUser.username;
    }
    if (email) {
        email.textContent = currentUser.email;
    }
    
    // 更新统计数据
    updateUserStats();
    
    // 更新开发者按钮状态
    updateDeveloperButton();
}

// 更新用户统计数据
function updateUserStats() {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const downloads = JSON.parse(localStorage.getItem('gameforge_downloads') || '[]');
    
    // 计算用户下载的游戏数量
    const userDownloads = downloads.filter(download => download.username === currentUser.username);
    
    // 计算用户上传的游戏数量（如果是开发者）
    const userUploads = isDeveloper ? games.filter(game => game.developer === currentUser.username) : [];
    
    // 更新统计显示 - 使用正确的元素ID
    const downloadedCount = document.getElementById('downloaded-count');
    const uploadedCount = document.getElementById('uploaded-count');
    const joinDate = document.getElementById('join-date');
    
    if (downloadedCount) {
        downloadedCount.textContent = userDownloads.length;
    }
    if (uploadedCount) {
        uploadedCount.textContent = userUploads.length;
    }
    if (joinDate) {
        joinDate.textContent = currentUser.joinDate || new Date().toISOString().split('T')[0];
    }
}

// 更新开发者按钮状态和视图切换
function updateDeveloperButton() {
    const devBtn = document.getElementById('developer-btn');
    const playerSection = document.getElementById('player-section');
    const developerSection = document.getElementById('developer-section');
    
    if (isDeveloper) {
        // 已经是开发者，隐藏申请按钮
        if (devBtn) {
            devBtn.style.display = 'none';
        }
        
        // 显示开发者视图
        if (developerSection) {
            developerSection.style.display = 'block';
        }
        if (playerSection) {
            playerSection.style.display = 'block';
        }
        
        // 更新开发者统计数据
        updateDeveloperStats();
    } else {
        // 显示申请成为开发者按钮
        if (devBtn) {
            devBtn.textContent = '申请成为开发者';
            devBtn.style.display = 'inline-block';
            devBtn.onclick = handleDeveloperApplication;
        }
        
        // 隐藏开发者视图，只显示玩家视图
        if (developerSection) {
            developerSection.style.display = 'none';
        }
        if (playerSection) {
            playerSection.style.display = 'block';
        }
    }
}

// 加载用户游戏数据（开发者）
function loadUserGames() {
    if (!isDeveloper) return;
    
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    userGames = games.filter(game => game.developer === currentUser.username);
    
    renderUserGames();
}

// 加载下载的游戏（玩家）
function loadDownloadedGames() {
    const downloads = JSON.parse(localStorage.getItem('gameforge_downloads') || '[]');
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    
    // 获取用户下载的游戏ID列表
    const userDownloads = downloads.filter(download => download.username === currentUser.username);
    
    // 根据ID获取游戏详情
    downloadedGames = userDownloads.map(download => 
        games.find(game => game.id === download.gameId)
    ).filter(game => game); // 过滤掉未找到的游戏
    
    renderDownloadedGames();
}

// 渲染用户上传的游戏
function renderUserGames() {
    const container = document.getElementById('uploaded-games');
    const emptyState = document.getElementById('empty-uploaded');
    
    if (!container) return;
    
    if (userGames.length === 0) {
        container.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // 隐藏空状态，显示游戏列表
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    container.style.display = 'grid';
    
    safeSetInnerHTML('uploaded-games', userGames.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-cover">
                <img src="${game.coverImage || 'https://via.placeholder.com/300x200/00ccff/ffffff?text=Game'}" 
                     alt="${game.title}">
                <div class="game-overlay">
                    <button class="btn btn-edit" onclick="editGame(${game.id})">
                        <i class="fas fa-edit"></i>
                        编辑
                    </button>
                    <button class="btn btn-delete" onclick="deleteGame(${game.id})">
                        <i class="fas fa-trash"></i>
                        删除
                    </button>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-category">${game.category}</p>
                <div class="game-stats">
                    <span class="downloads">
                        <i class="fas fa-download"></i>
                        ${game.downloads || 0}
                    </span>
                    <span class="rating">
                        <i class="fas fa-star"></i>
                        ${game.rating || 4.5}
                    </span>
                </div>
            </div>
        </div>
    `).join(''));
}

// 渲染下载的游戏
function renderDownloadedGames() {
    const container = document.getElementById('downloaded-games');
    const emptyState = document.getElementById('empty-downloaded');
    
    if (!container) return;
    
    if (downloadedGames.length === 0) {
        container.style.display = 'none';
        if (emptyState) {
            emptyState.style.display = 'block';
        }
        return;
    }
    
    // 隐藏空状态，显示游戏列表
    if (emptyState) {
        emptyState.style.display = 'none';
    }
    container.style.display = 'grid';
    
    safeSetInnerHTML('downloaded-games', downloadedGames.map(game => `
        <div class="game-card" data-game-id="${game.id}">
            <div class="game-cover">
                <img src="${game.coverImage || 'https://via.placeholder.com/300x200/00ccff/ffffff?text=Game'}" 
                     alt="${game.title}">
                <div class="game-overlay">
                    <button class="btn btn-play" onclick="playGame(${game.id})">
                        <i class="fas fa-play"></i>
                        开始游戏
                    </button>
                </div>
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-developer">by ${game.developer}</p>
                <p class="game-category">${game.category}</p>
                <div class="game-stats">
                    <span class="downloads">
                        <i class="fas fa-download"></i>
                        ${game.downloads || 0}
                    </span>
                </div>
            </div>
        </div>
    `).join(''));
}

// 更新开发者统计数据
function updateDeveloperStats() {
    if (!isDeveloper) return;
    
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const userUploads = games.filter(game => game.developer === currentUser.username);
    
    const totalUploads = document.getElementById('total-uploads');
    const totalDownloads = document.getElementById('total-downloads');
    const avgRating = document.getElementById('avg-rating');
    
    const totalDownloadCount = userUploads.reduce((total, game) => total + (game.downloads || 0), 0);
    const avgRatingValue = userUploads.length > 0 
        ? (userUploads.reduce((total, game) => total + (game.rating || 4.5), 0) / userUploads.length).toFixed(1)
        : '0.0';
    
    if (totalUploads) {
        totalUploads.textContent = userUploads.length;
    }
    if (totalDownloads) {
        totalDownloads.textContent = totalDownloadCount;
    }
    if (avgRating) {
        avgRating.textContent = avgRatingValue;
    }
}

// 打开编辑资料模态框
function openEditModal() {
    const modal = document.getElementById('edit-modal');
    if (!modal) return;
    
    // 填充当前用户信息
    const usernameInput = document.getElementById('edit-username');
    const emailInput = document.getElementById('edit-email');
    
    if (usernameInput) usernameInput.value = currentUser.username;
    if (emailInput) emailInput.value = currentUser.email;
    
    modal.style.display = 'flex';
}

// 关闭编辑资料模态框
function closeEditModal() {
    const modal = document.getElementById('edit-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// 供HTML调用的函数
function editProfile() {
    openEditModal();
}

function closeModal() {
    closeEditModal();
}

function saveProfile(event) {
    event.preventDefault();
    handleProfileEdit(event);
}

// 处理开发者申请
function handleDeveloperApplication() {
    if (isDeveloper) {
        showNotification('您已经是开发者了', 'info');
        return;
    }
    
    if (confirm('确定要申请成为开发者吗？')) {
        const users = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
        const userIndex = users.findIndex(user => user.username === currentUser.username);
        
        if (userIndex !== -1) {
            users[userIndex].isDeveloper = true;
            users[userIndex].developerSince = new Date().toISOString().split('T')[0];
            localStorage.setItem('gameforge_users', JSON.stringify(users));
            
            // 更新当前用户信息
            currentUser = users[userIndex];
            isDeveloper = true;
            
            showNotification('恭喜！您已成为开发者', 'success');
            
            // 刷新页面数据
            loadUserData();
            updateUserInfo();
        }
    }
}

// 处理资料编辑
function handleProfileEdit(e) {
    e.preventDefault();
    
    const usernameInput = document.getElementById('edit-username');
    const emailInput = document.getElementById('edit-email');
    const passwordInput = document.getElementById('edit-password');
    
    if (!usernameInput || !emailInput) return;
    
    const newUsername = usernameInput.value.trim();
    const newEmail = emailInput.value.trim();
    const newPassword = passwordInput ? passwordInput.value.trim() : '';
    
    // 验证输入
    if (!newUsername || !newEmail) {
        showNotification('用户名和邮箱不能为空', 'error');
        return;
    }
    
    // 检查用户名和邮箱是否已被使用
    const users = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
    const usernameExists = users.some(user => user.username === newUsername && user.username !== currentUser.username);
    const emailExists = users.some(user => user.email === newEmail && user.email !== currentUser.email);
    
    if (usernameExists) {
        showNotification('该用户名已被使用', 'error');
        return;
    }
    
    if (emailExists) {
        showNotification('该邮箱已被使用', 'error');
        return;
    }
    
    // 更新用户信息
    const userIndex = users.findIndex(user => user.username === currentUser.username);
    if (userIndex !== -1) {
        users[userIndex].username = newUsername;
        users[userIndex].email = newEmail;
        
        if (newPassword) {
            users[userIndex].password = newPassword; // 简单实现，实际应加密
        }
        
        localStorage.setItem('gameforge_users', JSON.stringify(users));
        localStorage.setItem('gameforge_logged_in_user', newUsername);
        
        currentUser = users[userIndex];
        
        showNotification('资料更新成功', 'success');
        closeEditModal();
        
        // 更新页面显示
        updateUserInfo();
    }
}

// 编辑游戏
function editGame(gameId) {
    window.location.href = `upload.html?edit=${gameId}`;
}

// 删除游戏
function deleteGame(gameId) {
    if (confirm('确定要删除这个游戏吗？此操作不可恢复。')) {
        const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
        const gameIndex = games.findIndex(game => game.id === gameId && game.developer === currentUser.username);
        
        if (gameIndex !== -1) {
            games.splice(gameIndex, 1);
            localStorage.setItem('gameforge_games', JSON.stringify(games));
            
            showNotification('游戏删除成功', 'success');
            
            // 刷新用户游戏列表
            loadUserGames();
            updateUserStats();
        }
    }
}

// 开始游戏（模拟）
function playGame(gameId) {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const game = games.find(g => g.id === gameId);
    
    if (game) {
        showNotification(`正在启动游戏：${game.title}`, 'info');
        // 这里可以添加实际的游戏启动逻辑
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建唯一的通知样式
    const notificationStyle = document.createElement('style');
    notificationStyle.id = 'notification-style';
    if (!document.getElementById('notification-style')) {
        notificationStyle.textContent = `
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
        document.head.appendChild(notificationStyle);
    }
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
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

// 退出登录
function handleLogout() {
    // 清除所有登录相关数据，确保完全退出
    localStorage.removeItem('gameforge_logged_in_user'); // 清除统一登录标识
    localStorage.removeItem('currentUser');              // 清除当前用户信息
    
    window.location.href = 'index.html';
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initProfile);