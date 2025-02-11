import Button from "@/components/ui/button";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { 
	diagnosticInternalComponent,
	diseaseDataInternalComponent,
	diseasesInternalComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examsInternalComponent,
	familyHistoryComponent,
	familyInternalComponent,
	//gestationComponent,
	historyOFDiseaseComponent,
	lifeStyleHabitsComponent,
	lifeStyleInternalComponent,
	othersInternalComponent,
	personalHistoryComponent,
	phisicalExamComponent,
	purposeOfTreatmentComponent,
	//prenatalExamsComponent,
	//symptomsComponent,
	symptomsInternalComponent,
	treatmentAndCareComponent
} from "@/lib/internal-components";
import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import Hospitalization from "@/components/hospitalization";
import CardiopulmonaryMedicine from "@/components/urgency-bank/anamnesis/cardiopulmonary-medicine";

export default async function Page({ params }: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	const anamnesis = await getPatientUrgencyBank(patientId);

	const symptoms = symptomsInternalComponent(anamnesis.generalClinic.symptoms);
	const diseaseData = diseaseDataInternalComponent(anamnesis.generalClinic?.diseaseData);
	const complementaryExams = examsInternalComponent(anamnesis?.generalClinic?.complementaryExams);
	const diagnostic = diagnosticInternalComponent();
	const diseases = diseasesInternalComponent(anamnesis.generalClinic.diseases);
  const others = othersInternalComponent(anamnesis?.generalClinic?.others);
	const evaluation = evaluationInternalComponent(anamnesis?.generalClinic.evaluation);
  const lifeStyle = lifeStyleInternalComponent(anamnesis.generalClinic.lifeStyle);
	const eatingHabits = eatingHabitsInternalComponent(anamnesis.generalClinic.eatingHabits);
  const family = familyInternalComponent(anamnesis?.generalClinic.diseasesInFamily);
	//const gestation = gestationComponent();
	//const signs = symptomsComponent();
	//const prenatal = prenatalExamsComponent();
  const history = historyOFDiseaseComponent();
  const phisicalExam = phisicalExamComponent();
  const historical = personalHistoryComponent();
  const familyHistory = familyHistoryComponent();
  const lifeStyleHabits = lifeStyleHabitsComponent();
  const treatmentAndCare = treatmentAndCareComponent();
  const purposeOfTreatment = purposeOfTreatmentComponent();

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
		family
	];

	/*const childrensMedicine:InternalComponent[] = [
		gestation,
		signs,
		prenatal,
	];*/

	const cardioPulmunaryMedicine:InternalComponent[] = [
		symptoms,
		history,
		phisicalExam,
		complementaryExams,
		diagnostic,
		historical,
    familyHistory,
		lifeStyleHabits,
		treatmentAndCare,
		purposeOfTreatment,
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

				{/*<GlobalComponent
				  {...{patientId}}
					title="MEDICINA MATERNO INFANTIL"
					components={childrensMedicine} 
				/>*/}

				<CardiopulmonaryMedicine/>

				<GlobalComponent
					{...{patientId}}
					title="MEDICINA CARDIOPULMUNAL"
					components={cardioPulmunaryMedicine} 
				/>
			</div>
		</main>
	)
}
