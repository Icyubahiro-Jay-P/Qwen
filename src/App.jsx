import React, { useState, useContext, createContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import {ShoppingBag} from "lucide-react"

// Create context for our app state
const AppContext = createContext();

// Custom hook to use the app context
const useAppContext = () => useContext(AppContext);

// Mock data for products
const mockProducts = [
  {
    id: 1,
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation and 24-hour battery life.",
    price: 89.99,
    category: "Electronics",
    rating: 4.5,
    images: [
      "https://picsum.photos/seed/headphones1/400/400 ",
      "https://picsum.photos/seed/headphones2/400/400 ",
      "https://picsum.photos/seed/headphones3/400/400 "
    ],
    inStock: true
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    price: 129.99,
    category: "Electronics",
    rating: 4.2,
    images: [
      "https://picsum.photos/seed/watch1/400/400 ",
      "https://picsum.photos/seed/watch2/400/400 ",
      "https://picsum.photos/seed/watch3/400/400 "
    ],
    inStock: true
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and eco-friendly t-shirt made from 100% organic cotton.",
    price: 24.99,
    category: "Clothing",
    rating: 4.0,
    images: [
      "https://picsum.photos/seed/tshirt1/400/400 ",
      "https://picsum.photos/seed/tshirt2/400/400 ",
      "https://picsum.photos/seed/tshirt3/400/400 "
    ],
    inStock: true
  },
  {
    id: 4,
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly and durable water bottle with double-wall insulation to keep drinks cold for 24 hours.",
    price: 19.99,
    category: "Home & Kitchen",
    rating: 4.3,
    images: [
      "https://picsum.photos/seed/bottle1/400/400 ",
      "https://picsum.photos/seed/bottle2/400/400 ",
      "https://picsum.photos/seed/bottle3/400/400 "
    ],
    inStock: false
  },
  {
    id: 5,
    name: "Ergonomic Office Chair",
    description: "Supportive office chair with adjustable height, lumbar support, and breathable fabric.",
    price: 199.99,
    category: "Furniture",
    rating: 4.6,
    images: [
      "https://picsum.photos/seed/chair1/400/400 ",
      "https://picsum.photos/seed/chair2/400/400 ",
      "https://picsum.photos/seed/chair3/400/400 "
    ],
    inStock: true
  },
  {
    id: 6,
    name: "Wireless Charging Pad",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 39.99,
    category: "Electronics",
    rating: 4.1,
    images: [
      "https://picsum.photos/seed/charger1/400/400 ",
      "https://picsum.photos/seed/charger2/400/400 ",
      "https://picsum.photos/seed/charger3/400/400 "
    ],
    inStock: true
  },
  {
    id: 7,
    name: "Organic Skincare Set",
    description: "Complete skincare set with cleanser, toner, and moisturizer made from natural ingredients.",
    price: 69.99,
    category: "Beauty",
    rating: 4.7,
    images: [
      "https://picsum.photos/seed/skincare1/400/400 ",
      "https://picsum.photos/seed/skincare2/400/400 ",
      "https://picsum.photos/seed/skincare3/400/400 "
    ],
    inStock: true
  },
  {
    id: 8,
    name: "Smart LED Light Bulb",
    description: "Voice-controlled smart light bulb with adjustable color temperature and brightness.",
    price: 29.99,
    category: "Home & Kitchen",
    rating: 4.0,
    images: [
      "https://picsum.photos/seed/lightbulb1/400/400 ",
      "https://picsum.photos/seed/lightbulb2/400/400 ",
      "https://picsum.photos/seed/lightbulb3/400/400 "
    ],
    inStock: true
  }
];

// Mock categories
const categories = ["All", "Electronics", "Clothing", "Home & Kitchen", "Furniture", "Beauty"];

// Mock users
const mockUsers = [
  { id: 1, email: "user@example.com", password: "password", role: "user" },
  { id: 2, email: "admin@example.com", password: "admin", role: "admin" }
];

// Main App Component
const App = () => {
  
  // State for theme toggle
  const [darkMode, setDarkMode] = useState(true);
  
  // State for user authentication
  const [user, setUser] = useState(null);
  
  // State for cart
  const [cart, setCart] = useState([]);
  
  // State for products
  const [products, setProducts] = useState(mockProducts);
  
  // State for current product being edited in admin dashboard
  const [currentProduct, setCurrentProduct] = useState(null);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Add to cart function
  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Update quantity if item already exists
      const updatedCart = cart.map(item => 
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 } 
          : item
      );
      setCart(updatedCart);
    } else {
      // Add new item to cart
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    // Show success notification
    showNotification("Item added to cart!");
  };
  
  // Remove from cart function
  const removeFromCart = (productId) => {
    const updatedCart = cart.filter(item => item.id !== productId);
    setCart(updatedCart);
    
    // Show success notification
    showNotification("Item removed from cart!");
  };
  
  // Update item quantity in cart
  const updateCartItemQuantity = (productId, quantity) => {
    const updatedCart = cart.map(item => 
      item.id === productId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
  };
  
  // Login function
  const login = (email, password) => {
    const foundUser = mockUsers.find(user => user.email === email && user.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      showNotification(`Welcome back, ${foundUser.email}!`);
      return true;
    } else {
      showNotification("Invalid email or password", "error");
      return false;
    }
  };
  
  // Logout function
  const logout = () => {
    setUser(null);
    showNotification("You have been logged out.");
  };
  
  // Register function
  const register = (email, password) => {
    // Check if user already exists
    const existingUser = mockUsers.find(user => user.email === email);
    
    if (existingUser) {
      showNotification("Email already registered", "error");
      return false;
    }
    
    // Create new user
    const newUser = {
      id: mockUsers.length + 1,
      email,
      password,
      role: "user"
    };
    
    // Add to mock users array (in a real app, this would be an API call)
    mockUsers.push(newUser);
    setUser(newUser);
    
    showNotification("Registration successful!");
    return true;
  };
  
  // Add product function (for admin dashboard)
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    
    setProducts([...products, newProduct]);
    showNotification("Product added successfully!");
  };
  
  // Update product function (for admin dashboard)
  const updateProduct = (product) => {
    const updatedProducts = products.map(p => 
      p.id === product.id ? product : p
    );
    
    setProducts(updatedProducts);
    showNotification("Product updated successfully!");
  };
  
  // Delete product function (for admin dashboard)
  const deleteProduct = (productId) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    showNotification("Product deleted successfully!");
  };
  
  // Notification state
  const [notification, setNotification] = useState({ message: "", type: "success", visible: false });
  
  // Function to show notification
  const showNotification = (message, type = "success") => {
    setNotification({ message, type, visible: true });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ message: "", type: "success", visible: false });
    }, 3000);
  };
  
  // Calculate total cart price
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  // Application context value
  const contextValue = {
    darkMode,
    toggleDarkMode,
    user,
    login,
    logout,
    register,
    cart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    cartTotal,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    currentProduct,
    setCurrentProduct,
    categories
  };
  
  return (
    <AppContext.Provider value={contextValue}>
      <Router>
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'} transition-colors duration-300 font-lato`}>
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListingPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
          <Footer />
          
          {/* Notification component */}
          <Notification message={notification.message} type={notification.type} visible={notification.visible} />
        </div>
      </Router>
    </AppContext.Provider>
  );
};

