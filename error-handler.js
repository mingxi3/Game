// 全局错误处理脚本
// 用于捕获和处理JavaScript错误，防止页面崩溃

// 1. 全局错误处理
window.addEventListener('error', function(e) {
    console.error('全局错误捕获:', e.error);
    console.error('错误信息:', e.message);
    console.error('错误文件:', e.filename);
    console.error('错误行号:', e.lineno);
    
    // 防止页面崩溃
    e.preventDefault();
});

// 2. 未处理的Promise错误
window.addEventListener('unhandledrejection', function(e) {
    console.error('未处理的Promise错误:', e.reason);
    e.preventDefault();
});

// 3. 安全获取DOM元素的函数
function safeGetElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`警告：元素ID "${id}" 未找到`);
        return null;
    }
    return element;
}

// 4. 安全设置innerHTML的函数
function safeSetInnerHTML(id, content) {
    const element = safeGetElement(id);
    if (element) {
        element.innerHTML = content;
    }
}

// 5. 安全设置textContent的函数
function safeSetTextContent(id, content) {
    const element = safeGetElement(id);
    if (element) {
        element.textContent = content;
    }
}

// 6. 检查所有必需的DOM元素
function checkRequiredElements() {
    const requiredElements = [
        'username', 'user-email', 'downloaded-count', 'uploaded-count', 'join-date',
        'downloaded-games', 'uploaded-games', 'edit-modal', 'edit-username', 
        'edit-email', 'edit-password', 'total-uploads', 'total-downloads', 'avg-rating',
        'player-section', 'developer-section', 'developer-btn'
    ];
    
    const missingElements = [];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            missingElements.push(id);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('以下元素未找到:', missingElements);
        return false;
    }
    
    console.log('所有必需元素检查通过');
    return true;
}

// 7. 修复字体加载问题
function fixFontLoading() {
    // 创建备用字体样式
    const style = document.createElement('style');
    style.textContent = `
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Microsoft YaHei', sans-serif !important;
        }
        .logo-text, .hero-title, .section-title {
            font-family: 'Arial Black', 'Microsoft YaHei', sans-serif !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('字体加载问题已修复');
}

// 8. 防重定向保护
let redirectCount = 0;
const MAX_REDIRECTS = 3;

function safeRedirect(url) {
    redirectCount++;
    if (redirectCount > MAX_REDIRECTS) {
        console.error('检测到重定向循环，已阻止');
        return;
    }
    
    console.log('安全重定向到:', url);
    setTimeout(() => {
        window.location.href = url;
    }, 100);
}

// 9. 替换原来的重定向函数
window.safeLocation = {
    href: function(url) {
        if (url && !url.includes('auth.html?redirect=profile.html') && 
            !window.location.href.includes('auth.html')) {
            safeRedirect(url);
        }
    }
};

// 10. 初始化检查
function initializeWithErrorHandling() {
    console.log('=== 开始错误检查和修复 ===');
    
    // 修复字体加载
    fixFontLoading();
    
    // 检查DOM元素
    const elementsReady = checkRequiredElements();
    
    if (elementsReady) {
        console.log('页面初始化准备就绪');
        return true;
    } else {
        console.error('页面初始化失败，缺少必要元素');
        return false;
    }
}

// 11. 页面加载完成后执行
window.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始错误检查...');
    initializeWithErrorHandling();
});

// 12. 导出全局函数
window.ErrorHandler = {
    safeGetElement,
    safeSetInnerHTML,
    safeSetTextContent,
    checkRequiredElements,
    fixFontLoading,
    safeRedirect
};