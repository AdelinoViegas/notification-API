import Button from "@/components/ui/button";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { 
	diagnosticInternalComponent,
	diseaseCardioPulmunaryComponent,
	diseaseInGeneralClinicComponent,
	diseaseinOphthalmologyComponent,
	diseasesInternalComponent,
	diseasesPediatricComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examAndEvaluationComponent,
	examsInternalComponent,
	eyeExamsComponent,
	familyHistoryCardioPulmunaryComponent,
	familyHistoryOphthalmologyComponent,
	familyInternalComponent,
	foodInPediatricComponent,
	//gestationComponent,
	lifeStyleHabitsComponent,
	lifeStyleInternalComponent,
	othersInternalComponent,
	personalHistoryCardioPulmunaryComponent,
	personalHistoryOphthalmologyComponent,
	personalHistoryPediatricComponent,
	phisicalExamComponent,
	socialHistoryComponent,
	//prenatalExamsComponent,
	//symptomsComponent,
	symptomsInternalComponent,
	systemsReviewComponent,
	therapyAndCareComponent,
	therapyAndCareobjectiveComponent,
	treatmentAndCareComponent,
	treatmentAndCareObjectiveComponent,
} from "@/lib/internal-components";
import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";
import Hospitalization from "@/components/hospitalization";
import PediatricMedicine from "@/components/urgency-bank/anamnesis/pediatric-medicine";

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
  const diseaseCardioPulmunary = diseaseCardioPulmunaryComponent();
  const phisicalExam = phisicalExamComponent();
  const historicalCardioPulmunary = personalHistoryCardioPulmunaryComponent();
  const familyHistoryCardioPulmunary = familyHistoryCardioPulmunaryComponent();
  const lifeStyleHabits = lifeStyleHabitsComponent();
  const treatmentAndCare = treatmentAndCareComponent();
  const treatmentAndCareObjective = treatmentAndCareObjectiveComponent();
  const diseaseinOphthalmology = diseaseinOphthalmologyComponent(); 
  const eyesExams = eyeExamsComponent();
  const historicalOphthalmology = personalHistoryOphthalmologyComponent();
  const familyHistoryOphthalmology = familyHistoryOphthalmologyComponent();
  const socialHistory = socialHistoryComponent();
  const systemsReview = systemsReviewComponent();
  const therapyAndCare = therapyAndCareComponent();
	const therapyAndCareobjective = therapyAndCareobjectiveComponent();
  const diseasesPediatric = diseasesPediatricComponent();
  const examAndEvaluation = examAndEvaluationComponent();
	const historicalPediatric = personalHistoryPediatricComponent();
  const foodInPediatric = foodInPediatricComponent(); 

	const generalClinical:InternalComponent[] = [
		symptoms,
		diseaseInGeneralClinic,
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
		diseaseCardioPulmunary,
		phisicalExam,
		complementaryExams,
		diagnostic,
		historicalCardioPulmunary,
    familyHistoryCardioPulmunary,
		lifeStyleHabits,
		treatmentAndCare,
		treatmentAndCareObjective,
	];
	
	const ophthalmologyService:InternalComponent[] = [
		symptoms,
		diseaseinOphthalmology,
		eyesExams,
		complementaryExams,
		diagnostic,
		historicalOphthalmology,
		familyHistoryOphthalmology,
		socialHistory,
		systemsReview,
		therapyAndCare,
		therapyAndCareobjective,
	];

	const pediatricMedicine:InternalComponent[] = [
		symptoms,
		diseasesPediatric,
		complementaryExams,
		examAndEvaluation,
		diagnostic,
		examAndEvaluation,
		historicalPediatric,
		foodInPediatric,
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

				<GlobalComponent
					{...{patientId}}
					title="MEDICINA CARDIOPULMUNAL"
					components={cardioPulmunaryMedicine} 
				/>

				<GlobalComponent
					{...{patientId}}
					title="SERVIÇO DE OFTALMOLOGIA"
					components={ophthalmologyService} 
				/>

				<PediatricMedicine/>

				<GlobalComponent
					{...{patientId}}
					title="MEDICINA PEDIÁTRICA"
					components={pediatricMedicine} 
				/>
			</div>
		</main>
	)
}
