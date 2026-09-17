document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentIndex = 0;
    const totalSlides = slides.length;

    function updateSlides() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            
            if (index === currentIndex) {
                slide.classList.add('active');
            } else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
                slide.classList.add('prev');
            } else if (index === (currentIndex + 1) % totalSlides) {
                slide.classList.add('next');
            }
        });
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            updateSlides();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            updateSlides();
        });
    }

    // অটো প্লে (৩.৫ সেকেন্ড পর পর)
    setInterval(() => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlides();
    }, 5000);

    // প্রথমবার পজিশন সেটআপ
    updateSlides();
});