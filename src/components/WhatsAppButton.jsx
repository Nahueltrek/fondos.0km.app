import { MessageCircle } from "lucide-react";
import { track } from "../lib/analytics";

// Fase 1, punto 13: número vía variable de entorno, nunca hardcodeado.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? "";

// Mensajes exactos de la sección 37 del Master Plan.
const DEFAULT_MESSAGE =
  "Hola, quiero evaluar un proyecto con 0km. Encontré una oportunidad y necesito ayuda para desarrollar mi proyecto.";

export function fundWhatsAppMessage(fundName) {
  return `Hola, encontré el fondo ${fundName} en fondos.0km.app y quiero evaluar un proyecto relacionado.`;
}

export default function WhatsAppButton({ message = DEFAULT_MESSAGE }) {
  // Fase 1, punto 28: si no está configurado, el CTA se oculta —
  // nunca se muestra un enlace roto (wa.me sin número).
  if (!WHATSAPP_NUMBER) return null;

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir por WhatsApp"
      onClick={() => track("whatsapp_clicked")}
      className="fixed bottom-5 right-5 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg transition"
    >
      <MessageCircle size={24} />
    </a>
  );
}
