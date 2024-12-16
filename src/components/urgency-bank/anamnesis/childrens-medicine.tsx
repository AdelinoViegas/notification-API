import Accordium from "@/components/accordium";
import InputDetails from "@/components/ui/input-details";
import Button from "@/components/ui/button";
import InputField from "@/components/ui/input-field";
import { patientData } from "@/app/(erp-modules)/clinical/urgency-bank/[patientId]/anamnesis/page";
import PersonalOfficeForm from "@/components/forms/signed-patient/personal-office-form";

export default function ChildrenMedicine({
  _id,
  fullname,
  age,
  gender,
}:patientData){
  return(
    <Accordium className="hover:bg-primary/35 bg-primary/40" title="MEDICINA MATERNO INFANTIL">
    <div className="flex flex-col gap-y-3">
      <Accordium title="Dados do Paciente">
        <PersonalOfficeForm
          {...{_id}}
          {...{fullname}}
          {...{age}}
          {...{gender}}
        />
      </Accordium>

      <Accordium title="Avaliação da Gestação Actual">
        <div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <InputField
              type="date"
              textLabel="Data da Última Menstruação"
              name="dateOfMenstrution"
              required
            />

            <InputField
              textLabel="Tempo de Atraso"
              placeholder="Descreva"
              name="delayTime"
              required
            />

            <InputField
              type="number"
              textLabel="Idade Gestacional"
              placeholder="Digite o valor"
              name="dateOfMenstrution"
              required
            />

            <InputField
              type="date"
              textLabel="Data Provável do Parto"
              name="dateOfDelivery"
              required
            />
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Sinais e Sintomas Presentes">
        <div>
          <InputDetails
            rows={3}
            textLabel="Sinais e Sintomas Presentes"
            placeholder="náuseas, vómitos, dor abdominal, sangramentos, outros, duração"
            name="aspectsOfMenstrucao"
            required
          />

          <Button>Salvar</Button>				
        </div>
      </Accordium>

      <Accordium title="Exames Pré-Natal">
        <div>
          <div className="flex flex-col my-4">
            <div className="flex items-center gap-x-4">
              <label className="text-sm font-medium">Ecografia</label>
              <div className="flex gap-x-4">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">sim</label>
                  <InputField
                    type="radio"
                    name="ultrasound"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="ultrasound"
                  />
                </div>
              </div>
            </div>

            <div className="flex w-96 flex-col">
              <label className="text-xs -mb-3">Resultado</label>
              <InputField
                placeholder="Descreva"
                name="result"
                required
              />
            </div>
          </div>

          <div className="flex flex-col my-4">
            <label className="text-sm font-medium">Exame de Sangue</label>
            <div className="flex w-32 flex-col">
              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">Hemograma:</label>
                <InputField
                  type="checkbox"
                  name="bloodCount"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">Glicemia:</label>
                <InputField
                  type="checkbox"
                  name="bloodGlucose"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">VDRL:</label>
                <InputField
                  type="checkbox"
                  name="VDRL"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">VIH:</label>
                <InputField
                  type="checkbox"
                  name="VIH"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">Hepatite-B:</label>
                <InputField
                  type="checkbox"
                  name="hepatitisB"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">Falciformação:</label>
                <InputField
                  type="checkbox"
                  name="anemia"
                />
              </div>

              <div className="flex gap-x-1 items-center justify-between">
                <label className="text-xs font-medium">Teste de Malária:</label>
                <InputField
                  type="checkbox"
                  name="malaria"
                />
              </div>
            </div>
          </div>										
          
          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Exames Físico e Obstétrico">
        <div>
          <div className="grid grid-cols-3 items-center gap-x-4">
            <InputField
              textLabel="Circunferência Abdominal"
              name="ageOffirstMenstruation"
              placeholder="abdomen"
              required
            />
            
            <InputField
              textLabel="Altura Uterina"
              placeholder="Descreva"
              name="fundalHeight"
              required
            />

            <InputField
              textLabel="Batimentos Cardiácos Fetais"
              name="heartBeat"
              placeholder="Descreva"
              required
            />
              
            <InputField
              textLabel="Movimentos Fetais"
              placeholder="Descreva"
              name="fetalMovements"
              required
            />

            <InputField
              textLabel="Toque Vaginal"
              name="vaginalTouch"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Exames das Mamas"
              placeholder="Descreva"
              name="breastExam"
              required
            />

            <InputField
              textLabel="Outros"
              name="others"
              placeholder="Descreva"
              required
            />
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>
      
      <Accordium title="Antecedentes Obstétrico e Ginecológico">
        <div>
          <div className="grid grid-cols-2 items-center gap-x-2">
            <InputField
              textLabel="Idade da Primeira Menstrução"
              name="firstMenstruation"
              placeholder="Descreva"
              required
            />
              
            <InputField
              textLabel="Regularidade do Ciclo Menstrual"
              placeholder="Descreva"
              name="menstrualCycle"
              required
            />

            <InputField
              type="number"
              textLabel="Duração do Fluxo Menstrual"
              name="mestrualFlow"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Quantidade do Fluxo"
              placeholder="Descreva"
              name="flowQuantity"
              required
            />

            <InputField
              textLabel="Doênças Ginecológias"
              name="gynecologicalDiseases"
              placeholder="Descreva"
              required
            />
          </div>
          
          <div className="flex flex-col my-4">
            <div className="flex items-center gap-x-4">
              <label className="text-sm font-medium">Uso de Anticoncepcionais:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="ultrasound"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="ultrasound"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-x-2">
              <div className="flex flex-col">
                <label className="text-xs -mb-3">Tipo</label>
                <InputField
                  placeholder="Descreva"
                  name="type"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xs -mb-3">Tempo de Uso</label>
                <InputField
                  placeholder="Descreva"
                  name="timeOfUse"
                  required
                />
              </div>
            </div>
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Sobre Partos Anteriores">
        <div>
          <div className="grid grid-cols-2 items-center gap-x-4">
            <InputField
              type="number"
              textLabel="Número de Gestações Anteriores"
              name="previousPregnancies"
              placeholder="Descreva"
              required
            />
              
            <InputField
              type="number"
              textLabel="Nª de Partos"
              placeholder="Descreva"
              name="births"
              required
            />

            <InputField
              type="date"
              textLabel="Data do Último Parto"
              name="lastBirths"
              placeholder="Descreva"
              required
            />

            <InputField
              type="number"
              textLabel="Nª de Abortos"
              placeholder="Descreva"
              name="abortions"
              required
            />
          </div>
          
          <div className="flex gap-x-4 items-center my-4">
            <label className="text-sm font-medium">Tipo de Parto:</label>
            <div className="flex gap-x-4">
              <div className="flex gap-x-1 items-center">
                <label className="text-sm">normal</label>
                <InputField
                  type="radio"
                  name="typeOfDelivery"
                />
              </div>

              <div className="flex gap-x-1 items-center">
                <label className="text-sm">Cesariana</label>
                <InputField
                  type="radio"
                  name="typeOfDelivery"
                />
              </div>

              <div className="flex gap-x-1 items-center">
                <label className="text-sm">Parto Prematuro</label>
                <InputField
                  type="radio"
                  name="typeOfDelivery"
                />
              </div>

              <div className="flex gap-x-1 items-center">
                <label className="text-sm">Fórceps</label>
                <InputField
                  type="radio"
                  name="typeOfDelivery"
                />
              </div>										
            </div>
          </div>

          <div className="grid grid-cols-2 items-center gap-x-4">
            <InputField
              textLabel="Complicações em Gestações e Partos Anteriores"
              name="managementOfBirths"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Nª de Abortos"
              placeholder="Descreva"
              name="abortions"
              required
            />
          </div>

          <div className="flex flex-col my-4">
            <div className="flex items-center gap-x-4">
              <label className="text-sm font-medium">Filhos com malformações ou Doênças Congénitas:</label>									
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Sim</label>
                  <InputField
                    type="radio"
                    name="typeOfDelivery"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Não</label>
                  <InputField
                    type="radio"
                    name="typeOfDelivery"
                  />
                </div>
              </div>
            </div>

            
            <div className="flex w-96 flex-col">
              <label className="text-xs -mb-3">Quantos</label>
              <InputField
                type="number"
                name="quantity"
                placeholder="Digite o valor"
              />
            </div>
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Antecedentes Clínicos e Cirúrgicos">
        <div>
          <InputDetails
            rows={3}
            textLabel="Doênças Pré-existentes"
            placeholder="hipertensão, diabetes, doênças cardiácas, outras"
            name="diseases"
            required
          />

          <div className="grid grid-cols-2 items-center gap-x-4">
            <InputField
              textLabel="Alergia"
              name="allergy"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Agente Reativo"
              name="reactiveAgent"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Outros"
              name="others"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Medicamentos em Uso ou Usados"
              name="medicineUsed"
              placeholder="Descreva"
              required
            />

            <InputField
              type="number"
              textLabel="Duração"
              name="duration"
              placeholder="Digite o valor"
              required
            />

            <InputField
              textLabel="Cirurgias Prévias"
              name="previousSurgeries"
              placeholder="Descreva"
              required
            />

            <InputField
              textLabel="Tipo de Cirurgia"
              name="typeOfSurgery"
              placeholder="Descreva"
              required
            />
          
            <InputField
              type="date"
              textLabel="Data"
              name="date"
              placeholder="Descreva"
              required
            />
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="História Familiar e Social">
        <div>
          <InputDetails
            rows={3}
            textLabel="História Familiar e Social"
            placeholder="Doênças na Família (hipertensão, diabetes, doênças cardíacas, falciformação, malformação congénita)"
            name="preExistingDiseases"
            required
          />

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Condições de Vida (habitação, acesso a água potável, saneamento)">
        <div>
          <div className="w-64">
            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Consumo de Tabaco:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="tabacco"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="tabacco"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Consumo de Álcool:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="alcohol"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="alcohol"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Uso de Drogas Ilícitas:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="illicitDrugs"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="illicitDrugs"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Violência Doméstica:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Sim</label>
                  <InputField
                    type="radio"
                    name="violence"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-xs">Não</label>
                  <InputField
                    type="radio"
                    name="violence"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-96">
            <InputField
              textLabel="Outros"
              name="others"
              placeholder="Descreva"
              required
            />
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="História Nutricional e Estilo de Vida">
        <div>
          <div className="w-[425px]">
            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Alimentação Durante a Gestação:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Balanceada</label>
                  <InputField
                    type="radio"
                    name="food"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Deficiente</label>
                  <InputField
                    type="radio"
                    name="food"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Consumo de Frutas e Vegetais:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Sim</label>
                  <InputField
                    type="radio"
                    name="fruitsAndVegetables"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Não</label>
                  <InputField
                    type="radio"
                    name="fruitsAndVegetables"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Actividade Física:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Regular</label>
                  <InputField
                    type="radio"
                    name="physicalActivity"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Ocasional</label>
                  <InputField
                    type="radio"
                    name="physicalActivity"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Nenhuma</label>
                  <InputField
                    type="radio"
                    name="physicalActivity"
                  />
                </div>
              </div>
            </div>

            <div className="flex my-4 items-center justify-between">
              <label className="text-sm font-medium">Ganho de Peso Durante a Gracidez:</label>
              <div className="flex items-center gap-x-2">
                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Sim</label>
                  <InputField
                    type="radio"
                    name="wightGain"
                  />
                </div>

                <div className="flex gap-x-1 items-center">
                  <label className="text-sm">Não</label>
                  <InputField
                    type="radio"
                    name="wightGain"
                  />
                </div>
              </div>
            </div>
          </div>

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Plano Terapêutico e de Cuidados">
        <div>
          <InputDetails
            rows={3}
            textLabel="Plano Terapêutico e de cuidados"
            placeholder="Descreva"
            name="therapyAndCare"
            required
          />

          <Button>Salvar</Button>
        </div>
      </Accordium>

      <Accordium title="Objectivos do Plano Terapêutico e dos Cuidados">
        <div>
          <InputDetails
            rows={3}
            textLabel="Objectivos do Plano Terapêutico e dos Cuidados"
            placeholder="Descreva"
            name="therapyAndCareGoals"
            required
          />

          <Button>Salvar</Button>
        </div>
      </Accordium>						
    </div>
  </Accordium>
  );
}