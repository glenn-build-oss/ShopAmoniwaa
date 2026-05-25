// ProductCard component
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card bg-surface rounded-xl overflow-hidden cursor-pointer shadow-md';
    card.onclick = () => navigateTo('product', { id: product.id });

    const isPreorder = product.is_preorder;

    // Badge: Pre-Order > In Stock > Out of Stock
    let badge = '';
    if (isPreorder) {
        badge = `<span class="absolute top-3 left-3 bg-gradient-to-r from-violet-600 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold tracking-wide shadow">✨ Pre-Order</span>`;
    } else if (product.in_stock) {
        badge = `<span class="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">In Stock</span>`;
    } else {
        badge = `<span class="absolute top-3 right-3 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">Out of Stock</span>`;
    }

    // Pre-order release date line
    let releaseLine = '';
    if (isPreorder && product.preorder_date) {
        const date = new Date(product.preorder_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        releaseLine = `<p class="text-xs text-violet-500 font-semibold mt-1">🗓 Ships ~${date}</p>`;
    } else if (isPreorder) {
        releaseLine = `<p class="text-xs text-violet-500 font-semibold mt-1">🗓 Coming Soon</p>`;
    }

    // Button
    let btnClass, btnText;
    if (isPreorder) {
        btnClass = 'bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white';
        btnText = 'Pre-Order';
    } else if (product.in_stock) {
        btnClass = 'btn-primary text-white';
        btnText = 'Add';
    } else {
        btnClass = 'btn-primary text-white opacity-50 cursor-not-allowed';
        btnText = 'Out';
    }

    const isDisabled = !isPreorder && !product.in_stock;

    card.innerHTML = `
        <div class="relative">
            <img src="${product.image_url || 'https://via.placeholder.com/400x400/FFE4E9/E91E63?text=No+Image'}"
                 alt="${product.name}"
                 class="w-full h-32 sm:h-48 object-cover">
            ${badge}
        </div>
        <div class="p-3 sm:p-4">
            <span class="text-xs ${isPreorder ? 'text-violet-500' : 'text-primary'} font-medium uppercase tracking-wider">${product.category}</span>
            <h3 class="text-sm sm:text-lg font-bold font-heading mt-1 text-text line-clamp-2 leading-tight">${product.name}</h3>
            ${releaseLine}
            <div class="flex items-center justify-between mt-3">
                <span class="text-base sm:text-xl font-bold ${isPreorder ? 'text-violet-600' : 'text-primary'}">GH₵${product.price.toFixed(2)}</span>
                <button onclick="event.stopPropagation(); addToCart('${product.id}')"
                        class="${btnClass} px-3 py-2 sm:px-4 rounded-lg font-medium text-xs sm:text-sm transition-all"
                        ${isDisabled ? 'disabled' : ''}>
                    ${btnText}
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

        if (!product.in_stock && !product.is_preorder) {
            showToast('Out of stock', 'error');
            return;
        }

        await CartStore.addItem(product);

        if (product.is_preorder) {
            showToast('Pre-order added to cart ✨');
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        showToast('Error adding to cart', 'error');
    }
}
