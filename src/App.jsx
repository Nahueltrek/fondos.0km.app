import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import FondosExplorer from "./pages/FondosExplorer";
import FondoDetail from "./pages/FondoDetail";
import Diagnostico from "./pages/Diagnostico";
import Soluciones from "./pages/Soluciones";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fondos" element={<FondosExplorer />} />
          <Route path="/fondos/:slug" element={<FondoDetail />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/soluciones" element={<Soluciones />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
