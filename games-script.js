// 游戏库页面JavaScript
// 处理游戏展示、搜索、筛选和分页

// 全局变量
let allGames = [];
let filteredGames = [];
let currentPage = 1;
const gamesPerPage = 12;

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    // 初始化游戏数据
    initializeGamesData();
    
    // 检查用户登录状态
    checkUserLogin();
    
    // 加载游戏列表
    loadGames();
    
    // 设置事件监听器
    setupEventListeners();
});

/**
 * 初始化游戏数据
 * 如果本地存储中没有游戏数据，创建示例数据
 */
function initializeGamesData() {
    if (!localStorage.getItem('games')) {
        const sampleGames = [
            {
                id: 1,
                title: "星际探险家",
                description: "在浩瀚宇宙中探索未知星球，收集资源，建立基地。体验前所未有的太空冒险，成为宇宙的主宰者。",
                developer: "宇宙工作室",
                category: "冒险",
                version: "1.0.0",
                size: "2.5GB",
                downloads: 15420,
                rating: 4.8,
                coverImage: "🚀",
                screenshots: ["🌌", "🪐", "👨‍🚀"],
                uploadDate: "2024-01-15T10:00:00Z",
                featured: true
            },
            {
                id: 2,
                title: "赛博朋克2077",
                description: "在未来都市中体验高科技与低生活的完美结合。霓虹灯下的黑暗角落，等待你的探索。",
                developer: "CD Projekt",
                category: "角色扮演",
                version: "2.1",
                size: "70GB",
                downloads: 500000,
                rating: 4.5,
                coverImage: "🌃",
                screenshots: ["🤖", "🚗", "⚡"],
                uploadDate: "2024-01-10T15:30:00Z",
                featured: true
            },
            {
                id: 3,
                title: "像素农场",
                description: "经营你的农场，种植作物，饲养动物，体验田园生活的宁静与美好。",
                developer: "像素游戏社",
                category: "模拟",
                version: "1.5.2",
                size: "500MB",
                downloads: 8900,
                rating: 4.6,
                coverImage: "🌾",
                screenshots: ["🚜", "🐄", "🌽"],
                uploadDate: "2024-01-20T08:45:00Z",
                featured: true
            },
            {
                id: 4,
                title: "暗影刺客",
                description: "在黑暗中潜行，成为致命的刺客。每一次刺杀都是艺术的展现。",
                developer: "潜行工作室",
                category: "动作",
                version: "1.2.0",
                size: "15GB",
                downloads: 28500,
                rating: 4.7,
                coverImage: "🗡️",
                screenshots: ["🌑", "🎯", "🥷"],
                uploadDate: "2024-01-18T14:20:00Z",
                featured: false
            },
            {
                id: 5,
                title: "魔法学院",
                description: "学习强大的魔法，探索神秘的魔法世界，成为最伟大的魔法师。",
                developer: "魔法游戏",
                category: "角色扮演",
                version: "3.0.1",
                size: "8GB",
                downloads: 125000,
                rating: 4.9,
                coverImage: "⚡",
                screenshots: ["🔮", "📚", "🧙‍♂️"],
                uploadDate: "2024-01-12T11:00:00Z",
                featured: true
            },
            {
                id: 6,
                title: "城市建造者",
                description: "从零开始建造你的梦想城市，规划道路，建造建筑，管理资源。",
                developer: "建造游戏",
                category: "模拟",
                version: "2.5.0",
                size: "12GB",
                downloads: 67000,
                rating: 4.4,
                coverImage: "🏗️",
                screenshots: ["🏙️", "🚧", "🏢"],
                uploadDate: "2024-01-22T09:15:00Z",
                featured: false
            },
            {
                id: 7,
                title: "赛车传奇",
                description: "体验极速赛车的刺激，在世界各地的赛道上与对手一决高下。",
                developer: "速度工作室",
                category: "竞速",
                version: "1.8.0",
                size: "25GB",
                downloads: 98000,
                rating: 4.3,
                coverImage: "🏎️",
                screenshots: ["🏁", "🛣️", "🏆"],
                uploadDate: "2024-01-25T16:30:00Z",
                featured: false
            },
            {
                id: 8,
                title: "生存岛",
                description: "在荒岛上生存，收集资源，建造庇护所，对抗野生动物。",
                developer: "生存游戏",
                category: "生存",
                version: "1.3.0",
                size: "5GB",
                downloads: 45000,
                rating: 4.6,
                coverImage: "🏝️",
                screenshots: ["🌴", "🔥", "🏕️"],
                uploadDate: "2024-01-28T13:45:00Z",
                featured: false
            },
            {
                id: 9,
                title: "音乐节奏",
                description: "跟随音乐节奏点击，享受视听盛宴，挑战你的手速极限。",
                developer: "节奏大师",
                category: "音乐",
                version: "2.0.0",
                size: "3GB",
                downloads: 78000,
                rating: 4.5,
                coverImage: "🎵",
                screenshots: ["🎹", "🎸", "🎤"],
                uploadDate: "2024-01-30T10:20:00Z",
                featured: false
            },
            {
                id: 10,
                title: "解谜大师",
                description: "挑战各种烧脑谜题，锻炼你的逻辑思维，成为解谜高手。",
                developer: "智慧游戏",
                category: "解谜",
                version: "1.1.0",
                size: "1GB",
                downloads: 34000,
                rating: 4.7,
                coverImage: "🧩",
                screenshots: ["🎯", "🧠", "🔍"],
                uploadDate: "2024-02-01T15:00:00Z",
                featured: false
            },
            {
                id: 11,
                title: "太空战争",
                description: "指挥你的舰队，在浩瀚宇宙中展开史诗级太空战争。",
                developer: "银河工作室",
                category: "策略",
                version: "1.4.0",
                size: "18GB",
                downloads: 56000,
                rating: 4.4,
                coverImage: "🚀",
                screenshots: ["🌌", "⚔️", "🛸"],
                uploadDate: "2024-02-03T12:30:00Z",
                featured: false
            },
            {
                id: 12,
                title: "恐怖医院",
                description: "探索废弃的精神病院，揭开隐藏在黑暗中的恐怖真相。",
                developer: "恐怖游戏",
                category: "恐怖",
                version: "1.0.5",
                size: "4GB",
                downloads: 23000,
                rating: 4.2,
                coverImage: "👻",
                screenshots: ["🏥", "🔦", "😱"],
                uploadDate: "2024-02-05T20:00:00Z",
                featured: false
            }
        ];
        
        localStorage.setItem('games', JSON.stringify(sampleGames));
    }
    
    // 加载所有游戏数据
    allGames = JSON.parse(localStorage.getItem('games')) || [];
    filteredGames = [...allGames];
}

