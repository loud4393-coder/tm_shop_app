// @ts-nocheck
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

let currentLang = 'ru';
let currentView = 'catalog'; // 'catalog', 'favorites', 'product', 'cart'
let activeCategory = 'all';
let cart = {}; 
let favorites = new Set();
let activeShippingType = 'pickup'; // 'pickup', 'city', 'intercity'
let selectedVelayat = 'ahal';
let activeProduct = null;
let selectedSize = '';
let selectedColor = null;
let savedScrollPosition = 0;

const i18n = {
    ru: {
        titleCatalog: "Каталог одежды",
        titleFavorites: "Избранные товары",
        titleCart: "Корзина и оформление",
        titleSidebarCat: "Категории",
        emptyFavorites: "У вас пока нет избранных товаров",
        emptyCart: "Ваша корзина пуста",
        labelPhone: "Номер телефона (для связи)",
        labelShipping: "Способ доставки",
        optPickup: "Самовывоз (0 TMT)",
        optCity: "По городу (Такси - 20 TMT)",
        optIntercity: "Межгород (в зависимости от города)",
        pickupInfo: "Пункт выдачи: г. Ашхабад, ТРЦ «Беркарар», 2-й этаж",
        addressLabel: "Адрес доставки (улица, дом, квартира)",
        addressPlaceholder: "ул. Магтымгулы, д. 15, кв. 4",
        velayatLabel: "Выберите велаят",
        etrapLabel: "Введите город / этрап",
        etrapPlaceholder: "г. Туркменбаши / этрап Этрек",
        velayats: {
            ahal: "Ахалский",
            balkan: "Балканский",
            dashoguz: "Дашогузский",
            lebap: "Лебапский",
            mary: "Марыйский"
        },
        categories: {
            all: "Все товары",
            hoodie: "Худи и свитшоты",
            jeans: "Джинсы",
            tshirt: "Футболки",
            jacket: "Куртки"
        },
        labelSubtotal: "Товары:",
        labelDelivery: "Доставка:",
        labelTotal: "Итого:",
        btnAdd: "Подробнее",
        btnAddCart: "Добавить в корзину",
        btnBack: "← Назад",
        btnGoCatalog: "Перейти в каталог",
        mainBtnOrder: "Оформить заказ • ",
        phoneError: "Введите корректный номер (+993...)",
        addressError: "Заполните адрес доставки",
        etrapError: "Введите город или этрап",
        currency: "TMT",
        selectSize: "Выберите размер",
        selectColor: "Выберите цвет",
        descriptionTitle: "Описание товара",
        deliveryVariable: "В зависимости от города"
    },
    tk: {
        titleCatalog: "Eşik katalogysy",
        titleFavorites: "Saýlanan harytlar",
        titleCart: "Sebet we resmileşdirmek",
        titleSidebarCat: "Kategoriýalar",
        emptyFavorites: "Sizde entek saýlanan haryt ýok",
        emptyCart: "Sebediňiz boş",
        labelPhone: "Telefon belgisi (habarlaşmak üçin)",
        labelShipping: "Eltip bermek görnüşi",
        optPickup: "Özüň alyp gitmek (0 TMT)",
        optCity: "Şäher içi (Taksi - 20 TMT)",
        optIntercity: "Welaýatara (şähere baglylykda)",
        pickupInfo: "Alyp gitmeli ýerimiz: Aşgabat ş., «Berkarar» SOW, 2-nji gat",
        addressLabel: "Eltip bermeli salgy (köçe, jaý, öý)",
        addressPlaceholder: "Magtymguly köç., 15 jaý, 4 öý",
        velayatLabel: "Welaýaty saýlaň",
        etrapLabel: "Şäher / etrap giriziň",
        etrapPlaceholder: "Türkmenbaşy ş. / Etrek etr.",
        velayats: {
            ahal: "Ahal welaýaty",
            balkan: "Balkan welaýaty",
            dashoguz: "Daşoguz welaýaty",
            lebap: "Lebap welaýaty",
            mary: "Mary welaýaty"
        },
        categories: {
            all: "Ähli harytlar",
            hoodie: "Hudiler",
            jeans: "Jinsiler",
            tshirt: "Futbolkalar",
            jacket: "Kurtkalar"
        },
        labelSubtotal: "Harytlar:",
        labelDelivery: "Eltip bermek:",
        labelTotal: "Jemi:",
        btnAdd: "Giňişleýin",
        btnAddCart: "Sebede goşmak",
        btnBack: "← Yza",
        btnGoCatalog: "Katalog geçmek",
        mainBtnOrder: "Sargyt etmek • ",
        phoneError: "Dogry telefon belgisini giriziň (+993...)",
        addressError: "Eltip bermeli salgyny giriziň",
        etrapError: "Şäheri ýa-da etraby görkeziň",
        currency: "TMT",
        selectSize: "Ölçegi saýlaň",
        selectColor: "Rengi saýlaň",
        descriptionTitle: "Haryt barada giňişleýin",
        deliveryVariable: "Şähere baglylykda"
    }
};

