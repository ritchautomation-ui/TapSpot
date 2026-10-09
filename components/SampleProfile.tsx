"use client";
import { useState } from 'react';
import { Wordmark } from './Brand';
export function SampleProfile({ variant }: { variant: string }) {
 const [notice, setNotice] = useState('');
 const [tab, setTab] = useState('About');
 const dark = variant === 'executive';
 const saveContact = () => {
   const blob = new Blob(['BEGIN:VCARD\r\nVERSION:3.0\r\nFN:TapSpot Sample\r\nORG:Sample Business\r\nNOTE:Demo contact only. Replace with your own details.\r\nEND:VCARD\r\n'], {type:'text/vcard'});
   const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download='tapspot-sample.vcf'; a.click(); URL.revokeObjectURL(url);
   setNotice('Sample contact downloaded. Your live card saves your actual contact details.');
 };
 return <article className={`overflow-hidden rounded-[2rem] border border-line shadow-card ${dark ? 'bg-ink text-white' : 'bg-white text-ink'}`}>
   <div className={`p-8 sm:p-10 ${variant === 'business' ? 'bg-brand text-ink' : dark ? 'bg-neutral-900' : 'bg-paper'}`}>
    <p className="text-xs font-semibold uppercase tracking-widest opacity-60">{variant === 'starter' ? 'Your digital introduction' : 'Meet your local business'}</p>
    <div className={`mt-8 grid h-20 w-20 place-items-center rounded-full text-2xl font-bold ${dark ? 'bg-brand text-ink' : 'bg-ink text-white'}`}>TS</div>
    <h1 className="mt-5 text-4xl font-bold tracking-tight">{variant === 'starter' ? 'Your Name' : 'Your Business'}</h1><p className="mt-3 opacity-65">{variant === 'starter' ? 'Your title · Your company' : 'What you do. Who you help. Why it matters.'}</p>
   </div>
   <div className="p-8 sm:p-10"><button onClick={saveContact} className="min-h-12 w-full rounded-full bg-brand px-5 font-semibold text-ink">Save sample contact</button>
    <div className="mt-3 grid grid-cols-2 gap-3">{['Call','Email'].map(label => <button key={label} onClick={() => setNotice(`On your live page, ${label.toLowerCase()} opens your business ${label === 'Call' ? 'phone number' : 'email address'}.`)} className="min-h-12 rounded-full border border-current/20 font-semibold">{label}</button>)}</div>
    {variant !== 'starter' && <><div className="mt-8 flex gap-5 border-b border-current/20" role="group" aria-label="Profile sections">{['About','Services','Location'].map(t => <button key={t} aria-pressed={tab === t} onClick={() => setTab(t)} className={`min-h-12 border-b-2 text-sm font-semibold ${tab === t ? 'border-brand' : 'border-transparent opacity-60'}`}>{t}</button>)}</div>
    <div className="min-h-36 py-6"><h2 className="text-xl font-bold">{tab === 'About' ? 'A little about us' : tab === 'Services' ? 'What we can do for you' : 'Come say hello'}</h2><p className="mt-3 text-sm leading-relaxed opacity-65">{tab === 'About' ? 'Introduce your business, tell your story and show customers what makes you different.' : tab === 'Services' ? 'List your services, share your menu or feature your best work. Your page brings the essentials together.' : 'Your business address, opening hours and directions can live here.'}</p></div></>}
    {variant === 'executive' && <div className="mt-5 border-y border-current/20 py-6"><p className="text-xs uppercase tracking-widest opacity-60">Made around your brand</p><h2 className="mt-3 text-2xl font-bold">Space for your story.</h2><p className="mt-2 text-sm opacity-65">Custom sections, portfolio highlights and a design that feels like your business.</p></div>}
    <p role="status" className="mt-5 min-h-10 text-sm opacity-70">{notice}</p>
    <div className="mt-5 border-t border-current/20 pt-6 text-center"><p className="mb-3 text-[10px] uppercase tracking-widest opacity-50">Powered by</p><Wordmark className="text-xl" /></div>
   </div>
 </article>;
}
