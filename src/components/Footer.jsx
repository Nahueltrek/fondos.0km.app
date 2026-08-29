import DisclaimerBanner from "./DisclaimerBanner";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <DisclaimerBanner compact />
        <p className="text-xs text-gray-400">
          fondos.0km.app — parte del ecosistema 0km · Soluciones digitales
        </p>
      </div>
    </footer>
  );
}
