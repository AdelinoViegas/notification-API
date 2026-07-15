"use client";

import Button from "@/components/ui/button";
import { FaFilePdf } from "react-icons/fa";
import { generateBodyExitGuide, type BodyExitGuideData } from "@/lib/morgue-pdf";

export default function BodyExitGuidePdf({
  data,
  onDone,
}: {
  data: Record<string, unknown>;
  onDone: () => void;
}) {
  return (
    <div className="space-y-4 py-4">
      <p className="text-sm text-green-700 font-medium">
        ✓ Saída do utente registada com sucesso. Gere a guia antes de sair.
      </p>
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={() => generateBodyExitGuide(data as unknown as BodyExitGuideData)}
          className="flex items-center gap-2"
        >
          <FaFilePdf className="size-4" />
          Gerar Guia de Saída do Utente (A4)
        </Button>
        <Button type="button" cancel onClick={onDone}>
          Concluir sem imprimir
        </Button>
      </div>
    </div>
  );
}
