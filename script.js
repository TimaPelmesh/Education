document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('remember-me');
    const loadingAnimation = document.getElementById('loading-animation');
    const forgotPasswordLink = document.getElementById('forgot-password');
  
    // Проверка, есть ли сохраненный логин
    if (localStorage.getItem('rememberedUsername')) {
      usernameInput.value = localStorage.getItem('rememberedUsername');
      rememberMeCheckbox.checked = true;
    }
  
    // Обработка формы входа
    form.addEventListener('submit', function(event) {
      event.preventDefault();
  
      const username = usernameInput.value.trim();
      const password = passwordInput.value;
      const rememberMe = rememberMeCheckbox.checked;
  
      // Сохранение логина, если включена опция "Запомнить меня"
      if (rememberMe) {
        localStorage.setItem('rememberedUsername', username);
      } else {
        localStorage.removeItem('rememberedUsername');
      }
  
      // Показываем анимацию загрузки
      loadingAnimation.classList.remove('hidden');
  
      // Симулируем задержку для демонстрации анимации (например, 1 секунда)
      setTimeout(() => {
        if (username === 'Admin' && password === 'baobab') {
          // Сохраняем имя пользователя для использования в интерфейсе меню
          localStorage.setItem('username', username);
          
          // Если введены правильные данные - переходим на страницу menu.html
          window.location.href = 'menu.html';
        } else {
          alert('Неверный логин или пароль');
          // Скрываем анимацию загрузки, если данные неверны
          loadingAnimation.classList.add('hidden');
        }
      }, 1000);
    });
  
    // Обработка клика по ссылке "Восстановить пароль"
    forgotPasswordLink.addEventListener('click', function(event) {
      event.preventDefault();
      alert('Функция восстановления пароля будет добавлена в ближайшее время.');
    });
  });