$(document).ready(async function() {
    // Данные о задачах
    let tasksData = [];
    let nextTaskId = 1;
    let collapsedGroups = {};

    async function loadTasks() {
        try {
            const res = await fetch('http://localhost:8080/api/tasks/user/1');
            console.log('Fetch response status:', res.status, res.statusText);
            if (!res.ok) throw new Error(`Ошибка загрузки задач: ${res.status} ${res.statusText}`);
            const rawTasks = await res.json();
            console.log('Raw tasks from server:', rawTasks);
            const tasksArray = Array.isArray(rawTasks) ? rawTasks : rawTasks.tasks || [];
            if (!Array.isArray(tasksArray)) {
                throw new Error('Данные задач должны быть массивом');
            }
            tasksData = tasksArray.map((task, index) => ({
                id: task.id || index + 1,
                title: task.title || 'Без названия',
                description: task.description || '',
                subject: normalizeSubject(task.subject),
                type: task.typeOfTask || 'ДЗ',
                deadline: task.deadline || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                priority: normalizePriority(task.priority),
                status: task.finished ? 'archived' : 'active',
                userId: task.userId || 1
            }));
            tasksData.forEach(task => {
                if (!task.id || !task.subject || !task.status) {
                    console.warn('Некорректная задача:', task);
                }
            });
            nextTaskId = tasksData.length ? Math.max(...tasksData.map(t => t.id)) + 1 : 1;
            console.log('Задачи загружены:', tasksData);
            return tasksData;
        } catch (error) {
            const taskList = document.getElementById('task-list');
            if (taskList) {
                taskList.innerHTML = `<p style="color:red;">${error.message}</p>`;
            } else {
                console.error('Элемент с ID "task-list" не найден в DOM');
            }
            console.error('Ошибка загрузки задач:', error);
            throw error;
        }
    }

    function normalizePriority(serverPriority) {
        const priorityMap = {
            'HIGH': 'high',
            'MEDIUM': 'medium',
            'LOW': 'low'
        };
        return priorityMap[serverPriority?.toUpperCase()] || 'medium';
    }

    function normalizeSubject(serverSubject) {
        const subjectMap = {
            'Экономика': 'economics',
            'Физика': 'physics',
            'Математика': 'math',
            'Английский язык': 'english',
            'Дискретная математика': 'discrete-math'
        };
        return subjectMap[serverSubject] || serverSubject.toLowerCase().replace(/\s+/g, '-');
    }

    async function saveTaskToAPI(task) {
        try {
            const serverTask = {
                title: task.title,
                description: task.description,
                subject: task.subject,
                typeOfTask: "PRACTICE",
                deadline: task.deadline,
                priority: "HIGH",
                userId: 1
            };
            const res = await fetch('http://localhost:8080/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(serverTask)
            });
            if (!res.ok) throw new Error('Ошибка при добавлении задачи в базу данных');
            const savedTask = await res.json();
            return {
                id: savedTask.id || task.id,
                title: savedTask.title,
                description: savedTask.description,
                subject: normalizeSubject(savedTask.subject),
                type: savedTask.typeOfTask,
                deadline: savedTask.deadline,
                priority: normalizePriority(savedTask.priority),
                status: savedTask.finished ? 'archived' : 'active',
                userId: savedTask.userId
            };
        } catch (error) {
            console.error(error);
            showNotification('Ошибка при сохранении задачи', 'error');
            console.error(error);
            throw error;
        }
    }

    function initTasksPage() {
        initEventHandlers();
    }

    function initEventHandlers() {
        $('.filter-btn').on('click', function() {
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            updateTasksList();
        });
        $('.checkbox').on('click', function() {
            $(this).toggleClass('checked');
            updateTasksList();
        });
        $(document).on('click', '.subject-header', function() {
            const subject = $(this).data('subject');
            toggleSubjectGroup(subject);
        });
        $(document).on('click', '.task-status', function(e) {
            e.stopPropagation();
            const taskId = parseInt($(this).closest('.task-item').data('id'));
            toggleTaskStatus(taskId);
        });
        $(document).on('click', '.add-task-link', function(e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            const $taskForm = createAddTaskForm(subject);
            $('.add-task-form').remove();
            $(this).after($taskForm);
            $taskForm.find('.task-title-input').focus();
        });
        $(document).on('click', '.add-task-btn', function(e) {
            e.preventDefault();
            const subject = $(this).data('subject');
            const $taskForm = createAddTaskForm(subject);
            $('.add-task-form').remove();
            $(this).after($taskForm);
            $taskForm.find('.task-title-input').focus();
        });
        $(document).on('click', '.btn-cancel', function() {
            $(this).closest('.add-task-form').remove();
        });
        $(document).on('click', '.btn-add-task', async function() {
            const $form = $(this).closest('.add-task-form');
            const subject = $form.data('subject');
            const title = $form.find('.task-title-input').val();
            const description = $form.find('.task-description-input').val();
            if (title) {
                const newTask = {
                    title: title,
                    description: description,
                    subject: subject,
                    type: 'ДЗ',
                    deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                    priority: 'medium',
                    status: 'active',
                    userId: 1
                };
                try {
                    const savedTask = await saveTaskToAPI(newTask);
                    newTask.id = savedTask.id || newTask.id;
                    tasksData.push(newTask);
                    updateTasksList();
                    $form.remove();
                    showNotification('Задача успешно добавлена');
                } catch (error) {
                    // Ошибка уже обработана в saveTaskToAPI
                }
            }
        });
        $('.archive-header').on('click', function() {
            const $archiveTasks = $('.archive-tasks');
            const $toggle = $(this).find('.archive-toggle');
            $archiveTasks.slideToggle(200);
            $toggle.toggleClass('collapsed');
        });
        $(document).on('click', '.task-option[data-type="deadline"]', function() {
            const $form = $(this).closest('.add-task-form');
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
                const today = new Date();
                const dateString = today.toISOString().split('T')[0];
                $picker.find('.deadline-date').val(dateString);
                $(this).after($picker);
            } else {
                $form.find('.deadline-picker').toggle();
            }
        });
        $(document).on('click', '.btn-cancel-deadline', function() {
            $(this).closest('.deadline-picker').remove();
        });
        $(document).on('click', '.btn-set-deadline', function() {
            const $picker = $(this).closest('.deadline-picker');
            const date = $picker.find('.deadline-date').val();
            const time = $picker.find('.deadline-time').val();
            if (date) {
                const $form = $(this).closest('.add-task-form');
                $form.data('deadline', `${date}T${time}`);
                const deadlineDate = new Date(`${date}T${time}`);
                const formattedDate = formatDeadline(deadlineDate);
                $form.find('.task-option[data-type="deadline"] span').text(formattedDate);
                $form.find('.task-option[data-type="deadline"]').addClass('selected');
                $picker.remove();
            }
        });
        $(document).on('click', '.task-option[data-type="type"]', function() {
            const $form = $(this).closest('.add-task-form');
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
                $(this).after($picker);
            } else {
                $form.find('.type-picker').toggle();
            }
        });
        $(document).on('click', '.type-item', function() {
            const $form = $(this).closest('.add-task-form');
            const typeValue = $(this).data('value');
            const typeName = $(this).text();
            $form.data('type', typeValue);
            $form.find('.task-option[data-type="type"] span').text(typeValue);
            $form.find('.task-option[data-type="type"]').addClass('selected');
            $(this).closest('.type-picker').remove();
        });
        $(document).on('click', '.task-option[data-type="priority"]', function() {
            const $form = $(this).closest('.add-task-form');
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
                $(this).after($picker);
            } else {
                $form.find('.priority-picker').toggle();
            }
        });
        $(document).on('click', '.priority-item', function() {
            const $form = $(this).closest('.add-task-form');
            const priorityValue = $(this).data('value');
            const priorityName = $(this).find('span').text();
            const priorityColor = $(this).data('color');
            $form.data('priority', priorityValue);
            $form.find('.task-option[data-type="priority"] span').text(priorityName);
            $form.find('.task-option[data-type="priority"]').addClass('selected');
            $form.find('.task-option[data-type="priority"] img').attr('src', `img/icons/flag-${priorityValue}.svg`);
            $(this).closest('.priority-picker').remove();
        });
        $(document).on('click', '.task-form-header', async function() {
            const $form = $(this).closest('.add-task-form');
            const title = $form.find('.task-title-input').val();
            if (title) {
                const subject = $form.data('subject');
                const description = $form.find('.task-description-input').val();
                const type = $form.data('type') || 'ДЗ';
                const priority = $form.data('priority') || 'medium';
                let deadline = $form.data('deadline');
                if (!deadline) {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    tomorrow.setHours(23, 59, 0, 0);
                    deadline = tomorrow.toISOString();
                }
                const newTask = {
                    title: title,
                    description: description,
                    subject: subject,
                    typeOfTask: "PRACTICE",
                    deadline: deadline,
                    priority: "HIGH",
                    userId: 1
                };
                console.log(newTask);

                try {
                    const savedTask = await saveTaskToAPI(newTask);
                    newTask.id = savedTask.id || newTask.id;
                    tasksData.push(newTask);
                    updateTasksList();
                    $form.remove();
                    showNotification('Задача успешно добавлена');
                } catch (error) {
                    // Ошибка уже обработана в saveTaskToAPI
                }
            } else {
                showNotification('Введите название задачи', 'error');
            }
        });
    }

    function openAddTaskModal(subject = '') {
        $('#taskSubject').val(subject);
        $('#addTaskModal').addClass('active');
    }

    async function addNewTask() {
        const newTask = {
            id: nextTaskId++,
            title: $('#taskTitle').val(),
            subject: $('#taskSubject').val(),
            type: $('#taskType').val(),
            deadline: $('#taskDeadline').val(),
            priority: $('#taskPriority').val(),
            description: $('#taskDescription').val(),
            status: 'active',
            userId: 1
        };
        try {
            const savedTask = await saveTaskToAPI(newTask);
            newTask.id = savedTask.id || newTask.id;
            tasksData.push(newTask);
            updateTasksList();
            $('#addTaskModal').removeClass('active');
            $('#addTaskForm')[0].reset();
            showNotification('Задача успешно добавлена');
        } catch (error) {
            // Ошибка уже обработана в saveTaskToAPI
        }
    }

    function updateTasksList() {
        if (!$('.filter-btn.active').length) {
            $('.filter-btn[data-filter="active"]').addClass('active');
        }
        const activeFilter = $('.filter-btn.active').data('filter') || 'active';
        const checkedSubjects = $('.checkbox.checked').map(function() {
            return $(this).data('subject');
        }).get();
        const subjectsToShow = checkedSubjects.length > 0 ? checkedSubjects : Object.keys(getSubjectName());
        const filteredTasks = tasksData.filter(task => {
            if (activeFilter === 'active' && task.status !== 'active') return false;
            if (activeFilter === 'archive' && task.status !== 'archived') return false;
            return subjectsToShow.includes(task.subject);
        });
        const tasksBySubject = {};
        filteredTasks.forEach(task => {
            if (!tasksBySubject[task.subject]) {
                tasksBySubject[task.subject] = [];
            }
            tasksBySubject[task.subject].push(task);
        });
        $('#activeTasks, #archivedTasks').empty();
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
        $('.active-tasks').toggle(activeFilter !== 'archive');
        $('.archive-section').toggle(activeFilter !== 'active');
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
                class: 'task-form-header',
                css: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }
            }).append(
                $('<img>', {
                    src: 'img/icons/msu-logo.svg',
                    alt: 'МГУ'
                }),
                $('<span>', { text: '/ ' + getSubjectName(subject) + ' ' }),
                $('<span>', {
                    html: '▼',
                    style: 'font-size: 12px'
                }),
                $('<div>', {
                    class: 'add-task-label',
                    text: 'Добавить',
                    css: {
                        marginLeft: 'auto',
                        cursor: 'pointer',
                        color: '#fff',
                        fontSize: '14px',
                        fontWeight: '500'
                    },
                    click: function () {
                        console.log('Добавление нового таска');
                    }
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
        $(document).on('click', '.subject-header', function() {
            const $group = $(this).closest('.subject-group');
            const $arrow = $(this).find('.toggle-arrow');
            const $tasks = $group.find('.subject-tasks');
            $tasks.slideToggle(200);
            $arrow.toggleClass('collapsed');
        });
        $('.archive-header').on('click', function() {
            const $archive = $(this).closest('.archive-section');
            const $arrow = $(this).find('.archive-toggle');
            const $tasks = $archive.find('.archive-tasks');
            $tasks.slideToggle(200);
            $arrow.toggleClass('collapsed');
        });
    }

    initializeCollapsibleGroups();
    await loadTasks();
    initTasksPage();
    updateTasksList();
});