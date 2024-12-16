import TabPatient from "@/components/clinical/tab-patient";
import Header from "@/components/header";

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
        <TabPatient />
        <div className="bg-white px-3 lg:px-16 py-5 rounded-b-xl border border-t-0 max-h-sizeTab overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}