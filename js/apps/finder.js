/**
 * Finder应用模块 - 文件浏览器
 */

const FinderApp = {
    // 应用ID
    id: 'finder',
    
    // 文件系统数据
    fileSystem: {
        documents: {
            type: 'folder',
            children: {
                'resume.pdf': { type: 'file', size: '1.2 MB', modified: '2025-07-10' },
                'notes.txt': { type: 'file', size: '15 KB', modified: '2025-07-15' }
            }
        },
        images: {
            type: 'folder',
            children: {
                'profile.jpg': { type: 'file', size: '2.5 MB', modified: '2025-06-20' },
                'background.png': { type: 'file', size: '4.8 MB', modified: '2025-07-01' }
            }
        },
        projects: {
            type: 'folder',
            children: {
                'website': { 
                    type: 'folder',
                    children: {
                        'index.html': { type: 'file', size: '8 KB', modified: '2025-07-12' },
                        'style.css': { type: 'file', size: '4 KB', modified: '2025-07-12' }
                    }
                },
                'app': { 
                    type: 'folder',
                    children: {
                        'main.js': { type: 'file', size: '12 KB', modified: '2025-07-05' }
                    }
                }
            }
        }
    },
    
    // 当前路径
    currentPath: [],
    
    // 初始化应用
    init() {
        console.log('Finder应用初始化');
        this.createFinderWindow();
    },
    
    // 创建Finder窗口
    createFinderWindow() {
        // 检查是否已存在Finder窗口
        let finderWindow = document.getElementById('finder-window');
        
        if (!finderWindow) {
            // 创建Finder窗口
            finderWindow = document.createElement('div');
            finderWindow.id = 'finder-window';
            finderWindow.className = 'window';
            finderWindow.style.display = 'none';
            
            // 创建窗口内容
            finderWindow.innerHTML = `
                <div class="window-header">
                    <div class="window-title">Finder</div>
                    <div class="window-controls">
                        <span class="minimize"><i class="fas fa-minus"></i></span>
                        <span class="maximize"><i class="fas fa-expand"></i></span>
                        <span class="close"><i class="fas fa-times"></i></span>
                    </div>
                </div>
                <div class="window-content">
                    <div class="finder-toolbar">
                        <button class="back-button" disabled><i class="fas fa-arrow-left"></i></button>
                        <div class="path-display">主目录</div>
                    </div>
                    <div class="finder-content">
                        <div class="sidebar">
                            <div class="sidebar-item" data-path="documents">
                                <i class="fas fa-folder"></i> 文档
                            </div>
                            <div class="sidebar-item" data-path="images">
                                <i class="fas fa-folder"></i> 图片
                            </div>
                            <div class="sidebar-item" data-path="projects">
                                <i class="fas fa-folder"></i> 项目
                            </div>
                        </div>
                        <div class="files-container"></div>
                    </div>
                </div>
            `;
            
            // 添加到窗口容器
            const windowsContainer = document.querySelector('.windows-container');
            if (windowsContainer) {
                windowsContainer.appendChild(finderWindow);
            } else {
                document.querySelector('.desktop').appendChild(finderWindow);
            }
            
            // 添加样式
            this.addFinderStyles();
            
            // 设置事件监听器
            this.setupEventListeners();
            
            // 显示根目录内容
            this.displayFolderContents();
        }
    },
    
    // 添加Finder样式
    addFinderStyles() {
        // 检查是否已存在样式
        if (!document.getElementById('finder-styles')) {
            const styleElement = document.createElement('style');
            styleElement.id = 'finder-styles';
            styleElement.textContent = `
                .finder-toolbar {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background-color: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                }
                
                .back-button {
                    background: none;
                    border: none;
                    cursor: pointer;
                    padding: 5px 10px;
                    margin-right: 10px;
                    border-radius: 4px;
                }
                
                .back-button:not([disabled]):hover {
                    background-color: #e0e0e0;
                }
                
                .back-button[disabled] {
                    opacity: 0.5;
                    cursor: default;
                }
                
                .path-display {
                    flex-grow: 1;
                    padding: 5px 10px;
                    background-color: white;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
                
                .finder-content {
                    display: flex;
                    height: calc(100% - 50px);
                }
                
                .sidebar {
                    width: 150px;
                    background-color: #f0f0f0;
                    padding: 10px;
                    overflow-y: auto;
                }
                
                .sidebar-item {
                    padding: 8px;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-bottom: 5px;
                }
                
                .sidebar-item:hover {
                    background-color: #e0e0e0;
                }
                
                .sidebar-item.active {
                    background-color: #d0d0d0;
                }
                
                .files-container {
                    flex-grow: 1;
                    padding: 15px;
                    overflow-y: auto;
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
                    grid-gap: 15px;
                }
                
                .file-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    cursor: pointer;
                    padding: 10px;
                    border-radius: 5px;
                    text-align: center;
                }
                
                .file-item:hover {
                    background-color: #f0f0f0;
                }
                
                .file-item i {
                    font-size: 2em;
                    margin-bottom: 5px;
                }
                
                .file-item .file-name {
                    font-size: 0.9em;
                    max-width: 100%;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                
                .file-item .file-info {
                    font-size: 0.8em;
                    color: #777;
                }
            `;
            
            document.head.appendChild(styleElement);
        }
    },
    
    // 设置事件监听器
    setupEventListeners() {
        const finderWindow = document.getElementById('finder-window');
        
        if (finderWindow) {
            // 侧边栏项目点击事件
            const sidebarItems = finderWindow.querySelectorAll('.sidebar-item');
            sidebarItems.forEach(item => {
                item.addEventListener('click', () => {
                    const path = item.getAttribute('data-path');
                    this.currentPath = [path];
                    this.displayFolderContents();
                    
                    // 更新活动状态
                    sidebarItems.forEach(i => i.classList.remove('active'));
                    item.classList.add('active');
                });
            });
            
            // 后退按钮点击事件
            const backButton = finderWindow.querySelector('.back-button');
            backButton.addEventListener('click', () => {
                if (this.currentPath.length > 0) {
                    this.currentPath.pop();
                    this.displayFolderContents();
                }
            });
        }
    },
    
    // 显示文件夹内容
    displayFolderContents() {
        const finderWindow = document.getElementById('finder-window');
        
        if (finderWindow) {
            const filesContainer = finderWindow.querySelector('.files-container');
            const pathDisplay = finderWindow.querySelector('.path-display');
            const backButton = finderWindow.querySelector('.back-button');
            
            // 清空文件容器
            filesContainer.innerHTML = '';
            
            // 获取当前目录
            let currentDir = this.fileSystem;
            let pathString = '主目录';
            
            // 遍历路径
            for (const segment of this.currentPath) {
                if (currentDir[segment] && currentDir[segment].type === 'folder') {
                    currentDir = currentDir[segment].children;
                    pathString += ` > ${segment}`;
                } else {
                    console.error('无效路径:', segment);
                    return;
                }
            }
            
            // 更新路径显示
            pathDisplay.textContent = pathString;
            
            // 更新后退按钮状态
            backButton.disabled = this.currentPath.length === 0;
            
            // 显示文件和文件夹
            for (const [name, item] of Object.entries(currentDir)) {
                const fileItem = document.createElement('div');
                fileItem.className = 'file-item';
                
                if (item.type === 'folder') {
                    fileItem.innerHTML = `
                        <i class="fas fa-folder"></i>
                        <div class="file-name">${name}</div>
                    `;
                    
                    // 文件夹点击事件
                    fileItem.addEventListener('click', () => {
                        this.currentPath.push(name);
                        this.displayFolderContents();
                    });
                } else {
                    // 根据文件扩展名选择图标
                    let iconClass = 'fa-file';
                    if (name.endsWith('.pdf')) iconClass = 'fa-file-pdf';
                    else if (name.endsWith('.txt')) iconClass = 'fa-file-alt';
                    else if (name.endsWith('.jpg') || name.endsWith('.png')) iconClass = 'fa-file-image';
                    else if (name.endsWith('.html')) iconClass = 'fa-file-code';
                    else if (name.endsWith('.css')) iconClass = 'fa-file-code';
                    else if (name.endsWith('.js')) iconClass = 'fa-file-code';
                    
                    fileItem.innerHTML = `
                        <i class="fas ${iconClass}"></i>
                        <div class="file-name">${name}</div>
                        <div class="file-info">${item.size} · ${item.modified}</div>
                    `;
                    
                    // 文件点击事件
                    fileItem.addEventListener('click', () => {
                        alert(`打开文件: ${name}\n大小: ${item.size}\n修改日期: ${item.modified}`);
                    });
                }
                
                filesContainer.appendChild(fileItem);
            }
        }
    }
};

// 全局暴露FinderApp对象
window.FinderApp = FinderApp;