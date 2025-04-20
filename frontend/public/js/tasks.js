$(document).ready(function() {
    // Данные о задачах
    let tasksData = [{
        id: 1,
        title: 'Домашнее задание',
        subject: 'economics',
        type: 'БДЗ',
        deadline: '2025-04-20T22:00',
        priority: 'high',
        description: 'Подготовить презентацию по теме "Рыночная экономика"',
        status: 'active'
    }];

    async function loadTasks() {
        try {
            const res = await fetch('http://localhost:8080/api/tasks');
            if (!res.ok) throw new Error('Ошибка загрузки задач');

            tasksData = await res.json();

        } catch (error) {
            document.getElementById('task-list').innerHTML = `<p style="color:red;">${error.message}</p>`;
            console.error(error);
        }
    }

    // Состояние сворачивания групп
    let collapsedGroups = {};

    // Инициализация страницы
    initTasksPage();

    // В начало файла, после объявления tasksData
    let nextTaskId = tasksData.length + 1;

    function initTasksPage() {
        // Отображаем задачи
        updateTasksList();

        // Инициализируем обработчики событий
        initEventHandlers();
    }

    function initEventHandlers() {
        // Обработчик клика по фильтрам
        $('.filter-btn').on('click', function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            updateTasksList();
        });

        // Обработчик клика по чекбоксам предметов
        $('.checkbox').on('click', function() {
            $(this).toggleClass('checked');
            updateTasksList();
        });

        // Обработчик клика по заголовку группы
        $(document).on('click', '.subject-header', function() {
            const subject = $(this).data('subject');
            toggleSubjectGroup(subject);
        });

        // Обработчик клика по статусу задачи
        $(document).on('click', '.task-status', function(e) {
            e.stopPropagation();
            const taskId = parseInt($(this).closest('.task-item').data('id'));
            toggleTaskStatus(taskId);
        });

        // Обработчик клика по ссылке "Добавить задачу"
        $(document).on('click', '.add-task-link', function(e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            const $taskForm = createAddTaskForm(subject);
            
            // Удаляем другие открытые формы
            $('.add-task-form').remove();
            
            // Вставляем форму после ссылки
            $(this).after($taskForm);
            $taskForm.find('.task-title-input').focus();
        });
        $(document).on('click', '.add-task-btn', function(e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            const $taskForm = createAddTaskForm(subject);

            // Удаляем другие открытые формы
            $('.add-task-form').remove();

            // Вставляем форму после ссылки
            $(this).after($taskForm);
            $taskForm.find('.task-title-input').focus();
        });

        // Обработчик клика по кнопке отмены в форме
        $(document).on('click', '.btn-cancel', function() {
            $(this).closest('.add-task-form').remove();
        });

        // Обработчик добавления новой задачи
        $(document).on('click', '.btn-add-task', function() {
            const $form = $(this).closest('.add-task-form');
            const subject = $form.data('subject');
            const title = $form.find('.task-title-input').val();
            const description = $form.find('.task-description-input').val();
            
            if (title) {
                const newTask = {
                    id: nextTaskId++,
                    title: title,
                    description: description,
                    subject: subject,
                    type: 'ДЗ',
                    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    priority: 'medium',
                    status: 'active'
                };
                
                tasksData.push(newTask);
                updateTasksList();
                $form.remove();
                showNotification('Задача успешно добавлена');
            }
        });

        // Обработчик клика по заголовку архива
        $('.archive-header').on('click', function() {
            const $archiveTasks = $('.archive-tasks');
            const $toggle = $(this).find('.archive-toggle');
            
            $archiveTasks.slideToggle(200);
            $toggle.toggleClass('collapsed');
        });
        
        // Обработчик клика по кнопке "Срок"
        $(document).on('click', '.task-option[data-type="deadline"]', function() {
            const $form = $(this).closest('.add-task-form');
            
            // Создаем календарь для выбора даты, если его еще нет
            if (!$form.find('.deadline-picker').length) {
                const $picker = $('<div>', {
                    class: 'deadline-picker'
                }).append(
                    $('<input>', {
                        type: 'date',
                        class: 'deadline-date'
                    }),
                    $('<input>', {
                        type: 'time',
                        class: 'deadline-time',
                        value: '23:59'
                    }),
                    $('<div>', {
                        class: 'picker-buttons'
                    }).append(
                        $('<button>', {
                            class: 'btn-cancel-deadline',
                            text: 'Отмена'
                        }),
                        $('<button>', {
                            class: 'btn-set-deadline',
                            text: 'Установить'
                        })
                    )
                );
                
                // Устанавливаем минимальную дату - сегодня
                const today = new Date();
                const dateString = today.toISOString().split('T')[0];
                $picker.find('.deadline-date').val(dateString);
                
                // Добавляем календарь после кнопки
                $(this).after($picker);
            } else {
                // Если календарь уже существует, скрываем/показываем его
                $form.find('.deadline-picker').toggle();
            }
        });
        
        // Отмена выбора срока
        $(document).on('click', '.btn-cancel-deadline', function() {
            $(this).closest('.deadline-picker').remove();
        });
        
        // Установка срока
        $(document).on('click', '.btn-set-deadline', function() {
            const $picker = $(this).closest('.deadline-picker');
            const date = $picker.find('.deadline-date').val();
            const time = $picker.find('.deadline-time').val();
            
            if (date) {
                const $form = $(this).closest('.add-task-form');
                $form.data('deadline', `${date}T${time}`);
                
                // Обновляем визуальное отображение кнопки
                const deadlineDate = new Date(`${date}T${time}`);
                const formattedDate = formatDeadline(deadlineDate);
                
                $form.find('.task-option[data-type="deadline"] span').text(formattedDate);
                $form.find('.task-option[data-type="deadline"]').addClass('selected');
                
                $picker.remove();
            }
        });
        
        // Обработчик клика по кнопке "Тип"
        $(document).on('click', '.task-option[data-type="type"]', function() {
            const $form = $(this).closest('.add-task-form');
            
            // Создаем выпадающий список, если его еще нет
            if (!$form.find('.type-picker').length) {
                const $picker = $('<div>', {
                    class: 'type-picker'
                });
                
                const types = [
                    { value: 'ДЗ', name: 'Домашнее задание' },
                    { value: 'БДЗ', name: 'Большое ДЗ' },
                    { value: 'Л/Р', name: 'Лабораторная работа' },
                    { value: 'К/Р', name: 'Контрольная работа' }
                ];
                
                types.forEach(type => {
                    $picker.append(
                        $('<div>', {
                            class: 'type-item',
                            'data-value': type.value,
                            text: type.name
                        })
                    );
                });
                
                // Добавляем список после кнопки
                $(this).after($picker);
            } else {
                // Если список уже существует, скрываем/показываем его
                $form.find('.type-picker').toggle();
            }
        });
        
        // Выбор типа задачи
        $(document).on('click', '.type-item', function() {
            const $form = $(this).closest('.add-task-form');
            const typeValue = $(this).data('value');
            const typeName = $(this).text();
            
            $form.data('type', typeValue);
            $form.find('.task-option[data-type="type"] span').text(typeValue);
            $form.find('.task-option[data-type="type"]').addClass('selected');
            
            $(this).closest('.type-picker').remove();
        });
        
        // Обработчик клика по кнопке "Приоритет"
        $(document).on('click', '.task-option[data-type="priority"]', function() {
            const $form = $(this).closest('.add-task-form');
            
            // Создаем выпадающий список, если его еще нет
            if (!$form.find('.priority-picker').length) {
                const $picker = $('<div>', {
                    class: 'priority-picker'
                });
                
                const priorities = [
                    { value: 'high', name: 'Высокий', color: '#FF4C4C' },
                    { value: 'medium', name: 'Средний', color: '#FFB800' },
                    { value: 'low', name: 'Низкий', color: '#2196F3' }
                ];
                
                priorities.forEach(priority => {
                    $picker.append(
                        $('<div>', {
                            class: 'priority-item',
                            'data-value': priority.value,
                            'data-color': priority.color
                        }).append(
                            $('<div>', {
                                class: 'priority-color',
                                css: { backgroundColor: priority.color }
                            }),
                            $('<span>', { text: priority.name })
                        )
                    );
                });
                
                // Добавляем список после кнопки
                $(this).after($picker);
            } else {
                // Если список уже существует, скрываем/показываем его
                $form.find('.priority-picker').toggle();
            }
        });
        
        // Выбор приоритета
        $(document).on('click', '.priority-item', function() {
            const $form = $(this).closest('.add-task-form');
            const priorityValue = $(this).data('value');
            const priorityName = $(this).find('span').text();
            const priorityColor = $(this).data('color');
            
            $form.data('priority', priorityValue);
            $form.find('.task-option[data-type="priority"] span').text(priorityName);
            $form.find('.task-option[data-type="priority"]').addClass('selected');
            // Меняем иконку на цветную
            $form.find('.task-option[data-type="priority"] img').attr('src', `img/icons/flag-${priorityValue}.svg`);
            
            $(this).closest('.priority-picker').remove();
        });
        
        // Обработчик клика по заголовку формы - добавляем задачу
        $(document).on('click', '.task-form-header', function() {
            const $form = $(this).closest('.add-task-form');
            const title = $form.find('.task-title-input').val();
            
            if (title) {
                const subject = $form.data('subject');
                const description = $form.find('.task-description-input').val();
                const type = $form.data('type') || 'ДЗ';
                const priority = $form.data('priority') || 'medium';
                
                let deadline = $form.data('deadline');
                if (!deadline) {
                    // Если срок не выбран, устанавливаем на завтра
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(23, 59, 0, 0);
                    deadline = tomorrow.toISOString();
                }
                
                const newTask = {
                    id: nextTaskId++,
                    title: title,
                    description: description,
                    subject: subject,
                    type: type,
                    deadline: deadline,
                    priority: priority,
                    status: 'active'
                };
                
                tasksData.push(newTask);
                updateTasksList();
                $form.remove();
                showNotification('Задача успешно добавлена');
            } else {
                // Если название не заполнено, показываем предупреждение
                showNotification('Введите название задачи', 'error');
            }
        });
    }

    function openAddTaskModal(subject = '') {
        $('#taskSubject').val(subject);
        $('#addTaskModal').addClass('active');
    }

    function addNewTask() {
        const newTask = {
            id: nextTaskId++,
            title: $('#taskTitle').val(),
            subject: $('#taskSubject').val(),
            type: $('#taskType').val(),
            deadline: $('#taskDeadline').val(),
            priority: $('#taskPriority').val(),
            description: $('#taskDescription').val(),
            status: 'active'
        };

        tasksData.push(newTask);
        
        // Обновляем отображение
        updateTasksList();
        
        // Закрываем модальное окно и очищаем форму
        $('#addTaskModal').removeClass('active');
        $('#addTaskForm')[0].reset();
        
        // Показываем уведомление
        showNotification('Задача успешно добавлена');
    }

    function updateTasksList() {
        const activeFilter = $('.filter-btn.active').data('filter');
        const checkedSubjects = $('.checkbox.checked').map(function() {
            return $(this).data('subject');
        }).get();

        // Фильтруем задачи
        const filteredTasks = tasksData.filter(task => {
            if (activeFilter === 'active' && task.status !== 'active') return false;
            if (activeFilter === 'archive' && task.status !== 'archived') return false;
            return checkedSubjects.includes(task.subject);
        });

        // Группируем задачи по предметам
        const tasksBySubject = {};
        filteredTasks.forEach(task => {
            if (!tasksBySubject[task.subject]) {
                tasksBySubject[task.subject] = [];
            }
            tasksBySubject[task.subject].push(task);
        });

        // Очищаем списки
        $('#activeTasks, #archivedTasks').empty();

        // Отображаем сгруппированные задачи
        Object.entries(tasksBySubject).forEach(([subject, tasks]) => {
            const activeTasks = tasks.filter(task => task.status === 'active');
            const archivedTasks = tasks.filter(task => task.status === 'archived');

            if (activeTasks.length > 0 && activeFilter !== 'archive') {
                const subjectGroup = createSubjectGroup(subject, activeTasks);
                $('#activeTasks').append(subjectGroup);
            }

            if (archivedTasks.length > 0 && activeFilter !== 'active') {
                const subjectGroup = createSubjectGroup(subject, archivedTasks);
                $('#archivedTasks').append(subjectGroup);
            }
        });

        // Показываем/скрываем соответствующие списки
        $('.active-tasks').toggle(activeFilter !== 'archive');
        $('.archive-section').toggle(activeFilter !== 'active');

        // Восстанавливаем состояние сворачивания групп
        Object.entries(collapsedGroups).forEach(([subject, isCollapsed]) => {
            if (isCollapsed) {
                $(`.subject-group[data-subject="${subject}"] .subject-tasks`).addClass('collapsed');
                $(`.subject-group[data-subject="${subject}"] .subject-toggle`).addClass('collapsed');
            }
        });
    }

    function createSubjectGroup(subject, tasks) {
        return $('<div>', {
            class: 'subject-group',
            'data-subject': subject
        }).append(
            $('<div>', {
                class: 'subject-header',
                'data-subject': subject
            }).append(
                $('<div>', {
                    class: 'subject-toggle',
                    html: '▼'
                }),
                $('<h3>', {
                    text: getSubjectName(subject)
                })
            ),
            $('<div>', {
                class: 'subject-tasks'
            }).append(
                tasks.map(task => createTaskElement(task)),
                createAddTaskLink(subject)
            )
        );
    }

    function createAddTaskLink(subject) {
        return $('<div>', {
            class: 'add-task-link',
            'data-subject': subject,
            click: function(e) {
                e.preventDefault();
                const $taskForm = createAddTaskForm(subject);
                $('.add-task-form').remove();
                $(this).after($taskForm);
                $taskForm.find('.task-title-input').focus();
            }
        }).append(
            $('<span>', { text: '+' }),
            $('<span>', { text: 'Добавить задачу...' })
        );
    }

    function createAddTaskForm(subject) {
        return $('<div>', {
            class: 'add-task-form',
            'data-subject': subject
        }).append(
            $('<div>', {
                class: 'task-form-content'
            }).append(
                $('<input>', {
                    type: 'text',
                    placeholder: 'Название домашней работы...',
                    class: 'task-title-input'
                }),
                $('<textarea>', {
                    placeholder: 'Описание...',
                    class: 'task-description-input'
                }),
                $('<div>', {
                    class: 'task-options'
                }).append(
                    $('<div>', {
                        class: 'task-option',
                        'data-type': 'deadline'
                    }).append(
                        $('<img>', {
                            src: 'img/icons/iconoir_calendar.svg',
                            alt: 'Срок'
                        }),
                        $('<span>', { text: 'Срок' })
                    ),
                    $('<div>', {
                        class: 'task-option',
                        'data-type': 'type'
                    }).append(
                        $('<img>', {
                            src: 'img/icons/task-type-icon.svg',
                            alt: 'Тип'
                        }),
                        $('<span>', { text: 'Тип' })
                    ),
                    $('<div>', {
                        class: 'task-option',
                        'data-type': 'priority'
                    }).append(
                        $('<img>', {
                            src: 'img/icons/flag-blue.svg',
                            alt: 'Приоритет'
                        }),
                        $('<span>', { text: 'Приоритет' })
                    )
                )
            ),
            $('<div>', {
                class: 'task-form-header'
            }).append(
                $('<img>', {
                    src: 'img/icons/msu-logo.svg',
                    alt: 'МГУ'
                }),
                $('<span>', { text: '/ ' + getSubjectName(subject) + ' ' }),
                $('<span>', {
                    html: '&#9660;',
                    style: 'font-size: 12px'
                })
            )
        );
    }

    function createTaskOption(text, iconSrc) {
        return $('<div>', {
            class: 'task-option'
        }).append(
            $('<img>', {
                src: `img/icons/${iconSrc}`,
                alt: text
            }),
            $('<span>', { text: text })
        );
    }

    function createTaskElement(task) {
        const deadline = new Date(task.deadline);
        
        return $('<div>', {
            class: 'task-item',
            'data-id': task.id
        }).append(
            $('<div>', {
                class: `task-status ${task.status === 'archived' ? 'completed' : ''}`
            }),
            $('<div>', {
                class: 'task-info'
            }).append(
                $('<div>', {
                    class: 'task-title',
                    text: task.title
                }),
                $('<div>', {
                    class: 'task-meta'
                }).append(
                    $('<div>', {
                        class: 'task-type',
                        text: task.type
                    }),
                    $('<div>', {
                        class: 'task-deadline'
                    }).append(
                        $('<img>', {
                            src: 'img/icons/iconoir_calendar.svg',
                            alt: 'Deadline'
                        }),
                        $('<span>', {
                            text: formatDeadline(deadline)
                        })
                    ),
                    $('<div>', {
                        class: `task-priority priority-${task.priority}`
                    }).append(
                        $('<div>', {
                            class: 'priority-flag'
                        }),
                        $('<span>', {
                            text: getPriorityName(task.priority)
                        })
                    )
                )
            )
        );
    }

    function toggleSubjectGroup(subject) {
        const $group = $(`.subject-group[data-subject="${subject}"]`);
        const $tasks = $group.find('.subject-tasks');
        const $toggle = $group.find('.subject-toggle');
        
        $tasks.toggleClass('collapsed');
        $toggle.toggleClass('collapsed');
        
        collapsedGroups[subject] = $tasks.hasClass('collapsed');
    }

    function toggleTaskStatus(taskId) {
        const task = tasksData.find(t => t.id === taskId);
        if (task) {
            task.status = task.status === 'active' ? 'archived' : 'active';
            updateTasksList();
            showNotification(task.status === 'archived' ? 'Задача перемещена в архив' : 'Задача восстановлена');
        }
    }

    function getSubjectName(subject) {
        const subjects = {
            'economics': 'Экономика',
            'physics': 'Физика',
            'math': 'Математика',
            'english': 'Английский язык',
            'discrete-math': 'Дискретная математика'
        };
        return subjects[subject] || subject;
    }

    function getPriorityName(priority) {
        const priorities = {
            'low': 'Низкий',
            'medium': 'Средний',
            'high': 'Высокий'
        };
        return priorities[priority] || priority;
    }

    function formatDeadline(date) {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === now.toDateString()) {
            return `Сегодня`;
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return `Завтра`;
        } else {
            return date.toLocaleString('ru-RU', {
                day: 'numeric',
                month: 'long'
            });
        }
    }

    function showNotification(message, type = 'success') {
        const bgColor = type === 'success' ? '#4CAF50' : '#F44336';
        
        const $notification = $('<div>', {
            class: 'notification',
            text: message
        }).css({
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            background: bgColor,
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
            transform: 'translateY(100px)',
            opacity: '0',
            transition: 'all 0.3s ease'
        });

        $('body').append($notification);

        setTimeout(() => {
            $notification.css({
                transform: 'translateY(0)',
                opacity: '1'
            });
        }, 100);

        setTimeout(() => {
            $notification.css({
                transform: 'translateY(100px)',
                opacity: '0'
            });
            setTimeout(() => {
                $notification.remove();
            }, 300);
        }, 3000);
    }

    function initializeCollapsibleGroups() {
        // Обработчик для групп предметов
        $(document).on('click', '.subject-header', function() {
            const $group = $(this).closest('.subject-group');
            const $arrow = $(this).find('.toggle-arrow');
            const $tasks = $group.find('.subject-tasks');
            
            $tasks.slideToggle(200);
            $arrow.toggleClass('collapsed');
        });

        // Обработчик для архива
        $('.archive-header').on('click', function() {
            const $archive = $(this).closest('.archive-section');
            const $arrow = $(this).find('.archive-toggle');
            const $tasks = $archive.find('.archive-tasks');
            
            $tasks.slideToggle(200);
            $arrow.toggleClass('collapsed');
        });
    }

    function displayTasks() {
        const $activeTasksContainer = $('#activeTasks');
        const $archivedTasksContainer = $('#archivedTasks');
        
        // Очищаем контейнеры
        $activeTasksContainer.empty();
        $archivedTasksContainer.empty();

        // Группируем активные задачи по предметам
        const activeTasksBySubject = {};
        tasksData.filter(task => !task.status === 'archived').forEach(task => {
            if (!activeTasksBySubject[task.subject]) {
                activeTasksBySubject[task.subject] = [];
            }
            activeTasksBySubject[task.subject].push(task);
        });

        // Создаем группы для каждого предмета
        Object.keys(activeTasksBySubject).forEach(subject => {
            const $subjectGroup = $(createSubjectGroup(subject, activeTasksBySubject[subject]));
            const $tasksContainer = $subjectGroup.find('.subject-tasks');
            
            activeTasksBySubject[subject].forEach(task => {
                $tasksContainer.append(createTaskElement(task));
            });
            
            $activeTasksContainer.append($subjectGroup);
        });

        // Добавляем архивные задачи
        tasksData.filter(task => task.status === 'archived').forEach(task => {
            $archivedTasksContainer.append(createTaskElement(task));
        });
    }

    // Инициализация при загрузке страницы
    loadTasks();
    initializeCollapsibleGroups();
    displayTasks();
}); 