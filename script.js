document.addEventListener('DOMContentLoaded', () => {

    // 1. Chocolate Drip Animation Management
    const dripOverlay = document.getElementById('chocolate-drip-overlay');

    // We want the clean page to be interactive after the drip.
    // The CSS animation takes about 1.2s total.
    // We'll add a fade-out class slightly before it ends or right after.

    setTimeout(() => {
        if (dripOverlay) {
            dripOverlay.classList.add('fade-out-overlay');

            // Remove from DOM after fade out to clean up
            dripOverlay.addEventListener('animationend', (e) => {
                if (e.animationName === 'fadeOutOpacity') {
                    dripOverlay.style.display = 'none';
                }
            });
        }
    }, 1500); // 1.5s delay allows the drip to complete comfortably

    // 2. Scroll Animations (Intersection Observer)
    const fadeElems = document.querySelectorAll('.fade-in');

    // Options for the observer (when to trigger)
    const appearOptions = {
        threshold: 0.1, // Trigger when 10% of item is visible
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, appearOptions);

    fadeElems.forEach(elem => {
        appearOnScroll.observe(elem);
    });

    // 3. FAQ Accordion
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;

            // Toggle current
            item.classList.toggle('active');

            // Update icon
            const icon = header.querySelector('.icon');
            if (item.classList.contains('active')) {
                icon.textContent = '-';
            } else {
                icon.textContent = '+';
            }

            // Close others (Accordion effect - optional, but nice for UX)
            // Uncomment below if you want only one open at a time
            /*
            accordionHeaders.forEach(otherHeader => {
                if (otherHeader !== header) {
                    otherHeader.parentElement.classList.remove('active');
                    otherHeader.querySelector('.icon').textContent = '+';
                }
            });
            */
        });
    });

    // 4. Smooth Scrolling for Anchor Links (Polished)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElem = document.querySelector(targetId);
            if (targetElem) {
                window.scrollTo({
                    top: targetElem.offsetTop - 80, // Offset for fixed/abs content if any
                    behavior: 'smooth'
                });
            }
        });
    });

    // 5. Interactive Book Animation (Hinge)
    const book = document.getElementById('interactive-book');
    if (book) {
        book.addEventListener('click', () => {
            book.classList.toggle('open');
            // Optional: Change hint text
            const hint = book.querySelector('.click-hint-badge');
            if (hint) {
                if (book.classList.contains('open')) {
                    hint.style.opacity = '0'; // Hide hint when reading
                } else {
                    hint.style.opacity = '1';
                }
            }
        });
    }

    // 6. Urgency Countdown Timer (Restored)
    const hoursElem = document.getElementById('hours');
    const minutesElem = document.getElementById('minutes');
    const secondsElem = document.getElementById('seconds');

    if (hoursElem && minutesElem && secondsElem) {
        // Set countdown to 11h 47m 03s from now
        let totalSeconds = (11 * 3600) + (47 * 60) + 3;

        const updateTimer = () => {
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = Math.floor(totalSeconds % 60);

            hoursElem.textContent = h < 10 ? '0' + h : h;
            minutesElem.textContent = m < 10 ? '0' + m : m;
            secondsElem.textContent = s < 10 ? '0' + s : s;

            if (totalSeconds > 0) {
                totalSeconds--;
            } else {
                // Loop for demo urgency (optional)
                totalSeconds = (11 * 3600) + (47 * 60) + 3;
            }
        };

        // Update immediately then interval
        updateTimer();
        setInterval(updateTimer, 1000);
    }
    // 7. Interactive Bonus Selection
    const bonusCards = document.querySelectorAll('.bonus-selectable');

    bonusCards.forEach(card => {
        const checkbox = card.querySelector('.bonus-check');

        // Function to update visual state
        const updateVisuals = () => {
            if (checkbox.checked) {
                card.classList.add('selected');
            } else {
                card.classList.remove('selected');
            }
        };

        // Listen for ANY change to the checkbox (click on label, input, or programmatic)
        checkbox.addEventListener('change', updateVisuals);

        // Card click handler (for clicking background/text)
        card.addEventListener('click', (e) => {
            // If clicking the label or checkbox directly, let browser handle it.
            // We only interfere if clicking the container "whitespace".
            if (e.target.type === 'checkbox' || e.target.tagName === 'LABEL') return;

            // Toggle checkbox
            checkbox.checked = !checkbox.checked;
            // Manually trigger change event to update visuals
            checkbox.dispatchEvent(new Event('change'));
        });
    });
});
