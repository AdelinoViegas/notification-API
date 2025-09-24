import RequestExams from "@/components/forms/request-exam";
import Accordium from "@/components/ui/accordium";
import Refresh from "@/components/refresh";
import ExamHistory from "@/components/exam-history";

export default async function Page({ params }: { params: Promise<{ patientId: string }>}){
  const { patientId } = await params;
  
  return(
    <main>
      <Refresh />
      <Accordium title="Solicitação de Exames">
        <RequestExams {...{patientId}} isFullWindow />
      </Accordium>

      <ExamHistory patientId={patientId} />
    </main>
  );
}