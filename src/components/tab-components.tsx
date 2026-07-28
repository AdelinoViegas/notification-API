"use client";

import { 
  useState,
  useEffect, 
  ChangeEvent
} from "react";
import { 
  civilState, 
  gender, 
  kinshipDegree, 
  patientAccess 
} from "@/backend/api/clinical/translator";
import InputField from "@/components/ui/input-field";
import Selection, { SelectionOption } from "@/components/ui/selection";
import PatientGroups from "@/components/forms/patient-groups";
import { getExternalUnits } from "@/backend/api/clinical/urgency-bank-api";
import ExternalUnitForm from "@/components/forms/external-unit-form";
import { AngolaProvices } from "@/backend/api/clinical/translator";
import { calculateAge } from "@/lib/calculate-age";

function AccesTypeForm(){
  const [ type, setType ] = useState("");
  const [ externalUnits, setExternalUnits ] = useState<SelectionOption[]>([]);

  useEffect(()=>{
    getExternalUnits({}).then(setExternalUnits)
  }, [type]);

  return(
    <div className="grid md:grid-cols-3 gap-3">
      <Selection
        name="accessType"
        label="Tipo de acesso"
        options={patientAccess}
        onChange={(e)=>setType(e.target.value)}
      />

      {
        type === "transferred" &&
        <div className="col-span-2 flex gap-3 items-end">
          <Selection
            label="Unidade Externa"
            options={externalUnits}
            name="externalUnitId"
            className="grow"
            required
          />

          <ExternalUnitForm />
        </div>
      }
    </div>
  );
}

function Demography(){
  const [ isExternal, setIsExternal ] = useState(false);
  const [ naturality, setNaturality ] = useState("Angola");

  return (
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      {!isExternal && <Selection
        label="Nacionalidade"
        name="nationality"
        options={[
          { _id: "Angolana", label: "Angolana" },
          { _id: "outros", label: "Outra" }
        ]}
        onChange={(e)=>{
          if(e.target.value === "outros"){
            setIsExternal(true);
          }else {
            setIsExternal(false);
            setNaturality("Angola");
          }
        }}
        defaultValue="Angolana"
      />}

      { isExternal && 
      <InputField
        textLabel="Nacionalidade"
        name="nationality" 
        placeholder="Nacionalidade do utente"
        onChange={(e) => {
          if(/\wngolana/ig.test(e.target.value)){
            setIsExternal(false);
            setNaturality("Angola");
          }
        }}
      />}

      <InputField
        textLabel="Naturalidade"
        disabled={!isExternal}
        value={naturality}
        onChange={(e)=> setNaturality(e.target.value)}
        placeholder="Naturalidade do utente"
      />

      <input type="hidden" name="naturality" value={naturality} />

      {isExternal && 
      <InputField
        textLabel="Província"
        name="province" 
        placeholder="Província do utente"
      />}

      { !isExternal &&
        <Selection
          label="Província"
          options={AngolaProvices}
          name="province"
        />
      }

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
        placeholder="Digite o nª da casa"
      />
    </div>
  );
}

function BirthDate(){
  const [age, setAge] = useState("");

  const handleAge = (el: ChangeEvent<HTMLInputElement>) => {
    const calculatedAge = calculateAge(el.target.value);
    setAge(calculatedAge);
  }

  return (
    <>
      <InputField
        textLabel="Data de Nascimento"
        name="patientBirthDate" 
        type="date"
        onChange={handleAge}
      />

      <InputField
        textLabel="Idade"
        name="patientAge" 
        type="number"
        placeholder="0"
        maxLength={3}
        disabled
        value={age}
      />
    </>
  )
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
      
      <BirthDate/>

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

      <div className="flex gap-3 items-end">
        <InputField
          textLabel="Documentação (BI | Passaporte | Cédula)"
          name="patientDocument" 
          placeholder="Nº de BI / Nº de Cédula / Nº de Passaporte"
          required
          className="w-full"
          id="Documentação:0:documentation"
          title="123456789AB123"
          // defaultValue={"123456789AB123"}
        />
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
    children: <Demography />
  },
  {
    title: "Responsáveis",
    children: 
    <div className="grid md:grid-cols-3 large:grid-cols-3 gap-x-3">
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