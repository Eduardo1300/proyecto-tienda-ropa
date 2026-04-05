--
-- PostgreSQL database dump
--

\restrict LXSxIsWFWfcDQEo0gmUdUnKSd3V1uI0vd67cjqDajaR1tnU35ogFWJ5TgPBWSlH

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

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
    "lifetimeSpent" integer DEFAULT 0 NOT NULL,
    "currentTier" public.loyalty_programs_currenttier_enum DEFAULT 'bronze'::public.loyalty_programs_currenttier_enum NOT NULL,
    "tierProgress" integer DEFAULT 0 NOT NULL,
    "tierAchievedAt" timestamp without time zone,
    "lastActivityAt" timestamp without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
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
    name character varying(200) DEFAULT 'Mi Comparaci├│n'::character varying NOT NULL,
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
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
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
\.


--
-- Data for Name: inventory_alert; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_alert (id, type, status, priority, message, threshold, "currentValue", "expirationDate", "emailSent", "emailSentAt", "acknowledgedAt", "acknowledgedNotes", "resolvedAt", "resolutionNotes", "createdAt", "updatedAt", "productId", "acknowledgedById", "resolvedById") FROM stdin;
\.


--
-- Data for Name: loyalty_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_programs (id, "userId", "totalPoints", "availablePoints", "lifetimeSpent", "currentTier", "tierProgress", "tierAchievedAt", "lastActivityAt", "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.loyalty_transactions (id, "loyaltyProgramId", type, reason, points, "orderAmount", "orderId", description, "referenceId", "expiresAt", "createdAt") FROM stdin;
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."order" (id, "orderNumber", status, total, "shippingCost", tax, "trackingCode", "shippingCarrier", "shippingAddress", "billingAddress", notes, "estimatedDeliveryDate", "actualDeliveryDate", "cancelledAt", "cancellationReason", "canBeCancelled", "canBeReturned", "returnRequestedAt", "refundedAt", "refundAmount", "refundReason", "discountAmount", "createdAt", "updatedAt", "userId", "couponId") FROM stdin;
\.


--
-- Data for Name: order_item; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_item (id, quantity, price, "productId", "orderId") FROM stdin;
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_status_history (id, "fromStatus", "toStatus", reason, notes, "emailSent", "trackingCode", "createdAt", "orderId", "changedById") FROM stdin;
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
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, price, "costPrice", description, image, "imageUrl", category, "isActive", sku, barcode, stock, "reservedStock", "minStockLevel", "maxStockLevel", "reorderPoint", "reorderQuantity", "expirationDate", "trackExpiration", "autoRestock", "lowStockAlert", "lastRestockDate", "lastSoldDate", "totalSold", supplier, "supplierSku", "supplierPrice", "leadTimeDays", location, batch, unit, weight, size, color, brand, model, tags, "relatedProductIds", "viewCount", "reviewCount", "averageRating", "isFeatured", "isNew", "isBestseller", "launchDate", specifications, "careInstructions", "shippingInfo", "returnPolicy", "createdAt", "updatedAt") FROM stdin;
1	Camiseta B├ísica Blanca	29.99	\N	Camiseta 100% algod├│n, c├│moda y vers├ítil para uso diario	\N	https://via.placeholder.com/400x400/6366f1/ffffff?text=Camiseta	hombre	t	\N	\N	50	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.654548	2025-08-16 06:16:19.654548
2	Vestido Elegante Negro	89.99	\N	Vestido perfecto para ocasiones especiales y eventos formales	\N	https://via.placeholder.com/400x400/ec4899/ffffff?text=Vestido	mujer	t	\N	\N	25	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.672574	2025-08-16 06:16:19.672574
3	Jeans Cl├ísicos	59.99	\N	Jeans de corte cl├ísico, c├│modos y duraderos	\N	https://via.placeholder.com/400x400/3b82f6/ffffff?text=Jeans	hombre	t	\N	\N	30	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.67897	2025-08-16 06:16:19.67897
4	Blusa Floral	45.99	\N	Blusa con estampado floral, perfecta para la primavera	\N	https://via.placeholder.com/400x400/f59e0b/ffffff?text=Blusa	mujer	t	\N	\N	20	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.684238	2025-08-16 06:16:19.684238
5	Zapatillas Deportivas	79.99	\N	Zapatillas c├│modas para ejercicio y uso casual	\N	https://via.placeholder.com/400x400/10b981/ffffff?text=Zapatillas	zapatos	t	\N	\N	40	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.690097	2025-08-16 06:16:19.690097
6	Bolso de Cuero	129.99	\N	Bolso elegante de cuero genuino con m├║ltiples compartimentos	\N	https://via.placeholder.com/400x400/8b5cf6/ffffff?text=Bolso	accesorios	t	\N	\N	15	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.695424	2025-08-16 06:16:19.695424
7	Chaqueta Denim	69.99	\N	Chaqueta de mezclilla cl├ísica, perfecta para cualquier temporada	\N	https://via.placeholder.com/400x400/6366f1/ffffff?text=Chaqueta	hombre	t	\N	\N	35	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.70061	2025-08-16 06:16:19.70061
8	Falda Midi	39.99	\N	Falda midi elegante y vers├ítil para oficina o casual	\N	https://via.placeholder.com/400x400/ec4899/ffffff?text=Falda	mujer	t	\N	\N	28	0	5	100	20	50	\N	f	f	f	\N	\N	0	\N	\N	\N	0	\N	\N	kg	1.000	\N	\N	\N	\N	\N	\N	0	0	0.00	f	f	f	\N	\N	\N	\N	\N	2025-08-16 06:16:19.706054	2025-08-16 06:16:19.706054
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
\.


