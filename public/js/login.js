// JavaScript для страницы входа
$(document).ready(function() {
    let selectedProfileId = null;
    const passwordInput = $('#password');
    const loginBtn = $('#login-btn');
    
    // Обработчик выбора профиля
    $('.profile-card').on('click', function() {
        // Удаляем класс selected у всех карточек
        $('.profile-card').removeClass('selected');
        
        // Добавляем класс selected к выбранной карточке
        $(this).addClass('selected');
        
        // Сохраняем ID выбранного профиля
        selectedProfileId = $(this).data('userid');
        
        // Активируем кнопку входа, если выбран профиль и введен пароль
        updateLoginButton();
        
        // Фокусируемся на поле пароля
        passwordInput.focus();
    });
    
    // Обработчик изменения поля пароля
    passwordInput.on('input', function() {
        updateLoginButton();
    });
    
    // Обработчик нажатия на кнопку входа
    loginBtn.on('click', function() {
        login();
    });
    
    // Обработчик нажатия Enter в поле пароля
    passwordInput.on('keypress', function(e) {
        if (e.which === 13) { // код клавиши Enter
            login();
        }
    });
    
    // Функция входа в систему
    function login() {
        // Если кнопка не активна, ничего не делаем
        if (loginBtn.prop('disabled')) {
            return;
        }
        
        // Получаем введенный пароль
        const password = passwordInput.val();
        
        // В реальном приложении здесь была бы проверка пароля
        // Для демонстрации просто позволяем войти с любым паролем
        
        // Сохраняем ID выбранного пользователя в localStorage
        localStorage.setItem('currentUserId', selectedProfileId);
        
        // Показываем анимацию загрузки
        loginBtn.text('Вход...');
        loginBtn.prop('disabled', true);
        
        // Имитируем задержку для демонстрации
        setTimeout(function() {
            // Перенаправляем на страницу профиля
            window.location.href = 'profile.html';
        }, 800);
    }
    
    // Функция обновления состояния кнопки входа
    function updateLoginButton() {
        // Получаем текущее значение пароля
        const password = passwordInput.val();
        
        // Активируем кнопку только если выбран профиль и введен пароль
        loginBtn.prop('disabled', !selectedProfileId || !password);
    }
}); 