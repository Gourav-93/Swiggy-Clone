/**
 * Foodie Elite — Application Core Logic
 * Enhanced with premium animations & full backend integration
 */

// ========== API CONFIGURATION ==========
const API_BASE = 'http://localhost:8080/api';

const originalFetch = window.fetch;
window.fetch = async function() {
    let [resource, config] = arguments;
    if (typeof resource === 'string' && resource.includes(API_BASE) && !resource.includes('/auth/') && !resource.includes('/foods')) {
        config = config || {};
        config.headers = config.headers || {};
        if (state.currentUser && state.currentUser.token) {
            config.headers['Authorization'] = `Bearer ${state.currentUser.token}`;
        }
    }
    return originalFetch(resource, config);
};

// ========== STATE ==========
const state = {
    currentUser: (() => { try { return JSON.parse(localStorage.getItem('user')) || null; } catch { return null; } })(),
    cartItems: [],
    allFoods: [],
    activeCategory: 'all',
    isLoading: false,
    currentView: 'grid',
    wishlist: (() => { try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; } })()
};

// ========== DOM ==========
const dom = {};

function bindDom() {
    dom.homeSection    = document.getElementById('home-section');
    dom.loginSection   = document.getElementById('login-section');
    dom.cartSection    = document.getElementById('cart-section');
    dom.foodGrid       = document.getElementById('food-items-grid');
    dom.categoryList   = document.getElementById('category-tabs-list');
    dom.cartContent    = document.getElementById('cart-items-container');
    dom.cartBadge      = document.getElementById('cart-count-badge');
    dom.navLoginWrap   = document.getElementById('nav-login-wrapper');
    dom.navUserProfile = document.getElementById('nav-user-profile');
    dom.userDisplayName= document.getElementById('user-display-name');
    dom.modalOverlay   = document.getElementById('item-detail-modal');
    dom.modalContent   = document.getElementById('modal-content-container');
    dom.mainHeader     = document.getElementById('main-header');
    dom.resultsCount   = document.getElementById('results-count');
    dom.loginFormBox   = document.getElementById('login-form-box');
    dom.registerFormBox= document.getElementById('register-form-box');
    dom.mobileNav      = document.getElementById('mobile-nav');
    dom.adminSection   = document.getElementById('admin-section');
    dom.adminFoodTable = document.getElementById('admin-food-table-body');
    dom.navAdminLink   = document.getElementById('nav-admin-link');
    dom.userDashboardSection = document.getElementById('user-dashboard-section');
    dom.userFoodGrid   = document.getElementById('user-food-grid');
    dom.navDashboardLink = document.getElementById('nav-dashboard-link');
    dom.dashboardUserName = document.getElementById('dashboard-user-name');
}

// API Endpoints
const apiEndpoints = {
    profile: '/api/profile',
    address: '/api/address',
    adminDashboard: '/api/admin/dashboard/stats',
    foods: '/api/foods',
    tracking: '/api/orders/track/'
};

// State
let currentToken = localStorage.getItem('token');

// Utils
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(sectionId).classList.remove('hidden');
}

async function fetchAPI(url, method = 'GET', body = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (currentToken) headers['Authorization'] = 'Bearer ' + currentToken;
    
    const options = { method, headers };
    if (body) options.body = JSON.stringify(body);
    
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

// Features
async function loadProfile() {
    try {
        const profile = await fetchAPI(apiEndpoints.profile);
        document.getElementById('profile-name').innerText = profile.name;
        document.getElementById('profile-phone').innerText = profile.phoneNumber || 'N/A';
    } catch(e) { console.error('Failed to load profile', e); }
}

async function loadAddresses() {
    try {
        const addresses = await fetchAPI(apiEndpoints.address);
        const list = document.getElementById('address-list');
        list.innerHTML = '';
        addresses.forEach(a => {
            list.innerHTML += `<div class="card"><p>${a.street}, ${a.city}</p></div>`;
        });
    } catch(e) { console.error('Failed to load addresses', e); }
}

async function loadDashboard() {
    try {
        const stats = await fetchAPI(apiEndpoints.adminDashboard);
        document.getElementById('stat-revenue').innerText = '$' + stats.totalRevenue;
        document.getElementById('stat-orders').innerText = stats.totalOrders;
    } catch(e) { console.error('Failed to load dashboard', e); }
}

async function trackOrder() {
    const id = document.getElementById('order-id').value;
    if(!id) return;
    try {
        const status = await fetchAPI(apiEndpoints.tracking + id);
        document.getElementById('order-status').innerText = 'Status: ' + status;
    } catch(e) {
        document.getElementById('order-status').innerText = 'Order not found';
    }
}

// Init
document.addEventListener('DOMContentLoaded', async () => {
    if(currentToken) {
        await loadProfile();
        await loadAddresses();
        await loadDashboard();
    }
});

// ========== INIT ==========
document.addEventListener('DOMContentLoaded', async () => {
    bindDom();
    initParticles();
    initScrollHandlers();
    initMobileNav();
    initPasswordStrength();
    updateAuthUI();

    setSkeletonLoading();
    await Promise.all([fetchFoods(), fetchCategories()]);

    if (state.currentUser) await fetchCart();

    animateCounters();
    initScrollReveal();
});

// ========== PARTICLES ==========
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;

    const particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.5 + 0.3,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        alpha: Math.random() * 0.4 + 0.1,
        color: Math.random() > 0.6 ? '255,126,46' : Math.random() > 0.5 ? '255,177,0' : '255,255,255'
    }));

    window.addEventListener('resize', () => {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    });

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
            ctx.fill();
        });
        // Draw soft connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(255,126,46,${0.04 * (1 - dist/120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
}

