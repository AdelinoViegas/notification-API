import { SelectionOption } from "@/components/ui/selection";

export const AngolaProvices: SelectionOption [] = [
  { _id: "bengo", label: "Bengo" },
  { _id: "benguela", label: "Benguela" },
  { _id: "bie", label: "Bié" },
  { _id: "cabinda", label: "Cabinda" },
  { _id: "cuando", label: "Cuando" },
  { _id: "cubango", label: "Cubango" },
  { _id: "cuanza-norte", label: "Cuanza Norte" },
  { _id: "cuanza-sul", label: "Cuanza Sul" },
  { _id: "cunene", label: "Cunene" },
  { _id: "huambo", label: "Huambo" },
  { _id: "huila", label: "Huíla" },
  { _id: "icolo-e-bengo", label: "Icolo e Bengo" },
  { _id: "luanda", label: "Luanda" },
  { _id: "lunda-norte", label: "Lunda Norte" },
  { _id: "lunda-sul", label: "Lunda Sul" },
  { _id: "malanje", label: "Malanje" },
  { _id: "moxico", label: "Moxico" },
  { _id: "moxico-leste", label: "Moxico Leste" },
  { _id: "namibe", label: "Namibe" },
  { _id: "uige", label: "Uíge" },
  { _id: "zaire", label: "Zaire" },
];

const patientGroup:SelectionOption[] = [
  {
    _id:'personal',
    label:"Particular",
  },
  {
    _id:'enterprise',
    label:"Empresa",
  },
  {
    _id:'assured',
    label:"Assegurado",
  },  
  {
    _id:'employee',
    label:"Funcionário",
  }
]

const civilState:SelectionOption[] = [
  {
   _id:'single',
   label:'Solteiro/a',
  },
  {
    _id:'married',
    label:'Casado/a', 
  },
  {
    _id:"widower",
    label:"Viúvo/a",
  },
  {
    _id:"divorced",
    label:"Divorciado/a",
  }
];

const gender:SelectionOption[] = [
  {
   _id:'masculine',
   label:'Maculino',
  },
  {
    _id:'feminine',
    label:'Feminino', 
  },
];

const emergencyService:SelectionOption[] = [
  {
   _id:'masculine',
   label:'Pediatria',
  },
  {
    _id:'feminine',
    label:'Medica', 
  },
  {
    _id: "test",
    label: "Cirurgia"
  }
];

const kinshipDegree:SelectionOption[] = [
	{
		_id:"father",
		label:"Pai",
	},
	{
		_id:"mather",
		label:"Mãe",
	},
	{
		_id:"uncle",
		label:"Tio/a",
	},
	{
		_id:"counsin",
		label:"Primo/a",
	},
  {
		_id:"brother/sister",
		label:"Irmão/ã",
	},
  {
    _id:"nephew/niece",
    label:"Sobrinho/a"
  },
	{
		_id:"grandFather",
		label:"Avô",
	},
	{
		_id:"grandMather",
		label:"Avó",
	},
  {
    _id:"neighbors",
    label:"Vizinhos/as",
  },
  {
    _id:"friends",
    label:"Amigos/as",
  }
];

const patientAccess:SelectionOption[] = [
  {
    _id:'direct',
    label:"Directo",
  },
  {
    _id:'transferred',
    label:"Transferido(a)",
  },
]

const hospitalUnit:SelectionOption[] = [
  {
    _id:'HJM',
    label:"Hospital Josina Machel",
  },
  {
    _id:'HAB',
    label:"Hospital Américo Boavida",
  },
  {
    _id:'HGL',
    label:"Hospital Geral de Luanda",
  },
  {
    _id:'HPD',
    label:"Hospital Pediátrico David Bernardino",
  },
  {
    _id:'CSE',
    label:"Clínica Sagrada Esperança",
  },
  {
    _id:'CM',
    label:"Clínica Multiperfil",
  },
];

const priorityToComponent:SelectionOption[] = [
  { 
    _id: "red", 
    label: "Emergência",
  },
  { 
    _id: "orange", 
    label: "Muito Urgente",
  },
  { 
    _id: "yellow", 
    label: "Urgente",
  },
  { 
    _id: "green", 
    label: "Pouco urgente",
  },
  { 
    _id: "blue", 
    label: "Não urgente",
  },
];

const priority = [
  { 
    _id: "blue", 
    label: "Não urgente",
    urgency: "no",
    time: 240, // in minutes,
    color: "#0090d7",
    description: "Pode aguardar atendimento ou ser encaminhado para outros serviços"
  },
  { 
    _id: "green", 
    label: "Pouco urgente",
    urgency: "little",
    time: 120, // in minutes,
    color: "#28b172",
    description: "Pode aguardar atendimento ou ser encaminhado para outros serviços"
  },
  { 
    _id: "yellow", 
    label: "Urgente",
    urgency: "yes",
    time: 60, // in minutes,
    color: "#ffd900",
    description: "Precisa de atendimento rápido mas pode aguardar"
  },
  { 
    _id: "orange", 
    label: "Muito Urgente",
    urgency: "very",
    time: 10, // in minutes,
    color: "#f8931f",
    description: "Precisa de rápido atendimento"
  },
  { 
    _id: "red", 
    label: "Emergência",
    urgency: "high",
    time: 0, // in minutes,
    color: "#bf2821",
    description: "Precisa de atendimento imediato"
  },
];

