$(document).ready(function() {
    // Конфигурация таймеров
    const timerModes = {
        pomodoro: {
            name: 'Помо',
            duration: 15 * 60, // 15 минут в секундах
            isStopwatch: false
        },
        stopwatch: {
            name: 'Секундомер',
            duration: 0,
            isStopwatch: true
        },
        '5217': {
            name: '52/17',
            duration: 52 * 60, // 52 минуты в секундах
            breakDuration: 17 * 60, // 17 минут в секундах
            isStopwatch: false
        },
        '90': {
            name: '90',
            duration: 90 * 60, // 90 минут в секундах
            isStopwatch: false
        }
    };

    // Состояние таймера
    let currentState = {
        mode: 'pomodoro',
        timeLeft: timerModes.pomodoro.duration,
        isRunning: false,
        interval: null,
        startTime: null,
        elapsedTime: 0
    };

    // Добавляем массив для хранения логов
    let timerLogs = [];

    // DOM элементы
    const $timerDisplay = $('.timer-display');
    const $startButton = $('.timer-button:not(.stop)');
    const $stopButton = $('.timer-button.stop');
    const $presets = $('.preset');

    // Инициализация
    function init() {
        updateDisplay();
        setupEventListeners();
        loadTimerLogs();
        updateStats();
        $stopButton.hide(); // Изначально скрываем кнопку "Стоп"
    }

    // Настройка обработчиков событий
    function setupEventListeners() {
        // Обработка клика по пресетам
        $presets.on('click', function() {
            const $preset = $(this);
            const mode = $preset.text().toLowerCase();
            
            if (mode === '+' || mode === '•••') return; // Пропускаем служебные кнопки
            
            $presets.removeClass('active');
            $preset.addClass('active');
            
            switchMode(mode);
        });

        // Обработка клика по кнопке старт/пауза
        $startButton.on('click', toggleTimer);

        // Обработка клика по кнопке стоп
        $stopButton.on('click', stopAndResetTimer);
    }

    // Переключение режима таймера
    function switchMode(mode) {
        if (currentState.isRunning) {
            stopTimer();
        }

        const modeKey = mode === 'секундомер' ? 'stopwatch' : 
                       mode === '52/17' ? '5217' :
                       mode === '90' ? '90' : 'pomodoro';

        currentState.mode = modeKey;
        currentState.timeLeft = timerModes[modeKey].duration;
        currentState.elapsedTime = 0;
        
        updateDisplay();
        $startButton.text('Начать');
        $stopButton.hide(); // Скрываем кнопку стоп при смене режима
    }

    // Запуск/пауза таймера
    function toggleTimer() {
        if (currentState.isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    }

    // Запуск таймера
    function startTimer() {
        currentState.isRunning = true;
        currentState.startTime = Date.now() - (currentState.elapsedTime * 1000);
        $startButton.text('Пауза');
        $stopButton.show(); // Показываем кнопку стоп при запуске

        currentState.interval = setInterval(() => {
            const mode = timerModes[currentState.mode];
            
            if (mode.isStopwatch) {
                updateStopwatch();
            } else {
                updateCountdown();
            }
        }, 1000);
    }

    // Пауза таймера
    function pauseTimer() {
        clearInterval(currentState.interval);
        currentState.isRunning = false;
        $startButton.text('Продолжить');
        
        // Сохраняем запись всегда, независимо от длительности
        saveTimerSession();
    }

    // Полная остановка и сброс таймера
    function stopAndResetTimer() {
        clearInterval(currentState.interval);
        currentState.isRunning = false;
        
        // Сохраняем запись всегда, независимо от длительности
        saveTimerSession();

        currentState.elapsedTime = 0;
        currentState.timeLeft = timerModes[currentState.mode].duration;
        updateDisplay();
        $startButton.text('Начать');
        $stopButton.hide();
    }

    // Остановка таймера
    function stopTimer() {
        clearInterval(currentState.interval);
        currentState.isRunning = false;
        $startButton.text('Начать');
        $stopButton.hide(); // Скрываем кнопку стоп при остановке
    }

    // Обновление секундомера
    function updateStopwatch() {
        currentState.elapsedTime = Math.floor((Date.now() - currentState.startTime) / 1000);
        const minutes = Math.floor(currentState.elapsedTime / 60);
        const seconds = currentState.elapsedTime % 60;
        $timerDisplay.text(`${padNumber(minutes)}:${padNumber(seconds)}`);
    }

    // Обновление обратного отсчета
    function updateCountdown() {
        const now = Date.now();
        const elapsed = Math.floor((now - currentState.startTime) / 1000);
        currentState.timeLeft = timerModes[currentState.mode].duration - elapsed;

        if (currentState.timeLeft <= 0) {
            timerFinished();
            return;
        }

        const minutes = Math.floor(currentState.timeLeft / 60);
        const seconds = currentState.timeLeft % 60;
        $timerDisplay.text(`${padNumber(minutes)}:${padNumber(seconds)}`);
    }

    // Действия по завершению таймера
    function timerFinished() {
        stopTimer();
        showNotification('Время вышло!');
        
        if (currentState.mode === '5217' && !currentState.isBreak) {
            // Переключаемся на перерыв для режима 52/17
            currentState.isBreak = true;
            currentState.timeLeft = timerModes['5217'].breakDuration;
            startTimer();
        }
    }

    // Обновление отображения
    function updateDisplay() {
        const mode = timerModes[currentState.mode];
        if (mode.isStopwatch) {
            $timerDisplay.text('00:00');
        } else {
            const minutes = Math.floor(currentState.timeLeft / 60);
            const seconds = currentState.timeLeft % 60;
            $timerDisplay.text(`${padNumber(minutes)}:${padNumber(seconds)}`);
        }
    }

    // Загрузка логов из localStorage
    function loadTimerLogs() {
        const savedLogs = localStorage.getItem('timerLogs');
        if (savedLogs) {
            try {
                timerLogs = JSON.parse(savedLogs).map(log => {
                    const startTime = new Date(log.startTime);
                    const endTime = new Date(log.endTime);
                    return {
                        ...log,
                        startTime: startTime,
                        endTime: endTime,
                        // Пересчитываем duration на основе разницы времени
                        duration: Math.round((endTime - startTime) / 1000)
                    };
                });
                renderTimerLogs();
            } catch (error) {
                console.error('Ошибка при загрузке логов:', error);
                timerLogs = [];
            }
        }
    }

    // Сохранение сессии таймера
    function saveTimerSession(duration) {
        const endTime = new Date();
        const session = {
            id: Date.now(),
            type: currentState.mode,
            startTime: new Date(currentState.startTime),
            endTime: endTime,
            duration: Math.round((endTime - new Date(currentState.startTime)) / 1000) // Точная разница в секундах
        };

        // Добавляем сессию в начало массива логов
        timerLogs.unshift(session);
        
        // Сохраняем в localStorage
        localStorage.setItem('timerLogs', JSON.stringify(timerLogs));
        
        // Обновляем отображение
        renderTimerLogs();
        updateStats();
    }

    // Вспомогательная функция для добавления ведущего нуля
    function padNumber(num) {
        return num.toString().padStart(2, '0');
    }

    // Показ уведомления
    function showNotification(message) {
        $('.notification').text(message)
            .fadeIn()
            .delay(3000)
            .fadeOut();
    }

    // Рендеринг логов
    function renderTimerLogs() {
        const $logsContainer = $('.timer-logs');
        $logsContainer.empty();
        $logsContainer.append('<h2>Записи фокусов</h2>');

        // Группируем логи по датам
        const groupedLogs = groupLogsByDate(timerLogs);

        // Отображаем каждую группу
        Object.entries(groupedLogs).forEach(([date, logs]) => {
            const $dateGroup = $('<div>').addClass('log-date-group');
            $dateGroup.append($('<h3>').text(date));

            logs.forEach(log => {
                const $logItem = createLogItem(log);
                $dateGroup.append($logItem);
            });

            $logsContainer.append($dateGroup);
        });
    }

    // Группировка логов по датам
    function groupLogsByDate(logs) {
        const groups = {};
        logs.forEach(log => {
            const date = log.startTime.toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long'
            });
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(log);
        });
        return groups;
    }

    // Создание элемента записи
    function createLogItem(log) {
        const startTime = log.startTime.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const endTime = log.endTime.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });

        return $('<div>').addClass('log-item')
            .append($('<div>').addClass(`log-icon ${log.type}`))
            .append($('<div>').addClass('log-time').text(`${startTime} - ${endTime}`))
            .append($('<div>').addClass('log-duration').text(formatDuration(log.duration)));
    }

    // Форматирование продолжительности
    function formatDuration(seconds) {
        // Если меньше минуты - показываем только секунды
        if (seconds < 60) {
            return `${seconds} ${declOfNum(seconds, ['секунда', 'секунды', 'секунд'])}`;
        }
        
        // Для времени больше минуты используем часы и минуты
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        
        let result = '';
        if (hours > 0) {
            result += `${hours} ${declOfNum(hours, ['час', 'часа', 'часов'])} `;
        }
        result += `${minutes} ${declOfNum(minutes, ['минута', 'минуты', 'минут'])}`;
        
        return result.trim();
    }

    // Склонение числительных
    function declOfNum(n, titles) {
        return titles[n % 10 === 1 && n % 100 !== 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2];
    }

    // Обновление статистики
    function updateStats() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Фильтруем логи за сегодня
        const todayLogs = timerLogs.filter(log => {
            const logDate = new Date(log.startTime);
            logDate.setHours(0, 0, 0, 0);
            return logDate.getTime() === today.getTime();
        });

        // Считаем статистику
        const pomodoroToday = todayLogs.filter(log => log.type === 'pomodoro').length;
        const focusTimeToday = todayLogs.reduce((acc, log) => acc + log.duration, 0);
        const pomodoroTotal = timerLogs.filter(log => log.type === 'pomodoro').length;
        const focusTimeTotal = timerLogs.reduce((acc, log) => acc + log.duration, 0);

        // Обновляем отображение
        $('.stat-item:nth-child(1) .stat-value').text(pomodoroToday);
        $('.stat-item:nth-child(2) .stat-value').text(formatDuration(focusTimeToday));
        $('.stat-item:nth-child(3) .stat-value').text(pomodoroTotal);
        $('.stat-item:nth-child(4) .stat-value').text(formatDuration(focusTimeTotal));
    }

    // Запуск инициализации
    init();
}); 