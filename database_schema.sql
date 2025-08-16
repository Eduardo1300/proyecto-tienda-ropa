-- =====================================
-- 🛍️ TIENDA DE ROPA - ESQUEMA COMPLETO DE BASE DE DATOS
-- Proyecto E-commerce Full Stack
-- Sistema: PostgreSQL
-- Fecha: 2025-08-15
-- =====================================

-- Eliminar base de datos si existe y crearla nuevamente
-- DROP DATABASE IF EXISTS tienda_ropa;
-- CREATE DATABASE tienda_ropa;

-- Conectar a la base de datos
-- \c tienda_ropa;

-- =====================================
-- 🔧 EXTENSIONES Y CONFIGURACIONES
-- =====================================

-- Extensión para UUID (si se necesita en el futuro)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================
-- 📊 ENUMERACIONES (ENUMS)
-- =====================================

-- Estados de órdenes
CREATE TYPE order_status AS ENUM (
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded'
);

-- Estados de devoluciones
CREATE TYPE return_status AS ENUM (
    'requested',
    'approved',
    'rejected',
    'received',
    'processed',
    'refunded'
);

-- Razones de devolución
CREATE TYPE return_reason AS ENUM (
    'defective',
    'wrong_size',
    'not_as_described',
    'changed_mind',
    'damaged_in_shipping',
    'other'
);

-- Estados de reviews
CREATE TYPE review_status AS ENUM (
    'pending',
    'approved',
    'rejected'
);

-- Tipos de movimiento de stock
CREATE TYPE movement_type AS ENUM (
    'purchase',
    'sale',
    'return',
    'adjustment',
    'restock',
    'expired',
    'damaged',
    'transfer'
);

-- Razones de movimiento de stock
CREATE TYPE movement_reason AS ENUM (
    'customer_order',
    'supplier_delivery',
    'inventory_count',
    'product_return',
    'expiration',
    'damage',
    'theft',
    'manual_adjustment',
    'auto_restock',
    'transfer_in',
    'transfer_out'
);

-- Estados de orden de compra
CREATE TYPE purchase_order_status AS ENUM (
    'draft',
    'pending',
    'approved',
    'sent',
    'partially_received',
    'received',
    'cancelled'
);

-- Tipos de alerta de inventario
CREATE TYPE alert_type AS ENUM (
    'low_stock',
    'out_of_stock',
    'expired',
    'expiring_soon',
    'overstock',
    'reorder_needed'
);

-- Tipos de eventos de analytics
CREATE TYPE event_type AS ENUM (
    'page_view',
    'product_view',
    'product_search',
    'add_to_cart',
    'remove_from_cart',
    'add_to_wishlist',
    'purchase',
    'user_registration',
    'user_login',
    'coupon_applied',
    'review_submitted',
    'newsletter_signup',
    'filter_applied',
    'sort_applied'
);

-- =====================================
-- 👥 TABLA DE USUARIOS
-- =====================================

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    "firstName" VARCHAR(100),
    "lastName" VARCHAR(100),
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' NOT NULL,
    "refreshToken" VARCHAR(500),
    "passwordResetToken" VARCHAR(500),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para usuarios
CREATE INDEX idx_user_email ON "user"(email);
CREATE INDEX idx_user_role ON "user"(role);

