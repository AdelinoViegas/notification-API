import Button from "@/components/ui/button"
import InputDetails from "@/components/ui/input-details"
import Selection from "@/components/ui/selection"
import Accordium from "@/components/ui/accordium"
import InputField from "@/components/ui/input-field"

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
          <div className="grid grid-cols-2 gap-x-4">
            <InputField
              textLabel="Dieta"
              name=""
              placeholder="descreva a dieta"
            />
            
            <InputField
              textLabel="Analgesia"
              name=""
              placeholder="descreva a analgesia"
            />
            
            <InputField
              textLabel="Mobilização"
              name=""
              placeholder="descreva a mobilização"
            />
            
            <InputField
              textLabel="Antibióticos"
              name=""
              placeholder="descreva o antibiótico"
            />
          </div>

          <Button>Salvar</Button>
        </Accordium>
      </div>
    </>
  )
}