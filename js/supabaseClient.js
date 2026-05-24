// Supabase client configuration
const SUPABASE_URL = 'https://djhwgcbilrgwwxipqjvy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqaHdnY2JpbHJnd3d4aXBxanZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNzMyODAsImV4cCI6MjA5NDk0OTI4MH0.EJZl975g9mxn1jjYGjNFJ7KwGWKyHYDUXsXepJGyQAw';

// Initialize Supabase client (supabase is already available from CDN)
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export for use in other files
window.supabaseClient = supabaseClient;
