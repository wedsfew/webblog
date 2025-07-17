document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const desktop = document.querySelector('.desktop');
    const startMenuButton = document.querySelector('.start-menu-button');
    const startMenu = document.querySelector('.start-menu');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const startMenuApps = document.querySelectorAll('.start-menu-app');
    const windows = document.querySelectorAll('.window');
    const taskbarItems = document.querySelector('.taskbar-items');
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');
    
    // 窗口管理
    let activeWindow = null;
    let windowZIndex = 10;
    let openWindowCount = 0; // 跟踪打开的窗口数量，用于智能定位
    
    // 更新时间和日期
    function updateDateTime() {
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
    }
    
    // 初始化时间并每分钟更新一次
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
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
    
    // 打开应用函数
    function openApp(appName) {
        // 隐藏开始菜单
        startMenu.style.display = 'none';
        
        // 获取对应窗口
        const window = document.getElementById(`${appName}-window`);
        
        if (window) {
            // 如果窗口已最小化，取消最小化
            if (window.classList.contains('minimized')) {
                window.classList.remove('minimized');
            }
            
            // 智能定位窗口
            smartPositionWindow(window);
            
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
            setActiveWindow(window);
            
            // 添加到任务栏（如果不存在）
            addToTaskbar(appName, window);
            
            // 动画结束后移除过渡效果，以便拖动不受影响
            setTimeout(() => {
                window.style.transition = '';
            }, 300);
        }
    }
    
    // 智能定位窗口函数
    function smartPositionWindow(window) {
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
            const maxOffset = 150; // 最大错开距离
            
            // 计算当前窗口的偏移量（循环偏移，避免窗口移出屏幕太远）
            const offsetIndex = openWindowCount % 5;
            const xOffset = offsetIndex * offset;
            const yOffset = offsetIndex * offset;
            
            // 应用偏移，但确保窗口不会超出屏幕
            centerX = Math.min(desktopWidth - winWidth - 20, Math.max(20, centerX + xOffset));
            centerY = Math.min(desktopHeight - winHeight - 60, Math.max(20, centerY + yOffset));
            
            // 增加打开窗口计数
            openWindowCount++;
        } else {
            // 如果是第一个窗口，重置计数
            openWindowCount = 1;
        }
        
        // 设置窗口位置
        window.style.left = centerX + 'px';
        window.style.top = centerY + 'px';
    }
    
    // 设置活动窗口
    function setActiveWindow(window) {
        // 移除其他窗口的活动状态
        windows.forEach(w => {
            w.classList.remove('active');
        });
        
        // 设置当前窗口为活动状态
        window.classList.add('active');
        activeWindow = window;
        
        // 更新z-index，确保窗口在最前层
        window.style.zIndex = ++windowZIndex;
        
        // 立即更新Dock图标状态，显示活动指示点
        updateTaskbarItems();
        
        // 添加调试信息
        const appName = window.id.replace('-window', '');
        console.log(`窗口 ${appName} 已设置为活动状态，Dock图标应显示指示点`);
    }
    
    // 添加到任务栏
    function addToTaskbar(appName, window) {
        // 检查任务栏是否已有此应用
        const existingItem = document.querySelector(`.taskbar-item[data-app="${appName}"]`);
        
        if (existingItem) {
            // 如果已存在，添加弹跳动画效果
            existingItem.classList.remove('bounce');
            void existingItem.offsetWidth; // 触发重绘
            existingItem.classList.add('bounce');
        }
        
        // 更新任务栏项目状态
        updateTaskbarItems();
    }
    
    // 更新任务栏项目状态
    function updateTaskbarItems() {
        const items = document.querySelectorAll('.taskbar-item');
        
        items.forEach(item => {
            const appName = item.getAttribute('data-app');
            const window = document.getElementById(`${appName}-window`);
            
            // 移除所有状态
            item.classList.remove('active');
            
            // 如果窗口存在且是活动的（可见且未最小化），添加活动状态
            if (window && window === activeWindow && 
                window.style.display !== 'none' && 
                !window.classList.contains('minimized')) {
                item.classList.add('active');
                console.log(`Dock图标 ${appName} 显示活动指示点`);
            }
        });
    }
    
    // 重置Dock图标状态为默认状态
    function resetDockIconState(appName) {
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
    }
    
    // 桌面图标点击事件
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            openApp(appName);
        });
    });
    
    // 开始菜单应用点击事件
    startMenuApps.forEach(app => {
        app.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            openApp(appName);
        });
    });
    
    // Dock任务栏图标点击事件
    document.querySelectorAll('.taskbar-item').forEach(item => {
        item.addEventListener('click', function() {
            const appName = this.getAttribute('data-app');
            const window = document.getElementById(`${appName}-window`);
            
            if (window) {
                if (window.style.display === 'none' || window.classList.contains('minimized')) {
                    // 如果窗口不可见或已最小化，则显示窗口
                    window.style.display = 'flex';
                    window.classList.remove('minimized');
                    setActiveWindow(window);
                } else if (window === activeWindow) {
                    // 如果点击的是当前活动窗口的图标��则最小化窗口
                    window.classList.add('minimized');
                } else {
                    // 否则，将窗口设为活动窗口
                    setActiveWindow(window);
                }
            } else if (appName === 'finder') {
                // 特殊处理：Finder图标
                alert('文件浏览器功能尚未实现');
                
                // 添加弹跳动画效果
                this.classList.remove('bounce');
                void this.offsetWidth; // 触发重绘
                this.classList.add('bounce');
            }
        });
        
        // 添加鼠标悬停效果
        item.addEventListener('mouseenter', function() {
            this.classList.add('hover');
        });
        
        item.addEventListener('mouseleave', function() {
            this.classList.remove('hover');
        });
    });
    
    // 窗口控制按钮事件
    windows.forEach(window => {
        // 获取窗口控制按钮
        const closeBtn = window.querySelector('.close');
        const minimizeBtn = window.querySelector('.minimize');
        const maximizeBtn = window.querySelector('.maximize');
        const header = window.querySelector('.window-header');
        
        // 点击窗口设置为活动窗口
        window.addEventListener('mousedown', function() {
            setActiveWindow(this);
        });
        
        // 关闭按钮
        closeBtn.addEventListener('click', function() {
            window.style.display = 'none';
            
            // 获取应用名称
            const appName = window.id.replace('-window', '');
            
            // 如果关闭的是当前活动窗口，清除活动窗口引用
            if (window === activeWindow) {
                activeWindow = null;
            }
            
            // 重置对应Dock图标状态为默认状态
            resetDockIconState(appName);
            
            // 更新任务栏项目状态（不删除图标，只更新状态）
            updateTaskbarItems();
        });
        
        // 最小化按钮
        minimizeBtn.addEventListener('click', function() {
            window.classList.add('minimized');
            updateTaskbarItems();
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
        
        header.addEventListener('mousedown', function(e) {
            // 如果窗口已最大化，不允许拖动
            if (window.classList.contains('maximized')) {
                return;
            }
            
            isDragging = true;
            offsetX = e.clientX - window.getBoundingClientRect().left;
            offsetY = e.clientY - window.getBoundingClientRect().top;
            
            // 设置为活动窗口
            setActiveWindow(window);
        });
        
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                window.style.left = (e.clientX - offsetX) + 'px';
                window.style.top = (e.clientY - offsetY) + 'px';
            }
        });
        
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
        
        // 初始化窗口位置（居中显示）
        function centerWindow(win) {
            // 获取窗口和桌面尺寸
            const winWidth = win.offsetWidth || 500; // 默认宽度
            const winHeight = win.offsetHeight || 400; // 默认高度
            const desktopWidth = desktop.clientWidth;
            const desktopHeight = desktop.clientHeight;
            
            // 计算居中位置
            const centerX = Math.max(0, (desktopWidth - winWidth) / 2);
            const centerY = Math.max(0, (desktopHeight - winHeight) / 2);
            
            // 设置窗口位置
            win.style.left = centerX + 'px';
            win.style.top = centerY + 'px';
        }
        
        // 应用居中位置
        centerWindow(window);
    });
    
    // 为窗口内容添加阻止冒泡，防止点击内容时触发拖动
    document.querySelectorAll('.window-content').forEach(content => {
        content.addEventListener('mousedown', function(e) {
            e.stopPropagation();
        });
    });
    
    // 联系表单提交事件
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('表单提交成功！（这只是一个演示，实际上表单数据没有被发送）');
            this.reset();
        });
    }
});    

    // 初始化Dock任务栏交互效果
    function initializeDockInteractions() {
        // 为所有Dock图标添加点击事件
        document.querySelectorAll('.taskbar-item').forEach(item => {
            // 移除之前可能存在的事件监听器
            item.removeEventListener('click', handleDockItemClick);
            item.removeEventListener('mouseenter', handleDockItemHover);
            item.removeEventListener('mouseleave', handleDockItemLeave);
            
            // 添加新的事件监听器
            item.addEventListener('click', handleDockItemClick);
            item.addEventListener('mouseenter', handleDockItemHover);
            item.addEventListener('mouseleave', handleDockItemLeave);
        });
    }
    
    // Dock图标点击处理函数
    function handleDockItemClick(event) {
        const appName = this.getAttribute('data-app');
        const appWindow = document.getElementById(`${appName}-window`);
        
        // 添加点击弹跳动画效果
        this.classList.remove('bounce');
        void this.offsetWidth; // 触发重绘
        this.classList.add('bounce');
        
        if (appWindow) {
            if (appWindow.style.display === 'none' || appWindow.classList.contains('minimized')) {
                // 如果窗口不可见或已最小化，则打开窗口
                openApp(appName);
            } else if (appWindow === activeWindow) {
                // 如果点击的是当前活动窗口的图标，则最小化窗口
                appWindow.classList.add('minimized');
                updateTaskbarItems();
            } else {
                // 否则，将窗口设为活动窗口
                setActiveWindow(appWindow);
            }
        } else if (appName === 'finder') {
            // 特殊处理：Finder图标
            console.log('Finder功能尚未实现');
        } else {
            // 对于其他应用，尝试打开
            openApp(appName);
        }
    }
    
    // Dock图标悬停处理函数
    function handleDockItemHover(event) {
        if (!this.classList.contains('bounce')) {
            // 应用macOS风格的缩放效果给相邻图标
            applyMacOSHoverEffect(this);
        }
    }
    
    // Dock图标离开处理函数
    function handleDockItemLeave(event) {
        if (!this.classList.contains('bounce')) {
            // 移除所有悬浮效果
            removeMacOSHoverEffect();
        }
    }
    
    // 应用macOS风格的悬浮缩放效果
    function applyMacOSHoverEffect(hoveredItem) {
        const allItems = document.querySelectorAll('.taskbar-item');
        const hoveredIndex = Array.from(allItems).indexOf(hoveredItem);
        
        allItems.forEach((item, index) => {
            // 移除之前的效果类
            item.classList.remove('neighbor-hover', 'distant-neighbor-hover');
            
            if (index === hoveredIndex) {
                // 当前悬浮的图标 - 使用CSS的hover效果
                return;
            }
            
            const distance = Math.abs(index - hoveredIndex);
            
            if (distance === 1) {
                // 相邻图标 - 中等缩放
                item.classList.add('neighbor-hover');
            } else if (distance === 2) {
                // 更远的相邻图标 - 轻微缩放
                item.classList.add('distant-neighbor-hover');
            }
        });
    }
    
    // 移除macOS风格的悬浮效果
    function removeMacOSHoverEffect() {
        const allItems = document.querySelectorAll('.taskbar-item');
        
        allItems.forEach(item => {
            item.classList.remove('neighbor-hover', 'distant-neighbor-hover');
        });
    }
    
    // 初始化Dock交互效果
    initializeDockInteractions();