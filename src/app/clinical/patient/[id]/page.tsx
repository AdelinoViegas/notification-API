import Header from "@/components/header";
import TabNav from "@/components/tabnav";
import SendToScreening from "@/components/send-screening";
import Card from "@/components/ui/card";
import PatientForm from "@/components/forms/patient-form";
import ScheduleAppointment from "@/components/forms/schedule-appointment";
import RequestExams from "@/components/forms/request-exam";
import ScheduleSugery from "@/components/forms/schedule-sugery";

type MyRoute = "patient" | "appointment" | "exams" | "sugery";

export default async function Page({ 
	params,
	searchParams 
}:{ 
	params: Promise<{ id: string }>;
	searchParams: Promise<{ r: MyRoute }>;
}){
	const [{ id }, { r }] = await Promise.all([
		params,
		searchParams
	]);
	
	return(
		<div>
			<div className="mt-4 mb-6">
				<Header title="Utente Registrado">
          <SendToScreening />
				</Header>
			</div>
		
			<Card className="max-h-[80vh]">
        <TabNav
          keyParam="" 
          useReactHook
					idAsIndexPage
					baseUrl="/clinical/patient"
					subPaths={[
						{ path: "patient", title: "Ficha de Cadastro" },
						{ path: "appointment", title: "Agendar Consulta" },
						{ path: "exams", title: "Agendar Exame" },
						{ path: "sugery", title: "Agendar Cirurgia" }
					]}
        />

        <div className="max-h-[60vh] overflow-auto px-2 py-3">
         { r === "patient" && <PatientForm patientId={id}/> }
				 { r === "appointment" &&  <ScheduleAppointment patientId={id} /> }
				 { r === "exams" &&  <RequestExams patientId={id} isFullWindow /> }
         { r === "sugery" &&  <ScheduleSugery patientId={id} /> }
        </div>
      </Card>
		</div>
	)
}