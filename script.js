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
            const tg = window.Telegram.WebApp;
            const user = tg.initDataUnsafe.user;
            
            // Формируем сообщение с данными пользователя
            const message = {
                text: 'Здравствуйте! Хочу записаться на консультацию',
                user: {
                    id: user?.id,
                    username: user?.username,
                    first_name: user?.first_name,
                    last_name: user?.last_name
                },
                date: formattedDate,
                time: formattedTime
            };
            
            // Отправляем данные в бот
            window.Telegram.WebApp.sendData(JSON.stringify(message));
            
            // Закрываем приложение
            window.Telegram.WebApp.close();
            
            // После закрытия отправляем вебхук асинхронно
            setTimeout(() => {
                // Отправляем вебхук с данными пользователя
                console.log('Отправка вебхука на:', 'https://maximov-neuro.ru/webhook-test/334e787d-0eb6-47a6-b3f9-5b188309511c');
                console.log('Данные для отправки:', JSON.stringify({
                    action: 'appointment_request',
                    timestamp: now.toISOString(),
                    user: {
                        id: user?.id,
                        username: user?.username,
                        first_name: user?.first_name,
                        last_name: user?.last_name
                    }
                }));
                
                fetch('https://maximov-neuro.ru/webhook-test/334e787d-0eb6-47a6-b3f9-5b188309511c', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        action: 'appointment_request',
                        timestamp: now.toISOString(),
                        user: {
                            id: user?.id,
                            username: user?.username,
                            first_name: user?.first_name,
                            last_name: user?.last_name
                        }
                    })
                }).then(response => {
                    console.log('Вебхук отправлен успешно, статус:', response.status);
                    return response.text();
                }).then(data => {
                    console.log('Ответ от сервера:', data);
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
