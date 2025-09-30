document.addEventListener('DOMContentLoaded', () => {
    const modalTriggers = document.querySelectorAll('[data-modal-target]');
    const overlay = document.getElementById('modal-overlay');

    // Función para abrir un modal
    const openModal = (modal) => {
        if (modal == null) return;
        modal.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evita el scroll del fondo
    };

    // Función para cerrar todos los modales activos
    const closeModal = () => {
        const activeModals = document.querySelectorAll('.modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
        overlay.classList.remove('active');
        document.body.style.overflow = 'auto'; // Restaura el scroll
    };

    // Añadir evento a cada tarjeta que abre un modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const modal = document.querySelector(trigger.dataset.modalTarget);
            openModal(modal);
        });
    });

    // Añadir evento al overlay para cerrar el modal
    overlay.addEventListener('click', closeModal);

    // Añadir evento a todos los botones de cierre
    const closeModalButtons = document.querySelectorAll('.close-modal-btn');
    closeModalButtons.forEach(button => {
        button.addEventListener('click', closeModal);
    });
});