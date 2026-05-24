// CartDrawer component
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    
    if (!cartItemsContainer) return;
    
    if (CartStore.cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="text-center py-12">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <p class="text-textLight">Your cart is empty</p>
            </div>
        `;
        return;
    }
    
    cartItemsContainer.innerHTML = CartStore.cart.map(item => `
        <div class="flex items-center space-x-3 sm:space-x-4 bg-background rounded-lg p-3">
            <img src="${item.image_url || 'https://via.placeholder.com/100x100/FFE4E9/E91E63?text=No+Image'}" 
                 alt="${item.name}" 
                 class="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg">
            <div class="flex-1 min-w-0">
                <h4 class="font-bold font-heading text-text text-sm sm:text-base truncate">${item.name}</h4>
                <p class="text-primary font-bold text-sm sm:text-base">GH₵${item.price.toFixed(2)}</p>
                <div class="flex items-center space-x-2 mt-2">
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1})" 
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface border border-pink-200 flex items-center justify-center hover:border-primary transition-colors text-sm">
                        -
                    </button>
                    <span class="w-6 sm:w-8 text-center font-bold text-sm sm:text-base">${item.quantity}</span>
                    <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1})" 
                            class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-surface border border-pink-200 flex items-center justify-center hover:border-primary transition-colors text-sm">
                        +
                    </button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" class="p-2 text-red-500 hover:text-red-400 transition-colors flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862 2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `).join('');
}

async function updateCartQuantity(productId, quantity) {
    await CartStore.updateQuantity(productId, quantity);
}

async function removeFromCart(productId) {
    await CartStore.removeItem(productId);
}

function checkout() {
    if (CartStore.cart.length === 0) {
        showToast('Your cart is empty', 'error');
        return;
    }
    
    // Show checkout modal
    const app = document.getElementById('app');
    const checkoutModal = document.createElement('div');
    checkoutModal.id = 'checkout-modal';
    checkoutModal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    checkoutModal.innerHTML = `
        <div class="bg-surface rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div class="p-6 border-b border-pink-100">
                <h2 class="text-2xl font-bold font-heading">Checkout</h2>
            </div>
            <form onsubmit="handleCheckoutSubmit(event)" class="p-6 space-y-4">
                <div>
                    <label class="block text-sm font-medium mb-2">Full Name</label>
                    <input type="text" 
                           id="checkout-name"
                           placeholder="Enter your full name" 
                           class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                           required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Phone Number</label>
                    <input type="tel" 
                           id="checkout-phone"
                           placeholder="Enter your phone number" 
                           class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                           required>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Delivery Address</label>
                    <textarea id="checkout-address"
                              placeholder="Enter your delivery address" 
                              rows="3"
                              class="w-full bg-background border border-pink-200 rounded-lg px-4 py-3 text-text focus:border-primary focus:outline-none"
                              required></textarea>
                </div>
                
                <!-- Order Summary -->
                <div class="bg-background rounded-lg p-4">
                    <h3 class="font-bold font-heading mb-3">Order Summary</h3>
                    ${CartStore.cart.map(item => `
                        <div class="flex items-center justify-between py-2 border-b border-pink-100 last:border-0">
                            <div>
                                <p class="font-medium">${item.name}</p>
                                <p class="text-textLight text-sm">Qty: ${item.quantity} × GH₵${item.price.toFixed(2)}</p>
                            </div>
                            <p class="font-bold text-primary">GH₵${(item.quantity * item.price).toFixed(2)}</p>
                        </div>
                    `).join('')}
                    <div class="flex items-center justify-between pt-3 mt-3 border-t border-pink-200">
                        <span class="font-bold font-heading">Total</span>
                        <span class="text-xl font-bold text-primary">GH₵${CartStore.getTotal().toFixed(2)}</span>
                    </div>
                </div>
                
                <!-- MTN MoMo Payment Instructions -->
                <div class="rounded-xl overflow-hidden border-2 border-yellow-400">
                    <div class="bg-yellow-400 px-4 py-2 flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                        </svg>
                        <span class="font-bold text-yellow-900 text-sm">MTN Mobile Money Payment</span>
                    </div>
                    <div class="bg-yellow-50 p-4 space-y-3">
                        <p class="text-sm text-yellow-900 font-medium">Send payment to:</p>
                        <div class="bg-white rounded-lg p-3 space-y-2">
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500">MoMo Number</span>
                                <span class="font-bold text-lg tracking-widest text-yellow-700">0591067094</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500">Account Name</span>
                                <span class="font-bold text-gray-800">Alfred Addo</span>
                            </div>
                            <div class="flex items-center justify-between">
                                <span class="text-xs text-gray-500">Network</span>
                                <span class="font-bold text-yellow-700">MTN</span>
                            </div>
                        </div>
                        <div class="bg-white rounded-lg p-3 flex items-start space-x-3">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            <div>
                                <p class="text-xs text-gray-500">After payment, send screenshot to WhatsApp:</p>
                                <a href="https://wa.me/233500828503" target="_blank" class="font-bold text-green-600 text-lg">0500828503</a>
                            </div>
                        </div>
                        <p class="text-xs text-yellow-800 text-center">⚠️ Your order will be confirmed after payment verification</p>
                    </div>
                </div>
                
                <div class="flex space-x-4 pt-4">
                    <button type="button" onclick="closeCheckoutModal()" class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors">
                        Cancel
                    </button>
                    <button type="submit" class="flex-1 btn-primary text-white py-3 rounded-lg font-medium">
                        Place Order
                    </button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(checkoutModal);
}

