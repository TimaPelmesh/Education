// Основные переменные для Three.js
let scene, camera, renderer, controls;
let warehouseObjects = {};
let selectedSection = null;
let raycaster, mouse;
let palletObjects = {};
let dimensionLabels = [];
let textureLoader; // загрузчик текстур
let woodTexture; // текстура дерева для паллет
let isMobileDevice = window.innerWidth <= 768; // Проверка мобильного устройства
let isInfoPanelHidden = false; // Флаг скрытой информационной панели
let isFullscreen = false; // Флаг полноэкранного режима

// Инициализация 3D-сцены
function init() {
    console.log("Инициализация 3D-сцены");
    
    const warehouseView = document.getElementById('warehouse-view');
    if (!warehouseView) {
        console.error("Элемент #warehouse-view не найден");
        return;
    }
    
    // Создаем сцену
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f7fa); // Более приятный цвет фона

    // Создаем загрузчик текстур
    textureLoader = new THREE.TextureLoader();
    
    // Загружаем текстуру дерева
    try {
        // Более реалистичная текстура дерева
        const woodTextureUrl = 'https://threejs.org/examples/textures/hardwood2_diffuse.jpg';
        woodTexture = textureLoader.load(woodTextureUrl);
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(2, 2);
        console.log("Текстура дерева загружена");
    } catch (e) {
        console.error("Ошибка при загрузке текстуры:", e);
        // Если не удалось загрузить, создаем резервную текстуру
        woodTexture = null;
    }

    // Получаем размеры контейнера
    const containerWidth = warehouseView.clientWidth;
    const containerHeight = warehouseView.clientHeight;
    console.log("Размеры контейнера:", containerWidth, "x", containerHeight);

    // Настраиваем камеру для вида сверху
    const aspect = containerWidth / containerHeight;
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 5000);
    
    // Устанавливаем камеру непосредственно сверху склада
    camera.position.set(warehouseData.dimensions.width / 2, 2000, warehouseData.dimensions.length / 2);
    camera.lookAt(warehouseData.dimensions.width / 2, 0, warehouseData.dimensions.length / 2);

    // Настраиваем рендерер для лучшего качества изображения
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true
    });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.outputEncoding = THREE.sRGBEncoding; // Улучшенный цветовой профиль
    warehouseView.innerHTML = ''; // Очищаем контейнер перед добавлением
    warehouseView.appendChild(renderer.domElement);

    // Инициализируем Raycaster для выбора объектов мышью
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Добавляем управление камерой (OrbitControls)
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // плавное движение камеры
    controls.dampingFactor = 0.1; // скорость затухания инерции
    controls.screenSpacePanning = true; // использование панорамирования в пространстве экрана
    controls.minDistance = 100; // минимальное расстояние до цели
    controls.maxDistance = 3000; // максимальное расстояние до цели
    
    // Ограничиваем вращение, чтобы не переворачивать вид
    controls.minPolarAngle = 0; // минимальный угол поворота вверх
    controls.maxPolarAngle = Math.PI / 2; // максимальный угол поворота вниз (не ниже горизонта)
    
    // Устанавливаем центр вращения в центр склада
    controls.target.set(warehouseData.dimensions.width / 2, 0, warehouseData.dimensions.length / 2);
    
    // Ограничиваем зум колесиком мыши
    controls.zoomSpeed = 0.8;

    // Добавляем кнопки для предустановленных ракурсов обзора
    addViewButtons();

    // Добавляем освещение с мягкими тенями
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Увеличиваем интенсивность для меньших теней
    scene.add(ambientLight);

    // Основной направленный свет с более мягкими тенями
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // Уменьшаем интенсивность
    directionalLight.position.set(warehouseData.dimensions.width * 0.5, 800, warehouseData.dimensions.length * 0.5);
    directionalLight.castShadow = false;
    
    // Закомментированы настройки теней, так как они отключены
    /*
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 3000;
    directionalLight.shadow.camera.left = -1500;
    directionalLight.shadow.camera.right = 1500;
    directionalLight.shadow.camera.top = 1500;
    directionalLight.shadow.camera.bottom = -1500;
    directionalLight.shadow.bias = -0.001; // Устраняем артефакты
    directionalLight.shadow.radius = 2; // Смягчаем края теней
    */
    scene.add(directionalLight);
    
    // Добавляем второй направленный свет с противоположной стороны
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    directionalLight2.position.set(warehouseData.dimensions.width * 0.5, 600, -500);
    scene.add(directionalLight2);

    // Отключаем тени
    renderer.shadowMap.enabled = false;
    //renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Мягкие тени

    // Добавляем пол с сеткой
    createFloor();

    try {
        // Создаем секции склада
        createWarehouseSections();

        // Создаем паллеты
        createPallets();

        // Добавляем размеры
        addDimensions();

        // Добавляем координатную сетку с обозначениями ячеек
        if (typeof labelRenderer !== 'undefined') {
            addCellLabels();
        } else {
            console.warn("labelRenderer не определен, метки не будут добавлены");
        }
        
        // Добавляем кнопку для управления информационной панелью
        addInfoPanelControls();
        
        console.log("3D-сцена успешно создана");
    } catch (e) {
        console.error("Ошибка при создании объектов сцены:", e);
    }

    // Добавляем обработчик клика мыши для выбора секций и паллет
    renderer.domElement.addEventListener('click', onMouseClick);

    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', onWindowResize);

    // Запускаем анимацию
    animate();
    
    // Установить вид сверху
    setTopView();
}

