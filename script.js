const preloader = document.getElementById('preloader');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const navigation = document.getElementById('navigation');
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const currentYearSpan = document.getElementById('currentYear');


let isMenuOpen = false;


document.addEventListener('DOMContentLoaded', function() {
    initPreloader();
    initNavigation();
    initScrollAnimations();
    initContactForm();
    updateCurrentYear();
    initWhatsAppTooltip();
});


function initPreloader() {
    let progress = 0;
    const interval = setInterval(() => {
        progress += 2;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '%';
        
        if (progress >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 500);
        }
    }, 50);
}


function initNavigation() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navigation.classList.add('scrolled');
        } else {
            navigation.classList.remove('scrolled');
        }
    });
    
    mobileToggle.addEventListener('click', toggleMobileMenu);
    mobileClose.addEventListener('click', closeMobileMenu);
    
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !mobileMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            closeMobileMenu();
        }
    });

    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenu();
        }
    });
}

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'auto';
}

function closeMobileMenu() {
    isMenuOpen = false;
    mobileMenu.classList.remove('open');
    document.body.style.overflow = 'auto';
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    closeMobileMenu();
}

function scrollToTop() {
    window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
    });
}


function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    
    const animatedElements = document.querySelectorAll('.project-card, .service-card, .skill-category');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.1}s`;
        observer.observe(el);
    });
}

function initContactForm() {
    contactForm.addEventListener('submit', handleFormSubmit);
}

function handleFormSubmit(e) {
    e.preventDefault();
    
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        message: formData.get('message')
    };

    
    if (!data.name || !data.email || !data.message) {
        showToast('Please fill in all required fields', 'error');
        return;
    }

    
    showToast('Message sent successfully!', 'success');
    
    contactForm.reset();
}


function showToast(message, type = 'success') {
    const toastTitle = toast.querySelector('.toast-title');
    const toastDescription = toast.querySelector('.toast-description');
    const toastIcon = toast.querySelector('.toast-icon');
    
    if (type === 'success') {
        toastTitle.textContent = 'Message sent!';
        toastDescription.textContent = "Thank you for reaching out. I'll get back to you soon.";
        toastIcon.textContent = '✓';
        toastIcon.style.backgroundColor = '#10b981';
    } else {
        toastTitle.textContent = 'Error';
        toastDescription.textContent = message;
        toastIcon.textContent = '!';
        toastIcon.style.backgroundColor = '#ef4444';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

function initWhatsAppTooltip() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    const tooltip = document.querySelector('.whatsapp-tooltip');
    
    if (whatsappButton && tooltip) {
        whatsappButton.addEventListener('mouseenter', () => {
            tooltip.style.opacity = '1';
            tooltip.style.transform = 'translateY(0)';
        });
        
        whatsappButton.addEventListener('mouseleave', () => {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(8px)';
        });
    }
}


function updateCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}


document.addEventListener('keydown', (e) => {
    
    if (e.key === 'Home') {
        e.preventDefault();
        scrollToTop();
    }
    
    
    if (e.key === 'End') {
        e.preventDefault();
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
});

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}


function initPerformanceMonitoring() {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
        // This would be implemented with a library like web-vitals
        console.log('Performance monitoring initialized');
    }
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// Expose global functions for HTML onclick events
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;

// Additional animations and interactions
function addHoverEffects() {
    // Add hover effects to project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
    
    // Add hover effects to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'scale(1.05)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'scale(1)';
        });
    });
}

// Initialize additional features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    addHoverEffects();
    initLazyLoading();
    initPerformanceMonitoring();
});

// Smooth reveal animations for sections
function revealOnScroll() {
    const reveals = document.querySelectorAll('.animate-on-scroll');
    
    reveals.forEach(element => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', revealOnScroll);

// Initialize theme handling (if needed in the future)
function initThemeHandling() {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// Copy email to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Email copied to clipboard!', 'success');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Email copied to clipboard!', 'success');
    }
}

// Add click handlers for email addresses
document.addEventListener('DOMContentLoaded', () => {
    const emailElements = document.querySelectorAll('[data-email]');
    emailElements.forEach(element => {
        element.addEventListener('click', (e) => {
            e.preventDefault();
            copyToClipboard(element.dataset.email || 'julius@webros.dev');
        });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    initThemeHandling();
    
    
    document.body.classList.add('loading');
    
       setTimeout(() => {
        document.body.classList.remove('loading');
    }, 3000);
});