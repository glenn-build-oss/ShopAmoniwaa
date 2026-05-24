// Admin Dashboard page
let isAdminLoggedIn = false;
let productsData = [];

async function renderAdmin() {
    const app = document.getElementById('app');
    
    if (!isAdminLoggedIn) {
        renderAdminLogin();
    } else {
        renderAdminDashboard();
    }
}

function renderAdminLogin() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="max-w-md mx-auto px-4 py-20">
            <div class="bg-surface rounded-2xl p-8 shadow-md">
                <div class="text-center mb-8">
                    <h1 class="text-3xl font-bold font-heading gradient-text mb-2">Admin Login</h1>
                    <p class="text-textLight">Enter your credentials to access the dashboard</p>
                </div>
                
                <form onsubmit="handleAdminLogin(event)">
                    <div class="space-y-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Email</label>
                            <input type="email" 
                                   id="admin-email"
                                   placeholder="admin@shopamoniwaa.com" 
                                   class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Password</label>
                            <input type="password" 
                                   id="admin-password"
                                   placeholder="Enter password" 
                                   class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                   required>
                        </div>
                        <button type="submit" class="w-full btn-primary text-white py-3 rounded-lg font-bold">
                            Login
                        </button>
                    </div>
                </form>
                
                <div class="mt-6 text-center">
                    <button onclick="navigateTo('home')" class="text-textLight hover:text-primary transition-colors">
                        ← Back to Home
                    </button>
                </div>
            </div>
        </div>
    `;
}

async function handleAdminLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;
    
    try {
        // Try to authenticate with Supabase
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) {
            // If Supabase auth fails, check if it's the default admin
            if (email === 'admin@shopamoniwaa.com' && password === 'admin1234') {
                isAdminLoggedIn = true;
                showToast('Login successful');
                renderAdminDashboard();
                return;
            }
            throw error;
        }
        
        // Check if user is admin
        const { data: userData, error: userError } = await window.supabaseClient
            .from('admin_users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (userError || !userData) {
            await window.supabaseClient.auth.signOut();
            throw new Error('Not authorized as admin');
        }
        
        isAdminLoggedIn = true;
        showToast('Login successful');
        renderAdminDashboard();
    } catch (error) {
        console.error('Login error:', error);
        showToast('Invalid credentials', 'error');
    }
}

async function renderAdminDashboard() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Dashboard Header -->
            <div class="flex items-center justify-between mb-8">
                <div>
                    <h1 class="text-3xl font-bold font-heading">Admin Dashboard</h1>
                    <p class="text-textLight">Manage your store</p>
                </div>
                <button onclick="handleAdminLogout()" class="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Logout
                </button>
            </div>
            
            <!-- Tabs -->
            <div class="flex space-x-4 mb-8 border-b border-pink-100">
                <button onclick="switchTab('products')" id="tab-products" class="tab-btn px-6 py-3 font-medium border-b-2 border-primary text-primary">
                    Products
                </button>
                <button onclick="switchTab('orders')" id="tab-orders" class="tab-btn px-6 py-3 font-medium border-b-2 border-transparent text-textLight hover:text-primary">
                    Orders
                </button>
            </div>
            
            <!-- Products Section -->
            <div id="products-section">
                <!-- Add Product Button -->
                <div class="mb-6">
                    <button onclick="openAddProductModal()" class="btn-primary text-white px-6 py-3 rounded-lg font-medium">
                        + Add New Product
                    </button>
                </div>
                
                <!-- Products Table -->
                <div class="bg-surface rounded-xl overflow-hidden shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-background">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Product</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Price</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Stock</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Status</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="products-table-body">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <!-- Orders Section -->
            <div id="orders-section" class="hidden">
                <!-- Orders Table -->
                <div class="bg-surface rounded-xl overflow-hidden shadow-sm">
                    <div class="overflow-x-auto">
                        <table class="w-full">
                            <thead class="bg-background">
                                <tr>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Order ID</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Customer</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Phone</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Total</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Status</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Date</th>
                                    <th class="px-6 py-4 text-left text-sm font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody id="orders-table-body">
                                <tr>
                                    <td colspan="7" class="px-6 py-12 text-center">
                                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        
        <!-- Add/Edit Product Modal -->
        <div id="product-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                <div class="p-6 border-b border-pink-100">
                    <h2 id="modal-title" class="text-2xl font-bold font-heading">Add New Product</h2>
                </div>
                <form onsubmit="handleProductSubmit(event)" class="p-6 space-y-4">
                    <input type="hidden" id="product-id">
                    
                    <!-- Image Upload -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Product Image</label>
                        <div class="space-y-4">

                            <!-- EDIT MODE: Existing image shown prominently -->
                            <div id="existing-image-banner" class="hidden bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-pink-200 rounded-xl p-3">
                                <p class="text-xs font-semibold text-textLight uppercase tracking-wide mb-2">Current Image</p>
                                <div class="flex items-center gap-4">
                                    <img id="existing-image-banner-img" src="" alt="Current product image"
                                         class="w-24 h-24 object-cover rounded-lg shadow-md border border-pink-200">
                                    <div>
                                        <p class="text-sm text-text font-medium">This is the current product image.</p>
                                        <p class="text-xs text-textLight mt-1">Upload a new file below to replace it, or keep it as-is.</p>
                                    </div>
                                </div>
                            </div>

                            <input type="file" 
                                   id="product-image-file"
                                   accept="image/*"
                                   onchange="handleImageUpload(event)"
                                   class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none">
                            
                            <!-- Instant upload preview (shown immediately on file select, before cropping) -->
                            <div id="instant-upload-preview" class="hidden">
                                <p class="text-xs font-semibold text-textLight uppercase tracking-wide mb-2">Selected Image Preview</p>
                                <img id="instant-upload-preview-img" src="" alt="Upload preview"
                                     class="w-full max-h-48 object-contain rounded-xl border-2 border-dashed border-yellow-400 bg-yellow-50 p-2">
                                <p class="text-xs text-yellow-700 mt-1 text-center">👆 Scroll down to crop this image</p>
                            </div>
                            
                            <!-- Image Preview & Crop tool -->
                            <div id="image-crop-container" class="hidden">
                                <div class="relative">
                                    <img id="image-preview" class="max-h-64 mx-auto" style="max-width: 100%;">
                                </div>
                                <div class="flex space-x-4 mt-4">
                                    <button type="button" onclick="cropImage()" class="flex-1 btn-primary text-white py-3 rounded-lg font-medium">
                                        Crop & Save
                                    </button>
                                    <button type="button" onclick="cancelCrop()" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                            
                            <!-- Cropped / Final Image Preview -->
                            <div id="cropped-preview-container" class="hidden">
                                <p class="text-xs font-semibold text-green-600 uppercase tracking-wide mb-2">✅ Final Image</p>
                                <img id="cropped-image-preview" class="max-h-64 mx-auto rounded-lg shadow-md border border-pink-100" style="max-width: 100%;">
                                <button type="button" onclick="removeImage()" class="mt-2 text-red-500 hover:text-red-400 text-sm">
                                    Remove Image
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Product Name</label>
                        <input type="text" 
                               id="product-name"
                               placeholder="Enter product name" 
                               class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                               required>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Description</label>
                        <textarea id="product-description"
                                  placeholder="Enter product description" 
                                  rows="4"
                                  class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                  required></textarea>
                    </div>
                    
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label class="block text-sm font-medium mb-2">Price (GH₵)</label>
                            <input type="number" 
                                   id="product-price"
                                   placeholder="0.00" 
                                   step="0.01"
                                   min="0"
                                   class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                   required>
                        </div>
                        <div>
                            <label class="block text-sm font-medium mb-2">Stock Quantity</label>
                            <input type="number" 
                                   id="product-stock"
                                   placeholder="0" 
                                   min="0"
                                   class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                   required>
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium mb-2">Category</label>
                        <select id="product-category" 
                                class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                required>
                            <option value="">Select category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home">Home</option>
                            <option value="Sports">Sports</option>
                        </select>
                    </div>
                    
                    <div class="flex items-center space-x-2">
                        <input type="checkbox" 
                               id="product-in-stock"
                               class="w-5 h-5 rounded border-pink-200 bg-background text-primary focus:ring-primary">
                        <label for="product-in-stock" class="text-sm">In Stock</label>
                    </div>
                    
                    <div class="flex space-x-4 pt-4">
                        <button type="button" onclick="closeProductModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-lg font-medium">
                            Save Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
        
        <!-- Order Details Modal -->
        <div id="order-modal" class="fixed inset-0 bg-black/60 z-50 hidden flex items-center justify-center p-4">
            <div class="bg-surface rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
                <div class="p-6 border-b border-pink-100 flex items-center justify-between">
                    <h2 class="text-2xl font-bold font-heading">Order Details</h2>
                    <button onclick="closeOrderModal()" class="text-text hover:text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div id="order-modal-content" class="p-6">
                    <!-- Order details will be loaded here -->
                </div>
            </div>
        </div>
    `;
    
    await loadAdminProducts();
}

