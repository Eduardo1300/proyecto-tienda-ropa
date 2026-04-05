--
-- PostgreSQL database dump
--

\restrict J9Ja0Udenwkyu8PYIPh9rujflDczapVcZf9BjaGQbuGEZPRwJedMoU2vbPx1Tq1

-- Dumped from database version 17.9
-- Dumped by pg_dump version 17.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: analytics_events_eventtype_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.analytics_events_eventtype_enum AS ENUM (
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


ALTER TYPE public.analytics_events_eventtype_enum OWNER TO postgres;

--
-- Name: coupons_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.coupons_status_enum AS ENUM (
    'active',
    'inactive',
    'expired'
);


ALTER TYPE public.coupons_status_enum OWNER TO postgres;

--
-- Name: coupons_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.coupons_type_enum AS ENUM (
    'percentage',
    'fixed_amount',
    'free_shipping'
);


ALTER TYPE public.coupons_type_enum OWNER TO postgres;

--
-- Name: inventory_alert_priority_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_alert_priority_enum AS ENUM (
    'low',
    'medium',
    'high',
    'critical'
);


ALTER TYPE public.inventory_alert_priority_enum OWNER TO postgres;

--
-- Name: inventory_alert_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_alert_status_enum AS ENUM (
    'active',
    'acknowledged',
    'resolved',
    'dismissed'
);


ALTER TYPE public.inventory_alert_status_enum OWNER TO postgres;

--
-- Name: inventory_alert_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.inventory_alert_type_enum AS ENUM (
    'low_stock',
    'out_of_stock',
    'expiring_soon',
    'expired',
    'reorder_point',
    'overstock'
);


ALTER TYPE public.inventory_alert_type_enum OWNER TO postgres;

--
-- Name: loyalty_programs_currenttier_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_programs_currenttier_enum AS ENUM (
    'bronze',
    'silver',
    'gold',
    'platinum'
);


ALTER TYPE public.loyalty_programs_currenttier_enum OWNER TO postgres;

--
-- Name: loyalty_transactions_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_transactions_reason_enum AS ENUM (
    'purchase',
    'redemption',
    'birthday_bonus',
    'referral_bonus',
    'review_bonus',
    'signup_bonus',
    'tier_upgrade_bonus',
    'admin_adjustment',
    'expiration'
);


ALTER TYPE public.loyalty_transactions_reason_enum OWNER TO postgres;

--
-- Name: loyalty_transactions_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.loyalty_transactions_type_enum AS ENUM (
    'earned',
    'redeemed',
    'expired',
    'bonus',
    'adjustment'
);


ALTER TYPE public.loyalty_transactions_type_enum OWNER TO postgres;

--
-- Name: order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
    'refunded'
);


ALTER TYPE public.order_status_enum OWNER TO postgres;

--
-- Name: order_status_history_fromstatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_history_fromstatus_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
    'refunded'
);


ALTER TYPE public.order_status_history_fromstatus_enum OWNER TO postgres;

--
-- Name: order_status_history_tostatus_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.order_status_history_tostatus_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'returned',
    'refunded'
);


ALTER TYPE public.order_status_history_tostatus_enum OWNER TO postgres;

--
-- Name: product_review_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.product_review_status_enum AS ENUM (
    'pending',
    'approved',
    'rejected'
);


ALTER TYPE public.product_review_status_enum OWNER TO postgres;

--
-- Name: purchase_order_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.purchase_order_status_enum AS ENUM (
    'draft',
    'pending',
    'approved',
    'sent',
    'partially_received',
    'received',
    'cancelled'
);


ALTER TYPE public.purchase_order_status_enum OWNER TO postgres;

--
-- Name: return_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_reason_enum AS ENUM (
    'defective',
    'wrong_size',
    'not_as_described',
    'changed_mind',
    'damaged_in_shipping',
    'other'
);


ALTER TYPE public.return_reason_enum OWNER TO postgres;

--
-- Name: return_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.return_status_enum AS ENUM (
    'requested',
    'approved',
    'rejected',
    'received',
    'processed',
    'refunded'
);


ALTER TYPE public.return_status_enum OWNER TO postgres;

