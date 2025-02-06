import Header from "@/components/header";
import TabNav from "@/components/tabnav";

export default function LayoutOptions({ 
  children 
}:{ 
  children: React.ReactNode;
}){
  return(
    <div>
      <div className="mt-4 mb-6">
				<Header title="Utente Registrado"/>
			</div>
      <div>
        <TabNav
          idAsIndexPage
          keyParam="patientId"
          baseUrl="/clinical/patient"
          subPaths={[
            { path: "", title: "Ficha de Cadastro" },
            { path: "schedule-appointment", title: "Agendar Consulta" },
            { path: "schedule-exam", title: "Agendar Exame" },
            { path: "card", title: "Cartão do Utente" }
          ]}
        />
        <div className="bg-white px-3 lg:px-16 py-5 rounded-b-xl border border-t-0 max-h-sizeTab overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}