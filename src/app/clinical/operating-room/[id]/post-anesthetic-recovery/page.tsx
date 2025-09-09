import Accordium from "@/components/ui/accordium";
import Button from "@/components/ui/button";
import InputDetails from "@/components/ui/input-details";
import InputField from "@/components/ui/input-field";
import Selection from "@/components/ui/selection";

export default async function Page(){
  return(
    <div className="flex flex-col gap-y-4 py-8">         
      <Accordium title="Horários de entrada e saída">
        <div className="grid grid-cols-2 gap-x-4">
          <InputField
            textLabel="Hora de entrada"
            type="time"
            name="date-start"
          />

          <InputField
            textLabel="Hora de saída"
            type="time"
            name="date-end"
          />
        </div>

        <Button>Salvar</Button>
      </Accordium>

      <Accordium title="Sinais Vitais à Admissão">
        <div className="flex gap-x-5">
          <InputField
            textLabel="FC(pulso)"
            name="date"
            placeholder="pulso"
          />

          <InputField
            textLabel="FR"
            name="date"
            placeholder="fr"
          />

          <InputField
            textLabel="SpO2"
            name="date"
            placeholder="SpO2"
          />

          <InputField
            textLabel="T/A"
            name="date"
            placeholder="t/a"
          />

          <InputField
            textLabel="Tº"
            name="date"
            placeholder="tº"
          />
        </div>

        <Button>Salvar</Button>
      </Accordium>

      <Accordium title="Nível de conciência">
        <div className="grid grid-cols-2 gap-x-4">
          <Selection
            label="Actividade Motora"
            options={[
              {_id:"0", label:"Incapaz de se mover"},
              {_id:"1", label:"Capaz de mover 2 membros"},
              {_id:"2", label:"Capaz de mover 4 membros"},
            ]}
            name="teste"
          />

          <Selection
            label="Respiração"
            options={[
              {_id:"0", label:"Apneia"},
              {_id:"1", label:"Dispneia ou respira superficial"},
              {_id:"2", label:"Respira profundamente e tosse"},
            ]}
            name="teste"
          />

          <Selection
            label="Circulação"
            options={[
              {_id:"0", label:"P/A alterada em >= 50% do valor pré-anestésico"},
              {_id:"1", label:"P/A dentro de +/-20% do valor pré-anestésico"},
              {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
            ]}
            name="teste"
          />

          <Selection
            label="Consciência"
            options={[
              {_id:"0", label:"Não desperta"},
              {_id:"1", label:"Responde a estímulo"},
              {_id:"2", label:"Acordado e orientado"},
            ]}
            name="teste"
          />

          <Selection
            label="Saturação O2"
            options={[
              {_id:"0", label:"SpO2 < 90% com O2"},
              {_id:"1", label:"SpO2 > 90% com O2"},
              {_id:"2", label:"SpO2 > 92% em ar ambiente"},
            ]}
            name="teste"
          />
        </div>
      </Accordium>
      
      <Accordium title="Medicação administrada">
        <InputDetails
          textLabel="Medicação administrada"
          name="medicine"
          rows={3}
          placeholder="descreva"
        />
      </Accordium>

      <Accordium title="Ocorrências pós-anestésicas imediatas">
        <InputDetails
          textLabel="Ocorrências pós-anestésicas imediatas"
          name="medicine"
          rows={3}
          placeholder="descreva"
        />
      </Accordium>
    </div>
  )
}