import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export enum EventType {
  PAGE_VIEW = 'page_view',
  PRODUCT_VIEW = 'product_view',
  PRODUCT_SEARCH = 'product_search',
  ADD_TO_CART = 'add_to_cart',
  REMOVE_FROM_CART = 'remove_from_cart',
  ADD_TO_WISHLIST = 'add_to_wishlist',
  PURCHASE = 'purchase',
  USER_REGISTRATION = 'user_registration',
  USER_LOGIN = 'user_login',
  COUPON_APPLIED = 'coupon_applied',
  REVIEW_SUBMITTED = 'review_submitted',
  NEWSLETTER_SIGNUP = 'newsletter_signup',
  FILTER_APPLIED = 'filter_applied',
  SORT_APPLIED = 'sort_applied'
}

@Entity('analytics_events')
@Index(['eventType', 'createdAt'])
@Index(['userId', 'createdAt'])
@Index(['sessionId', 'createdAt'])
export class AnalyticsEvent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: EventType
  })
  eventType: EventType;

  @Column({ nullable: true })
  userId: number;

  @Column({ nullable: true })
  sessionId: string;

  @Column({ nullable: true })
  productId: number;

  @Column({ nullable: true })
  categoryId: number;

  @Column({ nullable: true })
  orderId: number;

  @Column('json', { nullable: true })
  eventData: any;

  @Column({ nullable: true })
  userAgent: string;

  @Column({ nullable: true })
  ipAddress: string;

  @Column({ nullable: true })
  referrer: string;

  @Column({ nullable: true })
  page: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  value: number;

  @Column({ nullable: true })
  currency: string;

  @CreateDateColumn()
  createdAt: Date;

  // Métodos de utilidad
  static createPageView(data: {
    userId?: number;
    sessionId: string;
    page: string;
    referrer?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Partial<AnalyticsEvent> {
    return {
      eventType: EventType.PAGE_VIEW,
      userId: data.userId,
      sessionId: data.sessionId,
      page: data.page,
      referrer: data.referrer,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress
    };
  }

  static createProductView(data: {
    userId?: number;
    sessionId: string;
    productId: number;
    categoryId?: number;
    page?: string;
    userAgent?: string;
    ipAddress?: string;
  }): Partial<AnalyticsEvent> {
    return {
      eventType: EventType.PRODUCT_VIEW,
      userId: data.userId,
      sessionId: data.sessionId,
      productId: data.productId,
      categoryId: data.categoryId,
      page: data.page,
      userAgent: data.userAgent,
      ipAddress: data.ipAddress
    };
  }

  static createPurchase(data: {
    userId: number;
    sessionId: string;
    orderId: number;
    value: number;
    currency?: string;
    eventData?: any;
  }): Partial<AnalyticsEvent> {
    return {
      eventType: EventType.PURCHASE,
      userId: data.userId,
      sessionId: data.sessionId,
      orderId: data.orderId,
      value: data.value,
      currency: data.currency || 'USD',
      eventData: data.eventData
    };
  }

  static createAddToCart(data: {
    userId?: number;
    sessionId: string;
    productId: number;
    value: number;
    eventData?: any;
  }): Partial<AnalyticsEvent> {
    return {
      eventType: EventType.ADD_TO_CART,
      userId: data.userId,
      sessionId: data.sessionId,
      productId: data.productId,
      value: data.value,
      eventData: data.eventData
    };
  }

  static createSearch(data: {
    userId?: number;
    sessionId: string;
    searchTerm: string;
    resultsCount: number;
    filters?: any;
  }): Partial<AnalyticsEvent> {
    return {
      eventType: EventType.PRODUCT_SEARCH,
      userId: data.userId,
      sessionId: data.sessionId,
      eventData: {
        searchTerm: data.searchTerm,
        resultsCount: data.resultsCount,
        filters: data.filters
      }
    };
  }
}
