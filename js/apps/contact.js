/**
 * 联系方式应用模块
 */

const ContactApp = {
    // 应用ID
    id: 'contact',
    
    // 初始化应用
    init() {
        console.log('联系方式应用初始化');
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 获取联系表单
        const contactForm = document.getElementById('contact-form');
        
        // 添加表单提交事件
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit(contactForm);
            });
            
            // 添加输入字段焦点效果
            const formInputs = contactForm.querySelectorAll('input, textarea');
            formInputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.borderColor = '#f39c12';
                    input.style.boxShadow = '0 0 0 3px rgba(243, 156, 18, 0.2)';
                    input.style.transition = 'all 0.3s ease';
                });
                
                input.addEventListener('blur', () => {
                    input.style.borderColor = '';
                    input.style.boxShadow = '';
                });
            });
        }
        
        // 添加社交链接效果
        const socialLinks = document.querySelectorAll('#contact-window .social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transform = 'scale(1.2)';
                link.style.color = '#d35400';
                link.style.transition = 'all 0.3s ease';
            });
            
            link.addEventListener('mouseleave', () => {
                link.style.transform = '';
                link.style.color = '';
            });
        });
    },
    
    // 处理表单提交
    handleFormSubmit(form) {
        // 获取表单数据
        const name = form.querySelector('#name').value;
        const email = form.querySelector('#email').value;
        const message = form.querySelector('#message').value;
        
        // 在实际应用中，这里会发送数据到服务器
        console.log('表单提交数据:', { name, email, message });
        
        // 显示成功消息
        alert(`表单提交成功！\n姓名: ${name}\n邮箱: ${email}\n留言: ${message}\n\n（这只是一个演示，实际上表单数据没有被发送）`);
        
        // 重置表单
        form.reset();
    },
    
    // 更新社交媒体链接
    updateSocialLinks(links) {
        const socialLinksContainer = document.querySelector('#contact-window .social-links');
        
        if (socialLinksContainer && links && links.length > 0) {
            // 清空现有链接
            socialLinksContainer.innerHTML = '';
            
            // 添加新链接
            links.forEach(link => {
                const a = document.createElement('a');
                a.href = link.url;
                a.className = 'social-link';
                a.innerHTML = `<i class="fab fa-${link.icon}"></i>`;
                
                // 添加悬停效果
                a.addEventListener('mouseenter', () => {
                    a.style.transform = 'scale(1.2)';
                    a.style.color = '#d35400';
                    a.style.transition = 'all 0.3s ease';
                });
                
                a.addEventListener('mouseleave', () => {
                    a.style.transform = '';
                    a.style.color = '';
                });
                
                socialLinksContainer.appendChild(a);
            });
        }
    }
};

export default ContactApp;