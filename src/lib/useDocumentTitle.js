import { useEffect } from "react";

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — fondos.0km.app` : "fondos.0km.app";
  }, [title]);
}
