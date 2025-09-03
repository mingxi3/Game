// 认证页面JavaScript
// 处理用户登录和注册逻辑

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面
    initializeAuthPage();
    
    // 检查URL哈希值，决定显示登录还是注册
    checkUrlHash();
    
    // 设置选项卡切换
    setupTabSwitching();
    
    // 初始化粒子背景
    initializeParticles();
});

/**
 * 初始化认证页面
 */
function initializeAuthPage() {
    // 检查是否已登录，如果已登录则跳转到个人中心
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        window.location.href = 'profile.html';
        return;
    }
}

/**
 * 检查URL哈希值，决定显示登录还是注册表单
 */
function checkUrlHash() {
    const hash = window.location.hash;
    if (hash === '#register') {
        switchTab('register');
    } else {
        switchTab('login');
    }
}

/**
 * 设置选项卡切换功能
 */
function setupTabSwitching() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
            
            // 更新URL哈希
            if (tabName === 'register') {
                window.location.hash = '#register';
            } else {
                window.location.hash = '';
            }
        });
    });
}

/**
 * 切换选项卡
 * @param {string} tabName - 要切换到的选项卡名称
 */
function switchTab(tabName) {
    // 更新按钮状态
    const tabButtons = document.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabName) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // 更新表单显示
    const forms = document.querySelectorAll('.auth-form');
    forms.forEach(form => {
        form.classList.remove('active');
    });
    
    document.getElementById(tabName + '-form').classList.add('active');
}

/**
 * 处理用户登录
 * @param {Event} event - 表单提交事件
 */
function handleLogin(event) {
    event.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(event.target);
    const username = formData.get('username').trim();
    const password = formData.get('password');
    
    // 验证输入
    if (!username || !password) {
        showAuthNotification('请填写所有必填字段', 'error');
        return;
    }
    
    // 显示加载状态
    showLoadingState('login-form', true);
    
    // 模拟登录请求延迟
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 查找用户（支持用户名或邮箱登录）
        const user = users.find(u => 
            (u.username === username || u.email === username) && u.password === password
        );
        
        if (user) {
            // 登录成功 - 统一存储格式
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('gameforge_logged_in_user', user.username); // 新增：统一格式
            
            showAuthNotification('登录成功！正在跳转...', 'success');
            
            // 跳转到首页或之前访问的页面
            setTimeout(() => {
                const redirectUrl = sessionStorage.getItem('redirectUrl') || 'index.html';
                sessionStorage.removeItem('redirectUrl');
                window.location.href = redirectUrl;
            }, 1500);
        } else {
            // 登录失败
            showAuthNotification('用户名或密码错误', 'error');
            showLoadingState('login-form', false);
        }
    }, 1000);
}

/**
 * 处理用户注册
 * @param {Event} event - 表单提交事件
 */