const products = [
    { 
        id: 1, 
        category: 'hoodie',
        name_ru: "Мужская худи Oversize", 
        name_tk: "Erkek Oversize hudi", 
        price: 350, 
        desc_ru: "Стильная худи свободного кроя из плотного хлопкового футера. Отлично сохраняет форму и подходит для повседневного стиля.",
        desc_tk: "Ýokary hilli pagta matasyndan dikilen rahat we modern giň biçüwli hudi. Gündelik geýmek üçin örän amatly.",
        images: [
            "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600",
            "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600",
            "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=600"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { id: "black", ru: "Черный", tk: "Gara", hex: "#1A1A1A" },
            { id: "grey", ru: "Серый", tk: "Çal", hex: "#808080" },
            { id: "beige", ru: "Бежевый", tk: "Bežewyy", hex: "#F5F5DC" }
        ]
    },
    { 
        id: 2, 
        category: 'jeans',
        name_ru: "Джинсы Classic Fit", 
        name_tk: "Klassik Fit jinsi", 
        price: 280, 
        desc_ru: "Классические мужские джинсы прямого кроя из качественного денима.",
        desc_tk: "Ýokary hilli denim matasyndan dikilen klassik göni biçüwli erkek jinsisi.",
        images: [
            "https://images.unsplash.com/photo-1542272604-780c36856842?w=600",
            "https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600"
        ],
        sizes: ["M", "L", "XL"],
        colors: [
            { id: "blue", ru: "Синий", tk: "Gök", hex: "#1D4ED8" },
            { id: "darkblue", ru: "Темно-синий", tk: "Gara-gök", hex: "#1E3A8A" }
        ]
    },
    { 
        id: 3, 
        category: 'tshirt',
        name_ru: "Футболка Basic White", 
        name_tk: "Ak basik futbolka", 
        price: 120, 
        desc_ru: "Базовая футболка из 100% натурального хлопка. Дышащая и мягкая ткань.",
        desc_tk: "100% arassa pagtadan taýýarlanan basik futbolka. Yumşak we rahat.",
        images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600",
            "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600"
        ],
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { id: "white", ru: "Белый", tk: "Ak", hex: "#FFFFFF" },
            { id: "black", ru: "Черный", tk: "Gara", hex: "#1A1A1A" }
        ]
    },
    { 
        id: 4, 
        category: 'jacket',
        name_ru: "Куртка Бомбер", 
        name_tk: "Bomber kurtka", 
        price: 650, 
        desc_ru: "Демисезонная куртка-бомбер с водоотталкивающим покрытием и качественной фурнитурой.",
        desc_tk: "Suw geçirmeýän ýokary hilli demisezony bomber kurtka.",
        images: [
            "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600"
        ],
        sizes: ["M", "L", "XL"],
        colors: [
            { id: "olive", ru: "Оливковый", tk: "Oliwka", hex: "#556B2F" },
            { id: "black", ru: "Черный", tk: "Gara", hex: "#1A1A1A" }
        ]
    }
];

function initApp() {
    renderSidebarCategories();
    renderCatalog();
    applyLanguage();
    setupMainButton();
    updateBadges();
}

/* --- Навигация и Представления (Views) --- */
function switchView(viewName) {
    currentView = viewName;
    document.querySelectorAll('.view-page').forEach(page => page.classList.remove('active'));

    if (viewName === 'catalog') {
        document.getElementById('catalog-view').classList.add('active');
    } else if (viewName === 'favorites') {
        renderFavorites();
        document.getElementById('favorites-view').classList.add('active');
    } else if (viewName === 'product') {
        document.getElementById('product-view').classList.add('active');
    } else if (viewName === 'cart') {
        renderCartView();
        document.getElementById('cart-view').classList.add('active');
    }

    window.scrollTo(0, 0);
    updateMainButtonVisibility();
}

