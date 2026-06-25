import { redirect } from "next/navigation";
import Card from "@/components/ui/card";
import Header from "@/components/header";
import DischargeDetailView from "@/components/discharge-history/discharge-detail-view";
import { getDischargeRecord } from "@/backend/api/clinical/discharge-history-api";
import Button from "@/components/ui/button";
import Link from "next/link";
import { IoArrowBack } from "react-icons/io5";
import Accordium from "@/components/ui/accordium";
import { getDataAndHoursFormat } from "@/lib/date-formater";

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
    <div className="space-y-4 pb-5">
      <div className="flex items-center gap-3">
        <Link href="/clinical/historical?r=a">
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
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {record[0].patientName}
            </h2>
            <p className="text-sm text-gray-500">
              Processo Nº {record[0].processNumber}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {/*<span
              className={clsx(
                "px-3 py-1 mt-4 rounded-full text-xs font-semibold",
                {
                  "bg-red-100 text-red-700": record.status === "locked",
                  "bg-green-100 text-green-700": record.status === "active",
                }
              )}
            >
              {record.statusLabel}
            </span>*
            <ExportPdfButton record={record} />*/}
            <span className="px-3 py-1 mt-4 rounded-full text-xs font-semibold bg-red-100 text-red-700">
              Bloqueado
            </span>
            {<Button>Gerar PDF</Button>}
          </div>
        </div>

        {record.map(props => ( 
          <Accordium extraClassName="my-6" title={`Recebeu alta em ${getDataAndHoursFormat(props.dischargeDate)}`} key={props.id}>
            <DischargeDetailView record={props} />
          </Accordium>
        ))}
      </Card>
    </div>
  );
}
