// Cart state management
const CartStore = {
    cart: [],
    customerId: null,
    
    // Get or generate customer ID (persisted in localStorage)
    getCustomerId() {
        if (!this.customerId) {
            let stored = localStorage.getItem('shopamoniwaa_customer_id');
            if (!stored) {
                stored = 'cust_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
                localStorage.setItem('shopamoniwaa_customer_id', stored);
            }
            this.customerId = stored;
        }
        return this.customerId;
    },
    
    // Load cart from Supabase
    async loadFromStorage() {
        const customerId = this.getCustomerId();
        try {
            const { data, error } = await window.supabaseClient
                .from('cart_items')
                .select('*')
                .eq('customer_id', customerId);
            
            if (error) throw error;
            
            this.cart = data.map(item => ({
                id: item.product_id,
                name: item.product_name,
                price: item.price,
                quantity: item.quantity,
                image_url: item.image_url,
                cartItemId: item.id
            }));
            
            this.updateUI();
        } catch (error) {
            console.error('Error loading cart:', error);
        }
    },
    
    // Add item to cart (optimistic update — UI updates instantly)
    async addItem(product) {
        const customerId = this.getCustomerId();
        
        // --- Optimistic update: update local state & UI immediately ---
        const existingLocal = this.cart.find(item => item.id === product.id);
        if (existingLocal) {
            existingLocal.quantity += 1;
        } else {
            this.cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: 1,
                image_url: product.image_url,
                cartItemId: null
            });
        }
        this.updateUI();
        showToast('Added to cart ✓');
        
        // --- Sync to Supabase in background (non-blocking) ---
        (async () => {
            try {
                // Check if item already exists in DB
                const { data: existingItems, error: checkError } = await window.supabaseClient
                    .from('cart_items')
                    .select('*')
                    .eq('customer_id', customerId)
                    .eq('product_id', product.id)
                    .single();
                
                if (checkError && checkError.code !== 'PGRST116') {
                    throw checkError;
                }
                
                if (existingItems) {
                    const { error: updateError } = await window.supabaseClient
                        .from('cart_items')
                        .update({ 
                            quantity: existingItems.quantity + 1,
                            updated_at: new Date().toISOString()
                        })
                        .eq('id', existingItems.id);
                    if (updateError) throw updateError;
                    // Update cartItemId in local state
                    const localItem = this.cart.find(i => i.id === product.id);
                    if (localItem) localItem.cartItemId = existingItems.id;
                } else {
                    const { data: inserted, error: insertError } = await window.supabaseClient
                        .from('cart_items')
                        .insert([{
                            customer_id: customerId,
                            product_id: product.id,
                            product_name: product.name,
                            quantity: 1,
                            price: product.price,
                            image_url: product.image_url
                        }])
                        .select()
                        .single();
                    if (insertError) throw insertError;
                    // Store the real DB id so remove/update works
                    const localItem = this.cart.find(i => i.id === product.id);
                    if (localItem && inserted) localItem.cartItemId = inserted.id;
                }
            } catch (error) {
                console.error('Error syncing cart to DB:', error);
            }
        })();
    },
    
    // Remove item from cart
    async removeItem(productId) {
        try {
            const cartItem = this.cart.find(item => item.id === productId);
            if (!cartItem) return;
            
            const { error } = await window.supabaseClient
                .from('cart_items')
                .delete()
                .eq('id', cartItem.cartItemId);
            
            if (error) throw error;
            
            await this.loadFromStorage();
            showToast('Removed from cart');
        } catch (error) {
            console.error('Error removing from cart:', error);
            showToast('Failed to remove from cart', 'error');
        }
    },
    
    // Update item quantity
    async updateQuantity(productId, quantity) {
        if (quantity <= 0) {
            await this.removeItem(productId);
            return;
        }
        
        try {
            const cartItem = this.cart.find(item => item.id === productId);
            if (!cartItem) return;
            
            const { error } = await window.supabaseClient
                .from('cart_items')
                .update({ 
                    quantity: quantity,
                    updated_at: new Date().toISOString()
                })
                .eq('id', cartItem.cartItemId);
            
            if (error) throw error;
            
            await this.loadFromStorage();
        } catch (error) {
            console.error('Error updating cart quantity:', error);
            showToast('Failed to update quantity', 'error');
        }
    },
    
    // Get cart total
    getTotal() {
        return this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    
    // Get cart count
    getCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    },
    
    // Clear cart
    async clearCart() {
        const customerId = this.getCustomerId();
        try {
            const { error } = await window.supabaseClient
                .from('cart_items')
                .delete()
                .eq('customer_id', customerId);
            
            if (error) throw error;
            
            this.cart = [];
            this.updateUI();
        } catch (error) {
            console.error('Error clearing cart:', error);
            showToast('Failed to clear cart', 'error');
        }
    },
    
    // Update UI elements
    updateUI() {
        const cartCount = document.getElementById('cart-count');
        const mobileCartCount = document.getElementById('mobile-cart-count');
        const cartSubtotal = document.getElementById('cart-subtotal');
        
        if (cartCount) {
            cartCount.textContent = this.getCount();
        }
        
        if (mobileCartCount) {
            mobileCartCount.textContent = this.getCount();
        }
        
        if (cartSubtotal) {
            cartSubtotal.textContent = `GH₵${this.getTotal().toFixed(2)}`;
        }
        
        renderCartItems();
    }
};