/* --- Боковое меню категорий (Drawer) --- */
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
    document.getElementById('sidebar-overlay').classList.toggle('active');
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('active');
    document.getElementById('sidebar-overlay').classList.remove('active');
}

function renderSidebarCategories() {
    const container = document.getElementById('sidebar-categories-list');
    container.innerHTML = '';

    const catMap = i18n[currentLang].categories;
    Object.keys(catMap).forEach(catKey => {
        const item = document.createElement('div');
        item.className = `category-item ${activeCategory === catKey ? 'active' : ''}`;
        item.innerText = catMap[catKey];
        item.onclick = () => selectCategory(catKey);
        container.appendChild(item);
    });
}

function selectCategory(catKey) {
    activeCategory = catKey;
    renderSidebarCategories();
    closeSidebar();
    
    document.getElementById('active-category-tag').innerText = i18n[currentLang].categories[catKey];
    renderCatalog();
    if (currentView !== 'catalog') {
        switchView('catalog');
    }
}

/* --- Функция Избранное (Favorites) --- */
function toggleFavorite(productId, event) {
    if (event) event.stopPropagation();

    if (favorites.has(productId)) {
        favorites.delete(productId);
    } else {
        favorites.add(productId);
    }

    updateBadges();
    renderCatalog();

    if (currentView === 'favorites') {
        renderFavorites();
    } else if (currentView === 'product' && activeProduct && activeProduct.id === productId) {
        renderProductDetail();
    }
}

function updateBadges() {
    document.getElementById('fav-count').innerText = favorites.size;
    const cartCount = Object.values(cart).reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').innerText = cartCount;
}

/* --- Каталог --- */
function renderCatalog() {
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML = '';

    const filteredProducts = activeCategory === 'all' 
        ? products 
        : products.filter(p => p.category === activeCategory);

    if (filteredProducts.length === 0) {
        catalogContainer.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <div class="empty-title">В этой категории пока нет товаров</div>
            </div>
        `;
        return;
    }

    filteredProducts.forEach(product => {
        const title = currentLang === 'ru' ? product.name_ru : product.name_tk;
        const isFav = favorites.has(product.id);

        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProductDetail(product.id);

        card.innerHTML = `
            <button class="btn-fav-card" onclick="toggleFavorite(${product.id}, event)">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <img src="${product.images[0]}" alt="${title}" class="product-image" loading="lazy">
            <div>
                <div class="product-title">${title}</div>
                <div class="product-price">${product.price} TMT</div>
            </div>
            <button class="btn-card-action">${i18n[currentLang].btnAdd}</button>
        `;
        catalogContainer.appendChild(card);
    });
}

/* --- Экран Избранного --- */
function renderFavorites() {
    const container = document.getElementById('favorites-content');
    container.innerHTML = '';

    if (favorites.size === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">❤️</div>
                <div class="empty-title">${i18n[currentLang].emptyFavorites}</div>
                <button class="btn-empty-action" onclick="switchView('catalog')">${i18n[currentLang].btnGoCatalog}</button>
            </div>
        `;
        return;
    }

    const grid = document.createElement('div');
    grid.className = 'catalog-grid';

    products.filter(p => favorites.has(p.id)).forEach(product => {
        const title = currentLang === 'ru' ? product.name_ru : product.name_tk;

        const card = document.createElement('div');
        card.className = 'product-card';
        card.onclick = () => openProductDetail(product.id);

        card.innerHTML = `
            <button class="btn-fav-card" onclick="toggleFavorite(${product.id}, event)">❤️</button>
            <img src="${product.images[0]}" alt="${title}" class="product-image" loading="lazy">
            <div>
                <div class="product-title">${title}</div>
                <div class="product-price">${product.price} TMT</div>
            </div>
            <button class="btn-card-action">${i18n[currentLang].btnAdd}</button>
        `;
        grid.appendChild(card);
    });

    container.appendChild(grid);
}

/* --- Детальная Страница Товара --- */
function openProductDetail(productId) {
    savedScrollPosition = window.scrollY;
    activeProduct = products.find(p => p.id === productId);
    
    selectedSize = activeProduct.sizes[0] || 'M';
    selectedColor = activeProduct.colors[0] || null;

    renderProductDetail();
    switchView('product');
}

function closeProductDetail() {
    switchView('catalog');
    window.scrollTo(0, savedScrollPosition);
}

