# fondos-0km-app

MVP de `fondos.0km.app` — plataforma de oportunidades, financiamiento y
proyectos digitales del ecosistema 0km.

Este proyecto es **independiente** de `nahueltrek-site` (el otro proyecto
en este mismo repositorio): tiene su propio `package.json`, su propio
build y su propio despliegue. Ver `../ARCHITECTURE_FONDOS_0KM.md` para el
porqué de esta decisión.

## Desarrollo local

```bash
cd fondos-0km-app
npm install
cp .env.example .env   # opcional: sin esto, la app usa datos de ejemplo
npm run dev
```

Sin `VITE_SUPABASE_URL`/`VITE_SUPABASE_ANON_KEY` configurados, la app
funciona igual pero muestra fondos de **ejemplo** claramente marcados como
tales (ver `src/data/fondosPlaceholder.js`) — nunca datos reales
inventados (ver `../DATA_GOVERNANCE_FONDOS_0KM.md`).

## Estado

Ver `../EVOLUTION_FONDOS_0KM.md` para el roadmap completo y qué está
implementado en esta iteración vs. pendiente.

## Documentos del proyecto

- `../AUDIT_FONDOS_0KM.md`
- `../ARCHITECTURE_FONDOS_0KM.md`
- `../DATA_GOVERNANCE_FONDOS_0KM.md`
- `../EVOLUTION_FONDOS_0KM.md`
