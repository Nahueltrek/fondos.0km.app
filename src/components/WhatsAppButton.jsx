import { MessageCircle } from "lucide-react";
import { track } from "../lib/analytics";

const WHATSAPP_NUMBER = ""; // TODO: definir número real de 0km antes de publicar.

// Mensajes exactos de la sección 37 del Master Plan.
const DEFAULT_MESSAGE =
  "Hola, quiero evaluar un proyecto con 0km. Encontré una oportunidad y necesito ayuda para desarrollar mi proyecto.";

export function fundWhatsAppMessage(fundName) {
  return `Hola, encontré el fondo ${fundName} en fondos.0km.app y quiero evaluar un proyecto relacionado.`;
}

export default function WhatsAppButton({ message = DEFAULT_MESSAGE }) {
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
