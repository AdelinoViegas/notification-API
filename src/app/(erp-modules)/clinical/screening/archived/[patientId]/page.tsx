import ArchiveButton from "@/components/archive-button";
import Header from "@/components/header";

export default function Page(){
	return(
		<main>
			<div className="mt-6">
				<Header title="Utente Arquivado"/>
      </div>
			
			<ArchiveButton invert />
		</main>
	)
}