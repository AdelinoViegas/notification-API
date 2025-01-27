"use client";
import { 
  useState, 
  useCallback, 
  useEffect 
} from "react";
import { 
  civilState, 
  gender, 
  kinshipDegree, 
  patientAccess 
} from "@/app/backend/api/clinical/translator";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import PatientGroups from "@/components/forms/patient-groups";
import { TbHelp } from "react-icons/tb";
import { getExternalUnits } from "@/app/backend/api/clinical/urgency-bank-api";
import ExternalUnitForm from "@/components/forms/external-unit-form";

function AccesTypeForm(){
  const [ type, setType ] = useState("");
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>([]);
  const loadExternalUnits = useCallback(async()=>{
    const externalUnits = await getExternalUnits({}) as SelectionOption[];
    setExternalUnits(externalUnits);
  }, []);

  useEffect(()=>{
    loadExternalUnits();
  }, [type, loadExternalUnits]);

  return(
    <div className="grid md:grid-cols-3 gap-3">
      <Selection
        name="accessType"
        label="Escolha o grupo de utentes"
        options={patientAccess}
        onChange={(e)=>setType(e.target.value)}
      />

      {
        type === "transferred" &&
        <div className="col-span-2 flex gap-3 items-center">
          <Selection
            label="Escolha o grupo de utentes"
            options={externalUnits}
            name="externalUnitId"
            className="grow"
            onClick={loadExternalUnits}
            required
          />

          <ExternalUnitForm />
        </div>
      }
    </div>
  );
}

const tabComponents = [
  {
    title: "Informações Pessoais",
    children: 
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
      <InputField
        textLabel="Nome Completo"
        name="patientName"
        placeholder="Nome completo do utente"
        required
        id="Nome do Paciente:0"
      />
      
      <InputField
        textLabel="Data de Nascimento"
        name="patientBirthDate" 
        type="date"
      />

      <InputField
        textLabel="Idade"
        name="patientAge" 
        type="number"
        maxLength={3}
        placeholder="Digite a idade"
      />

      <Selection
        options={civilState}
        label="Estado Civil"
        name="civilState" 
        className="w-full"
      />

      <Selection
        options={gender}
        label="Gênero" 
        name="gender"
        className="w-full"
      />

      <InputField
        textLabel="Nº de Telefone"
        name="patientTel" 
        type="Tel"
        maxLength={9}
        placeholder="Digite o Número de Telefone"
      />

      <div className="flex gap-3 items-center">
        <InputField
          textLabel="Documentação (BI | Passaporte |Cédula)"
          name="patientDocument" 
          placeholder="Nº de BI / Nº de Cédula / Nº de Passaporte"
          required
          className="w-full"
          id="Documentação:0:documentation"
        />
        <button
          className="relative"
          data-tooltip-id="documentation"
          type="button">
            <TbHelp className="size-5" />
        </button>
      </div>
      
      <InputField
        textLabel="Idioma (Opcional)"
        name="language" 
        placeholder="idioma de comunicação habitual"
      />
    </div>
  },
  {
    title: "Informações Demográficas",
    children: 
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
				textLabel="Nacionalidade"
				name="nationality" 
				placeholder="Nacionalidade do utente"
			/>

			<InputField
				textLabel="Naturalidade"
				name="naturality" 
				placeholder="Naturalidade do utente"
			/>

			<InputField
				textLabel="Província"
				name="province" 
				placeholder="Província do utente"
			/>

			<InputField
				textLabel="Morada Actual (Município/Bairro/Ponto de referência)"
				name="actualLocation" 
				placeholder="Município/Bairro/Ponto de referência"
				required
        id="Morada Actual:1:demography"
			/>

			<InputField
				textLabel="Rua (Opcional)"
				name="street" 
				placeholder="Digite a rua"
			/>

			<InputField
				textLabel="Nª da casa (Opcional)"
				name="homeNumber" 
				placeholder="Digite o seu município"
			/>
    </div>
  },
  {
    title: "Responsáveis",
    children: 
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
				textLabel="Nome 1ª responsável"
				name="responsibleName"
				placeholder="Nome Completo do Responsável"
        required
        id="Nome do Responsável:2"
			/>
			
			<Selection
				options={kinshipDegree}
				label="Grau de Parentesco"
				name="kinship"
        required
        id="Grau de Parentesco:2"
			/>

			<InputField
				textLabel="Telefone"
				type="Tel"
				maxLength={9}
				name="responsibleTel"
				placeholder="Nº de Telefone do Responsável"
        required
        id="Nº de telefone:2"
			/>

			<InputField
				textLabel="Nome 2ª responsável (opcional)"
				name="responsibleName1"
				placeholder="Nome Completo do Responsável"
			/>
			
			<Selection
				options={kinshipDegree}
				label="Grau de Parentesco (Opcional)"
				name="kinship1"
			/>

			<InputField
				textLabel="Telefone (Opcional)"
				type="Tel"
				maxLength={9}
				name="responsibleTel1"
				placeholder="Nº de Telefone do Responsável"
			/>
    </div>
  },
  {
    title: "Grupo de Utentes",
    children: <PatientGroups />
  },
  {
    title: "Tipo de Acesso",
    children: <AccesTypeForm />
  }
];

export default tabComponents;