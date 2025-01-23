import { redirect } from "next/navigation";
import PersonalInfoForm from "@/components/forms/signed-patient/personal-form";
import Accordium from "@/components/accordium";
import DemographicInfoForm from "@/components/forms/signed-patient/demography-form";
import ResponsiblesForm from "@/components/forms/signed-patient/responsibles-form";
import GroupForm from "@/components/forms/signed-patient/group-form";
import AcessForm from "@/components/forms/signed-patient/access-form";
import { getPatient } from "@/app/backend/api/clinical/api";
import type { Responsable } from "@/app/backend/api/clinical/types";
import PDFButton from "@/components/pdf-button";
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
			<PDFButton 
				label="Visualizar"
				args={{ personal: {
					fullname: "Adelino Quibundo Viegas dos Santos",
					gender:"masculino",
					birthDate: new Date(),
					age:123,
					tel:"987785412",
					civilState:"Divorciado/a",
					lang:"Português",
					documentation: "012345678LJ124"
				},
				demography: {
					actualLocation: "Luanda/multiperfil/junto a loja maxi",
					homeNumber: "",
					nationality: "TrinidadeTobago",
					naturality: "Trinidade e Tobago",
					province: "Kuando-kubango",
					street:"",
				} 
			}}
				type="patientRecord"
			/>

     {/*<PDFButton 
				label="Visualizar"
				args={{ reason:"doente",
					 vitalsSignal:{
						paMax: "4",
						paMin: "5", 
						jump: "7",
						pvc: "5",
						imc: "50",
						sp02: "7",
						temperature: "9",
						breathing: "2",
						weight: "10",
						height: "6",
						bloodGlucose: "8",
					 },
					 status:"deve ser observado",
					 advice:"beba muita água",
			}}
				type="screeningRecord"
			/>*/}

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