--
-- Name: stock_movement_reason_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stock_movement_reason_enum AS ENUM (
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


ALTER TYPE public.stock_movement_reason_enum OWNER TO postgres;

--
-- Name: stock_movement_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.stock_movement_type_enum AS ENUM (
    'purchase',
    'sale',
    'return',
    'adjustment',
    'restock',
    'expired',
    'damaged',
    'transfer'
);


ALTER TYPE public.stock_movement_type_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: analytics_events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.analytics_events (
    id integer NOT NULL,
    "eventType" public.analytics_events_eventtype_enum NOT NULL,
    "userId" integer,
    "sessionId" character varying,
    "productId" integer,
    "categoryId" integer,
    "orderId" integer,
    "eventData" json,
    "userAgent" character varying,
    "ipAddress" character varying,
    referrer character varying,
    page character varying,
    value numeric(10,2),
    currency character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.analytics_events OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.analytics_events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.analytics_events_id_seq OWNER TO postgres;

--
-- Name: analytics_events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.analytics_events_id_seq OWNED BY public.analytics_events.id;


--
-- Name: cart_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "userId" integer,
    "productId" integer
);


ALTER TABLE public.cart_item OWNER TO postgres;

--
-- Name: cart_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cart_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cart_item_id_seq OWNER TO postgres;

--
-- Name: cart_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cart_item_id_seq OWNED BY public.cart_item.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code character varying NOT NULL,
    name character varying NOT NULL,
    description character varying,
    type public.coupons_type_enum DEFAULT 'percentage'::public.coupons_type_enum NOT NULL,
    value numeric(10,2) NOT NULL,
    "minimumAmount" numeric(10,2),
    "maximumDiscount" numeric(10,2),
    "usageLimit" integer DEFAULT 0 NOT NULL,
    "usageCount" integer DEFAULT 0 NOT NULL,
    "usagePerUser" integer DEFAULT 1 NOT NULL,
    "validFrom" timestamp without time zone,
    "validUntil" timestamp without time zone,
    status public.coupons_status_enum DEFAULT 'active'::public.coupons_status_enum NOT NULL,
    "applicableCategories" text,
    "applicableProducts" text,
    "isFirstTimeUser" boolean DEFAULT false NOT NULL,
    "isPublic" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.coupons OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO postgres;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: inventory_alert; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_alert (
    id integer NOT NULL,
    type public.inventory_alert_type_enum NOT NULL,
    status public.inventory_alert_status_enum DEFAULT 'active'::public.inventory_alert_status_enum NOT NULL,
    priority public.inventory_alert_priority_enum DEFAULT 'medium'::public.inventory_alert_priority_enum NOT NULL,
    message character varying(500) NOT NULL,
    threshold integer,
    "currentValue" integer,
    "expirationDate" timestamp without time zone,
    "emailSent" boolean DEFAULT false NOT NULL,
    "emailSentAt" timestamp without time zone,
    "acknowledgedAt" timestamp without time zone,
    "acknowledgedNotes" character varying(500),
    "resolvedAt" timestamp without time zone,
    "resolutionNotes" character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer,
    "acknowledgedById" integer,
    "resolvedById" integer
);


ALTER TABLE public.inventory_alert OWNER TO postgres;

--
-- Name: inventory_alert_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_alert_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_alert_id_seq OWNER TO postgres;

--
-- Name: inventory_alert_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_alert_id_seq OWNED BY public.inventory_alert.id;


--
-- Name: loyalty_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_programs (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "totalPoints" integer DEFAULT 0 NOT NULL,
    "availablePoints" integer DEFAULT 0 NOT NULL,
    "currentTier" public.loyalty_programs_currenttier_enum DEFAULT 'bronze'::public.loyalty_programs_currenttier_enum NOT NULL,
    "tierProgress" integer DEFAULT 0 NOT NULL,
    "tierAchievedAt" timestamp without time zone,
    "lastActivityAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "lifetimeSpent" numeric(10,2) DEFAULT '0'::numeric NOT NULL
);


ALTER TABLE public.loyalty_programs OWNER TO postgres;

--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loyalty_programs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_programs_id_seq OWNER TO postgres;

--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loyalty_programs_id_seq OWNED BY public.loyalty_programs.id;


--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.loyalty_transactions (
    id integer NOT NULL,
    "loyaltyProgramId" integer NOT NULL,
    type public.loyalty_transactions_type_enum NOT NULL,
    reason public.loyalty_transactions_reason_enum NOT NULL,
    points integer NOT NULL,
    "orderAmount" numeric(10,2),
    "orderId" integer,
    description character varying,
    "referenceId" character varying,
    "expiresAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.loyalty_transactions OWNER TO postgres;

--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.loyalty_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.loyalty_transactions_id_seq OWNER TO postgres;

--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.loyalty_transactions_id_seq OWNED BY public.loyalty_transactions.id;


--
-- Name: order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."order" (
    id integer NOT NULL,
    "orderNumber" character varying NOT NULL,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    total numeric(10,2) NOT NULL,
    "shippingCost" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    tax numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "trackingCode" character varying,
    "shippingCarrier" character varying,
    "shippingAddress" text,
    "billingAddress" text,
    notes text,
    "estimatedDeliveryDate" timestamp without time zone,
    "actualDeliveryDate" timestamp without time zone,
    "cancelledAt" timestamp without time zone,
    "cancellationReason" text,
    "canBeCancelled" boolean DEFAULT false NOT NULL,
    "canBeReturned" boolean DEFAULT false NOT NULL,
    "returnRequestedAt" timestamp without time zone,
    "refundedAt" timestamp without time zone,
    "refundAmount" numeric(10,2),
    "refundReason" text,
    "discountAmount" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "couponId" integer
);


ALTER TABLE public."order" OWNER TO postgres;

--
-- Name: order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_id_seq OWNER TO postgres;

--
-- Name: order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_id_seq OWNED BY public."order".id;


--
-- Name: order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    "productId" integer,
    "orderId" integer
);


ALTER TABLE public.order_item OWNER TO postgres;

--
-- Name: order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_item_id_seq OWNER TO postgres;

--
-- Name: order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_item_id_seq OWNED BY public.order_item.id;


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_status_history (
    id integer NOT NULL,
    "fromStatus" public.order_status_history_fromstatus_enum,
    "toStatus" public.order_status_history_tostatus_enum NOT NULL,
    reason text,
    notes text,
    "emailSent" boolean DEFAULT false NOT NULL,
    "trackingCode" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "orderId" integer,
    "changedById" integer
);


ALTER TABLE public.order_status_history OWNER TO postgres;

--
-- Name: order_status_history_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.order_status_history_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.order_status_history_id_seq OWNER TO postgres;

--
-- Name: order_status_history_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.order_status_history_id_seq OWNED BY public.order_status_history.id;


--
-- Name: product_comparison; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_comparison (
    id integer NOT NULL,
    name character varying(200) DEFAULT 'Mi Comparación'::character varying NOT NULL,
    "productIds" text NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer
);


ALTER TABLE public.product_comparison OWNER TO postgres;

--
-- Name: product_comparison_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_comparison_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_comparison_id_seq OWNER TO postgres;

--
-- Name: product_comparison_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_comparison_id_seq OWNED BY public.product_comparison.id;


--
-- Name: product_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_image (
    id integer NOT NULL,
    url character varying(500) NOT NULL,
    "altText" character varying(200),
    "position" integer DEFAULT 0 NOT NULL,
    "isMain" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    type character varying(50),
    width integer,
    height integer,
    "fileSize" integer,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer,
    "variantId" integer
);


ALTER TABLE public.product_image OWNER TO postgres;

--
-- Name: product_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_image_id_seq OWNER TO postgres;

--
-- Name: product_image_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_image_id_seq OWNED BY public.product_image.id;


--
-- Name: product_review; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_review (
    id integer NOT NULL,
    rating integer NOT NULL,
    title character varying(200) NOT NULL,
    comment text NOT NULL,
    status public.product_review_status_enum DEFAULT 'pending'::public.product_review_status_enum NOT NULL,
    "isVerifiedPurchase" boolean DEFAULT false NOT NULL,
    "helpfulCount" integer DEFAULT 0 NOT NULL,
    "notHelpfulCount" integer DEFAULT 0 NOT NULL,
    "moderatorNotes" character varying(500),
    "moderatedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer,
    "userId" integer,
    "moderatedById" integer
);


ALTER TABLE public.product_review OWNER TO postgres;

--
-- Name: product_review_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_review_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_review_id_seq OWNER TO postgres;

--
-- Name: product_review_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_review_id_seq OWNED BY public.product_review.id;


--
-- Name: product_variant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_variant (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    sku character varying(50) NOT NULL,
    barcode character varying(100),
    price numeric(10,2) NOT NULL,
    "compareAtPrice" numeric(10,2),
    "costPrice" numeric(10,2),
    stock integer DEFAULT 0 NOT NULL,
    "reservedStock" integer DEFAULT 0 NOT NULL,
    color character varying(50),
    size character varying(50),
    material character varying(50),
    weight numeric(10,3),
    dimensions character varying(50),
    "isActive" boolean DEFAULT true NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer
);


ALTER TABLE public.product_variant OWNER TO postgres;

--
-- Name: product_variant_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.product_variant_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.product_variant_id_seq OWNER TO postgres;

--
-- Name: product_variant_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.product_variant_id_seq OWNED BY public.product_variant.id;


--
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    price numeric(10,2) NOT NULL,
    "costPrice" numeric(10,2),
    description text NOT NULL,
    image character varying(500),
    "imageUrl" character varying(500),
    category character varying(100) DEFAULT 'general'::character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    sku character varying(50),
    barcode character varying(100),
    stock integer DEFAULT 0 NOT NULL,
    "reservedStock" integer DEFAULT 0 NOT NULL,
    "minStockLevel" integer DEFAULT 5 NOT NULL,
    "maxStockLevel" integer DEFAULT 100 NOT NULL,
    "reorderPoint" integer DEFAULT 20 NOT NULL,
    "reorderQuantity" integer DEFAULT 50 NOT NULL,
    "expirationDate" timestamp without time zone,
    "trackExpiration" boolean DEFAULT false NOT NULL,
    "autoRestock" boolean DEFAULT false NOT NULL,
    "lowStockAlert" boolean DEFAULT false NOT NULL,
    "lastRestockDate" timestamp without time zone,
    "lastSoldDate" timestamp without time zone,
    "totalSold" integer DEFAULT 0 NOT NULL,
    supplier character varying(100),
    "supplierSku" character varying(50),
    "supplierPrice" numeric(10,2),
    "leadTimeDays" integer DEFAULT 0 NOT NULL,
    location character varying(200),
    batch character varying(100),
    unit character varying DEFAULT 'kg'::character varying NOT NULL,
    weight numeric(10,3) DEFAULT '1'::numeric NOT NULL,
    size character varying(50),
    color character varying(50),
    brand character varying(100),
    model character varying(100),
    tags text,
    "relatedProductIds" text,
    "viewCount" integer DEFAULT 0 NOT NULL,
    "reviewCount" integer DEFAULT 0 NOT NULL,
    "averageRating" numeric(3,2) DEFAULT '0'::numeric NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isNew" boolean DEFAULT false NOT NULL,
    "isBestseller" boolean DEFAULT false NOT NULL,
    "launchDate" timestamp without time zone,
    specifications text,
    "careInstructions" text,
    "shippingInfo" text,
    "returnPolicy" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: purchase_order; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order (
    id integer NOT NULL,
    "orderNumber" character varying NOT NULL,
    status public.purchase_order_status_enum DEFAULT 'draft'::public.purchase_order_status_enum NOT NULL,
    "totalAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "taxAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "shippingAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "discountAmount" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    "expectedDeliveryDate" timestamp without time zone,
    "actualDeliveryDate" timestamp without time zone,
    notes character varying(500),
    "shippingAddress" character varying(200),
    "paymentTerms" character varying(100),
    "approvedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "supplierId" integer,
    "createdById" integer,
    "approvedById" integer
);


ALTER TABLE public.purchase_order OWNER TO postgres;

--
-- Name: purchase_order_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_id_seq OWNER TO postgres;

--
-- Name: purchase_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_id_seq OWNED BY public.purchase_order.id;


--
-- Name: purchase_order_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.purchase_order_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "receivedQuantity" integer DEFAULT 0 NOT NULL,
    "unitPrice" numeric(10,2) NOT NULL,
    "totalPrice" numeric(10,2) NOT NULL,
    "supplierSku" character varying(50),
    batch character varying(100),
    "expirationDate" timestamp without time zone,
    notes character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "purchaseOrderId" integer,
    "productId" integer
);


ALTER TABLE public.purchase_order_item OWNER TO postgres;

--
-- Name: purchase_order_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.purchase_order_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.purchase_order_item_id_seq OWNER TO postgres;

--
-- Name: purchase_order_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.purchase_order_item_id_seq OWNED BY public.purchase_order_item.id;


--
-- Name: recently_viewed; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recently_viewed (
    id integer NOT NULL,
    "viewCount" integer DEFAULT 1 NOT NULL,
    "lastViewedAt" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "productId" integer
);


ALTER TABLE public.recently_viewed OWNER TO postgres;

--
-- Name: recently_viewed_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.recently_viewed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recently_viewed_id_seq OWNER TO postgres;

--
-- Name: recently_viewed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.recently_viewed_id_seq OWNED BY public.recently_viewed.id;


--
-- Name: return; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return (
    id integer NOT NULL,
    "returnNumber" character varying NOT NULL,
    status public.return_status_enum DEFAULT 'requested'::public.return_status_enum NOT NULL,
    reason public.return_reason_enum NOT NULL,
    description text,
    "refundAmount" numeric(10,2) NOT NULL,
    "approvedAt" timestamp without time zone,
    "rejectedAt" timestamp without time zone,
    "rejectionReason" text,
    "receivedAt" timestamp without time zone,
    "processedAt" timestamp without time zone,
    "refundedAt" timestamp without time zone,
    "adminNotes" text,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "orderId" integer,
    "userId" integer,
    "processedById" integer
);


