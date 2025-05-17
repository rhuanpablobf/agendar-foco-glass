
import React from "react";
import { Loader2 } from "lucide-react";

export function ClientComboboxLoading() {
  return (
    <div className="py-6 text-center text-sm flex items-center justify-center">
      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      Buscando...
    </div>
  );
}
