import TitleAndSubtitle from "@/components/title-subtitle";
import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
//import Button from "@/components/ui/button";
//import InputDetails from "@/components/ui/input-details";

export default async function Page(){
  return(
    <div className="flex flex-col gap-y-3 py-8">
      <Accordium title="Dados predefinidos">
        <div className="flex gap-x-12">
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Tipo de cirurgia"
            value="teste"
          />
          
          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Responsável pela cirurgia"
            value="teste"
          />

          <TitleAndSubtitle
            className={{content: "ml-0 mt-1"}}
            label="Data da cirurgia"
            value="teste"
          />
        </div>
      </Accordium>
      
      <Accordium title="Equipa Cirúrgia e Sala">
        <div className="grid grid-cols-2 gap-x-4">
          <InputField
            textLabel="Equipa Cirúrgica"
            placeholder="digite a equipa"
            name="team"
          />
          <InputField
            textLabel="Sala Designada"
            placeholder="Digire a Salaa"
            name="room"
          />
        </div>

        <Button>Salvar</Button>
      </Accordium>
      
      <Accordium title="Materiais e Equipamentos Necessários">
        <InputDetails
          textLabel="Materiais e Equipamentos Necessários"
          placeholder="Descreva"
          rows={3}
        />

        <Button>Salvar</Button>
      </Accordium>

      <Accordium title="Dispositivos Implantáveis">
        <InputDetails
          textLabel="Dispositivos Implantáveis"
          placeholder="Descreva"
          rows={3}
        />

        <Button>Salvar</Button>
      </Accordium>
    </div>
  )
}