ALTER TABLE public.return OWNER TO postgres;

--
-- Name: return_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_id_seq OWNER TO postgres;

--
-- Name: return_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_id_seq OWNED BY public.return.id;


--
-- Name: return_item; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.return_item (
    id integer NOT NULL,
    quantity integer NOT NULL,
    "refundAmount" numeric(10,2) NOT NULL,
    condition text,
    notes text,
    "returnId" integer,
    "orderItemId" integer
);


ALTER TABLE public.return_item OWNER TO postgres;

--
-- Name: return_item_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.return_item_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.return_item_id_seq OWNER TO postgres;

--
-- Name: return_item_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.return_item_id_seq OWNED BY public.return_item.id;


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    rating integer NOT NULL,
    comment text NOT NULL,
    title character varying(100) NOT NULL,
    "isVerified" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "helpfulVotes" integer DEFAULT 0 NOT NULL,
    "unhelpfulVotes" integer DEFAULT 0 NOT NULL,
    images text,
    "purchaseVerified" boolean,
    "adminResponse" character varying,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer NOT NULL,
    "productId" integer NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- Name: stock_movement; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.stock_movement (
    id integer NOT NULL,
    type public.stock_movement_type_enum NOT NULL,
    reason public.stock_movement_reason_enum NOT NULL,
    quantity integer NOT NULL,
    "previousStock" integer NOT NULL,
    "newStock" integer NOT NULL,
    "unitCost" numeric(10,2),
    "totalCost" numeric(10,2),
    batch character varying(100),
    "expirationDate" timestamp without time zone,
    location character varying(200),
    notes character varying(500),
    "referenceNumber" character varying(100),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer,
    "createdById" integer
);


ALTER TABLE public.stock_movement OWNER TO postgres;

--
-- Name: stock_movement_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.stock_movement_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.stock_movement_id_seq OWNER TO postgres;

--
-- Name: stock_movement_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.stock_movement_id_seq OWNED BY public.stock_movement.id;


--
-- Name: supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    code character varying(50) NOT NULL,
    "contactPerson" character varying(100),
    email character varying(100),
    phone character varying(20),
    address character varying(500),
    city character varying(100),
    country character varying(100),
    "postalCode" character varying(20),
    "taxId" character varying(50),
    website character varying(100),
    "paymentTerms" character varying DEFAULT 'net30'::character varying NOT NULL,
    "creditLimit" integer DEFAULT 0 NOT NULL,
    rating integer DEFAULT 5 NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastOrderDate" timestamp without time zone,
    "totalOrders" integer DEFAULT 0 NOT NULL,
    "totalSpent" numeric(15,2) DEFAULT '0'::numeric NOT NULL,
    notes character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.supplier OWNER TO postgres;

--
-- Name: supplier_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_id_seq OWNER TO postgres;

--
-- Name: supplier_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_id_seq OWNED BY public.supplier.id;


--
-- Name: supplier_product; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier_product (
    id integer NOT NULL,
    "supplierSku" character varying(50),
    "supplierPrice" numeric(10,2) NOT NULL,
    "minimumOrderQuantity" integer DEFAULT 1 NOT NULL,
    "leadTimeDays" integer DEFAULT 7 NOT NULL,
    "isPreferred" boolean DEFAULT true NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "lastOrderDate" timestamp without time zone,
    "lastOrderPrice" numeric(10,2),
    "totalOrdered" integer DEFAULT 0 NOT NULL,
    notes character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "productId" integer,
    "supplierId" integer
);


ALTER TABLE public.supplier_product OWNER TO postgres;

--
-- Name: supplier_product_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.supplier_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.supplier_product_id_seq OWNER TO postgres;

--
-- Name: supplier_product_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.supplier_product_id_seq OWNED BY public.supplier_product.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    password character varying NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    "refreshToken" character varying,
    "passwordResetToken" character varying,
    "avatarUrl" character varying,
    "loyaltyPoints" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    phone character varying,
    "birthDate" character varying,
    gender character varying,
    bio text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: wishlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wishlist (
    id integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    notes character varying(500),
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" integer,
    "productId" integer,
    "variantId" integer
);


ALTER TABLE public.wishlist OWNER TO postgres;

--
-- Name: wishlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wishlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wishlist_id_seq OWNER TO postgres;

--
-- Name: wishlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wishlist_id_seq OWNED BY public.wishlist.id;


--
-- Name: analytics_events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events ALTER COLUMN id SET DEFAULT nextval('public.analytics_events_id_seq'::regclass);


