import TabScreening from "@/components/clinical/tab-screening";
import Header from "@/components/header";
import { getPatient } from "@/app/backend/api/clinical/api";
import { openPatientProcess } from "@/app/backend/api/clinical/process-api";
import ProcessAlert from "@/components/process-alert";
import CloseProcess from "@/components/close-process";
import ArchiveButton from "@/components/archive-button";

export default async function Layout({ 
  children,
  params
}:{ 
  children: React.ReactNode;
  params: Promise<{
    patientId: string;
  }>
}){
  const { patientId } = await params;
  const patient = await getPatient(patientId); 
  const processState = await openPatientProcess(patientId, "screening");

  return(
    <div>
      <div className="mt-4 mb-6">
				<Header 
          center 
          title={patient?.personal.fullname as string}
        />
			</div>

      <div className="flex gap-3">
        <CloseProcess />
        <ArchiveButton />
      </div>
      
      <div>
        <TabScreening />
        <div className="bg-white px-3 lg:px-16 py-5 rounded-b-xl border border-t-0 max-h-sizeTab overflow-auto">
          {children}
        </div>
      </div>
      {
        (processState && !processState?.status) &&
        <ProcessAlert />
      }
    </div>
  )
}