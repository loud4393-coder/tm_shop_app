// @ts-nocheck
const tg = window.Telegram.WebApp;
tg.expand();
tg.ready();

let currentLang = 'ru';
let cart = {}; 
let shippingCost = 0;

const i18n = {
    ru: {
        titleCatalog: "Каталог одежды",
        titleCheckout: "Оформление заказа",
        labelPhone: "Номер телефона (для связи)",
        labelShipping: "Способ доставки",
        optPickup: "Самовывоз (0 TMT)",
        optCity: "Такси по городу (20 TMT)",
        optIntercity: "Межгород (50 TMT)",
        labelSubtotal: "Товары:",
        labelDelivery: "Доставка:",
        labelTotal: "Итого:",
        btnAdd: "В корзину",
        mainBtnOrder: "Оформить заказ • ",
        phoneError: "Введите корректный номер (+993...)",
        currency: "TMT"
    },
    tkm: {
        titleCatalog: "Eşik katalogysy",
        titleCheckout: "Sargydy resmileşdirmek",
        labelPhone: "Telefon belgisi (habarlaşmak üçin)",
        labelShipping: "Eltip bermek görnüşi",
        optPickup: "Özüm alýaryn (0 TMT)",
        optCity: "Şäher içi taksi (20 TMT)",
        optIntercity: "Şäherara (50 TMT)",
        labelSubtotal: "Harytlar:",
        labelDelivery: "Eltip bermek:",
        labelTotal: "Jemi:",
        btnAdd: "Sebede goş",
        mainBtnOrder: "Sargyt etmek • ",
        phoneError: "Dogry telefon belgisini giriziň (+993...)",
        currency: "TMT"
    }
};

