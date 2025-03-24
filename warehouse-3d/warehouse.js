// Основные переменные для Three.js
let scene, camera, renderer, controls;
let warehouseObjects = {};
let selectedSection = null;
let raycaster, mouse;
let palletObjects = {};
let dimensionLabels = [];
let textureLoader; // загрузчик текстур
let woodTexture; // текстура дерева для паллет

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
    scene.background = new THREE.Color(0xf0f0f0);

    // Создаем загрузчик текстур
    textureLoader = new THREE.TextureLoader();
    
    // Загружаем текстуру дерева
    try {
        // URL для текстуры дерева
        const woodTextureUrl = 'https://threejs.org/examples/textures/crate.gif';
        woodTexture = textureLoader.load(woodTextureUrl);
        woodTexture.wrapS = THREE.RepeatWrapping;
        woodTexture.wrapT = THREE.RepeatWrapping;
        woodTexture.repeat.set(3, 3);
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

    // Настраиваем рендерер
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerWidth, containerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    warehouseView.innerHTML = ''; // Очищаем контейнер перед добавлением
    warehouseView.appendChild(renderer.domElement);

    // Инициализируем Raycaster для выбора объектов мышью
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    // Добавляем управление камерой (OrbitControls) с улучшенными настройками
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

    // Добавляем подсказку по навигации
    addNavigationHelp();

    // Добавляем освещение
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(warehouseData.dimensions.width, 1000, warehouseData.dimensions.length);
    directionalLight.castShadow = true;
    
    // Настройка теней от directionalLight
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.far = 3000;
    directionalLight.shadow.camera.left = -1500;
    directionalLight.shadow.camera.right = 1500;
    directionalLight.shadow.camera.top = 1500;
    directionalLight.shadow.camera.bottom = -1500;
    scene.add(directionalLight);

    // Включаем тени
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

// Создание пола с более детальной сеткой
function createFloor() {
    // Создаем материал для пола
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xf9f9f9,
        roughness: 0.8,
        metalness: 0.2
    });
    
    // Создаем геометрию пола
    const floorGeometry = new THREE.PlaneGeometry(
        warehouseData.dimensions.width + 400, 
        warehouseData.dimensions.length + 400
    );
    
    // Создаем меш пола
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Поворачиваем пол так, чтобы он был горизонтальным
    floor.position.y = -5; // Немного ниже уровня секций
    floor.position.x = warehouseData.dimensions.width / 2;
    floor.position.z = warehouseData.dimensions.length / 2;
    floor.receiveShadow = true; // Пол получает тени
    scene.add(floor);
    
    // Добавляем основную сетку
    const gridHelper = new THREE.GridHelper(
        Math.max(warehouseData.dimensions.width, warehouseData.dimensions.length) + 400, 
        36, // Количество делений (больше для более детальной сетки)
        0x000000, // Цвет основных линий
        0xcccccc  // Цвет вспомогательных линий
    );
    gridHelper.position.y = -4; // Чуть выше пола
    gridHelper.position.x = warehouseData.dimensions.width / 2;
    gridHelper.position.z = warehouseData.dimensions.length / 2;
    scene.add(gridHelper);
    
    // Добавляем подписи координат по периметру
    addGridLabels();
    
    // Добавляем оси координат
    const axesHelper = new THREE.AxesHelper(200);
    axesHelper.position.y = 5;
    scene.add(axesHelper);
}

// Добавление подписей координат по периметру сетки
function addGridLabels() {
    if (!labelRenderer) return;
    
    const width = warehouseData.dimensions.width;
    const length = warehouseData.dimensions.length;
    
    // Создаем метки координат по оси X (горизонталь)
    for (let x = 0; x <= width; x += 120) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'grid-label';
        labelDiv.textContent = x;
        labelDiv.style.color = '#007bff';
        labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        labelDiv.style.padding = '2px 4px';
        labelDiv.style.borderRadius = '2px';
        
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(x, 10, -50);
        scene.add(label);
    }
    
    // Создаем метки координат по оси Z (вертикаль)
    for (let z = 0; z <= length; z += 80) {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'grid-label';
        labelDiv.textContent = z;
        labelDiv.style.color = '#28a745';
        labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
        labelDiv.style.padding = '2px 4px';
        labelDiv.style.borderRadius = '2px';
        
        const label = new THREE.CSS2DObject(labelDiv);
        label.position.set(-50, 10, z);
        scene.add(label);
    }
}

