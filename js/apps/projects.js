/**
 * 项目应用模块
 */

const ProjectsApp = {
    // 应用ID
    id: 'projects',
    
    // 初始化应用
    init() {
        console.log('项目应用初始化');
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 获取所有项目卡片
        const projectCards = document.querySelectorAll('#projects-window .project-card');
        
        // 为每个项目卡片添加交互效果
        projectCards.forEach(card => {
            // 项目链接点击事件
            const projectLink = card.querySelector('.project-link');
            if (projectLink) {
                projectLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    const title = card.querySelector('h3').textContent;
                    alert(`你点击了"${title}"的查看详情链接。这里可以实现项目详情页面。`);
                });
            }
            
            // 卡片悬停效果
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.12)';
                card.style.transition = 'transform 0.3s, box-shadow 0.3s';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.boxShadow = '';
            });
        });
    },
    
    // 添加新项目
    addProject(title, description, imageUrl) {
        const projectsGrid = document.querySelector('#projects-window .projects-grid');
        
        // 创建新项目卡片
        const card = document.createElement('div');
        card.className = 'project-card';
        
        // 设置卡片内容
        card.innerHTML = `
            <img src="${imageUrl || 'images/project-default.jpg'}" alt="${title}">
            <h3>${title}</h3>
            <p>${description}</p>
            <a href="#" class="project-link">查看详情</a>
        `;
        
        // 为新添加的项目链接添加事件
        const projectLink = card.querySelector('.project-link');
        projectLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`你点击了"${title}"的查看详情链接。这里可以实现项目详情页面。`);
        });
        
        // 添加卡片悬停效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 12px 20px rgba(0, 0, 0, 0.12)';
            card.style.transition = 'transform 0.3s, box-shadow 0.3s';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.boxShadow = '';
        });
        
        // 添加到项目网格
        projectsGrid.appendChild(card);
    }
};

export default ProjectsApp;