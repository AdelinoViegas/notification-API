import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import Tag from "@/components/ui/tag";
import { Field } from "@/components/discharge-history/discharge-detail-view";
import BodyExitForm from "@/components/morgue/body-exit-form";
import { getMorgueAccommodationDetail } from "@/backend/api/clinical/morgue-api";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: accommodationId } = await params;
  const detail = await getMorgueAccommodationDetail(accommodationId);

  if (!detail) redirect("/clinical/morgue?r=a");

  return (
    <main className="space-y-3">
      <div className="flex items-center gap-3">
        <Link href="/clinical/morgue?r=a">
          <Button type="button" cancel className="flex items-center gap-2">
            <IoArrowBack className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <Header title="Registo de Saída do Utente" />

      <Card className="p-6">
        <Tag className="inline-flex mb-4">Dados do Utente</Tag>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Field label="Nome Completo" value={detail.fullname} />
          <Field label="Sexo" value={detail.gender} />
          <Field label="Idade" value={detail.age} />
          <Field label="Nº de Processo" value={detail.processNumber} />
          <Field label="Data/Hora do Óbito" value={detail.dateOfDeath} />
          <Field label="Responsável pela Entrada" value={detail.responsibleName} />
          <Field label="Contacto" value={detail.responsibleContact} />
          <Field label="Parentesco" value={detail.responsibleKinship} />
        </div>

        <BodyExitForm
          accommodationId={accommodationId}
          patientId={detail.patientId}
          patientData={detail}
        />
      </Card>
    </main>
  );
}
