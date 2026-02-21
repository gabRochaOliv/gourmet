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

    // 8. YouTube Custom Thumbnail / Overlay
    const ytOverlay = document.getElementById('ytOverlay');
    const ytIframe = document.getElementById('ytIframe');

    if (ytOverlay && ytIframe) {
        ytOverlay.addEventListener('click', () => {
            // Esconde o overlay revelando o iframe por baixo
            ytOverlay.style.display = 'none';

            // Pega a URL atual do Iframe
            let currentSrc = ytIframe.getAttribute('src');

            // Adiciona autoplay se ele já não estiver lá
            if (!currentSrc.includes('autoplay=1')) {
                // Adiciona string correta independente se já tem parâmetros ou não (neste caso sabemos que tem com '?')
                currentSrc += '&autoplay=1';
                ytIframe.setAttribute('src', currentSrc);
            }
        });
    }
    // 9. Testimonials Slider Logic - True Infinite Loop
    const sliderContainer = document.querySelector('.slider-container');
    const sliderTrack = document.querySelector('.slider-track');
    let sliderCards = Array.from(document.querySelectorAll('.slider-card'));
    const sliderDotsContainer = document.getElementById('slider-dots');

    if (sliderContainer && sliderTrack && sliderCards.length > 0) {
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let currentIndex = 1; // Start at 1 because 0 will be the clone of the last slide

        const originalCount = sliderCards.length;

        // Create dots dynamically to match original number of cards
        sliderDotsContainer.innerHTML = '';
        sliderCards.forEach((_, i) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                currentIndex = i + 1; // +1 because index 1 is original slide 0
                setPositionByIndex();
            });
            sliderDotsContainer.appendChild(dot);
        });

        const dots = document.querySelectorAll('.dot');

        // Clone first and last slides for infinite effect
        const firstClone = sliderCards[0].cloneNode(true);
        const lastClone = sliderCards[originalCount - 1].cloneNode(true);

        firstClone.classList.add('clone');
        lastClone.classList.add('clone');

        sliderTrack.appendChild(firstClone);
        sliderTrack.insertBefore(lastClone, sliderCards[0]);

        // Update cards array to include clones
        sliderCards = Array.from(document.querySelectorAll('.slider-card'));

        // Touch events
        sliderContainer.addEventListener('touchstart', touchStart);
        sliderContainer.addEventListener('touchend', touchEnd);
        sliderContainer.addEventListener('touchmove', touchMove);

        // Mouse events
        sliderContainer.addEventListener('mousedown', touchStart);
        sliderContainer.addEventListener('mouseup', touchEnd);
        sliderContainer.addEventListener('mouseleave', touchEnd);
        sliderContainer.addEventListener('mousemove', touchMove);

        // Disable context menu on slide
        window.oncontextmenu = function (event) {
            if (event.target.closest('.slider-container')) {
                event.preventDefault();
                event.stopPropagation();
                return false;
            }
        };

        function touchStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            sliderContainer.classList.add('grabbing');
            // Disable transition during drag
            sliderTrack.style.transition = 'none';
        }

        function touchEnd() {
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;

            // Re-enable transition for snapping
            sliderTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';

            // Sensitivity for drag
            if (movedBy < -100) {
                currentIndex += 1;
            }
            if (movedBy > 100) {
                currentIndex -= 1;
            }

            setPositionByIndex();
            sliderContainer.classList.remove('grabbing');
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        function setSliderPosition() {
            sliderTrack.style.transform = `translateX(${currentTranslate}px)`;
        }

        function setPositionByIndex() {
            const cardWidth = sliderCards[0].offsetWidth + 20; // 260px width + 10px margin each side
            const containerWidth = sliderContainer.offsetWidth;

            // Calculate center position for the current card
            const offset = (containerWidth - cardWidth) / 2;
            currentTranslate = (currentIndex * -cardWidth) + offset;
            prevTranslate = currentTranslate;
            setSliderPosition();

            // Handle infinite loop jumping after CSS transition ends
            sliderTrack.addEventListener('transitionend', function handler() {
                // If reached the cloned first element (at the end)
                if (currentIndex >= sliderCards.length - 1) {
                    sliderTrack.style.transition = 'none';
                    currentIndex = 1;
                    currentTranslate = (currentIndex * -cardWidth) + offset;
                    prevTranslate = currentTranslate;
                    setSliderPosition();
                }
                // If reached the cloned last element (at the beginning)
                if (currentIndex <= 0) {
                    sliderTrack.style.transition = 'none';
                    currentIndex = sliderCards.length - 2;
                    currentTranslate = (currentIndex * -cardWidth) + offset;
                    prevTranslate = currentTranslate;
                    setSliderPosition();
                }
                sliderTrack.removeEventListener('transitionend', handler);
                updateClasses();
            });

            // If dragging fast, ensure classes update even before transition ends
            updateClasses();
        }

        function updateClasses() {
            // Determine actual active index for dots (0 to originalCount-1)
            let rawIndex = currentIndex - 1;
            if (rawIndex < 0) rawIndex = originalCount - 1;
            if (rawIndex >= originalCount) rawIndex = 0;

            // Update active styling on cards
            sliderCards.forEach((card, index) => {
                if (index === currentIndex) {
                    card.classList.add('active');
                } else {
                    card.classList.remove('active');
                }
            });

            // Update active dot
            dots.forEach((dot, index) => {
                if (index === rawIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Initialize position (added timeout to ensure fonts load before calculating width)
        setTimeout(() => {
            sliderTrack.style.transition = 'none'; // No transition on initial load
            setPositionByIndex();
            setTimeout(() => {
                sliderTrack.style.transition = 'transform 0.4s cubic-bezier(0.25, 1, 0.5, 1)';
            }, 50);
        }, 100);

        // Recalculate on resize
        window.addEventListener('resize', () => {
            setTimeout(() => {
                sliderTrack.style.transition = 'none';
                setPositionByIndex();
            }, 100);
        });
    }

});
