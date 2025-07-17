/**
 * 主入口文件 - 初始化所有模块
 * 
 * 注意：所有模块都已通过script标签加载，并在window对象上全局可用
 */

// 当DOM加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 初始化桌面系统
    DesktopSystem.init();
    
    // 初始化所有应用
    BlogApp.init();
    AboutApp.init();
    ProjectsApp.init();
    ContactApp.init();
    FinderApp.init();
    
    // 为各个应用窗口添加应用初始化函数
    const blogWindow = document.getElementById('blog-window');
    if (blogWindow) {
        blogWindow.appInit = function() {
            console.log('博客窗口被打开，执行特定初始化');
        };
    }
    
    const aboutWindow = document.getElementById('about-window');
    if (aboutWindow) {
        aboutWindow.appInit = function() {
            console.log('关于我窗口被打开，执行特定初始化');
        };
    }
    
    const projectsWindow = document.getElementById('projects-window');
    if (projectsWindow) {
        projectsWindow.appInit = function() {
            console.log('项目窗口被打开，执行特定初始化');
        };
    }
    
    const contactWindow = document.getElementById('contact-window');
    if (contactWindow) {
        contactWindow.appInit = function() {
            console.log('联系方式窗口被打开，执行特定初始化');
        };
    }
    
    const finderWindow = document.getElementById('finder-window');
    if (finderWindow) {
        finderWindow.appInit = function() {
            console.log('Finder窗口被打开，执行特定初始化');
        };
    }
    
    console.log('所有应用初始化完成');
});