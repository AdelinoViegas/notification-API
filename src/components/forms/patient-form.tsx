import { redirect } from "next/navigation";
import PersonalInfoForm from "@/components/forms/signed-patient/personal-form";
import Accordium from "@/components/ui/accordium";
import DemographicInfoForm from "@/components/forms/signed-patient/demography-form";
import ResponsiblesForm from "@/components/forms/signed-patient/responsibles-form";
import GroupForm from "@/components/forms/signed-patient/group-form";
import AcessForm from "@/components/forms/signed-patient/access-form";
import { getPatient } from "@/app/backend/api/clinical/api";
import type { Responsable } from "@/app/backend/api/clinical/types";
// import PDFButton from "@/components/pdf-button";
import { getExternalUnits } from "@/app/backend/api/clinical/urgency-bank-api";

export default async function PatientForm({patientId}:{patientId: string}){
	const patient = await getPatient(patientId);
	
  if(!patient)
    redirect('/clinical?invalid-user');

	const externalUnits = await getExternalUnits({});
  const {
    personal,
		demography,
		accessType,
		group,
		responsibles
  } = patient;
	const firstAndSecond = responsibles?.responsibles as Responsable[];

	return(
		<main>
			<div className="flex flex-col gap-3 mb-8 mt-3">
				<Accordium title="Informações Pessoais">
					<PersonalInfoForm 
            id={personal._id}
            fullname={personal.fullname}
            documentation={personal.documentation}
            age={personal.age}
            birthDate={personal.birthDate}
            civilState={personal.civilState}
            gender={personal.gender}
            lang={personal.lang}
            tel={personal.tel}
					/>
				</Accordium>

				<Accordium title="Informações Demográficas">
					<DemographicInfoForm 
						id={demography?._id}
						actualLocation={demography.actualLocation}
						homeNumber={demography.homeNumber}
						nationality={demography.nationality}
						naturality={demography.naturality}
						province={demography.province}
						street={demography.street}
					/>
				</Accordium>

				<Accordium title="Responsáveis">
					<ResponsiblesForm
						id={responsibles._id}
						first={{
							name: firstAndSecond[0].name,
							kinship: firstAndSecond[0].kinship,
							tel: firstAndSecond[0].tel
						}}
						second={{
							name: firstAndSecond[1]?.name,
							kinship: firstAndSecond[1]?.kinship,
							tel: firstAndSecond[1]?.tel
						}}
					/>
				</Accordium>
				<Accordium title="Grupos de Utentes">
          <GroupForm
						id={group._id}
						type={group.type}
						jsonGroup={JSON.stringify(group.group)}
					/>
				</Accordium>

				<Accordium title="Tipos de Acesso">
          <AcessForm 
						data={JSON.stringify(accessType)}
						eUnitsJson={JSON.stringify(externalUnits)} 
					/>
				</Accordium>
			</div>
		</main>
	)
}