--
-- Name: cart_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item ALTER COLUMN id SET DEFAULT nextval('public.cart_item_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: inventory_alert id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_alert ALTER COLUMN id SET DEFAULT nextval('public.inventory_alert_id_seq'::regclass);


--
-- Name: loyalty_programs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs ALTER COLUMN id SET DEFAULT nextval('public.loyalty_programs_id_seq'::regclass);


--
-- Name: loyalty_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions ALTER COLUMN id SET DEFAULT nextval('public.loyalty_transactions_id_seq'::regclass);


--
-- Name: order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order" ALTER COLUMN id SET DEFAULT nextval('public.order_id_seq'::regclass);


--
-- Name: order_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item ALTER COLUMN id SET DEFAULT nextval('public.order_item_id_seq'::regclass);


--
-- Name: order_status_history id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history ALTER COLUMN id SET DEFAULT nextval('public.order_status_history_id_seq'::regclass);


--
-- Name: product_comparison id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_comparison ALTER COLUMN id SET DEFAULT nextval('public.product_comparison_id_seq'::regclass);


--
-- Name: product_image id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image ALTER COLUMN id SET DEFAULT nextval('public.product_image_id_seq'::regclass);


--
-- Name: product_review id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review ALTER COLUMN id SET DEFAULT nextval('public.product_review_id_seq'::regclass);


--
-- Name: product_variant id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant ALTER COLUMN id SET DEFAULT nextval('public.product_variant_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Name: purchase_order id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_id_seq'::regclass);


--
-- Name: purchase_order_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item ALTER COLUMN id SET DEFAULT nextval('public.purchase_order_item_id_seq'::regclass);


--
-- Name: recently_viewed id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed ALTER COLUMN id SET DEFAULT nextval('public.recently_viewed_id_seq'::regclass);


--
-- Name: return id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return ALTER COLUMN id SET DEFAULT nextval('public.return_id_seq'::regclass);


--
-- Name: return_item id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item ALTER COLUMN id SET DEFAULT nextval('public.return_item_id_seq'::regclass);


--
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- Name: stock_movement id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movement ALTER COLUMN id SET DEFAULT nextval('public.stock_movement_id_seq'::regclass);


--
-- Name: supplier id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier ALTER COLUMN id SET DEFAULT nextval('public.supplier_id_seq'::regclass);


--
-- Name: supplier_product id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_product ALTER COLUMN id SET DEFAULT nextval('public.supplier_product_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Name: wishlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist ALTER COLUMN id SET DEFAULT nextval('public.wishlist_id_seq'::regclass);


--
-- Data for Name: analytics_events; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.analytics_events (id, "eventType", "userId", "sessionId", "productId", "categoryId", "orderId", "eventData", "userAgent", "ipAddress", referrer, page, value, currency, "createdAt") FROM stdin;
1	purchase	2	\N	\N	\N	1	\N	\N	\N	\N	\N	155.96	USD	2026-04-04 22:50:56.483036
2	purchase	1	\N	\N	\N	2	\N	\N	\N	\N	\N	67.48	USD	2026-04-04 22:50:56.534414
3	page_view	1	session_8	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-03 11:09:32.577
4	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-03-30 20:05:53.22
5	page_view	1	session_1	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-04-04 14:31:59.125
6	page_view	1	session_8	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 10:47:15.832
7	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-03 09:04:23.074
8	page_view	1	session_0	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-04 02:26:11.583
9	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-03 19:13:07.731
10	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-03-29 19:52:01.143
11	page_view	1	session_5	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-04 15:49:25.387
12	page_view	1	session_8	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-03-31 00:34:31.046
13	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-04 08:34:22.845
14	page_view	1	session_7	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-04 15:12:36.675
15	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-03 16:34:36.521
16	page_view	1	session_5	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-30 00:08:37.881
17	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-01 19:05:28.749
18	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-04-03 09:23:12.814
19	page_view	1	session_1	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-03 07:18:56.851
20	page_view	1	session_5	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 09:26:24.962
21	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-30 22:02:10.072
22	page_view	1	session_4	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 13:25:06.978
23	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-03-29 07:38:53.23
24	page_view	1	session_0	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-04 13:34:23.222
25	page_view	1	session_4	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-03-30 04:10:23.041
26	page_view	1	session_9	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-30 13:46:09.717
27	page_view	1	session_9	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-01 22:17:53.879
28	page_view	1	session_4	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-03-29 06:08:28.081
29	page_view	1	session_7	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-03 07:49:43.57
30	page_view	1	session_9	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 14:36:59.056
31	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-03-29 21:41:27.829
32	page_view	1	session_9	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-03 19:45:05.683
33	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-04-04 05:52:55.531
34	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-02 00:19:40.652
35	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-29 17:14:20.587
36	page_view	1	session_1	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-03-29 05:07:34.756
37	page_view	1	session_7	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 14:57:21.322
38	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-04-04 18:02:02.936
39	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-02 17:22:56.444
40	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-03-29 04:29:35.734
41	page_view	1	session_5	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-03-30 07:38:05.45
42	page_view	1	session_0	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-01 20:04:38.187
43	page_view	1	session_2	\N	\N	\N	\N	\N	\N	\N	/checkout	\N	\N	2026-04-01 21:39:54.074
44	page_view	1	session_5	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-29 08:05:28.264
45	page_view	1	session_0	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-29 19:30:35.919
46	page_view	1	session_1	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-04 07:13:07.61
47	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-03-29 18:40:29.71
48	page_view	1	session_6	\N	\N	\N	\N	\N	\N	\N	/	\N	\N	2026-04-01 05:41:46.967
49	page_view	1	session_4	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-04 09:49:23.168
50	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-04-02 03:43:33.417
51	page_view	1	session_3	\N	\N	\N	\N	\N	\N	\N	/cart	\N	\N	2026-03-29 23:27:21.825
52	page_view	1	session_1	\N	\N	\N	\N	\N	\N	\N	/products	\N	\N	2026-04-02 21:26:10.742
53	product_view	1	session_0	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-03-31 15:20:19.244
54	product_view	1	session_1	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-04 12:25:19.472
55	product_view	1	session_2	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-03-30 22:33:04.466
56	product_view	1	session_3	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-01 02:44:12.865
57	product_view	1	session_4	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-03-29 01:44:07.551
58	product_view	1	session_5	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-03 00:08:44.696
59	product_view	1	session_6	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-03-29 14:32:18.684
60	product_view	1	session_7	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-01 02:41:02.889
61	product_view	1	session_8	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-01 09:15:40.61
62	product_view	1	session_9	1	\N	\N	\N	\N	\N	\N	/product/1	\N	\N	2026-04-02 09:11:37.93
63	product_view	1	session_0	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-03 06:38:48.236
64	product_view	1	session_1	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-02 08:01:43.303
65	product_view	1	session_2	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-02 19:05:02.498
66	product_view	1	session_3	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-04 13:07:35.485
67	product_view	1	session_4	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-01 00:22:43.881
68	product_view	1	session_5	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-03-30 23:12:41.246
69	product_view	1	session_6	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-04 13:05:57.646
70	product_view	1	session_7	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-03 01:57:05.265
71	product_view	1	session_8	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-03-31 09:01:31.773
72	product_view	1	session_9	2	\N	\N	\N	\N	\N	\N	/product/2	\N	\N	2026-04-02 05:34:38.641
73	product_view	1	session_0	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-03-30 21:27:45.214
74	product_view	1	session_1	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-04 22:03:20.948
75	product_view	1	session_2	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-03 14:19:07.333
76	product_view	1	session_3	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-01 12:02:23.859
77	product_view	1	session_4	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-01 21:52:54.089
78	product_view	1	session_5	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-02 00:35:09.644
79	product_view	1	session_6	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-03-31 11:46:06.806
80	product_view	1	session_7	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-04 21:49:30.819
81	product_view	1	session_8	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-01 20:06:26.753
82	product_view	1	session_9	3	\N	\N	\N	\N	\N	\N	/product/3	\N	\N	2026-04-01 10:43:23.601
83	product_view	1	session_0	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-03-29 12:43:23.613
84	product_view	1	session_1	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-02 12:54:47.288
85	product_view	1	session_2	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-03-30 14:23:33.905
86	product_view	1	session_3	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-03-29 00:27:46.702
87	product_view	1	session_4	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-02 07:49:40.498
88	product_view	1	session_5	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-03 18:37:01.956
89	product_view	1	session_6	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-01 16:50:30.027
90	product_view	1	session_7	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-02 03:35:25.065
91	product_view	1	session_8	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-03-31 23:52:49.655
92	product_view	1	session_9	4	\N	\N	\N	\N	\N	\N	/product/4	\N	\N	2026-04-03 07:38:54.718
93	product_view	1	session_0	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-03-30 23:10:14.82
94	product_view	1	session_1	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-03 10:15:58.553
95	product_view	1	session_2	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-03-31 20:42:57.682
96	product_view	1	session_3	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-03-31 19:28:08.361
97	product_view	1	session_4	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-03 02:03:39.978
98	product_view	1	session_5	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-03-31 20:31:46.221
99	product_view	1	session_6	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-01 11:53:48.982
100	product_view	1	session_7	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-02 04:08:43.648
101	product_view	1	session_8	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-04 10:00:06.507
102	product_view	1	session_9	5	\N	\N	\N	\N	\N	\N	/product/5	\N	\N	2026-04-03 23:30:59.911
103	add_to_cart	1	session_9	1	\N	\N	\N	\N	\N	\N	/cart	81.31	\N	2026-03-31 18:59:22.519
104	add_to_cart	1	session_7	2	\N	\N	\N	\N	\N	\N	/cart	34.37	\N	2026-03-29 02:38:31.827
105	add_to_cart	1	session_3	3	\N	\N	\N	\N	\N	\N	/cart	86.74	\N	2026-04-04 01:13:04.88
106	add_to_cart	1	session_9	4	\N	\N	\N	\N	\N	\N	/cart	77.56	\N	2026-04-04 11:33:22.871
107	add_to_cart	1	session_4	5	\N	\N	\N	\N	\N	\N	/cart	21.37	\N	2026-03-29 07:23:39.647
108	add_to_cart	1	session_4	1	\N	\N	\N	\N	\N	\N	/cart	86.14	\N	2026-04-04 19:32:41.558
109	add_to_cart	1	session_8	2	\N	\N	\N	\N	\N	\N	/cart	20.92	\N	2026-03-30 13:37:43.252
110	add_to_cart	1	session_4	3	\N	\N	\N	\N	\N	\N	/cart	50.92	\N	2026-03-30 19:01:19.318
111	add_to_cart	1	session_9	4	\N	\N	\N	\N	\N	\N	/cart	88.84	\N	2026-04-02 23:56:10.471
112	add_to_cart	1	session_7	5	\N	\N	\N	\N	\N	\N	/cart	27.78	\N	2026-04-02 06:55:26.129
113	add_to_cart	1	session_0	1	\N	\N	\N	\N	\N	\N	/cart	56.15	\N	2026-03-31 03:20:25.501
114	add_to_cart	1	session_7	2	\N	\N	\N	\N	\N	\N	/cart	41.38	\N	2026-04-03 03:42:33.602
115	add_to_cart	1	session_6	3	\N	\N	\N	\N	\N	\N	/cart	5.43	\N	2026-04-03 19:40:59.014
116	add_to_cart	1	session_6	4	\N	\N	\N	\N	\N	\N	/cart	36.11	\N	2026-03-31 00:13:12.155
117	add_to_cart	1	session_5	5	\N	\N	\N	\N	\N	\N	/cart	16.22	\N	2026-03-30 18:31:13.861
118	purchase	1	session_0	\N	\N	\N	\N	\N	\N	\N	/checkout	304.76	\N	2026-03-29 12:26:41.689
119	purchase	1	session_1	\N	\N	\N	\N	\N	\N	\N	/checkout	478.08	\N	2026-03-30 13:44:35.305
120	purchase	1	session_2	\N	\N	\N	\N	\N	\N	\N	/checkout	68.91	\N	2026-03-29 18:54:57.322
121	purchase	1	session_3	\N	\N	\N	\N	\N	\N	\N	/checkout	533.90	\N	2026-04-04 07:20:34.615
122	purchase	1	session_4	\N	\N	\N	\N	\N	\N	\N	/checkout	538.57	\N	2026-03-29 20:04:41.457
123	purchase	1	session_5	\N	\N	\N	\N	\N	\N	\N	/checkout	134.03	\N	2026-04-04 18:47:01.977
124	purchase	1	session_6	\N	\N	\N	\N	\N	\N	\N	/checkout	250.48	\N	2026-04-01 04:59:02.398
125	purchase	1	session_7	\N	\N	\N	\N	\N	\N	\N	/checkout	191.68	\N	2026-04-01 14:51:07.798
\.


--
-- Data for Name: cart_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_item (id, quantity, "userId", "productId") FROM stdin;
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.coupons (id, code, name, description, type, value, "minimumAmount", "maximumDiscount", "usageLimit", "usageCount", "usagePerUser", "validFrom", "validUntil", status, "applicableCategories", "applicableProducts", "isFirstTimeUser", "isPublic", "createdAt", "updatedAt") FROM stdin;
1	BIENVENIDO10	Bienvenida 10%	10% de descuento en tu primera compra	percentage	10.00	50.00	50.00	100	0	1	2026-04-05 18:45:36.151516	2026-05-05 18:45:36.151516	active	\N	\N	f	t	2026-04-05 18:45:36.151516	2026-04-05 18:45:36.151516
2	DESCUENTO20	Oferta 20%	20% de descuento en compras mayores a 100	percentage	20.00	100.00	100.00	50	0	1	2026-04-05 18:45:36.151516	2026-04-20 18:45:36.151516	active	\N	\N	f	t	2026-04-05 18:45:36.151516	2026-04-05 18:45:36.151516
3	ENVIOGRATIS	Envio Gratis	Envio gratuito en compras mayores a 75	free_shipping	0.00	75.00	25.00	200	0	1	2026-04-05 18:45:36.151516	2026-06-04 18:45:36.151516	active	\N	\N	f	t	2026-04-05 18:45:36.151516	2026-04-05 18:45:36.151516
4	OFERTA50	50 soles de descuento	50 soles de descuento en compras mayores a 200	fixed_amount	50.00	200.00	50.00	25	0	1	2026-04-05 18:45:36.151516	2026-04-12 18:45:36.151516	active	\N	\N	f	t	2026-04-05 18:45:36.151516	2026-04-05 18:45:36.151516
5	LOYALTY15	Cliente VIP 15%	15% de descuento para miembros loyalty	percentage	15.00	0.00	100.00	500	0	1	2026-04-05 18:45:36.151516	2026-07-04 18:45:36.151516	active	\N	\N	f	f	2026-04-05 18:45:36.151516	2026-04-05 18:45:36.151516
\.


--
-- Data for Name: inventory_alert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_alert (id, type, status, priority, message, threshold, "currentValue", "expirationDate", "emailSent", "emailSentAt", "acknowledgedAt", "acknowledgedNotes", "resolvedAt", "resolutionNotes", "createdAt", "updatedAt", "productId", "acknowledgedById", "resolvedById") FROM stdin;
1	out_of_stock	active	critical	Product Camiseta B├ísica Blanca is out of stock	0	0	\N	t	2026-04-05 00:00:00.07	\N	\N	\N	\N	2026-04-05 00:00:00.065312	2026-04-05 00:00:00.07341	1	\N	\N
2	out_of_stock	active	critical	Product Vestido Elegante Negro is out of stock	0	0	\N	t	2026-04-05 00:00:00.077	\N	\N	\N	\N	2026-04-05 00:00:00.077026	2026-04-05 00:00:00.079261	2	\N	\N
3	low_stock	active	high	Stock bajo para Camiseta Basica Blanca	\N	\N	\N	f	\N	\N	\N	\N	\N	2026-04-05 18:46:03.351521	2026-04-05 18:46:03.351521	1	\N	\N
4	low_stock	active	medium	Stock bajo para Vestido Elegante Negro	\N	\N	\N	f	\N	\N	\N	\N	\N	2026-04-05 18:46:03.351521	2026-04-05 18:46:03.351521	2	\N	\N
5	reorder_point	active	low	Punto de reorden alcanzado: Bolso de Cuero	\N	\N	\N	f	\N	\N	\N	\N	\N	2026-04-05 18:46:03.351521	2026-04-05 18:46:03.351521	6	\N	\N
\.


--
-- Data for Name: loyalty_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_programs (id, "userId", "totalPoints", "availablePoints", "currentTier", "tierProgress", "tierAchievedAt", "lastActivityAt", "isActive", "createdAt", "updatedAt", "lifetimeSpent") FROM stdin;
3	2	100	100	bronze	0	\N	2026-04-04 22:50:56.491	t	2026-04-04 22:50:56.489325	2026-04-04 22:50:56.496697	0.00
4	3	100	100	bronze	0	\N	2026-04-04 22:58:53.449	t	2026-04-04 22:58:53.405381	2026-04-04 22:58:53.45625	0.00
1	1	830	830	bronze	0	\N	2026-04-04 22:46:55.796	t	2026-04-04 22:46:55.773445	2026-04-04 23:16:45.979755	0.00
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_transactions (id, "loyaltyProgramId", type, reason, points, "orderAmount", "orderId", description, "referenceId", "expiresAt", "createdAt") FROM stdin;
1	1	earned	signup_bonus	100	\N	\N	Puntos de bienvenida por registrarte	\N	2028-04-04 22:46:55.778	2026-04-04 22:46:55.78176
2	3	earned	signup_bonus	100	\N	\N	Puntos de bienvenida por registrarte	\N	2028-04-04 22:50:56.489	2026-04-04 22:50:56.492535
3	3	earned	purchase	155	155.96	1	Puntos ganados por compra #1	\N	2028-04-04 22:50:56.497	2026-04-04 22:50:56.499995
4	1	earned	purchase	67	67.48	2	Puntos ganados por compra #2	\N	2028-04-04 22:50:56.534	2026-04-04 22:50:56.537346
5	4	earned	signup_bonus	100	\N	\N	Puntos de bienvenida por registrarte	\N	2028-04-04 22:58:53.444	2026-04-04 22:58:53.448587
6	1	earned	signup_bonus	100	\N	\N	Bienvenida	\N	\N	2026-04-04 13:50:40.687
7	1	earned	purchase	250	\N	\N	Compra #1	\N	\N	2026-03-31 21:17:56.969
8	1	earned	purchase	180	\N	\N	Compra #2	\N	\N	2026-03-31 03:19:43.972
9	1	earned	purchase	300	\N	\N	Compra #3	\N	\N	2026-04-04 06:27:50.421
10	1	redeemed	redemption	-100	\N	\N	Canje de descuento	\N	\N	2026-03-29 06:21:47.791
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "orderNumber", status, total, "shippingCost", tax, "trackingCode", "shippingCarrier", "shippingAddress", "billingAddress", notes, "estimatedDeliveryDate", "actualDeliveryDate", "cancelledAt", "cancellationReason", "canBeCancelled", "canBeReturned", "returnRequestedAt", "refundedAt", "refundAmount", "refundReason", "discountAmount", "createdAt", "updatedAt", "userId", "couponId") FROM stdin;
1	ORD-20260404-0001	pending	155.96	5.99	0.00	\N	\N	123 Main St, City, Country	123 Main St, City, Country	\N	\N	\N	\N	\N	t	f	\N	\N	\N	\N	0.00	2026-04-04 22:50:56.472971	2026-04-04 22:50:56.472971	2	\N
2	ORD-20260404-0002	pending	67.48	7.49	0.00	\N	\N	456 Elm St, City, Country	456 Elm St, City, Country	\N	\N	\N	\N	\N	t	f	\N	\N	\N	\N	0.00	2026-04-04 22:50:56.528662	2026-04-04 22:50:56.528662	1	\N
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, quantity, price, "productId", "orderId") FROM stdin;
1	2	29.99	1	1
2	1	89.99	2	1
3	1	59.99	3	2
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status_history (id, "fromStatus", "toStatus", reason, notes, "emailSent", "trackingCode", "createdAt", "orderId", "changedById") FROM stdin;
1	pending	pending	Order created	\N	f	\N	2026-04-04 22:50:56.480891	1	2
2	pending	pending	Order created	\N	f	\N	2026-04-04 22:50:56.533056	2	1
\.


