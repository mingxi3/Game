// 游戏上传页面JavaScript功能

// 全局变量
let currentUser = null;
let isEditMode = false;
let editGameId = null;
let uploadedScreenshots = [];

// 页面初始化
function initUploadPage() {
    console.log('初始化游戏上传页面...');
    
    // 检查用户登录状态和权限
    checkUserPermissions();
    
    // 初始化粒子背景
    initParticles();
    
    // 检查是否为编辑模式
    checkEditMode();
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 如果是编辑模式，加载游戏数据
    if (isEditMode) {
        loadGameForEdit();
    }
}

// 检查用户权限
function checkUserPermissions() {
    const loggedInUser = localStorage.getItem('gameforge_logged_in_user');
    
    if (!loggedInUser) {
        // 未登录，重定向到登录页
        window.location.href = 'auth.html?redirect=upload.html';
        return;
    }
    
    const users = JSON.parse(localStorage.getItem('gameforge_users') || '[]');
    currentUser = users.find(user => user.username === loggedInUser);
    
    if (!currentUser || !currentUser.isDeveloper) {
        // 不是开发者，重定向到个人中心
        showNotification('您需要成为开发者才能上传游戏', 'error');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        return;
    }
    
    // 更新导航栏显示
    updateNavbar();
}

// 更新导航栏显示
function updateNavbar() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) logoutBtn.style.display = 'inline-block';
}

// 初始化粒子背景
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
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

// 检查是否为编辑模式
function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    editGameId = parseInt(urlParams.get('edit'));
    
    if (editGameId) {
        isEditMode = true;
        document.getElementById('pageTitle').textContent = '编辑游戏';
        document.title = '编辑游戏 - GameForge';
    }
}

// 绑定事件监听器
function bindEventListeners() {
    // 表单提交
    const uploadForm = document.getElementById('uploadForm');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleFormSubmit);
    }
    
    // 文件上传事件
    const coverImage = document.getElementById('coverImage');
    const screenshots = document.getElementById('screenshots');
    const gameFile = document.getElementById('gameFile');
    
    if (coverImage) {
        coverImage.addEventListener('change', handleCoverUpload);
    }
    if (screenshots) {
        screenshots.addEventListener('change', handleScreenshotsUpload);
    }
    if (gameFile) {
        gameFile.addEventListener('change', handleGameFileUpload);
    }
    
    // 退出登录按钮
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
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

// 加载游戏数据进行编辑
function loadGameForEdit() {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const game = games.find(g => g.id === editGameId && g.developer === currentUser.username);
    
    if (!game) {
        showNotification('游戏不存在或您没有权限编辑', 'error');
        setTimeout(() => {
            window.location.href = 'profile.html';
        }, 2000);
        return;
    }
    
    // 填充表单数据
    document.getElementById('gameTitle').value = game.title || '';
    document.getElementById('gameCategory').value = game.category || '';
    document.getElementById('gameVersion').value = game.version || '';
    document.getElementById('gameSize').value = parseInt(game.fileSize) || '';
    document.getElementById('shortDescription').value = game.description || '';
    document.getElementById('fullDescription').value = game.fullDescription || '';
    
    // 填充系统要求
    document.getElementById('minOS').value = game.minRequirements?.os || '';
    document.getElementById('minCPU').value = game.minRequirements?.cpu || '';
    document.getElementById('minRAM').value = game.minRequirements?.ram || '';
    document.getElementById('minGPU').value = game.minRequirements?.gpu || '';
    document.getElementById('minStorage').value = game.minRequirements?.storage || '';
    
    document.getElementById('recOS').value = game.recRequirements?.os || '';
    document.getElementById('recCPU').value = game.recRequirements?.cpu || '';
    document.getElementById('recRAM').value = game.recRequirements?.ram || '';
    document.getElementById('recGPU').value = game.recRequirements?.gpu || '';
    document.getElementById('recStorage').value = game.recRequirements?.storage || '';
    
    // 显示现有封面预览
    if (game.coverImage) {
        const coverPreview = document.getElementById('coverPreview');
        if (coverPreview) {
            coverPreview.src = game.coverImage;
            coverPreview.style.display = 'block';
        }
    }
    
    // 显示现有截图
    if (game.screenshots && game.screenshots.length > 0) {
        uploadedScreenshots = [...game.screenshots];
        renderScreenshotsPreview();
    }
}

// 处理封面图片上传
function handleCoverUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
        showNotification('请选择图片文件', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const coverPreview = document.getElementById('coverPreview');
        if (coverPreview) {
            coverPreview.src = e.target.result;
            coverPreview.style.display = 'block';
        }
    };
    reader.readAsDataURL(file);
}

// 处理截图上传
function handleScreenshotsUpload(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;
    
    const validFiles = files.filter(file => file.type.startsWith('image/'));
    const totalScreenshots = uploadedScreenshots.length + validFiles.length;
    
    if (totalScreenshots > 5) {
        showNotification('最多只能上传5张截图', 'error');
        return;
    }
    
    validFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(e) {
            uploadedScreenshots.push(e.target.result);
            renderScreenshotsPreview();
        };
        reader.readAsDataURL(file);
    });
}

// 处理游戏文件上传
function handleGameFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const maxSize = 2 * 1024 * 1024 * 1024; // 2GB
    if (file.size > maxSize) {
        showNotification('文件大小不能超过2GB', 'error');
        event.target.value = '';
        return;
    }
    
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.querySelector('.file-name');
    const fileSize = document.querySelector('.file-size');
    
    if (fileInfo && fileName && fileSize) {
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'flex';
    }
}

