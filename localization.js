/**
 * Система локализации для KUDO®
 * Поддерживаемые языки: русский, английский
 */
const localization = {
    // Русский язык (по умолчанию)
    'ru': {
        // Общие фразы
        'login': 'Вход',
        'username': 'Логин',
        'password': 'Пароль',
        'remember_me': 'Запомнить меня',
        'forgot_password': 'Восстановить пароль',
        'login_button': 'Авторизоваться',
        'loading': 'Загрузка...',
        'logout': 'Выйти',
        'save': 'Сохранить',
        'cancel': 'Отмена',
        'settings_saved': 'Настройки успешно сохранены',
        'settings_reset': 'Настройки сброшены до значений по умолчанию',
        'reset_confirm': 'Вы уверены, что хотите восстановить настройки по умолчанию?',
        'copyright': 'Система оптимизации паллетизации',
        
        // Сообщения об ошибках и уведомления
        'login_error': 'Пожалуйста, введите имя пользователя и пароль',
        'password_recovery_message': 'Функция восстановления пароля будет доступна в ближайшее время',
        
        // Меню навигации
        'orders': 'Заказы',
        'warehouse': 'Склад',
        'pallets': 'Паллеты',
        'operators': 'Операторы',
        'statistics': 'Статистика',
        'settings': 'Настройки',
        
        // Заголовки разделов
        'orders_title': 'Управление заказами',
        'warehouse_title': 'Карта склада',
        'pallets_title': 'Управление паллетами',
        'operators_title': 'Операторы и маршруты',
        'statistics_title': 'Статистика и аналитика',
        'settings_title': 'Настройки системы',
        
        // Кнопки и действия для заказов
        'create_order': 'Создать заказ',
        'import_orders': 'Импорт заказов',
        'order_number': '№ Заказа',
        'status': 'Статус',
        'date': 'Дата',
        'products': 'Товары',
        'pallets_count': 'Паллеты',
        'actions': 'Действия',
        'view': 'Просмотр',
        'optimize': 'Оптимизировать',
        'start_collection': 'Начать сборку',
        'status_active': 'В процессе',
        'status_complete': 'Завершен',
        'status_pending': 'Ожидание',
        
        // Панель информации о складе
        'section_info': 'Информация о секции',
        'select_section': 'Выберите секцию для просмотра деталей',
        
        // Заглушки для контента
        'pallets_placeholder': 'Здесь будет функционал для просмотра и управления паллетами',
        'operators_placeholder': 'Здесь будет функционал для управления операторами и их маршрутами',
        'statistics_placeholder': 'Здесь будут отображены графики эффективности работы системы',
        
        // Настройки
        'general_settings': 'Общие настройки',
        'theme': 'Тема интерфейса',
        'light_theme': 'Светлая',
        'dark_theme': 'Темная',
        'auto_theme': 'Системная',
        'language': 'Язык интерфейса',
        
        'palletization_settings': 'Параметры паллетизации',
        'max_pallet_weight': 'Максимальный вес паллеты (кг)',
        'max_pallet_height': 'Максимальная высота паллеты (см)',
        'layer_count': 'Количество слоёв укладки',
        'brick_pattern': 'Использовать кирпичную перевязку',
        'heavy_bottom': 'Тяжелые коробки внизу',
        
        'routing_algorithm': 'Алгоритм маршрутизации',
        'route_method': 'Метод построения маршрута',
        'nearest_neighbor': 'Ближайший сосед',
        'optimal_route': 'Оптимальный маршрут',
        'sectoral': 'По секторам',
        'sequential': 'Последовательный',
        'operators_count': 'Количество операторов',
        'minimize_path': 'Минимизировать длину маршрута',
        'minimize_moves': 'Минимизировать число перекладок',
        
        'visualization': 'Визуализация и представление',
        'visualization_quality': 'Качество 3D-визуализации',
        'low_quality': 'Низкое',
        'medium_quality': 'Среднее',
        'high_quality': 'Высокое',
        'show_labels': 'Показывать метки секций',
        'show_route': 'Показывать маршрут в 3D',
        'animate_route': 'Анимация маршрута',
        
        'export_integration': 'Экспорт и интеграция',
        'export_format': 'Формат экспорта маршрутов',
        'api_endpoint': 'Адрес API',
        'auto_sync': 'Автоматическая синхронизация данных',
        
        'save_settings': 'Сохранить настройки',
        'reset_default': 'Восстановить по умолчанию'
    },
    
    // Английский язык
    'en': {
        // Common phrases
        'login': 'Login',
        'username': 'Username',
        'password': 'Password',
        'remember_me': 'Remember me',
        'forgot_password': 'Recover password',
        'login_button': 'Sign in',
        'loading': 'Loading...',
        'logout': 'Logout',
        'save': 'Save',
        'cancel': 'Cancel',
        'settings_saved': 'Settings saved successfully',
        'settings_reset': 'Settings reset to default values',
        'reset_confirm': 'Are you sure you want to restore default settings?',
        'copyright': 'Palletization Optimization System',
        
        // Сообщения об ошибках и уведомления
        'login_error': 'Please enter username and password',
        'password_recovery_message': 'Password recovery function will be available soon',
        
        // Меню навигации
        'orders': 'Orders',
        'warehouse': 'Warehouse',
        'pallets': 'Pallets',
        'operators': 'Operators',
        'statistics': 'Statistics',
        'settings': 'Settings',
        
        // Заголовки разделов
        'orders_title': 'Order Management',
        'warehouse_title': 'Warehouse Map',
        'pallets_title': 'Pallet Management',
        'operators_title': 'Operators and Routes',
        'statistics_title': 'Statistics and Analytics',
        'settings_title': 'System Settings',
        
        // Кнопки и действия для заказов
        'create_order': 'Create Order',
        'import_orders': 'Import Orders',
        'order_number': 'Order #',
        'status': 'Status',
        'date': 'Date',
        'products': 'Products',
        'pallets_count': 'Pallets',
        'actions': 'Actions',
        'view': 'View',
        'optimize': 'Optimize',
        'start_collection': 'Start Collection',
        'status_active': 'In Progress',
        'status_complete': 'Completed',
        'status_pending': 'Pending',
        
        // Панель информации о складе
        'section_info': 'Section Information',
        'select_section': 'Select a section to view details',
        
        // Заглушки для контента
        'pallets_placeholder': 'Functionality for viewing and managing pallets will be available here',
        'operators_placeholder': 'Functionality for managing operators and their routes will be available here',
        'statistics_placeholder': 'System efficiency graphs will be displayed here',
        
        // Настройки
        'general_settings': 'General Settings',
        'theme': 'Interface Theme',
        'light_theme': 'Light',
        'dark_theme': 'Dark',
        'auto_theme': 'System',
        'language': 'Interface Language',
        
        'palletization_settings': 'Palletization Parameters',
        'max_pallet_weight': 'Maximum pallet weight (kg)',
        'max_pallet_height': 'Maximum pallet height (cm)',
        'layer_count': 'Number of layers',
        'brick_pattern': 'Use brick pattern',
        'heavy_bottom': 'Heavy boxes on bottom',
        
        'routing_algorithm': 'Routing Algorithm',
        'route_method': 'Route building method',
        'nearest_neighbor': 'Nearest neighbor',
        'optimal_route': 'Optimal route',
        'sectoral': 'By sectors',
        'sequential': 'Sequential',
        'operators_count': 'Number of operators',
        'minimize_path': 'Minimize route length',
        'minimize_moves': 'Minimize number of relocations',
        
        'visualization': 'Visualization and Presentation',
        'visualization_quality': '3D visualization quality',
        'low_quality': 'Low',
        'medium_quality': 'Medium',
        'high_quality': 'High',
        'show_labels': 'Show section labels',
        'show_route': 'Show route in 3D',
        'animate_route': 'Route animation',
        
        'export_integration': 'Export and Integration',
        'export_format': 'Route export format',
        'api_endpoint': 'API endpoint',
        'auto_sync': 'Automatic data synchronization',
        
        'save_settings': 'Save settings',
        'reset_default': 'Restore defaults'
    }
};

// Экспортируем объект локализации
if (typeof module !== 'undefined' && module.exports) {
    module.exports = localization;
} 