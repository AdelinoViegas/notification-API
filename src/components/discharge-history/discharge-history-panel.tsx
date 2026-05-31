import Table from "@/components/table";
import Search from "@/components/ui/search";
import { formater } from "@/lib/table-formater";
import Pagination from "@/components/pagination";
import Refresh from "@/components/refresh";
import Alert from "@/components/ui/alert";
import PeriodFilter from "@/components/discharge-history/period-filter";
import { getDischargeHistory } from "@/backend/api/clinical/discharge-history-api";

export default async function DischargeHistoryPanel({
  name,
  processNumber,
  fromDate,
  toDate,
  page,
}: {
  name?: string;
  processNumber?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
}) {
  const data = await getDischargeHistory({
    name,
    processNumber,
    fromDate,
    toDate,
    page: page ? Number(page) : 1,
  });

  const rows = formater(data.records, {
    filterKey: [
      "id",
      "processNumber",
      "patientName",
      "internalServiceName",
      "nursingName",
      "bedName",
      "admissionDate",
      "dischargeDate",
      "dischargeType",
      "admissionDiagnosis",
      "doctorName",
      "status",
    ],
    order: [
      "processNumber",
      "patientName",
      "internalServiceName",
      "nursingName",
      "bedName",
      "admissionDate",
      "dischargeDate",
      "dischargeType",
      "admissionDiagnosis",
      "doctorName",
      "status",
    ],
  });

  return (
    <main className="space-y-3">
      <Refresh />

      <Alert
        type="info"
        message="Duplo clique sobre o registo para visualizar o processo completo em modo bloqueado."
      />

      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-3">
        <PeriodFilter />

        <div className="flex gap-x-3 items-end">
          <Search
            className="flex items-center gap-3"
            filterKey="processNumber"
            label="Nº Processo"
            placeholder="Buscar por nº processo..."
          />

          <Search
            className="flex items-center gap-3"
            filterKey="name"
            label="Nome do Paciente"
            placeholder="Buscar pelo nome..."
          />
        </div>
      </div>

      <Table
        baseRowLink="/clinical/discharge-history"
        columns={[
          "Nº Processo",
          "Nome",
          "Serviço",
          "Enfermaria",
          "Leito",
          "Data Admissão",
          "Data Alta",
          "Tipo Alta",
          "Diagnóstico",
          "Médico",
          "Estado",
        ]}
        rows={rows}
        rowLength={11}
      />

      <Pagination
        availablePages={data.availablePages as number}
        totalItems={data.totalItems as number}
      />
    </main>
  );
}
