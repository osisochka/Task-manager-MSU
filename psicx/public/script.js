document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('message-input');
    const sendBtn = document.getElementById('send-btn');
    const chatMessages = document.getElementById('chat-messages');
    const status = document.getElementById('status');
    const toast = document.getElementById('toast');
    const helpBubble = document.getElementById('help-bubble');
    const resourcesContainer = document.getElementById('resources-container');

    // Глобальная переменная для отслеживания состояния ожидания ответа
    let isWaitingForResponse = false;

    // Таймер для анимации ожидания
    let waitAnimationTimer = null;

    // Набор интересных фактов для показа во время ожидания
    const waitingFacts = [
        "Знаешь ли ты? Разговор с самим собой снижает уровень стресса и помогает решать проблемы.",
        "Интересный факт: Объятие длиной более 20 секунд выделяет окситоцин — гормон, снижающий тревогу.",
        "Ты задумывался? Наш мозг не различает реальную и воображаемую ситуации, когда дело касается эмоций.",
        "Быстрый совет: Глубокое дыхание (4 секунды вдох, 4 секунды выдох) помогает успокоить нервную систему за 1-2 минуты.",
        "Знаешь ли ты? Улыбка, даже вынужденная, может улучшить настроение благодаря сигналам, которые мышцы лица отправляют мозгу.",
        "Интересный факт: Физическая активность так же эффективна при лечении лёгких и умеренных форм депрессии, как антидепрессанты.",
        "Любопытно: Сон помогает мозгу упорядочивать эмоциональный опыт дня.",
        "Знаешь ли ты? Просмотр фотографий милых животных может повысить концентрацию внимания."
    ];

    // Счетчик для случайного показа фактов
    let factIndex = Math.floor(Math.random() * waitingFacts.length);

    // Функция для анимации пишущих точек (индикатор печати)
    function showTypingIndicator() {
        // Проверяем, нет ли уже индикатора
        if (document.querySelector('.typing-indicator')) return;

        // Создаем элемент индикатора печати
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'message bot-message typing-indicator';
        typingIndicator.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;

        // Добавляем индикатор в чат
        chatMessages.appendChild(typingIndicator);

        // Анимируем появление
        setTimeout(() => {
            typingIndicator.classList.add('show');
        }, 10);

        // Скроллим вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Функция для скрытия индикатора печати
    function hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.classList.remove('show');
            setTimeout(() => typingIndicator.remove(), 300);
        }
    }

    // Функция для показа случайного факта во время ожидания
    function showWaitingFact() {
        // Проверяем, нет ли уже сообщения с фактом
        const existingFact = document.querySelector('.waiting-fact');
        if (existingFact) existingFact.remove();

        // Создаем сообщение с фактом
        const factMessage = document.createElement('div');
        factMessage.className = 'message bot-message waiting-fact';
        factMessage.innerHTML = `
            <div class="waiting-badge">Пока я думаю...</div>
            <p>${waitingFacts[factIndex]}</p>
        `;

        // Обновляем индекс для следующего факта
        factIndex = (factIndex + 1) % waitingFacts.length;

        // Добавляем сообщение с фактом в чат
        chatMessages.appendChild(factMessage);

        // Анимируем появление
        setTimeout(() => {
            factMessage.classList.add('show');
        }, 10);

        // Скроллим вниз
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Функция для скрытия всех фактов
    function hideWaitingFacts() {
        const facts = document.querySelectorAll('.waiting-fact');
        facts.forEach(fact => {
            fact.classList.remove('show');
            setTimeout(() => fact.remove(), 300);
        });
    }

    // Инициализация анимации загрузки
    function initializeWaitingAnimation() {
        if (waitAnimationTimer) {
            clearInterval(waitAnimationTimer);
        }

        // Показываем первый факт сразу
        setTimeout(showWaitingFact, 3001);

        // Устанавливаем интервал для показа новых фактов
        waitAnimationTimer = setInterval(() => {
            if (isWaitingForResponse) {
                showWaitingFact();
            } else {
                clearInterval(waitAnimationTimer);
                waitAnimationTimer = null;
            }
        }, 8000);
    }

    // Функция остановки анимации ожидания
    function stopWaitingAnimation() {
        isWaitingForResponse = false;
        if (waitAnimationTimer) {
            clearInterval(waitAnimationTimer);
            waitAnimationTimer = null;
        }
        hideWaitingFacts();
    }

    // Event listeners
    sendBtn.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Help bubble animation
    helpBubble.addEventListener('click', function() {
        document.querySelector('#chat').scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            messageInput.focus();
            showToast('Расскажи, чем я могу помочь тебе сегодня?');
        }, 800);
    });

    // Animate help bubble
    setInterval(() => {
        helpBubble.style.transform = 'scale(1.1)';
        setTimeout(() => {
            helpBubble.style.transform = 'scale(1)';
        }, 500);
    }, 3000);

    // Асинхронная функция для поиска ресурсов
    async function searchResources(query) {
        try {
            const response = await fetch('/api/search-resources', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ query })
            });

            if (!response.ok) {
                throw new Error('Ошибка при поиске ресурсов');
            }

            const data = await response.json();
            return data.resources;
        } catch (error) {
            console.error('Ошибка при поиске ресурсов:', error);
            return null;
        }
    }

    // Send message to server
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message || isWaitingForResponse) return;

        // Устанавливаем флаг ожидания
        isWaitingForResponse = true;

        // Add user message to chat
        addMessage(message, 'user');
        messageInput.value = '';

        // Show emoji selector occasionally
        if (Math.random() > 0.7) {
            showEmojiSelector();
        }

        // Показываем индикатор печати и устанавливаем статус
        showTypingIndicator();
        status.textContent = 'Печатает...';

        // Запускаем анимацию ожидания
        initializeWaitingAnimation();

        try {
            // Параллельно запускаем поиск ресурсов и запрос ответа бота
            const [chatResponse, resources] = await Promise.all([
                // Запрос ответа от бота
                fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
                }).then(res => {
                    if (!res.ok) throw new Error('Ошибка сети');
                    return res.json();
                }),

                // Запрос ресурсов
                searchResources(message)
            ]);

            // Останавливаем анимацию ожидания
            stopWaitingAnimation();

            // Скрываем индикатор печати
            hideTypingIndicator();

            // Add bot response to chat
            addMessage(chatResponse.response, 'bot');

            // Обновляем ресурсы, если они были найдены
            if (resources && resources.length > 0) {
                displayResources(resources);
            }

            // Update status
            status.textContent = 'Онлайн';

            // Сбрасываем флаг ожидания
            isWaitingForResponse = false;
        } catch (error) {
            console.error('Error getting response:', error);
            stopWaitingAnimation();
            hideTypingIndicator();
            addMessage('Извините, произошла ошибка. Пожалуйста, попробуйте позже.', 'bot');
            status.textContent = 'Ошибка подключения';
            isWaitingForResponse = false;
        }
    }

    // Функция для отображения найденных ресурсов
    function displayResources(resources) {
        // Обновляем контейнер ресурсов
        resourcesContainer.innerHTML = '<h3>Полезные ресурсы по теме</h3>';

        // Создаем контейнер для ресурсов
        const resourcesList = document.createElement('div');
        resourcesList.className = 'resources-list';

        // Добавляем карточки ресурсов
        resources.forEach(resource => {
            const resourceCard = document.createElement('div');
            resourceCard.className = `resource-card ${resource.type}`;
            
            // Разная разметка для разных типов ресурсов
            if (resource.type === 'video') {
                // Для видео добавляем превью с кнопкой воспроизведения
                const thumbnailUrl = resource.thumbnail || 'https://img.youtube.com/vi/' + getYoutubeId(resource.link) + '/hqdefault.jpg';
                
                resourceCard.innerHTML = `
                    <a href="${resource.link}" class="video-link" target="_blank">
                        <div class="video-preview" style="background-image: url('${thumbnailUrl}')">
                            <div class="play-button"></div>
                        </div>
                    </a>
                    <a href="${resource.link}" class="resource-title" target="_blank">${resource.title}</a>
                    <p class="resource-description">${resource.description}</p>
                    <span class="resource-type">${getResourceTypeLabel(resource.type)}</span>
                `;
            } else {
                // Для остальных типов стандартная разметка
                resourceCard.innerHTML = `
                    <a href="${resource.link}" class="resource-title" target="_blank">${resource.title}</a>
                    <p class="resource-description">${resource.description}</p>
                    <span class="resource-type">${getResourceTypeLabel(resource.type)}</span>
                `;
            }
            
            resourcesList.appendChild(resourceCard);
        });

        resourcesContainer.appendChild(resourcesList);

        // Показываем контейнер с анимацией
        resourcesContainer.style.display = 'block';
        setTimeout(() => {
            resourcesContainer.classList.add('show');
        }, 100);
    }

    // Функция для извлечения ID видео YouTube из ссылки
    function getYoutubeId(url) {
        if (!url) return '';
        
        // Поддерживаем разные форматы ссылок YouTube
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        return (match && match[2].length === 11) ? match[2] : '';
    }

    // Функция для получения метки типа ресурса
    function getResourceTypeLabel(type) {
        const labels = {
            'article': 'Статья',
            'service': 'Сервис',
            'hotline': 'Горячая линия',
            'telegram': 'Telegram',
            'video': 'Видео'
        };
        return labels[type] || type;
    }

    // Улучшенная функция добавления сообщений с поддержкой форматирования
    function addMessage(text, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message');
        messageElement.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        if (sender === 'bot') {
            // Обработка форматирования для сообщений бота
            text = processFormattedText(text);
            messageElement.innerHTML = text;
        } else {
            // Обычный текст для сообщений пользователя
            messageElement.textContent = text;
        }

        chatMessages.appendChild(messageElement);

        // Добавляем анимацию появления
        setTimeout(() => {
            messageElement.classList.add('show');
        }, 10);

        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Функция для обработки форматированного текста
    function processFormattedText(text) {
        // Обработка жирного текста (обрабатываем ** и __ разметку)
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        text = text.replace(/__(.*?)__/g, '<strong>$1</strong>');

        // Обработка курсива
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
        text = text.replace(/_(.*?)_/g, '<em>$1</em>');

        // Удаление маркеров цитат [1], [2], и т.д.
        text = text.replace(/\[\d+\]/g, '<span class="citation-marker">$&</span>');

        // Обработка ссылок
        text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');

        // Обработка маркированных списков
        text = text.replace(/^\s*-\s+(.+)$/gm, '<li>$1</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');

        // Обработка нумерованных списков
        text = text.replace(/^\s*(\d+)\.\s+(.+)$/gm, '<li>$2</li>');
        text = text.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');

        // Обработка абзацев (два или более переносов строк)
        text = text.replace(/\n\s*\n/g, '</p><p>');
        text = '<p>' + text + '</p>';

        // Убираем пустые параграфы
        text = text.replace(/<p>\s*<\/p>/g, '');

        return text;
    }

    // Show emoji selector
    function showEmojiSelector() {
        const emojiSelector = document.createElement('div');
        emojiSelector.classList.add('emoji-selector');

        const emojis = ['😊', '😢', '😡', '❤️', '👍', '🤔', '😔'];

        emojis.forEach(emoji => {
            const btn = document.createElement('button');
            btn.classList.add('emoji-btn');
            btn.textContent = emoji;
            btn.addEventListener('click', () => {
                addMessage(emoji, 'user');
                emojiSelector.remove();

                // Trigger response to emoji
                let emojiMessage = '';

                switch(emoji) {
                    case '😊': emojiMessage = 'Я чувствую себя хорошо'; break;
                    case '😢': emojiMessage = 'Мне грустно'; break;
                    case '😡': emojiMessage = 'Я злюсь'; break;
                    case '❤️': emojiMessage = 'Спасибо за поддержку'; break;
                    case '👍': emojiMessage = 'Да, всё хорошо'; break;
                    case '🤔': emojiMessage = 'Я не уверен, что делать'; break;
                    case '😔': emojiMessage = 'Мне одиноко'; break;
                    default: emojiMessage = 'Привет';
                }

                // Set status to "typing"
                status.textContent = 'Печатает...';

                // Устанавливаем флаг ожидания
                isWaitingForResponse = true;

                // Показываем индикатор печати
                showTypingIndicator();

                // Запускаем анимацию ожидания
                initializeWaitingAnimation();

                // Send emoji meaning to API
                fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: emojiMessage })
                })
                    .then(response => response.json())
                    .then(data => {
                        // Останавливаем анимацию ожидания
                        stopWaitingAnimation();

                        // Скрываем индикатор печати
                        hideTypingIndicator();

                        addMessage(data.response, 'bot');
                        status.textContent = 'Онлайн';

                        // Сбрасываем флаг ожидания
                        isWaitingForResponse = false;

                        // Также запрашиваем ресурсы
                        searchResources(emojiMessage)
                            .then(resources => {
                                if (resources && resources.length > 0) {
                                    displayResources(resources);
                                }
                            });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        stopWaitingAnimation();
                        hideTypingIndicator();
                        addMessage('Извините, произошла ошибка. Пожалуйста, попробуйте позже.', 'bot');
                        status.textContent = 'Ошибка подключения';
                        isWaitingForResponse = false;
                    });
            });

            emojiSelector.appendChild(btn);
        });

        chatMessages.appendChild(emojiSelector);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Анимация появления
        setTimeout(() => {
            emojiSelector.classList.add('show');
        }, 10);

        // Auto-remove after some time if not used
        setTimeout(() => {
            if (emojiSelector.parentNode === chatMessages) {
                emojiSelector.classList.remove('show');
                setTimeout(() => {
                    if (emojiSelector.parentNode === chatMessages) {
                        emojiSelector.remove();
                    }
                }, 300);
            }
        }, 8000);
    }

    // Show toast notification
    function showToast(message) {
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Инициализация голосового ввода
    function initVoiceInput() {
        // Проверяем поддержку распознавания речи в браузере
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            console.error('Распознавание речи не поддерживается в этом браузере');
            return false;
        }

        // Создаем кнопку голосового ввода
        const chatInputContainer = document.querySelector('.chat-input');
        const voiceButton = document.createElement('div');
        voiceButton.className = 'voice-btn';
        voiceButton.innerHTML = '<span>🎤</span>';
        voiceButton.title = 'Нажмите, чтобы начать голосовой ввод';
        chatInputContainer.appendChild(voiceButton);

        // Создаем индикатор распознавания
        const voiceIndicator = document.createElement('div');
        voiceIndicator.className = 'voice-indicator';
        voiceIndicator.innerHTML = `
            <div class="wave-container">
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
                <div class="wave"></div>
            </div>
            <div class="voice-text">Говорите...</div>
        `;
        voiceIndicator.style.display = 'none';
        document.body.appendChild(voiceIndicator);

        // Настройка распознавания речи
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ru-RU';
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        let isListening = false;
        let finalTranscript = '';
        let interimTranscript = '';

        // Функция анимации волн на основе громкости
        function animateWavesByVolume() {
            const waves = document.querySelectorAll('.wave');
            waves.forEach((wave, index) => {
                const randomHeight = 10 + Math.random() * 20;
                wave.style.height = `${randomHeight}px`;
                wave.style.opacity = 0.6 + Math.random() * 0.4;
            });
        }

        // Запускаем анимацию волн периодически
        let waveAnimationInterval;

        // Обработчики событий для распознавания речи
        recognition.onstart = function() {
            isListening = true;
            finalTranscript = '';
            interimTranscript = '';
            voiceButton.classList.add('active');
            voiceButton.title = 'Нажмите, чтобы остановить запись';
            voiceIndicator.style.display = 'flex';
            document.body.classList.add('recording');

            // Запускаем анимацию волн
            waveAnimationInterval = setInterval(animateWavesByVolume, 200);

            showToast('Говорите, я вас слушаю');
        };

        recognition.onresult = function(event) {
            interimTranscript = '';

            // Обработка результатов распознавания
            for (let i = event.resultIndex; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' ';
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Обновляем текст в поле ввода
            messageInput.value = finalTranscript + interimTranscript;

            // Обновляем текст в индикаторе
            document.querySelector('.voice-text').textContent = interimTranscript || 'Говорите...';

            // Анимируем волны
            animateWavesByVolume();
        };

        recognition.onend = function() {
            isListening = false;
            voiceButton.classList.remove('active');
            voiceButton.title = 'Нажмите, чтобы начать голосовой ввод';
            voiceIndicator.style.display = 'none';
            document.body.classList.remove('recording');

            // Останавливаем анимацию волн
            clearInterval(waveAnimationInterval);

            // Если есть текст, подготавливаем отправку сообщения
            if (messageInput.value.trim() && finalTranscript) {
                showToast('Голосовой ввод завершен');

                // Можно автоматически отправить сообщение
                if (messageInput.value.trim().length > 3) {  // Если текст достаточно длинный
                    setTimeout(() => {
                        if (!isWaitingForResponse) sendMessage();
                    }, 1000);
                }
            }
        };

        recognition.onerror = function(event) {
            isListening = false;
            voiceButton.classList.remove('active');
            voiceIndicator.style.display = 'none';
            document.body.classList.remove('recording');
            clearInterval(waveAnimationInterval);

            showToast('Ошибка распознавания: ' + event.error);
            console.error('Ошибка распознавания речи:', event.error);
        };

        // Обработчик нажатия на кнопку
        voiceButton.addEventListener('click', function() {
            if (isListening) {
                recognition.stop();
            } else {
                recognition.start();
            }
        });

        return true;
    }

    // Initialize chat
    status.textContent = 'Онлайн';

    // Проверяем соединение с сервером
    fetch('/health')
        .then(response => {
            if (response.ok) {
                console.log('Соединение с сервером установлено');
                // Убираем показ toast-уведомления
                // showToast('Соединение установлено');

                // Инициализируем голосовой ввод
                const voiceInputSupported = initVoiceInput();
                if (voiceInputSupported) {
                    console.log('Голосовой ввод инициализирован');
                } else {
                    console.warn('Голосовой ввод не поддерживается');
                }
            } else {
                console.error('Ошибка соединения с сервером');
                showToast('Внимание: сервер недоступен, некоторые функции могут не работать');
                status.textContent = 'Офлайн';
            }
        })
        .catch(error => {
            console.error('Ошибка соединения с сервером:', error);
            showToast('Сервер недоступен. Работаем в офлайн-режиме.');
            status.textContent = 'Офлайн';
        });
});