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

    // Функция для отправки вебхука и данных
    window.sendAppointmentRequest = function() {
        // Получаем текущую дату и время
        const now = new Date();
        const formattedDate = now.toLocaleDateString('ru-RU');
        const formattedTime = now.toLocaleTimeString('ru-RU');
        
        try {
            // Сразу отправляем данные в бот, чтобы пользователь получил сообщение
            window.Telegram.WebApp.sendData('Здравствуйте! Хочу записаться на консультацию');
            
            // Закрываем приложение сразу
            window.Telegram.WebApp.close();
            
            // После закрытия отправляем данные асинхронно
            setTimeout(() => {
                // Отправляем данные в Google Sheets
                fetch('https://script.google.com/macros/s/AKfycbzYRGCVg5axULY-nLAD4htZYURYM5X9qqfGgOQ9F042nKL09hmwXV7za5-bHCfn4U3PWQ/exec', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        date: formattedDate,
                        time: formattedTime,
                        action: 'Запрос на консультацию',
                        source: 'Telegram Mini App'
                    })
                }).catch(error => {
                    console.error('Error sending data to Google Sheets:', error);
                });
                
                // Отправляем вебхук
                fetch('https://maximov-neuro.ru/webhook-test/99eab1a0-569d-4f0f-a49e-578a02abfe63/webhook', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'appointment_request',
                        timestamp: now.toISOString()
                    })
                }).catch(error => {
                    console.error('Error sending webhook:', error);
                });
            }, 100);
        } catch (error) {
            console.error('Error during appointment request:', error);
            // В случае ошибки все равно пытаемся закрыть приложение
            try {
                window.Telegram.WebApp.close();
            } catch (closeError) {
                console.error('Error closing app:', closeError);
            }
        }
    };

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
