import Accordium from "@/components/accordium";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { patientData } from "@/app/(erp-modules)/clinical/urgency-bank/[patientId]/anamnesis/page";
import PersonalOfficeForm from "@/components/forms/signed-patient/personal-office-form";

export default function GeralClinic({
  _id,
  fullname,
  age,
  gender,
}:patientData){
  return (
    <Accordium className="hover:bg-primary/35 bg-primary/40" title="CLÍNICA GERAL">
    <div className="flex flex-col gap-y-3">
      <Accordium title="Dados do Paciente">
        <PersonalOfficeForm
          {...{_id}}
          {...{fullname}}
          {...{age}}
          {...{gender}}
        />
      </Accordium>
    
      <Accordium title="Queixa Principal">
        <div>
          <InputDetails
            rows={3}
            textLabel="Queixa Principal"
            placeholder="Descreva a principal queixa"
            name="mainComplaint"
            required
          />
          <div>
            <Button>Salvar</Button>
          </div>
        </div>
      </Accordium>
    
      <Accordium title="História da Doênça Actual">
        <div>
          <InputDetails
            rows={3}
            textLabel="História da Doênça Actual"
            placeholder="Descreva os sintomas actuais, duração, factores agravantes/aliviantes, entre outros"
            name="symptoms"
            required
          />
          
          <Button>Salvar</Button>								
        </div>
      </Accordium>
    
      <Accordium title="Exames Complementares">
        <div>
          <InputDetails
            rows={3}
            textLabel="Exames Complementares"
            placeholder="Descrever os resultados dos exames, aspectos fundamentais observados"
            name="complementaryExams"
            required
          />
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Hipótese de Diagnóstico">
        <div>
          <InputDetails
            rows={3}
            textLabel="Hipótese de Diagnóstico"
            placeholder="Descreva"
            name="diagnosticHypothesis"
            required
          />
          
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Antecedentes Pessoais Patológicos(Doênças pré-existentes, hospitalizações, acidentes)">
        <div>
          <div className="flex flex-col w-short">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Diabete:</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="diabetes"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="diabetes"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Hipertensão:</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="hypertension"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="hypertension"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Doênças Respiratórias:</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="respiratoryDiseases"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="respiratoryDiseases"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Tuberculose:</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="tuberculosis"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="tuberculosis"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Malária:</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="malaria"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="malaria"
                  />
                </div>
              </div>
            </div>
          </div>
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Outros">
        <div>
          <InputDetails
            rows={3}
            textLabel="Outros"
            placeholder="Descreva"
            name="others"
            required
          />
    
          <Button>Salvar</Button>
        </div>
      </Accordium>	
    
      <Accordium title="Avaliação dos Orgãos Vitais">
        <div>				
          <InputDetails
            rows={3}
            textLabel="Avaliação dos Orgãos Vitais"
            placeholder="Descrever sinais e dados de observatório dos orgãos vitais"
            name="signsOfVitalOrgans"
            required
          />
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Estilo de Vida e Hábitos">
        <div>
          <div className="flex gap-x-4 items-center my-6">
            <label className="text-sm font-medium">Consumo de Tabaco:</label>
            <div className="flex gap-x-4">
              <div className="flex gap-x-1 items-center">
                <label className="text-xs">Fumante</label>
                <InputField
                  type="radio"
                  name="tobaccoConsumption"
                />
              </div>
    
              <div className="flex gap-x-1 items-center">
                <label className="text-xs">Não Fumante</label>
                <InputField
                  type="radio"
                  name="tobaccoConsumption"
                />
              </div>
    
              <div className="flex gap-x-1 items-center">
                <label className="text-xs">Ex-Fumante</label>
                <InputField
                  type="radio"
                  name="tobaccoConsumption"
                />
              </div>
            </div>
          </div>
    
          <div className="flex flex-col my-6">
            <div className="flex items-center gap-x-4">
              <label className="text-sm font-medium">Consumo de Álcool:</label>						
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Consome</label>
                  <InputField
                    type="radio"
                    name="alcohol"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não Consome</label>
                  <InputField
                    type="radio"
                    name="alcohol"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Ex-consumidor</label>
                  <InputField
                    type="radio"
                    name="alcohol"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex gap-x-4">
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Frequência</label>
                <InputField
                  placeholder="descreva"
                  name="frequency"
                />
              </div>
    
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Quantidade</label>
                <InputField
                  type="number"
                  placeholder="Digite o valor"
                  name="amount"
                />
              </div>
            </div>
          </div>
    
          <div className="flex flex-col my-6">
            <div className="flex items-center gap-x-4">
              <label className="text-sm font-medium">Actividade Física:</label>																			
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Praticante</label>
                  <InputField
                    type="radio"
                    name="physical"
                  />
                </div>
    
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não praticante</label>
                  <InputField
                    type="radio"
                    name="physical"
                  />
                </div>
              </div>
            </div>
    
            <div className="flex flex-wrap gap-x-4">
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Tipo de Actividade Física</label>
                <InputField
                  placeholder="descreva"
                  name="activity"
                />
              </div>
    
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Quantidade</label>
                <InputField
                  placeholder="descreva"
                  name="amount"
                />
              </div>
    
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Tempo de actividade por secção</label>
                <InputField
                  placeholder="descreva"
                  name="alcohol"
                />
              </div>
            </div>				
          </div>
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Hábitos Alimentares">
        <div>
          <div className="grid grid-cols-2 gap-x-4">
            <InputField
              textLabel="Nª de refeições/dia"
              placeholder="Descreva"
              name="meals"
              required
            />
    
            <InputField
              textLabel="Tipo de Alimento"
              placeholder="Descreva"
              name="food"
              required
            />
    
            <InputField
              textLabel="Consumo de água/dia"
              placeholder="Descreva"
              name="waterConsumption"
              required
            />
    
            <InputField
              textLabel="Tipo/Modo de Tratamento da Água"
              placeholder="Descreva"
              name="medicines"
              required
            />
          </div>
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Antecedentes Familiares">
        <div>
          <InputDetails
            rows={3}
            textLabel="Doênças na Família"
            placeholder="Doênças na família como diabetes, hipertensão, câncer, doênças genéticas" 
            name="diseasesInTheFamily"
            required
          />
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    
      <Accordium title="Internamento">
        <div>
          <InputDetails
            rows={3}
            textLabel="Motivo do Internamento"
            placeholder="Descreva"
            name="detail"
            required
          />
    
          <div className="grid grid-cols-3 gap-x-4">
            <InputField
              type="date"
              textLabel="Data do Internamento"
              name="dateOfAdmission"
              required
            />
    
            <InputField
              type="time"
              textLabel="Hora"
              name="hour"
              required
            />				
    
            <InputField
              textLabel="Estado ao Internar"
              placeholder="descreva"
              name="condition"
              required
            />
          </div>
    
          <Button>Salvar</Button>
        </div>
      </Accordium>
    </div>
    </Accordium>
  );
}