/**
 * 检查用户登录状态
 */
function checkUserLogin() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userSection = document.getElementById('nav-user');
    
    if (currentUser) {
        userSection.innerHTML = `
            <span class="welcome-text">欢迎, ${currentUser.username}</span>
            <button class="btn-profile" onclick="window.location.href='profile.html'">个人中心</button>
            <button class="btn-logout" onclick="logout()">退出</button>
        `;
    } else {
        userSection.innerHTML = `
            <button class="btn-login" onclick="window.location.href='auth.html'">登录</button>
            <button class="btn-register" onclick="window.location.href='auth.html#register'">注册</button>
        `;
    }
}

/**
 * 设置事件监听器
 */
function setupEventListeners() {
    // 搜索输入监听
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(searchGames, 300));
    }
    
    // 分类筛选监听
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterGames);
    }
    
    // 排序监听
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', sortGames);
    }
}

/**
 * 加载游戏列表
 */
function loadGames() {
    const gamesGrid = document.getElementById('games-grid');
    const gamesCount = document.getElementById('games-count');
    const emptyState = document.getElementById('empty-state');
    const loadMoreBtn = document.getElementById('load-more-btn');
    
    if (!gamesGrid) return;
    
    // 更新游戏数量
    if (gamesCount) {
        gamesCount.textContent = filteredGames.length;
    }
    
    // 清空网格
    gamesGrid.innerHTML = '';
    
    // 检查是否为空
    if (filteredGames.length === 0) {
        emptyState.style.display = 'block';
        loadMoreBtn.style.display = 'none';
        return;
    } else {
        emptyState.style.display = 'none';
    }
    
    // 计算当前页显示的游戏
    const startIndex = 0;
    const endIndex = currentPage * gamesPerPage;
    const gamesToShow = filteredGames.slice(startIndex, endIndex);
    
    // 渲染游戏卡片
    gamesToShow.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
    
    // 显示/隐藏加载更多按钮
    if (endIndex < filteredGames.length) {
        loadMoreBtn.style.display = 'inline-block';
    } else {
        loadMoreBtn.style.display = 'none';
    }
}