--
-- Data for Name: product_comparison; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_comparison (id, name, "productIds", "isActive", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: product_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_image (id, url, "altText", "position", "isMain", "isActive", type, width, height, "fileSize", "createdAt", "updatedAt", "productId", "variantId") FROM stdin;
\.


--
-- Data for Name: product_review; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_review (id, rating, title, comment, status, "isVerifiedPurchase", "helpfulCount", "notHelpfulCount", "moderatorNotes", "moderatedAt", "createdAt", "updatedAt", "productId", "userId", "moderatedById") FROM stdin;
\.


--
-- Data for Name: product_variant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_variant (id, name, sku, barcode, price, "compareAtPrice", "costPrice", stock, "reservedStock", color, size, material, weight, dimensions, "isActive", "isDefault", "position", "createdAt", "updatedAt", "productId") FROM stdin;
1	Camiseta Blanca S	CAM-BLA-S	\N	0.00	\N	\N	10	0	Blanco	S	\N	\N	\N	t	t	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	1
2	Camiseta Blanca M	CAM-BLA-M	\N	0.00	\N	\N	15	0	Blanco	M	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	1
3	Camiseta Blanca L	CAM-BLA-L	\N	10.00	\N	\N	10	0	Blanco	L	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	1
4	Camiseta Blanca XL	CAM-BLA-XL	\N	10.00	\N	\N	5	0	Blanco	XL	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	1
5	Vestido Negro S	VES-NEG-S	\N	0.00	\N	\N	5	0	Negro	S	\N	\N	\N	t	t	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	2
6	Vestido Negro M	VES-NEG-M	\N	0.00	\N	\N	8	0	Negro	M	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	2
7	Vestido Negro L	VES-NEG-L	\N	15.00	\N	\N	7	0	Negro	L	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	2
8	Jeans Azul 30	JEA-AZUL-30	\N	0.00	\N	\N	10	0	Azul	30	\N	\N	\N	t	t	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	3
9	Jeans Azul 32	JEA-AZUL-32	\N	0.00	\N	\N	12	0	Azul	32	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	3
10	Jeans Azul 34	JEA-AZUL-34	\N	5.00	\N	\N	8	0	Azul	34	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	3
11	Zapatillas 38	ZAP-BLA-38	\N	0.00	\N	\N	10	0	Blanco	38	\N	\N	\N	t	t	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	5
12	Zapatillas 39	ZAP-BLA-39	\N	0.00	\N	\N	12	0	Blanco	39	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	5
13	Zapatillas 40	ZAP-BLA-40	\N	0.00	\N	\N	10	0	Blanco	40	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	5
14	Zapatillas 41	ZAP-BLA-41	\N	5.00	\N	\N	8	0	Blanco	41	\N	\N	\N	t	f	0	2026-04-05 18:45:56.883449	2026-04-05 18:45:56.883449	5
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, "costPrice", description, image, "imageUrl", category, "isActive", sku, barcode, stock, "reservedStock", "minStockLevel", "maxStockLevel", "reorderPoint", "reorderQuantity", "expirationDate", "trackExpiration", "autoRestock", "lowStockAlert", "lastRestockDate", "lastSoldDate", "totalSold", supplier, "supplierSku", "supplierPrice", "leadTimeDays", location, batch, unit, weight, size, color, brand, model, tags, "relatedProductIds", "viewCount", "reviewCount", "averageRating", "isFeatured", "isNew", "isBestseller", "launchDate", specifications, "careInstructions", "shippingInfo", "returnPolicy", "createdAt", "updatedAt") FROM stdin;
3	Jeans Cl├ísicos	59.99	\N	Jeans de corte cl├ísico, c├│modos y duraderos	\N	https://via.placeholder.com/400x400/3b82f6/ffffff?text=Jeans	hombre	t	\N	\N	30	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.67897	2025-08-16 06:16:19.67897
4	Blusa Floral	45.99	\N	Blusa con estampado floral, perfecta para la primavera	\N	https://via.placeholder.com/400x400/f59e0b/ffffff?text=Blusa	mujer	t	\N	\N	20	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.684238	2025-08-16 06:16:19.684238
5	Zapatillas Deportivas	79.99	\N	Zapatillas c├│modas para ejercicio y uso casual	\N	https://via.placeholder.com/400x400/10b981/ffffff?text=Zapatillas	zapatos	t	\N	\N	40	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.690097	2025-08-16 06:16:19.690097
6	Bolso de Cuero	129.99	\N	Bolso elegante de cuero genuino con m├║ltiples compartimentos	\N	https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Bolso	accesorios	t	\N	\N	15	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.695424	2025-08-16 06:16:19.695424
7	Chaqueta Denim	69.99	\N	Chaqueta de mezclilla cl├ísica, perfecta para cualquier temporada	\N	https://via.placeholder.com/400x400/6366f1/ffffff?text=Chaqueta	hombre	t	\N	\N	35	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.70061	2025-08-16 06:16:19.70061
8	Falda Midi	39.99	\N	Falda midi elegante y vers├ítil para oficina o casual	\N	https://via.placeholder.com/400x400/ec4899/ffffff?text=Falda	mujer	t	\N	\N	28	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.706054	2025-08-16 06:16:19.706054
1	Camiseta B├ísica Blanca	29.99	\N	Camiseta 100% algod├│n, c├│moda y vers├ítil para uso diario	\N	https://via.placeholder.com/400x400/6366f1/ffffff?text=Camiseta	hombre	t	\N	\N	0	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.654548	2026-04-04 22:50:56.562994
2	Vestido Elegante Negro	89.99	\N	Vestido perfecto para ocasiones especiales y eventos formales	\N	https://via.placeholder.com/400x400/ec4899/ffffff?text=Vestido	mujer	t	\N	\N	0	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.672574	2026-04-04 22:50:56.571782
9	Sudadera con Capucha	49.99	\N	Sudadera comoda de algodon para el invierno	https://via.placeholder.com/400x400/6366f1/ffffff?text=Sudadera	\N	hombre	t	\N	\N	25	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
10	Calcetines Pack x3	12.99	\N	Pack de calcetines de algodon	https://via.placeholder.com/400x400/10b981/ffffff?text=Calcetines	\N	accesorios	t	\N	\N	100	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
11	Gorra Deportiva	19.99	\N	Gorra ligera para deporte	https://via.placeholder.com/400x400/f59e0b/ffffff?text=Gorra	\N	accesorios	t	\N	\N	60	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
12	Abrigo Lana	149.99	\N	Abrigo de lana de alta calidad	https://via.placeholder.com/400x400/ec4899/ffffff?text=Abrigo	\N	mujer	t	\N	\N	15	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
13	Polo Classic	34.99	\N	Polo clasico de manga corta	https://via.placeholder.com/400x400/3b82f6/ffffff?text=Polo	\N	hombre	t	\N	\N	45	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
14	Bufanda de Seda	29.99	\N	Bufanda elegante de seda	https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Bufanda	\N	accesorios	t	\N	\N	35	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
15	Cinturon de Cuero	39.99	\N	Cinturon clasico de cuero	https://via.placeholder.com/400x400/6366f1/ffffff?text=Cinturon	\N	accesorios	t	\N	\N	40	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
16	Parka Invierno	189.99	\N	Parka resistente al frio	https://via.placeholder.com/400x400/1e293b/ffffff?text=Parka	\N	hombre	t	\N	\N	20	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2026-04-04 23:24:37.218933	2026-04-04 23:24:37.218933
\.