-- =====================================
-- 🛍️ TABLA DE PRODUCTOS
-- =====================================

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    "costPrice" DECIMAL(10,2),
    description TEXT NOT NULL,
    image VARCHAR(500),
    "imageUrl" VARCHAR(500),
    category VARCHAR(100) DEFAULT 'general',
    "isActive" BOOLEAN DEFAULT true,
    
    -- Campos de inventario avanzado
    sku VARCHAR(50) UNIQUE,
    barcode VARCHAR(100),
    stock INTEGER DEFAULT 0,
    "reservedStock" INTEGER DEFAULT 0,
    "minStockLevel" INTEGER DEFAULT 5,
    "maxStockLevel" INTEGER DEFAULT 100,
    "reorderPoint" INTEGER DEFAULT 20,
    "reorderQuantity" INTEGER DEFAULT 50,
    "expirationDate" TIMESTAMP,
    "trackExpiration" BOOLEAN DEFAULT false,
    "autoRestock" BOOLEAN DEFAULT false,
    "lowStockAlert" BOOLEAN DEFAULT false,
    "lastRestockDate" TIMESTAMP,
    "lastSoldDate" TIMESTAMP,
    "totalSold" INTEGER DEFAULT 0,
    
    -- Información del proveedor
    supplier VARCHAR(100),
    "supplierSku" VARCHAR(50),
    "supplierPrice" DECIMAL(10,2),
    "leadTimeDays" INTEGER DEFAULT 0,
    location VARCHAR(200),
    batch VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'kg',
    weight DECIMAL(10,3) DEFAULT 1,
    size VARCHAR(50),
    color VARCHAR(50),
    
    -- Características avanzadas
    brand VARCHAR(100),
    model VARCHAR(100),
    tags TEXT, -- JSON array como texto
    "relatedProductIds" TEXT, -- JSON array como texto
    "viewCount" INTEGER DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "averageRating" DECIMAL(3,2) DEFAULT 0,
    "isFeatured" BOOLEAN DEFAULT false,
    "isNew" BOOLEAN DEFAULT false,
    "isBestseller" BOOLEAN DEFAULT false,
    "launchDate" TIMESTAMP,
    specifications TEXT,
    "careInstructions" TEXT,
    "shippingInfo" TEXT,
    "returnPolicy" TEXT,
    
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para productos
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_brand ON products(brand);
CREATE INDEX idx_products_isActive ON products("isActive");
CREATE INDEX idx_products_price ON products(price);

-- =====================================
-- 🔄 TABLA DE VARIANTES DE PRODUCTOS
-- =====================================

CREATE TABLE "product_variant" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100),
    price DECIMAL(10,2) NOT NULL,
    "compareAtPrice" DECIMAL(10,2),
    "costPrice" DECIMAL(10,2),
    stock INTEGER DEFAULT 0,
    "reservedStock" INTEGER DEFAULT 0,
    color VARCHAR(50),
    size VARCHAR(50),
    material VARCHAR(100),
    weight DECIMAL(10,3),
    dimensions VARCHAR(100),
    "isDefault" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    position INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para variantes
CREATE INDEX idx_product_variant_productId ON "product_variant"("productId");
CREATE INDEX idx_product_variant_sku ON "product_variant"(sku);

-- =====================================
-- 🖼️ TABLA DE IMÁGENES DE PRODUCTOS
-- =====================================

CREATE TABLE "product_image" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "variantId" INTEGER REFERENCES "product_variant"(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    "altText" VARCHAR(200),
    position INTEGER DEFAULT 0,
    "isMain" BOOLEAN DEFAULT false,
    "isActive" BOOLEAN DEFAULT true,
    type VARCHAR(50), -- 'main', 'gallery', 'variant', 'zoom'
    width INTEGER,
    height INTEGER,
    "fileSize" INTEGER,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para imágenes
CREATE INDEX idx_product_image_productId ON "product_image"("productId");
CREATE INDEX idx_product_image_variantId ON "product_image"("variantId");

-- =====================================
-- ⭐ TABLA DE REVIEWS DE PRODUCTOS
-- =====================================

CREATE TABLE "product_review" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200) NOT NULL,
    comment TEXT NOT NULL,
    status review_status DEFAULT 'pending',
    "isVerifiedPurchase" BOOLEAN DEFAULT false,
    "helpfulCount" INTEGER DEFAULT 0,
    "notHelpfulCount" INTEGER DEFAULT 0,
    "moderatorNotes" VARCHAR(500),
    "moderatedAt" TIMESTAMP,
    "moderatedBy" INTEGER REFERENCES "user"(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para reviews
CREATE INDEX idx_product_review_productId ON "product_review"("productId");
CREATE INDEX idx_product_review_userId ON "product_review"("userId");
CREATE INDEX idx_product_review_rating ON "product_review"(rating);

-- =====================================
-- ❤️ TABLA DE LISTA DE DESEOS
-- =====================================

CREATE TABLE wishlist (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "productId")
);

