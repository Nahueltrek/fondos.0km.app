import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import Filters from "../components/Filters";
import FundCard from "../components/FundCard";
import { fetchFondos } from "../lib/api";

export default function FondosExplorer() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [fondos, setFondos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [filters, setFilters] = useState({
    categoria: searchParams.get("categoria") ?? "",
    region: searchParams.get("region") ?? "",
    estado: searchParams.get("estado") ?? "",
  });

  useEffect(() => {
    fetchFondos().then((data) => {
      setFondos(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const params = {};
    if (query) params.q = query;
    if (filters.categoria) params.categoria = filters.categoria;
    if (filters.region) params.region = filters.region;
    if (filters.estado) params.estado = filters.estado;
    setSearchParams(params, { replace: true });
  }, [query, filters, setSearchParams]);

  const filtered = useMemo(() => {
    return fondos.filter((f) => {
      const matchesQuery =
        !query ||
        f.name.toLowerCase().includes(query.toLowerCase()) ||
        f.description?.toLowerCase().includes(query.toLowerCase());
      const matchesCategoria =
        !filters.categoria || f.categories?.includes(filters.categoria);
      const matchesRegion = !filters.region || f.regions?.includes(filters.region);
      const matchesEstado = !filters.estado || f.status === filters.estado;
      return matchesQuery && matchesCategoria && matchesRegion && matchesEstado;
    });
  }, [fondos, query, filters]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-brand-dark mb-6">Explorador de fondos</h1>

      <div className="space-y-3 mb-8">
        <SearchBar value={query} onChange={setQuery} />
        <Filters filters={filters} onChange={setFilters} />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando fondos…</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">
          No encontramos fondos con esos filtros. Prueba ajustando la búsqueda.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((f) => (
            <FundCard key={f.slug} fondo={f} />
          ))}
        </div>
      )}
    </div>
  );
}
