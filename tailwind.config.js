/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Tema oscuro alineado a 0km.app (ver DESIGN_SYSTEM_0KM.md).
        // brand = teal (acento primario), brand-accent = violeta (acento
        // secundario, gradientes). "dark"/"light" describen el USO
        // (hover más oscuro / superficie realzada), no que el color en
        // sí sea oscuro o claro — en tema oscuro esas superficies
        // realzadas siguen siendo oscuras.
        brand: {
          DEFAULT: "#2dd4bf",
          dark: "#14b8a6",
          accent: "#a78bfa",
          light: "#0f2b28",
        },
      },
    },
  },
  plugins: [],
};
