document.addEventListener('DOMContentLoaded', function() {
    // Инициализация FAQ аккордеона
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Закрыть все другие открытые элементы
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Если элемент не был активен, сделать его активным
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();
});
