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
        // Все палеты удалены
    ],
    
    // Размеры склада из схемы
    warehouseDimensions: {
        width: 1440,   // Общая ширина (ось X): 360 + 120 + 120 + 360 + 120 + 120 + 360 = 1440 см
        length: 1600,  // Общая длина (ось Z): учитываем все ряды секций и проходы между ними
        height: 300,   // Высота склада
        aisleWidth: 200, // Ширина проходов между стеллажами
    }
}; 