function renderProductDetail() {
    if (!activeProduct) return;
    const container = document.getElementById('detail-card-content');
    const title = currentLang === 'ru' ? activeProduct.name_ru : activeProduct.name_tk;
    const desc = currentLang === 'ru' ? activeProduct.desc_ru : activeProduct.desc_tk;
    const isFav = favorites.has(activeProduct.id);

    const thumbnailsHTML = activeProduct.images.length > 1 ? `
        <div class="thumbnails-row">
            ${activeProduct.images.map((img, idx) => `
                <img src="${img}" class="thumb-img ${idx === 0 ? 'active' : ''}" onclick="changeMainImage('${img}', this)">
            `).join('')}
        </div>
    ` : '';

    const sizesHTML = activeProduct.sizes.map(size => `
        <button class="size-chip ${size === selectedSize ? 'selected' : ''}" onclick="selectSize('${size}')">${size}</button>
    `).join('');

    const colorsHTML = activeProduct.colors.map(color => {
        const colorName = currentLang === 'ru' ? color.ru : color.tk;
        return `
            <div class="color-chip ${selectedColor && selectedColor.id === color.id ? 'selected' : ''}" onclick="selectColor('${color.id}')">
                <span class="color-dot" style="background-color: ${color.hex}"></span>
                <span>${colorName}</span>
            </div>
        `;
    }).join('');

    container.innerHTML = `
        <div class="gallery-container">
            <button class="btn-fav-card" onclick="toggleFavorite(${activeProduct.id}, event)">
                ${isFav ? '❤️' : '🤍'}
            </button>
            <img src="${activeProduct.images[0]}" id="main-detail-img" class="main-gallery-img">
            ${thumbnailsHTML}
        </div>
        <div class="detail-header-row">
            <div class="detail-title">${title}</div>
        </div>
        <div class="detail-price">${activeProduct.price} TMT</div>

        <div class="option-section">
            <div class="option-title">${i18n[currentLang].selectSize}</div>
            <div class="size-chips">${sizesHTML}</div>
        </div>

        <div class="option-section">
            <div class="option-title">${i18n[currentLang].selectColor}</div>
            <div class="color-chips">${colorsHTML}</div>
        </div>

        <div class="detail-description">
            <div class="option-title">${i18n[currentLang].descriptionTitle}</div>
            <p>${desc}</p>
        </div>

        <button class="btn-add-detail" onclick="addToCartFromDetail()">
            ${i18n[currentLang].btnAddCart} • ${activeProduct.price} TMT
        </button>
    `;
}

function changeMainImage(src, element) {
    document.getElementById('main-detail-img').src = src;
    document.querySelectorAll('.thumb-img').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
}

function selectSize(size) {
    selectedSize = size;
    renderProductDetail();
}

function selectColor(colorId) {
    selectedColor = activeProduct.colors.find(c => c.id === colorId);
    renderProductDetail();
}

function addToCartFromDetail() {
    const itemKey = `${activeProduct.id}_${selectedSize}_${selectedColor.id}`;
    
    if (cart[itemKey]) {
        cart[itemKey].qty += 1;
    } else {
        cart[itemKey] = {
            cartKey: itemKey,
            id: activeProduct.id,
            name_ru: activeProduct.name_ru,
            name_tk: activeProduct.name_tk,
            price: activeProduct.price,
            size: selectedSize,
            color: selectedColor,
            qty: 1
        };
    }

    updateBadges();
    switchView('cart');
}

