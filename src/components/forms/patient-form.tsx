import { redirect } from "next/navigation";
import PersonalInfoForm from "@/components/forms/signed-patient/personal-form";
import Accordium from "@/components/ui/accordium";
import DemographicInfoForm from "@/components/forms/signed-patient/demography-form";
import ResponsiblesForm from "@/components/forms/signed-patient/responsibles-form";
import GroupForm from "@/components/forms/signed-patient/group-form";
import AccessForm from "@/components/forms/signed-patient/access-form";
import { getPatient } from "@/backend/api/clinical/api";
import type { Responsable } from "@/backend/api/clinical/types";
import PDFButton, { PatientRecord } from "@/components/pdf-button";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";
import { civilState, kinshipDegree } from "@/backend/api/clinical/translator";

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

  const dataTopdf: PatientRecord = {
    personal: {
      fullname: personal.fullname,
      birthDate: personal.birthDate,
      age: personal.age,
      civilState: (civilState.find( value => value._id === personal.civilState))?.label,
      gender: personal.gender === "femenine"?"femenino":personal.gender === "masculine"?"masculino":'',
      tel: personal.tel,
      documentation: personal.documentation,
      lang: personal.lang,
    },
    demography: {
      nationality: demography.nationality,
      naturality: demography.naturality,
      province: demography.province,
      actualLocation: demography.actualLocation,
      street: demography.street,
      homeNumber: demography.homeNumber,
    },
    responsibles: [
      {
        name: firstAndSecond[0].name,
        kinship: (kinshipDegree.find( value => value._id === firstAndSecond[0].kinship))?.label as string,  
        tel: firstAndSecond[0].tel,
      },
      {
        name: firstAndSecond[1]?.name,
        kinship: (kinshipDegree.find( value => value._id === firstAndSecond[1]?.kinship))?.label as string,  
        tel: firstAndSecond[1]?.tel,
      }
    ],
    acess: {
      type: accessType.type,
      hospital: 'hospital',
    },
    group: JSON.stringify(group)
  }

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
          <AccessForm 
						data={JSON.stringify(accessType)}
						eUnitsJson={JSON.stringify(externalUnits)} 
					/>
				</Accordium>
			</div>

      <PDFButton
        label="Ficha-Utente"
        type="patientRecord"
        args={dataTopdf}
      />
		</main>
	)
}