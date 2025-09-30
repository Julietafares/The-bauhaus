document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.bau-carousel-wrapper');

    carousels.forEach(wrapper => {
        const track = wrapper.querySelector('.bau-carousel-track');
        const nextButton = wrapper.querySelector('.bau-carousel-btn--next');
        const prevButton = wrapper.querySelector('.bau-carousel-btn--prev');
        const nav = wrapper.querySelector('.bau-carousel-nav');
        const liveRegion = wrapper.querySelector('.bau-carousel-live-region');

        let slides = Array.from(track.children);
        if (!track || slides.length === 0) return;

        let slideWidth = slides[0].getBoundingClientRect().width;
        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID;
        let isAnimating = false;

        // --- Inicialización ---
        function init() {
            cloneSlides();
            setupSlides();
            createNavBullets();
            addEventListeners();
            updateUI();
        }

        function setupSlides() {
            slideWidth = slides[0].getBoundingClientRect().width;
            // Posiciona el carrusel en el primer slide real (índice 1) sin transición
            currentIndex = 1;
            track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
        }

        function cloneSlides() {
            const firstClone = slides[0].cloneNode(true);
            const lastClone = slides[slides.length - 1].cloneNode(true);

            firstClone.dataset.clone = 'true';
            lastClone.dataset.clone = 'true';

            track.appendChild(firstClone);
            track.insertBefore(lastClone, slides[0]);

            slides = Array.from(track.children); // Actualizar la lista de slides con los clones
        }

        function createNavBullets() {
            if (!nav) return;
            nav.innerHTML = '';
            slides.forEach((slide, index) => {
                if (slide.dataset.clone) return; // No crear bullets para clones

                const button = document.createElement('button');
                button.classList.add('bau-carousel-bullet');
                button.setAttribute('aria-label', `Ir al slide ${index + 1}`);
                if (index === 0) button.classList.add('current-slide');
                button.addEventListener('click', () => {
                    moveToSlide(index);
                });
                nav.appendChild(button);
            });
        }

        // --- Lógica de Movimiento ---
        function moveToSlide(targetIndex) {
            if (isAnimating) return;
            isAnimating = true;

            currentIndex = targetIndex;
            track.classList.add('is-animating');
            track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            updateUI();
        }

        function updateUI() {
            const realSlides = slides.filter(s => !s.dataset.clone);
            const realIndex = (currentIndex - 1 + realSlides.length) % realSlides.length;

            slides.forEach((slide, index) => {
                const isCurrent = index === currentIndex;
                slide.classList.toggle('current-slide', isCurrent);
                slide.setAttribute('aria-current', isCurrent && !slide.dataset.clone ? 'true' : 'false');
            });

            updateNav(realIndex);
            updateLiveRegion(realIndex);
        }

        function handleTransitionEnd() {
            isAnimating = false;
            track.classList.remove('is-animating');

            if (currentIndex === 0) { // Si estamos en el clon del final (al principio)
                currentIndex = slides.length - 2; // Ir al último slide real
                track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            } else if (currentIndex === slides.length - 1) { // Si estamos en el clon del principio (al final)
                currentIndex = 1; // Ir al primer slide real
                track.style.transform = `translateX(${-slideWidth * currentIndex}px)`;
            }
        }

        function updateNav(realIndex) {
            if (!nav) return;
            const bullets = nav.querySelectorAll('.bau-carousel-bullet');
            bullets.forEach((bullet, index) => {
                bullet.classList.toggle('current-slide', index === realIndex);
            });
        }

        function updateLiveRegion(realIndex) {
            if (!liveRegion) return;
            const realSlides = slides.filter(s => !s.dataset.clone);
            const currentSlideFigcaption = realSlides[realIndex].querySelector('.bau-carousel-caption');
            if (currentSlideFigcaption) {
                liveRegion.textContent = `Mostrando slide ${realIndex + 1}: ${currentSlideFigcaption.textContent}`;
            }
        }

        // --- Event Listeners ---
        function addEventListeners() {
            nextButton.addEventListener('click', () => {
                moveToSlide(currentIndex + 1);
            });

            prevButton.addEventListener('click', () => {
                moveToSlide(currentIndex - 1);
            });

            window.addEventListener('resize', () => {
                setupSlides();
                moveToSlide(currentIndex);
            });

            // Teclado
            wrapper.addEventListener('keydown', e => {
                if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextButton.click();
                } else if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevButton.click();
                }
            });

            // Táctil y Mouse
            track.addEventListener('mousedown', touchStart);
            track.addEventListener('touchstart', touchStart);

            track.addEventListener('mouseup', touchEnd);
            track.addEventListener('touchend', touchEnd);
            track.addEventListener('mouseleave', touchEnd);

            track.addEventListener('mousemove', touchMove);
            track.addEventListener('touchmove', touchMove);

            track.addEventListener('transitionend', handleTransitionEnd);
        }

        // --- Lógica de Swipe/Drag ---
        function touchStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            track.style.cursor = 'grabbing';
            track.classList.remove('is-animating');
        }

        function touchEnd() {
            if (!isDragging) return;
            isDragging = false;
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            if (movedBy < -100) {
                nextButton.click();
            } else if (movedBy > 100) {
                prevButton.click();
            } else {
                moveToSlide(currentIndex); // Volver al slide actual si no hay swipe
            }
            
            track.style.cursor = 'grab';
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
            const amountToMove = -currentIndex * slideWidth + currentTranslate - prevTranslate;
            track.style.transform = `translateX(${amountToMove}px)`;
            if (isDragging) requestAnimationFrame(animation);
        }

        init();
    });
});
