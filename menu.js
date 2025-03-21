document.addEventListener('DOMContentLoaded', function() {
  // Получаем элементы из DOM
  const menuLinks = document.querySelectorAll('.sidebar a');
  const sections = document.querySelectorAll('main section');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameDisplay = document.getElementById('username-display');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  // Отображаем имя пользователя, полученное при авторизации
  // В реальном приложении это будет получено из сессии или локального хранилища
  const username = localStorage.getItem('username') || 'Admin';
  usernameDisplay.textContent = username;

  // Обработка переключения между разделами меню
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Удаляем активный класс со всех пунктов меню и разделов
      menuLinks.forEach(item => {
        item.parentElement.classList.remove('active');
      });
      
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Добавляем активный класс выбранному пункту меню
      this.parentElement.classList.add('active');
      
      // Получаем ID раздела и активируем соответствующий раздел
      const sectionId = this.getAttribute('data-section');
      document.getElementById(sectionId).classList.add('active');
      
      // На мобильных устройствах закрываем меню после выбора
      if (window.innerWidth < 768) {
        toggleMobileMenu();
      }
    });
  });

  // Обработка выхода из системы
  logoutBtn.addEventListener('click', function() {
    // В реальном приложении здесь будет очистка сессии или токена
    localStorage.removeItem('username');
    window.location.href = 'index.html';
  });

  // Обработка переключения мобильного меню
  function toggleMobileMenu() {
    sidebar.classList.toggle('active');
    sidebarBackdrop.classList.toggle('active');
    document.body.classList.toggle('menu-open');
  }

  // Обработчик для кнопки мобильного меню
  menuToggle.addEventListener('click', function() {
    toggleMobileMenu();
  });

  // Закрытие меню при клике на затемненную область
  sidebarBackdrop.addEventListener('click', function() {
    toggleMobileMenu();
  });

  // Закрытие меню при изменении размера окна (если перешли с мобильного на десктоп)
  window.addEventListener('resize', function() {
    if (window.innerWidth >= 768 && sidebar.classList.contains('active')) {
      toggleMobileMenu();
    }
  });

  // Пример генерации данных для демонстрации
  function initDemoData() {
    // Здесь можно добавить дополнительную логику для демонстрации функциональности
    console.log('Демо-данные загружены');
  }

  // Инициализация демо-данных
  initDemoData();
}); 