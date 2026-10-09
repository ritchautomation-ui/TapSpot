import fs from 'node:fs';
import ts from 'typescript';
import nextEnv from '@next/env';
nextEnv.loadEnvConfig(process.cwd());
const source = fs.readFileSync('config/store.ts', 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { storeConfig: s } = await import('data:text/javascript;base64,' + Buffer.from(js).toString('base64'));
const errors = [];
try { const u = new URL(s.siteUrl); if (u.protocol !== 'https:' || /localhost|example\.|127\.0\.0\.1/.test(u.hostname)) errors.push('Set your real public HTTPS site URL.'); } catch { errors.push('Set a valid public site URL.'); }
const c = s.contact;
if (!c.messengerUrl && !c.facebookUrl && !c.email && !c.phone) errors.push('Add at least one real contact method so customers can reach you.');
if (c.email && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email) || /example\./.test(c.email))) errors.push('Use your real business email.');
if (c.phone && !/^(\+?63|0)9\d{9}$/.test(c.phone.replace(/[\s()-]/g, ''))) errors.push('Use a valid Philippine mobile number.');
for (const key of ['facebookUrl','messengerUrl']) if (c[key]) {
 try { const u = new URL(c[key]); if (u.protocol !== 'https:' || u.pathname === '/' || !u.hostname.match(/^(www\.)?(facebook\.com|m\.me|messenger\.com)$/)) errors.push(`Set your actual Facebook page / Messenger address in ${key}.`); } catch { errors.push(`Invalid ${key}.`); }
}
if(errors.length) { console.error('Before public launch:\n' + errors.map(e => '- '+e).join('\n')); process.exitCode=1; }
else console.log('Public URL and contact configuration pass. Confirm package inclusions and contact delivery manually before sharing.');
