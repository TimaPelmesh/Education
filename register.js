document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('register-form');
  const usernameInput = document.getElementById('username');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const loadingAnimation = document.getElementById('loading-animation');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Получаем значения из полей
    const username = usernameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    // Проверка совпадения паролей
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    // Проверка валидности email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Введите корректный адрес электронной почты');
      return;
    }

    // Проверка минимальной длины пароля
    if (password.length < 6) {
      alert('Пароль должен содержать не менее 6 символов');
      return;
    }

    // Показываем анимацию загрузки
    loadingAnimation.classList.remove('hidden');

    // Симулируем задержку для демонстрации анимации
    setTimeout(() => {
      // В реальном приложении здесь будет отправка данных на сервер
      // Для демо просто имитируем успешную регистрацию
      alert('Регистрация успешно завершена! Теперь вы можете войти в систему.');
      window.location.href = 'index.html';
    }, 1500);
  });
}); 