// Header Component
const Header = () => {
  const { darkMode, toggleDarkMode, cart, user } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <header className={`py-4 px-6 md:px-12 shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => navigate('/')} 
            className="text-2xl font-bold font-montserrat tracking-tight"
          >
            Shop<span className="text-indigo-600">Ease</span>
          </button>
        </div>
        
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="font-montserrat hover:text-indigo-600 transition-colors">Home</Link>
          <Link to="/products" className="font-montserrat hover:text-indigo-600 transition-colors">Products</Link>
          <Link to="/cart" className="font-montserrat hover:text-indigo-600 transition-colors">Cart ({cart.length})</Link>
          {user && user.role === 'admin' && (
            <Link to="/admin" className="font-montserrat hover:text-indigo-600 transition-colors">Admin</Link>
          )}
        </nav>
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {darkMode ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
          
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">{user.email}</span>
              <button 
                onClick={()=>window.location.assign("./")}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
              >
                Register
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/cart')}
            className="relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </button>
          
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
};

// Footer Component
const Footer = () => {
  const { darkMode, user, logout } = useAppContext();
  return (
    <footer className={`py-8 px-6 md:px-12 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'} mt-12`}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">ShopEase</h3>
            <p className="text-sm">Your one-stop shop for quality products at affordable prices. Discover the latest trends in electronics, fashion, home goods, and more.</p>
          </div>
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-indigo-600 transition-colors">Products</Link></li>
              <li><Link to="/cart" className="hover:text-indigo-600 transition-colors">Cart</Link></li>
              {
                user === null ? 
                  <li><Link to="/login" className="hover:text-indigo-600 transition-colors">Login</Link></li> :
                  <li onClick={logout}><Link to="/login" className="hover:text-indigo-600 transition-colors">Logout</Link></li> 
              }
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Contact Us</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">FAQs</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Shipping Policy</Link></li>
              <li><Link to="#" className="hover:text-indigo-600 transition-colors">Return Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-montserrat font-bold mb-4">Subscribe to Our Newsletter</h3>
            <p className="text-sm mb-4">Get the latest updates on new products and upcoming sales.</p>
            <form className="flex">
              <input 
                type="email" 
                placeholder="Your email address" 
                className={`flex-grow px-4 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${darkMode ? 'bg-gray-700' : 'bg-white'}`}
              />
              <button 
                type="submit" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-r-md hover:bg-indigo-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-300 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopEase. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Notification Component
const Notification = ({ message, type, visible }) => {
  if (!visible) return null;
  
  return (
    <div 
      className={`fixed top-4 right-4 px-6 py-3 rounded-md shadow-lg z-50 transition-opacity duration-300 ${
        type === 'success' 
          ? 'bg-green-500 text-white' 
          : 'bg-red-500 text-white'
      }`}
    >
      {message}
    </div>
  );
};

// Home Page Component
const HomePage = () => {
  const { products, categories, darkMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Get featured products (first 4 products)
  const featuredProducts = products.slice(0, 4);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Banner */}
      <div className={`relative rounded-lg overflow-hidden mb-12 h-64 md:h-96`}>
        <img 
          src="https://picsum.photos/seed/ecommerce/1200/400 " 
          alt="ShopEase Promotion" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-montserrat font-bold mb-4">Welcome to ShopEase</h1>
            <p className="text-xl md:text-2xl mb-6">Your one-stop destination for premium products</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
            >
              Shop Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <section className="mb-16">
        <h2 className="text-3xl font-montserrat font-bold mb-8 text-center">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      
      {/* Category Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-montserrat font-bold mb-6 text-center">Shop by Category</h2>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors ${
                activeCategory === category
                  ? 'bg-indigo-600 text-white'
                  : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600'
                    : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter(product => activeCategory === 'All' || product.category === activeCategory)
            .slice(0, 8)
            .map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
        </div>
      </section>
      
      {/* Promotional Banner */}
      <div className={`rounded-lg overflow-hidden mb-16 h-64 md:h-80 relative`}>
        <img 
          src="https://picsum.photos/seed/sale/1200/400 " 
          alt="Seasonal Sale" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h2 className="text-3xl md:text-4xl font-montserrat font-bold mb-4">Seasonal Sale!</h2>
            <p className="text-xl mb-6">Up to 50% off on selected items</p>
            <button 
              onClick={() => window.location.href = '/products'}
              className="px-6 py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
            >
              Shop the Sale
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Product Card Component
const ProductCard = ({ product }) => {
  const { addToCart, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  return (
    <div 
      className={`rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}
    >
      <div 
        className="relative h-64 overflow-hidden cursor-pointer"
        onClick={() => navigate(`/products/${product.id}`)}
      >
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        {!product.inStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-bold text-lg">Out of Stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-montserrat font-semibold text-lg mb-2">{product.name}</h3>
        <p className={`text-sm mb-4 line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {product.description}
        </p>
        <div className="flex justify-between items-center">
          <span className="font-montserrat font-bold">${product.price.toFixed(2)}</span>
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating) 
                    ? 'text-yellow-400' 
                    : 'text-gray-300'
                }`} 
                fill="currentColor" 
                viewBox="0 0 20 20" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-xs">{product.rating}</span>
          </div>
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            if (product.inStock) {
              addToCart(product);
            }
          }}
          disabled={!product.inStock}
          className={`mt-4 w-full py-2 rounded-md font-montserrat transition-colors ${
            product.inStock
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-gray-400 cursor-not-allowed text-gray-200'
          }`}
        >
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  );
};

// Product Listing Page Component
const ProductListingPage = () => {
  const { products, categories, addToCart, darkMode } = useAppContext();
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortOption, setSortOption] = useState('default');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (activeCategory === 'All' || product.category === activeCategory) &&
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortOption) {
        case 'priceAsc':
          return a.price - b.price;
        case 'priceDesc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-montserrat font-bold mb-8">All Products</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 md:items-center">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              darkMode ? 'bg-gray-800' : 'bg-gray-100'
            }`}
          />
          <svg 
            className="w-5 h-5 absolute right-3 top-2.5 text-gray-500" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
            />
          </svg>
        </div>
        
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            darkMode ? 'bg-gray-800' : 'bg-gray-100'
          }`}
        >
          <option value="default">Sort by</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="rating">Rating</option>
        </select>
      </div>
      
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-4 py-2 rounded-full transition-colors ${
              activeCategory === category
                ? 'bg-indigo-600 text-white'
                : darkMode
                  ? 'bg-gray-700 hover:bg-gray-600'
                  : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      
      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-montserrat font-medium mt-4">No products found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you're looking for.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchQuery('');
              setSortOption('default');
            }}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

// Product Detail Page Component
const ProductDetailPage = () => {
  const { products, addToCart, darkMode } = useAppContext();
  const { id } = useParams();
  const navigate = useNavigate();
  
  const product = products.find(p => p.id === parseInt(id));
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-montserrat font-bold mb-4">Product Not Found</h1>
        <p className="mb-6">The product you're looking for doesn't exist.</p>
        <button 
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image Carousel */}
        <div className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className="w-full h-96 object-cover"
          />
          {/* Image Thumbnails */}
          <div className="flex p-2 gap-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <img 
                key={index}
                src={image} 
                alt={`${product.name} ${index + 1}`} 
                className="w-16 h-16 object-cover rounded cursor-pointer hover:opacity-75 transition-opacity"
              />
            ))}
          </div>
        </div>
        
        {/* Product Details */}
        <div>
          <h1 className="text-3xl font-montserrat font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">({product.rating})</span>
          </div>
          <div className="mb-6">
            <span className="text-2xl font-montserrat font-bold">${product.price.toFixed(2)}</span>
          </div>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {product.description}
          </p>
          
          <button 
            onClick={() => addToCart(product)}
            disabled={!product.inStock}
            className={`w-full py-3 rounded-md font-montserrat transition-colors ${
              product.inStock
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-400 cursor-not-allowed text-gray-200'
            }`}
          >
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
          
          <div className="mt-6">
            <h3 className="text-lg font-montserrat font-semibold mb-2">Product Information</h3>
            <ul className={`list-disc pl-5 space-y-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <li>Category: {product.category}</li>
              <li>In Stock: {product.inStock ? 'Yes' : 'No'}</li>
              <li>Rating: {product.rating} stars</li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Related Products */}
      <div className="mt-16">
        <h2 className="text-2xl font-montserrat font-bold mb-6">Related Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products
            .filter(p => p.category === product.category && p.id !== product.id)
            .slice(0, 4)
            .map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
        </div>
      </div>
    </div>
  );
};

