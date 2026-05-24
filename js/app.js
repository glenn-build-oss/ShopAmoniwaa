// Main application initialization
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize the app
    console.log('NexShop initialized');
    
    // Load cart from Supabase
    await CartStore.loadFromStorage();
    
    // Load initial page
    navigateTo('home');
    
    // Set up real-time subscription for storefront
    setupStorefrontRealtime();
});

// Real-time subscription for storefront
let storefrontSubscription = null;

function setupStorefrontRealtime() {
    if (storefrontSubscription) {
        storefrontSubscription.unsubscribe();
    }
    
    storefrontSubscription = window.supabaseClient
        .channel('storefront-products')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, (payload) => {
            console.log('Product updated:', payload);
            
            // Refresh current page if needed
            if (Router.currentPage === 'home') {
                loadNewArrivals();
                loadHotDeals();
            } else if (Router.currentPage === 'shop') {
                loadProducts();
            } else if (Router.currentPage === 'product' && currentProduct && currentProduct.id === payload.new.id) {
                loadProductDetail(payload.new.id);
            }
        })
        .subscribe();
}
