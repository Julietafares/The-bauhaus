document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const title = document.querySelector('.main-title');
    // El punto donde el título debe cambiar es un poco antes de que la tarjeta de contenido toque el título
    const triggerPoint = 130; 

    window.addEventListener('scroll', () => {
        if (window.scrollY > triggerPoint) {
            header.classList.add('sticky');
            title.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
            title.classList.remove('sticky');
        }
    });
});