// Добавление кнопок для предустановленных ракурсов
function addViewButtons() {
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'view-buttons';
    buttonContainer.style.position = 'absolute';
    buttonContainer.style.top = '10px';
    buttonContainer.style.right = '10px';
    buttonContainer.style.zIndex = '1000';
    
    // Кнопка вида сверху
    const topViewBtn = document.createElement('button');
    topViewBtn.textContent = 'Вид сверху';
    topViewBtn.onclick = setTopView;
    topViewBtn.style.marginRight = '5px';
    topViewBtn.style.padding = '5px 10px';
    buttonContainer.appendChild(topViewBtn);
    
    // Кнопка изометрического вида
    const isoViewBtn = document.createElement('button');
    isoViewBtn.textContent = 'Изометрия';
    isoViewBtn.onclick = setIsometricView;
    isoViewBtn.style.padding = '5px 10px';
    buttonContainer.appendChild(isoViewBtn);
    
    document.getElementById('warehouse-view').appendChild(buttonContainer);
}

// Установка вида сверху
function setTopView() {
    if (!camera || !controls) return;
    
    // Плавно перемещаем камеру в позицию сверху
    new TWEEN.Tween(camera.position)
        .to({
            x: warehouseData.dimensions.width / 2,
            y: 2000,
            z: warehouseData.dimensions.length / 2
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    
    // Плавно перемещаем точку фокуса в центр склада
    new TWEEN.Tween(controls.target)
        .to({
            x: warehouseData.dimensions.width / 2,
            y: 0,
            z: warehouseData.dimensions.length / 2
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}

// Установка изометрического вида
function setIsometricView() {
    if (!camera || !controls) return;
    
    // Плавно перемещаем камеру в изометрическую позицию
    new TWEEN.Tween(camera.position)
        .to({
            x: warehouseData.dimensions.width + 500,
            y: 1000,
            z: warehouseData.dimensions.length + 500
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
    
    // Плавно перемещаем точку фокуса в центр склада
    new TWEEN.Tween(controls.target)
        .to({
            x: warehouseData.dimensions.width / 2,
            y: 0,
            z: warehouseData.dimensions.length / 2
        }, 1000)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
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
            labelDiv.style.position = 'absolute';
            labelDiv.style.fontSize = '14px';
            labelDiv.style.fontWeight = 'bold';
            labelDiv.style.color = '#000';
            labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
            labelDiv.style.padding = '2px 5px';
            labelDiv.style.borderRadius = '3px';
            labelDiv.style.userSelect = 'none';
            labelDiv.style.pointerEvents = 'none';
            
            const label = new THREE.CSS2DObject(labelDiv);
            label.position.set(
                section.x + section.width / 2,
                10,
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
        
        // Создаем материал секции
        const material = new THREE.MeshStandardMaterial({
            color: section.color,
            transparent: true,
            opacity: 0.5
        });
        
        // Создаем mesh (объект)
        const mesh = new THREE.Mesh(geometry, material);
        
        // Устанавливаем позицию
        mesh.position.set(
            section.x + section.width / 2,
            section.y + section.height / 2,
            section.z + section.depth / 2
        );
        
        // Добавляем тень
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        
        // Добавляем в сцену
        scene.add(mesh);
        
        // Сохраняем ссылку на объект
        warehouseObjects[section.id] = {
            mesh: mesh,
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

    // Создаем геометрию для деревянного основания паллеты (поддона)
    const baseGeometry = new THREE.BoxGeometry(1, 0.1, 1); // Стандартный размер, который будет масштабирован
    
    // Материал для деревянного основания (с текстурой или без)
    const baseMaterial = woodTexture 
        ? new THREE.MeshStandardMaterial({ 
            map: woodTexture, 
            roughness: 0.8,
            metalness: 0.2
        })
        : new THREE.MeshStandardMaterial({ 
            color: 0x8B4513, // коричневый цвет дерева
            roughness: 0.8,
            metalness: 0.2
        });
    
    // Материал для верхней части паллеты (груз)
    const palletMaterial = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.85,
        roughness: 0.5,
        metalness: 0.3
    });
    
    // Создание паллет в соответствии с данными
    warehouseData.pallets.forEach(pallet => {
        // Создаем группу для паллеты (основание + груз)
        const palletGroup = new THREE.Group();
        
        // Создаем деревянное основание (поддон)
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        // Масштабируем основание по размерам паллеты
        base.scale.set(pallet.width, 1, pallet.depth);
        // Позиционируем основание на уровне пола
        base.position.y = 5; // немного выше пола
        base.castShadow = true;
        base.receiveShadow = true;
        
        // Добавляем основание в группу
        palletGroup.add(base);
        
        // Создаем верхнюю часть паллеты (груз)
        const palletGeometry = new THREE.BoxGeometry(pallet.width, pallet.height, pallet.depth);
        const material = palletMaterial.clone();
        material.color.set(pallet.color || "#3498db"); // используем цвет из данных или синий по умолчанию
        
        const palletMesh = new THREE.Mesh(palletGeometry, material);
        // Позиционируем верхнюю часть над основанием
        palletMesh.position.y = pallet.height/2 + 10; // половина высоты + высота основания
        palletMesh.castShadow = true;
        palletMesh.receiveShadow = true;
        
        // Добавляем верхнюю часть в группу
        palletGroup.add(palletMesh);
        
        // Позиционируем группу в соответствии с координатами
        palletGroup.position.set(pallet.x, 0, pallet.z);
        
        // Добавляем группу на сцену
        scene.add(palletGroup);
        
        // Сохраняем объект для дальнейшего взаимодействия
        palletObjects[pallet.id] = {
            group: palletGroup,
            mesh: palletMesh,
            base: base,
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
    
    // Создаем элемент для метки
    const labelDiv = document.createElement('div');
    labelDiv.className = 'pallet-label';
    labelDiv.textContent = pallet.id;
    labelDiv.style.padding = '3px 6px';
    labelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    labelDiv.style.border = '1px solid ' + pallet.color;
    labelDiv.style.borderRadius = '3px';
    labelDiv.style.color = '#333';
    labelDiv.style.fontSize = '12px';
    labelDiv.style.fontWeight = 'bold';
    
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
    
    // Материал для линии (красный цвет)
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 2 });
    
    // Создаем линию
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
    
    // Создаем метку размера, если указана позиция
    if (labelPosition && typeof labelRenderer !== 'undefined') {
        const labelDiv = document.createElement('div');
        labelDiv.className = 'dimension-label';
        labelDiv.textContent = label;
        
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
            if (palletObjects[palletId].mesh === object || palletObjects[palletId].base === object) {
                selectPallet(palletId);
                return;
            }
        }
        
        // Проверяем, является ли объект секцией
        for (const sectionId in warehouseObjects) {
            if (warehouseObjects[sectionId].mesh === object) {
                selectSection(sectionId);
                return;
            }
        }
    } else {
        // Если клик не по объекту, сбрасываем выделение
        resetSelections();
    }
}

// Выбор секции
function selectSection(sectionId) {
    // Сбрасываем предыдущий выбор
    resetSelections();
    
    // Устанавливаем новый выбор
    selectedSection = sectionId;
    
    if (warehouseObjects[sectionId]) {
        // Выделяем объект в 3D
        const mesh = warehouseObjects[sectionId].mesh;
        mesh.material.color.set(0x1976d2);
        mesh.material.opacity = 0.8;
        
        // Получаем позицию объекта
        const position = mesh.position.clone();
        
        // Плавное перемещение камеры к выбранной секции
        new TWEEN.Tween(camera.position)
            .to({
                x: position.x + 200,
                y: 300,
                z: position.z + 200
            }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
        
        // Перемещаем цель камеры на выбранную секцию
        new TWEEN.Tween(controls.target)
            .to({
                x: position.x,
                y: position.y,
                z: position.z
            }, 1000)
            .easing(TWEEN.Easing.Cubic.Out)
            .start();
        
        // Обновляем информационную панель
        updateInfoPanel("section", sectionId);
    }
}

// Выбор паллеты
function selectPallet(palletId) {
    // Сбрасываем предыдущие выборы
    resetSelections();
    
    if (palletObjects[palletId]) {
        // Меняем материал выбранной паллеты
        const originalMaterial = palletObjects[palletId].mesh.material;
        const selectedMaterial = originalMaterial.clone();
        selectedMaterial.emissive.set(0x333333); // Добавляем свечение
        selectedMaterial.emissiveIntensity = 0.5;
        selectedMaterial.needsUpdate = true;
        
        // Сохраняем исходный материал
        palletObjects[palletId].originalMaterial = originalMaterial;
        // Устанавливаем новый материал
        palletObjects[palletId].mesh.material = selectedMaterial;
        
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
        prevMesh.material.color.set(warehouseObjects[selectedSection].data.color);
        prevMesh.material.opacity = 0.5;
    }
    
    // Сбрасываем выделение всех паллет
    Object.keys(palletObjects).forEach(id => {
        const palletMesh = palletObjects[id].mesh;
        palletMesh.material.emissive.set(0x000000);
        palletMesh.material.opacity = 0.8;
    });
    
    selectedSection = null;
}

// Обновление информационной панели с деталями о выбранном объекте
function updateInfoPanel(type, id) {
    const infoPanel = document.getElementById('section-info');
    if (!infoPanel) return;
    
    let html = '';
    
    if (type === "section" && warehouseObjects[id]) {
        const section = warehouseObjects[id].data;
        const sectionInfo = warehouseData.sectionInfo && warehouseData.sectionInfo[id] 
            ? warehouseData.sectionInfo[id] 
            : { description: "Информация отсутствует", capacity: "Не указано", status: "Не указано" };
        
        html = `
            <h4>Секция ${id}</h4>
            <p><strong>Описание:</strong> ${sectionInfo.description}</p>
            <p><strong>Размеры:</strong> ${section.width} x ${section.height} x ${section.depth} см</p>
            <p><strong>Вместимость:</strong> ${sectionInfo.capacity}</p>
            <p><strong>Статус:</strong> ${sectionInfo.status}</p>
        `;
    } else if (type === "pallet" && palletObjects[id]) {
        const pallet = palletObjects[id].data;
        
        html = `
            <div class="pallet-info">
                <h4>Паллета ${id}</h4>
                <p><strong>Размеры:</strong> ${pallet.width} x ${pallet.height} x ${pallet.depth} см</p>
                <p><strong>Заказ:</strong> ${pallet.orderNumber || 'Не указан'}</p>
                <p><strong>Статус:</strong> ${pallet.status || 'Не указан'}</p>
                <p><strong>Вес:</strong> ${pallet.totalWeight || 0} кг</p>
            `;
        
        if (pallet.items && pallet.items.length > 0) {
            html += `<p><strong>Содержимое:</strong></p>
            <ul class="items-list">`;
            
            pallet.items.forEach(item => {
                html += `<li>${item.name} - ${item.quantity} шт. (${item.weight * item.quantity} кг)</li>`;
            });
            
            html += `</ul>`;
        }
        
        html += `</div>`;
    } else {
        html = `<p>Выберите секцию или паллету для просмотра информации</p>`;
    }
    
    infoPanel.innerHTML = html;
}

// Добавление подсказки по навигации
function addNavigationHelp() {
    const helpContainer = document.createElement('div');
    helpContainer.className = 'navigation-help';
    
    helpContainer.innerHTML = `
        <h4>Управление камерой:</h4>
        <ul>
            <li><strong>Вращение:</strong> Зажмите левую кнопку мыши и двигайте</li>
            <li><strong>Перемещение:</strong> Зажмите правую кнопку мыши и двигайте</li>
            <li><strong>Масштаб:</strong> Прокрутите колесико мыши</li>
        </ul>
    `;
    
    document.getElementById('warehouse-view').appendChild(helpContainer);
}

// Обработчик изменения размера окна
function onWindowResize() {
    const warehouseView = document.getElementById('warehouse-view');
    if (!warehouseView) return;
    
    const containerWidth = warehouseView.clientWidth;
    const containerHeight = warehouseView.clientHeight;
    
    if (camera) {
        camera.aspect = containerWidth / containerHeight;
        camera.updateProjectionMatrix();
    }
    
    if (renderer) {
        renderer.setSize(containerWidth, containerHeight);
    }
    
    // Обновляем размер CSS2D рендерера
    if (labelRenderer) {
        labelRenderer.setSize(containerWidth, containerHeight);
    }
}

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

// Исключаем автоматическую инициализацию при загрузке страницы
// window.addEventListener('load', init); 