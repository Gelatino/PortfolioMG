// ==========================================================================
// FILM PORTFOLIO - JSON DRIVEN
// ==========================================================================

// Wait for EVERYTHING to be ready
window.addEventListener('load', async () => {
    
    // Double-check DOM is ready
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('Page fully loaded, starting initialization...');
    
    // ==========================================================================
    // LOAD AND GENERATE FILMS
    // ==========================================================================
    
    async function loadFilms() {
        try {
            const response = await fetch('films.json');
            const films = await response.json();
            generateFilmSections(films);
        } catch (error) {
            console.error('Error loading films:', error);
        }
    }
    
    function generateFilmSections(films) {
        const container = document.getElementById('films-container');
        
        if (!container) {
            console.error('ERROR: films-container element not found in DOM!');
            console.log('Available elements:', document.body.innerHTML.substring(0, 500));
            return;
        }
        
        console.log('Films container found, generating', films.length, 'films');
        
        films.forEach((film, index) => {
            const filmNumber = String(index + 1).padStart(2, '0');
            
            const section = document.createElement('section');
            section.className = 'snap-section film-section';
            section.setAttribute('data-film', film.id);
            
            section.innerHTML = `
                <div class="film-media-container">
                    <img src="${film.mobileGif}" 
                         data-mobile="${film.mobileGif}"
                         data-desktop="${film.desktopGif}"
                         alt="${film.title}"
                         class="film-bg">
                    <div class="film-overlay"></div>
                </div>
                <div class="film-info-container">
                    <div class="film-year-top">${film.year}</div>
                    <h3 class="film-title-main">${film.title.toUpperCase()}</h3>
                    <div class="film-role-bottom">${film.role}</div>
                    <a href="${film.detailPage}" class="film-cta">View Project →</a>
                </div>
            `;
            
            container.appendChild(section);
        });
        
        // Update images after sections are added
        updateImages();
    }
    
    // Load films on page load
    await loadFilms();
    
    // ==========================================================================
    // INTRO IMAGE ROTATION
    // ==========================================================================
    
    const introImage = document.getElementById('introImage');
    
    // Array of intro images (add your image paths here)
    const introImages = [
        'assets/images/intro/intro-1.jpg'
        // 'assets/images/intro/intro-2.jpg',
        // 'assets/images/intro/intro-3.jpg',
        // 'assets/images/intro/intro-4.jpg',
        // 'assets/images/intro/intro-5.jpg'
    ];
    
    let currentImageIndex = Math.floor(Math.random() * introImages.length);
    
    function setIntroImage(index) {
        if (introImage) {
            introImage.src = introImages[index];
        }
    }
    
    function rotateIntroImage() {
        if (!introImage) return;
        
        // Fade out
        introImage.classList.add('fade');
        
        // Wait for fade, then change image
        setTimeout(() => {
            currentImageIndex = (currentImageIndex + 1) % introImages.length;
            setIntroImage(currentImageIndex);
            
            // Fade back in
            setTimeout(() => {
                introImage.classList.remove('fade');
            }, 50);
        }, 1000);
    }
    
    // Set initial random image
    setIntroImage(currentImageIndex);
    
    // Rotate every 30 seconds
    setInterval(rotateIntroImage, 30000);
    
    console.log('Intro image rotation active. Changes every 30 seconds.');
    
    // ==========================================================================
    // MENU TOGGLE
    // ==========================================================================
    
    const menuButton = document.querySelector('.mark-menu');
    const menu = document.getElementById('menu');
    const menuClose = document.querySelector('.menu-close');
    const menuItems = document.querySelectorAll('.menu-item');
    
    function openMenu() {
        menu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeMenu() {
        menu.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    if (menuButton) {
        menuButton.addEventListener('click', openMenu);
    }
    
    if (menuClose) {
        menuClose.addEventListener('click', closeMenu);
    }
    
    // Close menu when clicking on internal links
    menuItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.getAttribute('href').startsWith('#')) {
                closeMenu();
            }
        });
    });
    
    // Close menu on escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // ==========================================================================
    // RESPONSIVE IMAGE SWITCHING
    // ==========================================================================
    
    function updateImages() {
        const images = document.querySelectorAll('[data-mobile][data-desktop]');
        const isMobile = window.innerWidth <= 768;
        
        images.forEach(img => {
            const src = isMobile ? img.dataset.mobile : img.dataset.desktop;
            if (img.src !== src && !img.src.includes(src)) {
                img.src = src;
            }
        });
    }
    
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateImages, 100);
    });
    
    // ==========================================================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ==========================================================================
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ==========================================================================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ==========================================================================
    
    const observerOptions = {
        root: null,
        threshold: 0.3,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe all snap sections
    const sections = document.querySelectorAll('.snap-section');
    sections.forEach(section => observer.observe(section));
    
    // ==========================================================================
    // KEYBOARD NAVIGATION (UP/DOWN ARROWS)
    // ==========================================================================
    
    let currentSectionIndex = 0;
    const scrollableSections = Array.from(document.querySelectorAll('.snap-section'));
    
    document.addEventListener('keydown', (e) => {
        // Don't interfere if menu is open
        if (menu.classList.contains('active')) return;
        
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            currentSectionIndex = Math.min(currentSectionIndex + 1, scrollableSections.length - 1);
            scrollableSections[currentSectionIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
            scrollableSections[currentSectionIndex].scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
    
    // Update current section index based on scroll position
    const updateCurrentSection = () => {
        const scrollPosition = window.pageYOffset + (window.innerHeight / 2);
        
        scrollableSections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                currentSectionIndex = index;
            }
        });
    };
    
    window.addEventListener('scroll', updateCurrentSection);
    
    // ==========================================================================
    // TOUCH SWIPE NAVIGATION (MOBILE)
    // ==========================================================================
    
    let touchStartY = 0;
    let touchEndY = 0;
    const minSwipeDistance = 50;
    
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
    }, { passive: true });
    
    function handleSwipe() {
        const swipeDistance = touchStartY - touchEndY;
        
        if (Math.abs(swipeDistance) < minSwipeDistance) return;
        
        if (swipeDistance > 0) {
            // Swipe up - go to next section
            currentSectionIndex = Math.min(currentSectionIndex + 1, scrollableSections.length - 1);
        } else {
            // Swipe down - go to previous section
            currentSectionIndex = Math.max(currentSectionIndex - 1, 0);
        }
        
        scrollableSections[currentSectionIndex].scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // ==========================================================================
    // CUSTOM CURSOR (DESKTOP ONLY)
    // ==========================================================================
    
    if (window.innerWidth > 768) {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        const speed = 0.15;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.classList.add('active');
        });

        document.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });

        function animateCursor() {
            const distX = mouseX - cursorX;
            const distY = mouseY - cursorY;

            cursorX += distX * speed;
            cursorY += distY * speed;

            cursor.style.left = cursorX + 'px';
            cursor.style.top = cursorY + 'px';

            requestAnimationFrame(animateCursor);
        }

        animateCursor();

        // Scale cursor on hover
        const interactiveElements = document.querySelectorAll('a, button, .film-section');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform = 'scale(2)';
            });
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = 'scale(1)';
            });
        });
    }
    
    // ==========================================================================
    // FILM SECTION HOVER EFFECTS (DESKTOP)
    // ==========================================================================
    
    if (window.innerWidth > 768) {
        // Wait a bit for sections to be generated
        setTimeout(() => {
            const filmSections = document.querySelectorAll('.film-section');
            
            filmSections.forEach(section => {
                const filmBg = section.querySelector('.film-bg');
                
                section.addEventListener('mouseenter', () => {
                    if (filmBg) {
                        filmBg.style.transform = 'scale(1.05)';
                        filmBg.style.transition = 'transform 0.6s cubic-bezier(0.86, 0, 0.07, 1)';
                    }
                });
                
                section.addEventListener('mouseleave', () => {
                    if (filmBg) {
                        filmBg.style.transform = 'scale(1)';
                    }
                });
            });
        }, 100);
    }
    
    // ==========================================================================
    // PRELOAD NEXT SECTION IMAGES
    // ==========================================================================
    
    const preloadImage = (src) => {
        const img = new Image();
        img.src = src;
    };
    
    const lazyLoadImages = () => {
        const images = document.querySelectorAll('.film-bg');
        images.forEach(img => {
            if (img.dataset.desktop) {
                preloadImage(img.dataset.desktop);
            }
            if (img.dataset.mobile) {
                preloadImage(img.dataset.mobile);
            }
        });
    };
    
    // Preload after initial load
    setTimeout(lazyLoadImages, 1000);
    
    // ==========================================================================
    // SECTION VISIBILITY TRACKING
    // ==========================================================================
    
    const visibilityObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.setAttribute('data-visible', 'true');
            } else {
                entry.target.removeAttribute('data-visible');
            }
        });
    }, {
        threshold: 0.5
    });
    
    scrollableSections.forEach(section => {
        visibilityObserver.observe(section);
    });
    
});
