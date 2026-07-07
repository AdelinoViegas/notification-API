import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";
import type { 
  Enterprise,
  Assured,
  Employee
} from "@/backend/api/clinical/types";

function AssuredInputs({
  apolice,
  detail,
  name,
  tel
}: Assured){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="name"
        textLabel="Asseguradora"
        placeholder="Nome da Asseguradora"
        defaultValue={name}
        required
      />
      
      <InputField
        name = "apolice"
        textLabel="Nº de Apólice"
        maxLength={9}
        required
        placeholder="Número da Apolice"
        defaultValue={apolice}
      />

      <InputField
        type="tel"
        name="tel"
        maxLength={9}
        textLabel="Nº de Telefone"
        required
        placeholder="Telefone"
        defaultValue={tel}
      />

      <InputDetails
        name="detail"
        textLabel="Detalhes"
        placeholder="Escreva detalhes da asseguradora"
        required
        defaultValue={detail}
      />
    </div>
  );
}

function EnterpriseInputs({
  name,
  passNumber,
  role
}: Enterprise){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="enterpriseName"
        textLabel="Nome da Empresa"
        required
        placeholder="Nome da Empresa"
        defaultValue={name}
      />
      
      <InputField
        name="passNumber"
        textLabel="Nº de passe"
        required
        placeholder="Nº de Indentificação na empresa"
        defaultValue={passNumber}
      />

      <InputField
        name="enterpriseFunction"
        textLabel="Função"
        required
        placeholder="Digite a função"
        defaultValue={role}
      />
    </div>
  );
}

function EmployeeInputs({
  passNumber,
  role,
  workArea,
}: Employee){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="passNumber"
        textLabel="Nª de passe"
        required
        placeholder="Digite o número de passe"
        defaultValue={passNumber}
      />
      
      <InputField
        name="employeeFunction"
        textLabel="Função"
        required
        placeholder="Digite a função"
        defaultValue={role}
      />

      <InputField
        name="serviceArea"
        textLabel="Área de Serviço"
        required
        placeholder="Digite a área de serviço"
        defaultValue={workArea}
      />
    </div>
  );
}

export {
  AssuredInputs,
  EnterpriseInputs,
  EmployeeInputs
};