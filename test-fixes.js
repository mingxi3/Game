// 测试修复效果的JavaScript文件
// 这个文件用于验证所有修复是否生效

// 测试函数：检查DOM元素是否存在
function testDOMElements() {
    console.log('=== 开始DOM元素检查 ===');
    
    // 检查关键元素是否存在
    const elements = [
        'username', 'user-email', 'downloaded-count', 'uploaded-count', 'join-date',
        'downloaded-games', 'uploaded-games', 'edit-modal', 'edit-username', 
        'edit-email', 'edit-password', 'total-uploads', 'total-downloads', 'avg-rating'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✅ 元素 ${id} 找到`);
        } else {
            console.error(`❌ 元素 ${id} 未找到`);
        }
    });
}

// 测试函数：检查变量命名冲突
function testVariableConflicts() {
    console.log('=== 检查变量命名冲突 ===');
    
    // 检查全局作用域中的变量
    if (typeof style !== 'undefined') {
        console.error('❌ 发现全局style变量冲突');
    } else {
        console.log('✅ 未发现全局style变量冲突');
    }
}

// 测试函数：验证函数定义
function testFunctionDefinitions() {
    console.log('=== 检查函数定义 ===');
    
    const functions = [
        'editProfile', 'closeModal', 'saveProfile', 'openEditModal', 
        'closeEditModal', 'handleProfileEdit', 'updateUserInfo', 
        'updateUserStats', 'updateDeveloperStats', 'renderUserGames', 
        'renderDownloadedGames'
    ];
    
    functions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            console.log(`✅ 函数 ${funcName} 已定义`);
        } else {
            console.error(`❌ 函数 ${funcName} 未定义`);
        }
    });
}

// 页面加载时自动执行测试
window.addEventListener('DOMContentLoaded', function() {
    console.log('=== 开始修复验证测试 ===');
    
    // 等待页面完全加载
    setTimeout(() => {
        // 执行所有测试
        const domTest = testDOMElements();
        const variableTest = testVariableConflicts();
        const functionTest = testFunctionDefinitions();
        
        // 检查重定向保护
        const redirectTest = !window.location.href.includes('auth.html') && 
                           !window.location.href.includes('profile.html?redirect');
        
        if (domTest && variableTest && functionTest && redirectTest) {
            console.log('✅ 所有修复验证通过！');
            console.log('页面现在应该稳定运行，无闪烁和跳转');
        } else {
            console.error('❌ 部分修复验证失败，请检查控制台输出');
        }
    }, 500); // 延迟500ms确保所有脚本加载完成
});

// 导出测试函数供其他文件使用
window.TestFixes = {
    testDOMElements,
    testVariableConflicts,
    testFunctionDefinitions
};