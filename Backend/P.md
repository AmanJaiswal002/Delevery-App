You are an expert full-stack developer. Build a complete, production-ready 
multi-vendor Delivery App using the MERN Stack (MongoDB, Express, React, Node.js) 
with Tailwind CSS. This is a resume-worthy, fully functional project.

=======================================================
👥 USER ROLES & FEATURES
=======================================================

1. CUSTOMER
   - Register & Login (JWT)
   - Browse all products on Home Page
   - Search products by name & filter by category/price
   - Add products to cart, update quantity, remove items
   - Checkout with address & payment integration
   - Pay via Razorpay (or Stripe)
   - View order history with real-time status tracking
   - Give star ratings & text reviews on delivered products

2. SELLER
   - Login with seller role
   - Access seller dashboard (total products, total orders, revenue)
   - Add new products (title, description, price, image, category, stock)
   - Edit & delete existing products
   - View all orders for their products
   - Update order status: placed → shipped → delivered

3. ADMIN
   - Login with admin role
   - View & manage all users (block / unblock)
   - View & delete any product
   - Monitor all orders across all sellers
   - View analytics: total users, total revenue, total orders

=======================================================
🏗️ SYSTEM ARCHITECTURE
=======================================================

Frontend (React + Tailwind CSS)
        ↓
Backend (Node.js + Express REST API)
        ↓
MongoDB (Mongoose ODM)
        ↓
Socket.io (Real-time order tracking)
        ↓
Razorpay / Stripe (Payment Gateway)

=======================================================
📱 FRONTEND — React + Tailwind CSS
=======================================================

Create the following pages and components:

--- CUSTOMER UI ---
- Home Page: Display all products as cards (image, title, price, rating, add to cart button)
- Product Details Page: Full product info + reviews + add to cart
- Search & Filter UI: Search bar + category dropdown + price range filter
- Cart Page: List of items, quantity controls, subtotal, proceed to checkout button
- Checkout Page: Delivery address form + order summary + Pay Now button
- Orders Page: List of all past orders with status badge (placed/shipped/delivered) + real-time tracking

--- SELLER UI ---
- Dashboard: Stats cards (total products, total orders, revenue)
- Add Product Page: Form with fields: title, description, price, image URL, category, stock
- Manage Products Page: Table with edit & delete actions
- Orders Management Page: List of orders with dropdown to update status

--- ADMIN UI ---
- Users Management: Table of all users with block/unblock toggle
- Products Control: Table of all products with delete option
- Orders Overview: All orders from all sellers with status
- Analytics Dashboard: Cards showing total users, total revenue, total orders

--- SHARED ---
- Navbar with role-based links
- Protected routes (customer/seller/admin)
- Loading spinners & toast notifications
- Fully responsive (mobile + desktop)

=======================================================
⚙️ BACKEND — Node.js + Express
=======================================================

Structure the backend with the following modules:

--- AUTH MODULE ---
POST /api/auth/register
  Body: { name, email, password, role }
  - Hash password with bcrypt
  - Save user to DB
  - Return JWT token

POST /api/auth/login
  Body: { email, password }
  - Validate credentials
  - Return JWT token + user role

Middleware:
  - authMiddleware: Verify JWT from Authorization header
  - roleMiddleware(role): Check user role for protected routes

--- PRODUCT MODULE ---
GET    /api/products          → Fetch all products (with search & filter query params)
GET    /api/products/:id      → Fetch single product
POST   /api/products          → Create product (seller only)
PUT    /api/products/:id      → Update product (seller only, own product)
DELETE /api/products/:id      → Delete product (seller or admin)

--- CART MODULE ---
POST   /api/cart/add          → Add item to cart { productId, quantity }
GET    /api/cart              → Get current user's cart (populated with product details)
DELETE /api/cart/remove       → Remove item from cart { productId }

--- ORDER MODULE ---
POST   /api/orders            → Place order (from cart items) → clears cart after
GET    /api/orders/user       → Get all orders for logged-in customer
GET    /api/orders/seller     → Get all orders containing seller's products
GET    /api/orders/admin      → Get all orders (admin only)
PUT    /api/orders/:id/status → Update order status (seller only)

--- PAYMENT MODULE ---
POST   /api/payment/create-order  → Create Razorpay order, return order ID
POST   /api/payment/verify        → Verify payment signature, update paymentStatus to "paid"

--- REVIEW MODULE ---
POST   /api/reviews               → Add review { productId, rating, comment }
GET    /api/reviews/:productId    → Get all reviews for a product
  - Also recalculate and update average rating on Product document

--- ADMIN MODULE ---
GET    /api/admin/users           → Get all users
PUT    /api/admin/block-user/:id  → Toggle isBlocked on user
DELETE /api/admin/product/:id     → Delete any product

