import { useCountUp } from "../lib/useCountUp";

export default function StatCard({ icon: Icon, value, label }) {
  const { value: display, ref } = useCountUp(value);
  return (
    <div
      ref={ref}
      className="rounded-2xl bg-slate-900 border border-slate-800 p-5 hover:border-slate-700 transition-colors"
    >
      <div className="w-9 h-9 rounded-xl bg-brand-light text-brand flex items-center justify-center mb-4">
        <Icon size={18} strokeWidth={2} />
      </div>
      <div className="text-[26px] font-semibold text-white tabular-nums leading-none">
        {display.toLocaleString("es-CL")}
      </div>
      <div className="text-[13px] text-slate-500 mt-2">{label}</div>
    </div>
  );
}
