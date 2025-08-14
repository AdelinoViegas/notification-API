import { SelectionOption } from "@/components/ui/selection";

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
    _id:"others",
    label:"Outros",
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
  ccgTypes
};