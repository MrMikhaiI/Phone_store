document.addEventListener('DOMContentLoaded', function() {
    // Проверка авторизации (как в основном скрипте)
    const isLoggedIn = sessionStorage.getItem('loggedIn') === 'true';
    const loginLink = document.getElementById('login-link');
    const userAvatar = document.getElementById('user-avatar');
    const usernameDisplay = document.getElementById('username-display');

    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (userAvatar) {
            userAvatar.style.display = 'flex';
            if (usernameDisplay) {
                usernameDisplay.textContent = sessionStorage.getItem('username');
            }
        }
    }

    // Получаем ID продукта из URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Данные продуктов (в реальном проекте это будет запрос к серверу)
    const products = {
        'iphone-16e': {
            id: 'iphone-16e',
            title: 'iPhone 16e',
            brand: 'Apple',
            code: 'APL-16E-2025',
            price: '55 000 ₽',
            images: [
                'images/Снимок экрана 2025-04-12 в 13.02-fotor-bg-remover-2025061312404.png',
                'images/iphone-16e-2.jpg',
                'images/iphone-16e-3.jpg'
            ],
            description: 'iPhone 16e - это новейшая модель в линейке Apple, сочетающая в себе передовые технологии и доступную цену. Стильный дизайн, мощный процессор и улучшенная камера делают этот смартфон отличным выбором для повседневного использования.',
            specs: {
                'Экран': '6.1" Super Retina XDR, 2532×1170 пикселей',
                'Процессор': 'A16 Bionic',
                'Память': '128 ГБ',
                'Оперативная память': '6 ГБ',
                'Камера': 'Двойная основная камера 12 МП + 12 МП, фронтальная 12 МП',
                'Аккумулятор': 'До 20 часов видео',
                'Операционная система': 'iOS 18',
                'Габариты': '146.7 × 71.5 × 7.4 мм',
                'Вес': '172 г'
            }
        },
        'samsung-s25-ultra': {
            id: 'samsung-s25-ultra',
            title: 'Samsung Galaxy S25 Ultra',
            brand: 'Samsung',
            code: 'SSG-S25U-2025',
            price: '90 000 ₽',
            images: [
                'images/Снимок экрана 2025-05-10 в 16.29.47.png',
                'images/samsung-s25-ultra-2.jpg',
                'images/samsung-s25-ultra-3.jpg'
            ],
            description: 'Samsung Galaxy S25 Ultra - флагманский смартфон с инновационным дисплеем, мощнейшим процессором и профессиональной камерной системой. Идеальный выбор для тех, кто ценит технологии и производительность.',
            specs: {
                'Экран': '6.8" Dynamic AMOLED 2X, 3088×1440 пикселей, 120 Гц',
                'Процессор': 'Exynos 2400 / Snapdragon 8 Gen 4',
                'Память': '256/512 ГБ / 1 ТБ',
                'Оперативная память': '12/16 ГБ',
                'Камера': 'Четырехкамерная система: 200 МП (основная) + 50 МП (телефото) + 12 МП (ультраширокая) + 10 МП (перископ)',
                'Аккумулятор': '5000 мАч, быстрая зарядка 45 Вт',
                'Операционная система': 'Android 15 с One UI 7',
                'Габариты': '163.4 × 78.1 × 8.9 мм',
                'Вес': '228 г'
            }
        },
        'xiaomi-redmi-note-14': {
            id: 'xiaomi-redmi-note-14',
            title: 'Xiaomi Redmi Note 14',
            brand: 'Xiaomi',
            code: 'XMI-RN14-2025',
            price: '15 000 ₽',
            images: [
                'images/Снимок экрана 2025-04-12 в 13.24.png',
                'images/xiaomi-redmi-note-14-2.jpg',
                'images/xiaomi-redmi-note-14-3.jpg'
            ],
            description: 'Xiaomi Redmi Note 14 - отличный бюджетный смартфон с хорошей камерой, большим экраном и емким аккумулятором. Отличное соотношение цены и качества.',
            specs: {
                'Экран': '6.6" IPS, 2400×1080 пикселей, 90 Гц',
                'Процессор': 'MediaTek Dimensity 8100',
                'Память': '64/128 ГБ',
                'Оперативная память': '4/6 ГБ',
                'Камера': 'Основная камера 50 МП + 8 МП (ультраширокая), фронтальная 13 МП',
                'Аккумулятор': '5000 мАч, быстрая зарядка 33 Вт',
                'Операционная система': 'Android 14 с MIUI 15',
                'Габариты': '163.9 × 76.2 × 8.3 мм',
                'Вес': '190 г'
            }
        },
        'xiaomi-15-ultra': {
            id: 'xiaomi-15-ultra',
            title: 'Xiaomi 15 Ultra',
            brand: 'Xiaomi',
            code: 'XMI-15U-2025',
            price: '105 000 ₽',
            images: [
                'images/xiaomi15_ultra.png',
                'images/xiaomi-15-ultra-2.jpg',
                'images/xiaomi-15-ultra-3.jpg'
            ],
            description: 'Xiaomi 15 Ultra - топовый флагман с лучшей камерой на рынке, самым мощным процессором и инновационными технологиями. Для тех, кто хочет самое лучшее.',
            specs: {
                'Экран': '6.73" AMOLED, 3200×1440 пикселей, 120 Гц LTPO',
                'Процессор': 'Snapdragon 8 Gen 4',
                'Память': '256/512 ГБ / 1 ТБ',
                'Оперативная память': '12/16 ГБ',
                'Камера': 'Тройная камера Leica: 50 МП (основная) + 50 МП (ультраширокая) + 50 МП (перископ)',
                'Аккумулятор': '4860 мАч, быстрая зарядка 120 Вт',
                'Операционная система': 'Android 15 с HyperOS',
                'Габариты': '163.2 × 74.6 × 9.5 мм',
                'Вес': '225 г'
            }
        }
    };

    const product = products[productId];
    if (!product) {
        window.location.href = 'catalog.html';
        return;
    }

    document.title = `${product.title} - Binary Bloom`;
    document.getElementById('product-title').textContent = product.title;
    document.getElementById('product-brand').textContent = product.brand;
    document.getElementById('product-code').textContent = product.code;
    document.getElementById('product-price').textContent = product.price;
    document.getElementById('product-description').innerHTML = `<p>${product.description}</p>`;

    const mainImage = document.getElementById('main-product-image');
    mainImage.src = product.images[0];
    mainImage.alt = product.title;

    const thumbnailsContainer = document.querySelector('.thumbnail-images');
    product.images.forEach((img, index) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        thumb.alt = `${product.title} - фото ${index + 1}`;
        thumb.addEventListener('click', () => {
            mainImage.src = img;
        });
        thumbnailsContainer.appendChild(thumb);
    });

    const specsTable = document.querySelector('.specs-table');
    for (const [key, value] of Object.entries(product.specs)) {
        const row = document.createElement('tr');
        row.innerHTML = `<th>${key}</th><td>${value}</td>`;
        specsTable.appendChild(row);
    }

    const minusBtn = document.querySelector('.quantity-btn.minus');
    const plusBtn = document.querySelector('.quantity-btn.plus');
    const quantityInput = document.querySelector('.quantity-input');

    minusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = value - 1;
        }
    });

    plusBtn.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    const addToCartBtn = document.querySelector('.add-to-cart');
    addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.images[0],
            quantity: quantity
        });
    }
    
    sessionStorage.setItem('cart', JSON.stringify(cart));
    
    // Обновляем счетчик на всех страницах
    document.querySelectorAll('.cart-icon span').forEach(span => {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        span.textContent = totalItems;
        span.style.display = totalItems > 0 ? 'inline-block' : 'none';
    });
    
    alert(`Товар "${product.title}" (${quantity} шт.) добавлен в корзину!`);
});

function updateCartCounter() {
    const cart = JSON.parse(sessionStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-icon span').forEach(span => {
        span.textContent = totalItems;
    });
}

// Обновляем счетчик при загрузке страницы
updateCartCounter();

    // Переключение табов
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
});

// Фильтрация товаров при поиске
if (window.location.pathname.includes('catalog.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
  
    if (searchQuery) {
      document.getElementById('search-query').textContent = searchQuery;
      document.querySelector('.search-results').style.display = 'block';
  
      document.getElementById('clear-search').addEventListener('click', () => {
        window.location.href = 'catalog.html';
      });
  
      const productItems = document.querySelectorAll('.product-item');
      productItems.forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchQuery.toLowerCase())) {
          item.style.display = 'block';
          item.style.border = '2px solid #007bff'; // Подсветка найденного
        } else {
          item.style.display = 'none';
        }
      });
    }
}