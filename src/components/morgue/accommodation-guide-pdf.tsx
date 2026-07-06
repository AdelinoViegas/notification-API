"use client";

import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";
import { generateAccommodationGuide, type AccommodationGuideData } from "@/lib/morgue-pdf";

export default function AccommodationGuidePdf({
  data,
  onDone,
}: {
  data: AccommodationGuideData;
  onDone: () => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-green-700 font-medium">
        ✓ Utente acomodado com sucesso. Gere a guia de acomodação antes de sair.
      </p>
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => generateAccommodationGuide(data)}
          className="flex items-center gap-2"
        >
          <FaFilePdf className="size-4" />
          Gerar Guia de Acomodação (A5)
        </Button>
        <Button type="button" cancel onClick={onDone}>
          Concluir sem imprimir
        </Button>
      </div>
    </div>
  );
}
