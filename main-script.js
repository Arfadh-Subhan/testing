// main-script.js - FIXED VERSION

// Debug: Check what's loading
console.log('🚀 main-script.js loaded - FIXED VERSION');

// Configuration
const CONFIG = {
    whatsappNumber: '+94781218767',
    companyName: 'Cake Corner', 
    currency: 'LKR'
};

// Storage Keys
const ORDER_HISTORY_STORAGE_KEY = 'cakeCornerOrderHistory';

// Products Data with local images
const PRODUCTS = [
    {
        id: 1,
        name: "Chocolate Fantasy",
        price: 4500,
        image: "images/chocolatecake.jpeg",
        description: "Rich dark chocolate layers with creamy chocolate ganache and fresh berries",
        category: "chocolate",
        ingredients: ["Dark Chocolate", "Fresh Cream", "Mixed Berries", "Cocoa Powder", "Vanilla Extract"],
        sizes: ["Small (6\")", "Medium (8\")", "Large (10\")"],
        delivery: "2-4 hours"
    },
    {
        id: 2,
        name: "Rainbow Delight", 
        price: 5200,
        image: "images/freshfruit.jpg",
        description: "Vibrant colorful layers with vanilla buttercream and sprinkles",
        category: "celebration",
        ingredients: ["Vanilla Sponge", "Food Coloring", "Buttercream", "Rainbow Sprinkles", "Condensed Milk"],
        sizes: ["Medium (8\")", "Large (10\")", "X-Large (12\")"],
        delivery: "3-5 hours"
    },
    {
        id: 3,
        name: "Red Velvet Dream",
        price: 5800,
        image: "images/chocolatecreancake.jpg",
        description: "Classic red velvet with cream cheese frosting and walnut topping",
        category: "premium",
        ingredients: ["Red Velvet Sponge", "Cream Cheese", "Butter", "Walnuts", "Cocoa Powder"],
        sizes: ["Small (6\")", "Medium (8\")", "Large (10\")", "X-Large (12\")"],
        delivery: "4-6 hours"
    },
    {
        id: 4,
        name: "Vanilla Bean Bliss",
        price: 3800,
        image: "images/vanilla-cake.jpg",
        description: "Pure vanilla bean cake with vanilla buttercream and fresh flowers",
        category: "classic",
        ingredients: ["Vanilla Bean", "Fresh Butter", "Organic Eggs", "Cane Sugar", "All-purpose Flour"],
        sizes: ["Small (6\")", "Medium (8\")", "Large (10\")"],
        delivery: "2-3 hours"
    },
    {
        id: 5,
        name: "Lemon Zest Delight",
        price: 4200,
        image: "images/lemon-cake.jpg",
        description: "Tangy lemon cake with lemon curd filling and citrus glaze",
        category: "fruit",
        ingredients: ["Fresh Lemons", "Lemon Curd", "Citrus Glaze", "Candied Lemon", "Yogurt"],
        sizes: ["Medium (8\")", "Large (10\")"],
        delivery: "3-4 hours"
    },
    {
        id: 6,
        name: "Carrot Cake Special",
        price: 4800,
        image: "images/carrot-cake.jpg",
        description: "Moist carrot cake with cream cheese frosting and walnut crunch",
        category: "classic",
        ingredients: ["Fresh Carrots", "Cream Cheese", "Walnuts", "Cinnamon", "Raisins"],
        sizes: ["Small (6\")", "Medium (8\")", "Large (10\")"],
        delivery: "3-5 hours"
    },
    {
        id: 7,
        name: "Strawberry Shortcake",
        price: 4600,
        image: "images/strawberry-cake.jpg",
        description: "Light sponge with fresh strawberries and whipped cream",
        category: "fruit",
        ingredients: ["Fresh Strawberries", "Whipped Cream", "Vanilla Sponge", "Strawberry Glaze"],
        sizes: ["Small (6\")", "Medium (8\")", "Large (10\")"],
        delivery: "2-4 hours"
    },
    {
        id: 8,
        name: "Coffee Mocha Madness",
        price: 5500,
        image: "images/mocha-cake.jpg",
        description: "Rich coffee-infused chocolate cake with mocha buttercream",
        category: "chocolate",
        ingredients: ["Espresso Coffee", "Dark Chocolate", "Mocha Buttercream", "Coffee Beans"],
        sizes: ["Medium (8\")", "Large (10\")", "X-Large (12\")"],
        delivery: "3-5 hours"
    }
];