// Создание пола с улучшенным дизайном
function createFloor() {
    // Загружаем текстуру для пола (бетон или плитка)
    let floorTexture = null;
    try {
        floorTexture = textureLoader.load('https://threejs.org/examples/textures/hardwood2_diffuse.jpg');
        floorTexture.wrapS = THREE.RepeatWrapping;
        floorTexture.wrapT = THREE.RepeatWrapping;
        
        // Масштаб текстуры зависит от размера склада
        const repeatX = Math.ceil(warehouseData.dimensions.width / 200);
        const repeatZ = Math.ceil(warehouseData.dimensions.length / 200);
        floorTexture.repeat.set(repeatX, repeatZ);
    } catch (e) {
        console.error("Ошибка при загрузке текстуры пола:", e);
    }
    
    // Создаем материал для пола с текстурой или без
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.8,
        metalness: 0.2,
        map: floorTexture,
        side: THREE.DoubleSide
    });
    
    // Создаем геометрию пола
    const floorGeometry = new THREE.PlaneGeometry(
        warehouseData.dimensions.width + 400, 
        warehouseData.dimensions.length + 400,
        10, 10
    );
    
    // Создаем меш пола
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Поворачиваем пол так, чтобы он был горизонтальным
    floor.position.y = -5; // Немного ниже уровня секций
    floor.position.x = warehouseData.dimensions.width / 2;
    floor.position.z = warehouseData.dimensions.length / 2;
    floor.receiveShadow = false; // Пол не получает тени
    scene.add(floor);
    
    // Добавляем основную сетку с более тонкими и менее заметными линиями
    const gridHelper = new THREE.GridHelper(
        Math.max(warehouseData.dimensions.width, warehouseData.dimensions.length) + 400, 
        40, // Количество делений
        0x444444, // Цвет основных линий (более тёмный)
        0xaaaaaa  // Цвет вспомогательных линий (светлее)
    );
    gridHelper.position.y = -3; // Чуть выше пола
    gridHelper.position.x = warehouseData.dimensions.width / 2;
    gridHelper.position.z = warehouseData.dimensions.length / 2;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.3; // Делаем сетку менее заметной
    scene.add(gridHelper);
    
    // Добавляем подписи координат по периметру
    addGridLabels();
    
    // Добавляем менее заметные оси координат
    const axesHelper = new THREE.AxesHelper(150);
    axesHelper.position.y = 5;
    axesHelper.material.transparent = true;
    axesHelper.material.opacity = 0.7;
    scene.add(axesHelper);
}

// Добавление подписей координат по периметру сетки
function addGridLabels() {
    if (!labelRenderer) return;
    
    const width = warehouseData.dimensions.width;
    const length = warehouseData.dimensions.length;
    
    // Улучшенный стиль для меток координат
    const labelStyle = {
        padding: '2px 5px',
        fontSize: '10px',
        fontWeight: '500',
        borderRadius: '3px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(2px)',
        fontFamily: 'Arial, sans-serif'
    };
    
    // Создаем метки координат по оси X (горизонталь)
    for (let x = 0; x <= width; x += 120) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'grid-label';
        labelDiv.textContent = x;
        
        // Применяем улучшенный стиль для X-меток
        labelDiv.style.color = '#2980b9';
        labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
        labelDiv.style.border = '1px solid rgba(41, 128, 185, 0.3)';
        
        // Применяем общие стили
        Object.keys(labelStyle).forEach(key => {
            labelDiv.style[key] = labelStyle[key];
        });
        
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(x, 10, -50);
        scene.add(label);
    }
    
    // Создаем метки координат по оси Z (вертикаль)
    for (let z = 0; z <= length; z += 80) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'grid-label';
        labelDiv.textContent = z;
        
        // Применяем улучшенный стиль для Z-меток
        labelDiv.style.color = '#27ae60';
        labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';
        labelDiv.style.border = '1px solid rgba(39, 174, 96, 0.3)';
        
        // Применяем общие стили
        Object.keys(labelStyle).forEach(key => {
            labelDiv.style[key] = labelStyle[key];
        });
        
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(-50, 10, z);
        scene.add(label);
    }
}

// Добавление кнопок для предустановленных ракурсов
function addViewButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'view-buttons';
    
    // Определяем, используется ли мобильное устройство
    const isMobile = window.innerWidth <= 768;
    
    // Устанавливаем позиционирование в зависимости от устройства
    if (isMobile) {
        // Для мобильных - позиционирование относительно верхнего левого угла
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '60px';
        buttonContainer.style.left = '10px';
        buttonContainer.style.zIndex = '50';
    } else {
        // Для десктопов - позиционирование относительно верхнего правого угла
        buttonContainer.style.position = 'absolute';
        buttonContainer.style.top = '10px';
        buttonContainer.style.right = '10px';
        buttonContainer.style.zIndex = '1000';
    }
    
    // Кнопка вида сверху
    const topViewBtn = document.createElement('button');
    topViewBtn.innerHTML = '<i class="fas fa-map"></i> Вид сверху';
    topViewBtn.onclick = setTopView;
    topViewBtn.style.marginRight = '5px';
    buttonContainer.appendChild(topViewBtn);
    
    // Кнопка изометрического вида
    const isoViewBtn = document.createElement('button');
    isoViewBtn.innerHTML = '<i class="fas fa-cube"></i> Изометрия';
    isoViewBtn.onclick = setIsometricView;
    buttonContainer.appendChild(isoViewBtn);
    
    // Добавляем контейнер кнопок в DOM
    document.getElementById('warehouse-view').appendChild(buttonContainer);
    
    // Добавляем обработчик изменения размера окна для адаптивности
    window.addEventListener('resize', function() {
        const isMobileNow = window.innerWidth <= 768;
        
        if (isMobileNow) {
            buttonContainer.style.right = 'auto';
            buttonContainer.style.left = '10px';
            buttonContainer.style.top = '60px';
            buttonContainer.style.zIndex = '50';
        } else {
            buttonContainer.style.left = 'auto';
            buttonContainer.style.right = '10px';
            buttonContainer.style.top = '10px';
            buttonContainer.style.zIndex = '1000';
        }
    });
}

// Установка вида камеры сверху
function setTopView() {
    // Сохраняем текущую позицию камеры для плавного перехода
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    
    // Целевые значения для вида сверху
    const warehouseCenter = new THREE.Vector3(
        warehouseData.dimensions.width / 2,
        0,
        warehouseData.dimensions.length / 2
    );
    
    // Устанавливаем целевые значения с небольшим смещением для лучшего обзора
    const targetPosition = new THREE.Vector3(
        warehouseCenter.x, 
        warehouseData.dimensions.width * 0.7, 
        warehouseCenter.z
    );
    const targetTarget = new THREE.Vector3(
        warehouseCenter.x, 
        0, 
        warehouseCenter.z
    );
    
    // Создаем анимацию перехода к виду сверху
    const duration = 1000; // миллисекунды
    const startTime = Date.now();
    
    function animateCamera() {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1); // от 0 до 1
        
        // Функция сглаживания для более плавного движения
        const easing = function(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const easedT = easing(t);
        
        // Интерполируем позицию камеры
        camera.position.lerpVectors(startPosition, targetPosition, easedT);
        controls.target.lerpVectors(startTarget, targetTarget, easedT);
        controls.update();
        
        // Продолжаем анимацию, если не достигли конца
        if (t < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            // Финальная корректировка для точного позиционирования
            camera.position.copy(targetPosition);
            controls.target.copy(targetTarget);
            controls.update();
        }
    }
    
    // Запускаем анимацию
    animateCamera();
}