--
-- Data for Name: purchase_order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order (id, "orderNumber", status, "totalAmount", "taxAmount", "shippingAmount", "discountAmount", "expectedDeliveryDate", "actualDeliveryDate", notes, "shippingAddress", "paymentTerms", "approvedAt", "createdAt", "updatedAt", "supplierId", "createdById", "approvedById") FROM stdin;
\.


--
-- Data for Name: purchase_order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.purchase_order_item (id, quantity, "receivedQuantity", "unitPrice", "totalPrice", "supplierSku", batch, "expirationDate", notes, "createdAt", "updatedAt", "purchaseOrderId", "productId") FROM stdin;
\.


--
-- Data for Name: recently_viewed; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recently_viewed (id, "viewCount", "lastViewedAt", "createdAt", "updatedAt", "userId", "productId") FROM stdin;
\.


--
-- Data for Name: return; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return (id, "returnNumber", status, reason, description, "refundAmount", "approvedAt", "rejectedAt", "rejectionReason", "receivedAt", "processedAt", "refundedAt", "adminNotes", "createdAt", "updatedAt", "orderId", "userId", "processedById") FROM stdin;
\.


--
-- Data for Name: return_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.return_item (id, quantity, "refundAmount", condition, notes, "returnId", "orderItemId") FROM stdin;
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, rating, comment, title, "isVerified", "isActive", "helpfulVotes", "unhelpfulVotes", images, "purchaseVerified", "adminResponse", "createdAt", "updatedAt", "userId", "productId") FROM stdin;
1	5	Excelente producto, muy recomendado.	Gran calidad	t	t	0	0	\N	f	\N	2026-04-04 22:50:56.544	2026-04-04 22:50:56.555288	2	1
2	4	Buena calidad, pero el envío fue lento.	Satisfecho	t	t	0	0	\N	f	\N	2026-04-04 22:50:56.544	2026-04-04 22:50:56.567427	1	2
3	5	Excelente calidad, muy comoda para uso diario.	Me encanto	t	t	10	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	1	1
4	4	Buena relacion calidad-precio.	Recomendable	t	t	5	1	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	2	2
5	5	Perfecta para ocasiones especiales.	Mi vestido favorito	t	t	15	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	1	2
6	3	Calidad aceptable, pero el color es diferente al de la foto.	Esta bien	t	t	2	2	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	3	3
7	4	Muy comodas y ligeras.	Zapatillas genial	t	t	8	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	2	5
8	5	El mejor bolso que he tenido.	Excelente calidad	t	t	20	1	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	1	6
9	4	Gran relacion calidad-precio.	Buena compra	t	t	6	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	3	7
10	5	Muy calida y elegante.	Me encanta	t	t	12	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	2	4
11	3	Esta bien pero pequena.	Normal	t	t	3	1	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	1	8
12	4	Perfecta para el gym.	Muy practica	t	t	7	0	\N	t	\N	2026-04-04 23:24:43.698549	2026-04-04 23:24:43.698549	2	9
\.


--
-- Data for Name: stock_movement; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.stock_movement (id, type, reason, quantity, "previousStock", "newStock", "unitCost", "totalCost", batch, "expirationDate", location, notes, "referenceNumber", "createdAt", "productId", "createdById") FROM stdin;
\.


