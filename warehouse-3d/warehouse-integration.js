// Файл для интеграции 3D-визуализации склада в основное меню

// Глобальная переменная для рендерера CSS2D меток
let labelRenderer;

// Глобальная функция для активации вкладки "Склад"
window.activateWarehouseTab = null;

document.addEventListener('DOMContentLoaded', function() {
    // Флаг, указывающий, что 3D-визуализация уже инициализирована
    let warehouseInitialized = false;
    
    // Получаем ссылку на пункт меню "Склад"
    const warehouseMenuItem = document.querySelector('nav.sidebar a[data-section="warehouse"]');
    if (!warehouseMenuItem) {
        console.error("Элемент меню 'Склад' не найден");
        return;
    }
    
    // Проверяем, активен ли раздел "Склад" изначально
    const warehouseSection = document.getElementById('warehouse');
    if (!warehouseSection) {
        console.error("Раздел 'Склад' не найден");
        return;
    }
    
    // Функция для переключения на раздел "Склад"
    function activateWarehouseTab() {
        console.log("Активируем вкладку 'Склад'");
        if (!warehouseInitialized) {
            // Устанавливаем небольшую задержку, чтобы дождаться полной отрисовки раздела
            setTimeout(() => {
                // Проверяем, что раздел склада активен и DOM-элементы доступны
                const warehouseView = document.getElementById('warehouse-view');
                if (document.getElementById('warehouse').classList.contains('active') && warehouseView) {
                    console.log("Инициализируем 3D-визуализацию");
                    
                    try {
                        // Инициализируем CSS2D рендерер для меток
                        initCSS2DRenderer();
                        // Вызываем инициализацию 3D-визуализации
                        init();
                        warehouseInitialized = true;
                        console.log('3D-визуализация склада инициализирована по клику');
                    } catch (e) {
                        console.error("Ошибка при инициализации 3D-визуализации:", e);
                    }
                } else {
                    console.error("Не удалось инициализировать визуализацию: ", {
                        warehouseActive: warehouseSection?.classList.contains('active'),
                        warehouseViewExists: !!warehouseView
                    });
                }
            }, 500);
        } else {
            // Если визуализация уже инициализирована, просто корректируем размер
            setTimeout(() => {
                if (typeof onWindowResize === 'function') {
                    onWindowResize();
                    console.log("Размер 3D-визуализации обновлен");
                }
            }, 300);
        }
    }
    
    // Экспортируем функцию активации для доступа из menu.js
    window.activateWarehouseTab = activateWarehouseTab;
    
    if (warehouseSection.classList.contains('active')) {
        // Если раздел активен при загрузке страницы, инициализируем визуализацию
        console.log("Раздел 'Склад' активен при загрузке, инициализируем");
        setTimeout(() => {
            if (!warehouseInitialized && document.getElementById('warehouse-view')) {
                // Инициализируем CSS2D рендерер для меток
                initCSS2DRenderer();
                // Инициализируем 3D-визуализацию
                init();
                warehouseInitialized = true;
                console.log('3D-визуализация склада инициализирована при загрузке');
            } else {
                console.error("Не удалось инициализировать визуализацию: ", {
                    warehouseInitialized,
                    warehouseViewExists: !!document.getElementById('warehouse-view')
                });
            }
        }, 1000);
    }
    
    // Обработчик клика на пункт меню "Склад"
    warehouseMenuItem.addEventListener('click', function(e) {
        console.log("Клик по пункту меню 'Склад'");
        
        // Активируем визуализацию
        activateWarehouseTab();
    });
    
    // Обработчик изменения размера окна
    window.addEventListener('resize', function() {
        if (warehouseInitialized && 
            document.getElementById('warehouse').classList.contains('active')) {
            if (typeof onWindowResize === 'function') {
                onWindowResize();
                // Обновляем размер CSS2D рендерера
                if (labelRenderer) {
                    labelRenderer.setSize(window.innerWidth, window.innerHeight);
                }
            }
        }
    });
    
    // Для меню, которое уже реализовано в menu.js, добавляем обработчик
    // Если в menu.js есть переключение вкладок, нужно добавить активацию визуализации при переходе на склад
    document.querySelectorAll('a[data-section="warehouse"]').forEach(link => {
        link.addEventListener('click', function() {
            // Убедимся, что вкладка активирована и визуализация инициализирована
            setTimeout(() => {
                if (document.getElementById('warehouse').classList.contains('active')) {
                    activateWarehouseTab();
                }
            }, 100);
        });
    });
});

// Функция инициализации CSS2D рендерера для текстовых меток
function initCSS2DRenderer() {
    try {
        // Создаем рендерер для CSS2D объектов
        labelRenderer = new THREE.CSS2DRenderer();
        labelRenderer.setSize(window.innerWidth, window.innerHeight);
        labelRenderer.domElement.style.position = 'absolute';
        labelRenderer.domElement.style.top = '0';
        labelRenderer.domElement.style.left = '0';
        labelRenderer.domElement.style.pointerEvents = 'none';
        const warehouseView = document.getElementById('warehouse-view');
        if (warehouseView) {
            warehouseView.appendChild(labelRenderer.domElement);
            console.log("CSS2D рендерер инициализирован");
        } else {
            console.error("Элемент #warehouse-view не найден для CSS2D рендерера");
        }
    } catch (e) {
        console.error("Ошибка при инициализации CSS2D рендерера:", e);
    }
} 