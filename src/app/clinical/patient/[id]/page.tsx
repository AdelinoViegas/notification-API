import Header from "@/components/header";
import TabNav from "@/components/tabnav";
import SendToScreening from "@/components/send-screening";
import Card from "@/components/ui/card";
import PatientForm from "@/components/forms/patient-form";
import ScheduleAppointment from "@/components/forms/schedule-appointment";
import RequestExams from "@/components/forms/request-exam";

type Route = "patient" | "appointment" | "exams";

export default async function Page({ 
	params,
	searchParams 
}:{ 
	params: Promise<{ id: string }>;
	searchParams: Promise<{ r: Route }>;
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
						// { path: "card", title: "Cartão do Utente" }
					]}
        />

        <div className="max-h-[60vh] overflow-auto px-2 py-3">
         { r === "patient" && <PatientForm patientId={id} /> }
				 { r === "appointment" &&  <ScheduleAppointment patientId={id} /> }
				 { r === "exams" &&  <RequestExams patientId={id} isFullWindow /> }
        </div>
      </Card>
		</div>
	)
}