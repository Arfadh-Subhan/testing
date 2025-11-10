// main-script.js - UPDATED VERSION

// Debug: Check what's loading
console.log('🚀 main-script.js loaded');

// Configuration
const CONFIG = {
    whatsappNumber: '+94781218767',
    companyName: 'Cake Corner', 
    currency: 'LKR'
};

// Storage Keys
const ORDER_HISTORY_STORAGE_KEY = 'cakeCornerOrderHistory';

// Products Data with local images - ALL 8 CAKES
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
const CAKES_PER_PAGE = 6; // 3x2 grid
const TOTAL_PAGES = Math.ceil(PRODUCTS.length / CAKES_PER_PAGE);

// Custom Cakes Section Elements
const customCakeForm = document.getElementById('customCakeForm');
const startCustomizingBtn = document.getElementById('startCustomizing');
const backBtn = document.getElementById('backBtn');
const customFormContainer = document.getElementById('customFormContainer');
const customCakesSection = document.querySelector('.custom-cakes-section');

// Background Image Configuration
const BACKGROUND_CONFIG = {
    imageUrl: 'images/chocolatecake.jpeg',
    fallbackUrl: 'https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
};

// Order History Functions
function saveOrderToHistory(orderData) {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData.username;
    
    if (!username) {
        console.log('❌ No user logged in, order not saved to history');
        return;
    }
    
    try {
        const orderHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) || '{}');
        
        if (!orderHistory[username]) {
            orderHistory[username] = [];
        }
        
        orderHistory[username].unshift({
            ...orderData,
            orderId: 'ORD' + Date.now(),
            date: new Date().toISOString(),
            status: 'pending'
        });
        
        // Keep only last 50 orders
        if (orderHistory[username].length > 50) {
            orderHistory[username] = orderHistory[username].slice(0, 50);
        }
        
        localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
        console.log('💾 Order saved to history for user:', username);
    } catch (e) {
        console.error('❌ Error saving order history:', e);
    }
}

function getOrderHistory() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData.username;
    
    if (!username) {
        return [];
    }
    
    try {
        const orderHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) || '{}');
        return orderHistory[username] || [];
    } catch (e) {
        console.error('❌ Error reading order history:', e);
        return [];
    }
}

// Calculate total spent from order history (excluding cancelled orders)
function calculateTotalSpent() {
    const orders = getOrderHistory();
    return orders
        .filter(order => order.status !== 'cancelled')
        .reduce((total, order) => total + order.total, 0);
}

// Count non-cancelled orders
function countActiveOrders() {
    const orders = getOrderHistory();
    return orders.filter(order => order.status !== 'cancelled').length;
}

// Simple Auth System
function setupAuth() {
    console.log('🔐 Setting up auth system...');
    
    const userBtn = document.querySelector('.seller-btn');
    const userDropdown = document.querySelector('.seller-dropdown');
    
    if (!userBtn || !userDropdown) {
        console.error('❌ User menu elements not found!');
        return;
    }
    
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const isGuest = localStorage.getItem('isGuest') === 'true';
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    
    console.log('🔍 Auth status:', { isLoggedIn, isGuest, userData });
    
    // Update UI based on auth status
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

    // Setup dropdown manager
    setupDropdownManager();
    
    // ADD THIS LINE - Setup guest notification
    setupGuestNotification();
}

// Mobile Dropdown Manager
function setupDropdownManager() {
    const userBtn = document.querySelector('.seller-btn');
    const userDropdown = document.querySelector('.seller-dropdown');
    let currentDropdown = null;

    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (currentDropdown === userDropdown) {
                userDropdown.classList.remove('show');
                currentDropdown = null;
            } else {
                // Close any other dropdowns
                if (currentDropdown) {
                    currentDropdown.classList.remove('show');
                }
                userDropdown.classList.add('show');
                currentDropdown = userDropdown;
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        if (currentDropdown) {
            currentDropdown.classList.remove('show');
            currentDropdown = null;
        }
    });

    // Close dropdowns on mobile scroll
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 768 && currentDropdown) {
            currentDropdown.classList.remove('show');
            currentDropdown = null;
        }
    });
}

