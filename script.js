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

    // Анимация при скроллинге
    const contentBlocks = document.querySelectorAll('.content');
    
    // Делаем первый блок видимым сразу
    if (contentBlocks.length > 0) {
        contentBlocks[0].classList.add('visible');
    }
    
    // Функция для проверки, находится ли элемент в видимой области
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Функция для добавления класса visible элементам в поле зрения
    function handleScroll() {
        contentBlocks.forEach(block => {
            if (isElementInViewport(block)) {
                block.classList.add('visible');
            }
        });
    }
    
    // Запускаем один раз для элементов, которые уже в поле зрения
    handleScroll();
    
    // Устанавливаем слушатель события прокрутки
    window.addEventListener('scroll', handleScroll);

    // Инициализация Telegram WebApp
    const tg = window.Telegram.WebApp;
    tg.expand();
});