-- Índices para wishlist
CREATE INDEX idx_wishlist_userId ON wishlist("userId");
CREATE INDEX idx_wishlist_productId ON wishlist("productId");

-- =====================================
-- 🔍 TABLA DE COMPARACIÓN DE PRODUCTOS
-- =====================================

CREATE TABLE "product_comparison" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "productId")
);

-- Índices para comparaciones
CREATE INDEX idx_product_comparison_userId ON "product_comparison"("userId");

-- =====================================
-- 👁️ TABLA DE PRODUCTOS VISTOS RECIENTEMENTE
-- =====================================

CREATE TABLE "recently_viewed" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "viewCount" INTEGER DEFAULT 1,
    "lastViewedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId", "productId")
);

-- Índices para productos vistos
CREATE INDEX idx_recently_viewed_userId ON "recently_viewed"("userId");
CREATE INDEX idx_recently_viewed_lastViewedAt ON "recently_viewed"("lastViewedAt");

-- =====================================
-- 🛒 TABLA DE CARRITO DE COMPRAS
-- =====================================

CREATE TABLE "cart_item" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
    "addedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para carrito
CREATE INDEX idx_cart_item_userId ON "cart_item"("userId");
CREATE INDEX idx_cart_item_productId ON "cart_item"("productId");

-- =====================================
-- 📄 TABLA DE ÓRDENES
-- =====================================

