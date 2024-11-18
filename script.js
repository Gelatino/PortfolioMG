document.addEventListener('DOMContentLoaded', () => {

    // Load external menu
    fetch('menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('menu-container').innerHTML = html;

            // Attach event listeners to menu elements
            attachMenuEventListeners();
        });

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
            menuOverlay.addEventListener('click', toggleMenu);
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


    const cardContainer = document.getElementById('card-container');
    let originalCards = Array.from(cardContainer.querySelectorAll('.movie-card'));

    // Randomize the first card
    const randomIndex = Math.floor(Math.random() * originalCards.length);
    const firstCard = originalCards.splice(randomIndex, 1)[0];
    originalCards.unshift(firstCard);

    // Clear the container and re-append the cards
    cardContainer.innerHTML = '';
    originalCards.forEach(card => cardContainer.appendChild(card));

    // Clone the cards multiple times for infinite scrolling
    const numberOfClones = 3; // Adjust as needed
    for (let i = 0; i < numberOfClones; i++) {
        const clonedCards = originalCards.map(card => {
            const clone = card.cloneNode(true);
            clone.removeAttribute('id');
            return clone;
        });
        clonedCards.forEach(card => cardContainer.appendChild(card));
    }

    // Update the cards array to include all cards (originals + clones)
    const cards = Array.from(cardContainer.querySelectorAll('.movie-card'));

    // Prioritize loading the first GIF
    let isMobile = window.innerWidth <= 768;
    const firstGifUrl = isMobile ? cards[0].dataset.mobileGif : cards[0].dataset.desktopGif;
    cards[0].style.backgroundImage = `url(${firstGifUrl})`;

    // Lazy load the rest of the GIFs
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const gifObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                const gifUrl = isMobile ? card.dataset.mobileGif : card.dataset.desktopGif;
                card.style.backgroundImage = `url(${gifUrl})`;
                observer.unobserve(card); // Stop observing after loading
            }
        });
    }, observerOptions);

    // Start observing cards (except the first one, which is already loaded)
    cards.slice(1).forEach(card => {
        gifObserver.observe(card);
    });

    window.addEventListener('resize', () => {
        // Update isMobile and reload images if necessary
        isMobile = window.innerWidth <= 768;
        // Optionally, reload images for currently visible cards
    });

});