const products = [
    { id: 1, name_ru: "Мужская худи Oversize", name_tkm: "Erkek Oversize hudi", price: 350, img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400" },
    { id: 2, name_ru: "Джинсы Classic Fit", name_tkm: "Klassik Fit jinsi", price: 280, img: "https://images.unsplash.com/photo-1542272604-780c36856842?w=400" },
    { id: 3, name_ru: "Футболка Basic White", name_tkm: "Ak basik futbolka", price: 120, img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400" },
    { id: 4, name_ru: "Куртка Бомбер", name_tkm: "Bomber kurtka", price: 650, img: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400" },
    { id: 5, name_ru: "Платье Летнее", name_tkm: "Tomusky koynek", price: 320, img: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400" },
    { id: 6, name_ru: "Свитшот Minimalist", name_tkm: "Minimalist switşot", price: 260, img: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400" },
    { id: 7, name_ru: "Спортивные брюки", name_tkm: "Sport balagydyr", price: 220, img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400" },
    { id: 8, name_ru: "Рубашка в клетку", name_tkm: "Kletkaly köýnek", price: 240, img: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400" },
    { id: 9, name_ru: "Кроссовки Urban Style", name_tkm: "Urban Style krossowka", price: 580, img: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400" },
    { id: 10, name_ru: "Пиджак Casual", name_tkm: "Casual pidjak", price: 720, img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400" },
    { id: 11, name_ru: "Кепка Streetwear", name_tkm: "Streetwear kepka", price: 90, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
    { id: 12, name_ru: "Шорты Джинсовые", name_tkm: "Jinsi şortik", price: 180, img: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400" },
    { id: 13, name_ru: "Пальто Осеннее", name_tkm: "Güzlik palto", price: 950, img: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400" },
    { id: 14, name_ru: "Водолазка Черная", name_tkm: "Gara wodolazka", price: 190, img: "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400" },
    { id: 15, name_ru: "Кардиган Вязаный", name_tkm: "Örülen kardigan", price: 380, img: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400" },
    { id: 16, name_ru: "Юбка Плиссе", name_tkm: "Plisse ýubka", price: 270, img: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400" },
    { id: 17, name_ru: "Жакет Женский", name_tkm: "Gelin-gyz žaketi", price: 490, img: "https://images.unsplash.com/photo-1548883354-7622d03aca27?w=400" },
    { id: 18, name_ru: "Майка Спортивная", name_tkm: "Sport maýkasy", price: 95, img: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400" },
    { id: 19, name_ru: "Носки Premium (3 пары)", name_tkm: "Premium joraplar (3 jübüt)", price: 60, img: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400" }
];

function initApp() {
    renderCatalog();
    applyLanguage();
    setupMainButton();
}

function renderCatalog() {
    const catalogContainer = document.getElementById('catalog');
    catalogContainer.innerHTML = '';

    products.forEach(product => {
        const title = currentLang === 'ru' ? product.name_ru : product.name_tkm;
        const qty = cart[product.id] ? cart[product.id].qty : 0;

        const card = document.createElement('div');
        card.className = 'product-card';
        
        let actionBtnHTML = `
            <button class="btn-add" onclick="addToCart(${product.id})">
                ${i18n[currentLang].btnAdd}
            </button>
        `;

        if (qty > 0) {
            actionBtnHTML = `
                <div class="cart-control">
                    <button class="btn-qty" onclick="changeQty(${product.id}, -1)">-</button>
                    <span class="qty-count">${qty}</span>
                    <button class="btn-qty" onclick="changeQty(${product.id}, 1)">+</button>
                </div>
            `;
        }

        card.innerHTML = `
            <img src="${product.img}" alt="${title}" class="product-image" loading="lazy">
            <div>
                <div class="product-title">${title}</div>
                <div class="product-price">${product.price} TMT</div>
            </div>
            ${actionBtnHTML}
        `;
        catalogContainer.appendChild(card);
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart[productId] = {
        id: product.id,
        name_ru: product.name_ru,
        name_tkm: product.name_tkm,
        price: product.price,
        qty: 1
    };
    updateState();
}

function changeQty(productId, delta) {
    if (cart[productId]) {
        cart[productId].qty += delta;
        if (cart[productId].qty <= 0) {
            delete cart[productId];
        }
    }
    updateState();
}

function updateShipping(cost) {
    shippingCost = parseInt(cost);
    
    document.querySelectorAll('.radio-label').forEach(el => el.classList.remove('selected'));
    if (cost === 0) document.getElementById('opt-pickup-label').classList.add('selected');
    if (cost === 20) document.getElementById('opt-city-label').classList.add('selected');
    if (cost === 50) document.getElementById('opt-intercity-label').classList.add('selected');

    updateSummary();
}

function updateState() {
    renderCatalog();
    renderCartList();
    updateSummary();
    
    const checkoutSec = document.getElementById('checkout-section');
    if (Object.keys(cart).length > 0) {
        checkoutSec.classList.add('visible');
        tg.MainButton.show();
    } else {
        checkoutSec.classList.remove('visible');
        tg.MainButton.hide();
    }
}

function renderCartList() {
    const cartList = document.getElementById('cart-list');
    cartList.innerHTML = '';
    
    Object.values(cart).forEach(item => {
        const title = currentLang === 'ru' ? item.name_ru : item.name_tkm;
        const row = document.createElement('div');
        row.className = 'cart-item-row';
        row.innerHTML = `
            <span>${title} x ${item.qty}</span>
            <span>${item.price * item.qty} TMT</span>
        `;
        cartList.appendChild(row);
    });
}

function getSubtotal() {
    return Object.values(cart).reduce((sum, item) => sum + (item.price * item.qty), 0);
}

function updateSummary() {
    const subtotal = getSubtotal();
    const total = subtotal + shippingCost;

    document.getElementById('val-subtotal').innerText = `${subtotal} TMT`;
    document.getElementById('val-delivery').innerText = `${shippingCost} TMT`;
    document.getElementById('val-total').innerText = `${total} TMT`;

    tg.MainButton.setText(`${i18n[currentLang].mainBtnOrder} ${total} TMT`);
}

function switchLanguage(lang) {
    currentLang = lang;
    document.getElementById('btn-ru').classList.toggle('active', lang === 'ru');
    document.getElementById('btn-tkm').classList.toggle('active', lang === 'tkm');
    
    applyLanguage();
    renderCatalog();
    renderCartList();
    updateSummary();
}

function applyLanguage() {
    const t = i18n[currentLang];
    document.getElementById('title-catalog').innerText = t.titleCatalog;
    document.getElementById('title-checkout').innerText = t.titleCheckout;
    document.getElementById('label-phone').innerText = t.labelPhone;
    document.getElementById('label-shipping').innerText = t.labelShipping;
    document.getElementById('opt-pickup').innerText = t.optPickup;
    document.getElementById('opt-city').innerText = t.optCity;
    document.getElementById('opt-intercity').innerText = t.optIntercity;
    document.getElementById('label-subtotal').innerText = t.labelSubtotal;
    document.getElementById('label-delivery').innerText = t.labelDelivery;
    document.getElementById('label-total').innerText = t.labelTotal;
}

function setupMainButton() {
    tg.MainButton.setParams({
        color: '#0052CC',
        text_color: '#FFFFFF'
    });

    tg.MainButton.onClick(() => {
        const phoneInput = document.getElementById('phone').value.trim();
        
        if (!phoneInput || phoneInput.length < 8 || !phoneInput.startsWith('+993')) {
            tg.showAlert(i18n[currentLang].phoneError);
            return;
        }

        const itemsPayload = Object.values(cart).map(item => ({
            id: item.id,
            name: currentLang === 'ru' ? item.name_ru : item.name_tkm,
            price: item.price,
            qty: item.qty,
            total: item.price * item.qty
        }));

        let shippingTitle = i18n[currentLang].optPickup;
        if (shippingCost === 20) shippingTitle = i18n[currentLang].optCity;
        if (shippingCost === 50) shippingTitle = i18n[currentLang].optIntercity;

        const payload = {
            lang: currentLang,
            items: itemsPayload,
            phone: phoneInput,
            shipping: {
                title: shippingTitle,
                cost: shippingCost
            },
            subtotal: getSubtotal(),
            total: getSubtotal() + shippingCost
        };

        tg.sendData(JSON.stringify(payload));
    });
}

document.addEventListener('DOMContentLoaded', initApp);