// Установка изометрического вида
function setIsometricView() {
    // Сохраняем текущую позицию камеры для плавного перехода
    const startPosition = camera.position.clone();
    const startTarget = controls.target.clone();
    
    // Целевые значения для изометрического вида
    const warehouseCenter = new THREE.Vector3(
        warehouseData.dimensions.width / 2,
        0,
        warehouseData.dimensions.length / 2
    );
    
    // Устанавливаем целевые значения для изометрического вида
    const targetPosition = new THREE.Vector3(
        warehouseCenter.x + warehouseData.dimensions.width * 0.6, 
        warehouseData.dimensions.width * 0.5, 
        warehouseCenter.z + warehouseData.dimensions.length * 0.6
    );
    const targetTarget = new THREE.Vector3(
        warehouseCenter.x, 
        0, 
        warehouseCenter.z
    );
    
    // Создаем анимацию перехода к изометрическому виду
    const duration = 1000; // миллисекунды
    const startTime = Date.now();
    
    function animateCamera() {
        const now = Date.now();
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1); // от 0 до 1
        
        // Функция сглаживания для более плавного движения
        const easing = function(t) {
            return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        };
        
        const easedT = easing(t);
        
        // Интерполируем позицию камеры
        camera.position.lerpVectors(startPosition, targetPosition, easedT);
        controls.target.lerpVectors(startTarget, targetTarget, easedT);
        controls.update();
        
        // Продолжаем анимацию, если не достигли конца
        if (t < 1) {
            requestAnimationFrame(animateCamera);
        } else {
            // Финальная корректировка для точного позиционирования
            camera.position.copy(targetPosition);
            controls.target.copy(targetTarget);
            controls.update();
        }
    }
    
    // Запускаем анимацию
    animateCamera();
}

// Добавление координатной сетки с обозначениями ячеек
function addCellLabels() {
    if (!labelRenderer) {
        console.error("labelRenderer не инициализирован");
        return;
    }
    
    warehouseData.sections.forEach(section => {
        try {
            // Создаем 2D-текст для обозначения ячейки
            const labelDiv = document.createElement('div');
            labelDiv.className = 'cell-label';
            labelDiv.textContent = section.id;
            
            // Современное оформление метки ячейки
            labelDiv.style.display = 'flex';
            labelDiv.style.alignItems = 'center';
            labelDiv.style.justifyContent = 'center';
            labelDiv.style.fontSize = '13px';
            labelDiv.style.fontWeight = '600';
            labelDiv.style.color = 'rgba(44, 62, 80, 0.85)';
            labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            labelDiv.style.padding = '4px 8px';
            labelDiv.style.borderRadius = '6px';
            labelDiv.style.userSelect = 'none';
            labelDiv.style.pointerEvents = 'none';
            labelDiv.style.border = '1px solid rgba(52, 152, 219, 0.3)';
            labelDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
            labelDiv.style.backdropFilter = 'blur(4px)';
            labelDiv.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8)';
            
            const label = new THREE.CSS2DObject(labelDiv);
            label.position.set(
                section.x + section.width / 2,
                15, // Увеличиваем высоту для лучшей видимости
                section.z + section.depth / 2
            );
            scene.add(label);
        } catch (e) {
            console.error("Ошибка при создании метки для секции " + section.id, e);
        }
    });
}

