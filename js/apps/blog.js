/**
 * 博客应用模块
 */

const BlogApp = {
    // 应用ID
    id: 'blog',
    
    // 初始化应用
    init() {
        console.log('博客应用初始化');
        this.setupEventListeners();
    },
    
    // 设置事件监听器
    setupEventListeners() {
        // 获取所有"阅读更多"链接
        const readMoreLinks = document.querySelectorAll('#blog-window .read-more');
        
        // 为每个链接添加点击事件
        readMoreLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const article = link.closest('.blog-post');
                const title = article.querySelector('h2').textContent;
                alert(`你点击了"${title}"的阅读更多链接。这里可以实现文章详情页面。`);
            });
        });
    },
    
    // 添加新博客文章
    addPost(title, date, content) {
        const blogPosts = document.querySelector('#blog-window .blog-posts');
        
        // 创建新文章元素
        const article = document.createElement('article');
        article.className = 'blog-post';
        
        // 设置文章内容
        article.innerHTML = `
            <h2>${title}</h2>
            <div class="post-meta">发布于: ${date}</div>
            <p>${content}</p>
            <a href="#" class="read-more">阅读更多</a>
        `;
        
        // 为新添加的"阅读更多"链接添加事件
        const readMoreLink = article.querySelector('.read-more');
        readMoreLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert(`你点击了"${title}"的阅读更多链接。这里可以实现文章详情页面。`);
        });
        
        // 添加到博客列表
        blogPosts.prepend(article);
    }
};

// 全局暴露BlogApp对象
window.BlogApp = BlogApp;