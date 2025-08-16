import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { OrderStatus } from '../ordenes/enums/order-status.enum';
import { Order } from '../ordenes/entities/order.entity';
import { Return } from '../ordenes/entities/return.entity';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST', 'smtp.gmail.com'),
      port: this.configService.get('SMTP_PORT', 587),
      secure: false,
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  async sendOrderConfirmation(email: string, order: Order): Promise<void> {
    const subject = `Confirmación de Pedido #${order.orderNumber}`;
    const html = this.generateOrderConfirmationHtml(order);

    await this.sendEmail(email, subject, html);
  }

  async sendOrderStatusUpdate(
    email: string,
    order: Order,
    previousStatus: OrderStatus,
    newStatus: OrderStatus,
  ): Promise<void> {
    const subject = `Actualización de Pedido #${order.orderNumber} - ${this.getStatusDisplayName(newStatus)}`;
    const html = this.generateStatusUpdateHtml(order, previousStatus, newStatus);

    await this.sendEmail(email, subject, html);
  }

  async sendOrderCancellation(email: string, order: Order, reason: string): Promise<void> {
    const subject = `Pedido Cancelado #${order.orderNumber}`;
    const html = this.generateCancellationHtml(order, reason);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnRequest(email: string, returnEntity: Return): Promise<void> {
    const subject = `Solicitud de Devolución #${returnEntity.returnNumber}`;
    const html = this.generateReturnRequestHtml(returnEntity);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnApproval(email: string, returnEntity: Return): Promise<void> {
    const subject = `Devolución Aprobada #${returnEntity.returnNumber}`;
    const html = this.generateReturnApprovalHtml(returnEntity);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnRejection(email: string, returnEntity: Return, reason: string): Promise<void> {
    const subject = `Devolución Rechazada #${returnEntity.returnNumber}`;
    const html = this.generateReturnRejectionHtml(returnEntity, reason);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnReceived(email: string, returnEntity: Return): Promise<void> {
    const subject = `Productos Recibidos - Devolución #${returnEntity.returnNumber}`;
    const html = this.generateReturnReceivedHtml(returnEntity);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnProcessed(email: string, returnEntity: Return): Promise<void> {
    const subject = `Devolución Procesada #${returnEntity.returnNumber}`;
    const html = this.generateReturnProcessedHtml(returnEntity);

    await this.sendEmail(email, subject, html);
  }

  async sendReturnRefunded(email: string, returnEntity: Return): Promise<void> {
    const subject = `Reembolso Procesado #${returnEntity.returnNumber}`;
    const html = this.generateReturnRefundedHtml(returnEntity);

    await this.sendEmail(email, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<void> {
    try {
      await this.transporter.sendMail({
        from: this.configService.get('SMTP_FROM', 'noreply@tienda.com'),
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
      // In production, you might want to queue failed emails for retry
    }
  }

  private generateOrderConfirmationHtml(order: Order): string {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.product.name}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${item.price.toFixed(2)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">$${(item.price * item.quantity).toFixed(2)}</td>
        </tr>
      `,
      )
      .join('');

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">¡Gracias por tu pedido!</h1>
        <p>Hemos recibido tu pedido <strong>#${order.orderNumber}</strong> y lo estamos procesando.</p>
        
        <h2 style="color: #555;">Detalles del Pedido</h2>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f8f9fa;">
              <th style="padding: 10px; text-align: left;">Producto</th>
              <th style="padding: 10px; text-align: center;">Cantidad</th>
              <th style="padding: 10px; text-align: right;">Precio</th>
              <th style="padding: 10px; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="text-align: right; margin: 20px 0;">
          <p><strong>Subtotal: $${(order.total - order.shippingCost - order.tax).toFixed(2)}</strong></p>
          <p><strong>Envío: $${order.shippingCost.toFixed(2)}</strong></p>
          <p><strong>Impuestos: $${order.tax.toFixed(2)}</strong></p>
          <p style="font-size: 18px;"><strong>Total: $${order.total.toFixed(2)}</strong></p>
        </div>
        
        <h3 style="color: #555;">Dirección de Envío</h3>
        <p>${order.shippingAddress}</p>
        
        <p style="margin-top: 30px;">Te notificaremos cuando tu pedido sea enviado.</p>
        <p>¡Gracias por comprar con nosotros!</p>
      </div>
    `;
  }

  private generateStatusUpdateHtml(order: Order, previousStatus: OrderStatus, newStatus: OrderStatus): string {
    let statusMessage = '';
    let additionalInfo = '';

    switch (newStatus) {
      case OrderStatus.PROCESSING:
        statusMessage = 'Tu pedido está siendo procesado';
        additionalInfo = 'Estamos preparando tus productos para el envío.';
        break;
      case OrderStatus.SHIPPED:
        statusMessage = 'Tu pedido ha sido enviado';
        additionalInfo = order.trackingCode 
          ? `Código de seguimiento: <strong>${order.trackingCode}</strong><br>Transportista: ${order.shippingCarrier || 'N/A'}`
          : 'Recibirás el código de seguimiento pronto.';
        break;
      case OrderStatus.DELIVERED:
        statusMessage = '¡Tu pedido ha sido entregado!';
        additionalInfo = 'Esperamos que disfrutes tus productos. Si tienes algún problema, no dudes en contactarnos.';
        break;
    }

    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Actualización de Pedido #${order.orderNumber}</h1>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h2 style="color: #1976d2; margin: 0;">${statusMessage}</h2>
          <p style="margin: 10px 0 0 0;">${additionalInfo}</p>
        </div>
        
        <p>Estado anterior: <strong>${this.getStatusDisplayName(previousStatus)}</strong></p>
        <p>Estado actual: <strong>${this.getStatusDisplayName(newStatus)}</strong></p>
        
        <p style="margin-top: 30px;">¡Gracias por tu confianza!</p>
      </div>
    `;
  }

  private generateCancellationHtml(order: Order, reason: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">Pedido Cancelado #${order.orderNumber}</h1>
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu pedido ha sido cancelado exitosamente.</strong></p>
          <p><strong>Motivo:</strong> ${reason}</p>
        </div>
        
        <p>Si realizaste el pago, el reembolso será procesado en los próximos 3-5 días hábiles.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
        
        <p style="margin-top: 30px;">Lamentamos cualquier inconveniente.</p>
      </div>
    `;
  }

  private generateReturnRequestHtml(returnEntity: Return): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #333;">Solicitud de Devolución #${returnEntity.returnNumber}</h1>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Hemos recibido tu solicitud de devolución.</strong></p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
          <p><strong>Motivo:</strong> ${this.getReturnReasonDisplayName(returnEntity.reason)}</p>
          <p><strong>Monto a reembolsar:</strong> $${returnEntity.refundAmount.toFixed(2)}</p>
        </div>
        
        <p>Revisaremos tu solicitud y te contactaremos en las próximas 24-48 horas.</p>
        <p>Una vez aprobada, te enviaremos las instrucciones para el envío de los productos.</p>
        
        <p style="margin-top: 30px;">¡Gracias por tu paciencia!</p>
      </div>
    `;
  }

  private getStatusDisplayName(status: OrderStatus): string {
    const statusNames = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.PROCESSING]: 'Procesando',
      [OrderStatus.SHIPPED]: 'Enviado',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado',
      [OrderStatus.RETURNED]: 'Devuelto',
      [OrderStatus.REFUNDED]: 'Reembolsado',
    };
    return statusNames[status] || status;
  }

  private generateReturnApprovalHtml(returnEntity: Return): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4caf50;">¡Devolución Aprobada!</h1>
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu solicitud de devolución #${returnEntity.returnNumber} ha sido aprobada.</strong></p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
          <p><strong>Monto a reembolsar:</strong> $${returnEntity.refundAmount.toFixed(2)}</p>
        </div>
        
        <h3>Próximos pasos:</h3>
        <ol>
          <li>Te enviaremos una etiqueta de envío prepagada por email</li>
          <li>Empaca los productos en su embalaje original</li>
          <li>Adjunta la etiqueta de envío y envía el paquete</li>
          <li>Una vez recibidos los productos, procesaremos tu reembolso</li>
        </ol>
        
        <p style="margin-top: 30px;">¡Gracias por tu paciencia!</p>
      </div>
    `;
  }

  private generateReturnRejectionHtml(returnEntity: Return, reason: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #f44336;">Devolución Rechazada</h1>
        <div style="background-color: #ffebee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Lamentamos informarte que tu solicitud de devolución #${returnEntity.returnNumber} ha sido rechazada.</strong></p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
          <p><strong>Motivo del rechazo:</strong> ${reason}</p>
        </div>
        
        <p>Si tienes preguntas sobre esta decisión, no dudes en contactarnos.</p>
        <p style="margin-top: 30px;">Lamentamos cualquier inconveniente.</p>
      </div>
    `;
  }

  private generateReturnReceivedHtml(returnEntity: Return): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #2196f3;">Productos Recibidos</h1>
        <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Hemos recibido los productos de tu devolución #${returnEntity.returnNumber}.</strong></p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
          <p><strong>Monto a reembolsar:</strong> $${returnEntity.refundAmount.toFixed(2)}</p>
        </div>
        
        <p>Nuestro equipo está revisando los productos. Te notificaremos una vez que el proceso esté completo.</p>
        <p style="margin-top: 30px;">¡Gracias por tu paciencia!</p>
      </div>
    `;
  }

  private generateReturnProcessedHtml(returnEntity: Return): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #ff9800;">Devolución Procesada</h1>
        <div style="background-color: #fff3e0; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu devolución #${returnEntity.returnNumber} ha sido procesada exitosamente.</strong></p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
          <p><strong>Monto a reembolsar:</strong> $${returnEntity.refundAmount.toFixed(2)}</p>
        </div>
        
        <p>Tu reembolso será procesado en los próximos 3-5 días hábiles y aparecerá en tu método de pago original.</p>
        <p style="margin-top: 30px;">¡Gracias por tu confianza!</p>
      </div>
    `;
  }

  private generateReturnRefundedHtml(returnEntity: Return): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4caf50;">¡Reembolso Completado!</h1>
        <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Tu reembolso de $${returnEntity.refundAmount.toFixed(2)} ha sido procesado exitosamente.</strong></p>
          <p><strong>Devolución:</strong> #${returnEntity.returnNumber}</p>
          <p><strong>Pedido original:</strong> #${returnEntity.order.orderNumber}</p>
        </div>
        
        <p>El reembolso debería aparecer en tu método de pago original en los próximos 3-5 días hábiles.</p>
        <p>Si no ves el reembolso después de este período, por favor contáctanos.</p>
        
        <p style="margin-top: 30px;">¡Gracias por comprar con nosotros!</p>
      </div>
    `;
  }

  private getReturnReasonDisplayName(reason: string): string {
    const reasonNames = {
      defective: 'Producto defectuoso',
      wrong_size: 'Talla incorrecta',
      not_as_described: 'No como se describe',
      changed_mind: 'Cambié de opinión',
      damaged_in_shipping: 'Dañado en el envío',
      other: 'Otro',
    };
    return reasonNames[reason] || reason;
  }
}