/* --- Оформление Доставки и Корзина --- */
function renderCartView() {
    const container = document.getElementById('cart-content');
    const t = i18n[currentLang];

    if (Object.keys(cart).length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🛒</div>
                <div class="empty-title">${t.emptyCart}</div>
                <button class="btn-empty-action" onclick="switchView('catalog')">${t.btnGoCatalog}</button>
            </div>
        `;
        return;
    }

    container.innerHTML = `
        <div class="checkout-section">
            <div class="cart-items-summary" id="cart-list"></div>

            <div class="form-group">
                <label class="form-label">${t.labelPhone}</label>
                <input type="tel" id="phone" class="form-input" placeholder="+99365123456" value="+993">
            </div>

            <div class="form-group">
                <label class="form-label">${t.labelShipping}</label>
                <div class="radio-group">
                    <label class="radio-label ${activeShippingType === 'pickup' ? 'selected' : ''}" id="opt-pickup-label">
                        <input type="radio" name="shipping" value="pickup" ${activeShippingType === 'pickup' ? 'checked' : ''} onchange="updateShippingType('pickup')">
                        <span>${t.optPickup}</span>
                    </label>
                    <label class="radio-label ${activeShippingType === 'city' ? 'selected' : ''}" id="opt-city-label">
                        <input type="radio" name="shipping" value="city" ${activeShippingType === 'city' ? 'checked' : ''} onchange="updateShippingType('city')">
                        <span>${t.optCity}</span>
                    </label>
                    <label class="radio-label ${activeShippingType === 'intercity' ? 'selected' : ''}" id="opt-intercity-label">
                        <input type="radio" name="shipping" value="intercity" ${activeShippingType === 'intercity' ? 'checked' : ''} onchange="updateShippingType('intercity')">
                        <span>${t.optIntercity}</span>
                    </label>
                </div>
            </div>

            <div id="shipping-subfields"></div>

            <div class="summary-box">
                <div class="summary-row">
                    <span>${t.labelSubtotal}</span>
                    <span id="val-subtotal">0 TMT</span>
                </div>
                <div class="summary-row">
                    <span>${t.labelDelivery}</span>
                    <span id="val-delivery">0 TMT</span>
                </div>
                <div class="summary-row total">
                    <span>${t.labelTotal}</span>
                    <span id="val-total">0 TMT</span>
                </div>
            </div>
        </div>
    `;

    renderCartList();
    renderShippingFields();
    updateSummary();
}

function updateShippingType(type) {
    activeShippingType = type;
    
    document.querySelectorAll('#opt-pickup-label, #opt-city-label, #opt-intercity-label')
        .forEach(el => el.classList.remove('selected'));
    
    const activeLabel = document.getElementById(`opt-${type}-label`);
    if (activeLabel) activeLabel.classList.add('selected');

    renderShippingFields();
    updateSummary();
}

function selectVelayat(velayatKey) {
    selectedVelayat = velayatKey;
    renderShippingFields();
}

function renderShippingFields() {
    const container = document.getElementById('shipping-subfields');
    if (!container) return;
    const t = i18n[currentLang];

    if (activeShippingType === 'pickup') {
        container.innerHTML = `<div class="info-box">${t.pickupInfo}</div>`;
    } else if (activeShippingType === 'city') {
        container.innerHTML = `
            <div class="form-group" style="margin-top: 10px;">
                <label class="form-label">${t.addressLabel}</label>
                <input type="text" id="city-address" class="form-input" placeholder="${t.addressPlaceholder}">
            </div>
        `;
    } else if (activeShippingType === 'intercity') {
        const velayatsButtons = Object.keys(t.velayats).map(key => `
            <div class="velayat-btn ${selectedVelayat === key ? 'selected' : ''}" onclick="selectVelayat('${key}')">
                ${t.velayats[key]}
            </div>
        `).join('');

        container.innerHTML = `
            <div class="form-group" style="margin-top: 10px;">
                <label class="form-label">${t.velayatLabel}</label>
                <div class="velayat-grid">${velayatsButtons}</div>
            </div>
            <div class="form-group">
                <label class="form-label">${t.etrapLabel}</label>
                <input type="text" id="etrap-address" class="form-input" placeholder="${t.etrapPlaceholder}">
            </div>
        `;
    }
}

function changeCartQty(cartKey, delta) {
    if (cart[cartKey]) {
        cart[cartKey].qty += delta;
        if (cart[cartKey].qty <= 0) {
            delete cart[cartKey];
        }
    }
    updateBadges();
    renderCartView();
    updateMainButtonVisibility();
}

function renderCartList() {
    const cartList = document.getElementById('cart-list');
    if (!cartList) return;
    cartList.innerHTML = '';
    
    Object.values(cart).forEach(item => {
        const title = currentLang === 'ru' ? item.name_ru : item.name_tk;
        const colorName = currentLang === 'ru' ? item.color.ru : item.color.tk;

        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <div class="cart-item-info">
                <span class="cart-item-title">${title}</span>
                <span class="cart-item-meta">${item.size} | ${colorName}</span>
            </div>
            <div class="cart-item-controls">
                <button class="btn-qty-mini" onclick="changeCartQty('${item.cartKey}', -1)">-</button>
                <span>${item.qty}</span>
                <button class="btn-qty-mini" onclick="changeCartQty('${item.cartKey}', 1)">+</button>
                <span style="font-weight: 700; margin-left: 8px;">${item.price * item.qty} TMT</span>
            </div>
        `;
        cartList.appendChild(row);
    });
}

