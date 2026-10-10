import { NfcWaves } from "./Brand";

/**
 * Placeholder mockup of a custom branded TapSpot sign: a "YOUR LOGO" area, the
 * business name and the tap symbol. Text sizes use container units (cqw) so the
 * sign scales cleanly at any size. The printed sign stays light/black in night mode.
 * Replace with a real photo any time by adding `images` to the product in data/products.ts
 * and removing the `custom-sign` branch in ProductArtwork.tsx.
 */
export function CustomSignArtwork({ className = "" }: { className?: string }) {
  return (
    <div className={`grid place-items-center bg-neutral-100 p-[6%] ${className}`}>
      <div
        className="relative aspect-[3/4] w-[46%] overflow-hidden rounded-[7%/5%] bg-[#ffffff] shadow-lift ring-1 ring-black/10"
        style={{ containerType: "inline-size" }}
        role="img"
        aria-label="Example of a custom branded TapSpot NFC sign with your logo and a tap to connect symbol"
      >
        <div className="flex h-[48%] flex-col items-center justify-center gap-[7%] px-[6%] text-center">
          <div
            className="grid aspect-square w-[34%] place-items-center rounded-full border-2 border-dashed border-[#a3a3a3] font-bold uppercase text-[#737373]"
            style={{ fontSize: "7.5cqw" }}
          >
            Logo
          </div>
          <p className="whitespace-nowrap font-extrabold uppercase tracking-wide text-[#0A0A0A]" style={{ fontSize: "9cqw" }}>Your business</p>
        </div>
        <div className="flex h-[52%] flex-col items-center justify-center gap-[7%] bg-[#0A0A0A] px-[6%] text-center text-white">
          <div className="grid aspect-[16/10] w-[52%] place-items-center rounded-[50%] border-[3px] border-white">
            <NfcWaves className="h-[55%] text-white" />
          </div>
          <p className="whitespace-nowrap font-bold uppercase tracking-wider" style={{ fontSize: "7.5cqw" }}>
            Tap to <span className="text-brand">connect</span>
          </p>
        </div>
      </div>
    </div>
  );
}
