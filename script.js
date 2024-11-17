document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.movie-card');

    // Update GIFs dynamically based on device type
    const updateBackgrounds = () => {
        const isMobile = window.innerWidth <= 768;
        cards.forEach(card => {
            const gifUrl = isMobile
                ? card.dataset.mobileGif
                : card.dataset.desktopGif;
            card.style.backgroundImage = `url(${gifUrl})`;
        });
    };

    // Initialize function
    updateBackgrounds();

    // Update GIFs if the window is resized
    window.addEventListener('resize', updateBackgrounds);

    // Load external menu
    fetch('menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('menu-container').innerHTML = html;

            // Attach event listeners after menu is loaded
            attachMenuEventListeners();
        });

    // Function to attach event listeners to menu elements
    function attachMenuEventListeners() {
        const burgerIcon = document.querySelector('.burger-icon');
        const menuLinks = document.getElementById('menuLinks');
        const closeIcon = document.querySelector('.close-icon');
        const menuOverlay = document.getElementById('menuOverlay');

        if (burgerIcon && menuLinks) {
            burgerIcon.addEventListener('click', toggleMenu);
        }

        if (closeIcon) {
            closeIcon.addEventListener('click', toggleMenu);
        }

        if (menuOverlay) {
            menuOverlay.addEventListener('click', closeMenu);
        }
    }

    function toggleMenu() {
        const menuLinks = document.getElementById('menuLinks');
        const menuOverlay = document.getElementById('menuOverlay');
        menuLinks.classList.toggle('show');
        if (menuOverlay) {
            menuOverlay.classList.toggle('show');
        }
    }

    function closeMenu() {
        const menuLinks = document.getElementById('menuLinks');
        const menuOverlay = document.getElementById('menuOverlay');
        menuLinks.classList.remove('show');
        if (menuOverlay) {
            menuOverlay.classList.remove('show');
        }
    }

    // Auto-scroll functionality for movie cards
    const movieCards = document.querySelectorAll(".movie-card");

    movieCards.forEach((card) => {
        const gifUrl = card.dataset.desktopGif;
        let gifDuration = 5000; // Set appropriate duration for your GIFs

        // Set GIF as background image
        card.style.backgroundImage = `url(${gifUrl})`;

        // Set a timer for scrolling after the GIF "completes"
        setTimeout(() => {
            scrollToNextSection(card);
        }, gifDuration);
    });

    function scrollToNextSection(currentCard) {
        const cards = Array.from(document.querySelectorAll('.movie-card'));
        const currentIndex = cards.indexOf(currentCard);

        // Scroll to the next card if it exists
        if (currentIndex !== -1 && currentIndex < cards.length - 1) {
            const nextCard = cards[currentIndex + 1];
            nextCard.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }
});
