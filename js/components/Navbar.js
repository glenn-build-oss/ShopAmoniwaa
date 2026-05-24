// Navbar component functions
function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('hidden');
}

function toggleCart() {
    const cartDrawer = document.getElementById('cart-drawer');
    const cartOverlay = document.getElementById('cart-overlay');
    
    if (cartDrawer.classList.contains('closed')) {
        cartDrawer.classList.remove('closed');
        cartDrawer.classList.add('open');
        cartOverlay.classList.remove('hidden');
    } else {
        cartDrawer.classList.remove('open');
        cartDrawer.classList.add('closed');
        cartOverlay.classList.add('hidden');
    }
}
