import DischargeHistoryPanel from "@/components/discharge-history/discharge-history-panel";

export const dynamic = "force-dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    name: string;
    processNumber: string;
    fromDate: string;
    toDate: string;
    p: string;
  }>;
}) {
  const {
    name,
    processNumber,
    fromDate,
    toDate,
    p: page,
  } = await searchParams;

  return (
    <div>
      <DischargeHistoryPanel
        name={name}
        processNumber={processNumber}
        fromDate={fromDate}
        toDate={toDate}
        page={page ? Number(page) : 1}
      />
    </div>
  );
}