--
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier (id, name, code, "contactPerson", email, phone, address, city, country, "postalCode", "taxId", website, "paymentTerms", "creditLimit", rating, "isActive", "lastOrderDate", "totalOrders", "totalSpent", notes, "createdAt", "updatedAt") FROM stdin;
1	ModaTextil SA	MOD001	Juan Perez	juan@modatextil.com	+51 987 654 321	Av. Textile 123	Lima	Peru	\N	\N	\N	net30	0	5	t	\N	0	0.00	\N	2026-04-05 18:45:47.002528	2026-04-05 18:45:47.002528
2	CalzadoExpress	CAL001	Maria Lopez	maria@calzadoexpress.com	+51 912 345 678	Av. Shoes 456	Lima	Peru	\N	\N	\N	net30	0	5	t	\N	0	0.00	\N	2026-04-05 18:45:47.002528	2026-04-05 18:45:47.002528
3	AccesoriosPremium	ACC001	Carlos Gomez	carlos@accesoriospremium.com	+51 956 789 123	Av. Access 789	Lima	Peru	\N	\N	\N	net30	0	5	t	\N	0	0.00	\N	2026-04-05 18:45:47.002528	2026-04-05 18:45:47.002528
4	LanaNatural	LAN001	Ana Torres	ana@lananatural.com	+51 978 456 789	Av. Wool 321	Lima	Peru	\N	\N	\N	net30	0	5	t	\N	0	0.00	\N	2026-04-05 18:45:47.002528	2026-04-05 18:45:47.002528
\.


--
-- Data for Name: supplier_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_product (id, "supplierSku", "supplierPrice", "minimumOrderQuantity", "leadTimeDays", "isPreferred", "isActive", "lastOrderDate", "lastOrderPrice", "totalOrdered", notes, "createdAt", "updatedAt", "productId", "supplierId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, "firstName", "lastName", password, role, "refreshToken", "passwordResetToken", "avatarUrl", "loyaltyPoints", "createdAt", "updatedAt", phone, "birthDate", gender, bio) FROM stdin;
2	testuser	user@example.com	Test	User	$2b$10$gmczFbpVG69CmHq2xYavuO.6kOUaTNZWxf3bictXS/G6NUJsQmfee	user	\N	\N	\N	0	2025-08-16 03:43:24.782474	2025-08-16 03:43:24.782474	\N	\N	\N	\N
3	prueba	prueba@gmail.com	prueba	prueba	$2b$10$Xde0pRyVm.Ksm6rEMc2tE.jlFh83b6wUUICCLi.85FCMc2/pLPs1O	customer	\N	\N	\N	0	2025-08-16 04:05:36.873148	2025-08-16 04:08:13.746791	\N	\N	\N	\N
1	admin	admin@example.com	Admin	User	$2b$10$tmBgu3YSR3GY5C5aEXVt4.Mna8jjVsvtSlCbr5bQj9U0/Xis6xCQu	admin	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzc1MzYwOTExLCJleHAiOjE3NzU5NjU3MTF9.C82AVBXF6M6gqh4f7dCHzzzptZcZ6SWGU5GznhEUhSw	\N	\N	0	2025-08-16 03:43:24.782474	2026-04-04 22:48:31.621688	\N	\N	\N	\N
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (id, "isActive", notes, "createdAt", "updatedAt", "userId", "productId", "variantId") FROM stdin;
1	t	\N	2026-04-04 22:50:56.576149	2026-04-04 22:50:56.576149	2	3	\N
2	t	\N	2026-04-04 22:50:56.580335	2026-04-04 22:50:56.580335	1	4	\N
\.


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 125, true);


--
-- Name: cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_item_id_seq', 1, false);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 5, true);


--
-- Name: inventory_alert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_alert_id_seq', 5, true);


--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_programs_id_seq', 4, true);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_transactions_id_seq', 10, true);


--
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_id_seq', 2, true);


--
-- Name: order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_item_id_seq', 3, true);


--
-- Name: order_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_history_id_seq', 2, true);


--
-- Name: product_comparison_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_comparison_id_seq', 1, false);


--
-- Name: product_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_image_id_seq', 1, false);


--
-- Name: product_review_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_review_id_seq', 1, false);


--
-- Name: product_variant_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.product_variant_id_seq', 14, true);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 16, true);


--
-- Name: purchase_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_id_seq', 1, false);


--
-- Name: purchase_order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.purchase_order_item_id_seq', 1, false);


--
-- Name: recently_viewed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.recently_viewed_id_seq', 1, false);


--
-- Name: return_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_id_seq', 1, false);


--
-- Name: return_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.return_item_id_seq', 1, false);


--
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 12, true);


--
-- Name: stock_movement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movement_id_seq', 1, false);


--
-- Name: supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_id_seq', 4, true);


--
-- Name: supplier_product_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_product_id_seq', 1, false);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 3, true);


--
-- Name: wishlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wishlist_id_seq', 2, true);


--
-- Name: products PK_0806c755e0aca124e67c0cf6d7d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);


--
-- Name: order PK_1031171c13130102495201e3e20; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);


--
-- Name: supplier_product PK_18c14b1d767aaa922805766e1d7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_product
    ADD CONSTRAINT "PK_18c14b1d767aaa922805766e1d7" PRIMARY KEY (id);


--
-- Name: product_variant PK_1ab69c9935c61f7c70791ae0a9f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "PK_1ab69c9935c61f7c70791ae0a9f" PRIMARY KEY (id);


--
-- Name: reviews PK_231ae565c273ee700b283f15c1d; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "PK_231ae565c273ee700b283f15c1d" PRIMARY KEY (id);


--
-- Name: inventory_alert PK_2968e7603cb1e688d5704bd71d0; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_alert
    ADD CONSTRAINT "PK_2968e7603cb1e688d5704bd71d0" PRIMARY KEY (id);


--
-- Name: supplier PK_2bc0d2cab6276144d2ff98a2828; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT "PK_2bc0d2cab6276144d2ff98a2828" PRIMARY KEY (id);


--
-- Name: analytics_events PK_5d643d67a09b55653e98616f421; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.analytics_events
    ADD CONSTRAINT "PK_5d643d67a09b55653e98616f421" PRIMARY KEY (id);


--
-- Name: wishlist PK_620bff4a240d66c357b5d820eaa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY (id);


--
-- Name: recently_viewed PK_69c131fcd783f4d5a30f6bbcfd3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT "PK_69c131fcd783f4d5a30f6bbcfd3" PRIMARY KEY (id);


--
-- Name: product_review PK_6c00bd3bbee662e1f7a97dbce9a; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT "PK_6c00bd3bbee662e1f7a97dbce9a" PRIMARY KEY (id);


--
-- Name: return_item PK_8107861535dc7f65333a1f1a3de; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT "PK_8107861535dc7f65333a1f1a3de" PRIMARY KEY (id);


--
-- Name: product_comparison PK_812931150bd6607f81306c21e54; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_comparison
    ADD CONSTRAINT "PK_812931150bd6607f81306c21e54" PRIMARY KEY (id);


--
-- Name: loyalty_programs PK_9911f010986d7730cc744f91ff4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT "PK_9911f010986d7730cc744f91ff4" PRIMARY KEY (id);


--
-- Name: product_image PK_99d98a80f57857d51b5f63c8240; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "PK_99d98a80f57857d51b5f63c8240" PRIMARY KEY (id);


--
-- Name: stock_movement PK_9fe1232f916686ae8cf00294749; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movement
    ADD CONSTRAINT "PK_9fe1232f916686ae8cf00294749" PRIMARY KEY (id);


--
-- Name: purchase_order PK_ad3e1c7b862f4043b103a6c8c60; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "PK_ad3e1c7b862f4043b103a6c8c60" PRIMARY KEY (id);


--
-- Name: cart_item PK_bd94725aa84f8cf37632bcde997; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "PK_bd94725aa84f8cf37632bcde997" PRIMARY KEY (id);


--
-- Name: return PK_c8ad68d13e76d75d803b5aeebc4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT "PK_c8ad68d13e76d75d803b5aeebc4" PRIMARY KEY (id);


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: order_item PK_d01158fe15b1ead5c26fd7f4e90; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY (id);


--
-- Name: coupons PK_d7ea8864a0150183770f3e9a8cb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY (id);


--
-- Name: loyalty_transactions PK_df453f678b7575221b335673362; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "PK_df453f678b7575221b335673362" PRIMARY KEY (id);


--
-- Name: order_status_history PK_e6c66d853f155531985fc4f6ec8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT "PK_e6c66d853f155531985fc4f6ec8" PRIMARY KEY (id);


--
-- Name: purchase_order_item PK_f3eaf81afb216ae78a59cc19503; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT "PK_f3eaf81afb216ae78a59cc19503" PRIMARY KEY (id);


--
-- Name: recently_viewed UQ_01f146b5931db16a5d04173ba0e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT "UQ_01f146b5931db16a5d04173ba0e" UNIQUE ("userId", "productId");


--
-- Name: purchase_order UQ_31be5b12a6d6197d95f07c752e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "UQ_31be5b12a6d6197d95f07c752e2" UNIQUE ("orderNumber");


--
-- Name: order UQ_4e9f8dd16ec084bca97b3262edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "UQ_4e9f8dd16ec084bca97b3262edb" UNIQUE ("orderNumber");


--
-- Name: loyalty_programs UQ_638954423909d8aaab65cbed0aa; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_programs
    ADD CONSTRAINT "UQ_638954423909d8aaab65cbed0aa" UNIQUE ("userId");


--
-- Name: wishlist UQ_75e16538950706dc688b6087439; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "UQ_75e16538950706dc688b6087439" UNIQUE ("userId", "productId", "variantId");


