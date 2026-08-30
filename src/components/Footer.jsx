import DisclaimerBanner from "./DisclaimerBanner";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <DisclaimerBanner compact />
        <p className="text-xs text-slate-500">
          fondos.0km.app — parte del ecosistema 0km · Soluciones digitales
        </p>
      </div>
    </footer>
  );
}