function getSubtotal() {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function getShippingCost() {
    if (activeShippingType === 'city') return 20;
    return 0; // Для Межгорода стоимость рассчитывается по тарифу города
}

function updateSummary() {
    const subtotal = getSubtotal();
    const deliveryCost = getShippingCost();
    const subtotalEl = document.getElementById('val-subtotal');
    const deliveryEl = document.getElementById('val-delivery');
    const totalEl = document.getElementById('val-total');

    if (!subtotalEl) return;

    subtotalEl.innerText = `${subtotal} TMT`;
    
    if (activeShippingType === 'intercity') {
        deliveryEl.innerText = i18n[currentLang].deliveryVariable;
        totalEl.innerText = `${subtotal} TMT + delivery`;
        tg.MainButton.setText(`${i18n[currentLang].mainBtnOrder} ${subtotal} TMT+`);
    } else {
        const total = subtotal + deliveryCost;
        deliveryEl.innerText = `${deliveryCost} TMT`;
        totalEl.innerText = `${total} TMT`;
        tg.MainButton.setText(`${i18n[currentLang].mainBtnOrder} ${total} TMT`);
    }
}

function updateMainButtonVisibility() {
    if (currentView === 'cart' && Object.keys(cart).length > 0) {
        tg.MainButton.show();
    } else {
        tg.MainButton.hide();
    }
}

/* --- Переключение Языков --- */
function switchLanguage(lang) {
    currentLang = lang;
    document.getElementById('btn-ru').classList.toggle('active', lang === 'ru');
    document.getElementById('btn-tk').classList.toggle('active', lang === 'tk');
    
    applyLanguage();
    renderSidebarCategories();
    renderCatalog();
    
    if (currentView === 'favorites') renderFavorites();
    if (currentView === 'product') renderProductDetail();
    if (currentView === 'cart') renderCartView();
}

function applyLanguage() {
    const t = i18n[currentLang];
    document.getElementById('title-catalog').innerText = t.titleCatalog;
    document.getElementById('title-favorites').innerText = t.titleFavorites;
    document.getElementById('title-cart').innerText = t.titleCart;
    document.getElementById('sidebar-cat-title').innerText = t.titleSidebarCat;
    document.getElementById('btn-back-text').innerText = t.btnBack;
    document.getElementById('active-category-tag').innerText = t.categories[activeCategory];
}

/* --- Отправка Данных в Telegram --- */
function setupMainButton() {
    tg.MainButton.setParams({
        color: '#0052CC',
        text_color: '#FFFFFF'
    });

    tg.MainButton.onClick(() => {
        if (currentView !== 'cart' || Object.keys(cart).length === 0) return;

        const phoneInput = document.getElementById('phone')?.value.trim();
        const t = i18n[currentLang];

        if (!phoneInput || phoneInput.length < 8 || !phoneInput.startsWith('+993')) {
            tg.showAlert(t.phoneError);
            return;
        }

        let shippingDetails = {
            type: activeShippingType,
            cost_text: activeShippingType === 'intercity' ? t.deliveryVariable : `${getShippingCost()} TMT`
        };

        if (activeShippingType === 'city') {
            const address = document.getElementById('city-address')?.value.trim();
            if (!address) {
                tg.showAlert(t.addressError);
                return;
            }
            shippingDetails.address = address;
        } else if (activeShippingType === 'intercity') {
            const etrap = document.getElementById('etrap-address')?.value.trim();
            if (!etrap) {
                tg.showAlert(t.etrapError);
                return;
            }
            shippingDetails.velayat = t.velayats[selectedVelayat];
            shippingDetails.city_etrap = etrap;
        }

        const itemsPayload = Object.values(cart).map(item => ({
            id: item.id,
            name: currentLang === 'ru' ? item.name_ru : item.name_tk,
            size: item.size,
            color: currentLang === 'ru' ? item.color.ru : item.color.tk,
            price: item.price,
            qty: item.qty,
            total: item.price * item.qty
        }));

        const payload = {
            lang: currentLang,
            items: itemsPayload,
            phone: phoneInput,
            shipping: shippingDetails,
            subtotal: getSubtotal(),
            total: activeShippingType === 'intercity' ? `${getSubtotal()} TMT (+ Доставка)` : `${getSubtotal() + getShippingCost()} TMT`
        };

        tg.sendData(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', initApp);
