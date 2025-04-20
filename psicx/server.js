// Импорты необходимых модулей
const express = require('express');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');

// Загрузка переменных окружения из .env файла
dotenv.config();

// Инициализация Express приложения
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware для обработки JSON данных
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Статические файлы
app.use(express.static(path.join(__dirname, 'public')));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Обновленный системный промпт
const systemPrompt = `Ты высококвалифицированный психолог-консультант, который помогает людям с их эмоциональными и психологическими проблемами. 

Вот основные принципы твоего общения:
1. Эмпатия и понимание. Ты всегда признаешь чувства человека и даёшь ему понять, что его переживания важны и нормальны.
2. Неформальный, дружеский тон. Обращайся на "ты", используй разговорный стиль, как будто общаешься с близким другом.
3. Структурированные ответы. Используй форматирование — **жирный текст** для выделения ключевых мыслей и советов.
4. Конкретные советы. Предлагай практические шаги, которые человек может предпринять, а не общие фразы.
5. Не торопись с выводами. Задавай уточняющие вопросы, если ситуация не полностью ясна.

Ты особенно хорошо помогаешь в следующих областях:
- Отношения (романтические, семейные, дружеские)
- Преодоление одиночества и социальной тревожности
- Работа с эмоциями (грусть, тревога, злость)
- Самооценка и уверенность в себе
- Мотивация и преодоление апатии
- Переживание утраты и расставаний

Важные правила:
- Не используй формальный, академический язык психологии
- Избегай клише и банальных советов
- Не используй ссылки и номера в квадратных скобках [1] — они плохо отображаются в интерфейсе
- Всегда разбивай большие блоки текста на абзацы для легкости чтения
- Используй эмодзи умеренно и только когда это уместно
- В случае признаков серьезных проблем (суицидальные мысли, насилие, клиническая депрессия), мягко рекомендуй обратиться к профессиональному психологу или психиатру

Цель твоего общения — дать человеку почувствовать, что его слышат, понимают и поддерживают, и помочь ему найти конструктивный путь решения его проблем.`;

// API endpoint для взаимодействия с Perplexity AI
app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Сообщение не может быть пустым' });
        }

        // API ключ теперь хранится безопасно в переменных окружения
        const API_KEY = process.env.PERPLEXITY_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API ключ не настроен на сервере' });
        }

        // Запрос к Perplexity API с использованием обновленного промпта
        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'sonar-pro',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 1000
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        // Возвращаем ответ от AI
        return res.json({
            response: response.data.choices[0].message.content
        });

    } catch (error) {
        console.error('Ошибка при обращении к API:', error);

        // Фолбэк - если API недоступен, используем заранее подготовленные ответы
        const lowerMessage = req.body.message.toLowerCase();
        let fallbackResponse = 'Извини, у меня возникли технические проблемы. Но я всё равно здесь, чтобы выслушать тебя. Расскажи подробнее, что тебя беспокоит?';

        if (lowerMessage.includes('привет') || lowerMessage.includes('здравствуй')) {
            fallbackResponse = 'Привет! Рад, что ты решил(а) поговорить. Что тебя сейчас беспокоит?';
        } else if (lowerMessage.includes('девушк') || lowerMessage.includes('отношения')) {
            fallbackResponse = 'Отношения бывают сложными, и это нормально. Расскажи подробнее, что происходит между вами? Я постараюсь помочь разобраться в ситуации и найти решение.';
        } else if (lowerMessage.includes('одиноч') || lowerMessage.includes('один')) {
            fallbackResponse = 'Чувство одиночества знакомо каждому из нас, и в нем нет ничего постыдного. Важно помнить, что ты не один/одна со своими переживаниями. Хочешь рассказать, что заставляет тебя чувствовать себя одиноко?';
        }

        return res.json({ response: fallbackResponse });
    }
});