/**
 * 创建游戏卡片
 * @param {Object} game - 游戏数据
 * @returns {HTMLElement} - 游戏卡片元素
 */
function createGameCard(game) {
    const card = document.createElement('div');
    card.className = 'game-card';
    card.setAttribute('data-category', game.category);
    
    card.innerHTML = `
        <div class="game-image">${game.coverImage}</div>
        <h3 class="game-title">${game.title}</h3>
        <p class="game-description">${game.description}</p>
        <div class="game-developer">开发者: ${game.developer}</div>
        <div class="game-stats">
            <span>⭐ ${game.rating}</span>
            <span>📥 ${game.downloads.toLocaleString()}</span>
            <span>💾 ${game.size}</span>
        </div>
        <button class="game-download" onclick="viewGameDetails(${game.id})">
            查看详情
        </button>
    `;
    
    return card;
}

/**
 * 搜索游戏
 */
function searchGames() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    filteredGames = allGames.filter(game => 
        game.title.toLowerCase().includes(searchTerm) ||
        game.description.toLowerCase().includes(searchTerm) ||
        game.developer.toLowerCase().includes(searchTerm) ||
        game.category.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    loadGames();
}

/**
 * 按分类筛选游戏
 */
function filterGames() {
    const category = document.getElementById('category-filter').value;
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    filteredGames = allGames.filter(game => {
        const matchesSearch = searchTerm === '' || 
            game.title.toLowerCase().includes(searchTerm) ||
            game.description.toLowerCase().includes(searchTerm) ||
            game.developer.toLowerCase().includes(searchTerm);
        
        const matchesCategory = category === '' || game.category === category;
        
        return matchesSearch && matchesCategory;
    });
    
    currentPage = 1;
    loadGames();
}

/**
 * 排序游戏
 */
function sortGames() {
    const sortBy = document.getElementById('sort-filter').value;
    
    switch (sortBy) {
        case 'newest':
            filteredGames.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
            break;
        case 'popular':
            filteredGames.sort((a, b) => b.downloads - a.downloads);
            break;
        case 'rating':
            filteredGames.sort((a, b) => b.rating - a.rating);
            break;
        case 'downloads':
            filteredGames.sort((a, b) => b.downloads - a.downloads);
            break;
    }
    
    loadGames();
}

/**
 * 加载更多游戏
 */
function loadMoreGames() {
    currentPage++;
    
    const gamesGrid = document.getElementById('games-grid');
    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = currentPage * gamesPerPage;
    const gamesToShow = filteredGames.slice(startIndex, endIndex);
    
    // 添加新游戏卡片
    gamesToShow.forEach(game => {
        const gameCard = createGameCard(game);
        gamesGrid.appendChild(gameCard);
    });
    
    // 更新加载更多按钮状态
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (endIndex >= filteredGames.length) {
        loadMoreBtn.style.display = 'none';
    }
}

/**
 * 防抖函数
 * @param {Function} func - 要执行的函数
 * @param {number} wait - 等待时间（毫秒）
 * @returns {Function} - 防抖后的函数
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 查看游戏详情
 * @param {number} gameId - 游戏ID
 */
function viewGameDetails(gameId) {
    sessionStorage.setItem('currentGameId', gameId);
    window.location.href = 'game-details.html';
}

/**
 * 用户登出
 */
function logout() {
    // 清除所有登录相关数据，确保完全退出
    localStorage.removeItem('currentUser');           // 清除当前用户信息
    localStorage.removeItem('gameforge_logged_in_user'); // 清除统一登录标识
    
    showNotification('已成功退出登录', 'success');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
}

/**
 * 显示通知
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease-out'
    });
    
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
    
    document.body.appendChild(notification);
    
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
const gamesStyle = document.createElement('style');
gamesStyle.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
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
document.head.appendChild(gamesStyle);