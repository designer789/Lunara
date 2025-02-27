// Add some interactivity and animation
document.addEventListener('DOMContentLoaded', () => {
    // Create starry background effect
    const stars = document.querySelector('.stars');
    
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        stars.appendChild(star);
    }
});

// 轮播功能
class Carousel {
    constructor(containerId, itemsCount) {
        this.container = document.getElementById(containerId);
        this.grid = this.container.querySelector('.feature-grid, .advantage-grid');
        this.itemsCount = itemsCount;
        this.currentIndex = 0;
        
        // 获取/创建元素
        this.prevBtn = document.querySelector(`button[data-carousel="${containerId}"].prev-btn`);
        this.nextBtn = document.querySelector(`button[data-carousel="${containerId}"].next-btn`);
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'carousel-dots';
        this.container.appendChild(this.dotsContainer);
        
        // 拖拽相关变量
        this.isDragging = false;
        this.startPos = 0;
        this.currentTranslate = 0;
        this.prevTranslate = 0;
        
        // 初始化
        this.updateVisibleItems();
        this.createDots();
        this.updateButtons();
        this.addEventListeners();
        this.updateCarousel();
    }
    
    createDots() {
        const dotsCount = this.itemsCount - this.visibleItems + 1;
        this.dotsContainer.innerHTML = '';
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
        this.updateDots();
    }
    
    updateDots() {
        const dots = this.dotsContainer.children;
        Array.from(dots).forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentIndex);
        });
    }
    
    goToSlide(index) {
        this.currentIndex = index;
        this.updateCarousel();
        this.updateButtons();
        this.updateDots();
    }
    
    updateVisibleItems() {
        const width = window.innerWidth;
        if (width < 768) {
            this.visibleItems = 1;
            this.slideWidth = 100;
        } else if (width < 1200) {
            this.visibleItems = 2;
            this.slideWidth = 50;
        } else {
            this.visibleItems = 3;
            this.slideWidth = 33.333;
        }
    }
    
    updateButtons() {
        this.prevBtn.disabled = this.currentIndex === 0;
        this.nextBtn.disabled = this.currentIndex >= this.itemsCount - this.visibleItems;
    }
    
    addEventListeners() {
        // 原有的按钮事件
        this.prevBtn.addEventListener('click', () => this.prev());
        this.nextBtn.addEventListener('click', () => this.next());
        
        // 拖拽事件
        this.grid.addEventListener('mousedown', this.startDragging.bind(this));
        this.grid.addEventListener('touchstart', this.startDragging.bind(this));
        this.grid.addEventListener('mousemove', this.drag.bind(this));
        this.grid.addEventListener('touchmove', this.drag.bind(this));
        this.grid.addEventListener('mouseup', this.endDragging.bind(this));
        this.grid.addEventListener('touchend', this.endDragging.bind(this));
        this.grid.addEventListener('mouseleave', this.endDragging.bind(this));
        
        // 响应式处理
        window.addEventListener('resize', () => {
            this.updateVisibleItems();
            this.currentIndex = Math.min(this.currentIndex, this.itemsCount - this.visibleItems);
            this.createDots();
            this.updateButtons();
            this.updateCarousel();
        });
    }
    
    startDragging(e) {
        this.isDragging = true;
        this.startPos = this.getPositionX(e);
        this.grid.style.transition = 'none';
        this.grid.style.cursor = 'grabbing';
    }
    
    drag(e) {
        if (!this.isDragging) return;
        e.preventDefault();
        
        const currentPosition = this.getPositionX(e);
        const diff = currentPosition - this.startPos;
        const slideWidth = 100 / this.visibleItems;
        const maxTranslate = -(this.itemsCount - this.visibleItems) * slideWidth;
        
        this.currentTranslate = Math.max(
            Math.min(this.prevTranslate + diff / this.container.offsetWidth * 100, 0),
            maxTranslate
        );
        
        this.grid.style.transform = `translateX(${this.currentTranslate}%)`;
    }
    
    endDragging() {
        if (!this.isDragging) return;
        
        this.isDragging = false;
        this.grid.style.transition = 'transform 0.5s ease';
        this.grid.style.cursor = 'grab';
        
        const slideWidth = 100 / this.visibleItems;
        const slideIndex = Math.round(Math.abs(this.currentTranslate / slideWidth));
        
        this.goToSlide(slideIndex);
        this.prevTranslate = -(slideIndex * slideWidth);
    }
    
    getPositionX(e) {
        return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
    }
    
    // 更新原有的updateCarousel方法
    updateCarousel() {
        const translateX = -(this.currentIndex * (100 / this.visibleItems));
        this.grid.style.transform = `translateX(${translateX}%)`;
        this.prevTranslate = translateX;
        this.updateDots();
    }
    
    prev() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateCarousel();
            this.updateButtons();
        }
    }
    
    next() {
        if (this.currentIndex < this.itemsCount - this.visibleItems) {
            this.currentIndex++;
            this.updateCarousel();
            this.updateButtons();
        }
    }
}

// 初始化轮播
document.addEventListener('DOMContentLoaded', () => {
    const featuresCarousel = new Carousel('features-carousel', 5);
    const advantagesCarousel = new Carousel('advantages-carousel', 5);
});

// FAQ交互
document.addEventListener('DOMContentLoaded', () => {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // 关闭其他打开的项目
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // 切换当前项目
            item.classList.toggle('active');
        });
    });
});

// 添加滚动监听
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',  // 当section进入视口20%时触发
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 移除所有active类
                navLinks.forEach(link => link.classList.remove('active'));
                
                // 添加active类到当前section对应的链接
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
});

// 添加滚动监听
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -80% 0px',  // 当section进入视口20%时触发
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 移除所有active类
                navLinks.forEach(link => link.classList.remove('active'));
                
                // 添加active类到当前section对应的链接
                const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}); 