// Создание 3D-объектов для секций склада
function createWarehouseSections() {
    warehouseData.sections.forEach(section => {
        // Создаем геометрию секции (прямоугольный параллелепипед)
        const geometry = new THREE.BoxGeometry(
            section.width, section.height, section.depth
        );
        
        // Создаем материал секции с заливкой цветом без прозрачности
        const material = new THREE.MeshStandardMaterial({
            color: section.color,
            transparent: false,
            roughness: 0.5,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        
        // Создаем mesh (объект)
        const mesh = new THREE.Mesh(geometry, material);
        
        // Устанавливаем позицию
        mesh.position.set(
            section.x + section.width / 2,
            section.y + section.height / 2,
            section.z + section.depth / 2
        );
        
        // Отключаем тени
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        
        // Добавляем в сцену
        scene.add(mesh);
        
        // Создаем каркас для более четкого выделения границ
        const wireframe = new THREE.LineSegments(
            new THREE.EdgesGeometry(geometry),
            new THREE.LineBasicMaterial({ 
                color: 0x000000,
                transparent: true,
                opacity: 0.3
            })
        );
        wireframe.position.copy(mesh.position);
        scene.add(wireframe);
        
        // Сохраняем ссылку на объект
        warehouseObjects[section.id] = {
            mesh: mesh,
            wireframe: wireframe,
            data: section
        };
    });
}

// Создание паллет с улучшенным визуальным представлением
function createPallets() {
    // Проверка наличия данных о паллетах
    if (!warehouseData.pallets || warehouseData.pallets.length === 0) {
        console.warn("Нет данных о паллетах");
        return;
    }

    // Создаем геометрию для деревянного основания паллеты (более детальный поддон)
    const createPalletBase = function(width, depth) {
        const baseGroup = new THREE.Group();
        
        // Основной поддон
        const baseGeometry = new THREE.BoxGeometry(width, 5, depth);
        const baseMaterial = woodTexture 
            ? new THREE.MeshStandardMaterial({ 
                map: woodTexture, 
                roughness: 0.8,
                metalness: 0.0,
                color: 0x8B4513
            })
            : new THREE.MeshStandardMaterial({ 
                color: 0x8B4513,
                roughness: 0.8,
                metalness: 0.0
            });
        
        const baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
        baseMesh.castShadow = true;
        baseMesh.receiveShadow = true;
        baseMesh.position.y = 2.5;
        baseGroup.add(baseMesh);
        
        // Поперечные планки (3 штуки)
        const crossBeamGeometry = new THREE.BoxGeometry(width, 5, 10);
        for (let i = 0; i < 3; i++) {
            const zPos = depth * (i / 2) - depth/2 + 5;
            const crossBeam = new THREE.Mesh(crossBeamGeometry, baseMaterial);
            crossBeam.castShadow = true;
            crossBeam.receiveShadow = true;
            crossBeam.position.set(0, 7.5, zPos);
            baseGroup.add(crossBeam);
        }
        
        return baseGroup;
    };
    
    // Создание паллет в соответствии с данными
    warehouseData.pallets.forEach(pallet => {
        // Создаем группу для паллеты
        const palletGroup = new THREE.Group();
        
        // Создаем детальное деревянное основание (поддон)
        const base = createPalletBase(pallet.width, pallet.depth);
        palletGroup.add(base);
        
        // Материал для основного груза на паллете
        const palletMaterial = new THREE.MeshStandardMaterial({
            color: pallet.color || "#3498db",
            transparent: true,
            opacity: 0.85,
            roughness: 0.4,
            metalness: 0.2
        });
        
        // Создаем основной груз
        const palletGeometry = new THREE.BoxGeometry(
            pallet.width * 0.9, // Немного уже поддона
            pallet.height, 
            pallet.depth * 0.9 // Немного короче поддона
        );
        const palletMesh = new THREE.Mesh(palletGeometry, palletMaterial);
        palletMesh.castShadow = true;
        palletMesh.receiveShadow = true;
        palletMesh.position.y = pallet.height/2 + 12; // Высота над поддоном
        palletGroup.add(palletMesh);
        
        // Для крупных паллет добавляем детали (имитация упаковки)
        if (pallet.height > 60 && pallet.width > 80) {
            // Горизонтальные полосы стреп-ленты
            const strapGeometry = new THREE.BoxGeometry(pallet.width * 0.92, 2, 5);
            const strapMaterial = new THREE.MeshStandardMaterial({
                color: 0x222222,
                roughness: 0.8,
                metalness: 0.4
            });
            
            // Добавляем две стреп-ленты на разной высоте
            const strap1 = new THREE.Mesh(strapGeometry, strapMaterial);
            strap1.position.y = pallet.height/3 + 12;
            strap1.position.z = pallet.depth/2 * 0.7;
            palletGroup.add(strap1);
            
            const strap2 = new THREE.Mesh(strapGeometry, strapMaterial);
            strap2.position.y = pallet.height*2/3 + 12;
            strap2.position.z = -pallet.depth/2 * 0.7;
            palletGroup.add(strap2);
        }
        
        // Позиционируем группу в соответствии с координатами
        palletGroup.position.set(pallet.x, 0, pallet.z);
        
        // Добавляем группу на сцену
        scene.add(palletGroup);
        
        // Сохраняем объект для дальнейшего взаимодействия
        palletObjects[pallet.id] = {
            group: palletGroup,
            mesh: palletMesh,
            data: pallet
        };
        
        // Добавляем метку с ID паллеты
        addPalletLabel(pallet);
    });
    
    console.log(`Создано ${Object.keys(palletObjects).length} паллет`);
}

// Функция для добавления метки к паллете
function addPalletLabel(pallet) {
    if (!labelRenderer) return;
    
    // Создаем элемент для метки с улучшенным стилем
    const labelDiv = document.createElement('div');
    labelDiv.className = 'pallet-label';
    labelDiv.textContent = pallet.id;
    labelDiv.style.padding = '4px 8px';
    labelDiv.style.backgroundColor = 'rgba(255, 248, 227, 0.9)';
    labelDiv.style.border = '1px solid ' + pallet.color;
    labelDiv.style.borderRadius = '4px';
    labelDiv.style.color = '#2c3e50';
    labelDiv.style.fontSize = '11px';
    labelDiv.style.fontWeight = '500';
    labelDiv.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.15)';
    labelDiv.style.backdropFilter = 'blur(2px)';
    labelDiv.style.textShadow = '0 1px 2px rgba(255, 255, 255, 0.8)';
    
    // Создаем 2D-объект для метки
    const palletLabel = new THREE.CSS2DObject(labelDiv);
    // Позиционируем метку над паллетой
    palletLabel.position.set(pallet.x, pallet.height + 20, pallet.z);
    scene.add(palletLabel);
}

// Добавление размеров
function addDimensions() {
    // Размеры склада
    const width = warehouseData.dimensions.width;
    const length = warehouseData.dimensions.length;
    const height = warehouseData.dimensions.height;
    
    // Материал для линий размеров (красный цвет)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    
    // Создаем линии размеров по ширине (ось X)
    createDimensionLine(
        new THREE.Vector3(0, 10, -50),
        new THREE.Vector3(width, 10, -50),
        width + " см",
        new THREE.Vector3(width / 2, 30, -50)
    );
    
    // Создаем линии размеров по длине (ось Z)
    createDimensionLine(
        new THREE.Vector3(-50, 10, 0),
        new THREE.Vector3(-50, 10, length),
        length + " см",
        new THREE.Vector3(-50, 30, length / 2)
    );
    
    // Создаем линии размеров по высоте (ось Y)
    createDimensionLine(
        new THREE.Vector3(-50, 0, -50),
        new THREE.Vector3(-50, height, -50),
        height + " см",
        new THREE.Vector3(-70, height / 2, -50)
    );
    
    // Добавляем разметку секций
    addSectionDimensions();
}

// Добавление разметки размеров секций
function addSectionDimensions() {
    // Размеры секции по схеме
    const sectionWidth = 120; // ширина секции по оси X
    const sectionDepth = 80;  // глубина секции по оси Z
    
    // Материал для линий размеров секций (зеленый цвет)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x00aa00, linewidth: 1 });
    
    // Горизонтальные размеры (ось X) - показываем первый ряд
    for (let x = 0; x <= warehouseData.dimensions.width; x += sectionWidth) {
        if (x > 0) {
            // Добавляем подпись размера секции
            if (typeof labelRenderer !== 'undefined') {
                const labelDiv = document.createElement('div');
                labelDiv.className = 'dimension-label section-dimension';
                labelDiv.textContent = sectionWidth + " см";
                labelDiv.style.fontSize = '10px';
                labelDiv.style.backgroundColor = 'rgba(0, 170, 0, 0.7)';
                
                const sectionLabel = new THREE.CSS2DObject(labelDiv);
                sectionLabel.position.set(x - sectionWidth/2, 20, -30);
                scene.add(sectionLabel);
                dimensionLabels.push(sectionLabel);
            }
        }
    }
    
    // Вертикальные размеры (ось Z) - показываем первый столбец
    for (let z = 0; z <= warehouseData.dimensions.length; z += sectionDepth) {
        if (z > 0) {
            // Добавляем подпись размера секции
            if (typeof labelRenderer !== 'undefined') {
                const labelDiv = document.createElement('div');
                labelDiv.className = 'dimension-label section-dimension';
                labelDiv.textContent = sectionDepth + " см";
                labelDiv.style.fontSize = '10px';
                labelDiv.style.backgroundColor = 'rgba(0, 170, 0, 0.7)';
                
                const sectionLabel = new THREE.CSS2DObject(labelDiv);
                sectionLabel.position.set(-30, 20, z - sectionDepth/2);
                scene.add(sectionLabel);
                dimensionLabels.push(sectionLabel);
            }
        }
    }
}

// Функция для создания линии размера с меткой
function createDimensionLine(start, end, label, labelPosition) {
    // Создаем геометрию линии
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([start, end]);
    
    // Материал для линии (современный цвет)
    const lineMaterial = new THREE.LineBasicMaterial({ 
        color: 0x3498db, 
        linewidth: 2,
        transparent: true,
        opacity: 0.85
    });
    
    // Создаем линию
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    // Создаем метку размера, если указана позиция
    if (labelPosition && typeof labelRenderer !== 'undefined') {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'dimension-label';
        labelDiv.textContent = label;
        
        // Улучшенный стиль для метки размера
        labelDiv.style.backgroundColor = 'rgba(52, 152, 219, 0.9)';
        labelDiv.style.color = '#ffffff';
        labelDiv.style.padding = '3px 8px';
        labelDiv.style.borderRadius = '4px';
        labelDiv.style.fontSize = '11px';
        labelDiv.style.fontWeight = '600';
        labelDiv.style.boxShadow = '0 2px 6px rgba(0, 0, 0, 0.2)';
        labelDiv.style.backdropFilter = 'blur(3px)';
        labelDiv.style.border = '1px solid rgba(255, 255, 255, 0.3)';
        
        const dimensionLabel = new THREE.CSS2DObject(labelDiv);
        dimensionLabel.position.copy(labelPosition);
        scene.add(dimensionLabel);
        dimensionLabels.push(dimensionLabel);
    }
    
    // Добавляем "стрелки" на концах
    addDimensionArrow(start, new THREE.Vector3().subVectors(end, start).normalize());
    addDimensionArrow(end, new THREE.Vector3().subVectors(start, end).normalize());
    
    return line;
}

// Функция для добавления "стрелки" на конце линии размера
function addDimensionArrow(position, direction) {
    // Длина стрелки
    const arrowLength = 10;
    
    // Создаем геометрию стрелки (две линии, образующие "V")
    const v1 = new THREE.Vector3(direction.x, direction.y, direction.z).multiplyScalar(arrowLength);
    // Поворачиваем вектор для создания V-образной стрелки
    const angle = Math.PI / 6; // 30 градусов
    
    // Первая линия стрелки (поворот влево)
    let arrow1 = v1.clone();
    if (Math.abs(direction.y) > 0.9) {
        // Для вертикальных линий поворачиваем по X и Z
        arrow1.applyAxisAngle(new THREE.Vector3(1, 0, 0), angle);
    } else {
        // Для горизонтальных линий поворачиваем по Y
        arrow1.applyAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    }
    
    // Вторая линия стрелки (поворот вправо)
    let arrow2 = v1.clone();
    if (Math.abs(direction.y) > 0.9) {
        // Для вертикальных линий поворачиваем по X и Z в обратную сторону
        arrow2.applyAxisAngle(new THREE.Vector3(0, 0, 1), angle);
    } else {
        // Для горизонтальных линий поворачиваем по Y в обратную сторону
        arrow2.applyAxisAngle(new THREE.Vector3(0, 1, 0), -angle);
    }
    
    // Создаем точки для первой линии стрелки
    const arrow1Geometry = new THREE.BufferGeometry().setFromPoints([
        position,
        new THREE.Vector3().addVectors(position, arrow1)
    ]);
    
    // Создаем точки для второй линии стрелки
    const arrow2Geometry = new THREE.BufferGeometry().setFromPoints([
        position,
        new THREE.Vector3().addVectors(position, arrow2)
    ]);
    
    // Материал для стрелок (красный цвет)
    const arrowMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    
    // Создаем линии стрелок
    const arrow1Line = new THREE.Line(arrow1Geometry, arrowMaterial);
    const arrow2Line = new THREE.Line(arrow2Geometry, arrowMaterial);
    
    // Добавляем стрелки на сцену
    scene.add(arrow1Line);
    scene.add(arrow2Line);
}

// Обработчик клика мыши для выбора секций и паллет
function onMouseClick(event) {
    // Нормализуем координаты мыши
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    // Обновляем Raycaster
    raycaster.setFromCamera(mouse, camera);
    
    // Объединяем все объекты для проверки пересечения
    const sections = Object.values(warehouseObjects).map(obj => obj.mesh);
    const pallets = Object.values(palletObjects).map(obj => obj.mesh);
    const objects = [...sections, ...pallets];
    
    // Находим пересечения
    const intersects = raycaster.intersectObjects(objects);
    
    if (intersects.length > 0) {
        const object = intersects[0].object;
        
        // Ищем, к какой секции или паллете принадлежит объект
        let selectedObject = null;
        
        // Проверяем, является ли объект паллетой
        for (const palletId in palletObjects) {
            if (palletObjects[palletId].mesh === object || palletObjects[palletId].group.children.includes(object)) {
                selectPallet(palletId);
                return;
            }
        }
        
        // Проверяем, является ли объект секцией
        for (const sectionId in warehouseObjects) {
            if (warehouseObjects[sectionId].mesh === object || warehouseObjects[sectionId].wireframe.children.includes(object)) {
                selectSection(sectionId);
                return;
            }
        }
    } else {
        // Если клик не по объекту, сбрасываем выделение
        resetSelections();
    }
}

// Выбор секции с улучшенным выделением 
function selectSection(sectionId) {
    // Сбрасываем предыдущий выбор
    resetSelections();
    
    // Устанавливаем новый выбор
    selectedSection = sectionId;
    
    if (warehouseObjects[sectionId]) {
        // Выделяем объект в 3D
        const mesh = warehouseObjects[sectionId].mesh;
        const wireframe = warehouseObjects[sectionId].wireframe;
        
        // Подсвечиваем секцию, делая её синей
        mesh.material.color.set(0x3498db);
        // Не меняем прозрачность, так как секции теперь непрозрачные
        
        // Делаем каркас более заметным
        if (wireframe) {
            wireframe.material.color.set(0x3498db);
            wireframe.material.opacity = 0.8;
        }
        
        // Обновляем информационную панель
        updateInfoPanel("section", sectionId);
    }
}

// Выбор паллеты с улучшенным выделением
function selectPallet(palletId) {
    // Сбрасываем предыдущие выборы
    resetSelections();
    
    if (palletObjects[palletId]) {
        // Меняем цвет выбранной паллеты
        const palletMesh = palletObjects[palletId].mesh;
        const originalColor = palletMesh.material.color.clone();
        
        // Сохраняем оригинальный цвет
        palletObjects[palletId].originalColor = originalColor;
        
        // Устанавливаем более яркий и заметный цвет
        palletMesh.material.color.set(0xf39c12); // Яркий оранжевый
        palletMesh.material.opacity = 1.0;        // Полная непрозрачность
        
        // Добавляем световое выделение
        const highlightLight = new THREE.PointLight(0xf39c12, 1, 100);
        highlightLight.position.copy(palletMesh.position);
        highlightLight.position.y += 50;
        scene.add(highlightLight);
        
        // Сохраняем ссылку на свет для последующего удаления
        palletObjects[palletId].highlightLight = highlightLight;
        
        // Анимация покачивания
        const startY = palletMesh.position.y;
        const animatePallet = function() {
            const time = Date.now() * 0.001;
            palletMesh.position.y = startY + Math.sin(time * 2) * 2;
            
            if (palletObjects[palletId] && palletObjects[palletId].highlightLight) {
                requestAnimationFrame(animatePallet);
            }
        };
        animatePallet();
        
        // Обновляем информационную панель
        updateInfoPanel("pallet", palletId);
        
        console.log("Выбрана паллета:", palletId);
    }
}

// Сброс всех выделений
function resetSelections() {
    // Сбрасываем выделение секции
    if (selectedSection && warehouseObjects[selectedSection]) {
        const prevMesh = warehouseObjects[selectedSection].mesh;
        const wireframe = warehouseObjects[selectedSection].wireframe;
        
        // Возвращаем исходный цвет (серый) и убираем прозрачность
        prevMesh.material.color.set(warehouseObjects[selectedSection].data.color || "#aaa");
        // Не устанавливаем opacity, так как секции теперь непрозрачные
        
        // Возвращаем каркас к исходному виду
        if (wireframe) {
            wireframe.material.color.set(0x000000);
            wireframe.material.opacity = 0.3;
        }
    }
    
    // Сбрасываем выделение всех паллет
    Object.keys(palletObjects).forEach(id => {
        const palletObj = palletObjects[id];
        
        // Возвращаем оригинальный цвет, если он был сохранен
        if (palletObj.originalColor) {
            palletObj.mesh.material.color.copy(palletObj.originalColor);
            palletObj.mesh.material.opacity = 0.85;
            delete palletObj.originalColor;
        }
        
        // Удаляем подсветку, если она была добавлена
        if (palletObj.highlightLight) {
            scene.remove(palletObj.highlightLight);
            delete palletObj.highlightLight;
        }
        
        // Сбрасываем анимацию покачивания, возвращая на исходную позицию
        if (palletObj.mesh.position.y !== palletObj.data.height/2 + 12) {
            palletObj.mesh.position.y = palletObj.data.height/2 + 12;
        }
    });
    
    selectedSection = null;
}

// Функция для обновления информационной панели
function updateInfoPanel(type, id) {
    const infoPanel = document.getElementById('info-panel');
    const sectionInfo = document.getElementById('section-info');
    
    if (!infoPanel || !sectionInfo) {
        console.error("Элементы информационной панели не найдены");
        return;
    }
    
    // Очищаем предыдущую информацию
    sectionInfo.innerHTML = '';
    
    // Добавляем класс выделения
    infoPanel.classList.add('has-selection');
    
    if (type === 'section' && id) {
        // Получаем информацию о секции
        const sectionData = warehouseData.sectionInfo[id];
        const section = warehouseData.sections.find(s => s.id === id);
        
        if (sectionData) {
            // Создаем структуру информации о секции
            const infoHeader = document.createElement('div');
            infoHeader.className = 'warehouse-info-header';
            
            // ID секции
            const sectionIdElement = document.createElement('div');
            sectionIdElement.className = 'section-id';
            sectionIdElement.textContent = `Секция ${id}`;
            infoHeader.appendChild(sectionIdElement);
            
            // Статус секции
            const statusElement = document.createElement('div');
            statusElement.className = 'section-status';
            statusElement.textContent = sectionData.status || 'Доступно';
            statusElement.style.backgroundColor = 'rgba(25, 118, 210, 0.1)';
            statusElement.style.color = '#1976d2';
            infoHeader.appendChild(statusElement);
            
            sectionInfo.appendChild(infoHeader);
            
            // Основная информация
            const infoContent = document.createElement('div');
            infoContent.className = 'warehouse-info-content';
            
            // Описание
            const descriptionItem = document.createElement('div');
            descriptionItem.className = 'info-item';
            const descriptionLabel = document.createElement('div');
            descriptionLabel.className = 'info-label';
            descriptionLabel.textContent = 'Описание';
            descriptionItem.appendChild(descriptionLabel);
            
            const descriptionValue = document.createElement('div');
            descriptionValue.className = 'info-value';
            descriptionValue.textContent = sectionData.description || 'Нет описания';
            descriptionItem.appendChild(descriptionValue);
            
            infoContent.appendChild(descriptionItem);
            
            // Вместимость
            const capacityItem = document.createElement('div');
            capacityItem.className = 'info-item';
            const capacityLabel = document.createElement('div');
            capacityLabel.className = 'info-label';
            capacityLabel.textContent = 'Макс. вместимость';
            capacityItem.appendChild(capacityLabel);
            
            const capacityValue = document.createElement('div');
            capacityValue.className = 'info-value';
            capacityValue.textContent = sectionData.capacity || 'Не указано';
            capacityItem.appendChild(capacityValue);
            
            infoContent.appendChild(capacityItem);
            
            // Размеры
            if (section) {
                const sizeItem = document.createElement('div');
                sizeItem.className = 'info-item';
                const sizeLabel = document.createElement('div');
                sizeLabel.className = 'info-label';
                sizeLabel.textContent = 'Размеры (см)';
                sizeItem.appendChild(sizeLabel);
                
                const sizeValue = document.createElement('div');
                sizeValue.className = 'info-value';
                sizeValue.textContent = `${section.width}×${section.depth}×${section.height}`;
                sizeItem.appendChild(sizeValue);
                
                infoContent.appendChild(sizeItem);
                
                // Координаты
                const coordItem = document.createElement('div');
                coordItem.className = 'info-item';
                const coordLabel = document.createElement('div');
                coordLabel.className = 'info-label';
                coordLabel.textContent = 'Координаты';
                coordItem.appendChild(coordLabel);
                
                const coordValue = document.createElement('div');
                coordValue.className = 'info-value';
                coordValue.textContent = `x:${section.x}, z:${section.z}`;
                coordItem.appendChild(coordValue);
                
                infoContent.appendChild(coordItem);
            }
            
            sectionInfo.appendChild(infoContent);
        } else {
            sectionInfo.innerHTML = `<p>Информация о секции ${id} отсутствует</p>`;
        }
    } else if (type === 'pallet' && id) {
        // Получаем информацию о паллете
        const pallet = warehouseData.pallets.find(p => p.id === id);
        
        if (pallet) {
            // Создаем заголовок информации о паллете
            const palletInfoHeader = document.createElement('div');
            palletInfoHeader.className = 'pallet-info';
            
            const palletTitle = document.createElement('h4');
            palletTitle.textContent = `Паллета: ${pallet.id}`;
            palletInfoHeader.appendChild(palletTitle);
            
            // Заказ
            const orderInfo = document.createElement('p');
            orderInfo.innerHTML = `<strong>Заказ:</strong> ${pallet.orderNumber}`;
            palletInfoHeader.appendChild(orderInfo);
            
            // Статус
            const statusInfo = document.createElement('p');
            statusInfo.innerHTML = `<strong>Статус:</strong> ${pallet.status}`;
            palletInfoHeader.appendChild(statusInfo);
            
            // Вес
            const weightInfo = document.createElement('p');
            weightInfo.innerHTML = `<strong>Общий вес:</strong> ${pallet.totalWeight} кг`;
            palletInfoHeader.appendChild(weightInfo);
            
            // Размеры
            const sizeInfo = document.createElement('p');
            sizeInfo.innerHTML = `<strong>Размеры:</strong> ${pallet.width}×${pallet.depth}×${pallet.height} см`;
            palletInfoHeader.appendChild(sizeInfo);
            
            // Товары
            if (pallet.items && pallet.items.length > 0) {
                const itemsTitle = document.createElement('p');
                itemsTitle.innerHTML = '<strong>Товары:</strong>';
                palletInfoHeader.appendChild(itemsTitle);
                
                const itemsList = document.createElement('ul');
                itemsList.className = 'items-list';
                
                pallet.items.forEach(item => {
                    const listItem = document.createElement('li');
                    listItem.textContent = `${item.name} - ${item.quantity} шт., ${item.weight} кг`;
                    itemsList.appendChild(listItem);
                });
                
                palletInfoHeader.appendChild(itemsList);
            }
            
            sectionInfo.appendChild(palletInfoHeader);
        } else {
            sectionInfo.innerHTML = `<p>Информация о паллете ${id} отсутствует</p>`;
        }
    } else {
        infoPanel.classList.remove('has-selection');
        sectionInfo.innerHTML = '<p>Выберите секцию или паллету для просмотра информации</p>';
    }
}

// Функция для добавления кнопки управления информационной панелью на мобильных устройствах
function addMobileInfoPanelControls() {
    // Проверяем, используется ли мобильное устройство
    if (window.innerWidth <= 768) {
        const warehouseView = document.getElementById('warehouse-view');
        if (!warehouseView) return;
        
        // Создаем кнопку для мобильных устройств
        const mobileToggleBtn = document.createElement('button');
        mobileToggleBtn.className = 'mobile-toggle-info';
        mobileToggleBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
        mobileToggleBtn.setAttribute('aria-label', 'Показать/скрыть информацию');
        mobileToggleBtn.title = 'Показать/скрыть информацию';
        
        // Добавляем обработчик события для переключения видимости панели
        mobileToggleBtn.addEventListener('click', toggleInfoPanel);
        
        // Добавляем кнопку в DOM
        warehouseView.appendChild(mobileToggleBtn);
    }
    
    // Добавляем обработчик изменения размера окна
    window.addEventListener('resize', function() {
        const warehouseView = document.getElementById('warehouse-view');
        if (!warehouseView) return;
        
        const isMobileNow = window.innerWidth <= 768;
        let mobileToggleBtn = document.querySelector('.mobile-toggle-info');
        
        if (isMobileNow && !mobileToggleBtn) {
            // Если устройство мобильное, но кнопки нет - добавляем
            mobileToggleBtn = document.createElement('button');
            mobileToggleBtn.className = 'mobile-toggle-info';
            mobileToggleBtn.innerHTML = '<i class="fas fa-info-circle"></i>';
            mobileToggleBtn.setAttribute('aria-label', 'Показать/скрыть информацию');
            mobileToggleBtn.title = 'Показать/скрыть информацию';
            
            mobileToggleBtn.addEventListener('click', toggleInfoPanel);
            warehouseView.appendChild(mobileToggleBtn);
        } else if (!isMobileNow && mobileToggleBtn) {
            // Если устройство не мобильное, но кнопка есть - удаляем
            mobileToggleBtn.remove();
        }
    });
}

// Функция для переключения видимости информационной панели
function toggleInfoPanel() {
    const warehouseView = document.querySelector('.warehouse-3d-view');
    const toggleButton = document.querySelector('.toggle-info-panel');
    const mobileToggleButton = document.querySelector('.mobile-toggle-info');
    
    isInfoPanelHidden = !isInfoPanelHidden;
    
    if (isInfoPanelHidden) {
        warehouseView.classList.add('hide-info-panel');
        
        // Обновляем иконки на десктопной и мобильной кнопках
        if (toggleButton) {
            toggleButton.querySelector('i').className = 'fas fa-chevron-right';
        }
        
        if (mobileToggleButton) {
            mobileToggleButton.innerHTML = '<i class="fas fa-info-circle"></i>';
        }
    } else {
        warehouseView.classList.remove('hide-info-panel');
        
        // Обновляем иконки на десктопной и мобильной кнопках
        if (toggleButton) {
            toggleButton.querySelector('i').className = 'fas fa-chevron-left';
        }
        
        if (mobileToggleButton) {
            mobileToggleButton.innerHTML = '<i class="fas fa-times"></i>';
        }
    }
    
    // Обновляем размеры в соответствии с новым состоянием
    setTimeout(onWindowResize, 300);
}

// Функция для переключения показа информационной панели в полноэкранном режиме
function toggleFullscreenInfoPanel() {
    const warehouseView = document.querySelector('.warehouse-3d-view');
    
    if (warehouseView.classList.contains('show-info')) {
        warehouseView.classList.remove('show-info');
        document.querySelector('.toggle-info-button').innerHTML = '<i class="fas fa-info-circle"></i> Показать информацию';
    } else {
        warehouseView.classList.add('show-info');
        document.querySelector('.toggle-info-button').innerHTML = '<i class="fas fa-times"></i> Скрыть информацию';
    }
    
    // Обновляем размеры в соответствии с новым состоянием
    setTimeout(onWindowResize, 300);
}

// Функция для добавления элементов управления информационной панелью
function addInfoPanelControls() {
    // Не добавляем на мобильных устройствах
    if (isMobileDevice) return;
    
    const warehouseView = document.querySelector('.warehouse-3d-view');
    
    // Добавляем кнопку для переключения видимости информационной панели
    const toggleButton = document.createElement('button');
    toggleButton.className = 'toggle-info-panel';
    toggleButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    toggleButton.addEventListener('click', toggleInfoPanel);
    const infoPanel = document.querySelector('.info-panel');
    
    // Добавляем кнопку внутрь информационной панели вместо warehouse-3d-view
    if (infoPanel) {
        infoPanel.appendChild(toggleButton);
    } else {
        // Если панель не найдена, добавим в контейнер (старое поведение)
        warehouseView.appendChild(toggleButton);
    }
}

// Функция для обработки изменения размера окна
function onWindowResize() {
    // Проверяем флаг мобильного устройства
    isMobileDevice = window.innerWidth <= 768;
    
    const warehouseView = document.getElementById('warehouse-view');
    if (!warehouseView) return;
    
    const width = warehouseView.clientWidth;
    const height = warehouseView.clientHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    
    renderer.setSize(width, height);
    
    // Обновляем CSS2D рендерер если он существует
    if (typeof updateLabelRenderer === 'function') {
        updateLabelRenderer();
    }
    
    console.log(`Размер обновлен: ${width}x${height}`);
}

// Инициализация
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, загружен ли уже Three.js
    if (typeof THREE === 'undefined') {
        console.error('Three.js не загружен');
        return;
    }
    
    const warehouseView = document.getElementById('warehouse-view');
    if (!warehouseView) {
        console.error("Элемент #warehouse-view не найден при инициализации");
        return;
    }
    
    try {
        // Инициализируем 3D-сцену
        init();
        
        // Добавляем элементы управления
        addViewButtons();
        
        // Добавляем элементы управления информационной панелью
        addInfoPanelControls();
        
        // Запускаем анимацию
        animate();
        
        // Добавляем элементы управления информационной панелью на мобильных устройствах
        addMobileInfoPanelControls();
        
        console.log('Инициализация 3D-визуализации завершена успешно');
    } catch (e) {
        console.error('Ошибка при инициализации 3D-визуализации:', e);
    }
});