// Show User Profile Modal
function showUserProfile() {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const modalBody = document.getElementById('modalBody');
    
    if (!modalBody) return;
    
    const activeOrders = countActiveOrders();
    const totalSpent = calculateTotalSpent();
    
    modalBody.innerHTML = `
        <div class="user-profile-modal">
            <div class="profile-header">
                <div class="profile-avatar">
                    <i class="fas fa-user-circle"></i>
                </div>
                <h2>My Profile</h2>
            </div>
            
            <div class="profile-info">
                <div class="info-item">
                    <label>Username:</label>
                    <span>${userData.username || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>Full Name:</label>
                    <span>${userData.name || 'N/A'}</span>
                </div>
                <div class="info-item">
                    <label>Account Status:</label>
                    <span class="status-active">Active</span>
                </div>
                <div class="info-item">
                    <label>Member Since:</label>
                    <span>${userData.signupDate ? new Date(userData.signupDate).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
            
            <div class="profile-stats">
                <div class="stat-card">
                    <div class="stat-number">${activeOrders}</div>
                    <div class="stat-label">Active Orders</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${CONFIG.currency}${totalSpent.toLocaleString()}</div>
                    <div class="stat-label">Total Spent</div>
                </div>
            </div>
        </div>
    `;
    
    window.cart.showModal();
}

