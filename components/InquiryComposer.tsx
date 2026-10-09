"use client";
import { useState } from 'react';
import { storeConfig } from '@/config/store';
import { Button } from './ui';

export function InquiryComposer({ initialMessage }: { initialMessage: string }) {
  const [message, setMessage] = useState(initialMessage);
  const [status, setStatus] = useState('');
  const c = storeConfig.contact;
  const phone = c.phone.replace(/[^+\d]/g, '');
  const copy = async () => {
    try { await navigator.clipboard.writeText(message); setStatus('Copied. Open Messenger and paste your message to send it.'); }
    catch { setStatus('Copy is unavailable in this browser. Select and copy the message below.'); }
  };
  const hasContact = Boolean(c.messengerUrl || c.facebookUrl || c.email || phone);
  return <div className="rounded-3xl border border-line bg-white p-6 sm:p-8">
    <h2 className="text-2xl font-bold tracking-tight">Start a conversation</h2>
    <p className="mt-3 text-sm leading-relaxed text-mute">Review your message, copy it, then send it to TapSpot. We’ll confirm availability, delivery and payment directly with you.</p>
    <label htmlFor="inquiry-message" className="mb-2 mt-6 block text-sm font-semibold">Your message</label>
    <textarea id="inquiry-message" value={message} onChange={e => { setMessage(e.target.value); setStatus(''); }} rows={9} maxLength={8000} className="w-full rounded-xl border border-line p-4 text-sm leading-relaxed" />
    <div className="mt-5 flex flex-wrap gap-3">
      <Button onClick={copy} variant="dark" disabled={!message.trim()}>Copy message</Button>
      {(c.messengerUrl || c.facebookUrl) && <a className="inline-flex min-h-12 items-center rounded-full bg-brand px-6 font-semibold text-ink" href={c.messengerUrl || c.facebookUrl} target="_blank" rel="noopener noreferrer">Open Messenger / Facebook ↗</a>}
      {c.email && <a className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-semibold" href={`mailto:${c.email}?subject=TapSpot%20inquiry&body=${encodeURIComponent(message)}`}>Send by email</a>}
      {phone && <a className="inline-flex min-h-12 items-center rounded-full border border-line px-6 font-semibold" href={`sms:${phone}?body=${encodeURIComponent(message)}`}>Send by SMS</a>}
    </div>
    <p role="status" className="mt-4 min-h-5 text-sm text-mute">{status || (hasContact ? 'No payment is collected on this website. Your order is confirmed in our conversation.' : 'Our contact details are being updated. Please check back before placing an order.')}</p>
  </div>;
}
