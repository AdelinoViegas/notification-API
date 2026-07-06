"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import {
  accommodatePatient,
  getChambers,
  getAvailableDrawers,
} from "@/backend/api/clinical/morgue-api";
import { toast } from "react-toastify";
import AccommodationGuidePdf from "@/components/morgue/accommodation-guide-pdf";
import type { AccommodationGuideData } from "@/lib/morgue-pdf";
import { kinshipDegree } from "@/backend/api/clinical/translator";

export default function AccommodateForm({ patientId }: { patientId: string }) {
  const [state, action] = useActionState(accommodatePatient, {
    message: "",
    status: false,
  });
  const [chambers, setChambers] = useState<SelectionOption[]>([]);
  const [drawers, setDrawers] = useState<SelectionOption[]>([]);
  const [selectedChamber, setSelectedChamber] = useState("");
  const [guideData, setGuideData] = useState<AccommodationGuideData | null>(null);
  const router = useRouter();

  useEffect(() => {
    getChambers().then(setChambers);
  }, []);

  useEffect(() => {
    if (selectedChamber) {
      getAvailableDrawers(selectedChamber).then(setDrawers);
    } else {
      setDrawers([]);
    }
  }, [selectedChamber]);

  useEffect(() => {
    if (!state.message) return;
    if (state.status) {
      toast.success(state.message);
      if (state.guideData) {
        setGuideData(state.guideData as AccommodationGuideData);
      }
    } else {
      toast.error(state.message);
    }
  }, [state]);

  if (guideData) {
    return (
      <AccommodationGuidePdf
        data={guideData}
        onDone={() => router.replace("/clinical/morgue?r=a")}
      />
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="patientId" value={patientId} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Selection
          label="Câmara"
          name="chamberId"
          options={chambers}
          defaultOptionLabel="Selecione a câmara"
          onChange={(e) => setSelectedChamber(e.target.value)}
          required
        />

        <Selection
          label="Gaveta"
          name="drawer"
          options={drawers}
          defaultOptionLabel={
            selectedChamber
              ? drawers.length === 0
                ? "Sem gavetas disponíveis"
                : "Selecione a gaveta"
              : "Selecione primeiro a câmara"
          }
          disabled={!selectedChamber || drawers.length === 0}
          required
        />
      </div>

      <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide pt-2">
        Responsável pela Entrega do Corpo
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InputField textLabel="Nome do Responsável" name="responsibleName" required />
        <InputField textLabel="Nº do Bilhete de Identidade" name="responsibleBI" required />
        <InputField textLabel="Contacto" name="responsibleContact" type="tel" required />
        <Selection
          label="Parentesco"
          name="responsibleKinship"
          options={kinshipDegree}
          required
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit">Salvar e Gerar Guia</Button>
      </div>
    </form>
  );
}