// 渲染截图预览
function renderScreenshotsPreview() {
    const previewContainer = document.getElementById('screenshotsPreview');
    if (!previewContainer) return;
    
    previewContainer.innerHTML = uploadedScreenshots.map((screenshot, index) => `
        <div class="screenshot-preview">
            <img src="${screenshot}" alt="截图 ${index + 1}">
            <button type="button" class="remove-btn" onclick="removeScreenshot(${index})">×</button>
        </div>
    `).join('');
}

// 移除截图
function removeScreenshot(index) {
    uploadedScreenshots.splice(index, 1);
    renderScreenshotsPreview();
}

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 处理表单提交
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    const formData = collectFormData();
    
    if (isEditMode) {
        updateGame(formData);
    } else {
        createGame(formData);
    }
}

// 验证表单
function validateForm() {
    let isValid = true;
    const requiredFields = ['gameTitle', 'gameCategory', 'gameVersion', 'gameSize', 'shortDescription'];
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const formGroup = field.closest('.form-group');
        
        if (!field.value.trim()) {
            formGroup.classList.add('error');
            isValid = false;
        } else {
            formGroup.classList.remove('error');
        }
    });
    
    // 验证版本号格式
    const versionField = document.getElementById('gameVersion');
    const versionPattern = /^\d+\.\d+\.\d+$/;
    if (versionField.value && !versionPattern.test(versionField.value)) {
        versionField.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    // 验证文件大小
    const sizeField = document.getElementById('gameSize');
    if (sizeField.value && (parseInt(sizeField.value) <= 0 || parseInt(sizeField.value) > 10000)) {
        sizeField.closest('.form-group').classList.add('error');
        isValid = false;
    }
    
    if (!isValid) {
        showNotification('请填写所有必填字段', 'error');
    }
    
    return isValid;
}

// 收集表单数据
function collectFormData() {
    const formData = {
        title: document.getElementById('gameTitle').value.trim(),
        category: document.getElementById('gameCategory').value,
        version: document.getElementById('gameVersion').value.trim(),
        fileSize: document.getElementById('gameSize').value + ' MB',
        description: document.getElementById('shortDescription').value.trim(),
        fullDescription: document.getElementById('fullDescription').value.trim(),
        coverImage: document.getElementById('coverPreview').src || '',
        screenshots: uploadedScreenshots,
        developer: currentUser.username,
        releaseDate: new Date().toISOString().split('T')[0],
        updateDate: new Date().toISOString().split('T')[0],
        downloads: 0,
        rating: 4.5,
        platforms: 'Windows, macOS, Linux'
    };
    
    // 系统要求
    formData.minRequirements = {
        os: document.getElementById('minOS').value.trim(),
        cpu: document.getElementById('minCPU').value.trim(),
        ram: document.getElementById('minRAM').value.trim(),
        gpu: document.getElementById('minGPU').value.trim(),
        storage: document.getElementById('minStorage').value.trim()
    };
    
    formData.recRequirements = {
        os: document.getElementById('recOS').value.trim(),
        cpu: document.getElementById('recCPU').value.trim(),
        ram: document.getElementById('recRAM').value.trim(),
        gpu: document.getElementById('recGPU').value.trim(),
        storage: document.getElementById('recStorage').value.trim()
    };
    
    return formData;
}

// 创建新游戏
function createGame(formData) {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    
    // 生成唯一ID
    const newId = games.length > 0 ? Math.max(...games.map(g => g.id)) + 1 : 1;
    
    const newGame = {
        id: newId,
        ...formData
    };
    
    games.push(newGame);
    localStorage.setItem('gameforge_games', JSON.stringify(games));
    
    showNotification('游戏上传成功！', 'success');
    
    // 延迟跳转
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// 更新游戏
function updateGame(formData) {
    const games = JSON.parse(localStorage.getItem('gameforge_games') || '[]');
    const gameIndex = games.findIndex(g => g.id === editGameId && g.developer === currentUser.username);
    
    if (gameIndex === -1) {
        showNotification('游戏不存在或您没有权限编辑', 'error');
        return;
    }
    
    // 保留原有下载次数和评分
    const existingGame = games[gameIndex];
    const updatedGame = {
        ...existingGame,
        ...formData,
        downloads: existingGame.downloads || 0,
        rating: existingGame.rating || 4.5,
        updateDate: new Date().toISOString().split('T')[0]
    };
    
    games[gameIndex] = updatedGame;
    localStorage.setItem('gameforge_games', JSON.stringify(games));
    
    showNotification('游戏更新成功！', 'success');
    
    // 延迟跳转
    setTimeout(() => {
        window.location.href = 'profile.html';
    }, 2000);
}

// 处理退出登录
function handleLogout() {
    // 清除所有登录相关数据，确保完全退出
    localStorage.removeItem('gameforge_logged_in_user'); // 清除统一登录标识
    localStorage.removeItem('currentUser');              // 清除当前用户信息
    
    window.location.href = 'index.html';
}

// 取消上传
function cancelUpload() {
    if (confirm('确定要取消吗？所有未保存的更改将丢失。')) {
        window.location.href = 'profile.html';
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

// 创建唯一的通知样式
const uploadStyle = document.createElement('style');
uploadStyle.id = 'upload-notification-style';
if (!document.getElementById('upload-notification-style')) {
    uploadStyle.textContent = `
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
    document.head.appendChild(uploadStyle);
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', initUploadPage);