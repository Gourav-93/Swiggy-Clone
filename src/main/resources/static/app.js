/**
 * Foodie Elite - Application Core Logic
 */

// API Configuration
const API_BASE = 'http://localhost:8080/api'; // Standard Spring Boot local URL

// State Management
let state = {
    currentUser: JSON.parse(localStorage.getItem('user')) || null,
    cartItems: [],
    allFoods: [],
    activeCategory: 'all',
    isLoading: false
};

// DOM Elements Mapping
const dom = {
    homeSection: document.getElementById('home-section'),
    loginSection: document.getElementById('login-section'),
    cartSection: document.getElementById('cart-section'),
    foodGrid: document.getElementById('food-items-grid'),
    categoryList: document.getElementById('category-tabs-list'),
    cartContent: document.getElementById('cart-items-container'),
    cartCountBadge: document.getElementById('cart-count-badge'),
    navLoginWrapper: document.getElementById('nav-login-wrapper'),
    navUserProfile: document.getElementById('nav-user-profile'),
    userDisplayName: document.getElementById('user-display-name'),
    foodModal: document.getElementById('item-detail-modal'),
    modalContent: document.getElementById('modal-content-container'),
    mainHeader: document.getElementById('main-header'),
    resultsCount: document.getElementById('results-count'),
    loginForm: document.getElementById('login-form-box'),
    registerForm: document.getElementById('register-form-box')
};

// --- Initialization ---

document.addEventListener('DOMContentLoaded', async () => {
    console.log('Foodie Elite Initializing...');
    await init();
});

async function init() {
    updateAuthUI();
    setupEventListeners();
    
    // Initial data fetch
    setLoading(true);
    await Promise.all([
        fetchFoods(),
        fetchCategories()
    ]);
    
    if (state.currentUser) {
        await fetchCart();
    }
    setLoading(false);
}

function setupEventListeners() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            dom.mainHeader.classList.add('scrolled');
        } else {
            dom.mainHeader.classList.remove('scrolled');
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // Close modal on outside click
    window.onclick = (e) => {
        if (e.target === dom.foodModal) closeModal();
    };
}

// --- Loading State Handler ---

function setLoading(loading) {
    state.isLoading = loading;
    if (loading) {
        dom.foodGrid.innerHTML = `
            <div class="loading-state" style="grid-column: 1/-1; text-align: center; padding: 10rem 0;">
                <div class="loading-spinner" style="margin: 0 auto 2rem;"></div>
                <p style="color: var(--text-muted); font-weight: 600; letter-spacing: 1px;">PREPARING YOUR GOURMET EXPERIENCE...</p>
            </div>
        `;
    }
}

// --- Auth Operations ---

function updateAuthUI() {
    if (state.currentUser) {
        dom.navLoginWrapper.style.display = 'none';
        dom.navUserProfile.style.display = 'flex';
        const name = state.currentUser.name ? state.currentUser.name.split(' ')[0] : 'Member';
        dom.userDisplayName.textContent = `Elite: ${name}`;
    } else {
        dom.navLoginWrapper.style.display = 'block';
        dom.navUserProfile.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const user = await res.json();
            state.currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            showNotification('Access Granted. Welcome to Foodie Elite.', 'success');
            updateAuthUI();
            showSection('home');
            await fetchCart();
        } else {
            const err = await res.json();
            showNotification(err.message || 'Authorization failed.', 'error');
        }
    } catch (err) {
        showNotification('Connection refused by the server.', 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        if (res.ok) {
            showNotification('Identity Created. Please Sign In.', 'success');
            toggleAuth('login');
        } else {
            const err = await res.json();
            showNotification(err.message || 'Registration error.', 'error');
        }
    } catch (err) {
        showNotification('Server communication failure.', 'error');
    }
}

function logout() {
    state.currentUser = null;
    state.cartItems = [];
    localStorage.removeItem('user');
    updateCartBadge();
    updateAuthUI();
    showSection('home');
    showNotification('Logged out from Elite network.', 'success');
}

function toggleAuth(type) {
    if (type === 'register') {
        dom.loginForm.style.display = 'none';
        dom.registerForm.style.display = 'block';
    } else {
        dom.loginForm.style.display = 'block';
        dom.registerForm.style.display = 'none';
    }
}

