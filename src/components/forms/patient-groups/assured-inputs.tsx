import InputField from "@/components/ui/input-field";
import InputDetails from "@/components/ui/input-details";

export default function AssuredInputs(){

  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="nameInsuranceCompany"
        textLabel="Asseguradora"
        placeholder="Nome da Asseguradora"
      />
      
      <InputField
        name = "apoliceNumber"
        textLabel="Nº de Apólice"
        maxLength={9}
        placeholder="Número da Apolice"
      />

      <InputField
        type="tel"
        name="assuredTel"
        textLabel="Nº de Telefone"
        maxLength={9}
        placeholder="Telefone"
      />

      <InputDetails
        name="asuredDetails"
        textLabel="Detalhes"
        placeholder="Escreva detalhes da asseguradora"
      />
    </div>
  );
}