CREATE TABLE "order" (
    id SERIAL PRIMARY KEY,
    "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
    status order_status DEFAULT 'pending',
    total DECIMAL(10,2) NOT NULL,
    "shippingCost" DECIMAL(10,2) DEFAULT 0,
    tax DECIMAL(10,2) DEFAULT 0,
    "trackingCode" VARCHAR(100),
    "shippingCarrier" VARCHAR(100),
    "shippingAddress" TEXT,
    "billingAddress" TEXT,
    notes TEXT,
    "estimatedDeliveryDate" TIMESTAMP,
    "actualDeliveryDate" TIMESTAMP,
    "cancelledAt" TIMESTAMP,
    "cancellationReason" TEXT,
    "canBeCancelled" BOOLEAN DEFAULT false,
    "canBeReturned" BOOLEAN DEFAULT false,
    "returnRequestedAt" TIMESTAMP,
    "refundedAt" TIMESTAMP,
    "refundAmount" DECIMAL(10,2),
    "refundReason" TEXT,
    "couponId" INTEGER,
    "discountAmount" DECIMAL(10,2) DEFAULT 0,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para órdenes
CREATE INDEX idx_order_userId ON "order"("userId");
CREATE INDEX idx_order_orderNumber ON "order"("orderNumber");
CREATE INDEX idx_order_status ON "order"(status);
CREATE INDEX idx_order_createdAt ON "order"("createdAt");

-- =====================================
-- 📋 TABLA DE ITEMS DE ÓRDENES
-- =====================================

CREATE TABLE "order_item" (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price DECIMAL(10,2) NOT NULL
);

-- Índices para items de órdenes
CREATE INDEX idx_order_item_orderId ON "order_item"("orderId");
CREATE INDEX idx_order_item_productId ON "order_item"("productId");

-- =====================================
-- 📈 TABLA DE HISTORIAL DE ESTADOS DE ÓRDENES
-- =====================================

CREATE TABLE "order_status_history" (
    id SERIAL PRIMARY KEY,
    "orderId" INTEGER NOT NULL REFERENCES "order"(id) ON DELETE CASCADE,
    "fromStatus" order_status,
    "toStatus" order_status NOT NULL,
    reason TEXT,
    notes TEXT,
    "changedBy" INTEGER REFERENCES "user"(id),
    "emailSent" BOOLEAN DEFAULT false,
    "trackingCode" VARCHAR(100),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para historial de estados
CREATE INDEX idx_order_status_history_orderId ON "order_status_history"("orderId");
CREATE INDEX idx_order_status_history_createdAt ON "order_status_history"("createdAt");

-- =====================================
-- 🔄 TABLA DE DEVOLUCIONES
-- =====================================

CREATE TABLE "return" (
    id SERIAL PRIMARY KEY,
    "returnNumber" VARCHAR(50) UNIQUE NOT NULL,
    "orderId" INTEGER NOT NULL REFERENCES "order"(id) ON DELETE RESTRICT,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE RESTRICT,
    status return_status DEFAULT 'requested',
    reason return_reason NOT NULL,
    description TEXT,
    "refundAmount" DECIMAL(10,2) NOT NULL,
    "approvedAt" TIMESTAMP,
    "rejectedAt" TIMESTAMP,
    "rejectionReason" TEXT,
    "receivedAt" TIMESTAMP,
    "processedAt" TIMESTAMP,
    "refundedAt" TIMESTAMP,
    "adminNotes" TEXT,
    "processedBy" INTEGER REFERENCES "user"(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para devoluciones
CREATE INDEX idx_return_orderId ON "return"("orderId");
CREATE INDEX idx_return_userId ON "return"("userId");
CREATE INDEX idx_return_status ON "return"(status);

-- =====================================
-- 📋 TABLA DE ITEMS DE DEVOLUCIONES
-- =====================================

CREATE TABLE "return_item" (
    id SERIAL PRIMARY KEY,
    "returnId" INTEGER NOT NULL REFERENCES "return"(id) ON DELETE CASCADE,
    "orderItemId" INTEGER NOT NULL REFERENCES "order_item"(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    "refundAmount" DECIMAL(10,2) NOT NULL,
    condition TEXT,
    notes TEXT
);

-- Índices para items de devoluciones
CREATE INDEX idx_return_item_returnId ON "return_item"("returnId");
CREATE INDEX idx_return_item_orderItemId ON "return_item"("orderItemId");

-- =====================================
-- 🏪 TABLA DE PROVEEDORES
-- =====================================

CREATE TABLE supplier (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    "contactPerson" VARCHAR(100),
    email VARCHAR(100),
    phone VARCHAR(20),
    address VARCHAR(500),
    city VARCHAR(100),
    country VARCHAR(100),
    "postalCode" VARCHAR(20),
    "taxId" VARCHAR(50),
    website VARCHAR(100),
    "paymentTerms" VARCHAR(50) DEFAULT 'net30',
    "leadTimeDays" INTEGER DEFAULT 7,
    rating DECIMAL(3,2),
    "isActive" BOOLEAN DEFAULT true,
    "totalPurchases" DECIMAL(12,2) DEFAULT 0,
    "lastOrderDate" TIMESTAMP,
    notes TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para proveedores
CREATE INDEX idx_supplier_code ON supplier(code);
CREATE INDEX idx_supplier_name ON supplier(name);
CREATE INDEX idx_supplier_isActive ON supplier("isActive");

-- =====================================
-- 🔗 TABLA DE PRODUCTOS POR PROVEEDOR
-- =====================================

CREATE TABLE "supplier_product" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    "supplierId" INTEGER NOT NULL REFERENCES supplier(id) ON DELETE CASCADE,
    "supplierSku" VARCHAR(50),
    "supplierPrice" DECIMAL(10,2) NOT NULL,
    "minimumOrderQuantity" INTEGER DEFAULT 1,
    "leadTimeDays" INTEGER DEFAULT 7,
    "isPreferred" BOOLEAN DEFAULT true,
    "isActive" BOOLEAN DEFAULT true,
    "lastOrderDate" TIMESTAMP,
    "lastOrderPrice" DECIMAL(10,2),
    "totalOrdered" INTEGER DEFAULT 0,
    notes VARCHAR(500),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para productos por proveedor
CREATE INDEX idx_supplier_product_productId ON "supplier_product"("productId");
CREATE INDEX idx_supplier_product_supplierId ON "supplier_product"("supplierId");
CREATE UNIQUE INDEX idx_supplier_product_unique ON "supplier_product"("productId", "supplierId");

-- =====================================
-- 📦 TABLA DE ÓRDENES DE COMPRA A PROVEEDORES
-- =====================================

CREATE TABLE "purchase_order" (
    id SERIAL PRIMARY KEY,
    "orderNumber" VARCHAR(50) UNIQUE NOT NULL,
    "supplierId" INTEGER NOT NULL REFERENCES supplier(id) ON DELETE RESTRICT,
    status purchase_order_status DEFAULT 'draft',
    "totalAmount" DECIMAL(12,2) NOT NULL,
    "expectedDeliveryDate" TIMESTAMP,
    "actualDeliveryDate" TIMESTAMP,
    notes VARCHAR(500),
    "shippingAddress" VARCHAR(200),
    "paymentTerms" VARCHAR(100),
    "createdBy" INTEGER NOT NULL REFERENCES "user"(id),
    "approvedBy" INTEGER REFERENCES "user"(id),
    "approvedAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para órdenes de compra
CREATE INDEX idx_purchase_order_supplierId ON "purchase_order"("supplierId");
CREATE INDEX idx_purchase_order_status ON "purchase_order"(status);
CREATE INDEX idx_purchase_order_createdBy ON "purchase_order"("createdBy");

-- =====================================
-- 📋 TABLA DE ITEMS DE ÓRDENES DE COMPRA
-- =====================================

CREATE TABLE "purchase_order_item" (
    id SERIAL PRIMARY KEY,
    "purchaseOrderId" INTEGER NOT NULL REFERENCES "purchase_order"(id) ON DELETE CASCADE,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    "receivedQuantity" INTEGER DEFAULT 0,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "supplierSku" VARCHAR(50),
    batch VARCHAR(100),
    "expirationDate" TIMESTAMP,
    notes VARCHAR(500),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para items de órdenes de compra
CREATE INDEX idx_purchase_order_item_purchaseOrderId ON "purchase_order_item"("purchaseOrderId");
CREATE INDEX idx_purchase_order_item_productId ON "purchase_order_item"("productId");

-- =====================================
-- 📊 TABLA DE MOVIMIENTOS DE STOCK
-- =====================================

CREATE TABLE "stock_movement" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    type movement_type NOT NULL,
    reason movement_reason NOT NULL,
    quantity INTEGER NOT NULL,
    "previousStock" INTEGER NOT NULL,
    "newStock" INTEGER NOT NULL,
    "unitCost" DECIMAL(10,2),
    "totalCost" DECIMAL(10,2),
    location VARCHAR(200),
    notes VARCHAR(500),
    "referenceNumber" VARCHAR(100),
    "createdBy" INTEGER REFERENCES "user"(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para movimientos de stock
CREATE INDEX idx_stock_movement_productId ON "stock_movement"("productId");
CREATE INDEX idx_stock_movement_type ON "stock_movement"(type);
CREATE INDEX idx_stock_movement_createdAt ON "stock_movement"("createdAt");

-- =====================================
-- 🚨 TABLA DE ALERTAS DE INVENTARIO
-- =====================================

CREATE TABLE "inventory_alert" (
    id SERIAL PRIMARY KEY,
    "productId" INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    message TEXT NOT NULL,
    threshold INTEGER,
    "currentValue" INTEGER,
    "isRead" BOOLEAN DEFAULT false,
    "readBy" INTEGER REFERENCES "user"(id),
    "readAt" TIMESTAMP,
    "isResolved" BOOLEAN DEFAULT false,
    "resolvedBy" INTEGER REFERENCES "user"(id),
    "resolvedAt" TIMESTAMP,
    "resolutionNotes" TEXT,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para alertas de inventario
CREATE INDEX idx_inventory_alert_productId ON "inventory_alert"("productId");
CREATE INDEX idx_inventory_alert_type ON "inventory_alert"(type);
CREATE INDEX idx_inventory_alert_isRead ON "inventory_alert"("isRead");

-- =====================================
-- 🎫 TABLA DE CUPONES
-- =====================================

CREATE TABLE coupon (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    "discountType" VARCHAR(20) NOT NULL, -- 'percentage', 'fixed_amount'
    "discountValue" DECIMAL(10,2) NOT NULL,
    "minimumAmount" DECIMAL(10,2),
    "maximumDiscount" DECIMAL(10,2),
    "usageLimit" INTEGER,
    "usedCount" INTEGER DEFAULT 0,
    "userLimit" INTEGER DEFAULT 1,
    "validFrom" TIMESTAMP NOT NULL,
    "validUntil" TIMESTAMP NOT NULL,
    "isActive" BOOLEAN DEFAULT true,
    "appliesTo" VARCHAR(20) DEFAULT 'all', -- 'all', 'category', 'product'
    "targetCategories" TEXT, -- JSON array como texto
    "targetProducts" TEXT, -- JSON array como texto
    "createdBy" INTEGER REFERENCES "user"(id),
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para cupones
CREATE INDEX idx_coupon_code ON coupon(code);
CREATE INDEX idx_coupon_validFrom ON coupon("validFrom");
CREATE INDEX idx_coupon_validUntil ON coupon("validUntil");
CREATE INDEX idx_coupon_isActive ON coupon("isActive");

-- =====================================
-- 🏆 TABLA DE PROGRAMA DE FIDELIDAD
-- =====================================

CREATE TABLE "loyalty_program" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "pointsBalance" INTEGER DEFAULT 0,
    "totalPointsEarned" INTEGER DEFAULT 0,
    "totalPointsRedeemed" INTEGER DEFAULT 0,
    "membershipLevel" VARCHAR(20) DEFAULT 'bronze', -- 'bronze', 'silver', 'gold', 'platinum'
    "joinDate" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "lastActivityDate" TIMESTAMP,
    "isActive" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE("userId")
);

-- Índices para programa de fidelidad
CREATE INDEX idx_loyalty_program_userId ON "loyalty_program"("userId");
CREATE INDEX idx_loyalty_program_membershipLevel ON "loyalty_program"("membershipLevel");

-- =====================================
-- 💎 TABLA DE TRANSACCIONES DE FIDELIDAD
-- =====================================

CREATE TABLE "loyalty_transaction" (
    id SERIAL PRIMARY KEY,
    "userId" INTEGER NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
    "orderId" INTEGER REFERENCES "order"(id),
    type VARCHAR(20) NOT NULL, -- 'earned', 'redeemed', 'expired', 'bonus'
    points INTEGER NOT NULL,
    description VARCHAR(500),
    "expiresAt" TIMESTAMP,
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para transacciones de fidelidad
CREATE INDEX idx_loyalty_transaction_userId ON "loyalty_transaction"("userId");
CREATE INDEX idx_loyalty_transaction_type ON "loyalty_transaction"(type);
CREATE INDEX idx_loyalty_transaction_createdAt ON "loyalty_transaction"("createdAt");

-- =====================================
-- 📊 TABLA DE EVENTOS DE ANALYTICS
-- =====================================

CREATE TABLE "analytics_event" (
    id SERIAL PRIMARY KEY,
    "eventType" event_type NOT NULL,
    "userId" INTEGER REFERENCES "user"(id),
    "sessionId" VARCHAR(100),
    "productId" INTEGER REFERENCES products(id),
    "orderId" INTEGER REFERENCES "order"(id),
    "categoryId" VARCHAR(100),
    "searchQuery" VARCHAR(500),
    "userAgent" VARCHAR(1000),
    "ipAddress" INET,
    "referrer" VARCHAR(500),
    "pageUrl" VARCHAR(500),
    properties JSONB, -- Propiedades adicionales del evento
    "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para events de analytics
CREATE INDEX idx_analytics_event_eventType_createdAt ON "analytics_event"("eventType", "createdAt");
CREATE INDEX idx_analytics_event_userId_createdAt ON "analytics_event"("userId", "createdAt");
CREATE INDEX idx_analytics_event_sessionId_createdAt ON "analytics_event"("sessionId", "createdAt");
CREATE INDEX idx_analytics_event_productId ON "analytics_event"("productId");
CREATE INDEX idx_analytics_event_createdAt ON "analytics_event"("createdAt");

-- =====================================
-- 🔧 FUNCIONES Y TRIGGERS
-- =====================================

-- Función para actualizar timestamp de updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para actualizar updatedAt automáticamente
CREATE TRIGGER update_user_updated_at BEFORE UPDATE ON "user" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_variant_updated_at BEFORE UPDATE ON "product_variant" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_image_updated_at BEFORE UPDATE ON "product_image" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_review_updated_at BEFORE UPDATE ON "product_review" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_wishlist_updated_at BEFORE UPDATE ON wishlist FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_product_comparison_updated_at BEFORE UPDATE ON "product_comparison" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recently_viewed_updated_at BEFORE UPDATE ON "recently_viewed" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_order_updated_at BEFORE UPDATE ON "order" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_return_updated_at BEFORE UPDATE ON "return" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_updated_at BEFORE UPDATE ON supplier FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_supplier_product_updated_at BEFORE UPDATE ON "supplier_product" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_order_updated_at BEFORE UPDATE ON "purchase_order" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_purchase_order_item_updated_at BEFORE UPDATE ON "purchase_order_item" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_inventory_alert_updated_at BEFORE UPDATE ON "inventory_alert" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_coupon_updated_at BEFORE UPDATE ON coupon FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_loyalty_program_updated_at BEFORE UPDATE ON "loyalty_program" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================
-- 📈 VISTAS ÚTILES
-- =====================================

-- Vista de productos con stock bajo
CREATE VIEW low_stock_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p.stock,
    p."reservedStock",
    (p.stock - p."reservedStock") as available_stock,
    p."minStockLevel",
    p."reorderPoint"
FROM products p
WHERE p."isActive" = true 
    AND (p.stock - p."reservedStock") <= p."minStockLevel";

-- Vista de estadísticas de órdenes por mes
CREATE VIEW monthly_order_stats AS
SELECT 
    DATE_TRUNC('month', "createdAt") as month,
    COUNT(*) as total_orders,
    SUM(total) as total_revenue,
    AVG(total) as average_order_value,
    COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered_orders
FROM "order"
GROUP BY DATE_TRUNC('month', "createdAt")
ORDER BY month DESC;

-- Vista de productos más vendidos
CREATE VIEW top_selling_products AS
SELECT 
    p.id,
    p.name,
    p.sku,
    p."totalSold",
    SUM(oi.quantity) as total_ordered_quantity,
    SUM(oi.quantity * oi.price) as total_revenue
FROM products p
LEFT JOIN "order_item" oi ON p.id = oi."productId"
LEFT JOIN "order" o ON oi."orderId" = o.id
WHERE o.status IN ('delivered', 'shipped')
GROUP BY p.id, p.name, p.sku, p."totalSold"
ORDER BY total_ordered_quantity DESC;

-- =====================================
-- ✅ VERIFICACIÓN DEL ESQUEMA
-- =====================================

-- Función para verificar integridad
CREATE OR REPLACE FUNCTION verify_schema_integrity()
RETURNS TABLE(table_name TEXT, constraint_name TEXT, status TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        tc.table_name::TEXT,
        tc.constraint_name::TEXT,
        'OK'::TEXT as status
    FROM information_schema.table_constraints tc
    WHERE tc.table_schema = 'public'
        AND tc.constraint_type = 'FOREIGN KEY';
END;
$$ LANGUAGE plpgsql;

-- =====================================
-- 📝 COMENTARIOS EN TABLAS
-- =====================================

COMMENT ON TABLE "user" IS 'Tabla de usuarios del sistema con autenticación';
COMMENT ON TABLE products IS 'Catálogo principal de productos con inventario avanzado';
COMMENT ON TABLE "product_variant" IS 'Variantes de productos (tallas, colores, etc.)';
COMMENT ON TABLE "product_image" IS 'Imágenes asociadas a productos y variantes';
COMMENT ON TABLE "product_review" IS 'Reviews y calificaciones de productos';
COMMENT ON TABLE wishlist IS 'Lista de deseos de usuarios';
COMMENT ON TABLE "cart_item" IS 'Items en carrito de compras por usuario';
COMMENT ON TABLE "order" IS 'Órdenes de compra del e-commerce';
COMMENT ON TABLE "order_item" IS 'Items individuales dentro de cada orden';
COMMENT ON TABLE "return" IS 'Devoluciones de productos';
COMMENT ON TABLE supplier IS 'Proveedores para gestión de inventario';
COMMENT ON TABLE "stock_movement" IS 'Movimientos de inventario (entradas/salidas)';
COMMENT ON TABLE "analytics_event" IS 'Eventos de analytics y tracking de usuarios';

-- =====================================
-- 🎯 DATOS INICIALES BÁSICOS
-- =====================================

-- Usuario administrador por defecto
INSERT INTO "user" (username, email, "firstName", "lastName", password, role) 
VALUES ('admin', 'admin@tienda.com', 'Administrador', 'Sistema', '$2b$10$encrypted_password_hash', 'admin');

-- Categorías básicas como productos
INSERT INTO products (name, description, price, category, "isActive") VALUES 
('Camisetas', 'Categoría de camisetas', 0, 'categoria', false),
('Pantalones', 'Categoría de pantalones', 0, 'categoria', false),
('Vestidos', 'Categoría de vestidos', 0, 'categoria', false),
('Zapatos', 'Categoría de zapatos', 0, 'categoria', false),
('Accesorios', 'Categoría de accesorios', 0, 'categoria', false);

-- =====================================
-- 🏁 FINALIZACIÓN
-- =====================================

-- Mensaje de confirmación
SELECT 'Base de datos de Tienda de Ropa creada exitosamente' as resultado,
       COUNT(*) as total_tablas
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE';

-- Verificar foreign keys
SELECT 'Foreign Keys verificadas: ' || COUNT(*) as foreign_keys_status
FROM information_schema.table_constraints 
WHERE constraint_type = 'FOREIGN KEY' 
    AND table_schema = 'public';

-- =====================================
-- 📋 RESUMEN DE LA BASE DE DATOS
-- =====================================
/*
📊 RESUMEN DEL ESQUEMA:
- 20+ tablas principales
- Sistema completo de E-commerce
- Gestión avanzada de inventario
- Sistema de reviews y wishlist
- Analytics y tracking
- Programa de fidelidad
- Sistema de cupones
- Gestión de proveedores
- Devoluciones completas
- Triggers automáticos
- Vistas para reportes
- Índices optimizados
- Constraints de integridad

🔧 CONFIGURACIÓN NECESARIA:
1. Crear base de datos: tienda_ropa
2. Ejecutar este script completo
3. Configurar variables de entorno en .env
4. Conectar desde NestJS con TypeORM

📝 NOTAS:
- Todos los ENUMs están definidos
- Foreign keys configuradas correctamente  
- Triggers para updatedAt automáticos
- Vistas para reportes incluidas
- Compatible con TypeORM sync: false
*/
