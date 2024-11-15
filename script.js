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
});
