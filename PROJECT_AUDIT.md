# Local Digital Shop — Project Audit

**Date:** August 17, 2026  
**Stack:** React (Vite) + Node.js/Express + MongoDB + JWT

---

## 1. Frontend Structure

```
Frontend/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx              # BrowserRouter + AuthProvider
    ├── App.jsx               # Routes + Navbar + Footer
    ├── index.css             # Global variables, reset, skeletons
    ├── Context/
    │   └── AuthContext.jsx   # JWT session restore, login/logout
    ├── Services/
    │   └── api.js            # fetch wrapper → localhost:5000/api
    ├── Components/
    │   ├── Navbar.jsx / Navbar.css
    │   ├── Footer.jsx / Footer.css
    │   ├── ProductCard.jsx / ProductCard.css
    │   └── ProductCardSkeleton.jsx
    └── Pages/
        ├── Home, Products, ProductDetails
        ├── Cart, Wishlist, Checkout
        ├── Orders, OrderDetails, Profile
        ├── Login, Register, AddProduct
        └── (each with dedicated .css)
```

---

## 2. Backend Structure

```
Backend/
├── server.js                 # dotenv + connectDB + listen :5000
├── app.js                    # Express app, CORS, route mounting
├── Config/db.js, cloudinary.js
├── middlewares/authMiddleware.js, uploadMiddleware.js
├── utils/jwt.js
├── models/User, Product, Cart, Order, Wishlist
├── Controllers/              # auth, product, cart, order, wishlist, user
├── services/                 # business logic layer
└── routes/                   # /api/auth, products, cart, orders, wishlist, users
```

---

## 3. Implemented Features

| Feature | Status | Notes |
|---------|--------|-------|
| User registration (customer/seller) | ✅ | POST `/api/auth/register` |
| Login + JWT (7d expiry) | ✅ | Token stored in localStorage |
| Profile fetch/update | ✅ | GET `/api/auth/profile`, PUT `/api/users/profile` |
| Password change | ✅ | PUT `/api/users/change-password` |
| Product CRUD | ✅ | Cloudinary image upload for sellers |
| Product search/filter/sort | ✅ | search, category, city, pincode, sort, pagination |
| Cart (add/update/remove/clear) | ✅ | Auto-create cart on first add |
| Wishlist (add/remove/list) | ✅ | Duplicate prevention |
| Checkout + COD orders | ✅ | Stock deduction, cart cleared |
| Order list + details + cancel | ✅ | Ownership checked in service |
| Add Product (seller) | ✅ | Protected, multipart form |
| Responsive CSS per page | ⚠️ Partial | Files exist; needs polish + privacy fixes |
| Skeleton loaders | ⚠️ Partial | Products only |

---

## 4. Missing / Incomplete Features

- Protected frontend routes (cart/wishlist/checkout require login at UI level)
- Cart/wishlist badge counts in Navbar
- Seller dashboard (view own products, orders stats)
- Seller product edit/delete UI
- Real geolocation / distance (architecture only — pincode/city search exists)
- Pagination UI on Products page
- Reusable error/toast components
- `npm run build` verification in CI
- Seller store description field
- Order status updates for sellers

---

## 5. Broken / Risky Functionality

| Issue | Severity | Details |
|-------|----------|---------|
| **Seller PII on public APIs** | 🔴 Critical | `productService` populates full seller: name, email, phone, address |
| **JWT errors exposed raw** | 🔴 High | `authMiddleware` returns `"jwt malformed"` to client |
| **JWT secret logged** | 🔴 High | Console logs `JWT_SECRET` on every request |
| **api.js network errors** | 🟠 High | `fetch` failure throws uncaught TypeError, not user-friendly |
| **api.js no 401 handling** | 🟠 High | Invalid token not cleared globally |
| **Import path casing** | 🟡 Medium | `controllers` vs `Controllers`, `Utils` vs `utils`, `config` vs `Config` — breaks on Linux |
| **Wishlist 404 on empty** | 🟡 Medium | Controller returns 404 though service returns empty list |
| **Clear cart when no cart** | 🟡 Low | Throws "Cart not found" instead of no-op |
| **No frontend route guards** | 🟡 Medium | Unauthenticated users hit protected API calls |
| **ProductCard missing actions** | 🟡 Low | No wishlist/add-to-cart on listing cards |
| **README outdated** | 🟢 Low | Says cart/orders "Coming Soon" |

