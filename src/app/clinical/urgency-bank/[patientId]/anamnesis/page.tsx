import Button from "@/components/ui/button";
import Hospitalization from "@/components/hospitalization";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { 
	diagnosticInternalComponent,
	diseaseInGeneralClinicComponent,
	diseasesInternalComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examsInternalComponent,
	familyInternalComponent,
	lifeStyleInternalComponent,
	othersComponent,
	symptomsInternalComponent,
} from "@/lib/internal-components";
import { getPatientUrgencyBank } from "@/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	const anamnesis = await getPatientUrgencyBank(patientId);

	const symptoms = symptomsInternalComponent(anamnesis.generalClinic.symptoms);
	const diseaseInGeneralClinic = diseaseInGeneralClinicComponent(anamnesis.generalClinic?.diseaseData);
	const complementaryExams = examsInternalComponent(anamnesis?.generalClinic?.complementaryExams);
	const diagnostic = diagnosticInternalComponent(JSON.stringify(anamnesis.generalClinic.diagnosticHypothesis));
	const diseases = diseasesInternalComponent(anamnesis.generalClinic.diseases);
  const others = othersComponent(anamnesis?.generalClinic?.others);
	const evaluation = evaluationInternalComponent(anamnesis?.generalClinic.evaluation);
  const lifeStyle = lifeStyleInternalComponent(anamnesis.generalClinic.lifeStyle);
	const eatingHabits = eatingHabitsInternalComponent(anamnesis.generalClinic.eatingHabits);
  const family = familyInternalComponent(anamnesis?.generalClinic.diseasesInFamily);

	const generalClinical:InternalComponent[] = [
		symptoms,
		diseaseInGeneralClinic,
		complementaryExams,
		diagnostic,
		diseases,
		evaluation,
		lifeStyle,
		eatingHabits,
		family,
		others,
	];
	
  return(
		<main className="relative">
			<div className="flex gap-x-3">
				<Button>Visualizar</Button>
				<Hospitalization id={anamnesis.id} />
			</div>

			<div className="flex flex-col gap-y-3 pt-8">
				<GlobalComponent
					itemId={patientId}
					title="CLINICA GERAL"
					components={generalClinical} 
				/>
			</div>
		</main>
	)
}
