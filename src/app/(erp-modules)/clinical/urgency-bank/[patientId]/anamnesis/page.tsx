import { redirect } from "next/navigation";
import Button from "@/components/ui/button";
// import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";
import ChildrenMedicine from "@/components/urgency-bank/anamnesis/childrens-medicine";
// import PediatricMedicine from "@/components/urgency-bank/anamnesis/pediatric-medicine";
// import PhisicalMedicine from "@/components/urgency-bank/anamnesis/phisical-medicine";
// import OphthalmologyService from "@/components/urgency-bank/anamnesis/ophthalmology-service";
import GlobalComponent, { InternalComponent } from "@/components/global-component";
import GeralClinic from "@/components/urgency-bank/anamnesis/geral-clinic";
import { 
	diagnosticInternalComponent,
	diseaseDataInternalComponent,
	diseasesInternalComponent,
	eatingHabitsInternalComponent,
	evaluationInternalComponent,
	examsInternalComponent,
	familyInternalComponent,
	hospitalizationInternalComponent,
	lifeStyleInternalComponent,
	othersInternalComponent,
	personalInternalComponent,
	symptomsInternalComponent
} from "@/lib/internal-components";
import { getPatient } from "@/app/backend/api/clinical/api";

export default async function Page({ params }: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	const patient = await getPatient(patientId);
	if(!patient)
		redirect('/clinical?invalid-user');

	const { personal } = patient;

  const personalData = personalInternalComponent({
		elements: [
			{ defaultValue: personal.fullname },
			{ defaultValue: personal.age },
			{ defaultValue: personal.gender }
		]
	});
	
	const symptoms = symptomsInternalComponent();
	const diseaseData = diseaseDataInternalComponent();
	const complementaryExams = examsInternalComponent();
	const diagnostic =	diagnosticInternalComponent();
	const diseases = diseasesInternalComponent();
  const others = othersInternalComponent();
	const evaluation = evaluationInternalComponent();
	const lifeStyle = lifeStyleInternalComponent();
	const eatingHabits = eatingHabitsInternalComponent();
  const familyHistory = familyInternalComponent();
	const hospitalization = hospitalizationInternalComponent();

	const generalClinical:InternalComponent[] = [
		personalData,
		symptoms,
		diseaseData,
		complementaryExams,
		diagnostic,
		diseases,
		others,
		evaluation,
		lifeStyle,
		eatingHabits,
		familyHistory,
		hospitalization
	];
	
  return(
		<main>
			<Button>Visualizar</Button>

			<div className="flex flex-col gap-y-5 my-8">
				<GlobalComponent
					title="CLINICA GERAL"
					components={generalClinical} 
				/>
			</div>
		</main>
	)
}
