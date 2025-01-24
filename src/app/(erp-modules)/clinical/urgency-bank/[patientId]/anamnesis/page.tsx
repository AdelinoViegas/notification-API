//import { redirect } from "next/navigation";
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
	hospitalizationInternalComponent,
	lifeStyleInternalComponent,
	othersInternalComponent,
	symptomsInternalComponent
} from "@/lib/internal-components";
//import { getPatient } from "@/app/backend/api/clinical/api";
import { getPatientUrgencyBank } from "@/app/backend/api/clinical/urgency-bank-api";

export default async function Page({ params }: {
	params: Promise<{
		patientId: string;
	}>
}){
  const { patientId } = await params;
	//const patient = await getPatient(patientId);
	const anamnesis = await getPatientUrgencyBank(patientId);

	/*if(!patient)
		return redirect('/clinical?invalid-user');*/

	//const { personal } = patient;

  /*const personalData = personalInternalComponent({
		elements: [
			{ defaultValue: personal.fullname },
			{ defaultValue: personal.age },
			{ defaultValue: personal.gender }
		]
	});*/
	const symptoms = symptomsInternalComponent(anamnesis.generalClinic.symptoms);
	const diseaseData = diseaseDataInternalComponent(anamnesis.generalClinic?.diseaseData);
	const complementaryExams = examsInternalComponent(anamnesis?.generalClinic?.complementaryExams);
	const diagnostic =	diagnosticInternalComponent(anamnesis?.generalClinic?.diagnosticHypothesis);
	const diseases = diseasesInternalComponent(anamnesis.generalClinic.diseases);
  const others = othersInternalComponent(anamnesis?.generalClinic?.others);
	const evaluation = evaluationInternalComponent(anamnesis?.generalClinic.evaluation);
  const lifeStyle = lifeStyleInternalComponent(anamnesis.generalClinic.lifeStyle);
	const eatingHabits = eatingHabitsInternalComponent(anamnesis.generalClinic.eatingHabits);
  const familyHistory = familyInternalComponent(anamnesis?.generalClinic.diseasesInFamily);
	const hospitalization = hospitalizationInternalComponent(anamnesis?.generalClinic.hospitalization);

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
		familyHistory,
		hospitalization
	];
	
  return(
		<main>
			<div className="flex gap-x-3">
				<Button>Visualizar</Button>
				<Button className="bg-slate-700">Internamento</Button>
			</div>

			<div className="flex flex-col gap-y-5 my-8">
				<GlobalComponent
				  {...{patientId}}
					title="CLINICA GERAL"
					components={generalClinical} 
				/>
			</div>
		</main>
	)
}