--
-- Name: products UQ_c44ac33a05b144dd0d9ddcf9327; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "UQ_c44ac33a05b144dd0d9ddcf9327" UNIQUE (sku);


--
-- Name: coupons UQ_e025109230e82925843f2a14c48; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT "UQ_e025109230e82925843f2a14c48" UNIQUE (code);


--
-- Name: return UQ_e077fd74270dd5cf7381f6b0831; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT "UQ_e077fd74270dd5cf7381f6b0831" UNIQUE ("returnNumber");


--
-- Name: supplier UQ_e1183babf2fed1bb440905b1e53; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT "UQ_e1183babf2fed1bb440905b1e53" UNIQUE (code);


--
-- Name: user UQ_e12875dfb3b1d92d7d7c5377e22; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE (email);


--
-- Name: product_variant UQ_f4dc2c0888b66d547c175f090e2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "UQ_f4dc2c0888b66d547c175f090e2" UNIQUE (sku);


--
-- Name: IDX_38c954e266791189dfd7b6ffc4; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_38c954e266791189dfd7b6ffc4" ON public.analytics_events USING btree ("eventType", "createdAt");


--
-- Name: IDX_89639a7cf8b3cd156a5d3b9a30; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_89639a7cf8b3cd156a5d3b9a30" ON public.analytics_events USING btree ("userId", "createdAt");


--
-- Name: IDX_e9315598b09a8d1feaf59ed220; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_e9315598b09a8d1feaf59ed220" ON public.analytics_events USING btree ("sessionId", "createdAt");


--
-- Name: product_review FK_06e7335708b5e7870f1eaa608d2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT "FK_06e7335708b5e7870f1eaa608d2" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: purchase_order_item FK_13ef910b84865fed2a2799dea55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT "FK_13ef910b84865fed2a2799dea55" FOREIGN KEY ("purchaseOrderId") REFERENCES public.purchase_order(id);


--
-- Name: cart_item FK_158f0325ccf7f68a5b395fa2f6a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_158f0325ccf7f68a5b395fa2f6a" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: product_comparison FK_166e96cddbb4c1bd67360ef997c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_comparison
    ADD CONSTRAINT "FK_166e96cddbb4c1bd67360ef997c" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: wishlist FK_17e00e49d77ccaf7ff0e14de37b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "FK_17e00e49d77ccaf7ff0e14de37b" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: return_item FK_25617ece01688d76877986b81c9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT "FK_25617ece01688d76877986b81c9" FOREIGN KEY ("returnId") REFERENCES public.return(id);


--
-- Name: stock_movement FK_27ea7c4375b62927e6136465c4c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movement
    ADD CONSTRAINT "FK_27ea7c4375b62927e6136465c4c" FOREIGN KEY ("createdById") REFERENCES public."user"(id);


--
-- Name: purchase_order FK_2947cfdfcc6ba31b0a0dc1dab83; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_2947cfdfcc6ba31b0a0dc1dab83" FOREIGN KEY ("createdById") REFERENCES public."user"(id);


--
-- Name: product_image FK_2b15eba45a08957745b65dde586; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "FK_2b15eba45a08957745b65dde586" FOREIGN KEY ("variantId") REFERENCES public.product_variant(id);


--
-- Name: purchase_order_item FK_3064ddc2f33fbc5b09f53cee561; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order_item
    ADD CONSTRAINT "FK_3064ddc2f33fbc5b09f53cee561" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: supplier_product FK_317f99b34efa6ed3c3cd597d6d4; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_product
    ADD CONSTRAINT "FK_317f99b34efa6ed3c3cd597d6d4" FOREIGN KEY ("supplierId") REFERENCES public.supplier(id);


--
-- Name: product_image FK_40ca0cd115ef1ff35351bed8da2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_image
    ADD CONSTRAINT "FK_40ca0cd115ef1ff35351bed8da2" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: return FK_54ca59e9b7e3103614fee58a2a2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT "FK_54ca59e9b7e3103614fee58a2a2" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- Name: order_item FK_646bf9ece6f45dbe41c203e06e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- Name: order_status_history FK_689db3835e5550e68d26ca32676; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT "FK_689db3835e5550e68d26ca32676" FOREIGN KEY ("orderId") REFERENCES public."order"(id);


--
-- Name: inventory_alert FK_6d085eb81359f649a3ca3dada69; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_alert
    ADD CONSTRAINT "FK_6d085eb81359f649a3ca3dada69" FOREIGN KEY ("acknowledgedById") REFERENCES public."user"(id);


--
-- Name: product_variant FK_6e420052844edf3a5506d863ce6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_variant
    ADD CONSTRAINT "FK_6e420052844edf3a5506d863ce6" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: supplier_product FK_6e70834f3ad39bbd22a920accda; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier_product
    ADD CONSTRAINT "FK_6e70834f3ad39bbd22a920accda" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: cart_item FK_75db0de134fe0f9fe9e4591b7bf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_item
    ADD CONSTRAINT "FK_75db0de134fe0f9fe9e4591b7bf" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: reviews FK_7ed5659e7139fc8bc039198cc1f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_7ed5659e7139fc8bc039198cc1f" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: order FK_8e2b018ed0091fa11714dd7b3e1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_8e2b018ed0091fa11714dd7b3e1" FOREIGN KEY ("couponId") REFERENCES public.coupons(id);


--
-- Name: order_item FK_904370c093ceea4369659a3c810; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: recently_viewed FK_90fb18e5c64a6f44fc887b66d03; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT "FK_90fb18e5c64a6f44fc887b66d03" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: order_status_history FK_995002806e351edfa1d8450d82c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT "FK_995002806e351edfa1d8450d82c" FOREIGN KEY ("changedById") REFERENCES public."user"(id);


--
-- Name: stock_movement FK_9e1078f3037faf8730f384bb422; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.stock_movement
    ADD CONSTRAINT "FK_9e1078f3037faf8730f384bb422" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: reviews FK_a6b3c434392f5d10ec171043666; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "FK_a6b3c434392f5d10ec171043666" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: inventory_alert FK_aacd3b3073e5db3b7b31a686a55; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_alert
    ADD CONSTRAINT "FK_aacd3b3073e5db3b7b31a686a55" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: return FK_aba4cfadcd81256846e3b0f07e5; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT "FK_aba4cfadcd81256846e3b0f07e5" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: return FK_aef8480ba032d30266fb8e2eeb2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return
    ADD CONSTRAINT "FK_aef8480ba032d30266fb8e2eeb2" FOREIGN KEY ("processedById") REFERENCES public."user"(id);


--
-- Name: recently_viewed FK_b106a075a29593ce1453480118c; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recently_viewed
    ADD CONSTRAINT "FK_b106a075a29593ce1453480118c" FOREIGN KEY ("productId") REFERENCES public.products(id);


--
-- Name: return_item FK_b2d0304d0ee99f064e2a00e7e61; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.return_item
    ADD CONSTRAINT "FK_b2d0304d0ee99f064e2a00e7e61" FOREIGN KEY ("orderItemId") REFERENCES public.order_item(id);


--
-- Name: wishlist FK_ba74466d232c21ff2b72fbdae38; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "FK_ba74466d232c21ff2b72fbdae38" FOREIGN KEY ("variantId") REFERENCES public.product_variant(id);


--
-- Name: purchase_order FK_c6fecac3dc757383e2b341eabe6; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_c6fecac3dc757383e2b341eabe6" FOREIGN KEY ("approvedById") REFERENCES public."user"(id);


--
-- Name: order FK_caabe91507b3379c7ba73637b84; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: loyalty_transactions FK_d4ff58a969b15a909b6c344a629; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT "FK_d4ff58a969b15a909b6c344a629" FOREIGN KEY ("loyaltyProgramId") REFERENCES public.loyalty_programs(id);


--
-- Name: product_review FK_db21a1dc776b455ee83eb7ff88e; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT "FK_db21a1dc776b455ee83eb7ff88e" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: purchase_order FK_e4ea5841622429c12889a487f31; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.purchase_order
    ADD CONSTRAINT "FK_e4ea5841622429c12889a487f31" FOREIGN KEY ("supplierId") REFERENCES public.supplier(id);


--
-- Name: product_review FK_edafe3c079bd81bdf9fc637ef24; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_review
    ADD CONSTRAINT "FK_edafe3c079bd81bdf9fc637ef24" FOREIGN KEY ("moderatedById") REFERENCES public."user"(id);


--
-- Name: wishlist FK_f6eeb74a295e2aad03b76b0ba87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "FK_f6eeb74a295e2aad03b76b0ba87" FOREIGN KEY ("userId") REFERENCES public."user"(id);


--
-- Name: inventory_alert FK_fb63b6dc94bd5faf74b3677caa8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_alert
    ADD CONSTRAINT "FK_fb63b6dc94bd5faf74b3677caa8" FOREIGN KEY ("resolvedById") REFERENCES public."user"(id);


--
-- PostgreSQL database dump complete
--

\unrestrict J9Ja0Udenwkyu8PYIPh9rujflDczapVcZf9BjaGQbuGEZPRwJedMoU2vbPx1Tq1