// --- Menu Operations ---

async function fetchFoods() {
    try {
        const res = await fetch(`${API_BASE}/foods`);
        if (!res.ok) throw new Error('Failed to fetch foods');
        state.allFoods = await res.json();
        renderFoods(state.allFoods);
    } catch (err) {
        dom.foodGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 10rem 0;">
                <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: var(--danger); margin-bottom: 2rem;"></i>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">Culinary Network Unavailable</h3>
                <p style="color: var(--text-muted);">Please verify your connection to the elite network.</p>
                <button class="auth-btn" style="width: auto; padding: 1rem 2rem; margin-top: 2rem;" onclick="location.reload()">Retry Connection</button>
            </div>
        `;
    }
}

async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/foods/categories`);
        if (!res.ok) return;
        const categories = await res.json();
        renderCategories(categories);
    } catch (err) {
        console.error('Category fetch failed');
    }
}

function renderCategories(categories) {
    // Normalize and de-duplicate categories
    const normalized = Array.from(new Set(categories.map(c => c.trim())));
    
    const html = [`<div class="category-item ${state.activeCategory === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">All Delicacies</div>`];
    
    normalized.forEach(cat => {
        if (cat) {
            html.push(`<div class="category-item ${state.activeCategory === cat ? 'active' : ''}" onclick="filterByCategory('${cat}')">${cat}</div>`);
        }
    });
    
    dom.categoryList.innerHTML = html.join('');
}

function renderFoods(foods) {
    if (foods.length === 0) {
        dom.foodGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 10rem 0;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--surface-hover); margin-bottom: 2rem;"></i>
                <h3 style="font-size: 1.5rem; margin-bottom: 1rem;">No matching delicacies found</h3>
                <p style="color: var(--text-muted);">Try broadening your search criteria.</p>
            </div>
        `;
        dom.resultsCount.textContent = '0 items matched';
        return;
    }

    dom.resultsCount.textContent = `${foods.length} masterworks curated`;
    dom.foodGrid.innerHTML = foods.map((food, index) => `
        <div class="food-card slide-up" style="animation-delay: ${index * 0.05}s" onclick="openModal(${food.id})">
            <div class="card-img-wrapper">
                <span class="card-tag">${food.type}</span>
                <img src="${getImageUrl(food)}" alt="${food.name}" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
            </div>
            <div class="food-info">
                <h3>${food.name}</h3>
                <p>${food.description}</p>
                <div class="food-footer">
                    <span class="price">₹${food.price}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${food.id})">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function getImageUrl(food) {
    if (food.image && (food.image.startsWith('http') || food.image.startsWith('/'))) return food.image;
    // Specific Fallbacks
    if (food.type === 'Pizza') return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80';
    if (food.type === 'Burger') return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
}

function searchFood() {
    const query = document.getElementById('food-search-input').value.toLowerCase();
    if (query.trim() === '') {
        filterByCategory(state.activeCategory);
        return;
    }
    
    const results = state.allFoods.filter(f => 
        (f.name && f.name.toLowerCase().includes(query)) || 
        (f.description && f.description.toLowerCase().includes(query)) ||
        (f.type && f.type.toLowerCase().includes(query))
    );
    renderFoods(results);
}

async function filterByCategory(category) {
    state.activeCategory = category;
    
    // Update category UI
    document.querySelectorAll('.category-item').forEach(item => {
        const text = item.textContent.trim();
        if (text === category || (category === 'all' && text === 'All Delicacies')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    if (category === 'all') {
        renderFoods(state.allFoods);
        return;
    }

    try {
        setLoading(true);
        const res = await fetch(`${API_BASE}/foods/type/${category}`);
        if (!res.ok) throw new Error('Filter fetch failed');
        const results = await res.json();
        renderFoods(results);
        setLoading(false);
    } catch (err) {
        console.error('Filter failed', err);
        // Fallback to client-side filtering if API fails
        const results = state.allFoods.filter(f => f.type === category);
        renderFoods(results);
        setLoading(false);
    }
}

// --- Cart Operations ---

async function fetchCart() {
    if (!state.currentUser) return;
    try {
        const res = await fetch(`${API_BASE}/cart/user/${state.currentUser.id}`);
        state.cartItems = await res.json();
        updateCartBadge();
        if (dom.cartSection.style.display === 'block') {
            renderCart();
        }
    } catch (err) {
        console.error('Cart fetch failure');
    }
}

async function addToCart(foodId) {
    if (!state.currentUser) {
        showNotification('Elite membership required to order.', 'error');
        showSection('login');
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: state.currentUser.id,
                foodId: foodId,
                quantity: 1
            })
        });

        if (res.ok) {
            showNotification('Added to your elite selection.', 'success');
            await fetchCart();
            closeModal();
        }
    } catch (err) {
        showNotification('Service interruption.', 'error');
    }
}

