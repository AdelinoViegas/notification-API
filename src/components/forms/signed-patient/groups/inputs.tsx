import InputField from "@/components/ui/input-field";
import type { 
  Enterprise,
  Assured,
  Employee
} from "@/backend/api/clinical/types";
import InputDetails from "@/components/ui/input-details";

type AssuredProps = {
  disabled: boolean;
} & Assured;

type EnterpriseProps = {
  disabled: boolean;
} & Enterprise;

type EmployeeProps = {
  disabled: boolean;
} & Employee;

function AssuredInputs({
  disabled,
  apolice,
  detail,
  name,
  tel
}: AssuredProps){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="name"
        textLabel="Asseguradora"
        placeholder="Nome da Asseguradora"
        disabled={disabled}
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
        disabled={disabled}
      />

      <InputField
        type="tel"
        name="tel"
        maxLength={9}
        textLabel="Nº de Telefone"
        required
        placeholder="Telefone"
        defaultValue={tel}
        disabled={disabled}
      />

      <InputDetails
        name="detail"
        textLabel="Detalhes"
        placeholder="Escreva detalhes da asseguradora"
        required
        defaultValue={detail}
        disabled={disabled}
      />
    </div>
  );
}

function EnterpriseInputs({
  disabled,
  name,
  passNumber,
  role
}: EnterpriseProps){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="enterpriseName"
        textLabel="Nome da Empresa"
        required
        placeholder="Nome da Empresa"
        defaultValue={name}
        disabled={disabled}
      />
      
      <InputField
        name="passNumber"
        textLabel="Nº de passe"
        required
        placeholder="Nº de Indentificação na empresa"
        defaultValue={passNumber}
        disabled={disabled}
      />

      <InputField
        name="enterpriseFunction"
        textLabel="Função"
        required
        placeholder="Digite a função"
        defaultValue={role}
        disabled={disabled}
      />
    </div>
  );
}

function EmployeeInputs({
  disabled,
  passNumber,
  role,
  workArea,
}: EmployeeProps){
  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="passNumber"
        textLabel="Nª de passe"
        required
        placeholder="Digite o número de passe"
        defaultValue={passNumber}
        disabled={disabled}
      />
      
      <InputField
        name="employeeFunction"
        textLabel="Função"
        required
        placeholder="Digite a função"
        defaultValue={role}
        disabled={disabled}
      />

      <InputField
        name="serviceArea"
        textLabel="Área de Serviço"
        required
        placeholder="Digite a área de serviço"
        defaultValue={workArea}
        disabled={disabled}
      />
    </div>
  );
}

export {
  AssuredInputs,
  EnterpriseInputs,
  EmployeeInputs
};