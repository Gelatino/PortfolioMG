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
        });
});

document.addEventListener('DOMContentLoaded', () => {
    // Load external menu
    fetch('menu.html')
        .then(response => response.text())
        .then(html => {
            document.getElementById('menu-container').innerHTML = html;

            // Attach event listener to burger icon
            const burgerIcon = document.querySelector('.burger-icon');
            const menuLinks = document.getElementById('menuLinks');
            if (burgerIcon && menuLinks) {
                burgerIcon.addEventListener('click', () => {
                    menuLinks.classList.toggle('show'); // Toggle menu visibility
                });
            }
        });
});