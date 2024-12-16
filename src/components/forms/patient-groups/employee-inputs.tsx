import InputField from "@/components/ui/input-field";

export default function Employee(){

  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="passNumber"
        textLabel="Nª de passe"
        placeholder="Digite o número de passe"
      />
      
      <InputField
        name="employeeFunction"
        textLabel="Função"
        placeholder="Digite a função"
      />

      <InputField
        name="serviceArea"
        textLabel="Área de Serviço"
        placeholder="Digite a área de serviço"
      />
    </div>
  );
}