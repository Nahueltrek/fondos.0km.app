import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import Home from "./pages/Home";
import FondosExplorer from "./pages/FondosExplorer";
import FondoDetail from "./pages/FondoDetail";
import Diagnostico from "./pages/Diagnostico";
import Soluciones from "./pages/Soluciones";
import SolucionesTurismo from "./pages/SolucionesTurismo";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Checklist from "./pages/Checklist";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-300">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/fondos" element={<FondosExplorer />} />
          <Route path="/fondos/:slug" element={<FondoDetail />} />
          <Route path="/diagnostico" element={<Diagnostico />} />
          <Route path="/soluciones" element={<Soluciones />} />
          <Route path="/soluciones/turismo" element={<SolucionesTurismo />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/checklist" element={<Checklist />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
