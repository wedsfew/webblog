/**
 * 核心系统模块 - 提供基础的桌面和窗口管理功能
 */

const DesktopSystem = {
    // 系统状态
    state: {
        activeWindow: null,
        windowZIndex: 10,
        openWindowCount: 0
    },
    
    // 初始化系统
    init() {
        this.initDateTime();
        this.initStartMenu();
        this.initWindowEvents();
        this.initDockInteractions();
    },
    
    // 初始化时间和日期显示
    initDateTime() {
        const timeElement = document.getElementById('current-time');
        const dateElement = document.getElementById('current-date');
        
        const updateDateTime = () => {
            const now = new Date();
            
            // 格式化时间 (HH:MM)
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            timeElement.textContent = `${hours}:${minutes}`;
            
            // 格式化日期 (YYYY-MM-DD)
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const day = String(now.getDate()).padStart(2, '0');
            dateElement.textContent = `${year}-${month}-${day}`;
        };
        
        // 初始化时间并每分钟更新一次
        updateDateTime();
        setInterval(updateDateTime, 60000);
    },
    
    // 初始化开始菜单
    initStartMenu() {
        const desktop = document.querySelector('.desktop');
        const startMenuButton = document.querySelector('.start-menu-button');
        const startMenu = document.querySelector('.start-menu');
        
        // 开始菜单切换
        startMenuButton.addEventListener('click', function() {
            if (startMenu.style.display === 'none' || !startMenu.style.display) {
                startMenu.style.display = 'block';
            } else {
                startMenu.style.display = 'none';
            }
        });
        
        // 点击桌面其他区域关闭开始菜单
        desktop.addEventListener('click', function(e) {
            if (!startMenu.contains(e.target) && !startMenuButton.contains(e.target)) {
                startMenu.style.display = 'none';
            }
        });
        
        // 开始菜单应用点击事件
        const startMenuApps = document.querySelectorAll('.start-menu-app');
        startMenuApps.forEach(app => {
            app.addEventListener('click', (e) => {
                const appName = app.getAttribute('data-app');
                this.openApp(appName);
            });
        });
    },
    
    // 初始化窗口事件
    initWindowEvents() {
        const windows = document.querySelectorAll('.window');
        
        windows.forEach(window => {
            // 获取窗口控制按钮
            const closeBtn = window.querySelector('.close');
            const minimizeBtn = window.querySelector('.minimize');
            const maximizeBtn = window.querySelector('.maximize');
            const header = window.querySelector('.window-header');
            
            // 点击窗口设置为活动窗口
            window.addEventListener('mousedown', () => {
                this.setActiveWindow(window);
            });
            
            // 关闭按钮
            closeBtn.addEventListener('click', () => {
                window.style.display = 'none';
                
                // 获取应用名称
                const appName = window.id.replace('-window', '');
                
                // 如果关闭的是当前活动窗口，清除活动窗口引用
                if (window === this.state.activeWindow) {
                    this.state.activeWindow = null;
                }
                
                // 重置对应Dock图标状态为默认状态
                this.resetDockIconState(appName);
                
                // 更新任务栏项目状态（不删除图标，只更新状态）
                this.updateTaskbarItems();
            });
            
            // 最小化按钮
            minimizeBtn.addEventListener('click', () => {
                window.classList.add('minimized');
                this.updateTaskbarItems();
            });
            
            // 最大化/还原按钮
            maximizeBtn.addEventListener('click', function() {
                window.classList.toggle('maximized');
                
                // 更新按钮图标
                if (window.classList.contains('maximized')) {
                    this.innerHTML = '<i class="fas fa-compress"></i>';
                } else {
                    this.innerHTML = '<i class="fas fa-expand"></i>';
                }
            });
            
            // 窗口拖动
            let isDragging = false;
            let offsetX, offsetY;
            
            header.addEventListener('mousedown', (e) => {
                // 如果窗口已最大化，不允许拖动
                if (window.classList.contains('maximized')) {
                    return;
                }
                
                isDragging = true;
                offsetX = e.clientX - window.getBoundingClientRect().left;
                offsetY = e.clientY - window.getBoundingClientRect().top;
                
                // 设置为活动窗口
                this.setActiveWindow(window);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    window.style.left = (e.clientX - offsetX) + 'px';
                    window.style.top = (e.clientY - offsetY) + 'px';
                }
            });
            
            document.addEventListener('mouseup', () => {
                isDragging = false;
            });
            
            // 初始化窗口位置（居中显示）
            this.centerWindow(window);
        });
        
        // 为窗口内容添加点击事件，使窗口显示在最前
        document.querySelectorAll('.window-content').forEach(content => {
            content.addEventListener('mousedown', (e) => {
                // 阻止冒泡，防止触发拖动
                e.stopPropagation();
                
                // 获取当前窗口元素（向上查找最近的.window父元素）
                const windowElement = content.closest('.window');
                if (windowElement) {
                    // 设置为活动窗口，显示在最前
                    this.setActiveWindow(windowElement);
                }
            });
        });
    },
    
    // 初始化Dock交互
    initDockInteractions() {
        // 桌面图标点击事件
        const desktopIcons = document.querySelectorAll('.desktop-icon');
        desktopIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                const appName = icon.getAttribute('data-app');
                this.openApp(appName);
            });
        });
        
        // Dock任务栏图标点击事件
        document.querySelectorAll('.taskbar-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const appName = item.getAttribute('data-app');
                const appWindow = document.getElementById(`${appName}-window`);
                
                // 添加点击弹跳动画效果
                item.classList.remove('bounce');
                void item.offsetWidth; // 触发重绘
                item.classList.add('bounce');
                
                if (appWindow) {
                    if (appWindow.style.display === 'none' || appWindow.classList.contains('minimized')) {
                        // 如果窗口不可见或已最小化，则打开窗口
                        this.openApp(appName);
                    } else if (appWindow === this.state.activeWindow) {
                        // 如果点击的是当前活动窗口的图标，则最小化窗口
                        appWindow.classList.add('minimized');
                        this.updateTaskbarItems();
                    } else {
                        // 否则，将窗口设为活动窗口
                        this.setActiveWindow(appWindow);
                    }
                } else {
                    // 对于其他应用，尝试打开
                    this.openApp(appName);
                }
            });
        });
    },
    
    // 打开应用
    openApp(appName) {
        // 隐藏开始菜单
        document.querySelector('.start-menu').style.display = 'none';
        
        // 获取对应窗口
        const window = document.getElementById(`${appName}-window`);
        
        if (window) {
            // 如果窗口已最小化，取消最小化
            if (window.classList.contains('minimized')) {
                window.classList.remove('minimized');
            }
            
            // 智能定位窗口
            this.smartPositionWindow(window);
            
            // 显示窗口并添加动画效果
            window.style.opacity = '0';
            window.style.transform = 'scale(0.9)';
            window.style.display = 'flex';
            
            // 添加动画效果
            setTimeout(() => {
                window.style.transition = 'opacity 0.2s ease-out, transform 0.2s ease-out';
                window.style.opacity = '1';
                window.style.transform = 'scale(1)';
            }, 10);
            
            // 设置为活动窗口
            this.setActiveWindow(window);
            
            // 添加到任务栏（如果不存在）
            this.addToTaskbar(appName, window);
            
            // 动画结束后移除过渡效果，以便拖动不受影响
            setTimeout(() => {
                window.style.transition = '';
            }, 300);
            
            // 触发应用特定的初始化函数（如果存在）
            if (window.appInit && typeof window.appInit === 'function') {
                window.appInit();
            }
        }
    },
    
    // 智能定位窗口
    smartPositionWindow(window) {
        const desktop = document.querySelector('.desktop');
        const windows = document.querySelectorAll('.window');
        
        // 获取窗口和桌面尺寸
        const winWidth = window.offsetWidth || 500;
        const winHeight = window.offsetHeight || 400;
        const desktopWidth = desktop.clientWidth;
        const desktopHeight = desktop.clientHeight;
        
        // 基础居中位置
        let centerX = Math.max(0, (desktopWidth - winWidth) / 2);
        let centerY = Math.max(0, (desktopHeight - winHeight) / 2);
        
        // 检查是否已有其他窗口打开
        const visibleWindows = Array.from(windows).filter(w => 
            w.style.display !== 'none' && !w.classList.contains('minimized') && w !== window
        );
        
        if (visibleWindows.length > 0) {
            // 根据已打开窗口数量计算偏移量
            const offset = 30; // 每个窗口错开的像素
            
            // 计算当前窗口的偏移量（循环偏移，避免窗口移出屏幕太远）
            const offsetIndex = this.state.openWindowCount % 5;
            const xOffset = offsetIndex * offset;
            const yOffset = offsetIndex * offset;
            
            // 应用偏移，但确保窗口不会超出屏幕
            centerX = Math.min(desktopWidth - winWidth - 20, Math.max(20, centerX + xOffset));
            centerY = Math.min(desktopHeight - winHeight - 60, Math.max(20, centerY + yOffset));
            
            // 增加打开窗口计数
            this.state.openWindowCount++;
        } else {
            // 如果是第一个窗口，重置计数
            this.state.openWindowCount = 1;
        }
        
        // 设置窗口位置
        window.style.left = centerX + 'px';
        window.style.top = centerY + 'px';
    },
    
    // 设置活动窗口
    setActiveWindow(window) {
        const windows = document.querySelectorAll('.window');
        
        // 移除其他窗口的活动状态
        windows.forEach(w => {
            w.classList.remove('active');
        });
        
        // 设置当前窗口为活动状态
        window.classList.add('active');
        this.state.activeWindow = window;
        
        // 更新z-index，确保窗口在最前层
        window.style.zIndex = ++this.state.windowZIndex;
        
        // 立即更新Dock图标状态，显示活动指示点
        this.updateTaskbarItems();
        
        // 添加调试信息
        const appName = window.id.replace('-window', '');
        console.log(`窗口 ${appName} 已设置为活动状态，Dock图标应显示指示点`);
    },
    
    // 添加到任务栏
    addToTaskbar(appName, window) {
        // 检查任务栏是否已有此应用
        const existingItem = document.querySelector(`.taskbar-item[data-app="${appName}"]`);
        
        if (existingItem) {
            // 如果已存在，添加弹跳动画效果
            existingItem.classList.remove('bounce');
            void existingItem.offsetWidth; // 触发重绘
            existingItem.classList.add('bounce');
        }
        
        // 更新任务栏项目状态
        this.updateTaskbarItems();
    },
    
    // 更新任务栏项目状态
    updateTaskbarItems() {
        const items = document.querySelectorAll('.taskbar-item');
        
        items.forEach(item => {
            const appName = item.getAttribute('data-app');
            const window = document.getElementById(`${appName}-window`);
            
            // 移除所有状态
            item.classList.remove('active');
            
            // 如果窗口存在且是活动的（可见且未最小化），添加活动状态
            if (window && window === this.state.activeWindow && 
                window.style.display !== 'none' && 
                !window.classList.contains('minimized')) {
                item.classList.add('active');
                console.log(`Dock图标 ${appName} 显示活动指示点`);
            }
        });
    },
    
    // 重置Dock图标状态为默认状态
    resetDockIconState(appName) {
        const dockIcon = document.querySelector(`.taskbar-item[data-app="${appName}"]`);
        
        if (dockIcon) {
            // 移除所有状态类
            dockIcon.classList.remove('active', 'bounce', 'hover');
            
            // 重置所有样式变换
            dockIcon.style.transform = '';
            dockIcon.style.transition = '';
            dockIcon.style.opacity = '';
            dockIcon.style.scale = '';
            
            // 确保图标回到默认外观
            setTimeout(() => {
                dockIcon.classList.remove('bounce');
                // 强制重置为默认状态
                dockIcon.style.cssText = '';
            }, 100);
            
            console.log(`已重置 ${appName} 图标状态为默认状态`);
        }
    },
    
    // 居中窗口
    centerWindow(window) {
        const desktop = document.querySelector('.desktop');
        
        // 获取窗口和桌面尺寸
        const winWidth = window.offsetWidth || 500; // 默认宽度
        const winHeight = window.offsetHeight || 400; // 默认高度
        const desktopWidth = desktop.clientWidth;
        const desktopHeight = desktop.clientHeight;
        
        // 计算居中位置
        const centerX = Math.max(0, (desktopWidth - winWidth) / 2);
        const centerY = Math.max(0, (desktopHeight - winHeight) / 2);
        
        // 设置窗口位置
        window.style.left = centerX + 'px';
        window.style.top = centerY + 'px';
    },
    
    // Dock图标悬停处理函数 - 简化版，无缩放效果
    handleDockItemHover() {
        // 不执行任何缩放操作
    },
    
    // Dock图标离开处理函数 - 简化版，无缩放效果
    handleDockItemLeave() {
        // 不执行任何缩放操作
    },
    
    // 空函数，保留API兼容性
    applyMacOSHoverEffect() {
        // 不执行任何缩放操作
    },
    
    // 空函数，保留API兼容性
    removeMacOSHoverEffect() {
        // 不执行任何缩放操作
    }
};

// 全局暴露DesktopSystem对象
window.DesktopSystem = DesktopSystem;