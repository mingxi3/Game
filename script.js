// GameForge 主JavaScript文件
// 包含网站交互逻辑、数据管理和动画效果

// 等待DOM完全加载后执行
document.addEventListener('DOMContentLoaded', function() {
    // 初始化粒子背景效果
    initializeParticles();
    
    // 初始化游戏数据
    initializeGameData();
    
    // 检查用户登录状态
    checkUserLogin();
    
    // 加载精选游戏
    loadFeaturedGames();
    
    // 设置导航栏交互
    setupNavigation();
});

/**
 * 初始化粒子背景效果
 * 使用particles.js库创建动态背景
 */
function initializeParticles() {
    // 检查页面是否存在粒子容器
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,  // 粒子数量
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: ['#00ccff', '#8a2be2', '#00ff4c']  // 粒子颜色数组
                },
                shape: {
                    type: 'circle',  // 粒子形状
                    stroke: {
                        width: 0,
                        color: '#000000'
                    }
                },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: true,
                        speed: 2,
                        size_min: 0.1,
                        sync: false
                    }
                },
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
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'  // 鼠标悬停时的交互模式
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'  // 点击时添加新粒子
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * 初始化游戏数据
 * 使用LocalStorage存储游戏信息
 */
function initializeGameData() {
    // 检查是否已存在游戏数据
    if (!localStorage.getItem('games')) {
        // 创建示例游戏数据
        const sampleGames = [
            {
                id: 1,
                title: "星际探险家",
                description: "在浩瀚宇宙中探索未知星球，收集资源，建立基地。",
                developer: "宇宙工作室",
                category: "冒险",
                version: "1.0.0",
                size: "2.5GB",
                downloads: 15420,
                rating: 4.8,
                coverImage: "🚀",
                screenshots: ["🌌", "🪐", "👨‍🚀"],
                featured: true,
                uploadDate: new Date().toISOString()
            },
            {
                id: 2,
                title: "赛博朋克2077",
                description: "在未来都市中体验高科技与低生活的完美结合。",
                developer: "CD Projekt",
                category: "角色扮演",
                version: "2.1",
                size: "70GB",
                downloads: 500000,
                rating: 4.5,
                coverImage: "🌃",
                screenshots: ["🤖", "🚗", "⚡"],
                featured: true,
                uploadDate: new Date().toISOString()
            },
            {
                id: 3,
                title: "像素农场",
                description: "经营你的农场，种植作物，饲养动物，体验田园生活。",
                developer: "像素游戏社",
                category: "模拟",
                version: "1.5.2",
                size: "500MB",
                downloads: 8900,
                rating: 4.6,
                coverImage: "🌾",
                screenshots: ["🚜", "🐄", "🌽"],
                featured: true,
                uploadDate: new Date().toISOString()
            }
        ];
        
        // 保存游戏数据到LocalStorage
        localStorage.setItem('games', JSON.stringify(sampleGames));
    }
    
    // 初始化用户数据
    if (!localStorage.getItem('users')) {
        const sampleUsers = [
            {
                id: 1,
                username: "admin",
                email: "admin@gameforge.com",
                password: "admin123",
                role: "developer",
                joinDate: new Date().toISOString(),
                downloadedGames: [],
                uploadedGames: [1, 2, 3]
            }
        ];
        localStorage.setItem('users', JSON.stringify(sampleUsers));
    }
    
    // 初始化当前登录用户
    if (!localStorage.getItem('currentUser')) {
        localStorage.setItem('currentUser', JSON.stringify(null));
    }
}

/**
 * 检查用户登录状态
 * 更新导航栏显示
 */
function checkUserLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userSection = document.querySelector('.nav-user');
    
    if (!userSection) {
        console.warn('导航栏用户区域未找到');
        return;
    }
    
    if (currentUser && currentUser.username) {
        // 用户已登录，显示用户名和个人中心按钮
        userSection.innerHTML = `
            <span class="welcome-text">欢迎, ${currentUser.username}</span>
            <button class="btn-profile" onclick="window.location.href='profile.html'">个人中心</button>
            <button class="btn-logout" onclick="logout()">退出</button>
        `;
    } else {
        // 用户未登录，显示登录注册按钮
        userSection.innerHTML = `
            <button class="btn-login" onclick="window.location.href='auth.html'">登录</button>
            <button class="btn-register" onclick="window.location.href='auth.html#register'">注册</button>
        `;
    }
}

/**
 * 加载精选游戏
 * 在首页显示推荐游戏
 */
function loadFeaturedGames() {
    const gamesGrid = document.getElementById('featured-games-grid');
    if (!gamesGrid) return;
    
    const games = JSON.parse(localStorage.getItem('games')) || [];
    const featuredGames = games.filter(game => game.featured);
    
    gamesGrid.innerHTML = '';
    
    featuredGames.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
}

/**
 * 创建游戏卡片元素
 * @param {Object} game - 游戏数据对象
 * @returns {HTMLElement} - 游戏卡片DOM元素
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
        <div class="game-image">${game.coverImage}</div>
        <h3 class="game-title">${game.title}</h3>
        <p class="game-description">${game.description}</p>
        <div class="game-developer">开发者: ${game.developer}</div>
        <div class="game-stats">
            <span>⭐ ${game.rating}</span>
            <span>📥 ${game.downloads.toLocaleString()}</span>
        </div>
        <button class="game-download" onclick="viewGameDetails(${game.id})">
            查看详情
        </button>
    `;
    
    return card;
}

/**
 * 查看游戏详情
 * @param {number} gameId - 游戏ID
 */
function viewGameDetails(gameId) {
    // 保存当前查看的游戏ID
    sessionStorage.setItem('currentGameId', gameId);
    // 跳转到游戏详情页
    window.location.href = 'game-details.html';
}

/**
 * 设置导航栏交互
 * 处理滚动效果和链接状态
 */
function setupNavigation() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    // 设置当前页面链接为激活状态
    navLinks.forEach(link => {
        if (link.href.includes(currentPath.split('/').pop())) {
            link.classList.add('active');
        }
    });
}

/**
 * 用户登出功能
 */
function logout() {
    // 清除所有登录相关数据，确保完全退出
    localStorage.removeItem('currentUser');           // 清除当前用户信息
    localStorage.removeItem('gameforge_logged_in_user'); // 清除统一登录标识
    
    // 显示登出成功消息
    showNotification('已成功退出登录', 'success');
    
    // 延迟刷新页面，给用户看到提示的时间
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * 显示通知消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型 (success, error, info)
 */
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 设置通知样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '5px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // 根据类型设置背景色
    switch (type) {
        case 'success':
            notification.style.background = 'linear-gradient(45deg, #00ff4c, #00ccff)';
            break;
        case 'error':
            notification.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
            break;
        default:
            notification.style.background = 'linear-gradient(45deg, #00ccff, #8a2be2)';
    }
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 3秒后自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// 添加CSS动画样式
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

/**
 * 通用工具函数
 */
const Utils = {
    // 生成唯一ID
    generateId: function() {
        return Date.now() + Math.random().toString(36).substr(2, 9);
    },
    
    // 格式化文件大小
    formatFileSize: function(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },
    
    // 验证邮箱格式
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 验证密码强度
    validatePassword: function(password) {
        return password.length >= 6;
    }
};

// 导出到全局作用域，供其他页面使用
window.GameForge = {
    Utils: Utils,
    showNotification: showNotification,
    viewGameDetails: viewGameDetails
};