// Анимация
function animate() {
    requestAnimationFrame(animate);
    
    // Обновляем управление камерой
    if (controls) {
        controls.update();
    }
    
    // Рендерим сцену
    if (scene && camera && renderer) {
        renderer.render(scene, camera);
        
        // Обновляем рендерер меток CSS2D
        if (labelRenderer) {
            labelRenderer.render(scene, camera);
        }
    }
    
    // Обновляем анимации TWEEN (если используются)
    if (typeof TWEEN !== 'undefined') {
        TWEEN.update();
    }
}

// Функция добавления блока с инструкциями по навигации - пустая
function addNavigationHelp() {
    // Функция больше не добавляет никаких элементов
    return;
}

// Добавим функцию для обновления цветов сцены в зависимости от темы
function updateSceneColors(isDarkTheme) {
    // Обновляем цвет фона сцены
    if (isDarkTheme) {
        scene.background = new THREE.Color(0x111827); // Темный фон для темной темы
        gridHelper.material.color = new THREE.Color(0x374151); // Темная сетка
        floorMesh.material.color = new THREE.Color(0x1F2937); // Темный пол
    } else {
        scene.background = new THREE.Color(0xf5f5f5); // Светлый фон для светлой темы
        gridHelper.material.color = new THREE.Color(0xdddddd); // Светлая сетка
        floorMesh.material.color = new THREE.Color(0xffffff); // Белый пол
    }
    
    // Обновляем цвета секций и меток
    updateSectionColors(isDarkTheme);
    
    // Перерисовываем сцену
    renderer.render(scene, camera);
}

