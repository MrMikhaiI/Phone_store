document.addEventListener('DOMContentLoaded', function() {
    // ========== АВТОРИЗАЦИЯ ==========
    const authSystem = {
        currentUser: null,
        
        init: function() {
            this.loadUser();
            this.setupAuthUI();
            this.setupLoginForm();
        },
        
        loadUser: function() {
            const userData = sessionStorage.getItem('user');
            if (userData) {
                this.currentUser = JSON.parse(userData);
            }
        },
        
        setupAuthUI: function() {
            const loginLinks = document.querySelectorAll('.login-link');
            const userAvatars = document.querySelectorAll('.user-avatar');
            
            if (this.currentUser) {
                // Пользователь авторизован
                loginLinks.forEach(link => link.style.display = 'none');
                userAvatars.forEach(avatar => {
                    avatar.style.display = 'flex';
                    const usernameDisplay = avatar.querySelector('.username-display');
                    if (usernameDisplay) {
                        usernameDisplay.textContent = this.currentUser.username;
                    }
                });
            } else {
                // Пользователь не авторизован
                loginLinks.forEach(link => link.style.display = 'block');
                userAvatars.forEach(avatar => avatar.style.display = 'none');
            }
        },
        
        setupLoginForm: function() {
            const loginForm = document.getElementById('login-form');
            if (!loginForm) return;
            
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const username = document.getElementById('login-username').value;
                const password = document.getElementById('login-password').value;
                
                // Простая проверка (в реальном проекте - запрос к серверу)
                if (username && password) {
                    this.login({
                        username: username,
                        email: `${username}@example.com`, // для примера
                        token: 'fake-jwt-token' // в реальном проекте получите с сервера
                    });
                } else {
                    alert('Пожалуйста, заполните все поля');
                }
            });
        },
        
        login: function(userData) {
            this.currentUser = userData;
            sessionStorage.setItem('user', JSON.stringify(userData));
            this.setupAuthUI();
            
            // Перенаправляем на главную после входа
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 500);
        },
        
        logout: function() {
            this.currentUser = null;
            sessionStorage.removeItem('user');
            this.setupAuthUI();
            window.location.href = 'index.html';
        }
    };

    // Инициализируем систему авторизации
    authSystem.init();

    // Добавляем кнопку выхода (если есть)
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', () => authSystem.logout());
    });

    // ========== КОРЗИНА ==========
    const cartSystem = {
        init: function() {
            this.updateCartCounter();
            this.setupCartListeners();
        },
        
        getCart: function() {
            return JSON.parse(sessionStorage.getItem('cart')) || [];
        },
        
        updateCartCounter: function() {
            const cart = this.getCart();
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            
            document.querySelectorAll('.cart-icon span').forEach(span => {
                span.textContent = totalItems;
                span.style.display = totalItems > 0 ? 'inline-block' : 'none';
            });
        },

        applyPromoCode: function() {
            const promoCodeInput = document.getElementById('promo-code');
            if (!promoCodeInput) return;
        
            const promoCode = promoCodeInput.value.trim();
            const cart = this.getCart();
            let totalPrice = cart.reduce((sum, item) => {
                return sum + (parseFloat(item.price.replace(/[^\d.]/g, '')) * item.quantity);
            }, 0);
        
            if (promoCode === 'Промокод10' && totalPrice > 0) {
                totalPrice = totalPrice * 0.9; // 10% скидка
                document.querySelector('.total-price').textContent = `Итого: ${totalPrice.toLocaleString()} ₽ (скидка 10%)`;
                alert('Промокод применён! Скидка 10%');
            } else if (promoCode && totalPrice > 0) {
                alert('Промокод недействителен');
            }
        },
        
        setupCartListeners: function() {
            // Обработчики для страницы корзины
            if (window.location.pathname.includes('cart.html')) {
                this.updateCartView();
                document.getElementById('promo-code')?.addEventListener('change', () => this.applyPromoCode());
                document.querySelector('.cart-items')?.addEventListener('change', (e) => {
                    if (e.target.matches('input[type="number"]')) {
                        this.updateItemQuantity(
                            e.target.dataset.id, 
                            parseInt(e.target.value)
                        );
                    }
                });

                document.querySelector('.cart-items')?.addEventListener('click', (e) => {
                    if (e.target.closest('.remove-item')) {
                        this.removeItem(e.target.closest('.remove-item').dataset.id);
                    }
                });

                document.querySelector('.checkout-button')?.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.checkout();
                });
            }
        },
        
        updateCartView: function() {
            const cart = this.getCart();
            const cartItemsContainer = document.querySelector('.cart-items');
            const emptyCartMessage = document.querySelector('.empty-cart-message');
            const totalPriceElement = document.querySelector('.total-price');
            
            cartItemsContainer.innerHTML = '';
            let totalPrice = 0;

            if (cart.length === 0) {
                if (emptyCartMessage) emptyCartMessage.style.display = 'block';
                if (totalPriceElement) totalPriceElement.textContent = 'Итого: 0 ₽';
                return;
            } else {
                if (emptyCartMessage) emptyCartMessage.style.display = 'none';
            }

            cart.forEach(item => {
                const itemPrice = parseFloat(item.price.replace(/[^\d.]/g, ''));
                totalPrice += itemPrice * item.quantity;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <img src="${item.image}" alt="${item.title}">
                    <div class="item-details">
                        <h3>${item.title}</h3>
                        <p class="price">${item.price}</p>
                        <div class="quantity">
                            <label>Количество:</label>
                            <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fa fa-trash"></i>
                    </button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });

            if (totalPriceElement) {
                totalPriceElement.textContent = `Итого: ${Math.round(totalPrice).toLocaleString()} ₽`;
            }
        },
        
        updateItemQuantity: function(itemId, newQuantity) {
            const cart = this.getCart();
            const item = cart.find(i => i.id === itemId);
            
            if (item) {
                item.quantity = newQuantity;
                sessionStorage.setItem('cart', JSON.stringify(cart));
                this.updateCartView();
                this.updateCartCounter();
            }
        },
        
        removeItem: function(itemId) {
            let cart = this.getCart();
            cart = cart.filter(item => item.id !== itemId);
            sessionStorage.setItem('cart', JSON.stringify(cart));
            this.updateCartView();
            this.updateCartCounter();
        },
        
        checkout: function() {
            const cart = this.getCart();
            const address = document.getElementById('address')?.value.trim();
        
            if (cart.length === 0) {
                alert('Корзина пуста!');
                return;
            }
        
            if (!address && document.getElementById('delivery-method').value !== 'pickup') {
                alert('Укажите адрес доставки!');
                return;
            }
            
            document.getElementById('confirmationMessage').style.display = 'block';
            sessionStorage.removeItem('cart');
            this.updateCartCounter();
            
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        }
    };


    // Инициализируем систему корзины
    cartSystem.init();

    // ========== ФИЛЬТРАЦИЯ ТОВАРОВ ==========
    const filterSystem = {
        init: function() {
            const brandFilter = document.getElementById('brand-filter');
            const priceFilter = document.getElementById('price-filter');
            
            if (brandFilter && priceFilter) {
                brandFilter.addEventListener('change', () => this.filterProducts());
                priceFilter.addEventListener('change', () => this.filterProducts());
            }
        },
        
        filterProducts: function() {
            const selectedBrand = document.getElementById('brand-filter')?.value;
            const selectedPriceRange = document.getElementById('price-filter')?.value;
            const productItems = document.querySelectorAll('.product-item');

            productItems.forEach(item => {
                const brand = item.dataset.brand;
                const price = parseFloat(item.querySelector('.price').textContent.replace(/[^\d.]/g, ''));

                let brandMatch = !selectedBrand || selectedBrand === '' || brand === selectedBrand;
                let priceMatch = true;

                if (selectedPriceRange && selectedPriceRange !== '') {
                    const [minPrice, maxPrice] = selectedPriceRange.split('-');
                    if (maxPrice === undefined) {
                        priceMatch = price >= parseFloat(minPrice);
                    } else {
                        priceMatch = price >= parseFloat(minPrice) && price <= parseFloat(maxPrice);
                    }
                }

                item.style.display = brandMatch && priceMatch ? 'block' : 'none';
            });
        }
    };

    // Инициализируем систему фильтрации
    filterSystem.init();


// ========== ПОИСК ПО САЙТУ ==========
const searchSystem = {
    init: function() {
      const searchInput = document.querySelector('.search-bar input');
      const searchButton = document.querySelector('.search-bar button');
  
      if (searchInput && searchButton) {
        searchButton.addEventListener('click', (e) => {
          e.preventDefault();
          this.searchProducts(searchInput.value.trim());
        });
  
        searchInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.searchProducts(searchInput.value.trim());
          }
        });
      }
    },
  
    searchProducts: function(query) {
      if (!query) {
        alert('Введите поисковый запрос');
        return;
      }
  
      // Переход на страницу каталога с параметром поиска
      window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
    }
  };
  
  // Инициализация при загрузке страницы
  searchSystem.init();
});

