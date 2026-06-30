import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Button from "@/components/ui/button";
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
    <main className="space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/clinical/morgue?r=w">
          <Button type="button" cancel className="flex items-center gap-2">
            <IoArrowBack className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

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