=======================================================
🗄️ DATABASE — MongoDB + Mongoose
=======================================================

Define the following Mongoose schemas:

User {
  name: String,
  email: { type: String, unique: true },
  password: String (hashed),
  role: { type: String, enum: ["customer", "seller", "admin"], default: "customer" },
  isBlocked: { type: Boolean, default: false },
  createdAt: Date
}

Product {
  title: String,
  description: String,
  price: Number,
  image: String (URL),
  category: String,
  sellerId: { type: ObjectId, ref: "User" },
  stock: Number,
  rating: { type: Number, default: 0 },
  createdAt: Date
}

Cart {
  userId: { type: ObjectId, ref: "User" },
  items: [
    {
      productId: { type: ObjectId, ref: "Product" },
      quantity: Number
    }
  ]
}

Order {
  userId: { type: ObjectId, ref: "User" },
  items: [
    {
      productId: { type: ObjectId, ref: "Product" },
      quantity: Number,
      price: Number
    }
  ],
  totalAmount: Number,
  deliveryAddress: String,
  paymentStatus: { type: String, enum: ["pending", "paid"], default: "pending" },
  paymentId: String,
  orderStatus: { type: String, enum: ["placed", "shipped", "delivered"], default: "placed" },
  createdAt: Date
}

Review {
  userId: { type: ObjectId, ref: "User" },
  productId: { type: ObjectId, ref: "Product" },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
  createdAt: Date
}

=======================================================
📡 REAL-TIME — Socket.io
=======================================================

Set up Socket.io on the backend server.

Emit the following events when order status changes:
  - "orderPlaced"    → notify customer when order is placed
  - "orderShipped"   → notify customer when seller marks as shipped
  - "orderDelivered" → notify customer when order is delivered

On the frontend:
  - Connect to Socket.io on the Orders Page
  - Listen for these events and update order status in real-time without page refresh
  - Show a toast notification when status changes

=======================================================
🔐 SECURITY
=======================================================

- Hash all passwords using bcrypt (saltRounds: 10)
- Use JWT (jsonwebtoken) for stateless authentication
- Store JWT in localStorage on frontend
- Send JWT in Authorization: Bearer <token> header
- Validate all request bodies using express-validator or Joi
- Role-based route protection using middleware
- Block users: if isBlocked is true, reject login with clear error

=======================================================
💳 PAYMENT — Razorpay Integration
=======================================================

Backend:
  - Use razorpay npm package
  - POST /api/payment/create-order → create order with amount & currency
  - POST /api/payment/verify → verify payment using HMAC SHA256 signature

Frontend:
  - Load Razorpay checkout script
  - On "Pay Now" click → call create-order API → open Razorpay modal
  - On success → call verify API → if verified, place order and redirect to Orders page

=======================================================
📁 FOLDER STRUCTURE
=======================================================

/client (React App)
  /src
    /pages
      /customer → Home, ProductDetails, Cart, Checkout, Orders
      /seller   → Dashboard, AddProduct, ManageProducts, SellerOrders
      /admin    → Users, Products, Orders, Analytics
    /components → Navbar, ProductCard, OrderCard, ReviewForm, Spinner
    /context    → AuthContext (store user + token)
    /api        → axios instance with base URL + token header
    /socket     → socket.io-client setup

/server (Node.js App)
  /models       → User, Product, Cart, Order, Review
  /routes       → auth, products, cart, orders, payment, reviews, admin
  /middleware   → authMiddleware, roleMiddleware
  /controllers  → one controller file per route module
  /socket       → socket event handlers
  server.js     → Entry point

=======================================================
🎨 UI/UX REQUIREMENTS
=======================================================

- Use Tailwind CSS throughout — no custom CSS files
- Clean, modern design with consistent color palette
- Role-based Navbar (different links for customer/seller/admin)
- Protected Routes using React Router v6
- React Context API for global auth state
- Axios for all API calls with interceptors for token injection
- React Toastify for success/error notifications
- Loading states on all async operations
- Fully mobile responsive

=======================================================
🚀 DELIVERABLES
=======================================================

1. Complete working MERN Stack codebase
2. All 3 role dashboards (Customer, Seller, Admin)
3. JWT Auth + Role-based access
4. Razorpay payment integration
5. Socket.io real-time order tracking
6. MongoDB schemas & REST APIs
7. Clean, responsive Tailwind UI
8. README with setup instructions & .env variables list

.env variables needed:
  MONGO_URI=
  JWT_SECRET=
  RAZORPAY_KEY_ID=
  RAZORPAY_KEY_SECRET=
  PORT=5000

Build this as a complete, fully functional, production-ready project. 
Write clean, modular, well-commented code.