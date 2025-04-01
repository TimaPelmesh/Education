document.addEventListener('DOMContentLoaded', function() {
  // Инициализация глобальной темы при загрузке страницы
  initGlobalTheme();
  
  // Получаем элементы из DOM
  const menuLinks = document.querySelectorAll('.sidebar a');
  const sections = document.querySelectorAll('main section');
  const logoutBtn = document.getElementById('logout-btn');
  const usernameDisplay = document.getElementById('username-display');
  const menuToggle = document.getElementById('menu-toggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');
  const dashboard = document.querySelector('.dashboard');

  // Отображаем имя пользователя, полученное при авторизации
  // В реальном приложении это будет получено из сессии или локального хранилища
  const username = localStorage.getItem('username') || 'Admin';
  usernameDisplay.textContent = username;
  
  // Флаг для отслеживания состояния компактной боковой панели
  let isCompactMode = false;

  // Экспортируем функцию переключения вкладок
  window.switchTab = function(sectionId) {
    // Удаляем активный класс со всех пунктов меню и разделов
    menuLinks.forEach(item => {
      item.parentElement.classList.remove('active');
    });
    
    sections.forEach(section => {
      section.classList.remove('active');
    });
    
    // Добавляем активный класс выбранному пункту меню
    const activeLink = document.querySelector(`.sidebar a[data-section="${sectionId}"]`);
    if (activeLink) {
      activeLink.parentElement.classList.add('active');
    }
    
    // Активируем соответствующий раздел
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.add('active');
    }
    
    // Вызываем специальную обработку для раздела "Склад"
    if (sectionId === 'warehouse') {
      console.log("Вызываем activateWarehouseTab из menu.js");
      
      // Активируем компактный режим меню для склада на десктопах
      if (window.innerWidth >= 768) {
        toggleCompactSidebar(true);
      }
      
      // Вызываем инициализацию склада
      if (typeof activateWarehouseTab === 'function') {
        setTimeout(activateWarehouseTab, 100);
      }
    } else {
      // Для других разделов отключаем компактный режим
      if (isCompactMode) {
        toggleCompactSidebar(false);
      }
    }
    
    return true;
  };

  // Функция для переключения компактного режима боковой панели
  function toggleCompactSidebar(enable) {
    if (enable) {
      dashboard.classList.add('compact-sidebar');
      isCompactMode = true;
    } else {
      dashboard.classList.remove('compact-sidebar');
      isCompactMode = false;
    }
  }

  // Обработка переключения между разделами меню
  menuLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Получаем ID раздела и активируем его
      const sectionId = this.getAttribute('data-section');
      window.switchTab(sectionId);
      
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
    
    // При изменении размера окна проверяем, нужно ли использовать компактный режим
    const isWarehouseActive = document.getElementById('warehouse').classList.contains('active');
    if (window.innerWidth >= 768 && isWarehouseActive && !isCompactMode) {
      toggleCompactSidebar(true);
    } else if (window.innerWidth < 768 && isCompactMode) {
      toggleCompactSidebar(false);
    }
  });

  // Добавим стабильность для анимации расширения боковой панели
  sidebar.addEventListener('mouseenter', function() {
    if (isCompactMode) {
        dashboard.classList.add('sidebar-expanded');
        // Добавляем таймаут, чтобы избежать дергания при быстром движении мыши
        clearTimeout(window.sidebarTimer);
    }
  });

  sidebar.addEventListener('mouseleave', function() {
    if (isCompactMode) {
        // Добавляем небольшую задержку перед сворачиванием
        window.sidebarTimer = setTimeout(() => {
            dashboard.classList.remove('sidebar-expanded');
        }, 100);
    }
  });

  // Пример генерации данных для демонстрации
  function initDemoData() {
    // Здесь можно добавить дополнительную логику для демонстрации функциональности
    console.log('Демо-данные загружены');
    
    // Проверяем, активна ли вкладка склада при загрузке
    if (document.getElementById('warehouse').classList.contains('active') && window.innerWidth >= 768) {
      toggleCompactSidebar(true);
    }
  }

  // Инициализация демо-данных
  initDemoData();
  
  // Обработка настроек системы
  function initSettings() {
    const saveSettingsBtn = document.querySelector('.settings-actions .primary-btn');
    const resetSettingsBtn = document.querySelector('.settings-actions .secondary-btn');
    
    if (!saveSettingsBtn || !resetSettingsBtn) return;
    
    // Загрузка сохраненных настроек при открытии страницы
    loadSettings();
    
    // Обработчик изменения темы интерфейса
    const themeSelect = document.getElementById('theme-select');
    if (themeSelect) {
      themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        applyTheme(selectedTheme);
      });
    }
    
    // Обработчик сохранения настроек
    saveSettingsBtn.addEventListener('click', function() {
      saveSettings();
    });
    
    // Обработчик сброса настроек
    resetSettingsBtn.addEventListener('click', function() {
      const currentLang = localStorage.getItem('kudo_language') || 'ru';
      const confirmMessage = localization[currentLang].reset_confirm || 'Вы уверены, что хотите восстановить настройки по умолчанию?';
      const successMessage = localization[currentLang].settings_reset || 'Настройки сброшены до значений по умолчанию';
      
      if (confirm(confirmMessage)) {
        resetSettings();
        showNotification(successMessage);
      }
    });
    
    // Обработчики изменения параметров паллетизации
    const palletWeightInput = document.getElementById('max-pallet-weight');
    const palletHeightInput = document.getElementById('max-pallet-height');
    const layerCountInput = document.getElementById('layer-count');
    
    // Применяем изменения конфигурации паллет при изменении значений
    if (palletWeightInput && palletHeightInput && layerCountInput) {
      [palletWeightInput, palletHeightInput, layerCountInput].forEach(input => {
        input.addEventListener('change', function() {
          updatePalletConfigurations();
        });
      });
    }
    
    // Обработка изменения алгоритма маршрутизации
    const routeAlgorithmSelect = document.getElementById('route-algorithm');
    const operatorsCountInput = document.getElementById('operators-count');
    
    if (routeAlgorithmSelect && operatorsCountInput) {
      routeAlgorithmSelect.addEventListener('change', function() {
        updateRouteAlgorithm(this.value);
      });
      
      operatorsCountInput.addEventListener('change', function() {
        updateOperatorsCount(parseInt(this.value) || 1);
      });
    }
    
    // Обработка изменения параметров визуализации
    const visualizationQualitySelect = document.getElementById('visualization-quality');
    const showLabelsCheckbox = document.getElementById('show-labels');
    const showRouteCheckbox = document.getElementById('show-route');
    const animateRouteCheckbox = document.getElementById('animate-route');
    
    if (visualizationQualitySelect) {
      visualizationQualitySelect.addEventListener('change', function() {
        updateVisualizationQuality(this.value);
      });
    }
    
    // Обновление визуальных настроек при изменении чекбоксов
    if (showLabelsCheckbox && showRouteCheckbox && animateRouteCheckbox) {
      [showLabelsCheckbox, showRouteCheckbox, animateRouteCheckbox].forEach(checkbox => {
        checkbox.addEventListener('change', function() {
          updateVisualizationOptions();
        });
      });
    }
  }
  
  // Функция применения темы интерфейса
  function applyTheme(theme) {
    const body = document.body;
    body.classList.remove('light-theme', 'dark-theme');
    
    // Сохраняем тему отдельно от других настроек для применения на всех страницах
    localStorage.setItem('kudo_theme', theme);
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
    } else if (theme === 'light') {
      body.classList.add('light-theme');
    } else if (theme === 'auto') {
      // Определение системной темы
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        body.classList.add('dark-theme');
      } else {
        body.classList.add('light-theme');
      }
      
      // Слушатель для отслеживания изменений системной темы
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', (e) => {
          if (localStorage.getItem('kudo_theme') === 'auto') {
            body.classList.remove('light-theme', 'dark-theme');
            body.classList.add(e.matches ? 'dark-theme' : 'light-theme');
          }
        });
      }
    }
  }
  
  // Функция сохранения настроек
  function saveSettings() {
    try {
      // Собираем все настройки в объект
      const settings = {
        theme: document.getElementById('theme-select').value,
        language: document.getElementById('lang-select').value,
        pallet: {
          maxWeight: parseInt(document.getElementById('max-pallet-weight').value),
          maxHeight: parseInt(document.getElementById('max-pallet-height').value),
          layerCount: parseInt(document.getElementById('layer-count').value),
          brickPattern: document.getElementById('brick-pattern').checked,
          heavyBottom: document.getElementById('heavy-bottom').checked
        },
        routing: {
          algorithm: document.getElementById('route-algorithm').value,
          operatorsCount: parseInt(document.getElementById('operators-count').value),
          minimizePath: document.getElementById('minimize-path').checked,
          minimizeMoves: document.getElementById('minimize-moves').checked
        },
        visualization: {
          quality: document.getElementById('visualization-quality').value,
          showLabels: document.getElementById('show-labels').checked,
          showRoute: document.getElementById('show-route').checked,
          animateRoute: document.getElementById('animate-route').checked
        },
        export: {
          format: document.getElementById('export-format').value,
          apiEndpoint: document.getElementById('api-endpoint').value,
          autoSync: document.getElementById('auto-sync').checked
        }
      };

      // Сохраняем настройки в localStorage
      localStorage.setItem('kudoWarehouseSettings', JSON.stringify(settings));

      // Применяем некоторые настройки сразу
      applyTheme(settings.theme);
      if (typeof applyLanguage === 'function') {
        applyLanguage(settings.language);
      }

      // Показываем уведомление об успешном сохранении
      const currentLang = localStorage.getItem('kudo_language') || 'ru';
      const successMessage = localization[currentLang].settings_saved;
      showNotification(successMessage, 'success');

    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
      showNotification('Ошибка при сохранении настроек', 'error');
    }
  }
  
  // Функция загрузки настроек из localStorage
  function loadSettings() {
    const savedSettings = localStorage.getItem('kudoWarehouseSettings');
    if (!savedSettings) return;
    
    try {
      const settings = JSON.parse(savedSettings);
      
      // Применяем загруженные настройки
      if (settings.theme) {
        document.getElementById('theme-select').value = settings.theme;
        applyTheme(settings.theme);
      }
      
      if (settings.language) {
        document.getElementById('lang-select').value = settings.language;
      }
      
      // Применяем настройки паллет
      if (settings.pallet) {
        document.getElementById('max-pallet-weight').value = settings.pallet.maxWeight;
        document.getElementById('max-pallet-height').value = settings.pallet.maxHeight;
        document.getElementById('layer-count').value = settings.pallet.layerCount;
        document.getElementById('brick-pattern').checked = settings.pallet.brickPattern;
        document.getElementById('heavy-bottom').checked = settings.pallet.heavyBottom;
      }
      
      // Применяем настройки маршрутизации
      if (settings.routing) {
        document.getElementById('route-algorithm').value = settings.routing.algorithm;
        document.getElementById('operators-count').value = settings.routing.operatorsCount;
        document.getElementById('minimize-path').checked = settings.routing.minimizePath;
        document.getElementById('minimize-moves').checked = settings.routing.minimizeMoves;
      }
      
      // Применяем настройки визуализации
      if (settings.visualization) {
        document.getElementById('visualization-quality').value = settings.visualization.quality;
        document.getElementById('show-labels').checked = settings.visualization.showLabels;
        document.getElementById('show-route').checked = settings.visualization.showRoute;
        document.getElementById('animate-route').checked = settings.visualization.animateRoute;
      }
      
      // Применяем настройки экспорта
      if (settings.export) {
        document.getElementById('export-format').value = settings.export.format;
        document.getElementById('api-endpoint').value = settings.export.apiEndpoint;
        document.getElementById('auto-sync').checked = settings.export.autoSync;
      }
      
    } catch (error) {
      console.error('Ошибка при загрузке настроек:', error);
    }
  }
  
  // Функция сброса настроек на значения по умолчанию
  function resetSettings() {
    // Установка значений по умолчанию
    const defaultSettings = {
      theme: 'light',
      language: 'ru',
      pallet: {
        maxWeight: 1000,
        maxHeight: 180,
        layerCount: 4,
        brickPattern: true,
        heavyBottom: true
      },
      routing: {
        algorithm: 'nearest',
        operatorsCount: 2,
        minimizePath: true,
        minimizeMoves: false
      },
      visualization: {
        quality: 'medium',
        showLabels: true,
        showRoute: true,
        animateRoute: false
      },
      export: {
        format: 'pdf',
        apiEndpoint: 'https://api.kudo.ru/warehouse',
        autoSync: true
      }
    };
    
    // Применяем значения по умолчанию к элементам формы
    document.getElementById('theme-select').value = defaultSettings.theme;
    document.getElementById('lang-select').value = defaultSettings.language;
    
    document.getElementById('max-pallet-weight').value = defaultSettings.pallet.maxWeight;
    document.getElementById('max-pallet-height').value = defaultSettings.pallet.maxHeight;
    document.getElementById('layer-count').value = defaultSettings.pallet.layerCount;
    document.getElementById('brick-pattern').checked = defaultSettings.pallet.brickPattern;
    document.getElementById('heavy-bottom').checked = defaultSettings.pallet.heavyBottom;
    
    document.getElementById('route-algorithm').value = defaultSettings.routing.algorithm;
    document.getElementById('operators-count').value = defaultSettings.routing.operatorsCount;
    document.getElementById('minimize-path').checked = defaultSettings.routing.minimizePath;
    document.getElementById('minimize-moves').checked = defaultSettings.routing.minimizeMoves;
    
    document.getElementById('visualization-quality').value = defaultSettings.visualization.quality;
    document.getElementById('show-labels').checked = defaultSettings.visualization.showLabels;
    document.getElementById('show-route').checked = defaultSettings.visualization.showRoute;
    document.getElementById('animate-route').checked = defaultSettings.visualization.animateRoute;
    
    document.getElementById('export-format').value = defaultSettings.export.format;
    document.getElementById('api-endpoint').value = defaultSettings.export.apiEndpoint;
    document.getElementById('auto-sync').checked = defaultSettings.export.autoSync;
    
    // Применяем тему по умолчанию
    applyTheme(defaultSettings.theme);
    
    // Сохраняем настройки по умолчанию
    localStorage.setItem('kudoWarehouseSettings', JSON.stringify(defaultSettings));
    
    // Если есть функции для применения настроек, вызываем их
    if (typeof updateWarehouseVisualization === 'function') {
      updateWarehouseVisualization(defaultSettings.visualization);
    }
  }
  
  // Функция для отображения уведомления
  function showNotification(message, type = 'success') {
    // Проверяем, существует ли уже контейнер для уведомлений
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
      notificationContainer = document.createElement('div');
      notificationContainer.className = 'notification-container';
      document.body.appendChild(notificationContainer);
    }
    
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Добавляем кнопку закрытия
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', function() {
      notification.remove();
    });
    
    notification.appendChild(closeBtn);
    notificationContainer.appendChild(notification);
    
    // Автоматически скрываем уведомление через 3 секунды
    setTimeout(() => {
      notification.classList.add('fade-out');
      
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
  
  // Функции-заглушки для обновления конфигурации паллет и маршрутизации
  function updatePalletConfigurations() {
    console.log('Обновление конфигурации паллет');
    // Здесь будет логика для обновления параметров паллетизации
  }
  
  function updateRouteAlgorithm(algorithm) {
    console.log('Установлен алгоритм маршрутизации:', algorithm);
    // Здесь будет логика для изменения алгоритма маршрутизации
  }
  
  function updateOperatorsCount(count) {
    console.log('Установлено количество операторов:', count);
    // Здесь будет логика для обновления количества операторов
  }
  
  function updateVisualizationQuality(quality) {
    console.log('Установлено качество визуализации:', quality);
    // Здесь будет логика для обновления качества визуализации
  }
  
  function updateVisualizationOptions() {
    const showLabels = document.getElementById('show-labels').checked;
    const showRoute = document.getElementById('show-route').checked;
    const animateRoute = document.getElementById('animate-route').checked;
    
    console.log('Обновление параметров визуализации:', {
      showLabels,
      showRoute,
      animateRoute
    });
    
    // Здесь будет логика для обновления параметров визуализации
  }
  
  // Инициализация обработчиков настроек
  initSettings();
  
  // Функция инициализации глобальной темы
  function initGlobalTheme() {
    const savedTheme = localStorage.getItem('kudo_theme');
    if (savedTheme) {
      applyTheme(savedTheme);
      
      // Синхронизируем селектор темы с сохраненным значением, если он существует
      const themeSelect = document.getElementById('theme-select');
      if (themeSelect) {
        themeSelect.value = savedTheme;
      }
    }
  }

  // Переключение языка
  const langSelect = document.getElementById('lang-select');
  if (langSelect) {
    langSelect.addEventListener('change', function() {
      const newLang = this.value;
      if (typeof applyLanguage === 'function') {
        applyLanguage(newLang);
      }
    });
  }
  
  // Установка текущего языка в селекторе на основе сохраненного значения
  const savedLang = localStorage.getItem('kudo_language') || 'ru';
  if (langSelect) {
    langSelect.value = savedLang;
  }
  
  // Резервная функция установки языка, если applyLanguage недоступна
  function setLanguageManually(lang) {
    // Если указанный язык не поддерживается, используем русский
    if (!localization[lang]) {
      lang = 'ru';
    }
    
    // Сохраняем выбранный язык
    localStorage.setItem('kudo_language', lang);
    
    // Обновляем отображение элементов с атрибутом data-lang-key
    const translations = localization[lang];
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (translations[key]) {
        element.textContent = translations[key];
      }
    });
    
    // Обновляем плейсхолдеры
    document.querySelectorAll('[data-lang-placeholder]').forEach(element => {
      const key = element.getAttribute('data-lang-placeholder');
      if (translations[key]) {
        element.placeholder = translations[key];
      }
    });
  }
}); 