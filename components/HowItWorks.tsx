import { NfcWaves } from "./Brand";
import { Container } from "./ui";

const steps = [
  { n: "01", title: "Tap", body: "A customer taps their phone on your TapSpot product." },
  { n: "02", title: "Open", body: "The phone opens the page you chose: your review page, Facebook page or profile." },
  { n: "03", title: "Connect", body: "They can review, follow, contact or save your details without typing or searching." },
];

export function HowItWorks({ heading = "Tap. Open. Connect." }: { heading?: string }) {
  return (
    <section id="how-it-works" className="bg-paper py-20 sm:py-24">
      <Container>
        <h2 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">{heading}</h2>
        <p className="mt-4 max-w-xl text-lg text-mute">Simple for you. Simpler for your customer.</p>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((s) => (
            <li key={s.n} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-line">
              <span className="text-sm font-bold text-brand">{s.n}</span>
              <h3 className="mt-3 text-2xl font-bold">{s.title}</h3>
              <p className="mt-2 leading-relaxed text-mute">{s.body}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex items-center gap-3 text-sm text-mute">
          <NfcWaves className="h-5 w-5 text-brand" />
          Each NFC chip opens one destination. A bundle has two separate displays, one per destination.
        </div>
      </Container>
    </section>
  );
}

/** Animated visual: NFC display → phone → destination. Pure CSS, respects reduced motion. */
export function TapDemo() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">See the tap in action.</h2>
          <p className="mt-4 max-w-md text-lg text-mute">The phone touches the display. The page opens. That's the whole experience for your customer.</p>
        </div>
        <div aria-hidden className="relative mx-auto flex h-72 w-full max-w-md items-center justify-between rounded-3xl bg-ink px-8 text-white">
          <div className="relative grid h-28 w-24 place-items-center rounded-2xl bg-white text-ink">
            <span className="tap-wave absolute inset-0 rounded-2xl border-2 border-brand" />
            <span className="tap-wave absolute inset-0 rounded-2xl border-2 border-brand" />
            <NfcWaves className="h-10 w-10" />
          </div>
          <div className="phone-bob relative h-52 w-28 rounded-[1.6rem] border-4 border-neutral-600 bg-neutral-900 p-2">
            <div className="h-full rounded-[1.1rem] bg-white p-2.5 text-ink">
              <p className="text-[10px] font-bold text-neutral-500">google.com</p>
              <div className="mt-2 h-14 rounded-lg bg-neutral-200" />
              <p className="mt-2 text-xs font-bold">Your Business</p>
              <div className="mt-2 grid h-7 place-items-center rounded-full bg-[#1F4FB8] text-[10px] font-bold text-white">Write a review</div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
