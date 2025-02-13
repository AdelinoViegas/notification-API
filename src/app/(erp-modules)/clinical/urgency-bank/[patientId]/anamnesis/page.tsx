import Button from "@/components/ui/button";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import { 
	diagnosticInternalComponent,
	diseaseCardioPulmunaryComponent,
	diseaseInGeneralClinicComponent,
	diseaseinOphthalmologyComponent,
	diseasesFamilyComponent,
	diseasesInternalComponent,
	diseasesPediatricComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examAndEvaluationComponent,
	examsInternalComponent,
	eyeExamsComponent,
	familyConditionAndEnvironmentComponent,
	familyHistoryCardioPulmunaryComponent,
	familyHistoryOphthalmologyComponent,
	familyHistoryPediatricComponent,
	familyInternalComponent,
	foodInPediatricComponent,
	immunizationInPediatricsComponent,
	gestationComponent,
	lifeStyleHabitsComponent,
	lifeStyleInternalComponent,
	othersComponent,
	pathologyInPhisicalMedicineComponent,
	personalHistoryCardioPulmunaryComponent,
	personalHistoryOphthalmologyComponent,
	personalHistoryPediatricComponent,
	phisicalExamComponent,
	phisicalExamMedicineComponent,
	socialHistoryComponent,
	prenatalExamsComponent,
	symptomsComponent,
	symptomsInternalComponent,
	systemsReviewComponent,
	therapyAndCareComponent,
	therapyAndCareobjectiveComponent,
	therapyObjectiveComponent,
	therapyPlanComponent,
	treatmentAndCareComponent,
	treatmentAndCareObjectiveComponent,
	physicalAndObstetricExamsComponent,
	obstetricsAndGynecologyComponent,
	previousBirthsComponent,
	clinicalHistoryComponent,
	familyAndSocialHistoryComponent,
	livingConditionsComponent,
	nutritionalHistoryComponent,
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

	const symptoms = symptomsInternalComponent(anamnesis.generalClinic.symptoms);
	const diseaseInGeneralClinic = diseaseInGeneralClinicComponent(anamnesis.generalClinic?.diseaseData);
	const complementaryExams = examsInternalComponent(anamnesis?.generalClinic?.complementaryExams);
	const diagnostic = diagnosticInternalComponent();
	const diseases = diseasesInternalComponent(anamnesis.generalClinic.diseases);
  const others = othersComponent(anamnesis?.generalClinic?.others);
	const evaluation = evaluationInternalComponent(anamnesis?.generalClinic.evaluation);
  const lifeStyle = lifeStyleInternalComponent(anamnesis.generalClinic.lifeStyle);
	const eatingHabits = eatingHabitsInternalComponent(anamnesis.generalClinic.eatingHabits);
  const family = familyInternalComponent(anamnesis?.generalClinic.diseasesInFamily);
	const gestation = gestationComponent();
	const signs = symptomsComponent();
	const prenatal = prenatalExamsComponent();
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
  const imunizationInPediatric = immunizationInPediatricsComponent();
  const familyHistoryPediatric = familyHistoryPediatricComponent();
  const familyConditionAndEvironment = familyConditionAndEnvironmentComponent(); 
  const othersinPediatric = othersComponent();
  const diseaseinPhisicalMedicine = diseaseInGeneralClinicComponent();
  const phisicalExamMedicine = phisicalExamMedicineComponent();
  const pathology = pathologyInPhisicalMedicineComponent();
  const diseasesFamily = diseasesFamilyComponent();
  const therapyPlan = therapyPlanComponent();
  const therapyObjective = therapyObjectiveComponent();
  const phisicalAndObstetricExams = physicalAndObstetricExamsComponent();
  const obstetricAndGynecology = obstetricsAndGynecologyComponent();
  const previousBirths = previousBirthsComponent();
  const clinicalHistory = clinicalHistoryComponent();
  const familyAndSocialHistory = familyAndSocialHistoryComponent();
  const livingCondition = livingConditionsComponent();
  const nutricionalHistory = nutritionalHistoryComponent();

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

	const childrensMedicine:InternalComponent[] = [
		gestation,
		signs,
		prenatal,
		phisicalAndObstetricExams,
		obstetricAndGynecology,
		previousBirths,
		clinicalHistory,
		familyAndSocialHistory,
		livingCondition,
		nutricionalHistory,
		therapyAndCare,
		therapyAndCareobjective,
	];

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
		imunizationInPediatric,
		familyHistoryPediatric,
		familyConditionAndEvironment,
		othersinPediatric,
	];

	const phisicalMedicine:InternalComponent[] = [
		symptoms,
		diseaseinPhisicalMedicine,
		phisicalExamMedicine,
		complementaryExams,
		diagnostic,
		pathology,
		lifeStyle,
		diseasesFamily,
		therapyPlan,
		therapyObjective,
	];

  return(
		<main className="relative">
			<div className="flex gap-x-3">
				<Button>Visualizar</Button>
				<Hospitalization/>
			</div>

			<div className="flex flex-col gap-y-3 pt-8">
				<GlobalComponent
				  type="clinicaGeral"
				  {...{patientId}}
					title="CLINICA GERAL"
					components={generalClinical} 
				/>

				<GlobalComponent
				  type="childrenMedicine"
				  {...{patientId}}
					title="MEDICINA MATERNO INFANTIL"
					components={childrensMedicine} 
				/>

				<GlobalComponent
					type="cardioPulmunaryMedicine"
					{...{patientId}}
					title="MEDICINA CARDIOPULMUNAL"
					components={cardioPulmunaryMedicine} 
				/>

				<GlobalComponent
					type="ophthalmologyService"
					{...{patientId}}
					title="SERVIÇO DE OFTALMOLOGIA"
					components={ophthalmologyService} 
				/>

				<GlobalComponent
					type="pediatricMedicine"
					{...{patientId}}
					title="MEDICINA PEDIÁTRICA"
					components={pediatricMedicine} 
				/>

				<GlobalComponent
					type="phisicalMedicine"
					{...{patientId}}
					title="MEDICINA FÍSICA E REABILITAÇÃO"
					components={phisicalMedicine}
				/>
			</div>
		</main>
	)
}
