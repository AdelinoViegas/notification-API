import { redirect } from "next/navigation";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import DischargeDetailView from "@/components/discharge-history/discharge-detail-view";
import { getDischargeRecord } from "@/backend/api/clinical/discharge-history-api";
import Button from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";

export const dynamic = "force-dynamic";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const record = await getDischargeRecord(id);

  if (!record) redirect("/clinical/discharge-history");

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/clinical/discharge-history">
          <Button type="button" cancel className="flex items-center gap-2">
            <IoArrowBack className="size-4" />
            Voltar
          </Button>
        </Link>
      </div>

      <div className="my-4 text-center pt-3 text-white bg-gray-500 rounded-lg">
        <Header center title="Processo Bloqueado — Somente Leitura" />
      </div>

      <Card className="p-6">
        <DischargeDetailView record={record} />
      </Card>
    </div>
  );
}
