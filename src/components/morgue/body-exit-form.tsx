"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";
import Accordium from "@/components/ui/accordium";
import { registerBodyExit } from "@/backend/api/clinical/morgue-api";
import { toast } from "react-toastify";
import BodyExitGuidePdf from "@/components/morgue/body-exit-guide-pdf";
import type { MorguePatientDetail } from "@/backend/api/clinical/morgue-api";
import { kinshipDegree } from "@/backend/api/clinical/translator";

type ExitData = Record<string, unknown>;

const DESTINATION_OPTIONS = [
  { _id: "home", label: "Casa" },
  { _id: "cemetery", label: "Cemitério" },
  { _id: "wake", label: "Velório" },
  { _id: "military_unit", label: "Unidade Militar" },
  { _id: "other", label: "Outro" },
];

export default function BodyExitForm({
  accommodationId,
  patientId,
}: {
  accommodationId: string;
  patientId: string;
  patientData: MorguePatientDetail;
}) {
  const [state, action] = useActionState(registerBodyExit, {
    message: "",
    status: false,
  });
  const [transportType, setTransportType] = useState<"family" | "funeral_agency">("family");
  const [destination, setDestination] = useState("home");
  const [exitData, setExitData] = useState<ExitData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!state.message) return;
    if (state.status) {
      toast.success(state.message);
      if (state.exitData) setExitData(state.exitData as ExitData);
    } else {
      toast.error(state.message);
    }
  }, [state]);

  if (exitData) {
    return (
      <BodyExitGuidePdf
        data={exitData}
        onDone={() => router.replace("/clinical/morgue?r=a")}
      />
    );
  }

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="accommodationId" value={accommodationId} />
      <input type="hidden" name="patientId" value={patientId} />

      {/* a) Dados do falecido — só leitura, já exibidos na página acima */}

      {/* b) Responsável pela saída do corpo */}
      <Accordium title="b) Responsável pela Saída do Corpo" open>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField textLabel="Nome do Responsável" name="responsibleExitName" required />
          <InputField textLabel="Nº do Bilhete de Identidade" name="responsibleExitBI" required />
          <InputField textLabel="Contacto" name="responsibleExitContact" type="tel" required />
          <Selection
            label="Parentesco"
            name="responsibleExitKinship"
            options={kinshipDegree}
            required
          />
        </div>
      </Accordium>

      {/* c) Transportador */}
      <Accordium title="c) Transportador" open>
        <div className="flex gap-6 mb-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="transportType"
              value="family"
              checked={transportType === "family"}
              onChange={() => setTransportType("family")}
            />
            <span className="text-sm font-medium">Família</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="transportType"
              value="funeral_agency"
              checked={transportType === "funeral_agency"}
              onChange={() => setTransportType("funeral_agency")}
            />
            <span className="text-sm font-medium">Agência Funerária</span>
          </label>
        </div>

        {transportType === "family" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField textLabel="Nome" name="transportFamilyName" required />
            <Selection
              label="Parentesco"
              name="transportFamilyKinship"
              options={kinshipDegree}
              required
            />
            <InputField textLabel="Nº do BI" name="transportFamilyBI" required />
            <InputField textLabel="Contacto" name="transportFamilyContact" type="tel" required />
          </div>
        )}

        {transportType === "funeral_agency" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField textLabel="Nome da Agência" name="transportAgencyName" required />
            <InputField textLabel="Responsável" name="transportAgencyResponsible" required />
            <InputField textLabel="Motorista" name="transportAgencyDriver" required />
            <InputField textLabel="Marca/Modelo do Veículo" name="transportAgencyVehicleBrand" required />
            <InputField textLabel="Cor do Veículo" name="transportAgencyVehicleColor" required />
            <InputField textLabel="Matrícula" name="transportAgencyLicensePlate" required />
          </div>
        )}
      </Accordium>

      {/* d) Documentos obrigatórios */}
      <Accordium title="d) Documentos Obrigatórios" open>
        <div className="space-y-3">
          {[
            { name: "docDeathCertificate", label: "Certificado de Óbito" },
            { name: "docFamilyAuthorization", label: "Autorização da Família (se aplicável)" },
            { name: "docAgencyTransportGuide", label: "Guia de Transporte da Agência (se aplicável)" },
            { name: "docJudicialAuthorization", label: "Autorização Judicial (se aplicável)" },
          ].map(({ name, label }) => (
            <label key={name} className="flex items-center gap-3 cursor-pointer select-none">
              <input type="checkbox" name={name} className="size-4 rounded" />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </Accordium>

      {/* e) Destino */}
      <Accordium title="e) Destino" open>
        <div className="space-y-3">
          {DESTINATION_OPTIONS.map(({ _id, label }) => (
            <label key={_id} className="flex items-center gap-3 cursor-pointer select-none">
              <input
                type="radio"
                name="destinationType"
                value={_id}
                checked={destination === _id}
                onChange={() => setDestination(_id)}
                required
                className="size-4"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}

          {destination === "other" && (
            <InputField
              textLabel="Descreva o Destino"
              name="destinationOther"
              placeholder="Indique o destino..."
              required
            />
          )}
        </div>
      </Accordium>

      <div className="flex gap-3 pt-2">
        <Button type="submit">Confirmar Saída</Button>
        <Button
          type="button"
          cancel
          onClick={() => router.back()}
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
}
