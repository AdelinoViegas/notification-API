import SubTitle from "@/components/ui/subtitle";
import Accordium from "@/components/ui/accordium";
import { getSurgeriesHistory } from "@/backend/api/clinical/operating-room-api";
import TitleAndSubtitle from "@/components/title-subtitle";
import ViewUserFile from "@/components/view-user-file-client";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Table, { TableRow } from "@/components/table";

type SurgeryHistory = Awaited<ReturnType<typeof getSurgeriesHistory>>[number];

export default async function Page({
  params
}: { 
  params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
  const history = await getSurgeriesHistory(patientId);
  
  return(
    <div>
      <h2 className="text-lg font-bold">Histórico de Cirurgias Feitas</h2>

      <div className="space-y-3 mt-3">
        {history.map((params, index) => (
          <Accordium key={index} title={params.makedt.toLocaleString("pt", { dateStyle: "full", timeStyle: "medium" })}>
            <ViewSurgery surgery={params} />
          </Accordium>
      ))}
      </div>
    </div>
  )
}

function ViewSurgery({ surgery }: { surgery: SurgeryHistory }){
  const vitalSignalsData:TableRow[] = [];
  const vitalSignals = surgery.postAnestheticRecovery.vitalSignal;
  
  if(vitalSignals)
    vitalSignals.forEach((props, index) => {
      vitalSignalsData.push({
        id: String(index),
        row: [
          getDataAndHoursFormat(props.date),
          String(props.pulse),
          String(props.fr),
          String(props.spo2),
          String(props.ta),
          String(props.t),
        ]
    })});
  
  return (
    <div> 
      <div className="mt-4 mb-4">
        <SubTitle className="inline-flex">Identificação do Paciente</SubTitle>
        <div className="grid grid-cols-3 gap-x-6 ps-4">
          <TitleAndSubtitle
            label="Diagnóstico pré-operatório"
            value={surgery.patientIdentification.preoperativeDiagnosis}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Consetimento Informado"
            value={surgery.patientIdentification.informedConsent}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Nome do Responsável"
            value={surgery.patientIdentification.responsible}
            className={{ content: "text-left" }}
          />
        </div>
      </div>

      <div className="my-10">
        <SubTitle className="inline-flex">Avaliação Pré-Operatória</SubTitle>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Histórico Médico e Cirúrgico"
            value={surgery.preoperativeEvaluation.medicalAndsurgicalHistory}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Alergia"
            value={surgery.preoperativeEvaluation.allergies}
            className={{ content: "text-left" }}
          />              
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <div>
            <TitleAndSubtitle
              label="Exames Laboratoriais"
              value={surgery.preoperativeEvaluation.laboratoryTests.description}
              className={{ content: "text-left" }}
            />

           <ViewUserFile id={surgery.preoperativeEvaluation.laboratoryTests.laboratoryStorageId}/>
          </div>

          <div>
            <TitleAndSubtitle
              label="Exames Imagiológicos"
              value={surgery.preoperativeEvaluation.imagingTests.description}
              className={{ content: "text-left" }}
            /> 

            <ViewUserFile id={surgery.preoperativeEvaluation.imagingTests.imagingStorageId}/>
          </div>             
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Estado Clínico Actual"
            value={surgery.preoperativeEvaluation.currentClinicalStatus}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Risco Cirúrgico"
            value={surgery.preoperativeEvaluation.surgicalRisk}
            className={{ content: "text-left" }}
          />              
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Jejum Confirmado"
            value={surgery.preoperativeEvaluation.fastingConfirmed}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Medicação Prévia"
            value={surgery.preoperativeEvaluation.previousMedication}
            className={{ content: "text-left" }}
          />              
        </div>
      </div>

      <div className="mt-4 mb-4">
        <SubTitle className="inline-flex">Planeamento da Cirurgia</SubTitle>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Tipo de cirurgia"
            value={surgery.sugeryType}
            className={{ content: "text-left" }}
          />
          
          <TitleAndSubtitle
            label="Responsável pela cirurgia"
            value={surgery.responsible}
            className={{ content: "text-left" }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Data da cirugia"
            value={surgery.surgeryDate}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Equipa cirúrgica"
            value={surgery.sugeryPlanning.surgicalTeam}
            className={{ content: "text-left" }}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Sala designada"
            value={surgery.sugeryPlanning.designatedRoom}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Materiais e equipamentos necessários"
            value={surgery.sugeryPlanning.materialsAndEquipment}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="ps-4 mb-4">                    
          <TitleAndSubtitle
            label="Dispositivos implantáveis"
            value={surgery.sugeryPlanning.implantableDevices}
            className={{ content: "text-left" }}
          />
        </div>
      </div>

      <div className="my-10">
        <SubTitle className="inline-flex">Checklist de Segurânça Cirúrgica</SubTitle>

        <div className="ps-4 mb-4">
          <TitleAndSubtitle
            label="Local e lado da cirurgia confirmados"
            value={surgery.checkSecurity.surgerySite}
            className={{ content: "text-left" }}
          />
        </div>

        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Identidade do paciente confirmada: </span>
          <span>{surgery.checkSecurity.patientIdentity?"Sim":"Não"}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Consentimento validado: </span>
          <span>{surgery.checkSecurity.validConsent?"Sim":"Não"}</span>
        </p>

        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Risco anestésico verificado: </span>
          <span>{surgery.checkSecurity.anestheticRisk?"Sim":"Não"}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Disponibilidade de sangue e material de emergência confirmada: </span>
          <span>{surgery.checkSecurity.bloodAndEmergencySupplies?"Sim":"Não"}</span>
        </p>
      </div>

      <div className="my-10">
        <SubTitle className="inline-flex">Procedimento Intraoperatório</SubTitle>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Horário de inicio"
            value={getDataAndHoursFormat(surgery.intraoperativeProcedure.startTime)}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Horário de fim"
            value={getDataAndHoursFormat(surgery.intraoperativeProcedure.endTime)}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Tipo de anestesia utilizada:"
            value={surgery.intraoperativeProcedure.typeOfAnesthesia}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Técnica cirúrgica aplicada"
            value={surgery.intraoperativeProcedure.surgicalTechnique}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Implantes/protéses utilizados"
            value={surgery.intraoperativeProcedure.implantsAndProsthesesUsed}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Ocorrências ou complicações intraoperatórias"
            value={surgery.intraoperativeProcedure.intraoperativeComplications}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Volume de fluidos administrados / perdas sanguíneas"
            value={surgery.intraoperativeProcedure.fluidVolumeAndBloodLoss}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Medicação administrada durante e antes do fecho"
            value={surgery.intraoperativeProcedure.medicationAdministered}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="ps-4 mb-4">
          <TitleAndSubtitle
            label="Outro procedimento"
            value={surgery.intraoperativeProcedure.otherProcedure}
            className={{ content: "text-left" }}
          />
        </div>
      </div>

      <div className="mt-4 mb-4">
        <SubTitle className="inline-flex">Recuperação Pós-Anestésica</SubTitle>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Horário de Entrada"
            value={getDataAndHoursFormat(surgery.postAnestheticRecovery.checkInTime)}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Horário de Saída"
            value={getDataAndHoursFormat(surgery.postAnestheticRecovery.checkOutTime)}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Medicação administrada"
            value={surgery.postAnestheticRecovery.medicationAdministered}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Ocorrências pós-anestésicas imediatas"
            value={surgery.postAnestheticRecovery.postAnestheticEvents}
            className={{ content: "text-left" }}
          />
        </div>

        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Actividade Motora: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.motorActivity}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Respiração: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.respiration}</span>
        </p>

        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Circulação: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.circulation}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Coinciência: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.consciousness}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Saturação O2: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.saturation}</span>
        </p>
        
        <p className="ps-4 mb-4">
          <span className="font-medium text-gray-500">Resultado: </span>
          <span>{surgery.postAnestheticRecovery.levelofConsciousness.result}</span>
        </p>

        <div className="ps-4 mb-4">
          <Table
            columns={[
              "Data-hora",
              "FC(pulso)",
              "FR",
              "SpO2",
              "T/A",
              "Tª",
              
            ]} 
            rows={vitalSignalsData}
          />
        </div>
      </div>

      <div className="my-10">
        <SubTitle className="inline-flex">Alta do Bloco</SubTitle>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Estado do paciente"
            value={surgery.requestingService}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Unidade de Destino"
            value={surgery.postAnestheticRecovery.levelofConsciousness.result}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Informação de cirúrgica"
            value={surgery.patientDischarge.surgicalInformation}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="ªDieta"
            value={surgery.patientDischarge.postOperativeIndications.diet}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="grid grid-cols-2 gap-x-6 ps-4 mb-4">
          <TitleAndSubtitle
            label="Analgesia"
            value={surgery.patientDischarge.postOperativeIndications.analgesia}
            className={{ content: "text-left" }}
          />

          <TitleAndSubtitle
            label="Mobilização"
            value={surgery.patientDischarge.postOperativeIndications.mobilization}
            className={{ content: "text-left" }}
          />
        </div>

        <div className="ps-4 mb-4">
          <TitleAndSubtitle
            label="Antibióticos"
            value={surgery.patientDischarge.postOperativeIndications.antibiotics}
            className={{ content: "text-left" }}
          />
        </div>
      </div>
    </div>
  );
}