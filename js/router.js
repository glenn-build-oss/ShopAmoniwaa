// Simple router for SPA navigation
const Router = {
    currentPage: 'home',
    
    // Navigate to a page
    navigateTo(page, params = {}) {
        this.currentPage = page;
        window.scrollTo(0, 0);
        
        const app = document.getElementById('app');
        
        switch(page) {
            case 'home':
                renderHome();
                break;
            case 'shop':
                renderShop(params);
                break;
            case 'product':
                renderProductDetail(params.id);
                break;
            case 'admin':
                renderAdmin();
                break;
            default:
                renderHome();
        }
    }
};

// Global navigation function
function navigateTo(page, params = {}) {
    Router.navigateTo(page, params);
}