let cropper = null;
let croppedImageData = null;

function switchTab(tab) {
    const productsSection = document.getElementById('products-section');
    const ordersSection = document.getElementById('orders-section');
    const productsTab = document.getElementById('tab-products');
    const ordersTab = document.getElementById('tab-orders');
    
    if (tab === 'products') {
        productsSection.classList.remove('hidden');
        ordersSection.classList.add('hidden');
        productsTab.classList.add('border-primary', 'text-primary');
        productsTab.classList.remove('border-transparent', 'text-textLight');
        ordersTab.classList.remove('border-primary', 'text-primary');
        ordersTab.classList.add('border-transparent', 'text-textLight');
    } else {
        productsSection.classList.add('hidden');
        ordersSection.classList.remove('hidden');
        ordersTab.classList.add('border-primary', 'text-primary');
        ordersTab.classList.remove('border-transparent', 'text-textLight');
        productsTab.classList.remove('border-primary', 'text-primary');
        productsTab.classList.add('border-transparent', 'text-textLight');
        loadOrders();
    }
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const image = document.getElementById('image-preview');
        image.src = e.target.result;
        
        // Show instant thumbnail preview above the crop tool
        const instantPreview = document.getElementById('instant-upload-preview');
        const instantPreviewImg = document.getElementById('instant-upload-preview-img');
        if (instantPreview && instantPreviewImg) {
            instantPreviewImg.src = e.target.result;
            instantPreview.classList.remove('hidden');
        }
        
        document.getElementById('image-crop-container').classList.remove('hidden');
        document.getElementById('cropped-preview-container').classList.add('hidden');
        
        if (cropper) {
            cropper.destroy();
        }
        
        cropper = new Cropper(image, {
            aspectRatio: 1,
            viewMode: 1,
            autoCropArea: 0.8,
        });
    };
    reader.readAsDataURL(file);
}