const urgencyServices: SelectionOption[] = [
  { 
    _id: "paediatrics", 
    label: "Pediatria"
  },
  {
    _id: "surgery",
    label: "Cirurgia"
  },
  {
    _id: "medicine",
    label: "Medicina"
  }
]; // isto é tbm os officeId

const userCategory = [
  {
    _id: "doctor",
    label: "Médico"
  },
  {
    _id: "nurse",
    label: "Enfermeiro"
  },
  {
    _id: "others",
    label: "Outros"
  },
];

const unitTypes = [
  {
    _id: "workplace",
    label: "Area de trabalho"
  },
  {
    _id: "internment",
    label: "Area de Internamento"
  },
  {
    _id: "laboratory",
    label: "Laboratório"
  },
  {
    _id: "imaging",
    label: "Imagiologia"
  },
];

const ccgTypes = {
  category: {
    single: "Categoria",
    plural: "Categorias"
  },
  classification: {
    single: "Classificação",
    plural: "Classificações"
  },
  group: {
    single: "Grupo",
    plural: "Grupos"
  }
};

const surgerySchedulingArea = [
  {
    _id: "urgency-bank",
    label: "Consultório de urgência",
    color: "red",
  },
  {
    _id: "hospitalization",
    label: "Internamento",
    color: "orange",
  },
  {
    _id: "office",
    label: "Consultório",
    color: "yellow",
  },
  {
    _id: "patient",
    label: "Utentes",
    color: "green",
  },
];

const defaultServiceKinds = [
  { _id: "exam", label: "Exame" },
  { _id: "consultation", label: "Consulta" },
  { _id: "surgery", label: "Cirurgia" },
];

const patientStates = [
  {
    _id:"critical", 
    label:"Muito Grave",
    description: "Paciente em estado crítico, risco de morte iminente, necessita de suporte intensivo.",
    color: {
      tw: {
        bg: "bg-red-500",
        tx: "text-red-500"
      },
      hex: "#ff0000ff"
    }
  },
  {
    _id:"serious", 
    label:"Grave", 
    description: "Paciente com risco aumentado de complicações, exigindo monitorização continua.",
    color: {
      tw: {
        bg: "bg-orange-500",
        tx: "text-orange-500"
      },
      hex: "#ff611eff"
    }
  },
  {
    _id:"moderate", 
    label:"Moderado", 
    description: "Paciente apresenta sintomas relevantes, mas com estabilidade clínica.",
    color: {
      tw: {
        bg: "bg-yellow-500",
        tx: "text-yellow-500"
      },
      hex: "#ffdd00ff"
    }
  },
  {
    _id:"recovered", 
    label:"Recuperado", 
    description: "Paciente encontra-se estável, sem sinais de risco imediato",
    color: {
      tw: {
        bg: "bg-green-500",
        tx: "text-green-500"
      },
      hex: "#00ff26ff"
    }
  },
  {
    _id:"deceased", 
    label:"Falecido", 
    description: "Óbito do Paciente",
    color: {
      tw: {
        bg: "bg-gray-500",
        tx: "text-black"
      },
      hex: "#000000ff"
    }
  }
];

const activityOptions = [
  {_id:"0", label:"Sem movimentos"},
  {_id:"1", label:"Movimenta 2 membros"},
  {_id:"2", label:"Movimenta 4 membros"},
];

const respirationOptions = [
  {_id:"0", label:"Apneia"},
  {_id:"1", label:"Dispneia/respiração superficial"},
  {_id:"2", label:"Respira profundamente e tosse"},
];

const circulationOptions = [
  {_id:"0", label:"P/A alterada em +50% do valor pré-anestésico"},
  {_id:"1", label:"P/A dentro de +/-20% a 50% do valor pré-anestésico"},
  {_id:"2", label:"P/A dentro de +/-20% do valor pré-anestésico"},
];

const consciousnessOptions = [
  {_id:"0", label:"Não responde"},
  {_id:"1", label:"Acordado e confuso/alucinado"},
  {_id:"2", label:"Acordado e orientado"},
];

const saturationOptions = [
  {_id:"0", label:"SpO2 < 90% com O2 suplementar"},
  {_id:"1", label:"Necessita de oxigénio para manter sua SpO2 > 90%"},
  {_id:"2", label:"Manter SpO2 > 92% em ar ambiente"},
];

export { 
  patientGroup,
  civilState,
  gender,
  kinshipDegree,
  patientAccess,
  hospitalUnit,
  emergencyService,
  priority,
  priorityToComponent,
  urgencyServices,
  userCategory,
  unitTypes,
  ccgTypes,
  surgerySchedulingArea,
  defaultServiceKinds,
  patientStates,
  activityOptions,
  respirationOptions,
  circulationOptions,
  consciousnessOptions,
  saturationOptions
};