// Product Detail page
let currentProduct = null;

async function renderProductDetail(productId) {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div id="product-detail" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        </div>
    `;
    
    await loadProductDetail(productId);
}

async function loadProductDetail(productId) {
    try {
        const { data: product, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        
        if (!product) {
            document.getElementById('product-detail').innerHTML = `
                <div class="text-center py-12">
                    <p class="text-textLight text-lg">Product not found</p>
                    <button onclick="navigateTo('shop')" class="btn-primary text-white px-6 py-3 rounded-lg font-medium mt-4">
                        Back to Shop
                    </button>
                </div>
            `;
            return;
        }
        
        currentProduct = product;
        renderProductDetailContent(product);
    } catch (error) {
        console.error('Error loading product:', error);
        document.getElementById('product-detail').innerHTML = `
            <div class="text-center py-12">
                <p class="text-textLight text-lg">Failed to load product</p>
                <button onclick="navigateTo('shop')" class="btn-primary text-white px-6 py-3 rounded-lg font-medium mt-4">
                    Back to Shop
                </button>
            </div>
        `;
    }
}

function renderProductDetailContent(product) {
    const container = document.getElementById('product-detail');
    
    const stockBadge = product.in_stock 
        ? '<span class="inline-block bg-green-500 text-white text-sm px-3 py-1 rounded-full font-medium">In Stock</span>'
        : '<span class="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">Out of Stock</span>';
    
    container.innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <!-- Product Image -->
            <div class="bg-surface rounded-2xl overflow-hidden shadow-md">
                <img src="${product.image_url || 'https://via.placeholder.com/600x600/FFE4E9/E91E63?text=No+Image'}" 
                     alt="${product.name}" 
                     class="w-full h-auto object-cover">
            </div>
            
            <!-- Product Info -->
            <div class="space-y-6">
                <div>
                    <span class="text-primary font-medium uppercase tracking-wider">${product.category}</span>
                    <h1 class="text-4xl font-bold font-heading mt-2">${product.name}</h1>
                </div>
                
                <div class="flex items-center space-x-4">
                    <span class="text-4xl font-bold text-primary">GH₵${product.price.toFixed(2)}</span>
                    ${stockBadge}
                </div>
                
                <div>
                    <h3 class="font-bold text-lg mb-2">Description</h3>
                    <p class="text-textLight leading-relaxed">${product.description || 'No description available.'}</p>
                </div>
                
                <div>
                    <h3 class="font-bold text-lg mb-2">Stock Quantity</h3>
                    <p class="text-textLight">${product.stock_quantity} units available</p>
                </div>
                
                <div class="flex space-x-4">
                    <button onclick="addToCartFromDetail('${product.id}')" 
                            class="btn-primary text-white px-8 py-4 rounded-xl font-bold text-lg flex-1 ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}"
                            ${!product.in_stock ? 'disabled' : ''}>
                        ${product.in_stock ? 'Add to Cart' : 'Out of Stock'}
                    </button>
                </div>
                
                <button onclick="navigateTo('shop')" class="text-textLight hover:text-primary transition-colors">
                    ← Back to Shop
                </button>
            </div>
        </div>
    `;
}

async function addToCartFromDetail(productId) {
    try {
        const { data: product, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('id', productId)
            .single();
        
        if (error) throw error;
        
        if (!product.in_stock) {
            showToast('Out of stock', 'error');
            return;
        }
        
        CartStore.addItem(product);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart', 'error');
    }
}
