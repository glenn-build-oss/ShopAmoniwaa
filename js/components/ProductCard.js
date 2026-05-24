// ProductCard component
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-surface rounded-xl overflow-hidden cursor-pointer shadow-md';
    card.onclick = () => navigateTo('product', { id: product.id });
    
    const stockBadge = product.in_stock 
        ? '<span class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">In Stock</span>'
        : '<span class="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>';
    
    card.innerHTML = `
        <div class="relative">
            <img src="${product.image_url || 'https://via.placeholder.com/400x400/FFE4E9/E91E63?text=No+Image'}" 
                 alt="${product.name}" 
                 class="w-full h-40 sm:h-48 object-cover">
            ${stockBadge}
        </div>
        <div class="p-3 sm:p-4">
            <span class="text-xs text-primary font-medium uppercase tracking-wider">${product.category}</span>
            <h3 class="text-base sm:text-lg font-bold font-heading mt-1 text-text">${product.name}</h3>
            <div class="flex items-center justify-between mt-3">
                <span class="text-lg sm:text-xl font-bold text-primary">GH₵${product.price.toFixed(2)}</span>
                <button onclick="event.stopPropagation(); addToCart('${product.id}')" 
                        class="btn-primary text-white px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm ${!product.in_stock ? 'opacity-50 cursor-not-allowed' : ''}"
                        ${!product.in_stock ? 'disabled' : ''}>
                    ${product.in_stock ? 'Add' : 'Out'}
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Add to cart function
async function addToCart(productId) {
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
        
        await CartStore.addItem(product);
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart', 'error');
    }
}
