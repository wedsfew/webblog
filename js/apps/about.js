/**
 * 关于我应用模块
 */

const AboutApp = {
    // 应用ID
    id: 'about',
    
    // 初始化应用
    init() {
        console.log('关于我应用初始化');
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 获取技能列表
        const skillsList = document.querySelector('#about-window .skills ul');
        
        // 为技能列表项添加动画效果
        if (skillsList) {
            const skillItems = skillsList.querySelectorAll('li');
            skillItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.color = '#3498db';
                    item.style.transform = 'translateX(5px)';
                    item.style.transition = 'all 0.3s ease';
                });
                
                item.addEventListener('mouseleave', () => {
                    item.style.color = '';
                    item.style.transform = '';
                });
            });
        }
    },
    
    // 更新个人信息
    updateProfile(name, bio, skills) {
        const nameElement = document.querySelector('#about-window h2');
        const bioElements = document.querySelectorAll('#about-window .about-content > p');
        const skillsList = document.querySelector('#about-window .skills ul');
        
        // 更新名字
        if (nameElement) {
            nameElement.textContent = name;
        }
        
        // 更新简介
        if (bioElements && bioElements.length > 0) {
            bioElements[0].textContent = bio;
        }
        
        // 更新技能列表
        if (skillsList && skills && skills.length > 0) {
            // 清空现有技能
            skillsList.innerHTML = '';
            
            // 添加新技能
            skills.forEach(skill => {
                const li = document.createElement('li');
                li.textContent = skill;
                
                // 添加鼠标悬停效果
                li.addEventListener('mouseenter', () => {
                    li.style.color = '#3498db';
                    li.style.transform = 'translateX(5px)';
                    li.style.transition = 'all 0.3s ease';
                });
                
                li.addEventListener('mouseleave', () => {
                    li.style.color = '';
                    li.style.transform = '';
                });
                
                skillsList.appendChild(li);
            });
        }
    }
};

export default AboutApp;