function handleRegister(event) {
    event.preventDefault();
    
    // 获取表单数据
    const formData = new FormData(event.target);
    const username = formData.get('username').trim();
    const email = formData.get('email').trim();
    const password = formData.get('password');
    const confirm = formData.get('confirm');
    
    // 验证输入
    if (!username || !email || !password || !confirm) {
        showAuthNotification('请填写所有必填字段', 'error');
        return;
    }
    
    // 验证邮箱格式
    if (!validateEmail(email)) {
        showAuthNotification('请输入有效的邮箱地址', 'error');
        return;
    }
    
    // 验证密码长度
    if (password.length < 6) {
        showAuthNotification('密码长度至少为6位', 'error');
        return;
    }
    
    // 验证密码匹配
    if (password !== confirm) {
        showAuthNotification('两次输入的密码不一致', 'error');
        return;
    }
    
    // 检查用户协议
    if (!document.getElementById('agree-terms').checked) {
        showAuthNotification('请同意用户协议和隐私政策', 'error');
        return;
    }
    
    // 显示加载状态
    showLoadingState('register-form', true);
    
    // 模拟注册请求延迟
    setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        
        // 检查用户名是否已存在
        if (users.some(u => u.username === username)) {
            showAuthNotification('该用户名已被使用', 'error');
            showLoadingState('register-form', false);
            return;
        }
        
        // 检查邮箱是否已注册
        if (users.some(u => u.email === email)) {
            showAuthNotification('该邮箱已被注册', 'error');
            showLoadingState('register-form', false);
            return;
        }
        
        // 🚀 根本修复：创建标准化用户对象
        const newUser = {
            id: Date.now(),
            username: username,
            email: email,
            password: password,
            role: 'player',  // 默认为普通玩家
            joinDate: new Date().toISOString(),
            downloadedGames: [], // 确保是数组
            uploadedGames: [],   // 确保是数组
            isDeveloper: false   // 确保布尔值
        };
        
        // 1. 添加到users（主数据库）
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // 2. 🔄 强制同步到gameforge_users（确保一致性）
        const gameforgeUsers = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
        const existingUser = gameforgeUsers.find(u => u.username === newUser.username);
        
        const gameforgeUser = {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            isDeveloper: newUser.isDeveloper,
            joinDate: newUser.joinDate,
            downloadedGames: newUser.downloadedGames, // 直接引用确保一致性
            uploadedGames: newUser.uploadedGames
        };
        
        if (existingUser) {
            // 如果存在，更新数据
            const index = gameforgeUsers.findIndex(u => u.username === newUser.username);
            gameforgeUsers[index] = gameforgeUser;
        } else {
            // 如果不存在，添加新用户
            gameforgeUsers.push(gameforgeUser);
        }
        
        localStorage.setItem('gameforge_users', JSON.stringify(gameforgeUsers));
        
        // 3. ✅ 设置登录状态（双重保险）
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('gameforge_logged_in_user', newUser.username);
        
        // 4. 🔍 验证数据完整性
        validateNewUserData(newUser.username);
        
        showAuthNotification('注册成功！正在跳转...', 'success');
        
        // 跳转到个人中心
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 1500);
    }, 1000);
}

/**
 * 显示/隐藏密码
 * @param {string} inputId - 密码输入框ID
 */
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const toggleBtn = input.nextElementSibling.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        input.type = 'password';
        toggleBtn.textContent = '👁️';
    }
}

/**
 * 显示加载状态
 * @param {string} formId - 表单ID
 * @param {boolean} loading - 是否显示加载状态
 */
function showLoadingState(formId, loading) {
    const form = document.getElementById(formId);
    const button = form.querySelector('.auth-submit');
    const buttonText = button.querySelector('span');
    const loader = button.querySelector('.button-loader');
    
    if (loading) {
        button.disabled = true;
        buttonText.style.display = 'none';
        loader.style.display = 'block';
    } else {
        button.disabled = false;
        buttonText.style.display = 'block';
        loader.style.display = 'none';
    }
}

/**
 * 显示认证通知
 * @param {string} message - 通知消息
 * @param {string} type - 通知类型 (success, error)
 */
