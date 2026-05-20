/* Elegant women's fashion boutique interaction script */
const products = [
  {
    id: 1,
    name: 'Bubble Beaded Dress',
    category: 'Corporate Classics',
    family: 'Executive',
    price: 158,
    image: 'img/silk-dress.jpg',
    description: 'A sharp, tailored sheath dress crafted for boardroom confidence and all-day elegance.',
    notes: ['Tailored Fit', 'Stretch Crepe', 'Midi Length'],
    rating: 5,
  },
  {
    id: 2,
    name: 'Red Backless Puff Sleeve Midi Dress',
    category: 'Floral Edit',
    family: 'Floral',
    price: 132,
    image: 'img/red.jpg',
    description: 'Soft floral tones in a wrap silhouette that balances feminine charm with professional polish.',
    notes: ['Wrap Silhouette', 'Waist Tie', 'Soft Drape'],
    rating: 4.9,
  },
  {
    id: 3,
    name: 'Valentine\'s Weekend Dress',
    category: 'Power Dressing',
    family: 'Blazer',
    price: 500000,
    image: 'img/valentine\'s weekend.jpg',
    description: 'A structured blazer dress with clean lapels and a polished silhouette for standout leadership style.',
    notes: ['Structured Shoulders', 'Double Breasted', 'Office Ready'],
    rating: 5,
  },
  {
    id: 4,
    name: 'Elegant Midi Dress',
    category: 'Everyday Elegance',
    family: 'Midi',
    price: 400,
    image: 'img/orange.jpg',
    description: 'Comfortable knit texture with a sleek midi cut designed for effortless weekday sophistication.',
    notes: ['Knit Fabric', 'Soft Stretch', 'Elegant Midi'],
    rating: 4.8,
  },
  {
    id: 5,
    name: 'Midnight Formal Column Dress',
    category: 'Best Sellers',
    family: 'Formal',
    price: 300,
    image: 'img/net-dress.jpg',
    description: 'A sleek formal column dress that transitions gracefully from executive meetings to evening events.',
    notes: ['Formal Cut', 'Minimal Lines', 'Evening Ready'],
    rating: 5,
  },
  {
    id: 6,
    name: 'Draped Cape Evening Dress',
    category: 'Casual Chic',
    family: 'Casual',
    price: 210,
    image: 'img/purple.jpg',
    description: 'A flattering floral dress with a polished finish designed for stylish office days.',
    notes: ['Soft Print', 'Day-to-Evening', 'Elegant Fit'],
    rating: 4.8,
  },
  {
    id: 7,
    name: 'Pink Flowered Beaded Dress',
    category: 'Corporate Elite',
    family: 'Executive',
    price: 340,
    image: 'img/pinkkkk.jpg',
    description: 'Structured tailoring and clean lines for a confident, boardroom-ready presence.',
    notes: ['Tailored Cut', 'Premium Fabric', 'Power Look'],
    rating: 4.9,
  },
  {
    id: 8,
    name: 'One-Shoulder Satin Mermaid Gown',
    category: 'Evening Edit',
    family: 'Maxi',
    price: 275,
    image: 'img/armless.jpg',
    description: 'A sleek satin silhouette perfect for formal events after a full day of meetings.',
    notes: ['Satin Finish', 'Elegant Drape', 'Refined Look'],
    rating: 4.8,
  },
  ];

const productGrid = document.getElementById('collection-grid');
const filterButtons = document.querySelectorAll('.filter-button');
const searchInput = document.getElementById('search-input');
const cartCount = document.getElementById('cart-count');
const wishlistCount = document.getElementById('wishlist-count');
const cartDrawer = document.querySelector('.cart-panel');
const cartContents = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const quickView = document.querySelector('.quick-view');
const quickViewContent = document.getElementById('quick-view-details');
const cartData = [];
const wishlistData = new Set();
let activeFamily = 'All';

function formatPrice(value) {
  return `$${value.toFixed(2)}`;
}

function renderProducts() {
  const searchTerm = searchInput.value.trim().toLowerCase();
  const filtered = products.filter(product => {
    const matchesFamily = activeFamily === 'All' || product.family === activeFamily;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm) || product.category.toLowerCase().includes(searchTerm);
    return matchesFamily && matchesSearch;
  });

  productGrid.classList.toggle('center-results', activeFamily !== 'All');

  productGrid.innerHTML = filtered.map(product => `
    <article class="card fade-up">
      <img src="${product.image}" alt="${product.name}">
      <div class="card-body">
        <span class="product-tag">${product.category}</span>
        <h4>${product.name}</h4>
        <p>${product.description}</p>
        <div class="product-meta">
          <span class="price">${formatPrice(product.price)}</span>
          <button class="wishlist icon-button ${wishlistData.has(product.id) ? 'active' : ''}" data-product-id="${product.id}" aria-label="Add to wishlist">?</button>
        </div>
        <div class="card-actions">
          <button class="add-cart" data-product-id="${product.id}">Add to Cart</button>
          <button class="quick-btn" data-product-id="${product.id}">Quick View</button>
        </div>
      </div>
    </article>`).join('');
}

function updateCartIndicators() {
  cartCount.textContent = cartData.reduce((sum, item) => sum + item.quantity, 0);
  wishlistCount.textContent = wishlistData.size;
}

