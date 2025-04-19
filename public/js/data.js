// База данных пользователей
const users = [
    {
        id: 1,
        name: "Игорь Алексеевич",
        group: "101 группа",
        avatar: "img/прф.png",
        friends: 101,
        experience: 1400,
        gender: "Мужской",
        birthday: "26 июня 1997",
        location: "Москва, Ломоносовский проспект",
        email: "igor.alekseevich@msu.ru",
        phone: "+7 (999) 123-45-67"
    },
    {
        id: 2,
        name: "Игорь Санцув",
        group: "102 группа",
        avatar: "img/игр.png",
        friends: 86,
        experience: 1200,
        gender: "Мужской",
        birthday: "15 марта 1998",
        location: "Москва, Воробьевы горы",
        email: "igor.santsov@msu.ru",
        phone: "+7 (999) 765-43-21"
    },
    {
        id: 3,
        name: "Дмитрий Петрович",
        group: "101 группа",
        avatar: "img/фт1.png",
        friends: 64,
        experience: 950,
        gender: "Мужской",
        birthday: "10 января 1997",
        location: "Москва, проспект Вернадского",
        email: "dmitriy.petrovich@msu.ru",
        phone: "+7 (999) 222-33-44"
    },
    {
        id: 4,
        name: "Иван Петров",
        group: "103 группа",
        avatar: "img/фт1.png", 
        friends: 48,
        experience: 780,
        gender: "Мужской",
        birthday: "5 апреля 1999",
        location: "Москва, улица Строителей",
        email: "ivan.petrov@msu.ru",
        phone: "+7 (999) 444-55-66"
    },
    {
        id: 5,
        name: "Леша Петов",
        group: "102 группа",
        avatar: "img/фт2.png",
        friends: 73,
        experience: 1050,
        gender: "Мужской",
        birthday: "17 июля 1998",
        location: "Москва, Кутузовский проспект",
        email: "lesha.petov@msu.ru",
        phone: "+7 (999) 777-88-99"
    }
];

// База данных друзей
const friends = [
    {
        id: 2,
        userId: 1,
        friendId: 3,
        since: "2022-09-15"
    },
    {
        id: 3,
        userId: 1,
        friendId: 4,
        since: "2022-10-10"
    },
    {
        id: 4,
        userId: 1,
        friendId: 5,
        since: "2022-11-05"
    },
    {
        id: 6,
        userId: 2,
        friendId: 3,
        since: "2022-10-05"
    },
    {
        id: 7,
        userId: 2,
        friendId: 5,
        since: "2022-12-01"
    },
    {
        id: 8,
        userId: 3,
        friendId: 1,
        since: "2022-09-15"
    },
    {
        id: 9,
        userId: 3,
        friendId: 2,
        since: "2022-10-05"
    },
    {
        id: 10,
        userId: 3,
        friendId: 4,
        since: "2023-01-20"
    },
    {
        id: 11,
        userId: 4,
        friendId: 1,
        since: "2022-10-10"
    },
    {
        id: 12,
        userId: 4,
        friendId: 3,
        since: "2023-01-20"
    },
    {
        id: 13,
        userId: 4,
        friendId: 5,
        since: "2022-11-11"
    },
    {
        id: 14,
        userId: 5,
        friendId: 1,
        since: "2022-11-05"
    },
    {
        id: 15,
        userId: 5,
        friendId: 2,
        since: "2022-12-01"
    },
    {
        id: 16,
        userId: 5,
        friendId: 4,
        since: "2022-11-11"
    }
];

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

// Функция получения текущего пользователя
function getCurrentUser() {
    // По умолчанию возвращаем первого пользователя
    return users[0];
}

// Функция получения списка друзей пользователя
function getUserFriends(userId) {
    const userFriendIds = friends
        .filter(f => f.userId === userId)
        .map(f => f.friendId);
    
    return users.filter(user => userFriendIds.includes(user.id));
}

// Инициализация данных пользователя при загрузке
function initUserData() {
    if (isLocalStorageAvailable()) {
        if (!localStorage.getItem('currentUserId')) {
            localStorage.setItem('currentUserId', '1');
        }
    }
}

// Запуск инициализации
initUserData();

// Экспорт данных
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { users, friends, getCurrentUser, getUserFriends };
} 