document.addEventListener('DOMContentLoaded', () => {

    /*=============== SHOW/HIDE MOBILE MENU ===============*/
    const navMenu = document.getElementById('nav-menu'),
          navToggle = document.getElementById('nav-toggle'),
          navClose = document.getElementById('nav-close');

    // Show menu
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.add('show-menu');
        });
    }

    // Hide menu
    if (navClose) {
        navClose.addEventListener('click', () => {
            navMenu.classList.remove('show-menu');
        });
    }

    // Hide menu when a link is clicked
    const navLinks = document.querySelectorAll('.nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('show-menu')) {
                navMenu.classList.remove('show-menu');
            }
        });
    });

    /*=============== STICKY HEADER ===============*/
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY >= 50) {
                header.classList.add('sticky');
            } else {
                header.classList.remove('sticky');
            }
        });
    }

    /*=============== DARK/LIGHT THEME TOGGLE ===============*/
    const themeButton = document.getElementById('theme-toggle');
    const darkTheme = 'dark';
    const iconTheme = 'fa-sun'; // Opposite icon

    // Previously selected topic (if user selected)
    const selectedTheme = localStorage.getItem('selected-theme');
    
    // We obtain the current theme that the interface has by validating the data-theme attribute
    const getCurrentTheme = () => document.documentElement.getAttribute('data-theme');
    const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'fa-moon' : 'fa-sun';

    // We validate if the user previously chose a topic
    if (selectedTheme) {
      document.documentElement.setAttribute('data-theme', selectedTheme);
      if(selectedTheme === darkTheme) {
        themeButton.classList.add(iconTheme);
        themeButton.classList.remove('fa-moon');
      }
    }

    // Activate / deactivate the theme manually with the button
    if (themeButton) {
        themeButton.addEventListener('click', () => {
            // Add or remove the dark / icon theme
            const currentTheme = getCurrentTheme();
            if (currentTheme === 'light') {
                document.documentElement.setAttribute('data-theme', darkTheme);
                themeButton.classList.add(iconTheme);
                themeButton.classList.remove('fa-moon');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeButton.classList.remove(iconTheme);
                themeButton.classList.add('fa-moon');
            }
            // We save the theme that the user chose
            localStorage.setItem('selected-theme', getCurrentTheme());
        });
    }
    

    /*=============== FEATURED VENUES CAROUSEL ===============*/
    const carouselWrapper = document.querySelector('.featured__carousel-wrapper');
    const prevBtn = document.querySelector('.carousel__btn--prev');
    const nextBtn = document.querySelector('.carousel__btn--next');

    if (carouselWrapper && prevBtn && nextBtn) {
        const slideWidth = () => carouselWrapper.querySelector('.featured__slide').offsetWidth;
        const gap = 30; // The gap between slides

        nextBtn.addEventListener('click', () => {
            carouselWrapper.scrollBy({ left: slideWidth() + gap, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            carouselWrapper.scrollBy({ left: -(slideWidth() + gap), behavior: 'smooth' });
        });
    }

    /*=============== PRICE RANGE SLIDER ===============*/
    const priceRange = document.getElementById('price-range');
    const priceValue = document.getElementById('price-value');

    if (priceRange && priceValue) {
        // Set initial value on page load
        priceValue.textContent = `₹${priceRange.value}`;
        priceRange.addEventListener('input', (e) => {
            priceValue.textContent = `₹${e.target.value}`;
        });
    }

    /*=============== BOOKING SLOT SELECTION ===============*/
    const slotsGrid = document.querySelector('.slots__grid');
    if (slotsGrid) {
        slotsGrid.addEventListener('click', (e) => {
            if (e.target.classList.contains('slot') && e.target.classList.contains('available')) {
                // Remove 'selected' from any previously selected slot
                const selectedSlot = slotsGrid.querySelector('.slot.selected');
                if(selectedSlot) {
                    selectedSlot.classList.remove('selected');
                }
                // Add 'selected' to the clicked slot, but only if it's not already selected
                if(selectedSlot !== e.target){
                   e.target.classList.add('selected');
                }
            }
        });
    }

    /*=============== DASHBOARD TABS ===============*/
    const tabs = document.querySelectorAll('.tab__link');
    const tabContents = document.querySelectorAll('.tab__content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetId = tab.dataset.tab;
            const target = document.getElementById(targetId);

            // Remove active class from all tab contents and links
            tabContents.forEach(tc => tc.classList.remove('active'));
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab and its content
            tab.classList.add('active');
            target.classList.add('active');
        });
    });

    /*=============== BOOKING CONFIRMATION MODAL ===============*/
    const bookingForm = document.getElementById('booking-confirmation-form');
    const confirmationModal = document.getElementById('confirmation-modal');

    if (bookingForm && confirmationModal) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent actual form submission for this demo
            confirmationModal.classList.add('show');
        });

        // Close modal if user clicks outside of the content
        confirmationModal.addEventListener('click', (e) => {
            if(e.target === confirmationModal){
                 confirmationModal.classList.remove('show');
            }
        });
    }
});