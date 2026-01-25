import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AnalyticsService } from '../services/analytics.service';
import { EventType } from '../entities/analytics-event.entity';

@Injectable()
export class AnalyticsInterceptor implements NestInterceptor {
  constructor(private analyticsService: AnalyticsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { url, method, user } = request;

    // No rastrear ciertas rutas
    if (this.shouldSkip(url)) {
      return next.handle();
    }

    return next.handle().pipe(
      tap(async (response) => {
        try {
          // Rastrear basado en la ruta
          await this.trackByRoute(url, method, user, request);
        } catch (error) {
          console.error('⚠️ Analytics tracking error:', error);
        }
      }),
    );
  }

  private shouldSkip(url: string): boolean {
    const skipPaths = [
      '/health',
      '/analytics',
      '/auth/login',
      '/auth/register',
    ];
    return skipPaths.some((path) => url.includes(path));
  }

  private async trackByRoute(
    url: string,
    method: string,
    user: any,
    request: any,
  ): Promise<void> {
    const userId = user?.id;
    const sessionId = request.sessionID || request.headers['x-session-id'];

    // Product views
    if (url.includes('/products/') && method === 'GET') {
      const productId = this.extractId(url, '/products');
      if (productId) {
        await this.analyticsService.trackEvent({
          eventType: EventType.PRODUCT_VIEW,
          userId,
          sessionId,
          productId: parseInt(productId),
        });
      }
    }

    // Product searches
    if (url.includes('/products') && url.includes('search')) {
      const searchTerm = new URL(`http://localhost${url}`).searchParams.get('q');
      if (searchTerm) {
        await this.analyticsService.trackEvent({
          eventType: EventType.PRODUCT_SEARCH,
          userId,
          sessionId,
          eventData: { searchTerm },
        });
      }
    }

    // Add to cart
    if (url.includes('/carrito') && method === 'POST') {
      await this.analyticsService.trackEvent({
        eventType: EventType.ADD_TO_CART,
        userId,
        sessionId,
      });
    }

    // Remove from cart
    if (url.includes('/carrito') && method === 'DELETE') {
      await this.analyticsService.trackEvent({
        eventType: EventType.REMOVE_FROM_CART,
        userId,
        sessionId,
      });
    }
  }

  private extractId(url: string, pattern: string): string | null {
    const regex = new RegExp(`${pattern}/(\\d+)`);
    const match = url.match(regex);
    return match ? match[1] : null;
  }
}
