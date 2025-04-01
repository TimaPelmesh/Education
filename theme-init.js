/**
 * Инициализация темы для всех страниц KUDO®
 * Этот скрипт должен быть подключен перед основными скриптами страницы
 */

(function() {
  // Загружаем сохраненную тему при загрузке страницы
  document.addEventListener('DOMContentLoaded', initTheme);
  
  // Применяем тему немедленно, до полной загрузки DOM
  // для предотвращения мигания страницы
  initTheme();

  /**
   * Инициализация темы сайта
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('kudo_theme');
    
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      // Если тема не сохранена, используем системную тему
      checkSystemTheme();
    }
    
    // Добавляем переключатель темы, если его нет (для страницы входа)
    addThemeToggle();
  }

  /**
   * Применение темы
   * @param {string} theme - Название темы ('light', 'dark', 'auto')
   */
  function applyTheme(theme) {
    const body = document.body;
    
    // Удаляем существующие классы тем
    body.classList.remove('light-theme', 'dark-theme');
    
    // Сохраняем выбранную тему
    localStorage.setItem('kudo_theme', theme);
    
    // Применяем соответствующую тему
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      updateMetaThemeColor('#111827'); // Темный цвет для статус-бара
    } else if (theme === 'light') {
      body.classList.add('light-theme');
      updateMetaThemeColor('#FFFFFF'); // Белый цвет для статус-бара
    } else if (theme === 'auto') {
      // Определяем системную тему
      checkSystemTheme();
      
      // Добавляем слушатель для изменения системной темы
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Используем addEventListener с проверкой поддержки
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', checkSystemTheme);
        } else {
          // Fallback для старых браузеров
          mediaQuery.addListener(checkSystemTheme);
        }
      }
    }
  }

  /**
   * Проверка и применение системной темы
   */
  function checkSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Системная тема - темная
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      updateMetaThemeColor('#111827');
    } else {
      // Системная тема - светлая или не определена
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      updateMetaThemeColor('#FFFFFF');
    }
  }

  /**
   * Обновление цвета в meta theme-color для статус-бара браузера
   * @param {string} color - Цвет в формате HEX
   */
  function updateMetaThemeColor(color) {
    let metaThemeColor = document.querySelector('meta[name="theme-color"]');
    
    if (!metaThemeColor) {
      metaThemeColor = document.createElement('meta');
      metaThemeColor.name = 'theme-color';
      document.head.appendChild(metaThemeColor);
    }
    
    metaThemeColor.content = color;
  }

  /**
   * Добавление переключателя темы на страницу входа
   */
  function addThemeToggle() {
    // Проверяем, находимся ли мы на странице входа
    if (document.querySelector('.auth-container') && !document.querySelector('.theme-toggle')) {
      const themeToggle = document.createElement('button');
      themeToggle.className = 'theme-toggle';
      
      // Определяем текущую тему
      const currentTheme = localStorage.getItem('kudo_theme') || 'light';
      
      // Устанавливаем иконку в зависимости от темы
      if (currentTheme === 'dark' || 
          (currentTheme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        themeToggle.innerHTML = '☀️'; // Солнце для темной темы
      } else {
        themeToggle.innerHTML = '🌙'; // Луна для светлой темы
      }
      
      // Добавляем обработчик клика
      themeToggle.addEventListener('click', function() {
        const currentTheme = localStorage.getItem('kudo_theme') || 'light';
        
        if (currentTheme === 'dark' || 
            (currentTheme === 'auto' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          applyTheme('light');
          this.innerHTML = '🌙';
        } else {
          applyTheme('dark');
          this.innerHTML = '☀️';
        }
      });
      
      // Добавляем переключатель в документ
      document.body.appendChild(themeToggle);
    }
  }
})(); 