function updateCartDrawer() {
  if (!cartData.length) {
    cartContents.innerHTML = '<p class="muted">Your selected dresses will appear here. Continue exploring elegant styles.</p>';
    cartTotal.textContent = '$0.00';
    return;
  }

  cartContents.innerHTML = cartData.map(item => {
    const product = products.find(p => p.id === item.id);
    return `
      <div class="cart-item">
        <img src="${product.image}" alt="${product.name}">
        <div class="cart-item-details">
          <h5>${product.name}</h5>
          <p>${formatPrice(product.price)} × ${item.quantity}</p>
          <div class="quantity-control">
            <button class="qty-btn" data-action="decrease" data-product-id="${product.id}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn" data-action="increase" data-product-id="${product.id}">+</button>
          </div>
        </div>
      </div>`;
  }).join('');

  const total = cartData.reduce((sum, item) => sum + item.quantity * products.find(p => p.id === item.id).price, 0);
  cartTotal.textContent = formatPrice(total);
}

function addToCart(productId) {
  const existing = cartData.find(item => item.id === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    cartData.push({ id: productId, quantity: 1 });
  }
  updateCartIndicators();
  updateCartDrawer();
}

function toggleWishlist(productId) {
  if (wishlistData.has(productId)) {
    wishlistData.delete(productId);
  } else {
    wishlistData.add(productId);
  }
  renderProducts();
  updateCartIndicators();
}

function openQuickView(productId) {
  const product = products.find(item => item.id === productId);
  if (!product) return;
  quickViewContent.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <div class="quick-view-details">
      <span class="product-tag">${product.category}</span>
      <h4>${product.name}</h4>
      <p>${product.description}</p>
      <div class="detail-tags">
        ${product.notes.map(note => `<span class="detail-tag">${note}</span>`).join('')}
      </div>
      <div class="price">${formatPrice(product.price)}</div>
      <div class="quick-actions">
        <button class="add-cart" data-product-id="${product.id}">Add to Cart</button>
        <button class="wishlist icon-button ${wishlistData.has(product.id) ? 'active' : ''}" data-product-id="${product.id}" aria-label="Add to wishlist">?</button>
      </div>
    </div>`;
  quickView.classList.add('active');
}

function setActiveFilter(family) {
  activeFamily = family;
  filterButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.family === family);
  });
  renderProducts();
}

function handleProductAction(event) {
  const target = event.target.closest('[data-product-id]');
  if (!target) return;
  const id = Number(target.dataset.productId);
  if (target.classList.contains('add-cart')) {
    addToCart(id);
  } else if (target.classList.contains('wishlist')) {
    toggleWishlist(id);
  } else if (target.classList.contains('quick-btn')) {
    openQuickView(id);
  }
}

function attachInteractions() {
  document.body.addEventListener('click', event => {
    const target = event.target;
    if (target.matches('.filter-button')) {
      setActiveFilter(target.dataset.family);
    }
    if (target.matches('.bag-button')) {
      cartDrawer.classList.add('active');
      updateCartDrawer();
    }
    if (target.matches('.cart-close') || target.matches('.cart-panel-backdrop')) {
      cartDrawer.classList.remove('active');
    }
    if (target.matches('.quick-view-close') || target.matches('.quick-view-backdrop')) {
      quickView.classList.remove('active');
    }
    if (target.matches('.modal-close') || target.matches('.modal-backdrop')) {
      document.querySelector('.modal').classList.remove('active');
    }
    if (target.matches('.checkout-pay')) {
      event.preventDefault();
      processPayment();
    }
    if (target.matches('.qty-btn')) {
      const id = Number(target.dataset.productId);
      const action = target.dataset.action;
      const item = cartData.find(entry => entry.id === id);
      if (!item) return;
      if (action === 'increase') item.quantity += 1;
      if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;
      if (action === 'decrease' && item.quantity === 1) {
        const index = cartData.indexOf(item);
        cartData.splice(index, 1);
      }
      updateCartIndicators();
      updateCartDrawer();
    }
    if (target.closest('.card') || target.matches('.card button')) {
      handleProductAction(event);
    }
  });

  searchInput.addEventListener('input', renderProducts);

  document.querySelector('.shop-collection').addEventListener('click', () => {
    document.getElementById('collections').scrollIntoView({ behavior: 'smooth' });
  });

  document.querySelector('.signature-dresses').addEventListener('click', () => {
    document.getElementById('featured').scrollIntoView({ behavior: 'smooth' });
  });
}

function processPayment() {
  const email = document.getElementById('checkout-email').value.trim();
  const name = document.getElementById('checkout-name').value.trim();
  const method = document.getElementById('payment-method').value;
  const amount = Number(cartTotal.textContent.replace('$', '')) * 100;
  const feedback = document.getElementById('payment-feedback');

  if (!email || !name || amount <= 0) {
    feedback.textContent = 'Please complete your details and add at least one product to the cart.';
    return;
  }

  feedback.textContent = 'Redirecting to secure checkout...';

  if (!window.PaystackPop) {
    feedback.textContent = 'Payment service unavailable. Please refresh the page and try again.';
    return;
  }

  const handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your live/public Paystack key
    email,
    amount,
    currency: 'USD',
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
        { display_name: 'Payment Type', variable_name: 'payment_type', value: method },
      ]
    },
    callback: function(response) {
      feedback.textContent = `Payment successful. Reference: ${response.reference}. Thank you for shopping with EsahMaya.`;
      document.querySelector('.modal').classList.add('active');
      document.getElementById('modal-title').textContent = 'Payment Confirmed';
      document.getElementById('modal-message').textContent = 'Your order has been placed successfully. A confirmation email will arrive shortly.';
      cartData.length = 0;
      updateCartIndicators();
      updateCartDrawer();
    },
    onClose: function() {
      feedback.textContent = 'Payment cancelled. Please try again or choose another method.';
    }
  });
  handler.openIframe();
}

function revealOnScroll() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach(element => {
    element.style.opacity = 0;
    element.style.transform = 'translateY(24px)';
    observer.observe(element);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  updateCartIndicators();
  attachInteractions();
  revealOnScroll();
});




