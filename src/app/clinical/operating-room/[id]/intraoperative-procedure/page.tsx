import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";

export default async function Page(){
  return(
      <div className="py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 items-center">
          <div className="flex gap-x-2 justify-between">
            <InputField
              textLabel="Horário de início"
              type="datetime-local"
              name="date-start"
            />

            <InputField
              textLabel="Horário de Fim"
              type="datetime-local"
              name="date-end"
            />
          </div>
          
          <InputField
            textLabel="Tipo de anestesia utilizada:"
            name="date"
            placeholder="digite o tipo de anestesia"
          />

          <InputDetails
            textLabel="Técnica cirúrgica aplicada"
            rows={3}
            name="date"
            placeholder="descreva a técnica utilizada"
          />

          <InputDetails
            textLabel="Implantes/protéses utilizados"
            rows={3}
            name="date"
            placeholder="Implantes e protéses"
          />

          <InputDetails
            textLabel="Ocorrências ou complicações intraoperatórias"
            rows={3}
            name="date"
            placeholder="descreva as complicações intraoperatórias"
          />

          <InputDetails
            textLabel=" Volume de fluidos administrados / perdas sanguíneas"
            rows={3}
            name="date"
            placeholder="descreva"
          />

          <InputDetails
            textLabel="Medicação administrada durante e antes do fecho"
            rows={3}
            name="date"
            placeholder="medicação administrada"
          />

          <InputDetails
            textLabel="Outro procedimento"
            rows={3}
            name="date"
            placeholder="Descreva"
          />  
        </div>

        <Button>Salvar</Button>
      </div>
  )
}