// Carousel State
let currentPage = 0;
const CAKES_PER_PAGE = 6;
const TOTAL_PAGES = Math.ceil(PRODUCTS.length / CAKES_PER_PAGE);

// Shopping Cart System
class ShoppingCart {
    constructor() {
        this.items = [];
        this.init();
    }

    init() {
        console.log('🛒 Initializing cart...');
        this.loadCart();
        this.setupEventListeners();
        this.renderProducts();
        this.setupCarousel();
        this.setupNavigation();
        this.updateCartDisplay();
        this.setupCustomCakes();
        this.setupMobileMenu();
        this.setupDropdowns();
    }

    setupEventListeners() {
        console.log('🔧 Setting up cart event listeners...');
        
        // Cart toggle
        const cartToggle = document.getElementById('cartToggle');
        if (cartToggle) {
            cartToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleCart();
            });
        }

        // Close cart
        const closeCart = document.getElementById('closeCart');
        if (closeCart) {
            closeCart.addEventListener('click', () => {
                this.hideCart();
            });
        }

        // Checkout
        const checkoutBtn = document.getElementById('checkoutBtn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => {
                this.checkout();
            });
        }

        // Explore cakes
        const exploreCakes = document.getElementById('exploreCakes');
        if (exploreCakes) {
            exploreCakes.addEventListener('click', () => {
                document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
            });
        }

        // View gallery  
        const viewGallery = document.getElementById('viewGallery');
        if (viewGallery) {
            viewGallery.addEventListener('click', () => {
                this.showRandomProduct();
            });
        }

        // Modal close
        const modalClose = document.getElementById('modalClose');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        const modalOverlay = document.querySelector('.modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Escape key to close modal
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('📱 Mobile menu toggle clicked');
                
                // Toggle mobile menu
                navMenu.classList.toggle('mobile-show');
                mobileToggle.classList.toggle('active');
                
                // Close seller dropdown if open
                const sellerDropdown = document.querySelector('.seller-dropdown');
                if (sellerDropdown && sellerDropdown.classList.contains('show')) {
                    sellerDropdown.classList.remove('show');
                }
            });

            // Close mobile menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu-toggle')) {
                    navMenu.classList.remove('mobile-show');
                    mobileToggle.classList.remove('active');
                }
            });

            // Close mobile menu when clicking links
            navMenu.addEventListener('click', (e) => {
                if (e.target.tagName === 'A') {
                    navMenu.classList.remove('mobile-show');
                    mobileToggle.classList.remove('active');
                }
            });
        }
    }

    setupDropdowns() {
        const sellerBtn = document.querySelector('.seller-btn');
        const sellerDropdown = document.querySelector('.seller-dropdown');
        let currentDropdown = null;

        if (sellerBtn && sellerDropdown) {
            sellerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('👤 Seller dropdown clicked');
                
                if (currentDropdown === sellerDropdown) {
                    sellerDropdown.classList.remove('show');
                    currentDropdown = null;
                } else {
                    // Close any other dropdowns
                    if (currentDropdown) {
                        currentDropdown.classList.remove('show');
                    }
                    sellerDropdown.classList.add('show');
                    currentDropdown = sellerDropdown;
                    
                    // Close mobile menu if open
                    const navMenu = document.querySelector('.nav-menu');
                    const mobileToggle = document.querySelector('.mobile-menu-toggle');
                    if (navMenu && navMenu.classList.contains('mobile-show')) {
                        navMenu.classList.remove('mobile-show');
                        mobileToggle.classList.remove('active');
                    }
                }
            });

            // Close dropdowns when clicking outside
            document.addEventListener('click', () => {
                if (currentDropdown) {
                    currentDropdown.classList.remove('show');
                    currentDropdown = null;
                }
            });

            // Handle menu item clicks
            sellerDropdown.addEventListener('click', (e) => {
                if (e.target.closest('.user-profile')) {
                    e.preventDefault();
                    showUserProfile();
                }
                
                if (e.target.closest('.order-history')) {
                    e.preventDefault();
                    showOrderHistory();
                }
                
                if (e.target.closest('.seller-logout')) {
                    e.preventDefault();
                    this.handleLogout();
                }

                if (e.target.closest('.seller-login')) {
                    e.preventDefault();
                    window.location.href = 'login.html';
                }
            });
        }
    }

    handleLogout() {
        console.log('🚪 Logout clicked');
        
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('isGuest');
        localStorage.removeItem('user');
        
        showNotification('Logged out successfully!');
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }

    // ... (keep all the other existing methods exactly as they were)
    // setupCustomCakes, renderProducts, addToCart, etc. - all remain the same

    setupCustomCakes() {
        console.log('🔧 Setting up custom cakes section event listeners...');
        
        const startCustomizingBtn = document.getElementById('startCustomizing');
        const backBtn = document.getElementById('backBtn');
        const customCakeForm = document.getElementById('customCakeForm');
        const customCakesSection = document.querySelector('.custom-cakes-section');
        
        if (startCustomizingBtn) {
            startCustomizingBtn.addEventListener('click', this.showCustomForm.bind(this));
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', this.hideCustomForm.bind(this));
        }
        
        if (customCakeForm) {
            customCakeForm.addEventListener('submit', this.handleCustomOrderSubmit.bind(this));
        }
        
        // Set background image
        this.setBackgroundImage();
        
        // Set delivery date min
        const deliveryDateInput = document.getElementById('delivery-date');
        if (deliveryDateInput) {
            const today = new Date();
            const minDate = today.toISOString().split('T')[0];
            deliveryDateInput.min = minDate;
        }
    }

    setBackgroundImage() {
        const backgroundElement = document.querySelector('.custom-background-image');
        if (!backgroundElement) return;
        
        const img = new Image();
        img.src = 'images/chocolatecake.jpeg';
        
        img.onload = function() {
            backgroundElement.style.backgroundImage = `url('images/chocolatecake.jpeg')`;
        };
        
        img.onerror = function() {
            backgroundElement.style.backgroundImage = `url('https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')`;
        };
    }

    showCustomForm() {
        console.log('🎂 Showing custom form');
        const customCakesSection = document.querySelector('.custom-cakes-section');
        
        if (window.innerWidth <= 768) {
            // Mobile: Fixed right sidebar
            customCakesSection.classList.add('form-active');
            document.body.style.overflow = 'hidden';
        } else {
            // Desktop: Original behavior
            customCakesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            setTimeout(() => {
                customCakesSection.classList.add('form-active');
                document.body.style.overflow = 'hidden';
            }, 800);
        }
    }

    hideCustomForm() {
        console.log('❌ Hiding custom form');
        const customCakesSection = document.querySelector('.custom-cakes-section');
        customCakesSection.classList.remove('form-active');
        document.body.style.overflow = '';
    }

    // ... (all other methods remain exactly the same)
    // Only the mobile menu and dropdown setup was changed

    renderProducts() {
        console.log('🎨 Rendering products...');
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        grid.innerHTML = '';

        const startIndex = currentPage * CAKES_PER_PAGE;
        const endIndex = Math.min(startIndex + CAKES_PER_PAGE, PRODUCTS.length);
        const productsToShow = PRODUCTS.slice(startIndex, endIndex);

        productsToShow.forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';
            productCard.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=765&q=80'">
                </div>
                <div class="product-content">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-description">${product.description}</p>
                    <div class="product-price">${CONFIG.currency}${product.price.toLocaleString()}</div>
                    <div class="product-actions">
                        <button class="btn btn-outline view-details" data-id="${product.id}">
                            <i class="fas fa-eye"></i> Details
                        </button>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Add to Cart
                        </button>
                    </div>
                </div>
            `;
            grid.appendChild(productCard);
        });

        // Add event listeners to product buttons
        grid.querySelectorAll('.view-details').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                this.showProductModal(productId);
            });
        });

        grid.querySelectorAll('.add-to-cart').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const productId = parseInt(e.target.closest('button').dataset.id);
                this.addToCart(productId);
            });
        });
    }

    addToCart(productId) {
        console.log('➕ Adding to cart:', productId);
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.items.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        this.saveCart();
        this.updateCartDisplay();
        
        // Show cart if first item
        if (this.items.length === 1) {
            this.showCart();
        }
    }

    removeFromCart(productId) {
        console.log('➖ Removing from cart:', productId);
        this.items = this.items.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartDisplay();
    }

    updateQuantity(productId, change) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity += change;
            if (item.quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                this.saveCart();
                this.updateCartDisplay();
            }
        }
    }

    updateCartDisplay() {
        const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const totalAmount = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update cart count
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) cartCount.textContent = totalItems;

        // Update cart items
        const cartItems = document.getElementById('cartItems');
        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = `
                    <div class="empty-cart">
                        <i class="fas fa-shopping-bag"></i>
                        <p>Your cart is empty</p>
                    </div>
                `;
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-image">
                            <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=765&q=80'">
                        </div>
                        <div class="cart-item-details">
                            <div class="cart-item-name">${item.name}</div>
                            <div class="cart-item-price">${CONFIG.currency}${item.price.toLocaleString()}</div>
                        </div>
                        <div class="cart-item-controls">
                            <button class="quantity-btn minus" onclick="window.cart.updateQuantity(${item.id}, -1)">-</button>
                            <span class="cart-item-quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" onclick="window.cart.updateQuantity(${item.id}, 1)">+</button>
                            <button class="remove-item" onclick="window.cart.removeFromCart(${item.id})">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        }

        // Update total
        const totalElement = document.querySelector('.total-amount');
        if (totalElement) totalElement.textContent = totalAmount.toLocaleString();
    }

    showProductModal(productId) {
        console.log('🪟 Showing product modal:', productId);
        const product = PRODUCTS.find(p => p.id === productId);
        if (!product) return;

        const modalBody = document.getElementById('modalBody');
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="modal-product">
                <div class="modal-product-image">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=765&q=80'">
                </div>
                <div class="modal-product-details">
                    <h2>${product.name}</h2>
                    <p class="modal-product-description">${product.description}</p>
                    
                    <div class="modal-product-info">
                        <div class="info-section">
                            <h4>Ingredients</h4>
                            <ul>
                                ${product.ingredients.map(ing => `<li>${ing}</li>`).join('')}
                            </ul>
                        </div>
                        
                        <div class="info-section">
                            <h4>Available Sizes</h4>
                            <div class="sizes">
                                ${product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('')}
                            </div>
                        </div>
                        
                        <div class="info-section">
                            <h4>Delivery Time</h4>
                            <p class="delivery-info">${product.delivery}</p>
                        </div>
                    </div>
                    
                    <div class="modal-product-actions">
                        <div class="price">${CONFIG.currency}${product.price.toLocaleString()}</div>
                        <button class="btn btn-primary" onclick="window.cart.addToCart(${product.id})">
                            <i class="fas fa-shopping-cart"></i>
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        `;

        this.showModal();
    }

    showRandomProduct() {
        const randomId = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].id;
        this.showProductModal(randomId);
    }

    toggleCart() {
        const panel = document.getElementById('cartPanel');
        if (panel) {
            panel.classList.toggle('show');
        }
    }

    showCart() {
        const panel = document.getElementById('cartPanel');
        if (panel) {
            panel.classList.add('show');
        }
    }

    hideCart() {
        const panel = document.getElementById('cartPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    showModal() {
        const modal = document.getElementById('cakeModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        const modal = document.getElementById('cakeModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    }

    checkout() {
        if (this.items.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const message = this.formatWhatsAppMessage();
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
        
        alert('Order sent to WhatsApp! We will contact you soon.');
        
        // Clear cart after successful order
        this.items = [];
        this.saveCart();
        this.updateCartDisplay();
        this.hideCart();
    }

    formatWhatsAppMessage() {
        let message = `🎂 *NEW ORDER - ${CONFIG.companyName}* 🎂\n\n`;
        message += `Hello! I would like to place an order:\n\n`;
        
        message += `*Order Details:*\n`;
        this.items.forEach((item, index) => {
            message += `${index + 1}. ${item.name} x${item.quantity} - ${CONFIG.currency}${(item.price * item.quantity).toLocaleString()}\n`;
        });
        
        message += `\n*Order Summary:*\n`;
        message += `Items: ${this.items.reduce((sum, item) => sum + item.quantity, 0)}\n`;
        message += `Subtotal: ${CONFIG.currency}${this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}\n`;
        message += `Delivery: ${CONFIG.currency}500\n`;
        message += `*Total: ${CONFIG.currency}${(this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 500).toLocaleString()}*\n\n`;
        
        message += `Please confirm availability and delivery details.\n\n`;
        message += `Thank you! 🍰`;
        
        return message;
    }

    saveCart() {
        localStorage.setItem('cakeCornerCart', JSON.stringify(this.items));
    }

    loadCart() {
        try {
            const saved = localStorage.getItem('cakeCornerCart');
            this.items = saved ? JSON.parse(saved) : [];
            console.log('📦 Cart loaded:', this.items.length, 'items');
        } catch (e) {
            this.items = [];
        }
    }

    setupCarousel() {
        console.log('🎠 Setting up carousel...');
        
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const dotsContainer = document.getElementById('carouselDots');

        // Create dots
        dotsContainer.innerHTML = '';
        for (let i = 0; i < TOTAL_PAGES; i++) {
            const dot = document.createElement('div');
            dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => {
                this.goToPage(i);
            });
            dotsContainer.appendChild(dot);
        }

        // Previous button
        prevBtn.addEventListener('click', () => {
            this.prevPage();
        });

        // Next button
        nextBtn.addEventListener('click', () => {
            this.nextPage();
        });

        // Update button states
        this.updateCarouselButtons();
    }

    goToPage(page) {
        currentPage = page;
        this.renderProducts();
        this.updateCarouselButtons();
        this.updateCarouselDots();
    }

    prevPage() {
        if (currentPage > 0) {
            currentPage--;
            this.renderProducts();
            this.updateCarouselButtons();
            this.updateCarouselDots();
        }
    }

    nextPage() {
        if (currentPage < TOTAL_PAGES - 1) {
            currentPage++;
            this.renderProducts();
            this.updateCarouselButtons();
            this.updateCarouselDots();
        }
    }

    updateCarouselButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        prevBtn.disabled = currentPage === 0;
        nextBtn.disabled = currentPage === TOTAL_PAGES - 1;
    }

    updateCarouselDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentPage);
        });
    }

    setupNavigation() {
        console.log('🧭 Setting up navigation...');
        
        // Smooth scroll for nav links
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Navbar scroll effect
        const navbar = document.getElementById('navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });
        }
    }
}