--
-- Data for Name: supplier_product; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier_product (id, "supplierSku", "supplierPrice", "minimumOrderQuantity", "leadTimeDays", "isPreferred", "isActive", "lastOrderDate", "lastOrderPrice", "totalOrdered", notes, "createdAt", "updatedAt", "productId", "supplierId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, email, "firstName", "lastName", password, role, "refreshToken", "passwordResetToken", "avatarUrl", "loyaltyPoints", "createdAt", "updatedAt") FROM stdin;
2	testuser	user@example.com	Test	User	$2b$10$gmczFbpVG69CmHq2xYavuO.6kOUaTNZWxf3bictXS/G6NUJsQmfee	user	\N	\N	\N	0	2025-08-16 03:43:24.782474	2025-08-16 03:43:24.782474
3	prueba	prueba@gmail.com	prueba	prueba	$2b$10$Xde0pRyVm.Ksm6rEMc2tE.jlFh83b6wUUICCLi.85FCMc2/pLPs1O	customer	\N	\N	\N	0	2025-08-16 04:05:36.873148	2025-08-16 04:08:13.746791
1	admin	admin@example.com	Admin	User	$2b$10$tmBgu3YSR3GY5C5aEXVt4.Mna8jjVsvtSlCbr5bQj9U0/Xis6xCQu	admin	eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwic3ViIjoxLCJyb2xlIjoiYWRtaW4iLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNzU2MzQ5NzM2LCJleHAiOjE3NTY5NTQ1MzZ9.0U1FzVj5GTnmPvObG-68hoHIGx-ZSTUIBR9NpnjTOtM	\N	\N	0	2025-08-16 03:43:24.782474	2025-08-28 04:55:36.847033
\.


--
-- Data for Name: wishlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wishlist (id, "isActive", notes, "createdAt", "updatedAt", "userId", "productId", "variantId") FROM stdin;
\.


--
-- Name: analytics_events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.analytics_events_id_seq', 1, false);


--
-- Name: cart_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cart_item_id_seq', 1, false);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: inventory_alert_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_alert_id_seq', 1, false);


--
-- Name: loyalty_programs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_programs_id_seq', 1, false);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.loyalty_transactions_id_seq', 1, false);


--
-- Name: order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_id_seq', 1, false);


--
-- Name: order_item_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_item_id_seq', 1, false);


--
-- Name: order_status_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.order_status_history_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.product_variant_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 8, true);


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

SELECT pg_catalog.setval('public.reviews_id_seq', 1, false);


--
-- Name: stock_movement_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.stock_movement_id_seq', 1, false);


--
-- Name: supplier_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.supplier_id_seq', 1, false);


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

SELECT pg_catalog.setval('public.wishlist_id_seq', 1, false);


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

\unrestrict LXSxIsWFWfcDQEo0gmUdUnKSd3V1uI0vd67cjqDajaR1tnU35ogFWJ5TgPBWSlH