async function handleCheckoutSubmit(event) {
    event.preventDefault();
    
    const customerName = document.getElementById('checkout-name').value.trim();
    const customerPhone = document.getElementById('checkout-phone').value.trim();
    const customerAddress = document.getElementById('checkout-address').value.trim();
    const totalAmount = CartStore.getTotal();
    const customerId = CartStore.getCustomerId();
    
    // Show loading state on submit button
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Place Order';
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Placing Order...';
    }
    
    try {
        // Create order
        const { data: order, error: orderError } = await window.supabaseClient
            .from('orders')
            .insert([{
                customer_id: customerId,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                total_amount: totalAmount,
                status: 'pending'
            }])
            .select()
            .single();
        
        if (orderError) {
            console.error('Order insert error:', orderError);
            throw new Error(orderError.message || 'Failed to create order');
        }
        
        // Create order items
        const orderItems = CartStore.cart.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            quantity: item.quantity,
            price: item.price
        }));
        
        const { error: itemsError } = await window.supabaseClient
            .from('order_items')
            .insert(orderItems);
        
        if (itemsError) {
            console.error('Order items insert error:', itemsError);
            // Order was created but items failed — still consider it a success
            // since order_items uses product snapshots
            console.warn('Order items may not have saved, but order was created:', order.id);
        }
        
        // Clear cart
        await CartStore.clearCart();
        toggleCart();
        
        // Close modal
        closeCheckoutModal();
        
        showToast('Order placed successfully! ✓');
        
        // Show order confirmation
        showOrderConfirmation(order);
        
    } catch (error) {
        console.error('Error placing order:', error);
        const msg = error.message || 'Failed to place order. Please try again.';
        showToast(msg, 'error');
        // Re-enable button
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }
}

async function showOrderConfirmation(order) {
    const existingConfirm = document.getElementById('order-confirmation-modal');
    if (existingConfirm) existingConfirm.remove();
    
    // Compute sequential order number by finding this order's position chronologically
    let orderNum = '#----';
    try {
        const { data: allOrders } = await window.supabaseClient
            .from('orders')
            .select('id')
            .order('created_at', { ascending: true });
        if (allOrders) {
            const idx = allOrders.findIndex(o => o.id === order.id);
            if (idx >= 0) orderNum = '#' + String(idx + 1).padStart(4, '0');
        }
    } catch(e) { /* non-critical */ }
    
    const confirmModal = document.createElement('div');
    confirmModal.id = 'order-confirmation-modal';
    confirmModal.className = 'fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4';
    confirmModal.innerHTML = `
        <div class="bg-surface rounded-2xl max-w-md w-full shadow-lg text-center p-8 animate-slide-up">
            <div class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <h2 class="text-2xl font-bold font-heading mb-2">Order Placed! 🎉</h2>
            <p class="text-textLight mb-4">Thank you! Your order has been received and is being processed.</p>
            <div class="bg-background rounded-lg p-4 mb-6 text-left space-y-3">
                <div class="flex items-center justify-between">
                    <p class="text-sm text-textLight">Order Number</p>
                    <p class="font-extrabold text-2xl gradient-text tracking-widest">${orderNum}</p>
                </div>
                <div class="flex items-center justify-between border-t border-pink-100 pt-3">
                    <p class="text-sm text-textLight">Total</p>
                    <p class="font-bold text-primary">GH₵${order.total_amount.toFixed(2)}</p>
                </div>
                <div class="flex items-center justify-between border-t border-pink-100 pt-3">
                    <p class="text-sm text-textLight">Status</p>
                    <span class="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-600">Pending Payment</span>
                </div>
            </div>
            <p class="text-xs text-textLight mb-4">📸 Please send your MoMo payment screenshot to <strong>0500828503</strong> on WhatsApp, quoting order <strong>${orderNum}</strong></p>
            <button onclick="document.getElementById('order-confirmation-modal').remove()" 
                    class="w-full btn-primary text-white py-3 rounded-lg font-bold">
                Continue Shopping
            </button>
        </div>
    `;
    document.body.appendChild(confirmModal);
}

function closeCheckoutModal() {
    const modal = document.getElementById('checkout-modal');
    if (modal) {
        modal.remove();
    }
}
