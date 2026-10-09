"use client";
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { useCart } from './CartProvider';
import { InquiryComposer } from './InquiryComposer';
import { ButtonLink } from './ui';

/** Direct inquiry only: never report an order sent or clear the cart on a link click. */
export function CheckoutForm() {
  const { lines, ready, totals } = useCart();
  if (!ready) return <p>Loading your request…</p>;
  const items = lines.flatMap(line => {
    const product = getProduct(line.productId);
    return product?.available && product.price !== null ? [{ line, product }] : [];
  });
  if (!items.length) return <div><p className="mb-6 text-mute">Choose a product to prepare your request.</p><ButtonLink href="/products">Browse products</ButtonLink></div>;
  const subtotal = items.reduce((sum, { line, product }) => sum + line.quantity * product.price!, 0);
  const message = ['Hello TapSpot! I would like to ask about this order:', '', ...items.flatMap(({ line, product }) => [
    `${line.quantity} × ${product.name} — ${formatPrice(product.price! * line.quantity)}`,
    ...product.setupFields.filter(f => line.setup[f.key]).map(f => `${f.label}: ${line.setup[f.key]}`), ''
  ]), `Product subtotal: ${formatPrice(subtotal)}`, ...(totals.discount > 0 ? [`Requested discount: ${formatPrice(totals.discount)} (${totals.discountLabel})`] : []), 'Please confirm availability, delivery cost and how to pay.', '', 'My name:', 'My location:'].join('\n');
  return <div className="mx-auto max-w-3xl"><InquiryComposer key={message} initialMessage={message} /><p className="mt-5 text-sm text-mute">Your cart stays saved until you remove the items. Opening a contact app does not submit or confirm an order.</p></div>;
}