// Cart Page Component
const CartPage = () => {
  const { cart, updateCartItemQuantity, removeFromCart, cartTotal, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="text-3xl font-montserrat font-bold mt-4">Your Cart is Empty</h1>
        <p className="mt-2 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <button 
          onClick={() => navigate('/products')}
          className="px-6 py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-montserrat font-bold mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <table className="w-full">
              <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <tr className="text-left">
                  <th className="px-6 py-3 font-montserrat font-semibold">Product</th>
                  <th className="px-6 py-3 font-montserrat font-semibold">Price</th>
                  <th className="px-6 py-3 font-montserrat font-semibold">Quantity</th>
                  <th className="px-6 py-3 font-montserrat font-semibold">Total</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img 
                          src={item.images[0]} 
                          alt={item.name} 
                          className="w-16 h-16 object-cover mr-4"
                        />
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">${item.price.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className={`p-1 rounded-full ${
                            item.quantity <= 1 
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                          </svg>
                        </button>
                        <span className="mx-2">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded-full hover:bg-gray-200"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" />
                          </svg>
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">${(item.price * item.quantity).toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <h2 className="text-xl font-montserrat font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-montserrat font-bold">Total</span>
                  <span className="font-montserrat font-bold">${(cartTotal + 5).toFixed(2)}</span>
                </div>
              </div>
              
              <button 
                onClick={() => navigate('/checkout')}
                className="w-full py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="font-montserrat font-bold mb-2">Need Help?</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Contact our customer support team for any questions about your order or products.
            </p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-800 font-montserrat">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Login Page Component
const LoginPage = () => {
  const { login, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (login(email, password)) {
      navigate('/');
    } else {
      setError('Invalid email or password');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-montserrat font-bold mb-6">Login</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              <Like/>{error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-montserrat">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block mb-2 font-montserrat">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 font-montserrat">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Register Page Component
const RegisterPage = () => {
  const { register, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (register(email, password)) {
      navigate('/login');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="p-6">
          <h1 className="text-2xl font-montserrat font-bold mb-6">Register</h1>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 font-montserrat">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-montserrat">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-montserrat">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                }`}
              />
            </div>
            
            <button 
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
            >
              Create Account
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-montserrat">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Checkout Page Component
const CheckoutPage = () => {
  const { cart, cartTotal, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('creditCard');
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: value
    });
  };
  
  // Validate shipping info
  const validateShippingInfo = () => {
    const newErrors = {};
    
    if (!shippingInfo.firstName) newErrors.firstName = 'First name is required';
    if (!shippingInfo.lastName) newErrors.lastName = 'Last name is required';
    if (!shippingInfo.address) newErrors.address = 'Address is required';
    if (!shippingInfo.city) newErrors.city = 'City is required';
    if (!shippingInfo.state) newErrors.state = 'State is required';
    if (!shippingInfo.zip) newErrors.zip = 'ZIP code is required';
    if (!shippingInfo.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle next step
  const handleNextStep = () => {
    if (step === 1 && validateShippingInfo()) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };
  
  // Handle previous step
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === 1 && !validateShippingInfo()) return;
    
    if (step === 3) {
      // Here you would typically send the order data to a server
      alert('Order placed successfully!');
      navigate('/');
    } else {
      handleNextStep();
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-montserrat font-bold mb-8">Checkout</h1>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className={`flex flex-col items-center ${step >= 1 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 1 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>
              1
            </div>
            <span className="text-sm font-montserrat">Shipping</span>
          </div>
          
          <div className="flex-1 mx-4 h-0.5 bg-gray-300"></div>
          
          <div className={`flex flex-col items-center ${step >= 2 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 2 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>
              2
            </div>
            <span className="text-sm font-montserrat">Payment</span>
          </div>
          
          <div className="flex-1 mx-4 h-0.5 bg-gray-300"></div>
          
          <div className={`flex flex-col items-center ${step >= 3 ? 'text-indigo-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              step >= 3 ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}>
              3
            </div>
            <span className="text-sm font-montserrat">Review</span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                {/* Step 1: Shipping Information */}
                {step === 1 && (
                  <>
                    <h2 className="text-xl font-montserrat font-bold mb-6">Shipping Information</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="firstName" className="block mb-2 font-montserrat text-sm">First Name</label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={shippingInfo.firstName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          } ${errors.firstName ? 'border border-red-500' : ''}`}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="lastName" className="block mb-2 font-montserrat text-sm">Last Name</label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          value={shippingInfo.lastName}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          } ${errors.lastName ? 'border border-red-500' : ''}`}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="address" className="block mb-2 font-montserrat text-sm">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } ${errors.address ? 'border border-red-500' : ''}`}
                      />
                      {errors.address && (
                        <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label htmlFor="city" className="block mb-2 font-montserrat text-sm">City</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingInfo.city}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          } ${errors.city ? 'border border-red-500' : ''}`}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-xs mt-1">{errors.city}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block mb-2 font-montserrat text-sm">State</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={shippingInfo.state}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          } ${errors.state ? 'border border-red-500' : ''}`}
                        />
                        {errors.state && (
                          <p className="text-red-500 text-xs mt-1">{errors.state}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="zip" className="block mb-2 font-montserrat text-sm">ZIP Code</label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={shippingInfo.zip}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          } ${errors.zip ? 'border border-red-500' : ''}`}
                        />
                        {errors.zip && (
                          <p className="text-red-500 text-xs mt-1">{errors.zip}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="country" className="block mb-2 font-montserrat text-sm">Country</label>
                      <input
                        type="text"
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        } ${errors.country ? 'border border-red-500' : ''}`}
                      />
                      {errors.country && (
                        <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                      )}
                    </div>
                  </>
                )}
                
                {/* Step 2: Payment Method */}
                {step === 2 && (
                  <>
                    <h2 className="text-xl font-montserrat font-bold mb-6">Payment Method</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="flex items-center p-4 border rounded-md cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="creditCard"
                            checked={paymentMethod === 'creditCard'}
                            onChange={() => setPaymentMethod('creditCard')}
                            className="form-radio h-5 w-5 text-indigo-600"
                          />
                          <span className="ml-3 font-montserrat">Credit Card</span>
                        </label>
                        
                        {paymentMethod === 'creditCard' && (
                          <div className="mt-4 ml-8 space-y-4">
                            <div>
                              <label htmlFor="cardNumber" className="block mb-2 font-montserrat text-sm">Card Number</label>
                              <input
                                type="text"
                                id="cardNumber"
                                placeholder="1234 5678 9012 3456"
                                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label htmlFor="expiryDate" className="block mb-2 font-montserrat text-sm">Expiry Date</label>
                                <input
                                  type="text"
                                  id="expiryDate"
                                  placeholder="MM/YY"
                                  className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}
                                />
                              </div>
                              
                              <div>
                                <label htmlFor="cvv" className="block mb-2 font-montserrat text-sm">CVV</label>
                                <input
                                  type="text"
                                  id="cvv"
                                  placeholder="123"
                                  className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                  }`}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <label htmlFor="cardName" className="block mb-2 font-montserrat text-sm">Name on Card</label>
                              <input
                                type="text"
                                id="cardName"
                                placeholder="John Doe"
                                className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <label className="flex items-center p-4 border rounded-md cursor-pointer">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            checked={paymentMethod === 'paypal'}
                            onChange={() => setPaymentMethod('paypal')}
                            className="form-radio h-5 w-5 text-indigo-600"
                          />
                          <span className="ml-3 font-montserrat">PayPal</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Step 3: Review Order */}
                {step === 3 && (
                  <>
                    <h2 className="text-xl font-montserrat font-bold mb-6">Review Your Order</h2>
                    
                    <div className="mb-6">
                      <h3 className="font-montserrat font-semibold mb-2">Shipping Information</h3>
                      <p>{shippingInfo.firstName} {shippingInfo.lastName}</p>
                      <p>{shippingInfo.address}</p>
                      <p>{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                      <p>{shippingInfo.country}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-montserrat font-semibold mb-2">Payment Method</h3>
                      <p>{paymentMethod === 'creditCard' ? 'Credit Card' : 'PayPal'}</p>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="font-montserrat font-semibold mb-2">Order Items</h3>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              <th className="pb-2 text-left font-montserrat">Product</th>
                              <th className="pb-2 text-left font-montserrat">Quantity</th>
                              <th className="pb-2 text-left font-montserrat">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cart.map(item => (
                              <tr key={item.id} className={`border-t border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                <td className="py-2">{item.name}</td>
                                <td className="py-2">{item.quantity}</td>
                                <td className="py-2">${(item.price * item.quantity).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
                
                <div className="flex justify-between mt-8">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className={`px-6 py-2 rounded-md font-montserrat ${
                        darkMode 
                          ? 'bg-gray-700 hover:bg-gray-600' 
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      Back
                    </button>
                  )}
                  
                  <button
                    type="submit"
                    className="px-6 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700"
                  >
                    {step === 3 ? 'Place Order' : 'Next'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div>
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <h2 className="text-xl font-montserrat font-bold mb-4">Order Summary</h2>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>$5.00</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="font-montserrat font-bold">Total</span>
                  <span className="font-montserrat font-bold">${(cartTotal + 5).toFixed(2)}</span>
                </div>
              </div>
              
              <div className={`p-3 rounded-md text-sm ${
                step === 1 
                  ? 'bg-blue-100 text-blue-800' 
                  : step === 2
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-green-100 text-green-800'
              }`}>
                {step === 1 && 'Please fill in your shipping information.'}
                {step === 2 && 'Please select your payment method.'}
                {step === 3 && 'Review your order details before placing.'}
              </div>
            </div>
          </div>
          
          <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
            <h3 className="font-montserrat font-bold mb-2">Need Help?</h3>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Contact our customer support team for any questions about your order or products.
            </p>
            <button className="mt-2 text-indigo-600 hover:text-indigo-800 font-montserrat">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Admin Dashboard Component
const AdminDashboard = () => {
  const { products, addProduct, updateProduct, deleteProduct, currentProduct, setCurrentProduct, categories, darkMode } = useAppContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Electronics',
    images: ['https://picsum.photos/seed/default1/400/400 ', 'https://picsum.photos/seed/default2/400/400 ', 'https://picsum.photos/seed/default3/400/400 '],
    inStock: true
  });
  
  // Set form data when editing a product
  useEffect(() => {
    if (currentProduct) {
      setFormData({
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
        category: currentProduct.category,
        images: currentProduct.images,
        inStock: currentProduct.inStock
      });
    }
  }, [currentProduct]);
  
  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  // Handle image URL changes
  const handleImageUrlChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData({
      ...formData,
      images: newImages
    });
  };
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      rating: currentProduct ? currentProduct.rating : 4.5
    };
    
    if (currentProduct) {
      updateProduct(productData);
    } else {
      addProduct(productData);
    }
    
    // Reset form and tab
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Electronics',
      images: ['https://picsum.photos/seed/default1/400/400 ', 'https://picsum.photos/seed/default2/400/400 ', 'https://picsum.photos/seed/default3/400/400 '],
      inStock: true
    });
    setCurrentProduct(null);
    setActiveTab('products');
    navigate('/admin');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-montserrat font-bold mb-8">Admin Dashboard</h1>
      
      {/* Admin Tabs */}
      <div className="mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 font-montserrat ${
              activeTab === 'products'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Products
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-montserrat ${
              activeTab === 'orders'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Orders
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`py-2 px-4 font-montserrat ${
              activeTab === 'users'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Manage Users
          </button>
        </div>
      </div>
      
      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product List */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-montserrat font-bold">Products</h2>
                  <button
                    onClick={() => {
                      setCurrentProduct(null);
                      setFormData({
                        name: '',
                        description: '',
                        price: '',
                        category: 'Electronics',
                        images: ['https://picsum.photos/seed/default1/400/400 ', 'https://picsum.photos/seed/default2/400/400 ', 'https://picsum.photos/seed/default3/400/400 '],
                        inStock: true
                      });
                      setActiveTab('addProduct');
                    }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700 transition-colors"
                  >
                    Add New Product
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <tr>
                        <th className="px-4 py-3 text-left font-montserrat">Image</th>
                        <th className="px-4 py-3 text-left font-montserrat">Product Name</th>
                        <th className="px-4 py-3 text-left font-montserrat">Price</th>
                        <th className="px-4 py-3 text-left font-montserrat">Category</th>
                        <th className="px-4 py-3 text-left font-montserrat">Status</th>
                        <th className="px-4 py-3 text-right font-montserrat">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(product => (
                        <tr key={product.id} className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <td className="px-4 py-3">
                            <img 
                              src={product.images[0]} 
                              alt={product.name} 
                              className="w-12 h-12 object-cover rounded"
                            />
                          </td>
                          <td className="px-4 py-3 font-montserrat">{product.name}</td>
                          <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                          <td className="px-4 py-3">{product.category}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              product.inStock 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {product.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => {
                                  setCurrentProduct(product);
                                  setActiveTab('addProduct');
                                }}
                                className="p-1 rounded text-indigo-600 hover:bg-indigo-100"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 00-1.414-1.414L10 5.586A2 2 0 008.586 7L10 8.414a2 2 0 011.414.586H17m-6-6h2a2 2 0 012 2v2.586l1 1L20.586 9H19m-6 6h2a2 2 0 012 2v2.586l1 1L20.586 17H19m-6 6h2a2 2 0 012 2v2.586l1 1L20.586 21H19" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                              </button>
                              <button
                                onClick={() => deleteProduct(product.id)}
                                className="p-1 rounded text-red-500 hover:bg-red-100"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          
          {/* Add/Edit Product Form */}
          {activeTab === 'addProduct' && (
            <div>
              <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <div className="p-6">
                  <h2 className="text-xl font-montserrat font-bold mb-4">
                    {currentProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  
                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block mb-2 font-montserrat text-sm">Product Name</label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                        required
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="description" className="block mb-2 font-montserrat text-sm">Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                          darkMode ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label htmlFor="price" className="block mb-2 font-montserrat text-sm">Price</label>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          step="0.01"
                          min="0"
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="category" className="block mb-2 font-montserrat text-sm">Category</label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-100'
                          }`}
                          required
                        >
                          {categories.filter(cat => cat !== 'All').map(category => (
                            <option key={category} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <label className="block mb-2 font-montserrat text-sm">Image URLs</label>
                      {formData.images.map((url, index) => (
                        <div key={index} className="mb-2">
                          <input
                            type="text"
                            value={url}
                            onChange={(e) => handleImageUrlChange(index, e.target.value)}
                            className={`w-full px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                              darkMode ? 'bg-gray-700' : 'bg-gray-100'
                            }`}
                            placeholder={`Image URL ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                    
                    <div className="mb-4">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          name="inStock"
                          checked={formData.inStock}
                          onChange={handleChange}
                          className="form-checkbox h-5 w-5 text-indigo-600"
                        />
                        <span className="ml-2 font-montserrat">In Stock</span>
                      </label>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('products');
                          setCurrentProduct(null);
                          setFormData({
                            name: '',
                            description: '',
                            price: '',
                            category: 'Electronics',
                            images: ['https://picsum.photos/seed/default1/400/400 ', 'https://picsum.photos/seed/default2/400/400 ', 'https://picsum.photos/seed/default3/400/400 '],
                            inStock: true
                          });
                        }}
                        className={`px-4 py-2 rounded-md font-montserrat ${
                          darkMode 
                            ? 'bg-gray-700 hover:bg-gray-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md font-montserrat hover:bg-indigo-700"
                      >
                        {currentProduct ? 'Update Product' : 'Add Product'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <h2 className="text-xl font-montserrat font-bold mb-6">Orders</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <tr>
                      <th className="px-4 py-3 text-left font-montserrat">Order ID</th>
                      <th className="px-4 py-3 text-left font-montserrat">Customer</th>
                      <th className="px-4 py-3 text-left font-montserrat">Date</th>
                      <th className="px-4 py-3 text-left font-montserrat">Total</th>
                      <th className="px-4 py-3 text-left font-montserrat">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock order data */}
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">#1001</td>
                      <td className="px-4 py-3">John Doe</td>
                      <td className="px-4 py-3">2023-07-15</td>
                      <td className="px-4 py-3">$159.99</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-green-100 text-green-800">
                          Completed
                        </span>
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">#1002</td>
                      <td className="px-4 py-3">Jane Smith</td>
                      <td className="px-4 py-3">2023-07-14</td>
                      <td className="px-4 py-3">$299.99</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">
                          Processing
                        </span>
                      </td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">#1003</td>
                      <td className="px-4 py-3">Robert Johnson</td>
                      <td className="px-4 py-3">2023-07-13</td>
                      <td className="px-4 py-3">$89.99</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-red-100 text-red-800">
                          Cancelled
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Users Tab */}
      {activeTab === 'users' && (
        <div>
          <div className={`rounded-lg overflow-hidden shadow-md ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-6">
              <h2 className="text-xl font-montserrat font-bold mb-6">Users</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <tr>
                      <th className="px-4 py-3 text-left font-montserrat">Name</th>
                      <th className="px-4 py-3 text-left font-montserrat">Email</th>
                      <th className="px-4 py-3 text-left font-montserrat">Role</th>
                      <th className="px-4 py-3 text-left font-montserrat">Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Mock user data */}
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">John Doe</td>
                      <td className="px-4 py-3">john@example.com</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          User
                        </span>
                      </td>
                      <td className="px-4 py-3">2023-07-15</td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">Jane Smith</td>
                      <td className="px-4 py-3">jane@example.com</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-indigo-100 text-indigo-800">
                          Admin
                        </span>
                      </td>
                      <td className="px-4 py-3">2023-07-14</td>
                    </tr>
                    <tr className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <td className="px-4 py-3">Robert Johnson</td>
                      <td className="px-4 py-3">robert@example.com</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-800">
                          User
                        </span>
                      </td>
                      <td className="px-4 py-3">2023-07-13</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;