// Home page
async function renderHome() {
    const app = document.getElementById('app');
    
    app.innerHTML = `
        <!-- Hero Section -->
        <section class="relative overflow-hidden">
            <div class="absolute inset-0 gradient-bg opacity-20"></div>
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20 relative">
                <div class="text-center animate-slide-up">
                    <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-heading mb-4 sm:mb-6">
                        <span class="gradient-text">ShopAmoniwaa</span>
                    </h1>
                    <p class="text-base sm:text-lg md:text-xl lg:text-2xl text-textLight mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                        Your favorite fashion shop. Beautiful products, amazing prices.
                    </p>
                    <button onclick="navigateTo('shop')" class="btn-primary text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-bold text-base sm:text-lg">
                        Shop Now
                    </button>
                </div>
            </div>
        </section>
        
        <!-- Featured Categories -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 class="text-3xl font-bold font-heading mb-8">Featured Categories</h2>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div onclick="navigateTo('shop', { category: 'Electronics' })" 
                     class="bg-surface rounded-xl p-6 cursor-pointer hover:bg-pink-50 transition-all hover:scale-105 shadow-sm">
                    <h3 class="font-bold text-lg text-text">Electronics</h3>
                </div>
                <div onclick="navigateTo('shop', { category: 'Fashion' })" 
                     class="bg-surface rounded-xl p-6 cursor-pointer hover:bg-pink-50 transition-all hover:scale-105 shadow-sm">
                    <h3 class="font-bold text-lg text-text">Fashion</h3>
                </div>
                <div onclick="navigateTo('shop', { category: 'Home' })" 
                     class="bg-surface rounded-xl p-6 cursor-pointer hover:bg-pink-50 transition-all hover:scale-105 shadow-sm">
                    <h3 class="font-bold text-lg text-text">Home</h3>
                </div>
                <div onclick="navigateTo('shop', { category: 'Sports' })" 
                     class="bg-surface rounded-xl p-6 cursor-pointer hover:bg-pink-50 transition-all hover:scale-105 shadow-sm">
                    <h3 class="font-bold text-lg text-text">Sports</h3>
                </div>
            </div>
        </section>
        
        <!-- New Arrivals -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 class="text-3xl font-bold font-heading mb-8">New Arrivals</h2>
            <div id="new-arrivals-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="col-span-full flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        </section>
        
        <!-- Hot Deals -->
        <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h2 class="text-3xl font-bold font-heading mb-8">� Hot Deals</h2>
            <div id="hot-deals-grid" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div class="col-span-full flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
        </section>
        
        <!-- Footer -->
        <footer class="bg-surface border-t border-pink-100 mt-20">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 class="text-2xl font-bold font-heading gradient-text mb-4">ShopAmoniwaa</h3>
                        <p class="text-textLight">Your favorite fashion shop</p>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Quick Links</h4>
                        <ul class="space-y-2 text-textLight">
                            <li><a href="#" onclick="navigateTo('home')" class="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" onclick="navigateTo('shop')" class="hover:text-primary transition-colors">Shop</a></li>
                            <li><a href="#" onclick="navigateTo('admin')" class="hover:text-primary transition-colors">Admin</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Categories</h4>
                        <ul class="space-y-2 text-textLight">
                            <li><a href="#" onclick="navigateTo('shop', { category: 'Electronics' })" class="hover:text-primary transition-colors">Electronics</a></li>
                            <li><a href="#" onclick="navigateTo('shop', { category: 'Fashion' })" class="hover:text-primary transition-colors">Fashion</a></li>
                            <li><a href="#" onclick="navigateTo('shop', { category: 'Home' })" class="hover:text-primary transition-colors">Home</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 class="font-bold mb-4">Contact</h4>
                        <p class="text-textLight">support@shopamoniwaa.com</p>
                    </div>
                </div>
                <div class="border-t border-pink-100 mt-8 pt-8 text-center text-textLight">
                    <p>&copy; 2024 ShopAmoniwaa. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
    
    // Load products
    await loadNewArrivals();
    await loadHotDeals();
}

async function loadNewArrivals() {
    try {
        const { data: products, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('in_stock', true)
            .order('created_at', { ascending: false })
            .limit(8);
        
        if (error) throw error;
        
        const grid = document.getElementById('new-arrivals-grid');
        grid.innerHTML = products.map(product => createProductCard(product).outerHTML).join('');
        
        // Re-attach event listeners
        grid.querySelectorAll('.product-card').forEach((card, index) => {
            card.onclick = () => navigateTo('product', { id: products[index].id });
            const addButton = card.querySelector('button');
            addButton.onclick = (e) => {
                e.stopPropagation();
                addToCart(products[index].id);
            };
        });
    } catch (error) {
        console.error('Error loading new arrivals:', error);
        document.getElementById('new-arrivals-grid').innerHTML = `
            <div class="col-span-full text-center py-12 text-textLight">
                Failed to load products
            </div>
        `;
    }
}

async function loadHotDeals() {
    try {
        const { data: products, error } = await window.supabaseClient
            .from('products')
            .select('*')
            .eq('in_stock', true)
            .lt('price', 500)
            .order('price', { ascending: true })
            .limit(4);
        
        if (error) throw error;
        
        const grid = document.getElementById('hot-deals-grid');
        grid.innerHTML = products.map(product => createProductCard(product).outerHTML).join('');
        
        // Re-attach event listeners
        grid.querySelectorAll('.product-card').forEach((card, index) => {
            card.onclick = () => navigateTo('product', { id: products[index].id });
            const addButton = card.querySelector('button');
            addButton.onclick = (e) => {
                e.stopPropagation();
                addToCart(products[index].id);
            };
        });
    } catch (error) {
        console.error('Error loading hot deals:', error);
        document.getElementById('hot-deals-grid').innerHTML = `
            <div class="col-span-full text-center py-12 text-textLight">
                Failed to load deals
            </div>
        `;
    }
}
