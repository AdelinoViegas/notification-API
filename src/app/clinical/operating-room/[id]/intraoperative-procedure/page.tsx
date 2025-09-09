import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";

export default async function Page(){
  return(
      <div className="py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <InputField
            textLabel="Horário de início"
            type="datetime-local"
            name="date-start"
          />

          <InputField
            textLabel="Horário de fim"
            type="datetime-local"
            name="date-end"
          />
          
          <InputField
            textLabel="Tipo de anestesia utilizada:"
            name="date"
            placeholder="digite o tipo de anestesia"
          />

          <InputField
            textLabel="Técnica cirúrgica aplicada"
            name="date"
            placeholder="descreva a técnica utilizada"
          />

          <InputField
            textLabel="Implantes/protéses utilizados"
            name="date"
            placeholder="Implantes e protéses"
          />

          <InputField
            textLabel="Ocorrências ou complicações intraoperatórias"
            name="date"
            placeholder="descreva as complicações intraoperatórias"
          />

          <InputField
            textLabel=" Volume de fluidos administrados / perdas sanguíneas"
            name="date"
            placeholder="descreva"
          />

          <InputField
            textLabel="Medicação administrada durante e antes do fecho"
            name="date"
            placeholder="medicação administrada"
          />
        </div>

        <InputDetails
          textLabel="Outro Procedimento"
          rows={3}
          name="date"
          placeholder="Descreva"
        />  

        <Button>Salvar</Button>
      </div>
  )
}