function showAuthNotification(message, type) {
    // 移除已存在的通知
    const existingNotification = document.querySelector('.auth-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `auth-notification auth-notification-${type}`;
    notification.textContent = message;
    
    // 设置通知样式
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '10px',
        color: 'white',
        fontWeight: 'bold',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '300px'
    });
    
    // 根据类型设置背景色
    if (type === 'success') {
        notification.style.background = 'linear-gradient(45deg, #00ff4c, #00ccff)';
    } else {
        notification.style.background = 'linear-gradient(45deg, #ff4757, #ff3838)';
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

/**
 * 社交登录（模拟）
 * @param {string} provider - 社交平台名称
 */
function socialLogin(provider) {
    showAuthNotification(`${provider}登录功能开发中...`, 'info');
}

/**
 * 邮箱验证函数
 * @param {string} email - 要验证的邮箱地址
 * @returns {boolean} - 是否有效
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * 初始化粒子背景
 */
function initializeParticles() {
    if (document.getElementById('particles-js')) {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: ['#00ccff', '#8a2be2', '#00ff4c'] },
                shape: { type: 'circle' },
                opacity: {
                    value: 0.5,
                    random: true,
                    anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
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
                    speed: 1,
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
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 1 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }
}

/**
 * 🔍 验证新用户数据完整性
 * @param {string} username - 要验证的用户名
 */
function validateNewUserData(username) {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const gameforgeUsers = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
        
        const user = users.find(u => u.username === username);
        const gameforgeUser = gameforgeUsers.find(u => u.username === username);
        
        let issues = [];
        
        // 检查用户存在性
        if (!user) {
            issues.push('users中不存在');
            console.error(`❌ 用户 ${username} 不存在于users中`);
        }
        
        if (!gameforgeUser) {
            issues.push('gameforge_users中不存在');
            console.error(`❌ 用户 ${username} 不存在于gameforge_users中`);
        }
        
        // 检查数据格式
        if (user) {
            if (!Array.isArray(user.downloadedGames)) {
                user.downloadedGames = [];
                issues.push('downloadedGames格式错误，已修复');
                console.warn(`⚠️ 修复 ${username}.downloadedGames 格式`);
            }
            
            if (!Array.isArray(user.uploadedGames)) {
                user.uploadedGames = [];
                issues.push('uploadedGames格式错误，已修复');
                console.warn(`⚠️ 修复 ${username}.uploadedGames 格式`);
            }
            
            if (!user.joinDate) {
                user.joinDate = new Date().toISOString();
                issues.push('缺少joinDate，已添加');
                console.warn(`⚠️ 添加 ${username}.joinDate`);
            }
        }
        
        if (gameforgeUser) {
            if (!Array.isArray(gameforgeUser.downloadedGames)) {
                gameforgeUser.downloadedGames = [];
                issues.push('gameforge.downloadedGames格式错误，已修复');
            }
            
            if (!Array.isArray(gameforgeUser.uploadedGames)) {
                gameforgeUser.uploadedGames = [];
                issues.push('gameforge.uploadedGames格式错误，已修复');
            }
        }
        
        // 保存修复后的数据
        if (issues.length > 0) {
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('gameforge_users', JSON.stringify(gameforgeUsers));
            console.log(`✅ 已修复用户 ${username} 的数据: ${issues.join(', ')}`);
        } else {
            console.log(`✅ 用户 ${username} 数据验证通过`);
        }
        
        return issues;
        
    } catch (error) {
        console.error(`验证用户数据时出错: ${error.message}`);
        return ['数据验证错误'];
    }
}

/**
 * 🏥 系统健康检查
 * 检查整个用户系统的数据一致性
 */
function checkSystemHealth() {
    try {
        const report = {
            totalUsers: 0,
            syncedUsers: 0,
            issues: [],
            status: 'healthy'
        };
        
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const gameforgeUsers = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
        
        report.totalUsers = users.length;
        
        // 检查每个用户的同步状态
        users.forEach(user => {
            const gameforgeUser = gameforgeUsers.find(gf => gf.username === user.username);
            
            if (!gameforgeUser) {
                report.issues.push(`用户 ${user.username} 在gameforge_users中缺失`);
            } else {
                report.syncedUsers++;
                
                // 检查数据一致性
                if (user.email !== gameforgeUser.email) {
                    report.issues.push(`用户 ${user.username} 邮箱不一致`);
                }
                
                if (user.downloadedGames.length !== gameforgeUser.downloadedGames.length) {
                    report.issues.push(`用户 ${user.username} 下载游戏数量不一致`);
                }
            }
        });
        
        // 检查多余的gameforge用户
        const extraGameforgeUsers = gameforgeUsers.filter(gf => 
            !users.some(u => u.username === gf.username)
        );
        
        if (extraGameforgeUsers.length > 0) {
            report.issues.push(`gameforge_users中存在多余用户: ${extraGameforgeUsers.map(u => u.username).join(', ')}`);
        }
        
        // 确定系统状态
        if (report.issues.length > 0) {
            report.status = report.issues.length > 5 ? 'critical' : 'needs_attention';
        }
        
        console.log('系统健康报告:', report);
        return report;
        
    } catch (error) {
        console.error('系统健康检查出错:', error);
        return {
            totalUsers: 0,
            syncedUsers: 0,
            issues: [`系统错误: ${error.message}`],
            status: 'error'
        };
    }
}

// 监听URL哈希变化
window.addEventListener('hashchange', checkUrlHash);

// 添加CSS动画样式
const authStyle = document.createElement('style');
authStyle.textContent = `
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
document.head.appendChild(authStyle);