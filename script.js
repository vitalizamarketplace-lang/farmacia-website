// Products Database
const products = [
    {
        id: 1,
        name: 'Dipirona 500mg',
        price: 8.90,
        category: 'medicamentos',
        description: 'Analgésico e antitérmico',
        emoji: '💊'
    },
    {
        id: 2,
        name: 'Vitamina C 1000mg',
        price: 25.50,
        category: 'vitaminas',
        description: 'Fortalece imunidade',
        emoji: '🧬'
    },
    {
        id: 3,
        name: 'Shampoo Neutro',
        price: 15.90,
        category: 'higiene',
        description: 'Higiene diária',
        emoji: '🧴'
    },
    {
        id: 4,
        name: 'Gaze Estéril',
        price: 12.50,
        category: 'primeiro-socorso',
        description: 'Pacote com 10 unidades',
        emoji: '🩹'
    },
    {
        id: 5,
        name: 'Omeprazol 20mg',
        price: 18.90,
        category: 'medicamentos',
        description: 'Protetor gástrico',
        emoji: '💊'
    },
    {
        id: 6,
        name: 'Vitamina D3',
        price: 35.00,
        category: 'vitaminas',
        description: 'Absorção de cálcio',
        emoji: '🧬'
    },
    {
        id: 7,
        name: 'Sabonete Íntimo',
        price: 12.00,
        category: 'higiene',
        description: 'pH balanceado',
        emoji: '🧴'
    },
    {
        id: 8,
        name: 'Álcool 70%',
        price: 8.50,
        category: 'primeiro-socorso',
        description: 'Desinfetante',
        emoji: '🩹'
    },
    {
        id: 9,
        name: 'Ibuprofeno 400mg',
        price: 14.90,
        category: 'medicamentos',
        description: 'Anti-inflamatório',
        emoji: '💊'
    },
    {
        id: 10,
        name: 'Vitamina B12',
        price: 28.90,
        category: 'vitaminas',
        description: 'Energia e vitalidade',
        emoji: '🧬'
    },
    {
        id: 11,
        name: 'Creme Corporal',
        price: 22.00,
        category: 'higiene',
        description: 'Hidratação profunda',
        emoji: '🧴'
    },
    {
        id: 12,
        name: 'Termômetro Digital',
        price: 35.90,
        category: 'primeiro-socorro',
        description: 'Medição rápida e precisa',
        emoji: '🩹'
    }
];

// Shopping Cart
let cart = [];
let currentFilter = 'todos';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    loadProducts('todos');
    loadCart();
});

// Load Products
function loadProducts(category) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const filtered = category === 'todos' 
        ? products 
        : products.filter(p => p.category === category);

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">🛒 Adicionar ao Carrinho</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Filter Products
function filterProducts(category) {
    currentFilter = category;
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    loadProducts(category);
}

// Search Products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    const filtered = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm)
    );

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Nenhum produto encontrado</p>';
        return;
    }

    filtered.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-description">${product.description}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="btn-add-cart" onclick="addToCart(${product.id})">🛒 Adicionar ao Carrinho</button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    loadCart();
    toggleCart();
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    loadCart();
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            loadCart();
        }
    }
}

// Load Cart
function loadCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');

    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<p style="text-align:center; padding: 2rem;">Seu carrinho está vazio</p>';
        document.getElementById('subtotal').textContent = 'R$ 0,00';
        document.getElementById('shipping').textContent = 'R$ 0,00';
        document.getElementById('total').textContent = 'R$ 0,00';
        return;
    }

    cartItemsDiv.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">−</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">🗑️</button>
        `;
        cartItemsDiv.appendChild(itemDiv);
    });

    updateCartSummary();
}

// Update Cart Summary
function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = `R$ ${shipping.toFixed(2)}`;
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('farmacia-cart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCartFromStorage() {
    const saved = localStorage.getItem('farmacia-cart');
    if (saved) {
        cart = JSON.parse(saved);
    }
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');

    cartSidebar.classList.toggle('hidden');
    overlay.classList.toggle('hidden');
}

// Toggle Search
function toggleSearch() {
    const searchBar = document.getElementById('search-bar');
    searchBar.classList.toggle('hidden');
    if (!searchBar.classList.contains('hidden')) {
        document.getElementById('search-input').focus();
    }
}

// Close Overlay
function closeOverlay() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('overlay');
    cartSidebar.classList.add('hidden');
    overlay.classList.add('hidden');
}

// Go to Checkout
function goToCheckout() {
    if (cart.length === 0) {
        alert('Seu carrinho está vazio!');
        return;
    }

    const checkoutItems = document.getElementById('checkout-items');
    checkoutItems.innerHTML = '';

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'order-item';
        itemDiv.innerHTML = `
            <span>${item.name} x${item.quantity}</span>
            <span>R$ ${(item.price * item.quantity).toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemDiv);
    });

    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 15;
    const total = subtotal + shipping;

    document.getElementById('checkout-total').textContent = `R$ ${total.toFixed(2)}`;

    document.getElementById('checkout-modal').classList.remove('hidden');
    closeOverlay();
}

// Close Checkout
function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

// Submit Order
function submitOrder(event) {
    event.preventDefault();

    const orderNumber = Math.floor(Math.random() * 1000000);
    alert(`✅ Pedido #${orderNumber} confirmado!\n\nObrigado por sua compra na FarmáciaPLUS!\n\nVocê receberá a confirmação por email.`);

    cart = [];
    saveCart();
    loadCart();
    closeCheckout();
    loadProducts('todos');
}

// Scroll to Products
function scrollToProducts() {
    document.querySelector('.products-section').scrollIntoView({ behavior: 'smooth' });
}