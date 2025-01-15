import { updatePersonalInfo } from "@/app/backend/api/clinical/api";
import { gender as genderTemplate } from "@/app/backend/api/clinical/translator";

type Personal = {
  elements: [
    { defaultValue: string },
    { defaultValue: number },
    { defaultValue: string },
  ];
};

function personalInternalComponent({ elements }: Personal){
  return {
		title: "Dados Pessoais",
		apiFn: updatePersonalInfo,
		initialState: { message: "", status: false },
		childrens: [
			{
				className: "grid grid-cols-3 gap-3",
				elements: [
					{ 
						type: "input",
						props: {
							label: "Nome completo",
							placeholder: "Nome completo do Utente",
							name: "fullname",
							defaultValue: elements[0].defaultValue
						}
					},
					{ 
						type: "number",
						props: {
							label: "Idade",
							placeholder: "Idade do Utente",
							name: "age",
							defaultValue: elements[1].defaultValue
						}
					},
					{
						type: "select",
						props: {
							label: "Gênero",
							name: "gender",
							options: genderTemplate,
							defaultValue: elements[2].defaultValue
						}
					}
				]
			}
		]
	}
}

export {
  personalInternalComponent
}