// ========== SCROLL HANDLERS ==========
function initScrollHandlers() {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 60) dom.mainHeader.classList.add('scrolled');
        else dom.mainHeader.classList.remove('scrolled');
    }, { passive: true });
}

function initScrollReveal() {
    const els = document.querySelectorAll('.reveal');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach(el => obs.observe(el));
}

// ========== COUNTER ANIMATION ==========
function animateCounters() {
    document.querySelectorAll('.stat-num').forEach(el => {
        const target = +el.dataset.count;
        let cur = 0;
        const step = target / 50;
        const timer = setInterval(() => {
            cur = Math.min(cur + step, target);
            el.textContent = Math.round(cur);
            if (cur >= target) clearInterval(timer);
        }, 30);
    });
}

// ========== MOBILE NAV ==========
function initMobileNav() {
    dom.mobileMenuBtn?.addEventListener('click', () => dom.mobileNav?.classList.add('open'));
}
function closeMobileNav() { dom.mobileNav?.classList.remove('open'); }

// ========== VIEW TOGGLE ==========
function setView(type) {
    state.currentView = type;
    const grid = document.getElementById('food-items-grid');
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    if (type === 'list') {
        grid.classList.add('list-view');
        listBtn?.classList.add('active');
        gridBtn?.classList.remove('active');
    } else {
        grid.classList.remove('list-view');
        gridBtn?.classList.add('active');
        listBtn?.classList.remove('active');
    }
}

// ========== PAGE TRANSITIONS ==========
let isTransitioning = false;
function pageTransition(callback) {
    if (isTransitioning) return;
    const overlay = document.getElementById('page-transition');
    if (!overlay) { callback(); return; }
    isTransitioning = true;
    overlay.className = 'entering';
    setTimeout(() => {
        callback();
        overlay.className = 'exiting';
        setTimeout(() => { overlay.className = ''; isTransitioning = false; }, 400);
    }, 300);
}

