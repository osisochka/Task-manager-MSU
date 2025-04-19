// Инициализация календаря
$(document).ready(function() {
    console.log('Документ загружен, инициализация календаря...');
    
    // Данные о событиях
    const eventsData = [
        // Математика (зеленый)
        {
            type: 'math',
            title: 'Лекция матан',
            location: 'Аудитория 103', 
            date: '2025-04-14',
            startTime: '9:00',
            endTime: '10:30'
        },
        {
            type: 'math',
            title: 'Практика матан',
            location: 'Аудитория 205',
            date: '2025-04-16',
            startTime: '11:00',
            endTime: '12:30'
        },
        {
            type: 'math',
            title: 'Консультация',
            location: 'Аудитория 103',
            date: '2025-04-18',
            startTime: '15:00',
            endTime: '16:30'
        },
        {
            type: 'math',
            title: 'Контрольная работа',
            location: 'Аудитория 308',
            date: '2025-04-19',
            startTime: '13:00',
            endTime: '14:30'
        },
        {
            type: 'math',
            title: 'Дополнительная практика',
            location: 'Аудитория 205',
            date: '2025-04-15',
            startTime: '16:00',
            endTime: '17:30'
        },
        // Дискретная математика (оранжевый)
        {
            type: 'discrete-math',
            title: 'Лекция Дискретная математика',
            location: 'Аудитория 103',
            date: '2025-04-15',
            startTime: '9:00',
            endTime: '11:00'
        },
        {
            type: 'discrete-math',
            title: 'Практика ДМ',
            location: 'Аудитория 207',
            date: '2025-04-17',
            startTime: '13:30',
            endTime: '15:00'
        },
        {
            type: 'discrete-math',
            title: 'Семинар по графам',
            location: 'Аудитория 301',
            date: '2025-04-19',
            startTime: '9:00',
            endTime: '10:30'
        },
        {
            type: 'discrete-math',
            title: 'Защита лабораторной',
            location: 'Аудитория 207',
            date: '2025-04-16',
            startTime: '14:00',
            endTime: '15:30'
        },
        {
            type: 'discrete-math',
            title: 'Консультация перед экзаменом',
            location: 'Аудитория 103',
            date: '2025-04-20',
            startTime: '11:00',
            endTime: '12:30'
        },
        // Английский язык (фиолетовый)
        {
            type: 'english',
            title: 'Английский язык',
            location: 'Аудитория 103',
            date: '2025-04-16',
            startTime: '14:00',
            endTime: '15:30'
        },
        {
            type: 'english',
            title: 'Разговорная практика',
            location: 'Лингвистический центр',
            date: '2025-04-14',
            startTime: '12:00',
            endTime: '13:30'
        },
        {
            type: 'english',
            title: 'Подготовка к IELTS',
            location: 'Аудитория 402',
            date: '2025-04-17',
            startTime: '16:00',
            endTime: '17:30'
        },
        {
            type: 'english',
            title: 'Технический английский',
            location: 'Аудитория 405',
            date: '2025-04-18',
            startTime: '11:00',
            endTime: '12:30'
        },
        {
            type: 'english',
            title: 'Презентация проекта',
            location: 'Конференц-зал',
            date: '2025-04-20',
            startTime: '14:00',
            endTime: '15:30'
        },
        // Физкультура (желтый)
        {
            type: 'pe',
            title: 'Физкультура',
            location: 'Спортзал',
            date: '2025-04-19',
            startTime: '10:00',
            endTime: '12:00'
        },
        {
            type: 'pe',
            title: 'Волейбол',
            location: 'Спортивный комплекс',
            date: '2025-04-15',
            startTime: '14:00',
            endTime: '15:30'
        },
        {
            type: 'pe',
            title: 'Бассейн',
            location: 'Бассейн МГУ',
            date: '2025-04-17',
            startTime: '9:00',
            endTime: '10:30'
        },
        {
            type: 'pe',
            title: 'Легкая атлетика',
            location: 'Стадион',
            date: '2025-04-14',
            startTime: '16:00',
            endTime: '17:30'
        },
        {
            type: 'pe',
            title: 'Сдача нормативов',
            location: 'Спортивный комплекс',
            date: '2025-04-20',
            startTime: '9:00',
            endTime: '10:30'
        }
    ];
    
    // Переменные для хранения текущего состояния календаря
    let currentDate = new Date('2025-04-19');
    let currentWeekStart = new Date('2025-04-14');
    
    // Инициализация календаря
    initCalendar();
    
    // Функция инициализации календаря
    function initCalendar() {
        console.log('Инициализация календаря...');
        
        try {
            // Инициализация обработчиков событий для чекбоксов предметов
            initSubjectCheckboxes();
            
            // Инициализация текущего времени
            initCurrentTimeIndicator();
            
            // Инициализация навигации по календарю
            initNavigation();
            
            // Инициализация кнопок добавления события
            initEventCreationButtons();
            
            // Прокручиваем к текущему времени
            setTimeout(scrollToCurrentTime, 100);
            
            // Инициализация закрытия модальных окон
            initModalClose();
            
            // Обновляем календарь
            updateCalendar(currentDate);
            
            console.log('Календарь успешно инициализирован');
        } catch (error) {
            console.error('Ошибка при инициализации календаря:', error);
            showNotification('Произошла ошибка при инициализации календаря', 'error');
        }
    }
    
    // Инициализация закрытия модальных окон
    function initModalClose() {
        $('.close-modal, #closeEventDetailsModal, #closeDetails').on('click', function() {
            $(this).closest('.modal-overlay').removeClass('active');
        });
        
        // Закрытие модального окна при клике на оверлей
        $('.modal-overlay').on('click', function(e) {
            if (e.target === this) {
                $(this).removeClass('active');
            }
        });
    }
    
    // Инициализация навигации по календарю
    function initNavigation() {
        // Кнопка "Сегодня"
        $('.date-navigation span').on('click', function() {
            updateCalendar(new Date('2025-04-19'));
        });
        
        // Кнопки навигации по неделям
        $('.nav-arrow.prev').on('click', function() {
            navigateWeek(-1);
        });
        
        $('.nav-arrow.next').on('click', function() {
            navigateWeek(1);
        });
        
        // Кнопки переключения вида
        $('.view-option').on('click', function() {
            $('.view-option.active').removeClass('active');
            $(this).addClass('active');
            // TODO: Добавить переключение вида календаря
        });
    }
    
    // Функция навигации по неделям
    function navigateWeek(direction) {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(currentWeekStart.getDate() + (direction * 7));
        currentWeekStart = newDate;
        updateCalendar(newDate);
    }
    
    // Функция обновления календаря
    function updateCalendar(date) {
        currentDate = date;
        currentWeekStart = getStartOfWeek(date);
        
        // Обновляем заголовок с текущим периодом
        updateCurrentPeriod(currentWeekStart);
        
        // Обновляем заголовки дней
        updateDayHeaders(currentWeekStart);
        
        // Обновляем события
        updateEvents();
        
        // Обновляем индикатор текущего времени
        showCurrentTimeIndicator();
        
        // Прокручиваем к текущему времени
        scrollToCurrentTime();
    }
    
    // Получение начала недели для даты
    function getStartOfWeek(date) {
        const newDate = new Date(date);
        const day = newDate.getDay();
        const diff = newDate.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(newDate.setDate(diff));
    }
    
    // Обновление заголовка с текущим периодом
    function updateCurrentPeriod(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        
        // Форматируем даты
        const formatDate = (date) => {
            return `${date.getDate()} ${date.toLocaleString('ru', { month: 'long' })}`;
        };
        
        $('.current-period').text(`${formatDate(startDate)} - ${formatDate(endDate)}, ${endDate.getFullYear()}`);
    }
    
    // Обновление заголовков дней
    function updateDayHeaders(startDate) {
        const days = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
        
        $('.day-column').each(function(index) {
            // Вычисляем дату для данной колонки
            const columnDate = new Date(startDate);
            columnDate.setDate(startDate.getDate() + index);
            
            // Форматируем дату для data-атрибута
            const dateStr = formatDateToYYYYMMDD(columnDate);
            $(this).attr('data-date', dateStr);
            
            // Обновляем заголовок
            const dayName = days[columnDate.getDay()];
            const dayNumber = columnDate.getDate();
            $(this).find('.day-header').text(`${dayName} ${dayNumber}`);
        });
    }
    
    // Инициализация чекбоксов предметов
    function initSubjectCheckboxes() {
        $('.checkbox').on('click', function() {
            $(this).toggleClass('checked');
            updateEventsVisibility();
        });
    }
    
    // Обновление видимости событий
    function updateEventsVisibility() {
        const checkedSubjects = $('.checkbox.checked').map(function() {
            return $(this).data('subject');
        }).get();
        
        $('.event').each(function() {
            const $event = $(this);
            const eventType = $event.attr('class').split(' ')
                .find(cls => ['math', 'discrete-math', 'english', 'pe'].includes(cls));
            
            if (checkedSubjects.includes(eventType)) {
                $event.show();
            } else {
                $event.hide();
            }
        });
    }
    
    // Обновление событий
    function updateEvents() {
        // Очищаем все существующие события
        $('.event').remove();
        
        // Отфильтровываем события для текущей недели
        const startDateStr = formatDateToYYYYMMDD(currentWeekStart);
        const endDate = new Date(currentWeekStart);
        endDate.setDate(currentWeekStart.getDate() + 6);
        const endDateStr = formatDateToYYYYMMDD(endDate);
        
        const weekEvents = eventsData.filter(event => {
            return event.date >= startDateStr && event.date <= endDateStr;
        });
        
        // Группируем события по дням
        const eventsByDay = {};
        
        weekEvents.forEach(event => {
            if (!eventsByDay[event.date]) {
                eventsByDay[event.date] = [];
            }
            eventsByDay[event.date].push(event);
        });
        
        // Добавляем события на календарь
        for (const [date, events] of Object.entries(eventsByDay)) {
            const $column = $(`.day-column[data-date="${date}"]`);
            
            events.forEach(event => {
                createEventElement(event, $column);
            });
        }
        
        // Обновляем видимость событий на основе выбранных предметов
        updateEventsVisibility();
    }
    
    // Создание элемента события
    function createEventElement(event, $column) {
        // Рассчитываем позицию и высоту события
        const [startHours, startMinutes] = event.startTime.split(':').map(Number);
        const [endHours, endMinutes] = event.endTime.split(':').map(Number);
        
        const startMinutesTotal = startHours * 60 + startMinutes;
        const endMinutesTotal = endHours * 60 + endMinutes;
        const duration = endMinutesTotal - startMinutesTotal;
        
        // Создаем элемент события
        const $event = $('<div>', {
            class: `event ${event.type}`,
            css: {
                top: (startMinutesTotal / 60 * 60) + 'px',
                height: (duration / 60 * 60) + 'px'
            }
        });
        
        // Добавляем содержимое события
        $event.html(`
            <div class="event-time">${event.startTime} - ${event.endTime}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-location">${event.location}</div>
        `);
        
        // Добавляем обработчик клика для открытия деталей
        $event.on('click', function() {
            showEventDetails(event);
        });
        
        // Добавляем событие в колонку
        $column.append($event);
    }
    
    // Отображение деталей события
    function showEventDetails(event) {
        const $modal = $('#eventDetailsModal');
        
        // Заполняем данные события
        $('#detailsTitle').text(event.title);
        $('#detailsSubjectHeader').attr('class', 'event-details-header').addClass(event.type);
        
        // Определяем название предмета
        let subjectName = 'Событие';
        if (event.type === 'math') subjectName = 'Математика';
        else if (event.type === 'discrete-math') subjectName = 'Дискретная математика';
        else if (event.type === 'english') subjectName = 'Английский язык';
        else if (event.type === 'pe') subjectName = 'Физкультура';
        
        $('#detailsSubject').text(subjectName);
        $('#detailsType').text(event.title);
        $('#detailsLocation').text(event.location || 'Не указано');
        
        // Форматируем и отображаем дату
        const dateParts = event.date.split('-');
        const dateObj = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        $('#detailsDate').text(dateObj.toLocaleDateString('ru-RU', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
        }));
        
        $('#detailsTime').text(`${event.startTime} - ${event.endTime}`);
        $('#detailsDescription').text(event.description || 'Описание отсутствует');
        
        // Отображаем модальное окно
        $modal.addClass('active');
    }
    
    // Инициализация индикатора текущего времени
    function initCurrentTimeIndicator() {
        setInterval(showCurrentTimeIndicator, 60000); // Обновляем каждую минуту
        showCurrentTimeIndicator();
    }
    
    // Отображение индикатора текущего времени
    function showCurrentTimeIndicator() {
        // Удаляем старый индикатор
        $('.current-time-indicator').remove();
        
        // Создаем новый индикатор
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const top = (hours * 60 + minutes) / 60 * 60;
        
        const $indicator = $('<div>', {
            class: 'current-time-indicator',
            css: {
                top: `${top}px`,
                width: '100%'
            }
        });
        
        // Добавляем индикатор в сетку календаря
        $('.calendar-grid').append($indicator);
    }
    
    // Прокрутка к текущему времени
    function scrollToCurrentTime() {
        const now = new Date();
        const hours = now.getHours();
        const scrollTop = hours * 60 - 100; // 100px отступ сверху
        
        $('.calendar-grid').scrollTop(Math.max(0, scrollTop));
    }
    
    // Инициализация кнопок создания события
    function initEventCreationButtons() {
        // Кнопка "Create" в левом меню
        $('.create-btn').on('click', function() {
            openAddEventModal();
        });
        
        // Плавающая кнопка "+"
        $('#addEventBtn').on('click', function() {
            openAddEventModal();
        });
        
        // Закрытие модального окна
        $('#closeModal, #cancelBtn').on('click', function() {
            $('#addEventModal').removeClass('active');
        });
        
        // Обработчик отправки формы
        $('#addEventForm').on('submit', function(e) {
            e.preventDefault();
            
            // Собираем данные формы
            const newEvent = {
                type: $('#eventSubject').val(),
                title: $('#eventTitle').val(),
                location: $('#eventLocation').val(),
                date: $('#eventDate').val(),
                startTime: $('#eventStartTime').val(),
                endTime: $('#eventEndTime').val()
            };
            
            // Добавляем событие в массив
            eventsData.push(newEvent);
            
            // Обновляем календарь
            updateCalendar(new Date(newEvent.date));
            
            // Закрываем модальное окно
            $('#addEventModal').removeClass('active');
            
            // Очищаем форму
            $('#addEventForm')[0].reset();
            
            // Показываем уведомление
            showNotification('Событие успешно добавлено');
        });
    }
    
    // Открытие модального окна добавления события
    function openAddEventModal() {
        // Заполняем дату текущим днем
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        $('#eventDate').val(`${year}-${month}-${day}`);
        
        // Отображаем модальное окно
        $('#addEventModal').addClass('active');
    }
    
    // Форматирование даты в строку YYYY-MM-DD
    function formatDateToYYYYMMDD(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
    
    // Показ уведомления
    function showNotification(message, type = 'info') {
        const $notification = $('<div>', {
            class: `notification ${type}`,
            text: message
        });
        
        $('body').append($notification);
        
        // Активируем уведомление
        setTimeout(() => {
            $notification.addClass('active');
        }, 10);
        
        // Удаляем уведомление через 3 секунды
        setTimeout(() => {
            $notification.removeClass('active');
            
            // Удаляем элемент после завершения анимации
            setTimeout(() => {
                $notification.remove();
            }, 300);
        }, 3000);
    }
}); 