// Show Order History Modal
function showOrderHistory() {
    const orders = getOrderHistory();
    const modalBody = document.getElementById('modalBody');
    
    if (!modalBody) return;
    
    const activeOrders = countActiveOrders();
    
    if (orders.length === 0) {
        modalBody.innerHTML = `
            <div class="order-history-modal">
                <div class="order-history-header">
                    <h2>Order History</h2>
                </div>
                <div class="empty-orders">
                    <i class="fas fa-shopping-bag"></i>
                    <h3>No Orders Yet</h3>
                    <p>Your order history will appear here after you place your first order.</p>
                    <button class="btn btn-primary" onclick="window.cart.closeModal(); document.getElementById('products').scrollIntoView({ behavior: 'smooth' })">
                        Start Shopping
                    </button>
                </div>
            </div>
        `;
    } else {
        modalBody.innerHTML = `
            <div class="order-history-modal">
                <div class="order-history-header">
                    <h2>Order History</h2>
                    <div class="order-count">${activeOrders} active order(s)</div>
                </div>
                
                <div class="orders-list">
                    ${orders.map(order => {
                        const orderDate = new Date(order.date);
                        const now = new Date();
                        const hoursDiff = (now - orderDate) / (1000 * 60 * 60);
                        const canCancel = hoursDiff <= 24 && order.status !== 'cancelled';
                        
                        return `
                        <div class="order-item">
                            <div class="order-header">
                                <div class="order-info">
                                    <div class="order-id">Order #${order.orderId}</div>
                                    <div class="order-date">${orderDate.toLocaleDateString()} ${orderDate.toLocaleTimeString()}</div>
                                </div>
                                <div class="order-status ${order.status}">${order.status}</div>
                            </div>
                            
                            <div class="order-items">
                                ${order.items.map(item => `
                                    <div class="order-product">
                                        <span class="product-name">${item.name}</span>
                                        <span class="product-quantity">x${item.quantity}</span>
                                        <span class="product-price">${CONFIG.currency}${(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                `).join('')}
                            </div>
                            
                            <div class="order-footer">
                                <div class="order-total">
                                    Total: ${CONFIG.currency}${order.total.toLocaleString()}
                                </div>
                            </div>
                            
                            ${canCancel ? `
                            <div class="order-actions">
                                <button class="cancel-btn" onclick="showCancellationConfirmation('${order.orderId}')">
                                    <i class="fas fa-times-circle"></i>
                                    Cancel Order
                                </button>
                                <div class="cancel-time-left">
                                    ${Math.floor(24 - hoursDiff)}h ${Math.floor((24 - hoursDiff) * 60) % 60}m left to cancel
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }
    
    window.cart.showModal();
}

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
        } else {
            console.error('❌ Cart toggle not found!');
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

        // Handle menu clicks
        document.addEventListener('click', (e) => {
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
                console.log('🚪 Logout clicked');
                
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('isGuest');
                localStorage.removeItem('user');
                
                showNotification('Logged out successfully!');
                
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            }

            if (e.target.closest('.seller-login')) {
                e.preventDefault();
                window.location.href = 'login.html';
            }
        });
    }

    setupMobileMenu() {
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('mobile-show');
                mobileToggle.classList.toggle('active');
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

    setupCustomCakes() {
        console.log('🔧 Setting up custom cakes section event listeners...');
        
        if (startCustomizingBtn) {
            startCustomizingBtn.addEventListener('click', this.showCustomForm.bind(this));
        } else {
            console.error('❌ Start customizing button not found!');
        }
        
        if (backBtn) {
            backBtn.addEventListener('click', this.hideCustomForm.bind(this));
        } else {
            console.error('❌ Back button not found!');
        }
        
        if (customCakeForm) {
            customCakeForm.addEventListener('submit', this.handleCustomOrderSubmit.bind(this));
        } else {
            console.error('❌ Custom cake form not found!');
        }
        
        // Close form when clicking outside (mobile)
        if (window.innerWidth <= 768) {
            document.addEventListener('click', (e) => {
                if (customCakesSection.classList.contains('form-active') && 
                    !customFormContainer.contains(e.target) && 
                    e.target !== startCustomizingBtn &&
                    !e.target.closest('.start-customizing-btn')) {
                    this.hideCustomForm();
                }
            });
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
        img.src = BACKGROUND_CONFIG.imageUrl;
        
        img.onload = function() {
            backgroundElement.style.backgroundImage = `url('${BACKGROUND_CONFIG.imageUrl}')`;
            console.log('✅ Custom background image loaded successfully');
        };
        
        img.onerror = function() {
            backgroundElement.style.backgroundImage = `url('${BACKGROUND_CONFIG.fallbackUrl}')`;
            console.log('⚠️ Using fallback background image');
        };
    }

    switchToDesignText() {
        const originalText = document.querySelector('.original-text');
        const designText = document.querySelector('.design-text');
        
        originalText.classList.add('exiting');
        setTimeout(() => {
            originalText.classList.remove('active', 'exiting');
            designText.classList.add('active');
        }, 200);
    }

    switchToOriginalText() {
        const originalText = document.querySelector('.original-text');
        const designText = document.querySelector('.design-text');
        
        designText.classList.add('exiting');
        setTimeout(() => {
            designText.classList.remove('active', 'exiting');
            originalText.classList.add('active');
        }, 200);
    }

    animateFloatingCakesOut() {
        console.log('🎂 Animating floating cakes out');
        
        const floatingCakes = document.querySelectorAll('.cake-card');
        
        floatingCakes.forEach((cake, index) => {
            // Stagger the animations
            setTimeout(() => {
                cake.classList.add('exit-animation');
            }, index * 200);
        });
        
        // Remove cakes from DOM after animation completes
        setTimeout(() => {
            const floatingCakesContainer = document.querySelector('.floating-cakes');
            if (floatingCakesContainer) {
                floatingCakesContainer.style.display = 'none';
            }
        }, 1500);
    }

    resetFloatingCakes() {
        console.log('🔄 Resetting floating cakes');
        
        const floatingCakesContainer = document.querySelector('.floating-cakes');
        if (floatingCakesContainer) {
            floatingCakesContainer.style.display = 'block';
        }
        
        const floatingCakes = document.querySelectorAll('.cake-card');
        floatingCakes.forEach(cake => {
            cake.classList.remove('exit-animation');
        });
    }

    showCustomForm() {
        console.log('🎂 Showing custom form');
        
        if (window.innerWidth <= 768) {
            // Mobile: Fixed right sidebar
            customCakesSection.classList.add('form-active');
            this.switchToDesignText();
            this.animateFloatingCakesOut();
            
            // Prevent body scrolling when form is open on mobile
            document.body.style.overflow = 'hidden';
            
            // Add escape key listener
            this.escapeHandler = this.handleEscapeKey.bind(this);
            document.addEventListener('keydown', this.escapeHandler);
        } else {
            // Desktop: Original behavior
            customCakesSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start'
            });
            
            setTimeout(() => {
                customCakesSection.classList.add('form-active');
                this.switchToDesignText();
                this.animateFloatingCakesOut();
                document.body.style.overflow = 'hidden';
                this.escapeHandler = this.handleEscapeKey.bind(this);
                document.addEventListener('keydown', this.escapeHandler);
            }, 800);
        }
    }

    hideCustomForm() {
        console.log('❌ Hiding custom form');
        customCakesSection.classList.remove('form-active');
        this.switchToOriginalText();
        this.resetFloatingCakes();
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Remove escape key listener
        if (this.escapeHandler) {
            document.removeEventListener('keydown', this.escapeHandler);
        }
    }

    handleEscapeKey(e) {
        if (e.key === 'Escape') {
            this.hideCustomForm();
        }
    }

    handleCustomOrderSubmit(e) {
        e.preventDefault();
        console.log('📝 Custom cake form submitted');
        
        // Get form data
        const formData = new FormData(customCakeForm);
        const orderData = {
            flavor: formData.get('flavor'),
            occasion: formData.get('occasion'),
            size: formData.get('size'),
            toppings: Array.from(formData.getAll('toppings')),
            writing: formData.get('writing'),
            allergies: formData.get('allergies'),
            deliveryDate: formData.get('delivery-date'),
            customDesign: formData.get('custom-design'),
            budget: formData.get('budget')
        };
        
        console.log('📨 Custom order data:', orderData);
        
        // Validate required fields
        if (!orderData.flavor || !orderData.occasion || !orderData.size || !orderData.deliveryDate) {
            alert('❌ Please fill in all required fields');
            return;
        }
        
        // Format and send WhatsApp message
        const message = this.formatCustomOrderMessage(orderData);
        const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
        
        // Show immediate alert
        alert('📱 Opening WhatsApp... Your order details are ready!');
        
        // Open WhatsApp in new tab
        window.open(url, '_blank');
        
        // Save custom order to history if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const customOrderData = {
                items: [{
                    name: `Custom Cake - ${this.getDisplayValue(orderData.flavor)}`,
                    price: this.estimateCustomCakePrice(orderData),
                    quantity: 1
                }],
                total: this.estimateCustomCakePrice(orderData) + 500,
                deliveryFee: 500,
                type: 'custom',
                customDetails: orderData
            };
            saveOrderToHistory(customOrderData);
        }
        
        // Reset form and hide it
        setTimeout(() => {
            customCakeForm.reset();
            this.hideCustomForm();
            
            // 🎉 SHOW SUCCESS ALERT AFTER FORM CLOSES
            setTimeout(() => {
                alert('🎉 Order sent successfully!\n\nWe have received your custom cake order and will contact you soon!');
            }, 500);
        }, 1000);
    }

    estimateCustomCakePrice(orderData) {
        // Simple price estimation based on size and budget
        const sizePrices = {
            'small': 3000,
            'medium': 5000,
            'large': 7000,
            'x-large': 9000
        };
        
        const budgetPrices = {
            'under-3000': 2500,
            '3000-5000': 4000,
            '5000-8000': 6500,
            '8000-12000': 10000,
            'over-12000': 15000
        };
        
        const basePrice = sizePrices[orderData.size] || 5000;
        const budgetPrice = budgetPrices[orderData.budget];
        
        // Use budget price if available, otherwise use size-based price
        return budgetPrice || basePrice;
    }

    formatCustomOrderMessage(orderData) {
        let message = `🎂 *CUSTOM CAKE ORDER - ${CONFIG.companyName}* 🎂\n\n`;
        message += `Hello! I would like to place a custom cake order:\n\n`;
        
        message += `*Order Details:*\n`;
        message += `• Flavor: ${this.getDisplayValue(orderData.flavor)}\n`;
        message += `• Occasion: ${this.getDisplayValue(orderData.occasion)}\n`;
        message += `• Size: ${this.getDisplayValue(orderData.size)}\n`;
        
        if (orderData.toppings && orderData.toppings.length > 0) {
            message += `• Toppings: ${orderData.toppings.map(t => this.getDisplayValue(t)).join(', ')}\n`;
        }
        
        if (orderData.writing) {
            message += `• Special Writing: "${orderData.writing}"\n`;
        }
        
        if (orderData.allergies) {
            message += `• Allergies/Dietary: ${orderData.allergies}\n`;
        }
        
        message += `• Delivery Date: ${this.formatDate(orderData.deliveryDate)}\n`;
        
        if (orderData.budget) {
            message += `• Budget: ${this.getDisplayValue(orderData.budget)}\n`;
        }
        
        message += `\n*Custom Design Details:*\n`;
        message += `${orderData.customDesign || 'No specific design details provided.'}\n\n`;
        
        message += `Please confirm if you can create this custom cake and provide a quote.\n\n`;
        message += `Thank you! 🍰`;
        
        return message;
    }

    getDisplayValue(value) {
        const displayMap = {
            'vanilla': 'Vanilla',
            'chocolate': 'Chocolate',
            'red-velvet': 'Red Velvet',
            'strawberry': 'Strawberry',
            'lemon': 'Lemon',
            'carrot': 'Carrot',
            'coffee': 'Coffee',
            'other': 'Other',
            'birthday': 'Birthday',
            'wedding': 'Wedding',
            'anniversary': 'Anniversary',
            'baby-shower': 'Baby Shower',
            'graduation': 'Graduation',
            'corporate': 'Corporate Event',
            'small': 'Small (6-8 servings)',
            'medium': 'Medium (10-12 servings)',
            'large': 'Large (15-20 servings)',
            'x-large': 'Extra Large (25+ servings)',
            'fresh-fruit': 'Fresh Fruit',
            'chocolate': 'Chocolate Decorations',
            'flowers': 'Edible Flowers',
            'sprinkles': 'Sprinkles',
            'fondant': 'Fondant Figures',
            'under-3000': 'Under LKR 3,000',
            '3000-5000': 'LKR 3,000 - 5,000',
            '5000-8000': 'LKR 5,000 - 8,000',
            '8000-12000': 'LKR 8,000 - 12,000',
            'over-12000': 'Over LKR 12,000'
        };
        
        return displayMap[value] || value;
    }

    formatDate(dateString) {
        if (!dateString) return 'Not specified';
        
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
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
                    
                    // Update active nav link
                    this.updateActiveNavLink(targetId);
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
                
                // Update active nav link on scroll
                this.updateActiveNavOnScroll();
            });
        }
        
        // Initialize active nav link
        this.updateActiveNavOnScroll();
    }

    // NEW METHOD: Update active nav link based on scroll position
    updateActiveNavOnScroll() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.updateActiveNavLink('#' + sectionId);
            }
        });
    }

    // NEW METHOD: Update active nav link
    updateActiveNavLink(targetId) {
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Add active class to current section's nav link
        const activeLink = document.querySelector(`.nav-link[href="${targetId}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }

    renderProducts() {
        console.log('🎨 Rendering products...');
        const grid = document.getElementById('productsGrid');
        if (!grid) {
            console.error('❌ Products grid not found!');
            return;
        }

        // Clear the grid
        grid.innerHTML = '';

        // Calculate which products to show
        const startIndex = currentPage * CAKES_PER_PAGE;
        const endIndex = Math.min(startIndex + CAKES_PER_PAGE, PRODUCTS.length);
        const productsToShow = PRODUCTS.slice(startIndex, endIndex);

        // Render products for current page
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
        
        console.log(`✅ Page ${currentPage + 1}/${TOTAL_PAGES} rendered: ${productsToShow.length} products`);
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
        this.showAddAnimation(productId);
        
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

    showAddAnimation(productId) {
        const button = document.querySelector(`[data-id="${productId}"]`);
        if (!button) return;

        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Added!';
        button.style.background = '#2ECC71';
        
        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.style.background = '';
        }, 1500);
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
        const modalContainer = document.querySelector('.modal-container');
        
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
        
        // Remove cancellation modal class when closing any modal
        if (modalContainer) {
            modalContainer.classList.remove('cancellation-modal-active');
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
        
        // Save order to history if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (isLoggedIn) {
            const orderData = {
                items: [...this.items],
                total: this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 500,
                deliveryFee: 500,
                type: 'regular'
            };
            saveOrderToHistory(orderData);
        }
        
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

// Order Cancellation System
function showCancellationConfirmation(orderId) {
    const order = getOrderById(orderId);
    if (!order) return;
    
    const modalBody = document.getElementById('modalBody');
    if (!modalBody) return;
    
    modalBody.innerHTML = `
        <div class="cancellation-modal">
            <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <h3>Cancel Order?</h3>
            <p>Are you sure you want to cancel order <strong>${orderId}</strong>? This action cannot be undone.</p>
            <div class="cancellation-actions">
                <button class="confirm-cancel-btn" onclick="confirmOrderCancellation('${orderId}')">
                    Yes, Cancel Order
                </button>
                <button class="cancel-cancel-btn" onclick="closeCancellationModal()">
                    Keep Order
                </button>
            </div>
        </div>
    `;
    
    // Create a unique class for cancellation modal only
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.classList.add('cancellation-modal-active');
    }
    
    window.cart.showModal();
}

// New function to handle cancellation modal close
function closeCancellationModal() {
    const modalContainer = document.querySelector('.modal-container');
    if (modalContainer) {
        modalContainer.classList.remove('cancellation-modal-active');
    }
    window.cart.closeModal();
}

function confirmOrderCancellation(orderId) {
    const order = getOrderById(orderId);
    if (!order) return;
    
    // Update order status
    updateOrderStatus(orderId, 'cancelled');
    
    // Send WhatsApp message
    sendCancellationWhatsApp(order);
    
    // Show success message
    showNotification('Order cancelled successfully!');
    
    // Close modal and refresh order history
    closeCancellationModal();
    setTimeout(() => {
        showOrderHistory();
    }, 500);
}

function getOrderById(orderId) {
    const orders = getOrderHistory();
    return orders.find(order => order.orderId === orderId);
}

function updateOrderStatus(orderId, status) {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const username = userData.username;
    
    if (!username) return;
    
    try {
        const orderHistory = JSON.parse(localStorage.getItem(ORDER_HISTORY_STORAGE_KEY) || '{}');
        
        if (orderHistory[username]) {
            const orderIndex = orderHistory[username].findIndex(order => order.orderId === orderId);
            if (orderIndex !== -1) {
                orderHistory[username][orderIndex].status = status;
                localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orderHistory));
                console.log('✅ Order status updated:', orderId, status);
            }
        }
    } catch (e) {
        console.error('❌ Error updating order status:', e);
    }
}

function sendCancellationWhatsApp(order) {
    let message = `❌ *ORDER CANCELLATION - ${CONFIG.companyName}* ❌\n\n`;
    message += `Order ID: ${order.orderId}\n`;
    message += `Cancelled at: ${new Date().toLocaleString()}\n\n`;
    
    message += `*Cancelled Items:*\n`;
    order.items.forEach((item, index) => {
        message += `${index + 1}. ${item.name} x${item.quantity} - ${CONFIG.currency}${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    message += `\n*Order Total: ${CONFIG.currency}${order.total.toLocaleString()}*\n\n`;
    message += `Customer has cancelled this order.\n`;
    message += `Please update your records accordingly.`;
    
    const url = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
}

// ===== GUEST NOTIFICATION SYSTEM =====
function showGuestNotification() {
    const isGuest = localStorage.getItem('isGuest') === 'true';
    
    console.log('🔍 Guest Notification Debug:', {
        isGuest: isGuest,
        localStorage_isGuest: localStorage.getItem('isGuest')
    });
    
    // Show for guest users every time they visit the page
    if (isGuest) {
        console.log('✅ Showing guest notification...');
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'guest-notification-banner';
        notification.innerHTML = `
            <div class="laser-progress"></div>
            <div class="notification-content">
                <div class="notification-text">
                    <i class="fas fa-info-circle"></i>
                    <span>Create a free account to manage orders, track your history, and cancel anytime with ease !</span>
                </div>
                <div class="notification-actions">
                    <button class="close-notification" title="Dismiss">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show with animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 500);
        
        // Setup scroll behavior (same as navbar)
        setupNotificationScroll(notification);
        
        // Setup event listeners
        setupNotificationEvents(notification);
        
        // Auto dismiss after 12 seconds
        setTimeout(() => {
            dismissNotification(notification);
        }, 12000);
    } else {
        console.log('❌ Not showing guest notification - user is not guest');
    }
}

function setupNotificationScroll(notification) {
    // Same scroll behavior as navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            notification.classList.add('scrolled');
        } else {
            notification.classList.remove('scrolled');
        }
    });
}

function setupNotificationEvents(notification) {
    // Close button
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.addEventListener('click', () => {
        dismissNotification(notification);
    });
    
    // Close when clicking outside (optional)
    notification.addEventListener('click', (e) => {
        if (e.target === notification) {
            dismissNotification(notification);
        }
    });
}

function dismissNotification(notification) {
    notification.classList.remove('show');
    
    // Remove from DOM after animation
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Call this function from your existing auth setup
function setupGuestNotification() {
    // Wait a bit for page to load completely
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
    
    // Test function - can run in console
    window.testAddToCart = () => {
        window.cart.addToCart(1);
    };
});