function showSection(section) {
    pageTransition(() => {
        dom.homeSection.style.display = 'none';
        dom.loginSection.style.display = 'none';
        dom.cartSection.style.display = 'none';
        dom.adminSection.style.display = 'none';
        dom.userDashboardSection.style.display = 'none';

        if (section === 'home') {
            dom.homeSection.style.display = 'block';
            if (state.allFoods.length > 0) renderFoods(state.allFoods);
        } else if (section === 'login') {
            dom.loginSection.style.display = 'flex';
        } else if (section === 'cart') {
            dom.cartSection.style.display = 'block';
            renderCart();
        } else if (section === 'admin') {
            if (state.currentUser?.role !== 'ADMIN') {
                showNotification('Unauthorized access.', 'error');
                showSection('home');
                return;
            }
            dom.adminSection.style.display = 'block';
            fetchAdminFoods();
        } else if (section === 'user-dashboard') {
            if (!state.currentUser) {
                showSection('login');
                return;
            }
            dom.userDashboardSection.style.display = 'block';
            if (dom.dashboardUserName) {
                dom.dashboardUserName.textContent = state.currentUser.name || 'Member';
            }
            renderFoods(state.allFoods, dom.userFoodGrid);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ========== TOAST NOTIFICATIONS ==========
function showNotification(message, type = 'info', title = '') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const icons = { success: 'fa-check', error: 'fa-xmark', info: 'fa-bell' };
    const titles = { success: title || 'Success', error: title || 'Error', info: title || 'Notice' };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.position = 'relative';
    toast.innerHTML = `
        <div class="toast-icon"><i class="fas ${icons[type] || icons.info}"></i></div>
        <div class="toast-body">
            <div class="toast-title">${titles[type]}</div>
            <div class="toast-msg">${message}</div>
        </div>
        <button class="toast-close" onclick="removeToast(this.parentElement)"><i class="fas fa-xmark"></i></button>
        <div class="toast-progress"></div>
    `;
    container.appendChild(toast);
    setTimeout(() => removeToast(toast), 4200);
}

function removeToast(el) {
    if (!el || el.classList.contains('removing')) return;
    el.classList.add('removing');
    setTimeout(() => el.remove(), 400);
}

// ========== AUTH ==========
function updateAuthUI() {
    const mobileNav = document.getElementById('mobile-nav-links-container');
    if (state.currentUser) {
        dom.navLoginWrap.style.display = 'none';
        dom.navUserProfile.style.display = 'flex';
        const name = state.currentUser.name ? state.currentUser.name.split(' ')[0] : 'Member';
        dom.userDisplayName.textContent = `Elite: ${name}`;
        
        dom.navDashboardLink.style.display = 'block';
        
        // Dynamic links
        if (state.currentUser.role === 'ADMIN') {
            dom.navAdminLink.style.display = 'block';
            document.getElementById('nav-menu-link').style.display = 'none';
            document.getElementById('nav-home-link').style.display = 'none';
            
            mobileNav.innerHTML = `
                <a onclick="handleDashboardRedirect(); closeMobileNav()">Dashboard</a>
                <a onclick="showSection('admin'); closeMobileNav()">Admin Panel</a>
                <a onclick="logout(); closeMobileNav()">Sign Out</a>
            `;
        } else {
            dom.navAdminLink.style.display = 'none';
            document.getElementById('nav-menu-link').style.display = 'block';
            document.getElementById('nav-home-link').style.display = 'block';
            
            mobileNav.innerHTML = `
                <a onclick="showSection('home'); closeMobileNav()">Home</a>
                <a onclick="handleDashboardRedirect(); closeMobileNav()">Dashboard</a>
                <a onclick="showSection('cart'); closeMobileNav()">Cart</a>
                <a onclick="logout(); closeMobileNav()">Sign Out</a>
            `;
        }
    } else {
        dom.navLoginWrap.style.display = 'block';
        dom.navUserProfile.style.display = 'none';
        dom.navAdminLink.style.display = 'none';
        dom.navDashboardLink.style.display = 'none';
        document.getElementById('nav-menu-link').style.display = 'block';
        document.getElementById('nav-home-link').style.display = 'block';
        
        mobileNav.innerHTML = `
            <a onclick="showSection('home'); closeMobileNav()">Home</a>
            <a onclick="showSection('home'); closeMobileNav()">Menu</a>
            <a onclick="showSection('cart'); closeMobileNav()">Cart</a>
            <a onclick="showSection('login'); closeMobileNav()">Sign In</a>
        `;
    }
}

function handleDashboardRedirect() {
    if (!state.currentUser) {
        showSection('login');
        return;
    }
    if (state.currentUser.role === 'ADMIN') {
        showSection('admin');
    } else {
        showSection('user-dashboard');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-login');
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const role = document.getElementById('login-role').value;
    
    if (!email || !password || !role) return;

    btn.classList.add('loading');
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role })
        });
        if (res.ok) {
            const data = await res.json();
            const user = data.user;
            user.token = data.token;
            state.currentUser = user;
            localStorage.setItem('user', JSON.stringify(user));
            showNotification(`Welcome back, ${user.role}!`, 'success', 'Access Granted');
            updateAuthUI();
            
            // Redirect based on role
            if (user.role === 'ADMIN') {
                showSection('admin');
            } else {
                showSection('user-dashboard');
            }
            
            await fetchCart();
        } else {
            let msg = 'Authorization failed.';
            try { const err = await res.json(); msg = err.message || msg; } catch {}
            showNotification(msg, 'error', 'Auth Failed');
        }
    } catch {
        showNotification('Cannot reach server. Check your connection.', 'error', 'Network Error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const btn = document.getElementById('submit-register');
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    if (!name || !email || !password) return;

    btn.classList.add('loading');
    btn.disabled = true;
    try {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        if (res.ok) {
            showNotification('Account created! Please sign in.', 'success', 'Welcome!');
            toggleAuth('login');
        } else {
            let msg = 'Registration failed.';
            try { const err = await res.json(); msg = err.message || msg; } catch {}
            showNotification(msg, 'error', 'Register Error');
        }
    } catch {
        showNotification('Server communication failure.', 'error', 'Network Error');
    } finally {
        btn.classList.remove('loading');
        btn.disabled = false;
    }
}

function logout() {
    state.currentUser = null;
    state.cartItems = [];
    localStorage.removeItem('user');
    updateCartBadge();
    updateAuthUI();
    showSection('home');
    showNotification('You have been signed out.', 'info', 'Goodbye');
}

function toggleAuth(type) {
    if (type === 'register') {
        dom.loginFormBox.style.display = 'none';
        dom.registerFormBox.style.display = 'block';
    } else {
        dom.loginFormBox.style.display = 'block';
        dom.registerFormBox.style.display = 'none';
    }
}

function togglePassword(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const isHidden = input.type === 'password';
    input.type = isHidden ? 'text' : 'password';
    btn.innerHTML = isHidden ? '<i class="fas fa-eye-slash"></i>' : '<i class="fas fa-eye"></i>';
}

function initPasswordStrength() {
    const pwdInput = document.getElementById('reg-password');
    if (!pwdInput) return;
    pwdInput.addEventListener('input', () => {
        const val = pwdInput.value;
        const bar = document.querySelector('.pwd-strength');
        if (!bar) return;
        let strength = 0;
        if (val.length >= 8) strength++;
        if (/[A-Z]/.test(val)) strength++;
        if (/[0-9]/.test(val)) strength++;
        if (/[^A-Za-z0-9]/.test(val)) strength++;
        const colors = ['#ef4444', '#f59e0b', '#10b981', '#10b981'];
        const widths = ['25%', '50%', '75%', '100%'];
        bar.innerHTML = strength > 0 ? `<div class="pwd-strength-bar" style="width:${widths[strength-1]};background:${colors[strength-1]}"></div>` : '';
    });
}

// ========== FOOD DATA ==========
async function fetchFoods() {
    try {
        const res = await fetch(`${API_BASE}/foods`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        state.allFoods = Array.isArray(data) ? data : [];
        renderFoods(state.allFoods);
    } catch (err) {
        console.error('fetchFoods:', err);
        showErrorState(dom.foodGrid, 'Culinary Network Unavailable', 'Please verify your connection.', 'location.reload()');
    }
}

async function fetchCategories() {
    try {
        const res = await fetch(`${API_BASE}/foods/categories`);
        if (!res.ok) return;
        const cats = await res.json();
        renderCategories(Array.isArray(cats) ? cats : []);
    } catch (err) {
        console.error('fetchCategories:', err);
    }
}

function renderCategories(categories) {
    const icons = {
        'italian': 'fa-pizza-slice', 'pizza': 'fa-pizza-slice',
        'burger': 'fa-burger', 'fast food': 'fa-burger',
        'indian': 'fa-bowl-rice', 'chinese': 'fa-utensils',
        'dessert': 'fa-ice-cream', 'sushi': 'fa-fish',
        'mexican': 'fa-pepper-hot', 'vegan': 'fa-leaf',
        'drinks': 'fa-glass-water', 'default': 'fa-utensils'
    };
    const getIcon = (cat) => icons[cat.toLowerCase()] || icons.default;
    const normalized = [...new Set(categories.map(c => (c || '').trim()).filter(Boolean))];

    const html = [`
        <div class="category-item ${state.activeCategory === 'all' ? 'active' : ''}" onclick="filterByCategory('all')">
            <i class="fas fa-border-all"></i><span>All Delicacies</span>
        </div>
    `];
    normalized.forEach(cat => {
        html.push(`
            <div class="category-item ${state.activeCategory === cat ? 'active' : ''}" onclick="filterByCategory('${escapeAttr(cat)}')">
                <i class="fas ${getIcon(cat)}"></i><span>${escapeHtml(cat)}</span>
            </div>
        `);
    });
    dom.categoryList.innerHTML = html.join('');
}

function renderFoods(foods, targetGrid = dom.foodGrid) {
    if (!Array.isArray(foods)) { foods = []; }
    if (!targetGrid) return;

    if (foods.length === 0) {
        targetGrid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon"><i class="fas fa-search"></i></div>
                <h3>No Delicacies Found</h3>
                <p>Try adjusting your search or browse all categories.</p>
                <button class="retry-btn" onclick="filterByCategory('all')">View All</button>
            </div>
        `;
        if (dom.resultsCount) dom.resultsCount.textContent = '0 items found';
        return;
    }

    if (dom.resultsCount) dom.resultsCount.textContent = `${foods.length} masterworks curated`;

    targetGrid.innerHTML = foods.map((food, i) => `
        <div class="food-card" style="animation-delay: ${Math.min(i * 0.06, 0.5)}s" onclick="openModal(${food.id})">
            <div class="card-img-wrapper">
                <span class="card-tag">${escapeHtml(food.type || 'Special')}</span>
                <div class="card-wish ${state.wishlist.includes(food.id) ? 'active' : ''}" 
                     onclick="event.stopPropagation(); toggleWishlist(${food.id}, this)" 
                     title="Save for later">
                    <i class="${state.wishlist.includes(food.id) ? 'fas' : 'far'} fa-heart"></i>
                </div>
                <div class="card-img-overlay"></div>
                <div class="card-rating"><i class="fas fa-star"></i> ${food.rating || (4.2 + Math.random() * 0.7).toFixed(1)}</div>
                <img 
                    src="${getFoodImageUrl(food)}" 
                    alt="${escapeHtml(food.name || 'Food item')}" 
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'"
                >
            </div>
            <div class="food-info">
                <h3>${escapeHtml(food.name || 'Unknown Dish')}</h3>
                <p>${escapeHtml(food.description || 'A delightful culinary creation.')}</p>
                <div class="food-footer">
                    <span class="price">₹${food.price != null ? food.price : '—'}</span>
                    <button class="add-btn" onclick="event.stopPropagation(); addToCart(${food.id})" title="Add to bag">
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    // Apply list view if active
    if (state.currentView === 'list') targetGrid.classList.add('list-view');
    else targetGrid.classList.remove('list-view');
}

function setSkeletonLoading() {
    dom.foodGrid.innerHTML = Array.from({length: 6}, () => `
        <div class="skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-text"></div>
            <div class="skeleton-text short"></div>
        </div>
    `).join('');
}

function getFoodImageUrl(food) {
    if (!food) return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
    if (food.image && (food.image.startsWith('http') || food.image.startsWith('/'))) return food.image;
    const type = (food.type || '').toLowerCase();
    const fallbacks = {
        'pizza': 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
        'burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
        'italian': 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
        'indian': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80',
        'dessert': 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=800&q=80',
        'chinese': 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=800&q=80',
        'sushi': 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80',
        'fast food': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
    };
    return fallbacks[type] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
}

// ========== SEARCH & FILTER ==========
function searchFood() {
    const query = (document.getElementById('food-search-input')?.value || '').toLowerCase().trim();
    if (!query) { filterByCategory(state.activeCategory); return; }
    const results = state.allFoods.filter(f =>
        (f.name || '').toLowerCase().includes(query) ||
        (f.description || '').toLowerCase().includes(query) ||
        (f.type || '').toLowerCase().includes(query)
    );
    renderFoods(results);
    if (dom.resultsCount) dom.resultsCount.textContent = `${results.length} results for "${query}"`;
}

async function filterByCategory(category) {
    state.activeCategory = category;
    document.querySelectorAll('.category-item').forEach(item => {
        const text = item.querySelector('span')?.textContent || item.textContent.trim();
        const isAll = category === 'all' && text === 'All Delicacies';
        item.classList.toggle('active', isAll || text === category);
    });

    if (category === 'all') { renderFoods(state.allFoods); return; }

    try {
        setSkeletonLoading();
        const res = await fetch(`${API_BASE}/foods/type/${encodeURIComponent(category)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const results = await res.json();
        renderFoods(Array.isArray(results) ? results : []);
    } catch (err) {
        console.error('filterByCategory:', err);
        // Graceful fallback to client-side filter
        const results = state.allFoods.filter(f => (f.type || '').toLowerCase() === category.toLowerCase());
        renderFoods(results);
    }
}

// ========== WISHLIST ==========
async function toggleWishlist(foodId, el) {
    if (!state.currentUser) {
        showNotification('Sign in to manage your wishlist.', 'error', 'Login Required');
        showSection('login');
        return;
    }
    const idx = state.wishlist.indexOf(foodId);
    try {
        if (idx === -1) {
            await fetch(`${API_BASE}/wishlist/user/${state.currentUser.id}/food/${foodId}`, { method: 'POST' });
            state.wishlist.push(foodId);
            el.classList.add('active');
            el.innerHTML = '<i class="fas fa-heart"></i>';
            showNotification('Added to your wishlist.', 'info', 'Saved');
        } else {
            await fetch(`${API_BASE}/wishlist/user/${state.currentUser.id}/food/${foodId}`, { method: 'DELETE' });
            state.wishlist.splice(idx, 1);
            el.classList.remove('active');
            el.innerHTML = '<i class="far fa-heart"></i>';
        }
        localStorage.setItem('wishlist', JSON.stringify(state.wishlist));
    } catch (err) {
        showNotification('Failed to update wishlist.', 'error');
    }
}

// ========== CART ==========
async function fetchCart() {
    if (!state.currentUser?.id) return;
    try {
        const res = await fetch(`${API_BASE}/cart/user/${state.currentUser.id}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        state.cartItems = Array.isArray(data) ? data : [];
        updateCartBadge();
        if (dom.cartSection.style.display === 'block') renderCart();
    } catch (err) {
        console.error('fetchCart:', err);
    }
}

async function addToCart(foodId) {
    if (!state.currentUser) {
        showNotification('Sign in to add items to your bag.', 'error', 'Login Required');
        showSection('login');
        return;
    }
    const btn = event?.currentTarget;
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'; btn.disabled = true; }
    try {
        const res = await fetch(`${API_BASE}/cart/add`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: state.currentUser.id, foodId, quantity: 1 })
        });
        if (res.ok) {
            showNotification('Added to your selection.', 'success', 'In Bag');
            closeModal();
            await fetchCart();
        } else {
            showNotification('Failed to add item.', 'error');
        }
    } catch {
        showNotification('Service interruption. Try again.', 'error');
    } finally {
        if (btn) { btn.innerHTML = '<i class="fas fa-plus"></i>'; btn.disabled = false; }
    }
}

async function removeFromCart(id) {
    try {
        const res = await fetch(`${API_BASE}/cart/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showNotification('Item removed from selection.', 'info');
            await fetchCart();
        }
    } catch {
        showNotification('Could not remove item.', 'error');
    }
}

function updateCartBadge() {
    const total = state.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
    dom.cartBadge.textContent = total;
    dom.cartBadge.style.display = total > 0 ? 'flex' : 'none';
}

function renderCart() {
    const el = document.getElementById('cart-item-count');
    if (!state.cartItems.length) {
        if (el) el.textContent = '0 items';
        dom.cartContent.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:50vh;gap:1.5rem;text-align:center;padding:4rem 0;">
                <div style="font-size:5rem;color:var(--surface-2);margin-bottom:1rem;"><i class="fas fa-shopping-bag"></i></div>
                <h3 style="font-size:2rem;font-weight:900;letter-spacing:-0.03em;">Your bag is empty</h3>
                <p style="color:var(--text-muted);max-width:340px;">Explore our curated gourmet menu to begin your culinary journey.</p>
                <button class="auth-btn" style="width:auto;padding:16px 40px;border-radius:50px;margin-top:1rem;" onclick="showSection('home')">
                    <span>Browse Elite Menu</span><i class="fas fa-arrow-right"></i>
                </button>
            </div>
        `;
        return;
    }

    let subtotal = 0;
    const itemsHtml = state.cartItems.map((item, i) => {
        const food = state.allFoods.find(f => f.id === item.foodId) || {};
        const price = food.price ?? item.price ?? 0;
        const name = food.name || item.name || 'Elite Item';
        const qty = item.quantity || 1;
        subtotal += price * qty;
        return `
            <div class="cart-item" style="animation-delay:${i * 0.08}s">
                <img src="${getFoodImageUrl(food)}" alt="${escapeHtml(name)}" 
                     onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'">
                <div class="cart-item-info">
                    <h3>${escapeHtml(name)}</h3>
                    <div class="item-price">₹${price}</div>
                </div>
                <div class="cart-qty-control">
                    <span class="qty-label" style="font-size:0.75rem;color:var(--text-dim);font-weight:800;letter-spacing:1px;margin-right:4px;">QTY</span>
                    <span class="qty-num">${qty}</span>
                </div>
                <div style="margin-left:auto;font-weight:900;font-size:1.1rem;font-family:'Outfit',sans-serif;min-width:70px;text-align:right;">₹${price * qty}</div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})" title="Remove"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
    }).join('');

    if (el) el.textContent = `${state.cartItems.length} item${state.cartItems.length !== 1 ? 's' : ''}`;

    dom.cartContent.innerHTML = `
        <div class="cart-layout">
            <div class="cart-items-list">${itemsHtml}</div>
            <div class="order-summary">
                <h3>Order Summary</h3>
                <div class="summary-row">
                    <span class="summary-label">Subtotal</span>
                    <span class="summary-value">₹${subtotal}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Taxes</span>
                    <span class="summary-value">₹${Math.round(subtotal * 0.05)}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">Priority Delivery</span>
                    <span class="summary-value free">COMPLIMENTARY</span>
                </div>
                <div class="summary-row total">
                    <span class="summary-total-label">Total</span>
                    <span class="summary-total-price">₹${subtotal + Math.round(subtotal * 0.05)}</span>
                </div>
                <button class="checkout-btn" onclick="placeOrder()">
                    <i class="fas fa-lock"></i> Authorize Checkout
                </button>
                <div class="secure-badge">
                    <i class="fas fa-shield-alt" style="color:var(--success)"></i>
                    SSL SECURE · ENCRYPTED PAYMENT
                </div>
            </div>
        </div>
    `;
}

async function placeOrder() {
    if (!state.currentUser) return;
    const btn = document.querySelector('.checkout-btn');
    if (btn) { btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; btn.disabled = true; }
    try {
        const res = await fetch(`${API_BASE}/orders/place`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: state.currentUser.id, status: 'PROCESSING' })
        });
        if (res.ok) {
            showNotification('Order confirmed! Bon Appétit!', 'success', 'Order Placed');
            state.cartItems = [];
            updateCartBadge();
            setTimeout(() => showSection('home'), 2500);
        } else {
            showNotification('Order could not be placed. Try again.', 'error');
            if (btn) { btn.innerHTML = '<i class="fas fa-lock"></i> Authorize Checkout'; btn.disabled = false; }
        }
    } catch {
        showNotification('Network error during checkout.', 'error');
        if (btn) { btn.innerHTML = '<i class="fas fa-lock"></i> Authorize Checkout'; btn.disabled = false; }
    }
}

// ========== MODAL ==========
function openModal(id) {
    const food = state.allFoods.find(f => f.id === id);
    if (!food) return;

    dom.modalContent.innerHTML = `
        <button class="close-btn" onclick="closeModal()"><i class="fas fa-xmark"></i></button>
        <div class="modal-img-wrapper">
            <img src="${getFoodImageUrl(food)}" alt="${escapeHtml(food.name || '')}"
                 onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'">
        </div>
        <div class="modal-details">
            <div class="modal-tag">${escapeHtml(food.restaurant || 'ELITE SELECTION')}</div>
            <h2 class="modal-title">${escapeHtml(food.name || 'Unknown Dish')}</h2>
            <p class="modal-desc">${escapeHtml(food.description || 'A curated culinary masterwork.')}</p>
            <div class="modal-meta">
                <div class="modal-meta-item">
                    <label>Category</label>
                    <span>${escapeHtml(food.type || 'Special')}</span>
                </div>
                <div class="modal-meta-item">
                    <label>Delivery Time</label>
                    <span>25–40 min</span>
                </div>
                <div class="modal-meta-item">
                    <label>Rating</label>
                    <span><i class="fas fa-star" style="color:var(--accent)"></i> ${food.rating || '4.5'}</span>
                </div>
                <div class="modal-meta-item">
                    <label>Calories</label>
                    <span>${food.calories || '—'} kcal</span>
                </div>
            </div>
            <div class="modal-footer">
                <div>
                    <div class="modal-price-label">Price</div>
                    <div class="modal-price">₹${food.price != null ? food.price : '—'}</div>
                </div>
                <button class="modal-add-btn" onclick="addToCart(${food.id})">
                    <i class="fas fa-shopping-bag"></i> Add to Bag
                </button>
            </div>
        </div>
    `;
    dom.modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    dom.modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}

// Close on overlay click / Escape key
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
window.addEventListener('click', e => {
    if (e.target === dom.modalOverlay) closeModal();
});

// ========== HELPERS ==========
function showErrorState(container, title, msg, retryFn = '') {
    container.innerHTML = `
        <div class="empty-state" style="grid-column:1/-1">
            <div class="empty-icon"><i class="fas fa-exclamation-triangle" style="color:var(--danger)"></i></div>
            <h3>${escapeHtml(title)}</h3>
            <p>${escapeHtml(msg)}</p>
            ${retryFn ? `<button class="retry-btn" onclick="${retryFn}"><i class="fas fa-rotate-right"></i> Retry</button>` : ''}
        </div>
    `;
}

// ========== ADMIN LOGIC ==========
async function fetchAdminFoods() {
    try {
        const res = await fetch(`${API_BASE}/admin/food/all`, {
            headers: { 'X-User-Role': state.currentUser?.role || '' }
        });
        if (!res.ok) throw new Error('Failed to fetch admin foods');
        const foods = await res.json();
        renderAdminFoods(foods);
    } catch (err) {
        console.error(err);
        showNotification('Could not load admin data.', 'error');
    }
}

function renderAdminFoods(foods) {
    if (!dom.adminFoodTable) return;
    
    dom.adminFoodTable.innerHTML = foods.map(food => `
        <tr>
            <td>
                <div class="admin-dish-info">
                    <img src="${getFoodImageUrl(food)}" class="admin-dish-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'">
                    <div class="admin-dish-name">${escapeHtml(food.name)}</div>
                </div>
            </td>
            <td><span class="card-tag" style="position:static;">${escapeHtml(food.type)}</span></td>
            <td><span style="color:var(--text-dim);font-weight:600;">${escapeHtml(food.restaurant || 'N/A')}</span></td>
            <td><span style="font-weight:800;color:var(--primary);">₹${food.price}</span></td>
            <td>
                <div class="admin-actions">
                    <button class="action-btn" onclick="openAdminFoodModal(${food.id})" title="Edit"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteAdminFood(${food.id})" title="Delete"><i class="fas fa-trash-alt"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
}

let currentEditingFoodId = null;

function openAdminFoodModal(foodId = null) {
    currentEditingFoodId = foodId;
    const food = foodId ? state.allFoods.find(f => f.id === foodId) : null;
    
    dom.modalContent.innerHTML = `
        <button class="close-btn" onclick="closeModal()"><i class="fas fa-xmark"></i></button>
        <div style="padding: 48px; width: 100%;">
            <div class="modal-tag">${foodId ? 'EDIT MASTERWORK' : 'NEW CREATION'}</div>
            <h2 class="modal-title">${foodId ? 'Refine Dish' : 'Add New Dish'}</h2>
            
            <form id="admin-food-form" class="admin-form" onsubmit="handleAdminFoodSubmit(event)">
                <div class="admin-form-row">
                    <div class="form-group">
                        <label>Dish Name</label>
                        <input type="text" id="admin-food-name" required value="${food ? escapeHtml(food.name) : ''}" placeholder="e.g. Truffle Risotto">
                    </div>
                    <div class="form-group">
                        <label>Category / Type</label>
                        <input type="text" id="admin-food-type" required value="${food ? escapeHtml(food.type) : ''}" placeholder="e.g. Italian">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Description</label>
                    <textarea id="admin-food-desc" required style="width:100%;background:rgba(255,255,255,0.03);border:1px solid var(--glass-border);border-radius:12px;padding:14px;color:white;min-height:100px;">${food ? escapeHtml(food.description) : ''}</textarea>
                </div>
                
                <div class="admin-form-row">
                    <div class="form-group">
                        <label>Price (₹)</label>
                        <input type="number" id="admin-food-price" required value="${food ? food.price : ''}" placeholder="0.00">
                    </div>
                    <div class="form-group">
                        <label>Restaurant</label>
                        <input type="text" id="admin-food-restaurant" required value="${food ? escapeHtml(food.restaurant) : ''}" placeholder="Restaurant name">
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Image URL</label>
                    <input type="text" id="admin-food-image" value="${food ? escapeHtml(food.image) : ''}" placeholder="https://images.unsplash.com/...">
                </div>
                
                <button type="submit" class="admin-submit-btn">
                    ${foodId ? 'Save Changes' : 'Publish Dish'}
                </button>
            </form>
        </div>
    `;
    
    dom.modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

async function handleAdminFoodSubmit(e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    const foodData = {
        name: document.getElementById('admin-food-name').value,
        type: document.getElementById('admin-food-type').value,
        description: document.getElementById('admin-food-desc').value,
        price: parseFloat(document.getElementById('admin-food-price').value),
        restaurant: document.getElementById('admin-food-restaurant').value,
        image: document.getElementById('admin-food-image').value
    };
    
    const url = currentEditingFoodId 
        ? `${API_BASE}/admin/food/update/${currentEditingFoodId}`
        : `${API_BASE}/admin/food/add`;
    
    const method = currentEditingFoodId ? 'PUT' : 'POST';
    
    try {
        const res = await fetch(url, {
            method,
            headers: { 
                'Content-Type': 'application/json',
                'X-User-Role': state.currentUser?.role || ''
            },
            body: JSON.stringify(foodData)
        });
        
        if (res.ok) {
            showNotification(currentEditingFoodId ? 'Dish updated successfully.' : 'New dish added to menu.', 'success');
            closeModal();
            await fetchFoods(); // Refresh main list
            if (state.currentView === 'admin' || dom.adminSection.style.display === 'block') {
                fetchAdminFoods(); // Refresh admin list
            }
        } else {
            showNotification('Failed to save dish.', 'error');
        }
    } catch (err) {
        showNotification('Network error.', 'error');
    } finally {
        btn.disabled = false;
        btn.innerHTML = currentEditingFoodId ? 'Save Changes' : 'Publish Dish';
    }
}

async function deleteAdminFood(id) {
    if (!confirm('Are you sure you want to remove this dish from the menu?')) return;
    
    try {
        const res = await fetch(`${API_BASE}/admin/food/delete/${id}`, { 
            method: 'DELETE',
            headers: { 'X-User-Role': state.currentUser?.role || '' }
        });
        if (res.ok) {
            showNotification('Dish removed from menu.', 'info');
            await fetchFoods();
            fetchAdminFoods();
        } else {
            showNotification('Could not delete dish.', 'error');
        }
    } catch (err) {
        showNotification('Network error.', 'error');
    }
}

function showAdminTab(tab) {
    document.querySelectorAll('.admin-tab-content').forEach(el => el.style.display = 'none');
    document.querySelectorAll('.sidebar-nav a').forEach(el => el.classList.remove('active'));
    
    const targetTab = document.getElementById(`admin-${tab}-tab`);
    if (targetTab) targetTab.style.display = 'block';
    
    // Set active link
    const links = document.querySelectorAll('.sidebar-nav a');
    links.forEach(link => {
        if (link.textContent.toLowerCase().includes(tab)) link.classList.add('active');
    });

    // Update titles
    const title = document.querySelector('.admin-title');
    const subtitle = document.querySelector('.admin-subtitle');
    if (tab === 'inventory') {
        title.textContent = 'Inventory Management';
        subtitle.textContent = 'Add, edit, or remove dishes from the public menu';
    } else if (tab === 'orders') {
        title.textContent = 'Live Orders';
        subtitle.textContent = 'Track and manage incoming culinary requests';
    }
}

function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
    if (str == null) return '';
    return String(str).replace(/'/g, "\\'");
}