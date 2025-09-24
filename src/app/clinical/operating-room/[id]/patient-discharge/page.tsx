import Button from "@/components/ui/button"
import InputDetails from "@/components/ui/input-details"
import Selection from "@/components/ui/selection"
import Accordium from "@/components/ui/accordium"

export default async function Page(){
  return(
    <>
      <Button>Concluir</Button>

      <div className="flex flex-col gap-y-4 py-8">         
        <Accordium title="Estado do paciente e unidade de Destino">
          <div className="grid grid-cols-2 gap-x-4">
            <Selection
              label="Estado do paciente"
              options={[
                {_id:"0", label:"Estável"},
                {_id:"1", label:"Manter em observação"},
                {_id:"2", label:"Instável"},
              ]}
              name="teste"
            />

            <Selection
              label="Unidade de Destino"
              options={[
                {_id:"0", label:"Consultório de urgência"},
                {_id:"1", label:"Consultório"},
                {_id:"2", label:"Utentes"},
                {_id:"3", label:"Internamento"},
              ]}
              name="teste"
            />
          </div>

          <Button>Salvar</Button>
        </Accordium>
        
        <Accordium title="Informa de cirúrgica">
          <InputDetails
            textLabel="Informação de cirúgica"
            rows={3}
            name=""
            placeholder="descreva"
          />

          <Button>Salvar</Button>
        </Accordium>

        <Accordium title="Indicações pós-operatórias imediatas">
          <InputDetails
            textLabel="Dieta"
            rows={3}
            name=""
            placeholder="descreva a dieta"
          />

          <InputDetails
            textLabel="Analgesia"
            rows={3}
            name=""
            placeholder="descreva a analgesia"
          />

          <InputDetails
            textLabel="Mobilização"
            rows={3}
            name=""
            placeholder="descreva a mobilização"
          />

          <InputDetails
            textLabel="Antibióticos"
            rows={3}
            name=""
            placeholder="descreva a antibiótico"
          />

          <Button>Salvar</Button>
        </Accordium>
      </div>
    </>
  )
}