import Button from "@/components/ui/button";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { 
	diagnosticInternalComponent,
	diseaseDataInternalComponent,
	diseasesInternalComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examsInternalComponent,
	familyInternalComponent,
	gestationComponent,
	lifeStyleInternalComponent,
	othersInternalComponent,
	prenatalExams,
	symptomsComponent,
	symptomsInternalComponent
} from "@/lib/internal-components";
import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import Hospitalization from "@/components/hospitalization";

export default async function Page({ params }: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	const anamnesis = await getPatientUrgencyBank(patientId);

	/*Clinica geral*/
	const symptoms = symptomsInternalComponent(anamnesis.generalClinic.symptoms);
	const diseaseData = diseaseDataInternalComponent(anamnesis.generalClinic?.diseaseData);
	const complementaryExams = examsInternalComponent(anamnesis?.generalClinic?.complementaryExams);
	const diagnostic = diagnosticInternalComponent();
	const diseases = diseasesInternalComponent(anamnesis.generalClinic.diseases);
  const others = othersInternalComponent(anamnesis?.generalClinic?.others);
	const evaluation = evaluationInternalComponent(anamnesis?.generalClinic.evaluation);
  const lifeStyle = lifeStyleInternalComponent(anamnesis.generalClinic.lifeStyle);
	const eatingHabits = eatingHabitsInternalComponent(anamnesis.generalClinic.eatingHabits);
  const familyHistory = familyInternalComponent(anamnesis?.generalClinic.diseasesInFamily);
  
	/*Medicina materno infantil*/
	const gestation = gestationComponent();
	const signs = symptomsComponent();
	const prenatal = prenatalExams();

	const generalClinical:InternalComponent[] = [
		symptoms,
		diseaseData,
		complementaryExams,
		diagnostic,
		diseases,
		others,
		evaluation,
		lifeStyle,
		eatingHabits,
		familyHistory
	];

	const childrensMedicine:InternalComponent[] = [
		gestation,
		signs,
		prenatal,
	];
	
  return(
		<main className="relative">
			<div className="flex gap-x-3">
				<Button>Visualizar</Button>
				<Hospitalization/>
			</div>

			<div className="flex flex-col gap-y-3 mt-4">
				<GlobalComponent
				  {...{patientId}}
					title="CLINICA GERAL"
					components={generalClinical} 
				/>

				<GlobalComponent
				  {...{patientId}}
					title="MEDICINA MATERNO INFANTIL"
					components={childrensMedicine} 
				/>
			</div>
		</main>
	)
}
