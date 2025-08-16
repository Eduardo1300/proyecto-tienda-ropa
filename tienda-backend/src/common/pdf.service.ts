import { Injectable } from '@nestjs/common';
import { Order } from '../ordenes/entities/order.entity';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class PdfService {
  async generateInvoice(order: Order): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({ margin: 50 });
        const buffers: Buffer[] = [];

        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers);
          resolve(pdfData);
        });

        // Header
        doc.fontSize(20).text('FACTURA / RECIBO', 50, 50);
        doc.fontSize(12).text(`Pedido #${order.orderNumber}`, 50, 80);
        doc.text(`Fecha: ${order.createdAt.toLocaleDateString('es-ES')}`, 50, 95);

        // Company info (you can customize this)
        doc.text('Tienda de Ropa', 400, 50);
        doc.text('123 Calle Principal', 400, 65);
        doc.text('Ciudad, Estado 12345', 400, 80);
        doc.text('Tel: (555) 123-4567', 400, 95);

        // Customer info
        doc.text('FACTURAR A:', 50, 130);
        doc.text(`${order.user.firstName || ''} ${order.user.lastName || ''}`.trim() || order.user.username, 50, 145);
        doc.text(order.user.email, 50, 160);

        // Shipping address
        doc.text('ENVIAR A:', 300, 130);
        doc.text(order.shippingAddress, 300, 145, { width: 200 });

        // Line separator
        doc.moveTo(50, 200).lineTo(550, 200).stroke();

        // Table headers
        let yPosition = 220;
        doc.text('PRODUCTO', 50, yPosition);
        doc.text('CANT.', 200, yPosition);
        doc.text('PRECIO', 300, yPosition);
        doc.text('TOTAL', 450, yPosition);

        // Line separator
        doc.moveTo(50, yPosition + 15).lineTo(550, yPosition + 15).stroke();

        // Items
        yPosition += 30;
        let subtotal = 0;

        order.items.forEach((item) => {
          const itemTotal = item.price * item.quantity;
          subtotal += itemTotal;

          doc.text(item.product.name, 50, yPosition, { width: 140 });
          doc.text(item.quantity.toString(), 200, yPosition);
          doc.text(`$${item.price.toFixed(2)}`, 300, yPosition);
          doc.text(`$${itemTotal.toFixed(2)}`, 450, yPosition);

          yPosition += 20;
        });

        // Totals section
        yPosition += 20;
        doc.moveTo(300, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 15;

        doc.text('Subtotal:', 350, yPosition);
        doc.text(`$${subtotal.toFixed(2)}`, 450, yPosition);
        yPosition += 20;

        if (order.shippingCost > 0) {
          doc.text('Envío:', 350, yPosition);
          doc.text(`$${order.shippingCost.toFixed(2)}`, 450, yPosition);
          yPosition += 20;
        }

        if (order.tax > 0) {
          doc.text('Impuestos:', 350, yPosition);
          doc.text(`$${order.tax.toFixed(2)}`, 450, yPosition);
          yPosition += 20;
        }

        // Total line
        doc.moveTo(300, yPosition).lineTo(550, yPosition).stroke();
        yPosition += 15;

        doc.fontSize(14).text('TOTAL:', 350, yPosition);
        doc.text(`$${order.total.toFixed(2)}`, 450, yPosition);

        // Footer
        yPosition += 60;
        doc.fontSize(10).text('Estado del pedido: ' + this.getStatusDisplayName(order.status), 50, yPosition);
        
        if (order.trackingCode) {
          yPosition += 15;
          doc.text(`Código de seguimiento: ${order.trackingCode}`, 50, yPosition);
        }

        if (order.estimatedDeliveryDate) {
          yPosition += 15;
          doc.text(`Fecha estimada de entrega: ${order.estimatedDeliveryDate.toLocaleDateString('es-ES')}`, 50, yPosition);
        }

        yPosition += 30;
        doc.text('¡Gracias por tu compra!', 50, yPosition);

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private getStatusDisplayName(status: string): string {
    const statusNames = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      delivered: 'Entregado',
      cancelled: 'Cancelado',
      returned: 'Devuelto',
      refunded: 'Reembolsado',
    };
    return statusNames[status] || status;
  }
}
