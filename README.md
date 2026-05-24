# NexShop - Premium E-Commerce Application

A modern, dark-mode e-commerce web application built with vanilla HTML, CSS, and JavaScript, featuring real-time updates via Supabase.

## 🎨 Features

### Storefront
- **Home Page**: Hero banner with animated text, featured categories, new arrivals, and hot deals
- **Shop Page**: Filterable and searchable product grid with real-time results
- **Product Detail**: Image gallery, product info, stock status, and add to cart
- **Cart Drawer**: Slide-in cart with quantity controls and subtotal
- **Toast Notifications**: Real-time feedback for user actions

### Admin Dashboard
- **Secure Login**: Admin authentication via Supabase or fallback credentials
- **Product Management**: Add, edit, delete products with modal forms
- **Quick Actions**: Toggle stock status without opening edit form
- **Dashboard Stats**: Real-time statistics (total products, stock status, categories)
- **Real-time Updates**: Changes reflect instantly without page refresh

### Design
- **Dark Mode First**: Electric orange (#FF5E1A) + deep charcoal (#0F0F0F) palette
- **Premium Typography**: Cabinet Grotesk (headings) + DM Sans (body)
- **Smooth Animations**: Page transitions, hover effects, skeleton loaders
- **Mobile Responsive**: Hamburger nav, bottom navigation bar, swipeable cards

## 🚀 Setup Instructions

### 1. Database Setup (Supabase)

1. Go to [Supabase](https://supabase.com) and create a new project
2. Navigate to the SQL Editor in your Supabase dashboard
3. Copy and run the SQL from `supabase-schema.sql`
4. Enable Realtime for the `products` table:
   - Go to Database → Replication
   - Enable Realtime for the `products` table
5. Set up Row Level Security (RLS) policies (included in the SQL)

### 2. Environment Configuration

The `.env` file is already configured with your Supabase credentials:
```
VITE_SUPABASE_URL=https://djhwgcbilrgwwxipqjvy.supabase.co
VITE_SUPABASE_ANON_KEY=sb_publishable_s-dtzdRRiVhR6_HQ9IZy-A_b9WXgogg
```

### 3. Admin Authentication

You have two options for admin login:

**Option 1: Supabase Auth (Recommended)**
1. In Supabase, go to Authentication → Users
2. Create a new user with email: `admin@nexshop.com`
3. Set a password for this user
4. The email is already added to the `admin_users` table in the schema

**Option 2: Fallback Credentials**
- Email: `admin@nexshop.com`
- Password: `admin1234`

### 4. Running the Application

Since this is a vanilla HTML/CSS/JS application, you can simply:

1. Open `index.html` in a web browser, OR
2. Use a local server for better development:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   npx http-server
   ```
3. Navigate to `http://localhost:8000`

## 📁 Project Structure

```
ShopAmoniwaa/
├── index.html                 # Main HTML file
├── .env                       # Environment variables
├── supabase-schema.sql        # Database schema
├── README.md                  # This file
└── js/
    ├── app.js                 # Main application initialization
    ├── supabaseClient.js      # Supabase client setup
    ├── cart.js                # Cart state management
    ├── router.js              # Simple SPA router
    ├── components/
    │   ├── Navbar.js          # Navbar functions
    │   ├── ProductCard.js     # Product card component
    │   ├── CartDrawer.js      # Cart drawer component
    │   └── Toast.js           # Toast notifications
    └── pages/
        ├── Home.js            # Home page
        ├── Shop.js            # Shop page
        ├── ProductDetail.js   # Product detail page
        └── Admin.js           # Admin dashboard
```

## 🗄️ Database Schema

### Products Table
- `id` (UUID, primary key)
- `name` (TEXT)
- `description` (TEXT)
- `price` (NUMERIC)
- `category` (TEXT)
- `image_url` (TEXT)
- `stock_quantity` (INTEGER)
- `in_stock` (BOOLEAN)
- `created_at` (TIMESTAMP)

### Admin Users Table
- `id` (UUID, primary key)
- `email` (TEXT, unique)
- `created_at` (TIMESTAMP)

## 🔒 Security

- Supabase Row Level Security (RLS) enabled
- Public read access for products
- Authenticated write access for products
- Admin credentials stored in database (not hardcoded)
- Environment variables for sensitive data

## 🎯 Key Features Implementation

### Real-time Updates
- Uses Supabase Realtime subscriptions
- Admin changes reflect instantly on storefront
- No page refresh required

### Cart Management
- LocalStorage persistence
- Add/remove items
- Quantity controls
- Real-time subtotal calculation

### Responsive Design
- Mobile-first approach
- Bottom navigation on mobile
- Hamburger menu
- Touch-friendly interactions

## 📝 Sample Data

The schema includes 8 sample products across categories:
- Electronics (Headphones, Smart Watch, Bluetooth Speaker)
- Fashion (Leather Jacket, T-Shirt)
- Sports (Running Shoes, Yoga Mat)
- Home (Desk Lamp)

## 🎨 Customization

### Colors
Edit the Tailwind config in `index.html`:
```javascript
colors: {
    primary: '#FF5E1A',
    dark: '#0F0F0F',
    darker: '#0A0A0A',
    card: '#1A1A1A',
    light: '#FFFFFF'
}
```

### Fonts
Google Fonts are loaded in the HTML head:
- Cabinet Grotesk (headings)
- DM Sans (body)

## 🐛 Troubleshooting

### Products not loading
- Check Supabase URL and keys in `.env`
- Verify RLS policies are set correctly
- Check browser console for errors

### Real-time updates not working
- Ensure Realtime is enabled for the `products` table in Supabase
- Check your Supabase project's Realtime settings

### Admin login failing
- Verify admin user exists in `admin_users` table
- Check Supabase Auth settings
- Try fallback credentials (admin@nexshop.com / admin1234)

## 📄 License

This project is for educational purposes.

## 🤝 Support

For issues or questions, check the browser console for error messages and verify your Supabase configuration.
