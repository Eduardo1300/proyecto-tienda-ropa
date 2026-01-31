# 🛍️ Tienda de Ropa - E-commerce Full Stack

Un sistema completo de tienda en línea desarrollado con **NestJS** (backend) y **React + TypeScript** (frontend), con autenticación robusta, gestión de productos, carrito de compras, sistema de órdenes, analytics, programa de lealtad y gestión de inventario.

## 📊 Tabla de Contenidos

- [Características Principales](#-características-principales)
- [Arquitectura del Sistema](#-arquitectura-del-sistema)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías Utilizadas](#-tecnologías-utilizadas)
- [Instalación y Configuración](#-instalación-y-configuración)
- [Variables de Entorno](#-variables-de-entorno)
- [Documentación de API](#-documentación-de-api)
- [Esquema de Base de Datos](#-esquema-de-base-de-datos)
- [Componentes del Frontend](#-componentes-del-frontend)
- [Buenas Prácticas](#-buenas-prácticas)
- [Problemas Conocidos](#-problemas-conocidos)
- [Desarrollo y Testing](#-desarrollo-y-testing)
- [Deployment](#-deployment)
- [Mejoras Futuras](#-mejoras-futuras)

---

## 🚀 Características Principales

### 🔐 Sistema de Autenticación

| Característica | Descripción |
|----------------|-------------|
| **Registro de usuarios** | Validación de email único, contraseñas encriptadas con bcrypt |
| **Login/Logout** | JWT tokens con expiración configurable |
| **Refresh tokens** | Sesiones prolongadas seguras |
| **Recuperación de contraseña** | Tokens temporales via email |
| **Roles de usuario** | `user` y `admin` con permisos diferenciados |
| **Middleware Passport** | Protección de rutas basada en JWT |

### 🛒 Funcionalidades de E-commerce

| Módulo | Funcionalidades |
|--------|-----------------|
| **Catálogo de productos** | Búsqueda avanzada, filtros por categoría/marca/color/talla/precio, ordenamiento, paginación |
| **Carrito de compras** | Persistente por usuario, cálculo de totales, validación de stock |
| **Sistema de órdenes** | Estados (pending → processing → shipped → delivered), seguimiento, cancelaciones |
| **Cupones de descuento** | Porcentaje o monto fijo, límites de uso, fechas de validez |
| **Reseñas y ratings** | Sistema de puntuación, votos útiles, promedio por producto |

### 📊 Analytics Dashboard

```typescript
// Métricas disponibles
- Ventas por período (día/semana/mes/año)
- Productos más vendidos
- Ingresos totales y promedio
- Usuarios activos
- Tasa de conversión
- Productos con bajo stock
- Órdenes por estado
```

### 🏆 Programa de Lealtad

| Nivel | Puntos Requeridos | Beneficios |
|-------|-------------------|------------|
| **Bronze** | 0 - 999 | 1 punto por S/1 |
| **Silver** | 1,000 - 4,999 | 1.25 puntos por S/1 |
| **Gold** | 5,000 - 14,999 | 1.5 puntos por S/1 |
| **Platinum** | 15,000+ | 2 puntos por S/1 |

### 📦 Gestión de Inventario (Admin)

- **Control de stock** en tiempo real
- **Reservas** para pedidos activos
- **Alertas** automáticas por bajo stock
- **Reportes** de movimientos
- **Historial** de cambios por producto

---

## 🏗️ Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────┐
│                      CLIENTE (Browser)                       │
│                    React + TypeScript                        │
├─────────────────────────────────────────────────────────────┤
│                        Vite Dev Server                        │
│                    (Puerto 5173)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼ HTTP/HTTPS
┌─────────────────────────────────────────────────────────────┐
│                      SERVIDOR (NestJS)                       │
│                    (Puerto 3002)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │   Auth   │  │ Products │  │  Cart    │  │   Orders     │ │
│  │  Module  │  │  Module  │  │  Module  │  │   Module     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Users   │  │Analytics │  │ Loyalty  │  │  Inventory   │ │
│  │  Module  │  │  Module  │  │  Module  │  │   Module     │ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                     TypeORM (PostgreSQL)                     │
└─────────────────────────────────────────────────────────────┘
```

### Patrones de Diseño

| Patrón | Aplicación |
|--------|------------|
| **Controller-Service-Repository** | Separación de responsabilidades en cada módulo |
| **DTO (Data Transfer Objects)** | Validación y transformación de datos |
| **Entity Model** | TypeORM para mapeo objeto-relacional |
| **Guard** | Control de acceso y autenticación |
| **Interceptor** | Logging, transformación de respuestas |
| **Decorator** | Metadatos y validación personalizada |

---

## 📁 Estructura del Proyecto

```
proyecto_tienda_de_ropa/
├── 📂 tienda-backend/                    # API REST (NestJS)
│   ├── 📂 src/
│   │   ├── 📂 auth/                      # Autenticación y autorización
│   │   │   ├── auth.controller.ts        # Endpoints de auth
│   │   │   ├── auth.service.ts           # Lógica de negocio
│   │   │   ├── auth.module.ts            # Módulo NestJS
│   │   │   ├── dto/                      # Data Transfer Objects
│   │   │   ├── strategies/               # Passport strategies
│   │   │   └── guards/                   # Auth guards
│   │   │
│   │   ├── 📂 users/                     # Gestión de usuarios
│   │   │   ├── users.controller.ts
│   │   │   ├── users.service.ts
│   │   │   ├── users.module.ts
│   │   │   ├── entities/                 # User entity
│   │   │   └── dto/
│   │   │
│   │   ├── 📂 products/                  # Catálogo de productos
│   │   │   ├── products.controller.ts
│   │   │   ├── products.service.ts
│   │   │   ├── products.module.ts
│   │   │   ├── entities/                 # Product entity
│   │   │   └── dto/
│   │   │
│   │   ├── 📂 carrito/                   # Carrito de compras
│   │   │   ├── entities/                 # CartItem entity
│   │   │   └── carrito.module.ts
│   │   │
│   │   ├── 📂 ordenes/                   # Sistema de órdenes
│   │   │   ├── ordenes.controller.ts
│   │   │   ├── ordenes.service.ts
│   │   │   ├── ordenes.module.ts
│   │   │   ├── entities/                 # Order, OrderItem entities
│   │   │   ├── dto/
│   │   │   └── enums/                    # OrderStatus enum
│   │   │
│   │   ├── 📂 admin/                     # Panel administrativo
│   │   │   ├── admin.controller.ts
│   │   │   ├── admin.module.ts
│   │   │   ├── guards/                   # Admin guards
│   │   │   └── dto/
│   │   │
│   │   ├── 📂 analytics/                 # Métricas y estadísticas
│   │   │   ├── analytics.controller.ts
│   │   │   ├── analytics.service.ts
│   │   │   ├── analytics.module.ts
│   │   │   └── entities/                 # Analytics entities
│   │   │
│   │   ├── 📂 loyalty/                   # Programa de lealtad
│   │   │   ├── loyalty.controller.ts
│   │   │   ├── loyalty.service.ts
│   │   │   ├── loyalty.module.ts
│   │   │   └── entities/                 # Loyalty entities
│   │   │
│   │   ├── 📂 inventory/                 # Gestión de inventario
│   │   │   ├── inventory.controller.ts
│   │   │   ├── inventory.service.ts
│   │   │   ├── inventory.module.ts
│   │   │   └── entities/                 # Inventory entities
│   │   │
│   │   ├── 📂 reviews/                   # Reseñas de productos
│   │   │   └── reviews.module.ts
│   │   │
│   │   ├── 📂 coupons/                   # Cupones de descuento
│   │   │   └── coupon.module.ts
│   │   │
│   │   ├── 📂 common/                    # Utilidades compartidas
│   │   │   ├── email.service.ts
│   │   │   └── pdf.service.ts
│   │   │
│   │   ├── app.module.ts                 # Módulo raíz
│   │   ├── app.service.ts
│   │   └── main.ts                       # Entry point
│   │
│   ├── .env                              # Variables de entorno
│   ├── .env.example
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   └── test/                             # Tests E2E
│
├── 📂 tienda-frontend/                   # Aplicación React
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── 📂 ui/                    # Componentes base UI
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   └── Modal.tsx
│   │   │   │
│   │   │   ├── 📂 admin/                 # Componentes de admin
│   │   │   │
│   │   │   ├── ProductCard.tsx           # Tarjeta de producto
│   │   │   ├── ProductFilters.tsx        # Filtros de búsqueda
│   │   │   ├── ProductImageGallery.tsx   # Galería de imágenes
│   │   │   ├── ProductComparison.tsx     # Comparación de productos
│   │   │   ├── ProductQuickView.tsx      # Vista rápida
│   │   │   ├── Header.tsx                # Navegación principal
│   │   │   ├── Footer.tsx                # Pie de página
│   │   │   ├── CouponInput.tsx           # Input de cupón
│   │   │   ├── LoadingSpinner.tsx        # Spinner de carga
│   │   │   ├── PageTransition.tsx        # Transiciones
│   │   │   ├── NotificationContainer.tsx # Notificaciones
│   │   │   ├── ProtectedRoute.tsx        # Rutas protegidas
│   │   │   ├── ThemeToggle.tsx           # Cambio de tema
│   │   │   ├── ReviewCard.tsx            # Tarjeta de reseña
│   │   │   ├── ReviewForm.tsx            # Formulario de reseña
│   │   │   ├── ReviewsList.tsx           # Lista de reseñas
│   │   │   ├── LoyaltyProgram.tsx        # Programa de lealtad
│   │   │   ├── AnalyticsDashboard.tsx    # Dashboard analytics
│   │   │   └── ...más componentes
│   │   │
│   │   ├── 📂 pages/                     # Páginas de la app
│   │   │   ├── Home.tsx                  # Página principal
│   │   │   ├── ProductCatalog.tsx        # Catálogo
│   │   │   ├── ProductDetail.tsx         # Detalle de producto
│   │   │   ├── Cart.tsx / CartPage.tsx   # Carrito
│   │   │   ├── CheckoutPage.tsx          # Checkout
│   │   │   ├── Login.tsx                 # Login
│   │   │   ├── Register.tsx              # Registro
│   │   │   ├── ProfilePage.tsx           # Perfil de usuario
│   │   │   ├── Dashboard.tsx             # Dashboard usuario
│   │   │   ├── OrderDetail.tsx           # Detalle de orden
│   │   │   ├── OrderTracking.tsx         # Seguimiento
│   │   │   ├── OrderManagement.tsx       # Gestión de órdenes
│   │   │   ├── AdminDashboard.tsx        # Dashboard admin
│   │   │   ├── AdminPanel.tsx            # Panel admin
│   │   │   ├── AnalyticsDashboard.tsx    # Page analytics
│   │   │   ├── LoyaltyDashboard.tsx      # Page lealtad
│   │   │   ├── InventoryDashboard.tsx    # Page inventario
│   │   │   └── ...más páginas
│   │   │
│   │   ├── 📂 context/                   # React Context
│   │   │   ├── AuthContext.tsx           # Auth global
│   │   │   ├── CartContext.tsx           # Carrito global
│   │   │   ├── NotificationContext.tsx   # Notificaciones
│   │   │   └── ThemeContext.tsx          # Tema (dark/light)
│   │   │
│   │   ├── 📂 hooks/                     # Custom hooks
│   │   │   ├── useAuth.ts                # Hook de auth
│   │   │   ├── useCart.ts                # Hook de carrito
│   │   │   ├── useAnalytics.ts           # Hook analytics
│   │   │   ├── useLoyalty.ts             # Hook lealtad
│   │   │   ├── useInventory.ts           # Hook inventario
│   │   │   ├── usePageTracking.ts        # Tracking de páginas
│   │   │   └── useResponsive.ts          # Responsive checks
│   │   │
│   │   ├── 📂 services/                  # Servicios API
│   │   │   ├── api.ts                    # Cliente Axios base
│   │   │   ├── authApi.ts                # Endpoints auth
│   │   │   ├── productsApi.ts            # Endpoints productos
│   │   │   ├── cartApi.ts                # Endpoints carrito
│   │   │   ├── ordersApi.ts              # Endpoints órdenes
│   │   │   ├── adminApi.ts               # Endpoints admin
│   │   │   ├── analyticsApi.ts           # Endpoints analytics
│   │   │   ├── loyaltyApi.ts             # Endpoints lealtad
│   │   │   └── inventoryApi.ts           # Endpoints inventario
│   │   │
│   │   ├── 📂 types/                     # Tipos TypeScript
│   │   │   ├── index.ts                  # Export principal
│   │   │   ├── producto.ts               # Tipos producto
│   │   │   ├── user.types.ts             # Tipos usuario
│   │   │   ├── order.types.ts            # Tipos orden
│   │   │   └── review.types.ts           # Tipos reseña
│   │   │
│   │   ├── 📂 utils/                     # Utilidades
│   │   │   ├── format.ts                 # Formateo de datos
│   │   │   ├── validation.ts             # Validaciones
│   │   │   └── constants.ts              # Constantes
│   │   │
│   │   ├── App.tsx                       # Componente principal
│   │   ├── main.tsx                      # Entry point
│   │   ├── index.css                     # Estilos globales
│   │   └── vite-env.d.ts                 # Tipos Vite
│   │
│   ├── 📂 public/                        # Assets estáticos
│   ├── .env                              # Variables entorno
│   ├── .env.example
│   ├── package.json
│   ├── vite.config.ts                    # Configuración Vite
│   ├── tsconfig.json                     # Configuración TS
│   ├── tailwind.config.js                # Configuración Tailwind
│   └── postcss.config.cjs                # Configuración PostCSS
│
├── 📂 tienda_db_backup.sql               # Backup BD
├── 📂 tienda_db_data.sql                 # Datos BD
├── 📂 seed_analytics.sql                 # Seed analytics
├── 📂 seed-users.sql                     # Seed usuarios
│
├── package.json                          # Root package
├── package-lock.json
├── .gitignore
└── 📄 README.md                          # Este archivo
```

---

## 🛠️ Tecnologías Utilizadas

### Backend (NestJS)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **NestJS** | 11.0.1 | Framework progresivo Node.js |
| **TypeORM** | 0.3.25 | ORM para TypeScript |
| **PostgreSQL** | 13+ | Base de datos relacional |
| **Passport.js** | - | Middleware autenticación |
| **JWT** | - | Tokens seguros |
| **bcrypt** | - | Hash de contraseñas |
| **class-validator** | - | Validación DTOs |
| **@nestjs/schedule** | - | Tareas programadas |
| **nodemailer** | - | Envío de emails |
| **pdfkit** | - | Generación PDFs |

### Frontend (React)

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.2.0 | Biblioteca UI |
| **TypeScript** | 5.8.3 | Tipado estático |
| **Vite** | 7.0.6 | Build tool |
| **React Router** | 7.7.1 | Enrutamiento |
| **TailwindCSS** | 3.4.3 | Estilos utility-first |
| **Axios** | 1.11.0 | Cliente HTTP |
| **Chart.js** | 4.5.0 | Gráficos analytics |
| **Heroicons** | 2.2.0 | Iconos |
| **Framer Motion** | - | Animaciones |

---

## 📦 Instalación y Configuración

### Prerrequisitos

```bash
# Requisitos mínimos
- Node.js >= 18.0.0
- PostgreSQL >= 13.0
- npm >= 9.0.0 o yarn >= 1.22.0
- Git
```

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Eduardo1300/proyecto-tienda-ropa.git
cd proyecto_tienda_de_ropa
```

### 2. Configurar Base de Datos

```bash
# Opción A: Usando psql
psql -U postgres
CREATE DATABASE tienda_db;
\q

# Opción B: Usando pgAdmin o herramienta GUI
# Crear nueva base de datos llamada "tienda_db"
```

### 3. Configurar Backend

```bash
# Entrar al directorio backend
cd tienda-backend

# Instalar dependencias
npm install

# Copiar archivo de ejemplo
cp .env.example .env

# Editar configuración
nano .env
```

### 4. Configurar Frontend

```bash
# Entrar al directorio frontend
cd ../tienda-frontend

# Instalar dependencias
npm install
```

---

## 🔐 Variables de Entorno

### Backend (`tienda-backend/.env`)

```env
# ====================
# Aplicación
# ====================
NODE_ENV=development
PORT=3002

# ====================
# Base de Datos
# ====================
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu_password_seguro
DB_DATABASE=tienda_db

# URL completa (opcional, para cloud)
# DATABASE_URL=postgresql://user:password@host:5432/database

# ====================
# JWT (IMPORTANTE: Usar secretos fuertes)
# ====================
JWT_SECRET=genera_un_secreto_muy_largo_y_aleatorio_aqui
JWT_REFRESH_SECRET=otro_secreto_diferente_y_largo
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# ====================
# Email (Opcional)
# ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=tu_email@gmail.com
SMTP_PASSWORD=tu_app_password

# ====================
# Frontend URL (Para CORS)
# ====================
FRONTEND_URL=http://localhost:5173
```

### Frontend (`tienda-frontend/.env`)

```env
# URL del backend API
VITE_API_URL=http://localhost:3002

# Configuración de ambiente
VITE_APP_NAME=Tienda de Ropa
VITE_APP_VERSION=2.0.0
```

---

## 📡 Documentación de API

### Autenticación

#### Registrar Usuario
```http
POST /auth/register
Content-Type: application/json

{
  "username": "miusuario",
  "email": "correo@ejemplo.com",
  "password": "Contraseña123!",
  "firstName": "Juan",
  "lastName": "Pérez"
}
```

**Response (201 Created):**
```json
{
  "message": "Usuario registrado exitosamente",
  "user": {
    "id": 1,
    "username": "miusuario",
    "email": "correo@ejemplo.com",
    "role": "customer"
  }
}
```

#### Iniciar Sesión
```http
POST /auth/login
Content-Type: application/json

{
  "email": "correo@ejemplo.com",
  "password": "Contraseña123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "username": "miusuario",
    "email": "correo@ejemplo.com",
    "role": "customer"
  }
}
```

#### Refresh Token
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Cerrar Sesión
```http
POST /auth/logout
Authorization: Bearer <access_token>
```

---

### Productos

#### Listar Productos (con filtros)
```http
GET /products?page=1&limit=20&category=camisas&minPrice=50&maxPrice=200&inStock=true
```

**Query Parameters:**
| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `page` | number | Página actual (default: 1) |
| `limit` | number | Items por página (default: 20) |
| `search` | string | Término de búsqueda |
| `categories` | string | Categorías separadas por coma |
| `brands` | string | Marcas separadas por coma |
| `colors` | string | Colores separados por coma |
| `sizes` | string | Tallas separadas por coma |
| `minPrice` | number | Precio mínimo |
| `maxPrice` | number | Precio máximo |
| `minRating` | number | Rating mínimo (1-5) |
| `inStock` | boolean | Solo productos en stock |
| `isFeatured` | boolean | Solo destacados |
| `isNew` | boolean | Solo nuevos |
| `isBestseller` | boolean | Solo bestseller |
| `sortBy` | string | Campo de ordenamiento |

**Valores de `sortBy`:**
- `price_asc` - Precio menor a mayor
- `price_desc` - Precio mayor a menor
- `name_asc` - Nombre A-Z
- `name_desc` - Nombre Z-A
- `created_asc` - Más antiguos primero
- `created_desc` - Más recientes primero
- `popularity` - Más populares
- `rating` - Mejor rating

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Camisa Algodón Premium",
      "description": "Camisa de algodón 100%...",
      "price": 79.99,
      "compareAtPrice": 99.99,
      "image": "https://...",
      "category": "camisas",
      "brand": "MarcaX",
      "stock": 50,
      "averageRating": 4.5,
      "reviewCount": 128,
      "isNew": true,
      "isFeatured": true
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 20,
  "totalPages": 8,
  "filters": {
    "categories": ["camisas", "pantalones", "zapatos"],
    "brands": ["MarcaX", "MarcaY", "MarcaZ"],
    "colors": ["rojo", "azul", "negro"],
    "sizes": ["S", "M", "L", "XL"],
    "priceRange": { "min": 0, "max": 500 }
  }
}
```

#### Obtener Producto por ID
```http
GET /products/:id
```

**Response (200 OK):**
```json
{
  "id": 1,
  "name": "Camisa Algodón Premium",
  "description": "Camisa de algodón 100% orgánico...",
  "price": 79.99,
  "compareAtPrice": 99.99,
  "costPrice": 35.00,
  "image": "https://...",
  "imageUrl": "https://...",
  "images": ["https://...", "https://..."],
  "category": "camisas",
  "sku": "CAM-001",
  "barcode": "8901234567890",
  "stock": 50,
  "reservedStock": 5,
  "minStockLevel": 10,
  "brand": "MarcaX",
  "color": "azul",
  "size": "M",
  "averageRating": 4.5,
  "reviewCount": 128,
  "viewCount": 1520,
  "isActive": true,
  "isFeatured": true,
  "isNew": true,
  "isBestseller": false,
  "tags": ["algodón", "premium", "nuevo"],
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-01-20T15:30:00Z"
}
```

#### Crear Producto (Admin)
```http
POST /products
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "name": "Nuevo Producto",
  "description": "Descripción del producto",
  "price": 99.99,
  "costPrice": 50.00,
  "category": "categoria",
  "sku": "SKU-001",
  "barcode": "8901234567890",
  "stock": 100,
  "minStockLevel": 10,
  "brand": "Marca",
  "color": "rojo",
  "size": "L",
  "imageUrl": "https://..."
}
```

#### Actualizar Producto (Admin)
```http
PATCH /products/:id
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "price": 89.99,
  "stock": 80
}
```

#### Eliminar Producto (Admin)
```http
DELETE /products/:id
Authorization: Bearer <admin_token>
```

---

### Carrito

#### Obtener Carrito
```http
GET /cart/:userId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "userId": 1,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "product": {
        "id": 1,
        "name": "Camisa Premium",
        "price": 79.99,
        "image": "https://...",
        "stock": 50
      },
      "quantity": 2
    }
  ],
  "subtotal": 159.98,
  "itemCount": 2
}
```

#### Agregar al Carrito
```http
POST /cart
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

#### Actualizar Cantidad
```http
PATCH /cart/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "quantity": 3
}
```

#### Eliminar del Carrito
```http
DELETE /cart/:id
Authorization: Bearer <token>
```

#### Vaciar Carrito
```http
DELETE /cart/user/:userId
Authorization: Bearer <token>
```

---

### Órdenes

#### Crear Orden
```http
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": 1,
      "quantity": 2,
      "price": 79.99
    }
  ],
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Lima",
    "department": "Lima",
    "zipCode": "15001",
    "country": "Perú"
  },
  "billingAddress": {
    "sameAsShipping": true
  },
  "notes": "Entregar en horario morning"
}
```

**Response (201 Created):**
```json
{
  "message": "Orden creada exitosamente",
  "order": {
    "id": 1,
    "orderNumber": "ORD-2025-000001",
    "status": "pending",
    "total": 175.96,
    "shippingCost": 15.00,
    "tax": 0,
    "createdAt": "2025-01-20T10:00:00Z"
  }
}
```

#### Listar Órdenes de Usuario
```http
GET /orders?page=1&limit=10
Authorization: Bearer <token>
```

#### Obtener Detalle de Orden
```http
GET /orders/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "id": 1,
  "orderNumber": "ORD-2025-000001",
  "status": "shipped",
  "statusHistory": [
    { "status": "pending", "timestamp": "2025-01-20T10:00:00Z" },
    { "status": "processing", "timestamp": "2025-01-20T10:30:00Z" },
    { "status": "shipped", "timestamp": "2025-01-21T09:00:00Z" }
  ],
  "total": 175.96,
  "shippingCost": 15.00,
  "tax": 0,
  "trackingCode": " tracking123",
  "shippingCarrier": "Olva Courier",
  "shippingAddress": {
    "street": "Calle Principal 123",
    "city": "Lima",
    "department": "Lima",
    "zipCode": "15001"
  },
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Camisa Premium",
      "quantity": 2,
      "price": 79.99
    }
  ],
  "canBeCancelled": true,
  "canBeReturned": true,
  "createdAt": "2025-01-20T10:00:00Z"
}
```

#### Cancelar Orden
```http
POST /orders/:id/cancel
Authorization: Bearer <token>
Content-Type: application/json

{
  "reason": "Ya no lo necesito",
  "notes": "Encontré mejor precio en otro lugar"
}
```

#### Solicitar Devolución
```http
POST /returns
Authorization: Bearer <token>
Content-Type: application/json

{
  "orderId": 1,
  "items": [
    {
      "orderItemId": 1,
      "quantity": 1,
      "condition": "good",
      "notes": "Talla incorrecta"
    }
  ],
  "reason": "size",
  "description": "Necesito talla M en lugar de L"
}
```

---

### Usuarios

#### Obtener Perfil
```http
GET /users/profile
Authorization: Bearer <token>
```

#### Actualizar Perfil
```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Juan",
  "lastName": "García",
  "phone": "+51 999 999 999"
}
```

#### Cambiar Contraseña
```http
PUT /users/password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "Contraseña123!",
  "newPassword": "NuevaContraseña456!"
}
```

#### Direcciones
```http
GET    /users/addresses                    # Listar
POST   /users/addresses                    # Crear
PUT    /users/addresses/:id                # Actualizar
DELETE /users/addresses/:id                # Eliminar
PUT    /users/addresses/:id/default        # Establecer por defecto
```

#### Historial de Órdenes
```http
GET /users/orders?page=1&limit=10
Authorization: Bearer <token>
```

---

### 📊 Analytics

#### Dashboard Metrics
```http
GET /analytics/dashboard
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "sales": {
    "totalRevenue": 125000.00,
    "totalOrders": 1250,
    "averageOrderValue": 100.00,
    "revenueGrowth": 15.5
  },
  "products": {
    "totalProducts": 150,
    "lowStock": 12,
    "outOfStock": 3,
    "topSelling": [
      { "id": 1, "name": "Producto X", "units": 250 }
    ]
  },
  "users": {
    "totalUsers": 5000,
    "newUsers": 150,
    "activeUsers": 1200
  },
  "conversion": {
    "rate": 3.5,
    "cartAbandonment": 25.0
  }
}
```

#### Sales Data
```http
GET /analytics/sales?startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <admin_token>
```

#### Track Event
```http
POST /analytics/events
Content-Type: application/json

{
  "eventType": "page_view",
  "productId": 1,
  "categoryId": 1,
  "orderId": 1,
  "value": 100.00,
  "currency": "PEN"
}
```

---

### 🏆 Loyalty

#### Get Program Info
```http
GET /loyalty/program
Authorization: Bearer <token>
```

**Response:**
```json
{
  "program": {
    "id": 1,
    "userId": 1,
    "totalPoints": 2500,
    "availablePoints": 2200,
    "lifetimeSpent": 2500.00,
    "currentTier": "silver",
    "tierProgress": 75,
    "nextTier": "gold",
    "pointsToNextTier": 750
  },
  "benefits": {
    "pointsPerSole": 1.25,
    "nextTierBonus": 10
  }
}
```

#### Get Transactions
```http
GET /loyalty/transactions?page=1&limit=10
Authorization: Bearer <token>
```

#### Redeem Points
```http
POST /loyalty/redeem
Authorization: Bearer <token>
Content-Type: application/json

{
  "points": 500,
  "rewardType": "discount"
}
```

#### Get Leaderboard
```http
GET /loyalty/leaderboard
```

---

### 📦 Inventory (Admin)

#### Get Stock
```http
GET /inventory/stock
Authorization: Bearer <admin_token>
Query: ?page=1&limit=20&lowStock=true
```

#### Update Stock
```http
POST /inventory/stock/update
Authorization: Bearer <admin_token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 100,
  "type": "restock",
  "reason": "Reposición mensual"
}
```

#### Get Alerts
```http
GET /inventory/alerts
Authorization: Bearer <admin_token>
```

#### Get Reports
```http
GET /inventory/reports?type=movement&startDate=2025-01-01&endDate=2025-01-31
Authorization: Bearer <admin_token>
```

#### Reserve Stock
```http
POST /inventory/stock/reserve
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "quantity": 2
}
```

---

### Reseñas

#### Create Review
```http
POST /reviews
Authorization: Bearer <token>
Content-Type: application/json

{
  "productId": 1,
  "rating": 5,
  "title": "Excelente producto",
  "content": "Muy satisfecho con mi compra..."
}
```

#### Get Product Reviews
```http
GET /reviews/product/:productId?page=1&limit=10&sort=newest
```

#### Vote Review
```http
POST /reviews/:id/vote
Authorization: Bearer <token>
Content-Type: application/json

{
  "helpful": true
}
```

---

### Cupones

#### Validate Coupon
```http
POST /coupons/validate
Content-Type: application/json

{
  "code": "DESCUENTO20",
  "orderTotal": 100.00
}
```

**Response:**
```json
{
  "valid": true,
  "discount": {
    "type": "percentage",
    "value": 20,
    "amount": 20.00
  },
  "finalTotal": 80.00
}
```

---

## 🗄️ Esquema de Base de Datos

### Entidad: User
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    firstName VARCHAR(255),
    lastName VARCHAR(255),
    role VARCHAR(50) DEFAULT 'customer',
    refreshToken VARCHAR(500),
    passwordResetToken VARCHAR(500),
    passwordResetExpires TIMESTAMP,
    avatarUrl VARCHAR(500),
    loyaltyPoints INTEGER DEFAULT 0,
    phone VARCHAR(50),
    birthDate DATE,
    gender VARCHAR(20),
    bio TEXT,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### Entidad: Product
```sql
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    costPrice DECIMAL(10,2),
    image VARCHAR(500),
    imageUrl VARCHAR(500),
    category VARCHAR(100) NOT NULL,
    isActive BOOLEAN DEFAULT true,
    sku VARCHAR(50) UNIQUE,
    barcode VARCHAR(100) UNIQUE,
    stock INTEGER DEFAULT 0,
    reservedStock INTEGER DEFAULT 0,
    minStockLevel INTEGER DEFAULT 0,
    maxStockLevel INTEGER DEFAULT 0,
    reorderPoint INTEGER DEFAULT 0,
    reorderQuantity INTEGER DEFAULT 0,
    brand VARCHAR(100),
    model VARCHAR(100),
    size VARCHAR(50),
    color VARCHAR(50),
    tags TEXT[],
    viewCount INTEGER DEFAULT 0,
    reviewCount INTEGER DEFAULT 0,
    averageRating DECIMAL(3,2) DEFAULT 0,
    isFeatured BOOLEAN DEFAULT false,
    isNew BOOLEAN DEFAULT false,
    isBestseller BOOLEAN DEFAULT false,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_active ON products(isActive);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(averageRating DESC);
```

### Entidad: Order
```sql
CREATE TYPE order_status AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
    'refunded'
);

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    orderNumber VARCHAR(50) UNIQUE NOT NULL,
    userId INTEGER REFERENCES users(id),
    status order_status DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    shippingCost DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    discountAmount DECIMAL(10,2) DEFAULT 0,
    trackingCode VARCHAR(100),
    shippingCarrier VARCHAR(100),
    shippingAddress TEXT,
    billingAddress TEXT,
    notes TEXT,
    estimatedDeliveryDate DATE,
    actualDeliveryDate DATE,
    cancelledAt TIMESTAMP,
    cancellationReason TEXT,
    canBeCancelled BOOLEAN DEFAULT true,
    canBeReturned BOOLEAN DEFAULT true,
    refundAmount DECIMAL(10,2) DEFAULT 0,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(userId);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(orderNumber);
CREATE INDEX idx_orders_created ON orders(createdAt DESC);
```

### Entidad: OrderItem
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    orderId INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    productId INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(orderId);
```

### Entidad: CartItem
```sql
CREATE TABLE cart_items (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id) ON DELETE CASCADE,
    productId INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_cart_user_product ON cart_items(userId, productId);
```

### Entidad: LoyaltyProgram
```sql
CREATE TYPE loyalty_tier AS ENUM (
    'bronze',
    'silver',
    'gold',
    'platinum'
);

CREATE TABLE loyalty_programs (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id) UNIQUE,
    totalPoints INTEGER DEFAULT 0,
    availablePoints INTEGER DEFAULT 0,
    lifetimeSpent DECIMAL(10,2) DEFAULT 0,
    currentTier loyalty_tier DEFAULT 'bronze',
    tierProgress INTEGER DEFAULT 0,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);
```

### Entidad: LoyaltyTransaction
```sql
CREATE TYPE loyalty_transaction_type AS ENUM (
    'earn',
    'redeem',
    'bonus',
    'adjustment',
    'expired'
);

CREATE TABLE loyalty_transactions (
    id SERIAL PRIMARY KEY,
    loyaltyProgramId INTEGER REFERENCES loyalty_programs(id),
    type loyalty_transaction_type NOT NULL,
    points INTEGER NOT NULL,
    description TEXT,
    expiresAt TIMESTAMP,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_loyalty_trans_program ON loyalty_transactions(loyaltyProgramId);
CREATE INDEX idx_loyalty_trans_created ON loyalty_transactions(createdAt DESC);
```

### Entidad: Coupon
```sql
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');

CREATE TABLE coupons (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    discountType discount_type NOT NULL,
    discountValue DECIMAL(10,2) NOT NULL,
    minOrderAmount DECIMAL(10,2),
    maxDiscount DECIMAL(10,2),
    usageLimit INTEGER,
    usageCount INTEGER DEFAULT 0,
    validFrom TIMESTAMP,
    validUntil TIMESTAMP,
    isActive BOOLEAN DEFAULT true,
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_coupons_code ON coupons(code);
```

### Entidad: StockMovement
```sql
CREATE TYPE movement_type AS ENUM ('in', 'out', 'adjustment', 'reserved', 'released');

CREATE TABLE stock_movements (
    id SERIAL PRIMARY KEY,
    productId INTEGER REFERENCES products(id),
    type movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    previousStock INTEGER NOT NULL,
    newStock INTEGER NOT NULL,
    reason TEXT,
    referenceId INTEGER,
    referenceType VARCHAR(50),
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stock_movements_product ON stock_movements(productId);
CREATE INDEX idx_stock_movements_created ON stock_movements(createdAt DESC);
```

### Entidad: Review
```sql
CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    userId INTEGER REFERENCES users(id),
    productId INTEGER REFERENCES products(id),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    isVerifiedPurchase BOOLEAN DEFAULT false,
    helpfulVotes INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'approved',
    createdAt TIMESTAMP DEFAULT NOW(),
    updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(productId);
CREATE INDEX idx_reviews_user ON reviews(userId);
CREATE INDEX idx_reviews_rating ON reviews(rating DESC);
```

### Entidad: AnalyticsEvent
```sql
CREATE TABLE analytics_events (
    id SERIAL PRIMARY KEY,
    eventType VARCHAR(50) NOT NULL,
    userId INTEGER REFERENCES users(id),
    sessionId VARCHAR(100),
    productId INTEGER REFERENCES products(id),
    orderId INTEGER REFERENCES orders(id),
    eventData JSONB,
    page VARCHAR(500),
    value DECIMAL(10,2),
    currency VARCHAR(10) DEFAULT 'PEN',
    createdAt TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_analytics_events_type ON analytics_events(eventType);
CREATE INDEX idx_analytics_events_user ON analytics_events(userId);
CREATE INDEX idx_analytics_events_created ON analytics_events(createdAt DESC);
```

---

## 🧩 Componentes del Frontend

### Componentes UI Base

| Componente | Props | Descripción |
|------------|-------|-------------|
| `Button` | variant, size, icon, loading, fullWidth | Botón versatile |
| `Card` | padding, hover, className | Contenedor con estilos |
| `Badge` | variant, size, icon, pulse | Etiqueta/c insignia |
| `Input` | type, error, label, icon | Campo de formulario |
| `Modal` | isOpen, onClose, title, size | Ventana modal |

### Componentes de Producto

| Componente | Descripción |
|------------|-------------|
| `ProductCard` | Tarjeta con imagen, precio, rating, botón agregar |
| `ProductFilters` | Sidebar con filtros múltiples |
| `ProductImageGallery` | Galería con zoom y thumbnails |
| `ProductComparison` | Comparación lado a lado |
| `ProductQuickView` | Modal de vista rápida |
| `RelatedProducts` | Productos relacionados |

### Componentes de Reviews

| Componente | Descripción |
|------------|-------------|
| `ReviewCard` | Tarjeta de reseña individual |
| `ReviewForm` | Formulario con rating en estrellas |
| `ReviewsList` | Lista paginada con filtros |

### Componentes de Dashboard

| Componente | Descripción |
|------------|-------------|
| `AnalyticsDashboard` | Gráficos y métricas |
| `LoyaltyProgram` | Progreso de puntos y nivel |
| `InventoryDashboard` | Gestión de stock |

### Contextos

```typescript
// AuthContext - Estado de autenticación
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data) => Promise<void>;
}

// CartContext - Carrito de compras
interface CartContextType {
  items: CartItem[];
  loading: boolean;
  addItem: (productId, quantity) => Promise<void>;
  updateQuantity: (id, quantity) => Promise<void>;
  removeItem: (id) => Promise<void>;
  clearCart: () => Promise<void>;
  subtotal: number;
  itemCount: number;
}

// ThemeContext - Tema visual
interface ThemeContextType {
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme) => void;
  resolvedTheme: 'light' | 'dark';
}

// NotificationContext - Notificaciones toast
interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification) => void;
  removeNotification: (id) => void;
}
```

---

## ✅ Buenas Prácticas

### Backend

```typescript
// 1. Uso de DTOs con validación
@Post()
@UsePipes(new ValidationPipe())
createProduct(@Body() createProductDto: CreateProductDto) {
  return this.productsService.create(createProductDto);
}

// 2. Manejo de errores consistente
@HttpCode(HttpStatus.OK)
@Post(':id/cancel')
async cancelOrder(
  @Param('id') id: number,
  @Body() cancelDto: CancelOrderDto,
  @CurrentUser() user: User
) {
  try {
    return await this.ordersService.cancel(id, user.id, cancelDto);
  } catch (error) {
    if (error instanceof OrderCannotBeCancelledException) {
      throw new BadRequestException(error.message);
    }
    throw error;
  }
}

// 3. Documentación con Swagger
@ApiTags('Products')
@ApiOperation({ summary: 'Crear nuevo producto' })
@ApiResponse({ status: 201, description: 'Producto creado' })
```

### Frontend

```typescript
// 1. Tipado estricto de props
interface ProductCardProps {
  product: Product;
  viewMode: 'grid' | 'list';
  onQuickView: () => void;
  onAddToComparison: () => void;
  isInComparison: boolean;
}

// 2. Custom hooks para lógica reutilizable
const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

// 3. Manejo de errores en API
try {
  await axios.post('/orders', orderData);
  addNotification({ type: 'success', message: 'Orden creada' });
} catch (error) {
  addNotification({
    type: 'error',
    message: error.response?.data?.message || 'Error al crear orden'
  });
}
```

### Base de Datos

```sql
-- 1. Uso de transacciones
BEGIN;
UPDATE products SET stock = stock - 1 WHERE id = 1;
INSERT INTO stock_movements (productId, type, quantity, previousStock, newStock)
VALUES (1, 'out', 1, 10, 9, 'Venta');
COMMIT;

-- 2. Índices para optimización
CREATE INDEX idx_products_category_price ON products(category, price);
CREATE INDEX idx_orders_status_created ON orders(status, createdAt DESC);

-- 3. Soft delete (opcional, usar deletedAt en lugar de DELETE)
UPDATE users SET deletedAt = NOW() WHERE id = 1;
```

---

## 🐛 Problemas Conocidos

### Alto Prioridad

| Problema | Solución | Estado |
|----------|----------|--------|
| Duplicación de archivos (Home_new.tsx, etc.) | Consolidar y eliminar versiones _new | Pendiente |
| Dos CartContext (CartContext.tsx, CartContext_new.tsx) | Unificar en una implementación | Pendiente |

### Medio Prioridad

| Problema | Solución | Estado |
|----------|----------|--------|
| TypeORM synchronize en producción | Usar migraciones en producción | Documentar |
| Logging excesivo en producción | Implementar logger con niveles | Pendiente |
| Hardcoded Render URL | Usar configuración de entorno | Pendiente |

### Bajo Prioridad

| Problema | Solución | Estado |
|----------|----------|--------|
| Alertas de vulnerabilidad npm | `npm audit fix` | Pendiente |
| Console logs en código | Usar logger estructurado | Mejora |

---

## 🧪 Desarrollo y Testing

### Ejecución en Desarrollo

```bash
# Terminal 1: Backend
cd tienda-backend
npm run start:dev

# Terminal 2: Frontend
cd tienda-frontend
npm run dev
```

### Tests

```bash
# Backend
cd tienda-backend
npm run test              # Unit tests
npm run test:e2e          # End-to-end tests
npm run test:cov          # Coverage report

# Frontend
cd tienda-frontend
npm run test             # Component tests
npm run test:ui          # UI tests con Playwright
```

### Build para Producción

```bash
# Backend
cd tienda-backend
npm run build
npm run start:prod

# Frontend
cd tienda-frontend
npm run build
npm run preview
```

### Database Migrations

```bash
# Generar migración
npm run migration:generate -- -n MigrationName

# Ejecutar migraciones
npm run migration:run

# Revertir migración
npm run migration:revert
```

### Seed de Datos

```bash
cd tienda-backend
npm run seed              # Seed principal
npm run seed:loyalty      # Seed programa lealtad
npm run seed:analytics    # Seed analytics
```

---

## 🚀 Deployment

### Render (Backend + Database)

```bash
# 1. Conectar repositorio a Render
# 2. Crear PostgreSQL service
# 3. Crear Web Service para backend:
#    - Build command: npm install && npm run build
#    - Start command: npm run start:prod
# 4. Configurar variables de entorno en Render dashboard
```

### Vercel/Netlify (Frontend)

```bash
# 1. Conectar repositorio
# 2. Configurar build command: npm run build
# 3. Configurar output directory: dist
# 4. Agregar variable: VITE_API_URL=https://tu-backend.onrender.com
```

### Docker (Opcional)

```dockerfile
# Dockerfile.backend
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3002
CMD ["node", "dist/main.js"]
```

---

## 📈 Mejoras Futuras

### Funcionalidades

- [ ] **GraphQL API** - Queries más flexibles
- [ ] **WebSocket** - Tiempo real (stock, notificaciones)
- [ ] **Búsqueda avanzada** - Elasticsearch
- [ ] **Multi-idioma** - i18n
- [ ] **OAuth Social** - Google, Facebook login
- [ ] **App móvil** - React Native

### Técnicas

- [ ] **Unit tests** - Coverage > 80%
- [ ] **CI/CD** - GitHub Actions
- [ ] **Monitoring** - Sentry/New Relic
- [ ] **Caching** - Redis
- [ ] **CDN** - Cloudflare

### UX

- [ ] **Progressive Web App** - Offline support
- [ ] **Live chat** - Soporte en vivo
- [ ] **Wishlist pública** - Compartir listas
- [ ] **Size recommender** - IA para tallas

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👥 Autores

- **Eduardo Valdivia** - *Desarrollo Full Stack* - [@Eduardo1300](https://github.com/Eduardo1300)

## 🙏 Agradecimientos

- [NestJS Team](https://nestjs.com/) - Framework backend
- [React Team](https://react.dev/) - Biblioteca UI
- [TailwindCSS](https://tailwindcss.com/) - Sistema de diseño
- [TypeORM](https://typeorm.io/) - ORM robusto
- [PostgreSQL](https://www.postgresql.org/) - Base de datos

---

**¿Tienes preguntas?** Abre un issue o contacta al equipo de desarrollo.

**¿Encontraste un bug?** Por favor, reporta el problema con pasos para reproducirlo.

**¿Quieres contribuir?** ¡Las contribuciones son bienvenidas!
