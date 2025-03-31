// Данные о схеме склада
const warehouseData = {
    // Размеры склада (в сантиметрах)
    dimensions: {
        width: 1440,  // Общая ширина по схеме
        length: 1440, // Общая длина по схеме
        height: 300   // Высота склада
    },
    
    // Размеры секций согласно предоставленной схеме
    sections: [
        // Первый ряд (Строка 3 на схеме)
        { id: "A01", x: 120, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B01", x: 240, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C01", x: 480, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D01", x: 600, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E01", x: 840, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F01", x: 960, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G01", x: 1200, y: 0, z: 80, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        // Первый ряд (Строка 4 на схеме)
        { id: "A02", x: 120, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B02", x: 240, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C02", x: 480, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D02", x: 600, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E02", x: 840, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F02", x: 960, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G02", x: 1200, y: 0, z: 160, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        // Первый ряд (Строки 5-8 на схеме)
        { id: "A03", x: 120, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B03", x: 240, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C03", x: 480, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D03", x: 600, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E03", x: 840, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F03", x: 960, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G03", x: 1200, y: 0, z: 240, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A04", x: 120, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B04", x: 240, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C04", x: 480, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D04", x: 600, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E04", x: 840, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F04", x: 960, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G04", x: 1200, y: 0, z: 320, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A05", x: 120, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B05", x: 240, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C05", x: 480, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D05", x: 600, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E05", x: 840, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F05", x: 960, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G05", x: 1200, y: 0, z: 400, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A06", x: 120, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B06", x: 240, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C06", x: 480, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D06", x: 600, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E06", x: 840, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F06", x: 960, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G06", x: 1200, y: 0, z: 480, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        // Второй ряд (Строки 10-15 на схеме)
        { id: "A07", x: 120, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B07", x: 240, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C07", x: 480, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D07", x: 600, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E07", x: 840, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F07", x: 960, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G07", x: 1200, y: 0, z: 640, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A08", x: 120, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B08", x: 240, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C08", x: 480, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D08", x: 600, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E08", x: 840, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F08", x: 960, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G08", x: 1200, y: 0, z: 720, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A09", x: 120, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B09", x: 240, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C09", x: 480, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D09", x: 600, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E09", x: 840, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F09", x: 960, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G09", x: 1200, y: 0, z: 800, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A10", x: 120, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B10", x: 240, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C10", x: 480, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D10", x: 600, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E10", x: 840, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F10", x: 960, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G10", x: 1200, y: 0, z: 880, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A11", x: 120, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B11", x: 240, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C11", x: 480, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D11", x: 600, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E11", x: 840, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F11", x: 960, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G11", x: 1200, y: 0, z: 960, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A12", x: 120, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B12", x: 240, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C12", x: 480, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D12", x: 600, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E12", x: 840, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F12", x: 960, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G12", x: 1200, y: 0, z: 1040, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        // Третий ряд (Строки 17-22 на схеме)
        { id: "A13", x: 120, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B13", x: 240, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C13", x: 480, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D13", x: 600, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E13", x: 840, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F13", x: 960, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G13", x: 1200, y: 0, z: 1120, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A14", x: 120, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B14", x: 240, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C14", x: 480, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D14", x: 600, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E14", x: 840, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F14", x: 960, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G14", x: 1200, y: 0, z: 1200, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A15", x: 120, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B15", x: 240, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C15", x: 480, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D15", x: 600, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E15", x: 840, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F15", x: 960, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G15", x: 1200, y: 0, z: 1280, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A16", x: 120, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B16", x: 240, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C16", x: 480, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D16", x: 600, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E16", x: 840, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F16", x: 960, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G16", x: 1200, y: 0, z: 1360, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A17", x: 120, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B17", x: 240, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C17", x: 480, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D17", x: 600, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E17", x: 840, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F17", x: 960, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "G17", x: 1200, y: 0, z: 1440, width: 120, height: 80, depth: 80, color: "#aaa" },
        
        { id: "A18", x: 120, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "B18", x: 240, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "C18", x: 480, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "D18", x: 600, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "E18", x: 840, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" },
        { id: "F18", x: 960, y: 0, z: 1520, width: 120, height: 80, depth: 80, color: "#aaa" }
    ],
    
    // Возможная дополнительная информация о секциях
    sectionInfo: {
        "A01": { description: "Бытовая техника", capacity: "1000 кг", status: "Заполнено 60%" },
        "B01": { description: "Электроника", capacity: "800 кг", status: "Заполнено 45%" },
        "C01": { description: "Мебель", capacity: "1200 кг", status: "Заполнено 75%" },
        "D01": { description: "Электроинструменты", capacity: "900 кг", status: "Заполнено 30%" },
        "E01": { description: "Кухонная техника", capacity: "850 кг", status: "Заполнено 80%" },
        "F01": { description: "Спортивные товары", capacity: "750 кг", status: "Заполнено 20%" },
        "G01": { description: "Товары для дома", capacity: "1100 кг", status: "Заполнено 55%" },
        
        "A07": { description: "Бытовая техника (2 ряд)", capacity: "1000 кг", status: "Заполнено 40%" },
        "B07": { description: "Электроника (2 ряд)", capacity: "800 кг", status: "Заполнено 65%" },
        "C07": { description: "Мебель (2 ряд)", capacity: "1200 кг", status: "Заполнено 35%" },
        
        "A13": { description: "Бытовая техника (3 ряд)", capacity: "1000 кг", status: "Заполнено 25%" },
        "B13": { description: "Электроника (3 ряд)", capacity: "800 кг", status: "Заполнено 50%" },
        "C13": { description: "Мебель (3 ряд)", capacity: "1200 кг", status: "Заполнено 70%" }
    },
    
    // Данные о паллетах согласно схеме
    pallets: [
        // Первый ряд - секции A
        {
            id: "PAL-A01",
            x: 120,
            y: 0,
            z: 80,
            width: 110,
            height: 100,
            depth: 70,
            color: "#3498db", // синий
            items: [
                { name: "Телевизор Samsung 55\"", quantity: 3, weight: 20 },
                { name: "Микроволновая печь LG", quantity: 5, weight: 8 }
            ],
            totalWeight: 100,
            orderNumber: "ORD-2023-001",
            status: "Готов к отгрузке"
        },
        {
            id: "PAL-A02",
            x: 120,
            y: 0,
            z: 160,
            width: 110,
            height: 90,
            depth: 70,
            color: "#3498db", // синий
            items: [
                { name: "Кондиционер Haier", quantity: 2, weight: 35 },
                { name: "Вентилятор напольный", quantity: 4, weight: 5 }
            ],
            totalWeight: 90,
            orderNumber: "ORD-2023-001",
            status: "Готов к отгрузке"
        },
        
        // Первый ряд - секции B
        {
            id: "PAL-B01",
            x: 240,
            y: 0,
            z: 80,
            width: 110,
            height: 80,
            depth: 70,
            color: "#2ecc71", // зеленый
            items: [
                { name: "Смартфон iPhone 14", quantity: 10, weight: 0.2 },
                { name: "Планшет iPad Pro", quantity: 5, weight: 0.8 }
            ],
            totalWeight: 6,
            orderNumber: "ORD-2023-002",
            status: "Формируется"
        },
        {
            id: "PAL-B03",
            x: 240,
            y: 0,
            z: 240,
            width: 110,
            height: 70,
            depth: 70,
            color: "#2ecc71", // зеленый
            items: [
                { name: "Ноутбук Dell XPS", quantity: 3, weight: 2 },
                { name: "Наушники Sony", quantity: 8, weight: 0.3 }
            ],
            totalWeight: 8.4,
            orderNumber: "ORD-2023-002",
            status: "Формируется"
        },
        
        // Первый ряд - секции C
        {
            id: "PAL-C02",
            x: 480,
            y: 0,
            z: 160,
            width: 110,
            height: 120,
            depth: 70,
            color: "#e74c3c", // красный
            items: [
                { name: "Стол рабочий", quantity: 2, weight: 25 },
                { name: "Кресло офисное", quantity: 3, weight: 15 }
            ],
            totalWeight: 95,
            orderNumber: "ORD-2023-003",
            status: "Отправлен"
        },
        {
            id: "PAL-C05",
            x: 480,
            y: 0,
            z: 400,
            width: 110,
            height: 110,
            depth: 70,
            color: "#e74c3c", // красный
            items: [
                { name: "Шкаф книжный", quantity: 1, weight: 60 },
                { name: "Тумба TV", quantity: 2, weight: 30 }
            ],
            totalWeight: 120,
            orderNumber: "ORD-2023-003",
            status: "Отправлен"
        },
        
        // Первый ряд - секции D
        {
            id: "PAL-D01",
            x: 600,
            y: 0,
            z: 80,
            width: 110,
            height: 85,
            depth: 70,
            color: "#9b59b6", // фиолетовый
            items: [
                { name: "Дрель аккумуляторная", quantity: 5, weight: 3 },
                { name: "Шуруповерт", quantity: 5, weight: 2.5 }
            ],
            totalWeight: 27.5,
            orderNumber: "ORD-2023-004",
            status: "Готов к отгрузке"
        },
        
        // Первый ряд - секции E
        {
            id: "PAL-E03",
            x: 840,
            y: 0,
            z: 240,
            width: 110,
            height: 95,
            depth: 70,
            color: "#f39c12", // оранжевый
            items: [
                { name: "Миксер кухонный", quantity: 8, weight: 2 },
                { name: "Блендер", quantity: 6, weight: 1.5 }
            ],
            totalWeight: 25,
            orderNumber: "ORD-2023-005",
            status: "Формируется"
        },
        
        // Первый ряд - секции F
        {
            id: "PAL-F04",
            x: 960,
            y: 0,
            z: 320,
            width: 110,
            height: 100,
            depth: 70,
            color: "#1abc9c", // бирюзовый
            items: [
                { name: "Гантели (пара) 10кг", quantity: 5, weight: 20 },
                { name: "Мат для йоги", quantity: 10, weight: 0.8 }
            ],
            totalWeight: 108,
            orderNumber: "ORD-2023-006",
            status: "Отправлен"
        },
        
        // Первый ряд - секции G
        {
            id: "PAL-G06",
            x: 1200,
            y: 0,
            z: 480,
            width: 110,
            height: 90,
            depth: 70,
            color: "#34495e", // темно-синий
            items: [
                { name: "Набор посуды", quantity: 4, weight: 8 },
                { name: "Текстиль для дома", quantity: 15, weight: 1.2 }
            ],
            totalWeight: 50,
            orderNumber: "ORD-2023-007",
            status: "Готов к отгрузке"
        },
        
        // Второй ряд
        {
            id: "PAL-A08",
            x: 120,
            y: 0,
            z: 720,
            width: 110,
            height: 105,
            depth: 70,
            color: "#3498db", // синий
            items: [
                { name: "Холодильник Samsung", quantity: 1, weight: 80 },
                { name: "Морозильная камера", quantity: 1, weight: 65 }
            ],
            totalWeight: 145,
            orderNumber: "ORD-2023-008",
            status: "Формируется"
        },
        {
            id: "PAL-B07",
            x: 240,
            y: 0,
            z: 640,
            width: 110,
            height: 75,
            depth: 70,
            color: "#2ecc71", // зеленый
            items: [
                { name: "Монитор 27\"", quantity: 4, weight: 5.5 },
                { name: "Клавиатура беспроводная", quantity: 6, weight: 0.8 }
            ],
            totalWeight: 26.8,
            orderNumber: "ORD-2023-009",
            status: "Отправлен"
        },
        {
            id: "PAL-C10",
            x: 480,
            y: 0,
            z: 880,
            width: 110,
            height: 130,
            depth: 70,
            color: "#e74c3c", // красный
            items: [
                { name: "Диван трехместный", quantity: 1, weight: 85 },
                { name: "Журнальный стол", quantity: 2, weight: 15 }
            ],
            totalWeight: 115,
            orderNumber: "ORD-2023-010",
            status: "Готов к отгрузке"
        },
        
        // Третий ряд
        {
            id: "PAL-E13",
            x: 840,
            y: 0,
            z: 1120,
            width: 110,
            height: 95,
            depth: 70,
            color: "#f39c12", // оранжевый
            items: [
                { name: "Кофемашина автоматическая", quantity: 2, weight: 12 },
                { name: "Тостер", quantity: 5, weight: 2.2 }
            ],
            totalWeight: 35,
            orderNumber: "ORD-2023-011",
            status: "Формируется"
        },
        {
            id: "PAL-F15",
            x: 960,
            y: 0,
            z: 1280,
            width: 110,
            height: 100,
            depth: 70,
            color: "#1abc9c", // бирюзовый
            items: [
                { name: "Велотренажер", quantity: 1, weight: 45 },
                { name: "Степпер", quantity: 2, weight: 22 }
            ],
            totalWeight: 89,
            orderNumber: "ORD-2023-012",
            status: "Отправлен"
        },
        {
            id: "PAL-B14",
            x: 240,
            y: 0,
            z: 1200,
            width: 110,
            height: 65,
            depth: 70,
            color: "#2ecc71", // зеленый
            items: [
                { name: "Камера Canon", quantity: 3, weight: 1.2 },
                { name: "Штатив", quantity: 3, weight: 2.8 }
            ],
            totalWeight: 12,
            orderNumber: "ORD-2023-013",
            status: "Готов к отгрузке"
        }
    ],
    
    // Размеры склада из схемы
    warehouseDimensions: {
        width: 1440,   // Общая ширина (ось X): 360 + 120 + 120 + 360 + 120 + 120 + 360 = 1440 см
        length: 1600,  // Общая длина (ось Z): учитываем все ряды секций и проходы между ними
        height: 300,   // Высота склада
        aisleWidth: 200, // Ширина проходов между стеллажами
    }
}; 