async function removeFromCart(id) {
    try {
        const res = await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showNotification('Selection removed.', 'success');
            await fetchCart();
        }
    } catch (err) {
        showNotification('Operation failed.', 'error');
    }
}

function updateCartBadge() {
    const total = state.cartItems.reduce((acc, item) => acc + item.quantity, 0);
    dom.cartCountBadge.textContent = total;
    dom.cartCountBadge.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
    if (state.cartItems.length === 0) {
        dom.cartContent.innerHTML = `
            <div style="text-align: center; padding: 10rem 0;">
                <div style="font-size: 6rem; color: var(--surface-hover); margin-bottom: 2rem;">
                    <i class="fas fa-shopping-bag"></i>
                </div>
                <h3 style="font-size: 2rem; margin-bottom: 1rem;">Your bag is currently void</h3>
                <p style="color: var(--text-muted); margin-bottom: 4rem;">Explore our curated menu to begin your journey.</p>
                <button class="auth-btn" style="width: auto; padding: 1.4rem 4rem;" onclick="showSection('home')">Browse Elite Menu</button>
            </div>
        `;
        return;
    }

    let total = 0;
    const itemsHtml = state.cartItems.map(item => {
        const food = state.allFoods.find(f => f.id === item.foodId) || { name: 'Exclusive Item', price: 0 };
        total += food.price * item.quantity;
        return `
            <div class="cart-item fade-in">
                <img src="${getImageUrl(food)}" alt="${food.name}">
                <div style="flex: 1;">
                    <h3 style="font-size: 1.8rem; margin-bottom: 0.5rem; font-weight: 900; letter-spacing: -1px;">${food.name}</h3>
                    <span style="color: var(--primary); font-weight: 800; font-size: 1.2rem;">₹${food.price}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 4rem;">
                    <div style="display: flex; align-items: center; gap: 1.5rem;">
                         <span style="font-weight: 800; color: var(--text-dim); font-size: 0.8rem; letter-spacing: 1px;">QTY</span>
                         <span style="font-weight: 900; background: var(--bg); padding: 8px 18px; border-radius: 12px; border: 1px solid var(--border); font-size: 1.1rem;">${item.quantity}</span>
                    </div>
                    <i class="fas fa-trash-alt remove-btn" onclick="removeFromCart(${item.id})"></i>
                </div>
            </div>
        `;
    }).join('');

    dom.cartContent.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 400px; gap: 4rem; align-items: start;">
            <div style="display: flex; flex-direction: column; gap: 1.5rem;">${itemsHtml}</div>
            <div style="background: var(--card); padding: 3.5rem; border-radius: var(--radius-lg); border: 1px solid var(--border); position: sticky; top: 120px;">
                <h3 style="font-size: 2rem; margin-bottom: 2.5rem; border-bottom: 1px solid var(--border); padding-bottom: 1.5rem; font-weight: 900; letter-spacing: -1px;">Summary</h3>
                <div style="display: flex; justify-content: space-between; margin-bottom: 1.2rem;">
                    <span style="color: var(--text-muted); font-weight: 600;">Subtotal</span>
                    <span style="font-weight: 800; font-size: 1.1rem;">₹${total}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 2.5rem;">
                    <span style="color: var(--text-muted); font-weight: 600;">Priority Delivery</span>
                    <span style="color: var(--success); font-weight: 900; letter-spacing: 1px;">COMPLIMENTARY</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3rem; padding-top: 2rem; border-top: 1px dashed var(--border);">
                    <span style="font-size: 1.5rem; font-weight: 900; letter-spacing: -1px;">Investment</span>
                    <span style="font-size: 1.8rem; font-weight: 950; color: var(--primary);">₹${total}</span>
                </div>
                <button class="auth-btn" onclick="placeOrder()">Authorize Checkout</button>
                <div style="text-align: center; margin-top: 2rem; color: var(--text-dim); font-size: 0.8rem; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i class="fas fa-lock"></i> SSL SECURE PROTOCOL
                </div>
            </div>
        </div>
    `;
}

async function placeOrder() {
    if (!state.currentUser) return;
    
    try {
        const res = await fetch(`${API_BASE}/orders/place`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: state.currentUser.id,
                status: 'PROCESSING'
            })
        });

        if (res.ok) {
            showNotification('Order Confirmed. Bon Appétit!', 'success');
            state.cartItems = [];
            updateCartBadge();
            setTimeout(() => {
                showSection('home');
            }, 2500);
        }
    } catch (err) {
        showNotification('Order processing failed.', 'error');
    }
}

// --- Modal Operations ---

function openModal(id) {
    const food = state.allFoods.find(f => f.id === id);
    if (!food) return;

    dom.modalContent.innerHTML = `
        <span class="close-btn" onclick="closeModal()">&times;</span>
        <img src="${getImageUrl(food)}" class="modal-img" style="width: 50%; object-fit: cover;">
        <div class="modal-details" style="flex: 1; padding: 5rem; display: flex; flex-direction: column;">
            <span style="color: var(--primary); font-weight: 800; letter-spacing: 3px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 1rem; display: block;">${food.restaurant || 'ELITE SELECTION'}</span>
            <h2 style="font-size: 3.5rem; margin-bottom: 1.5rem; line-height: 1; font-weight: 900; letter-spacing: -2px;">${food.name}</h2>
            <p style="color: var(--text-muted); margin-bottom: 3.5rem; font-size: 1.2rem; line-height: 1.8; font-weight: 500;">${food.description}</p>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-bottom: 4rem; border-top: 1px solid var(--border); padding-top: 3rem;">
                <div>
                    <span style="color: var(--text-dim); display: block; font-size: 0.75rem; margin-bottom: 0.8rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Category</span>
                    <span style="font-weight: 800; font-size: 1.1rem;">${food.type}</span>
                </div>
                <div>
                    <span style="color: var(--text-dim); display: block; font-size: 0.75rem; margin-bottom: 0.8rem; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Experience</span>
                    <span style="font-weight: 800; font-size: 1.1rem;">25-40 MIN</span>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                <div>
                    <span style="color: var(--text-dim); display: block; font-size: 0.75rem; font-weight: 800; letter-spacing: 1px; margin-bottom: 5px;">VALUE</span>
                    <span class="price" style="font-size: 2.8rem;">₹${food.price}</span>
                </div>
                <button class="auth-btn" style="width: auto; padding: 1.5rem 4rem; border-radius: 20px;" onclick="addToCart(${food.id})">Add To Bag</button>
            </div>
        </div>
    `;
    dom.foodModal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; 
}

function closeModal() {
    dom.foodModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// --- Navigation Operations ---

function showSection(section) {
    dom.homeSection.style.display = 'none';
    dom.loginSection.style.display = 'none';
    dom.cartSection.style.display = 'none';

    if (section === 'home') {
        dom.homeSection.style.display = 'block';
        renderFoods(state.allFoods);
    } else if (section === 'login') {
        dom.loginSection.style.display = 'flex';
    } else if (section === 'cart') {
        dom.cartSection.style.display = 'block';
        renderCart();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showNotification(msg, type) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const div = document.createElement('div');
    div.className = `notification ${type}`;
    div.style.position = 'fixed';
    div.style.bottom = '40px';
    div.style.left = '50%';
    div.style.transform = 'translateX(-50%)';
    div.style.zIndex = '9999';
    
    const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    div.innerHTML = `<i class="fas ${icon}" style="margin-right: 15px;"></i> <span style="letter-spacing: 0.5px;">${msg.toUpperCase()}</span>`;
    
    document.body.appendChild(div);
    
    setTimeout(() => {
        div.style.opacity = '0';
        div.style.transform = 'translate(-50%, 20px)';
        div.style.transition = 'all 0.5s ease';
        setTimeout(() => div.remove(), 500);
    }, 4000);
}
