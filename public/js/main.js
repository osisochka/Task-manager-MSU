document.addEventListener('DOMContentLoaded', function() {
    // Функция для форматирования числа с ведущим нулем
    function padZero(num) {
        return num < 10 ? `0${num}` : num;
    }

    // Функция для определения относительного дня
    function getRelativeDay(date) {
        const today = new Date('2025-04-19'); // Наша текущая дата
        const timeDiff = date.getTime() - today.getTime();
        const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24));

        switch (dayDiff) {
            case -2: return 'Позавчера';
            case -1: return 'Вчера';
            case 0: return 'Сегодня';
            case 1: return 'Завтра';
            case 2: return 'Послезавтра';
            default: return 'Выбранная дата';
        }
    }

    // Функция для форматирования даты на русском языке
    function formatDate(date) {
        const days = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
        const months = ['Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня', 
                       'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'];
        
        const dayName = days[date.getDay()];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        
        return `${dayName}, ${day} ${month} ${year}`;
    }

    // Функция обновления часов
    function updateClock() {
        const now = new Date();
        const localOffset = now.getTimezoneOffset();
        const moscowOffset = 180;
        const offset = (localOffset + moscowOffset) * 60 * 1000;
        
        const moscowTime = new Date(now.getTime() + offset);
        
        const hours = moscowTime.getHours() % 12;
        const minutes = moscowTime.getMinutes();
        const seconds = moscowTime.getSeconds();
        const milliseconds = moscowTime.getMilliseconds();

        const hourDeg = (hours * 30) + (minutes * 0.5) + (seconds * (0.5/60));
        const minuteDeg = (minutes * 6) + (seconds * 0.1);
        const secondDeg = (seconds * 6) + (milliseconds * 0.006);

        const hourHand = document.querySelector('.hour-hand');
        const minuteHand = document.querySelector('.minute-hand');
        const secondHand = document.querySelector('.second-hand');

        if (hourHand && minuteHand && secondHand) {
            hourHand.style.transform = `rotate(${hourDeg}deg)`;
            minuteHand.style.transform = `rotate(${minuteDeg}deg)`;
            secondHand.style.transform = `rotate(${secondDeg}deg)`;
        }

        const timeDisplay = document.querySelector('.digital-clock .time');
        if (timeDisplay) {
            const displayHours = moscowTime.getHours();
            timeDisplay.textContent = `${padZero(displayHours)}:${padZero(minutes)}:${padZero(seconds)}`;
        }
    }

    // Функция обновления даты в календаре
    function updateCalendarDate(date) {
        const currentDateElement = document.querySelector('.current-date');
        if (currentDateElement) {
            const relativeDay = getRelativeDay(date);
            const dateText = formatDate(date);
            
            const relativeDayElement = currentDateElement.querySelector('p');
            const dateElement = currentDateElement.querySelector('h3');
            
            if (relativeDayElement && dateElement) {
                relativeDayElement.textContent = relativeDay;
                dateElement.textContent = dateText;
            }
        }
    }

    // Функция для получения дат текущей недели
    function getWeekDates(date) {
        const currentDate = new Date(date);
        const currentDay = currentDate.getDay();
        const diff = currentDate.getDate() - currentDay + (currentDay === 0 ? -6 : 1);
        const monday = new Date(currentDate.setDate(diff));

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(monday);
            day.setDate(monday.getDate() + i);
            weekDates.push(day);
        }
        return weekDates;
    }

    // Инициализация календаря
    function initCalendar() {
        const baseDate = new Date('2025-04-19');
        const weekDates = getWeekDates(baseDate);
        const days = document.querySelectorAll('.day');

        days.forEach((day, index) => {
            const date = weekDates[index];
            const dayNumber = day.querySelector('.day-number');
            
            if (dayNumber) {
                dayNumber.textContent = date.getDate();
            }

            day.addEventListener('click', () => {
                const clickedDate = new Date(date);
                
                // Обновляем отображение даты в заголовке
                updateCalendarDate(clickedDate);
                
                // Обновляем активный день
                days.forEach(d => d.classList.remove('active'));
                day.classList.add('active');
            });
        });

        // Устанавливаем начальную дату
        updateCalendarDate(baseDate);
    }

    // Инициализация графика
    function initChart() {
        const ctx = document.getElementById('taskChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                datasets: [{
                    label: 'Выполненные задачи',
                    data: [4, 6, 3, 8, 5, 7],
                    borderColor: '#3f51b5',
                    backgroundColor: 'rgba(63, 81, 181, 0.1)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Инициализация всех компонентов
    setInterval(updateClock, 50);
    updateClock();
    initCalendar();
    initChart();

    // Обработка кликов по пунктам меню
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', () => {
            const currentActive = document.querySelector('.menu-item.active');
            if (currentActive) {
                currentActive.classList.remove('active');
            }
            item.classList.add('active');

            // Определяем, какая иконка была нажата
            const icon = item.querySelector('img').getAttribute('alt').toLowerCase();
            
            // Навигация на соответствующую страницу
            switch(icon) {
                case 'home':
                    window.location.href = './index.html';
                    break;
                case 'calendar':
                    window.location.href = './calendar.html';
                    break;
                case 'tasks':
                    window.location.href = './tasks.html';
                    break;
                case 'schedule':
                    window.location.href = './schedule.html';
                    break;
                case 'profile':
                    window.location.href = './profile.html';
                    break;
            }
        });
    });

    // Подсвечиваем активный пункт меню при загрузке страницы
    document.addEventListener('DOMContentLoaded', () => {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const menuItems = document.querySelectorAll('.menu-item');
        
        menuItems.forEach(item => {
            const icon = item.querySelector('img').getAttribute('alt').toLowerCase();
            if (
                ((currentPage === 'index.html' || currentPage === '') && icon === 'home') ||
                (currentPage === 'calendar.html' && icon === 'calendar') ||
                (currentPage === 'tasks.html' && icon === 'tasks') ||
                (currentPage === 'schedule.html' && icon === 'schedule') ||
                (currentPage === 'profile.html' && icon === 'profile')
            ) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // Обработка чекбоксов предметов
    document.querySelectorAll('.subject-item').forEach(item => {
        item.addEventListener('click', () => {
            const checkbox = item.querySelector('.checkbox');
            checkbox.classList.toggle('checked');
        });
    });
});