---

## 6. API Endpoints

### Auth — `/api/auth`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Create user |
| POST | `/login` | No | Returns `{ token, user }` |
| GET | `/profile` | Yes | Full user profile (private) |
| POST | `/reset-password` | No | Reset by email |

### Products — `/api/products`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | No | List with query filters |
| GET | `/:id` | No | Single product |
| POST | `/` | Yes | Add product (seller) |
| PUT | `/:id` | Yes | Update (owner only) |
| DELETE | `/:id` | Yes | Delete (owner only) |

### Cart — `/api/cart`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | Get cart (empty if none) |
| POST | `/` | Yes | Add item `{ productId, quantity }` |
| PUT | `/` | Yes | Update quantity |
| DELETE | `/:productId` | Yes | Remove item |
| DELETE | `/` | Yes | Clear cart |

### Wishlist — `/api/wishlist`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | Get wishlist |
| POST | `/:productId` | Yes | Add product |
| DELETE | `/:productId` | Yes | Remove product |

### Orders — `/api/orders`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/` | Yes | User's orders only |
| GET | `/:orderId` | Yes | Order detail (ownership checked) |
| POST | `/` | Yes | Create from cart |
| PATCH | `/:orderId/cancel` | Yes | Cancel (owner only) |
| PATCH | `/:orderId/status` | Yes | Update status |
| PATCH | `/:orderId/payment` | Yes | Update payment status |

### Users — `/api/users`
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PUT | `/profile` | Yes | Update profile |
| PUT | `/change-password` | Yes | Change password |

---

## 7. Authentication Flow

1. Login → backend returns JWT + minimal user `{ _id, name, email }`
2. Frontend stores token in `localStorage`
3. `AuthContext` on mount calls `GET /api/auth/profile` if token exists
4. All authenticated requests send `Authorization: Bearer <token>`
5. `authMiddleware` verifies JWT, attaches `req.user`
6. Logout clears localStorage + context state

**Gaps:** No global 401 interceptor; malformed tokens show raw error; no protected routes.

---

## 8. Cart Flow

```
ProductDetails → POST /api/cart → Cart DB (auto-create)
→ GET /api/cart → Cart.jsx → update/remove/clear
→ Checkout → POST /api/orders → stock reduced, cart cleared
```

**Fixed behavior:** Empty cart returns `{ items: [] }` not 404.

---

## 9. Order Flow

```
Checkout form → POST /api/orders { shippingAddress, paymentMethod: "COD" }
→ Order created (pending) → redirect to /orders/:id
→ GET /api/orders (list) → GET /api/orders/:id (detail + stepper)
→ PATCH /api/orders/:id/cancel (if not delivered)
```

**Authorization:** `getOrderByIdService` verifies `order.user === userId`.

---

## 10. Wishlist Flow

```
ProductDetails → POST /api/wishlist/:productId
→ GET /api/wishlist → Wishlist.jsx
→ Remove / Move to cart
```

---

## 11. Recommended Implementation Order

1. ✅ **Audit** (this document)
2. 🔧 **Backend security** — sanitize public seller data, fix auth middleware, fix import paths
3. 🔧 **API layer** — robust `api.js`, AuthContext 401 handling, CartContext
4. 🎨 **Design system** — CSS variables, global utilities, SVG logo
5. 🧩 **Components** — Navbar badges, ProductImage fallback, ProtectedRoute, ErrorBanner
6. 📄 **Pages** — privacy-safe product display, skeletons, local search, seller store names
7. 🏪 **Seller** — store-focused profile fields, Add Product polish
8. ✅ **Build + test** — `npm run build`, manual flow verification

---

## Environment Variables (Backend `.env`)

```
PORT=5000
MONGO_URL=<mongodb_connection_string>
JWT_SECRET=<strong_random_secret>
CLOUDINARY_CLOUD_NAME=<optional_for_images>
CLOUDINARY_API_KEY=<optional>
CLOUDINARY_API_SECRET=<optional>
```

## Run Commands

```bash
# Backend
cd Backend && npm install && npm run dev

# Frontend
cd Frontend && npm install && npm run dev
```

Frontend: `http://localhost:5173`  
Backend API: `http://localhost:5000/api`
