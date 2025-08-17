document.addEventListener('DOMContentLoaded', () => {

    // Chart.js - Revenue Chart
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Revenue (in ₹)',
                    data: [15000, 22000, 18000, 27000, 32000, 25000, 40000],
                    borderColor: '#4ECDC4',
                    backgroundColor: 'rgba(78, 205, 196, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Chart.js - Bookings by Sport Chart
    const bookingsCtx = document.getElementById('bookingsChart');
    if (bookingsCtx) {
        new Chart(bookingsCtx, {
            type: 'doughnut',
            data: {
                labels: ['Box Cricket', 'Badminton', 'Tennis', 'Pool'],
                datasets: [{
                    label: 'Bookings',
                    data: [45, 25, 15, 10],
                    backgroundColor: [
                        '#4ECDC4',
                        '#FFD166',
                        '#06D6A0',
                        '#FF6B6B'
                    ],
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            }
        });
    }

    // Modal Handling
    const addVenueBtn = document.getElementById('add-venue-btn');
    const venueModal = document.getElementById('venue-modal');
    const closeModalBtns = document.querySelectorAll('.modal-close');

    if (addVenueBtn) {
        addVenueBtn.addEventListener('click', () => {
            venueModal.classList.add('show');
        });
    }

    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            modal.classList.remove('show');
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('show');
        }
    });
});