function cropImage() {
    if (!cropper) return;
    
    const canvas = cropper.getCroppedCanvas({
        maxWidth: 800,
        maxHeight: 800,
    });
    
    croppedImageData = canvas.toDataURL('image/jpeg', 0.8);
    
    document.getElementById('cropped-image-preview').src = croppedImageData;
    document.getElementById('cropped-preview-container').classList.remove('hidden');
    document.getElementById('image-crop-container').classList.add('hidden');
    
    // Hide the instant preview once cropped
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

function cancelCrop() {
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
    document.getElementById('image-crop-container').classList.add('hidden');
    document.getElementById('product-image-file').value = '';
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
}

function removeImage() {
    croppedImageData = null;
    document.getElementById('cropped-preview-container').classList.add('hidden');
    document.getElementById('product-image-file').value = '';
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
}

async function loadAdminProducts() {
    try {
        const { data: products, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        productsData = products;
        renderProductsTable(products);
        
        // Set up real-time subscription
        setupRealtimeSubscription();
    } catch (error) {
        console.error('Error loading products:', error);
        showToast('Failed to load products', 'error');
    }
}

function renderProductsTable(products) {
    const tbody = document.getElementById('products-table-body');
    
    if (products.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="px-4 sm:px-6 py-12 text-center text-textLight">
                    No products found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = products.map(product => `
        <tr class="border-t border-pink-100 hover:bg-pink-50">
            <td class="px-4 sm:px-6 py-4">
                <div class="flex items-center space-x-3">
                    <img src="${product.image_url || 'https://via.placeholder.com/50x50/FFE4E9/E91E63?text=No'}" 
                         alt="${product.name}" 
                         class="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover flex-shrink-0">
                    <span class="font-medium text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">${product.name}</span>
                </div>
            </td>
            <td class="px-4 sm:px-6 py-4 font-bold text-primary text-sm sm:text-base">GH₵${product.price.toFixed(2)}</td>
            <td class="px-4 sm:px-6 py-4 text-textLight text-sm sm:text-base">${product.stock_quantity}</td>
            <td class="px-4 sm:px-6 py-4">
                <span class="px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${product.in_stock ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}">
                    ${product.in_stock ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>
            <td class="px-4 sm:px-6 py-4">
                <div class="flex items-center space-x-1 sm:space-x-2">
                    <button onclick="openEditProductModal('${product.id}')" 
                            class="p-1.5 sm:p-2 text-blue-500 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                    </button>
                    <button onclick="toggleProductStock('${product.id}')" 
                            class="p-1.5 sm:p-2 ${product.in_stock ? 'text-yellow-500 hover:text-yellow-400' : 'text-green-500 hover:text-green-400'} transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button onclick="deleteProduct('${product.id}')" 
                            class="p-1.5 sm:p-2 text-red-500 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function openAddProductModal() {
    document.getElementById('modal-title').textContent = 'Add New Product';
    document.getElementById('product-id').value = '';
    document.getElementById('product-name').value = '';
    document.getElementById('product-description').value = '';
    document.getElementById('product-price').value = '';
    document.getElementById('product-stock').value = '';
    document.getElementById('product-category').value = '';
    document.getElementById('product-in-stock').checked = true;
    document.getElementById('product-modal').classList.remove('hidden');
    
    // Reset image state
    croppedImageData = null;
    document.getElementById('cropped-preview-container').classList.add('hidden');
    document.getElementById('image-crop-container').classList.add('hidden');
    document.getElementById('product-image-file').value = '';
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
    
    // Hide edit-mode existing image banner
    const existingBanner = document.getElementById('existing-image-banner');
    if (existingBanner) existingBanner.classList.add('hidden');
}

function openEditProductModal(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-description').value = product.description || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock_quantity;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-in-stock').checked = product.in_stock;
    document.getElementById('product-modal').classList.remove('hidden');
    
    // Reset upload preview
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
    
    // Handle existing image - show prominently
    const existingBanner = document.getElementById('existing-image-banner');
    const existingBannerImg = document.getElementById('existing-image-banner-img');
    if (product.image_url) {
        croppedImageData = product.image_url;
        document.getElementById('cropped-image-preview').src = product.image_url;
        document.getElementById('cropped-preview-container').classList.remove('hidden');
        // Show the existing image banner
        if (existingBanner && existingBannerImg) {
            existingBannerImg.src = product.image_url;
            existingBanner.classList.remove('hidden');
        }
    } else {
        croppedImageData = null;
        document.getElementById('cropped-preview-container').classList.add('hidden');
        if (existingBanner) existingBanner.classList.add('hidden');
    }
    
    document.getElementById('image-crop-container').classList.add('hidden');
    document.getElementById('product-image-file').value = '';
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
    
    // Reset image state
    croppedImageData = null;
    document.getElementById('cropped-preview-container').classList.add('hidden');
    document.getElementById('image-crop-container').classList.add('hidden');
    document.getElementById('product-image-file').value = '';
    const instantPreview = document.getElementById('instant-upload-preview');
    if (instantPreview) instantPreview.classList.add('hidden');
    const existingBanner = document.getElementById('existing-image-banner');
    if (existingBanner) existingBanner.classList.add('hidden');
    
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

async function handleProductSubmit(event) {
    event.preventDefault();
    
    const productId = document.getElementById('product-id').value;
    const productData = {
        name: document.getElementById('product-name').value,
        description: document.getElementById('product-description').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock_quantity: parseInt(document.getElementById('product-stock').value),
        category: document.getElementById('product-category').value,
        image_url: croppedImageData || null,
        in_stock: document.getElementById('product-in-stock').checked
    };
    
    try {
        let error;
        
        if (productId) {
            // Update existing product
            const { error: updateError } = await window.supabaseClient
                .from('products')
                .update(productData)
                .eq('id', productId);
            error = updateError;
        } else {
            // Add new product
            const { error: insertError } = await window.supabaseClient
                .from('products')
                .insert([productData]);
            error = insertError;
        }
        
        if (error) throw error;
        
        showToast(productId ? 'Product updated successfully' : 'Product added successfully');
        closeProductModal();
        await loadAdminProducts();
    } catch (error) {
        console.error('Error saving product:', error);
        showToast('Failed to save product', 'error');
    }
}

async function toggleProductStock(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    try {
        const { error } = await window.supabaseClient
            .from('products')
            .update({ in_stock: !product.in_stock })
            .eq('id', productId);
        
        if (error) throw error;
        
        showToast(`Product marked as ${!product.in_stock ? 'in stock' : 'out of stock'}`);
        await loadAdminProducts();
    } catch (error) {
        console.error('Error toggling stock:', error);
        showToast('Failed to update stock', 'error');
    }
}

async function deleteProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // Show delete confirmation modal
    const deleteModal = document.createElement('div');
    deleteModal.id = 'delete-modal';
    deleteModal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    deleteModal.innerHTML = `
        <div class="bg-surface rounded-2xl max-w-md w-full shadow-lg">
            <div class="p-6">
                <div class="flex items-center space-x-4 mb-6">
                    <div class="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold font-heading">Delete Product</h3>
                        <p class="text-textLight text-sm">This action cannot be undone</p>
                    </div>
                </div>
                
                <div class="bg-background rounded-lg p-4 mb-6">
                    <div class="flex items-center space-x-3">
                        <img src="${product.image_url || 'https://via.placeholder.com/50x50/FFE4E9/E91E63?text=No'}" 
                             alt="${product.name}" 
                             class="w-16 h-16 rounded-lg object-cover">
                        <div>
                            <p class="font-bold">${product.name}</p>
                            <p class="text-primary font-bold">GH₵${product.price.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                
                <p class="text-textLight mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
                
                <div class="flex space-x-4">
                    <button onclick="closeDeleteModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                        Cancel
                    </button>
                    <button onclick="confirmDeleteProduct('${productId}')" class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
                        Delete Product
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(deleteModal);
}

async function confirmDeleteProduct(productId) {
    try {
        const { error } = await window.supabaseClient
            .from('products')
            .delete()
            .eq('id', productId);
        
        if (error) throw error;
        
        showToast('Product deleted successfully');
        closeDeleteModal();
        await loadAdminProducts();
    } catch (error) {
        console.error('Error deleting product:', error);
        showToast('Failed to delete product', 'error');
    }
}

function closeDeleteModal() {
    const modal = document.getElementById('delete-modal');
    if (modal) {
        modal.remove();
    }
}

async function handleAdminLogout() {
    try {
        await window.supabaseClient.auth.signOut();
    } catch (error) {
        console.error('Logout error:', error);
    }
    
    isAdminLoggedIn = false;
    showToast('Logged out successfully');
    navigateTo('home');
}

let realtimeSubscription = null;

function setupRealtimeSubscription() {
    if (realtimeSubscription) {
        realtimeSubscription.unsubscribe();
    }
    
    realtimeSubscription = window.supabaseClient
        .channel('products-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
            console.log('Real-time update:', payload);
            loadAdminProducts();
        })
        .subscribe();
}

async function loadOrders() {
    try {
        const { data: orders, error } = await window.supabaseClient
            .from('orders')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        renderOrdersTable(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        showToast('Failed to load orders', 'error');
    }
}

// Generate a short readable order number from index and date
function formatOrderNumber(index, createdAt) {
    // Use 1-based index padded to 4 digits: #0001, #0002 ...
    return '#' + String(index + 1).padStart(4, '0');
}

function renderOrdersTable(orders) {
    const tbody = document.getElementById('orders-table-body');
    
    if (orders.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="px-6 py-12 text-center text-textLight">
                    No orders found
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = orders.map((order, index) => `
        <tr class="border-t border-pink-100 hover:bg-pink-50">
            <td class="px-6 py-4">
                <span class="inline-block bg-primary/10 text-primary font-bold text-sm px-3 py-1 rounded-full tracking-wide">
                    ${formatOrderNumber(orders.length - 1 - index, order.created_at)}
                </span>
            </td>
            <td class="px-6 py-4">${order.customer_name}</td>
            <td class="px-6 py-4">${order.customer_phone}</td>
            <td class="px-6 py-4 font-bold text-primary">GH₵${order.total_amount.toFixed(2)}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}">
                    ${order.status}
                </span>
            </td>
            <td class="px-6 py-4 text-textLight text-sm">${new Date(order.created_at).toLocaleDateString()}</td>
            <td class="px-6 py-4">
                <div class="flex items-center space-x-2">
                    <button onclick="openOrderModal('${order.id}', ${orders.length - 1 - index})" 
                            class="p-2 text-blue-500 hover:text-blue-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    </button>
                    <button onclick="updateOrderStatus('${order.id}', 'completed')" 
                            class="p-2 text-green-500 hover:text-green-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button onclick="updateOrderStatus('${order.id}', 'cancelled')" 
                            class="p-2 text-red-500 hover:text-red-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function getStatusClass(status) {
    switch (status) {
        case 'pending':
            return 'bg-yellow-500/20 text-yellow-500';
        case 'completed':
            return 'bg-green-500/20 text-green-500';
        case 'cancelled':
            return 'bg-red-500/20 text-red-500';
        default:
            return 'bg-gray-500/20 text-gray-500';
    }
}

async function openOrderModal(orderId, orderIndex) {
    try {
        // First get total order count to compute order number
        const { data: allOrders, error: countError } = await window.supabaseClient
            .from('orders')
            .select('id, created_at')
            .order('created_at', { ascending: true });
        
        const { data: order, error } = await window.supabaseClient
            .from('orders')
            .select('*')
            .eq('id', orderId)
            .single();
        
        if (error) throw error;
        
        // Find position of this order in chronological list (1-based)
        const chronoIndex = allOrders ? allOrders.findIndex(o => o.id === orderId) : 0;
        const orderNum = '#' + String(chronoIndex + 1).padStart(4, '0');
        
        const { data: orderItems, error: itemsError } = await window.supabaseClient
            .from('order_items')
            .select('*')
            .eq('order_id', orderId);
        
        if (itemsError) throw itemsError;
        
        const modalContent = document.getElementById('order-modal-content');
        modalContent.innerHTML = `
            <div class="space-y-6">
                <!-- Order Number Banner -->
                <div class="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                        <p class="text-xs text-textLight uppercase tracking-wider">Order Number</p>
                        <p class="text-3xl font-extrabold font-heading gradient-text">${orderNum}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-xs text-textLight">Date</p>
                        <p class="font-medium">${new Date(order.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
                    </div>
                </div>
                
                <!-- Customer Info -->
                <div class="bg-background rounded-lg p-4">
                    <h3 class="font-bold font-heading mb-3">Customer Information</h3>
                    <div class="space-y-2">
                        <p><span class="text-textLight">Name:</span> ${order.customer_name}</p>
                        <p><span class="text-textLight">Phone:</span> ${order.customer_phone}</p>
                        <p><span class="text-textLight">Address:</span> ${order.customer_address}</p>
                    </div>
                </div>
                
                <!-- Order Items -->
                <div class="bg-background rounded-lg p-4">
                    <h3 class="font-bold font-heading mb-3">Order Items</h3>
                    <div class="space-y-3">
                        ${orderItems.map(item => `
                            <div class="flex items-center justify-between py-2 border-b border-pink-100 last:border-0">
                                <div>
                                    <p class="font-medium">${item.product_name}</p>
                                    <p class="text-textLight text-sm">Qty: ${item.quantity} × GH₵${item.price.toFixed(2)}</p>
                                </div>
                                <p class="font-bold text-primary">GH₵${(item.quantity * item.price).toFixed(2)}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <!-- Order Summary -->
                <div class="bg-background rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="font-bold font-heading">Total Amount</span>
                        <span class="text-2xl font-bold text-primary">GH₵${order.total_amount.toFixed(2)}</span>
                    </div>
                </div>
                
                <!-- Status -->
                <div class="bg-background rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <span class="font-bold font-heading">Status</span>
                        <span class="px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(order.status)}">
                            ${order.status}
                        </span>
                    </div>
                </div>
                
                <!-- Actions -->
                <div class="flex space-x-4">
                    <button onclick="updateOrderStatus('${order.id}', 'completed')" 
                            class="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors">
                        Mark as Completed
                    </button>
                    <button onclick="updateOrderStatus('${order.id}', 'cancelled')" 
                            class="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-lg font-medium transition-colors">
                        Cancel Order
                    </button>
                </div>
            </div>
        `;
        
        document.getElementById('order-modal').classList.remove('hidden');
    } catch (error) {
        console.error('Error loading order details:', error);
        showToast('Failed to load order details', 'error');
    }
}

function closeOrderModal() {
    document.getElementById('order-modal').classList.add('hidden');
}

async function updateOrderStatus(orderId, status) {
    try {
        const { error } = await window.supabaseClient
            .from('orders')
            .update({ status: status })
            .eq('id', orderId);
        
        if (error) throw error;
        
        showToast(`Order marked as ${status}`);
        closeOrderModal();
        await loadOrders();
    } catch (error) {
        console.error('Error updating order status:', error);
        showToast('Failed to update order status', 'error');
    }
}
