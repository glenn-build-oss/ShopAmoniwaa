// Shop page
let currentProducts = [];
let currentCategory = null;
let currentSort = 'newest';
let searchQuery = '';

async function renderShop(params = {}) {
    const app = document.getElementById('app');
    
    currentCategory = params.category || null;
    
    app.innerHTML = `
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Page Header -->
            <div class="mb-8">
                <h1 class="text-3xl sm:text-4xl font-bold font-heading mb-2">Shop</h1>
                <p class="text-textLight">Discover our beautiful collection</p>
            </div>
            
            <!-- Filters and Search -->
            <div class="bg-surface rounded-xl p-6 mb-8 shadow-sm">
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <!-- Search -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Search</label>
                        <input type="text" 
                               id="search-input"
                               placeholder="Search products..." 
                               class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                               oninput="handleSearch(this.value)">
                    </div>
                    
                    <!-- Category Filter -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Category</label>
                        <select id="category-filter" 
                                class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                onchange="handleCategoryChange(this.value)">
                            <option value="">All Categories</option>
                            <option value="__preorder__" ${currentCategory === '__preorder__' ? 'selected' : ''}>✨ Pre-Orders</option>
                            <option value="Electronics" ${currentCategory === 'Electronics' ? 'selected' : ''}>Electronics</option>
                            <option value="Fashion" ${currentCategory === 'Fashion' ? 'selected' : ''}>Fashion</option>
                            <option value="Home" ${currentCategory === 'Home' ? 'selected' : ''}>Home</option>
                            <option value="Sports" ${currentCategory === 'Sports' ? 'selected' : ''}>Sports</option>
                        </select>
                    </div>
                    
                    <!-- Sort -->
                    <div>
                        <label class="block text-sm font-medium mb-2">Sort By</label>
                        <select id="sort-filter" 
                                class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                                onchange="handleSortChange(this.value)">
                            <option value="newest">Newest</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
            </div>
            
            <!-- Products Grid -->
            <div id="products-grid" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div class="col-span-full flex items-center justify-center py-12">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </div>
            
            <!-- No Results -->
            <div id="no-results" class="hidden text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p class="text-textLight text-lg">No products found</p>
            </div>
        </div>
    `;
    
    await loadProducts();
}

async function loadProducts() {
    try {
        let query = window.supabaseClient.from('products').select('*');

        // Apply category filter
        if (currentCategory === '__preorder__') {
            query = query.eq('is_preorder', true);
        } else if (currentCategory) {
            query = query.eq('category', currentCategory);
        }
        
        // Apply search filter
        if (searchQuery) {
            query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }
        
        // Apply sorting
        switch (currentSort) {
            case 'price-low':
                query = query.order('price', { ascending: true });
                break;
            case 'price-high':
                query = query.order('price', { ascending: false });
                break;
            default:
                query = query.order('created_at', { ascending: false });
        }
        
        const { data: products, error } = await query;
        
        if (error) throw error;
        
        currentProducts = products;
        renderProductsGrid(products);
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('products-grid').innerHTML = `
            <div class="col-span-full text-center py-12 text-textLight">
                Failed to load products
            </div>
        `;
    }
}

function renderProductsGrid(products) {
    const grid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (products.length === 0) {
        grid.innerHTML = '';
        noResults.classList.remove('hidden');
        return;
    }
    
    noResults.classList.add('hidden');
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
}

function handleSearch(value) {
    searchQuery = value;
    loadProducts();
}

function handleCategoryChange(value) {
    currentCategory = value || null;
    loadProducts();
}

function handleSortChange(value) {
    currentSort = value;
    loadProducts();
}