// API endpoint для поиска ресурсов через Perplexity
app.post('/api/search-resources', async (req, res) => {
    try {
        const { query } = req.body;

        if (!query) {
            return res.status(400).json({ error: 'Запрос поиска не может быть пустым' });
        }

        const API_KEY = process.env.PERPLEXITY_API_KEY;

        if (!API_KEY) {
            return res.status(500).json({ error: 'API ключ не настроен на сервере' });
        }

        // Формируем поисковый запрос для получения релевантных ресурсов
        const searchPrompt = `Найди 3-4 полезных ресурса по теме "${query}" для психологической помощи. 
        Для каждого ресурса укажи:
        1. Название
        2. Краткое описание (до 100 символов)
        3. URL-ссылку
        4. Тип (article или video)
        
        Формат ответа должен быть в JSON:
        [
          {
            "title": "Название ресурса",
            "description": "Краткое описание",
            "link": "https://ссылка.на/ресурс",
            "type": "article" или "video"
          },
          ...
        ]
        
        Важно: возвращай только JSON, без дополнительного текста.`;

        // Запрос к Perplexity API для поиска
        const response = await axios.post('https://api.perplexity.ai/chat/completions', {
            model: 'sonar-pro',
            messages: [
                { role: 'system', content: 'Ты - ассистент по поиску полезных ресурсов для людей с психологическими проблемами. Ты возвращаешь только структурированные данные в формате JSON, без дополнительного текста.' },
                { role: 'user', content: searchPrompt }
            ],
            temperature: 0.1, // Низкая температура для более структурированных ответов
            max_tokens: 1500
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            }
        });

        // Получаем ответ от API
        const responseText = response.data.choices[0].message.content;

        // Извлекаем JSON из ответа
        let resources;
        try {
            // Ищем JSON в ответе (на случай, если в ответе есть дополнительный текст)
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                resources = JSON.parse(jsonMatch[0]);
            } else {
                resources = JSON.parse(responseText);
            }
        } catch (error) {
            console.error('Ошибка парсинга JSON из ответа:', error);
            console.log('Полученный ответ:', responseText);
            return res.status(500).json({
                error: 'Не удалось распарсить результаты поиска',
                rawResponse: responseText
            });
        }

        // Добавляем изображения для ресурсов
        resources = resources.map(resource => {
            // Для видео пытаемся извлечь ID из YouTube URL
            if (resource.type === 'video' && (resource.link.includes('youtube.com') || resource.link.includes('youtu.be'))) {
                let videoId = '';
                if (resource.link.includes('v=')) {
                    videoId = resource.link.split('v=')[1].split('&')[0];
                } else if (resource.link.includes('youtu.be/')) {
                    videoId = resource.link.split('youtu.be/')[1].split('?')[0];
                }

                if (videoId) {
                    resource.image = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
                } else {
                    resource.image = '/images/video-placeholder.jpg';
                }
            } else {
                // Для статей используем плейсхолдер
                resource.image = '/images/article-placeholder.jpg';
            }

            return resource;
        });

        return res.json({ resources });

    } catch (error) {
        console.error('Ошибка при поиске ресурсов:', error);
        return res.status(500).json({
            error: 'Не удалось найти ресурсы',
            message: error.message
        });
    }
});

// Маршрут для проверки состояния сервера
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Обработка 404 ошибок
app.use((req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Откройте http://localhost:${PORT} в браузере`);
});

// Создаем структуру папок при первом запуске, если она отсутствует
const publicDir = path.join(__dirname, 'public');
const imagesDir = path.join(publicDir, 'images');

if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
    console.log('Создана папка public');
}

if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir);
    console.log('Создана папка public/images');
}

// Проверяем наличие файла .env и создаем его, если он отсутствует
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
    fs.writeFileSync(
        envPath,
        'PORT=3001\nPERPLEXITY_API_KEY=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'
    );
    console.log('Создан файл .env с настройками по умолчанию');
}

// Создаем плейсхолдеры для изображений, если их еще нет
const videoPlaceholderPath = path.join(imagesDir, 'video-placeholder.jpg');
const articlePlaceholderPath = path.join(imagesDir, 'article-placeholder.jpg');

if (!fs.existsSync(videoPlaceholderPath)) {
    // Создаем базовый плейсхолдер в виде простого текстового файла
    fs.writeFileSync(videoPlaceholderPath, 'Placeholder for video thumbnails');
    console.log('Создан плейсхолдер для видео');
}

if (!fs.existsSync(articlePlaceholderPath)) {
    // Создаем базовый плейсхолдер в виде простого текстового файла
    fs.writeFileSync(articlePlaceholderPath, 'Placeholder for article thumbnails');
    console.log('Создан плейсхолдер для статей');
}

// Проверяем наличие файла 404.html и создаем его, если он отсутствует
const notFoundPath = path.join(publicDir, '404.html');
if (!fs.existsSync(notFoundPath)) {
    fs.writeFileSync(
        notFoundPath,
        '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Страница не найдена</title><style>body {font-family: Arial; text-align: center; padding: 50px;} h1 {color: #5271ff;}</style></head><body><h1>404 - Страница не найдена</h1><p>Извини, такой страницы не существует.</p><a href="/">Вернуться на главную</a></body></html>'
    );
    console.log('Создан файл 404.html');
}