// Simple Auth System
function setupAuth() {
    console.log('🔐 Setting up auth system...');
    
    const userBtn = document.querySelector('.seller-btn');
    const userDropdown = document.querySelector('.seller-dropdown');
    
    if (!userBtn || !userDropdown) return;
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    if (isLoggedIn) {
        userBtn.innerHTML = `
            <i class="fas fa-user-circle"></i>
            <span class="seller-text">${userData.username || 'User'}</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        userDropdown.innerHTML = `
            <a href="#" class="user-profile">
                <i class="fas fa-user"></i>
                My Profile
            </a>
            <a href="#" class="order-history">
                <i class="fas fa-history"></i>
                Order History
            </a>
            <a href="#" class="seller-logout">
                <i class="fas fa-sign-out-alt"></i>
                Logout
            </a>
        `;
    } else if (isGuest) {
        userBtn.innerHTML = `
            <i class="fas fa-user"></i>
            <span class="seller-text">Guest</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        userDropdown.innerHTML = `
            <a href="#" class="seller-logout">
                <i class="fas fa-sign-out-alt"></i>
                Exit Guest
            </a>
        `;
    } else {
        userBtn.innerHTML = `
            <i class="fas fa-user-shield"></i>
            <span class="seller-text">Account</span>
            <i class="fas fa-chevron-down"></i>
        `;
        
        userDropdown.innerHTML = `
            <a href="login.html" class="seller-login" id="sellerLogin">
                <i class="fas fa-sign-in-alt"></i>
                Login / Signup
            </a>
        `;
    }
    
    setupGuestNotification();
}