// Функция для обновления цветов секций
function updateSectionColors(isDarkTheme) {
    sectionObjects.forEach(sectionObj => {
        // Получаем текущий материал секции
        const material = sectionObj.sectionMesh.material;
        
        // Проверяем, выделена ли секция
        const isHighlighted = sectionObj.isHighlighted;
        
        // Устанавливаем соответствующий цвет
        if (isHighlighted) {
            // Цвета для выделенной секции
            material.color.set(isDarkTheme ? 0x4F46E5 : 0x6366F1);
        } else {
            // Цвета для обычной секции
            material.color.set(isDarkTheme ? 0x2D3748 : 0xE0E0E0);
        }
        
        // Обновляем прозрачность и непрозрачность
        material.opacity = isHighlighted ? 0.8 : 0.5;
    });
}

// Добавляем функцию для обновления визуализации на основе настроек
function updateWarehouseVisualization(settings) {
    if (!settings) return;
    
    // Применяем настройки качества визуализации
    updateRenderQuality(settings.quality);
    
    // Обновляем видимость меток
    updateLabelsVisibility(settings.showLabels);
    
    // Обновляем видимость маршрута
    updateRouteVisibility(settings.showRoute);
    
    // Обновляем настройки анимации
    updateRouteAnimation(settings.animateRoute);
    
    // Обновляем цвета в зависимости от темы
    const isDarkTheme = document.body.classList.contains('dark-theme');
    updateSceneColors(isDarkTheme);
}

