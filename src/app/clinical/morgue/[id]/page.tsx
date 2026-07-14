import Card from "@/components/ui/card";
import Header from "@/components/header";
import Tag from "@/components/ui/tag";
import { Field } from "@/components/discharge-history/discharge-detail-view";
import AccommodateForm from "@/components/morgue/accommodate-form";
import { getMorguePatientDetail } from "@/backend/api/clinical/morgue-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: patientId } = await params;
  const patient = await getMorguePatientDetail(patientId);

  if (!patient) redirect("/clinical/morgue?r=w");

  return (
    <main className="space-y-3 overflow-y-auto max-h-[calc(100dvh-4rem)] pr-1">

      <Header title="Acomodação na Morgue" />

      <Card className="p-6">
        <Tag className="inline-flex mb-4">Dados do Falecido</Tag>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Nome Completo" value={patient.fullname} />
          <Field label="Sexo" value={patient.gender} />
          <Field label="Nº de Processo" value={patient.processNumber} />
          <Field label="Serviço de Internamento" value={patient.service} />
          <Field label="Data/Hora de Admissão" value={patient.admissionDate} />
          <Field label="Data/Hora do Óbito" value={patient.dateOfDeath} />
        </div>

        <Tag className="inline-flex mb-4">Acomodação</Tag>
        <AccommodateForm patientId={patientId} />
      </Card>
    </main>
  );
}
