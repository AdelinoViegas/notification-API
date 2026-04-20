import InputField from "@/components/ui/input-field";

export default function Enterprise(){

  return(
    <div className="grid md:grid-cols-2 large:grid-cols-3 gap-3">
      <InputField
        name="enterpriseName"
        textLabel="Nome da Empresa"
        placeholder="Nome da Empresa"
       
      />
      
      <InputField
        name="enterprisePassNumber"
        textLabel="Nº de passe"
        maxLength={9}
        placeholder="Nº de Indentificação na empresa"
      />

      <InputField
        name="enterpriseFunction"
        textLabel="Função"
        placeholder="Digite a função"
      />
    </div>
  );
}