// Notification system
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 500;
        background: ${type === 'success' ? 'rgba(46, 204, 113, 0.9)' : 'rgba(231, 76, 60, 0.9)'};
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        z-index: 10000;
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Guest Notification System
function showGuestNotification() {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    if (isGuest) {
        const notification = document.createElement('div');
        notification.className = 'guest-notification-banner';
        notification.innerHTML = `
            <div class="laser-progress"></div>
            <div class="notification-content">
                <div class="notification-text">
                    <i class="fas fa-info-circle"></i>
                    <span>Create a free account to manage orders, track your history, and cancel anytime with ease!</span>
                </div>
                <div class="notification-actions">
                    <button class="close-notification" title="Dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 500);
        
        // Close button
        const closeBtn = notification.querySelector('.close-notification');
        closeBtn.addEventListener('click', () => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        });
        
        // Auto dismiss
        setTimeout(() => {
            if (notification.parentNode) {
                notification.classList.remove('show');
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 12000);
    }
}

function setupGuestNotification() {
    setTimeout(() => {
        showGuestNotification();
    }, 1000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏁 DOM fully loaded - initializing...');
    
    // Setup auth system
    setupAuth();
    
    // Initialize shopping cart
    window.cart = new ShoppingCart();
    
    console.log('✅ Cake Corner - All systems ready!');
});

// Add this method to your ShoppingCart class:
setupCustomCakeModal() {
    const startCustomizingBtn = document.getElementById('startCustomizing');
    const closeCustomModal = document.getElementById('closeCustomModal');
    const customCakeModal = document.getElementById('customCakeModal');
    const customCakeModalBody = document.querySelector('.custom-cake-modal-body');
    const customForm = document.getElementById('customCakeForm');

    if (startCustomizingBtn && customCakeModal) {
        startCustomizingBtn.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                // Mobile: Show modal
                customCakeModal.classList.add('show');
                document.body.style.overflow = 'hidden';
                
                // Move form to modal if not already there
                if (customForm && !customForm.closest('.custom-cake-modal-body')) {
                    customCakeModalBody.innerHTML = '';
                    customCakeModalBody.appendChild(customForm);
                    customForm.classList.remove('hidden');
                }
            } else {
                // Desktop: Original behavior
                this.showCustomForm();
            }
        });
    }

    if (closeCustomModal && customCakeModal) {
        closeCustomModal.addEventListener('click', () => {
            customCakeModal.classList.remove('show');
            document.body.style.overflow = '';
        });

        // Close modal when clicking outside
        customCakeModal.addEventListener('click', (e) => {
            if (e.target === customCakeModal) {
                customCakeModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });

        // Close modal with escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && customCakeModal.classList.contains('show')) {
                customCakeModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
}

// Then call this method in your init():
// Add this line inside your ShoppingCart init() method:
this.setupCustomCakeModal();
