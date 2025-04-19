$(document).ready(function() {
    // Инициализация прогресс-баров
    function initProgressBars() {
        $('.achievement-item').each(function() {
            const $progress = $(this).find('.progress');
            const [current, total] = $(this).find('.achievement-progress').text().split('/');
            const percentage = (parseInt(current) / parseInt(total)) * 100;
            $progress.css('width', `${percentage}%`);
        });
    }

    // Обработчики для кнопок добавления друзей
    function initFriendButtons() {
        $('.find-friends').on('click', function(e) {
            e.preventDefault();
            // Показываем всех пользователей из базы данных
            showAllUsers();
        });

        $('.invite-friend').on('click', function(e) {
            e.preventDefault();
            showNotification('Приглашение отправлено');
        });

        $('.see-all').on('click', function(e) {
            e.preventDefault();
            showAllFriends();
        });

        // Обработчик для кнопки добавления в друзья
        $('#add-friend-btn').on('click', function() {
            const profileId = $(this).data('userid');
            const currentUserId = parseInt(localStorage.getItem('currentUserId'));
            
            // Добавляем в друзья
            addToFriends(currentUserId, profileId);
            
            // Скрываем кнопку
            $(this).hide();
            
            // Обновляем список друзей
            const profileUser = getUserById(profileId);
            const userFriends = getUserFriends(currentUserId);
            displayFriends(userFriends);
            
            // Показываем уведомление
            showNotification('Пользователь добавлен в друзья');
        });
        
        // Инициализация поиска друзей
        initFriendsSearch();
    }

    // Обработчики для вкладок
    function initTabs() {
        $('.tab-btn').on('click', function() {
            // Убираем активный класс у всех вкладок
            $('.tab-btn').removeClass('active');
            $('.tab-content').removeClass('active');
            
            // Добавляем активный класс к выбранной вкладке
            $(this).addClass('active');
            
            // Показываем соответствующий контент
            const tabId = $(this).data('tab');
            $(`#${tabId}-tab`).addClass('active');
            
            // Инициализируем график если выбрана вкладка с графиком
            if(tabId === 'chart') {
                initActivityChart();
            }
        });
    }

    // Инициализация графика активности
    function initActivityChart() {
        if(!window.activityChartInitialized) {
            const ctx = document.getElementById('activity-chart').getContext('2d');
            
            // Получаем ID пользователя профиля из URL
            const urlParams = new URLSearchParams(window.location.search);
            const profileUserId = parseInt(urlParams.get('id')) || 1;
            
            // ID текущего пользователя
            const currentUserId = parseInt(localStorage.getItem('currentUserId')) || 1;
            
            // Проверяем, свой ли это профиль
            const isOwnProfile = currentUserId === profileUserId;
            
            // Данные для графика
            const labels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            
            // Создаем разные данные для текущего пользователя и для друга
            let primaryUserData, secondaryUserData;
            let primaryUserLabel, secondaryUserLabel;
            
            if (isOwnProfile) {
                // Для собственного профиля показываем задания и учебное время
                primaryUserData = [160, 140, 180, 160, 180, 160];
                secondaryUserData = [120, 160, 140, 170, 150, 140];
                primaryUserLabel = 'Выполненные задания';
                secondaryUserLabel = 'Учебное время';
            } else {
                // Для профиля друга - сравнение активности
                const friend = getUserById(profileUserId);
                primaryUserData = [160, 140, 180, 160, 170, 180];  // Данные для друга (синяя линия)
                secondaryUserData = [140, 170, 150, 170, 140, 150]; // Данные текущего пользователя (фиолетовая линия)
                primaryUserLabel = friend ? friend.name : 'Иван Игоревич';
                secondaryUserLabel = 'Вы';
            }
            
            const chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [
                        {
                            label: primaryUserLabel,
                            data: primaryUserData,
                            fill: true,
                            backgroundColor: 'rgba(37, 99, 235, 0.2)',
                            borderColor: 'rgba(37, 99, 235, 1)',
                            borderWidth: 2,
                            tension: 0.4,
                            pointRadius: 0
                        },
                        {
                            label: secondaryUserLabel,
                            data: secondaryUserData,
                            fill: true,
                            backgroundColor: 'rgba(109, 40, 217, 0.2)',
                            borderColor: 'rgba(109, 40, 217, 1)',
                            borderWidth: 2,
                            tension: 0.4,
                            pointRadius: 0
                        }
                    ]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                stepSize: 80
                            }
                        },
                        x: {
                            grid: {
                                display: false
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: true,
                            position: 'top'
                        }
                    }
                }
            });
            
            // Обновляем легенду
            updateChartLegend(isOwnProfile);
            
            window.activityChartInitialized = true;
        }
    }
    
    // Обновление легенды графика
    function updateChartLegend(isOwnProfile) {
        const chartLegend = document.querySelector('.chart-legend');
        if (!chartLegend) return;
        
        if (isOwnProfile) {
            // Для собственного профиля
            chartLegend.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color tasks"></div>
                    <span>Выполненные задания</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color study"></div>
                    <span>Учебное время</span>
                </div>
            `;
        } else {
            // Для профиля друга
            const urlParams = new URLSearchParams(window.location.search);
            const profileUserId = parseInt(urlParams.get('id')) || 1;
            const friend = getUserById(profileUserId);
            const friendName = friend ? friend.name : 'Иван Игоревич';
            
            chartLegend.innerHTML = `
                <div class="legend-item">
                    <div class="legend-color friend"></div>
                    <span>${friendName}</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color you"></div>
                    <span>Вы</span>
                </div>
            `;
        }
    }

    // Функция добавления в друзья
    function addToFriends(userId, friendId) {
        // Проверяем, что такой дружбы еще нет
        const existingFriendship = friends.find(f => 
            (f.userId === userId && f.friendId === friendId) || 
            (f.userId === friendId && f.friendId === userId)
        );
        
        if(!existingFriendship) {
            // Создаем новую запись о дружбе
            const newFriendship = {
                id: friends.length + 1,
                userId: userId,
                friendId: friendId,
                since: new Date().toISOString().split('T')[0]
            };
            
            // Добавляем в массив друзей
            friends.push(newFriendship);
            
            // Обновляем отображение на странице, если открыт профиль одного из пользователей
            const urlParams = new URLSearchParams(window.location.search);
            const profileUserId = parseInt(urlParams.get('id')) || parseInt(localStorage.getItem('currentUserId')) || 1;
            
            if (profileUserId === userId || profileUserId === friendId) {
                const profileUser = getUserById(profileUserId);
                if (profileUser) {
                    const newFriendsCount = friends.filter(f => 
                        f.userId === profileUserId || f.friendId === profileUserId
                    ).length;
                    document.getElementById('friends-count').textContent = newFriendsCount;
                }
            }
            
            return true;
        }
        
        return false;
    }

    // Получение пользователя по ID
    function getUserById(userId) {
        return users.find(user => user.id === parseInt(userId));
    }

    // Проверка, являются ли пользователи друзьями
    function areFriends(userId1, userId2) {
        return friends.some(f => 
            (f.userId === userId1 && f.friendId === userId2) || 
            (f.userId === userId2 && f.friendId === userId1)
        );
    }

    // Показ уведомления
    function showNotification(message) {
        // Создаем элемент уведомления
        const notification = $('<div class="notification"></div>').text(message);
        
        // Добавляем в DOM
        $('body').append(notification);
        
        // Анимация появления
        setTimeout(() => notification.addClass('show'), 10);
        
        // Автоматическое скрытие через 3 секунды
        setTimeout(() => {
            notification.removeClass('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Инициализация всех компонентов
    function init() {
        initProgressBars();
        initFriendButtons();
        initTabs();
    }

    // Запуск инициализации
    init();
});

// Подключаем данные
document.addEventListener('DOMContentLoaded', function() {
    // Получаем ID текущего пользователя из localStorage
    const currentUserId = parseInt(localStorage.getItem('currentUserId')) || 1;
    
    // Получаем ID пользователя профиля из URL или используем текущего
    const urlParams = new URLSearchParams(window.location.search);
    const profileUserId = parseInt(urlParams.get('id')) || currentUserId;
    
    // Проверяем, свой ли это профиль
    const isOwnProfile = currentUserId === profileUserId;
    
    // Находим пользователя по ID
    const profileUser = users.find(user => user.id === profileUserId) || users[0];
    
    // Отображаем профиль пользователя
    displayUserProfile(profileUser);
    
    // Устанавливаем ID пользователя для кнопки добавления в друзья
    $('#add-friend-btn').data('userid', profileUserId);
    
    // Проверяем, являются ли пользователи друзьями
    const isFriend = friends.some(f => 
        (f.userId === currentUserId && f.friendId === profileUserId) || 
        (f.userId === profileUserId && f.friendId === currentUserId)
    );
    
    // Отображаем или скрываем кнопку добавления в друзья
    if (isOwnProfile || isFriend) {
        $('#add-friend-btn').hide();
    } else {
        $('#add-friend-btn').show();
    }
    
    // Загружаем друзей пользователя
    const userFriends = getUserFriends(profileUserId);
    displayFriends(userFriends);
    
    // Управляем видимостью вкладок
    const chartTab = document.querySelector('.tab-btn[data-tab="chart"]');
    const achievementsTab = document.querySelector('.tab-btn[data-tab="achievements"]');
    const achievementsContent = document.querySelector('#achievements-tab');
    const aboutTab = document.querySelector('.tab-btn[data-tab="about"]');
    const aboutContent = document.querySelector('#about-tab');
    
    if (isOwnProfile) {
        // Если это МОЙ профиль (я залогинен как Игорь), скрываем График
        if (chartTab) {
            chartTab.style.display = 'none';
        }
        
        // Делаем активной вкладку Достижения
        if (achievementsTab && achievementsContent) {
            $('.tab-btn').removeClass('active');
            $('.tab-content').removeClass('active');
            achievementsTab.classList.add('active');
            achievementsContent.classList.add('active');
        }
    } else {
        // Если я зашел на профиль Игоря с другого аккаунта, показываем График
        if (chartTab) {
            chartTab.style.display = '';
        }
    }
    
    // Обработчик для кнопки выхода
    document.querySelector('.logout-btn').addEventListener('click', function(e) {
        e.preventDefault();
        
        // Очищаем данные пользователя из localStorage
        localStorage.removeItem('currentUserId');
        
        // Перенаправляем на страницу входа
        window.location.href = 'login.html';
    });
});

// Функция отображения профиля пользователя
function displayUserProfile(user) {
    document.getElementById('profile-avatar').src = user.avatar;
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-group').textContent = user.group;
    
    // Подсчитываем реальное количество друзей пользователя из массива friends
    const friendsCount = friends.filter(f => f.userId === user.id || f.friendId === user.id).length;
    document.getElementById('friends-count').textContent = friendsCount;
    
    document.getElementById('exp-count').textContent = user.experience;
    
    // Обновляем информацию в секции About
    const aboutInfo = document.querySelector('.about-info');
    if (aboutInfo) {
        const infoItems = aboutInfo.querySelectorAll('.info-item');
        infoItems[0].querySelector('span').textContent = user.gender;
        infoItems[1].querySelector('span').textContent = `Родился ${user.birthday}`;
        infoItems[2].querySelector('span').textContent = user.location;
        infoItems[3].querySelector('span').textContent = user.email;
        infoItems[4].querySelector('span').textContent = user.phone;
    }
    
    // Устанавливаем заголовок страницы
    document.title = `${user.name} | Профиль`;
}

// Функция отображения друзей пользователя
function displayFriends(friends) {
    const friendsList = document.querySelector('.friends-list');
    if (!friendsList) return;
    
    // Очищаем список друзей
    friendsList.innerHTML = '';
    
    // Если нет друзей, показываем сообщение
    if (friends.length === 0) {
        friendsList.innerHTML = '<div class="no-friends">У пользователя пока нет друзей</div>';
        return;
    }
    
    // Ограничиваем количество отображаемых друзей
    const displayFriends = friends.slice(0, 3);
    
    // Добавляем друзей в список
    displayFriends.forEach(friend => {
        // Проверяем, существует ли аватар, иначе используем заглушку
        let avatarUrl = friend.avatar;
        if (!avatarUrl || avatarUrl === 'undefined') {
            avatarUrl = 'img/default-avatar.png';
        }
        
        const friendItem = document.createElement('div');
        friendItem.className = 'friend-item';
        friendItem.innerHTML = `
            <img src="${avatarUrl}" alt="${friend.name}" onerror="this.src='img/default-avatar.png'">
            <div class="friend-info">
                <span class="friend-name">${friend.name}</span>
                <span class="friend-group">${friend.group}</span>
            </div>
        `;
        
        // Добавляем обработчик клика для перехода на профиль друга
        friendItem.addEventListener('click', function() {
            window.location.href = `profile.html?id=${friend.id}`;
        });
        
        friendsList.appendChild(friendItem);
    });
}

// Функция инициализации поиска друзей
function initFriendsSearch() {
    const searchInput = $('#friends-search-input');
    const searchButton = $('#friends-search-btn');
    const searchResults = $('.search-results');
    
    // Обработчик нажатия на кнопку поиска
    searchButton.on('click', function() {
        const query = searchInput.val().trim();
        if (query.length > 0) {
            performSearch(query);
        }
    });
    
    // Обработчик ввода в поле поиска
    searchInput.on('input', function() {
        const query = $(this).val().trim();
        if (query.length > 2) {
            performSearch(query);
        } else if (query.length === 0) {
            searchResults.removeClass('active').empty();
        }
    });
    
    // Обработчик нажатия Enter в поле поиска
    searchInput.on('keypress', function(e) {
        if (e.which === 13) {
            const query = $(this).val().trim();
            if (query.length > 0) {
                performSearch(query);
            }
        }
    });
    
    // Делегирование события для кнопок добавления в друзья
    searchResults.on('click', '.add-friend-btn-small', function(e) {
        e.stopPropagation();
        
        const currentUserId = parseInt(localStorage.getItem('currentUserId'));
        const friendId = parseInt($(this).data('userid'));
        
        // Добавляем в друзья
        if (addToFriends(currentUserId, friendId)) {
            // Меняем текст и стиль кнопки
            $(this).text('Добавлен').addClass('added');
            
            // Обновляем список друзей
            const userFriends = getUserFriends(currentUserId);
            displayFriends(userFriends);
            
            // Показываем уведомление
            showNotification('Пользователь добавлен в друзья');
        }
    });
    
    // Делегирование события для клика на результат поиска
    searchResults.on('click', '.search-result-item', function() {
        const userId = $(this).data('userid');
        window.location.href = `profile.html?id=${userId}`;
    });
}

// Функция выполнения поиска друзей
function performSearch(query) {
    const currentUserId = parseInt(localStorage.getItem('currentUserId'));
    const searchResults = $('.search-results');
    
    // Очищаем результаты
    searchResults.empty();
    
    // Показываем блок результатов
    searchResults.addClass('active');
    
    // Фильтруем пользователей по запросу
    const filteredUsers = users.filter(user => {
        // Исключаем текущего пользователя
        if (user.id === currentUserId) return false;
        
        // Проверяем, содержит ли имя или группа запрос (без учета регистра)
        return user.name.toLowerCase().includes(query.toLowerCase()) || 
               user.group.toLowerCase().includes(query.toLowerCase());
    });
    
    // Если ничего не найдено
    if (filteredUsers.length === 0) {
        searchResults.html('<div class="no-results">Ничего не найдено</div>');
        return;
    }
    
    // Отображаем результаты
    filteredUsers.forEach(user => {
        // Проверяем, является ли пользователь уже другом
        const isFriend = areFriends(currentUserId, user.id);
        
        // Проверяем, существует ли аватар, иначе используем заглушку
        let avatarUrl = user.avatar;
        if (!avatarUrl || avatarUrl === 'undefined') {
            avatarUrl = 'img/default-avatar.png';
        }
        
        // Создаем элемент результата
        const resultItem = $(`
            <div class="search-result-item" data-userid="${user.id}">
                <img src="${avatarUrl}" alt="${user.name}" onerror="this.src='img/default-avatar.png'">
                <div class="search-result-info">
                    <div class="search-result-name">${user.name}</div>
                    <div class="search-result-group">${user.group}</div>
                </div>
                <div class="search-result-action">
                    ${isFriend ? 
                        '<button class="add-friend-btn-small added" disabled>Друзья</button>' : 
                        `<button class="add-friend-btn-small" data-userid="${user.id}">Добавить</button>`
                    }
                </div>
            </div>
        `);
        
        // Добавляем в список результатов
        searchResults.append(resultItem);
    });
}

// Функция отображения всех друзей
function showAllFriends() {
    // Получаем ID текущего пользователя
    let currentUserId = 1;
    try {
        if (isLocalStorageAvailable()) {
            currentUserId = parseInt(localStorage.getItem('currentUserId') || '1');
        }
    } catch (e) {
        console.error('Ошибка при получении ID пользователя:', e);
    }
    
    // ID пользователя профиля из URL
    let profileUserId = currentUserId;
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const urlId = urlParams.get('id');
        if (urlId && !isNaN(parseInt(urlId))) {
            profileUserId = parseInt(urlId);
        }
    } catch (e) {
        console.error('Ошибка при получении ID из URL:', e);
    }
    
    // Получаем друзей пользователя
    const userFriends = getUserFriends(profileUserId);
    
    if (userFriends.length === 0) {
        showNotification('У пользователя нет друзей');
        return;
    }
    
    // Создаем модальное окно для отображения всех друзей
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Все друзья (${userFriends.length})</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="friends-list-full">
                        ${userFriends.map(friend => {
                            // Проверяем, существует ли аватар, иначе используем заглушку
                            let avatarUrl = friend.avatar || 'img/default-avatar.png';
                            
                            return `
                                <div class="friend-item-large" data-userid="${friend.id}">
                                    <img src="${avatarUrl}" alt="${friend.name}" onerror="this.src='img/default-avatar.png'">
                                    <div class="friend-info">
                                        <span class="friend-name">${friend.name}</span>
                                        <span class="friend-group">${friend.group}</span>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    const modalElement = $(modalHtml);
    $('body').append(modalElement);
    
    // Предотвращаем прокрутку страницы
    $('body').addClass('modal-open');
    
    // Обработчик закрытия модального окна
    $('.modal-close, .modal-overlay').on('click', function(e) {
        if (e.target === this) {
            closeAllFriendsModal();
        }
    });
    
    // Делегирование события для клика на друга
    $('.friends-list-full').on('click', '.friend-item-large', function() {
        const userId = $(this).data('userid');
        window.location.href = `profile.html?id=${userId}`;
    });
    
    // Обработчик клавиши Escape
    $(document).on('keydown.modal', function(e) {
        if (e.key === 'Escape') {
            closeAllFriendsModal();
        }
    });
}

// Функция проверки доступности localStorage
function isLocalStorageAvailable() {
    try {
        const testKey = '__test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
}

// Функция закрытия модального окна со всеми друзьями
function closeAllFriendsModal() {
    $('.modal-overlay').remove();
    $('body').removeClass('modal-open');
    $(document).off('keydown.modal');
}

// Обработчик для показа модального окна с QR-кодом
$('#show-invite-qr').on('click', function(e) {
    e.preventDefault();
    showInviteModal();
});

// Закрытие модального окна
$('.modal-close').on('click', function() {
    $('.modal-overlay').hide();
    $('body').removeClass('modal-open');
});

// Копирование ссылки приглашения
$('#copy-link-btn').on('click', function() {
    copyInviteLink();
});

// Генерация QR-кода при открытии модального окна
function showInviteModal() {
    // Получаем текущий URL профиля
    const profileUrl = window.location.href;
    
    // Устанавливаем ссылку в поле ввода
    $('#invite-link').val(profileUrl);
    
    // Показываем модальное окно (перед генерацией QR-кода)
    $('#invite-modal').show();
    $('body').addClass('modal-open');
    
    // Очищаем контейнер QR-кода
    $('#qrcode').empty();
    
    // Небольшая задержка перед генерацией QR-кода, чтобы DOM успел обновиться
    setTimeout(() => {
        try {
            // Создаем новый QR-код
            new QRCode(document.getElementById("qrcode"), {
                text: profileUrl,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H // высокий уровень коррекции ошибок
            });
        } catch (error) {
            console.error("Ошибка при генерации QR-кода:", error);
            // Добавляем сообщение об ошибке вместо QR-кода
            $('#qrcode').html('<p style="color: red;">Ошибка генерации QR-кода</p>');
        }
    }, 100);
}

// Функция копирования ссылки приглашения
function copyInviteLink() {
    const inviteLink = document.getElementById('invite-link');
    inviteLink.select();
    document.execCommand('copy');
    
    // Показываем уведомление о копировании
    showNotification('Ссылка скопирована!');
}

// Функция для отображения всех пользователей из базы данных
function showAllUsers() {
    // Получаем ID текущего пользователя
    const currentUserId = parseInt(localStorage.getItem('currentUserId')) || 1;
    
    // Получаем все дружеские связи текущего пользователя
    const userFriendships = friends.filter(f => 
        f.userId === currentUserId || f.friendId === currentUserId
    );
    
    // Получаем ID всех друзей
    const friendIds = userFriendships.map(f => 
        f.userId === currentUserId ? f.friendId : f.userId
    );
    
    // Фильтруем пользователей, исключая текущего
    const otherUsers = users.filter(user => user.id !== currentUserId);
    
    if (otherUsers.length === 0) {
        showNotification('Нет других пользователей в системе');
        return;
    }
    
    // Создаем модальное окно для отображения всех пользователей
    const modalHtml = `
        <div class="modal-overlay">
            <div class="modal-container">
                <div class="modal-header">
                    <h3>Все пользователи (${otherUsers.length})</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-content">
                    <div class="all-users-list">
                        ${otherUsers.map(user => {
                            // Проверяем, является ли пользователь другом
                            const isFriend = friendIds.includes(user.id);
                            
                            // Проверяем, существует ли аватар
                            let avatarUrl = user.avatar || 'img/default-avatar.png';
                            
                            // Определяем класс для кнопки
                            const buttonClass = isFriend ? 'add-friend-btn-small added' : 'add-friend-btn-small';
                            const buttonText = isFriend ? 'Друзья' : 'Добавить';
                            const isDisabled = isFriend ? 'disabled' : '';
                            
                            return `
                                <div class="search-result-item" data-userid="${user.id}">
                                    <img src="${avatarUrl}" alt="${user.name}" onerror="this.src='img/default-avatar.png'">
                                    <div class="search-result-info">
                                        <div class="search-result-name">${user.name}</div>
                                        <div class="search-result-group">${user.group}</div>
                                    </div>
                                    <div class="search-result-action">
                                        <button class="${buttonClass}" data-userid="${user.id}" ${isDisabled}>${buttonText}</button>
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавляем модальное окно в DOM
    const modalElement = $(modalHtml);
    $('body').append(modalElement);
    
    // Предотвращаем прокрутку страницы
    $('body').addClass('modal-open');
    
    // Обработчик закрытия модального окна
    $('.modal-close, .modal-overlay').on('click', function(e) {
        if (e.target === this) {
            closeAllUsersModal();
        }
    });
    
    // Обработчик для кнопок добавления в друзья
    $('.all-users-list').on('click', '.add-friend-btn-small:not(.added)', function(e) {
        e.stopPropagation();
        
        const friendId = parseInt($(this).data('userid'));
        
        // Добавляем в друзья
        if (addToFriends(currentUserId, friendId)) {
            // Меняем текст и стиль кнопки
            $(this).text('Друзья').addClass('added').attr('disabled', true);
            
            // Обновляем список друзей на странице
            const userFriends = getUserFriends(currentUserId);
            displayFriends(userFriends);
            
            // Показываем уведомление
            showNotification('Пользователь добавлен в друзья');
        }
    });
    
    // Делегирование события для клика на пользователя
    $('.all-users-list').on('click', '.search-result-item', function(e) {
        if (!$(e.target).hasClass('add-friend-btn-small')) {
            const userId = $(this).data('userid');
            window.location.href = `profile.html?id=${userId}`;
        }
    });
    
    // Обработчик клавиши Escape
    $(document).on('keydown.modal', function(e) {
        if (e.key === 'Escape') {
            closeAllUsersModal();
        }
    });
}

// Функция закрытия модального окна со всеми пользователями
function closeAllUsersModal() {
    $('.modal-overlay').remove();
    $('body').removeClass('modal-open');
    $(document).off('keydown.modal');
} 