// Функция для обновления качества рендеринга
function updateRenderQuality(quality) {
    if (!quality) return;
    
    switch (quality) {
        case 'low':
            renderer.setPixelRatio(window.devicePixelRatio * 0.5);
            renderer.setSize(warehouseContainer.clientWidth * 0.8, warehouseContainer.clientHeight * 0.8);
            break;
        case 'medium':
            renderer.setPixelRatio(window.devicePixelRatio * 0.75);
            renderer.setSize(warehouseContainer.clientWidth, warehouseContainer.clientHeight);
            break;
        case 'high':
            renderer.setPixelRatio(window.devicePixelRatio);
            renderer.setSize(warehouseContainer.clientWidth * 1.2, warehouseContainer.clientHeight * 1.2);
            break;
    }
}

// Функция для обновления видимости меток
function updateLabelsVisibility(showLabels) {
    labelRenderer.domElement.style.display = showLabels ? 'block' : 'none';
}

// Функция для обновления видимости маршрута
function updateRouteVisibility(showRoute) {
    if (routePathLine) {
        routePathLine.visible = showRoute;
    }
}

// Функция для обновления анимации маршрута
function updateRouteAnimation(animateRoute) {
    isRouteAnimationEnabled = animateRoute;
}

// Наблюдатель за изменениями темы
const themeObserver = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
            const isDarkTheme = document.body.classList.contains('dark-theme');
            updateSceneColors(isDarkTheme);
        }
    });
});

// Запускаем наблюдатель за изменениями класса body
themeObserver.observe(document.body, { attributes: true });

// Экспортируем функцию обновления визуализации
window.updateWarehouseVisualization = updateWarehouseVisualization; 