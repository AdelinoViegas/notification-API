import Accordium from "@/components/ui/accordium";
//import TitleAndSubtitle from "@/components/title-subtitle";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";

export default async function Page(){
  return(
    <div className="flex flex-col gap-y-4 py-8">
      <Accordium title="Histórico médico e cirúrgico">
        <InputDetails
          textLabel="Descreva"
          rows={3}
          placeholder="Descreva os Históricos médicos e cirúrgicos"
        />

        <Button>Salvar</Button>
      </Accordium>

      <Accordium title="Alergias">
        <InputDetails
          textLabel="Descreva"
          rows={3}
          placeholder="Descreva os sintomas de alergia"
        />

        <Button>Salvar</Button>
      </Accordium>
    </div>
  )
}