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
    initMiniGame();
    addHoverEffects();
    initLazyLoading();
    initPerformanceMonitoring();
    initThemeHandling();
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
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
}

// --- UPDATED: Actual Formspree Integration ---
async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!navigator.onLine) {
        showToast('Cannot send message. Please check your internet connection.', 'error');
        return;
    }

    const formData = new FormData(contactForm);
    const btn = contactForm.querySelector('button[type="submit"]');
    
    // UI Loading State
    const originalBtnText = btn.innerHTML;
    btn.disabled = true;
    btn.textContent = 'Sending...';

    try {
        const response = await fetch("https://formspree.io/f/xvgzlowq", {
            method: "POST",
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            // Show your custom professional overlay
            showSuccessOverlay();
            contactForm.reset();
        } else {
            const data = await response.json();
            showToast(data.errors ? data.errors[0].message : "Submission failed", 'error');
        }
    } catch (error) {
        showToast("Connection error. Please try again later.", 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
    }
}

function showSuccessOverlay() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; 
    }
}

window.closeSuccessOverlay = function() {
    const overlay = document.getElementById('successOverlay');
    if (overlay) {
        overlay.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
};

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const title = toast.querySelector('.toast-title');
    const desc = toast.querySelector('.toast-description');
    
    toast.className = `toast ${type}`; 
    title.textContent = type === 'error' ? 'Oops!' : 'Success';
    desc.textContent = message;
    
    toast.classList.remove('hidden');
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.classList.add('hidden'), 300);
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

function initMiniGame() {
    let randomNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 0;
    const maxAttempts = 7;

    const input = document.getElementById('guessInput');
    const btn = document.getElementById('guessBtn');
    const status = document.getElementById('gameStatus');
    const countDisplay = document.getElementById('attemptCount');
    const history = document.getElementById('guessHistory');
    const resetBtn = document.getElementById('resetGame');

    if (!btn) return;

    btn.addEventListener('click', () => {
        const userGuess = parseInt(input.value);
        if (isNaN(userGuess) || userGuess < 1 || userGuess > 100) {
            status.textContent = "Please enter a valid number (1-100)!";
            return;
        }

        attempts++;
        countDisplay.textContent = attempts;
        
        const item = document.createElement('span');
        item.className = 'history-item';
        item.textContent = userGuess;
        history.appendChild(item);

        if (userGuess === randomNumber) {
            status.textContent = "🎉 Correct! You're a genius!";
            status.style.color = "var(--primary)";
            btn.disabled = true;
        } else if (attempts >= maxAttempts) {
            status.textContent = `Game Over! The number was ${randomNumber}.`;
            btn.disabled = true;
        } else {
            status.textContent = userGuess > randomNumber ? "Too high! Try again." : "Too low! Try again.";
            input.value = '';
            input.focus();
        }
    });

    resetBtn.addEventListener('click', () => {
        randomNumber = Math.floor(Math.random() * 100) + 1;
        attempts = 0;
        input.value = '';
        status.textContent = "Enter a number to start!";
        status.style.color = "var(--foreground)";
        countDisplay.textContent = "0";
        history.innerHTML = '';
        btn.disabled = false;
    });
}

function addHoverEffects() {
    const cards = document.querySelectorAll('.project-card, .service-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => card.style.transform = 'scale(1.02)');
        card.addEventListener('mouseleave', () => card.style.transform = 'scale(1)');
    });
}

function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                imageObserver.unobserve(img);
            }
        });
    });
    images.forEach(img => imageObserver.observe(img));
}

function initThemeHandling() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function initPerformanceMonitoring() {
    console.log('Performance monitoring active');
}

// Global Exports
window.scrollToSection = scrollToSection;
window.scrollToTop = scrollToTop;
// script.js
function initThemeHandling() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'dark';

    // Apply initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);

    themeToggle.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        let newTheme = theme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    });
}
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Julius Ayodeji",
  "url": "https://thejuliusdevofficial.vercel.app/",
  "image": "https://your-portfolio-url.vercel.app/favicon.ico",
  "jobTitle": "Fullstack Web developer, Web designer, blockchain developer, Data Scientist",
  "sameAs": [
    "https://www.linkedin.com/in/julius-ayodeji-640710386?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
    "https://github.com/TheJuliusDev",
    "https://x.com/TheJuliusDev?t=YIeGue_giiYEoNUyYC6H7w&s=09",
    "https://www.threads.com/@thejuliusdev",
    "https://www.instagram.com/thejuliusdev"
  ],
  "description": "I'm Julius Ayodeji, a Fullstack web developer, Data Scientist I attend Fedral University of Akure(FUTA)."
}
</script>