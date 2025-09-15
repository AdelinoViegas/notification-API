"use server";

import { ListPatient } from "./types";

interface Patient {
  id: string;
  service: string;
  createdAt: string;
  fullname: string;
  currentState: string;
  doctor: string; 
}

interface Hospitalized {
  id: string;
  fullname: string;
  nursingPosition: string;
  bed: string;
  processNumber: string;
  doctor: string; 
}


const mockPatients: Patient[] = [
  {
    id: "1",
    service: "Cardiology",
    createdAt: "2025-09-01T08:00:00Z",
    fullname: "Alice Johnson",
    currentState: "Waiting",
    doctor: "Dr. Smith"
  },
  {
    id: "2",
    service: "Dermatology",
    createdAt: "2025-09-01T09:15:00Z",
    fullname: "Bob Martinez",
    currentState: "In Consultation",
    doctor: "Dr. Lee"
  },
  {
    id: "3",
    service: "Pediatrics",
    createdAt: "2025-09-01T10:30:00Z",
    fullname: "Charlie Nguyen",
    currentState: "Completed",
    doctor: "Dr. Patel"
  },
  {
    id: "4",
    service: "Oncology",
    createdAt: "2025-09-01T11:45:00Z",
    fullname: "Dana White",
    currentState: "Waiting",
    doctor: "Dr. Carter"
  },
  {
    id: "5",
    service: "Orthopedics",
    createdAt: "2025-09-01T13:00:00Z",
    fullname: "Ethan Garcia",
    currentState: "In Consultation",
    doctor: "Dr. Adams"
  },
  {
    id: "6",
    service: "Neurology",
    createdAt: "2025-09-01T14:15:00Z",
    fullname: "Fiona Lopez",
    currentState: "Completed",
    doctor: "Dr. Brown"
  },
  {
    id: "7",
    service: "Gastroenterology",
    createdAt: "2025-09-01T15:30:00Z",
    fullname: "George Wang",
    currentState: "Waiting",
    doctor: "Dr. Clark"
  },
  {
    id: "8",
    service: "Cardiology",
    createdAt: "2025-09-02T08:00:00Z",
    fullname: "Hannah Kumar",
    currentState: "Cancelled",
    doctor: "Dr. Smith"
  },
  {
    id: "9",
    service: "Dermatology",
    createdAt: "2025-09-02T09:30:00Z",
    fullname: "Ian Brown",
    currentState: "In Consultation",
    doctor: "Dr. Lee"
  },
  {
    id: "10",
    service: "Pediatrics",
    createdAt: "2025-09-02T10:45:00Z",
    fullname: "Julia Taylor",
    currentState: "Completed",
    doctor: "Dr. Patel"
  },
  {
    id: "11",
    service: "Oncology",
    createdAt: "2025-09-02T11:55:00Z",
    fullname: "Kevin Johnson",
    currentState: "Waiting",
    doctor: "Dr. Carter"
  },
  {
    id: "12",
    service: "Orthopedics",
    createdAt: "2025-09-02T13:10:00Z",
    fullname: "Laura Martinez",
    currentState: "In Consultation",
    doctor: "Dr. Adams"
  },
  {
    id: "13",
    service: "Neurology",
    createdAt: "2025-09-02T14:20:00Z",
    fullname: "Michael Nguyen",
    currentState: "Completed",
    doctor: "Dr. Brown"
  },
  {
    id: "14",
    service: "Gastroenterology",
    createdAt: "2025-09-02T15:35:00Z",
    fullname: "Nina White",
    currentState: "Waiting",
    doctor: "Dr. Clark"
  },
  {
    id: "15",
    service: "Cardiology",
    createdAt: "2025-09-03T08:10:00Z",
    fullname: "Oscar Garcia",
    currentState: "Cancelled",
    doctor: "Dr. Smith"
  },
  {
    id: "16",
    service: "Dermatology",
    createdAt: "2025-09-03T09:25:00Z",
    fullname: "Paula Lopez",
    currentState: "In Consultation",
    doctor: "Dr. Lee"
  },
  {
    id: "17",
    service: "Pediatrics",
    createdAt: "2025-09-03T10:40:00Z",
    fullname: "Quinn Wang",
    currentState: "Completed",
    doctor: "Dr. Patel"
  },
  {
    id: "18",
    service: "Oncology",
    createdAt: "2025-09-03T11:50:00Z",
    fullname: "Rita Kumar",
    currentState: "Waiting",
    doctor: "Dr. Carter"
  },
  {
    id: "19",
    service: "Orthopedics",
    createdAt: "2025-09-03T13:05:00Z",
    fullname: "Sam Brown",
    currentState: "In Consultation",
    doctor: "Dr. Adams"
  },
  {
    id: "20",
    service: "Neurology",
    createdAt: "2025-09-03T14:15:00Z",
    fullname: "Tina Taylor",
    currentState: "Completed",
    doctor: "Dr. Brown"
  },
  {
    id: "21",
    service: "Gastroenterology",
    createdAt: "2025-09-03T15:25:00Z",
    fullname: "Uma Johnson",
    currentState: "Waiting",
    doctor: "Dr. Clark"
  },
  {
    id: "22",
    service: "Cardiology",
    createdAt: "2025-09-04T08:20:00Z",
    fullname: "Victor Martinez",
    currentState: "Cancelled",
    doctor: "Dr. Smith"
  },
  {
    id: "23",
    service: "Dermatology",
    createdAt: "2025-09-04T09:35:00Z",
    fullname: "Wendy Nguyen",
    currentState: "In Consultation",
    doctor: "Dr. Lee"
  },
  {
    id: "24",
    service: "Pediatrics",
    createdAt: "2025-09-04T10:50:00Z",
    fullname: "Xavier White",
    currentState: "Completed",
    doctor: "Dr. Patel"
  },
  {
    id: "25",
    service: "Oncology",
    createdAt: "2025-09-04T12:00:00Z",
    fullname: "Yara Garcia",
    currentState: "Waiting",
    doctor: "Dr. Carter"
  },
  {
    id: "26",
    service: "Orthopedics",
    createdAt: "2025-09-04T13:15:00Z",
    fullname: "Zane Lopez",
    currentState: "In Consultation",
    doctor: "Dr. Adams"
  },
  {
    id: "27",
    service: "Neurology",
    createdAt: "2025-09-04T14:25:00Z",
    fullname: "Ava Wang",
    currentState: "Completed",
    doctor: "Dr. Brown"
  },
  {
    id: "28",
    service: "Gastroenterology",
    createdAt: "2025-09-04T15:40:00Z",
    fullname: "Ben Kumar",
    currentState: "Waiting",
    doctor: "Dr. Clark"
  },
  {
    id: "29",
    service: "Cardiology",
    createdAt: "2025-09-05T08:30:00Z",
    fullname: "Cleo Brown",
    currentState: "Cancelled",
    doctor: "Dr. Smith"
  },
  {
    id: "30",
    service: "Dermatology",
    createdAt: "2025-09-05T09:45:00Z",
    fullname: "Dylan Taylor",
    currentState: "In Consultation",
    doctor: "Dr. Lee"
  }
];

const mockHospitalized: Hospitalized[] = [
  {
    id: '1',
    fullname: 'Ana Beatriz Ferreira',
    nursingPosition: 'Enfermaria 1A',
    bed: '01',
    processNumber: 'PRC-1001',
    doctor: 'Dr. João Silva',
  },
  {
    id: '2',
    fullname: 'Carlos Eduardo Rocha',
    nursingPosition: 'Enfermaria 1B',
    bed: '02',
    processNumber: 'PRC-1002',
    doctor: 'Dra. Mariana Lopes',
  },
  {
    id: '3',
    fullname: 'Fernanda Souza Lima',
    nursingPosition: 'UTI 2A',
    bed: '03',
    processNumber: 'PRC-1003',
    doctor: 'Dr. Bruno Castro',
  },
  {
    id: '4',
    fullname: 'José Henrique Almeida',
    nursingPosition: 'UTI 2B',
    bed: '04',
    processNumber: 'PRC-1004',
    doctor: 'Dra. Patrícia Ramos',
  },
  {
    id: '5',
    fullname: 'Mariana Tavares',
    nursingPosition: 'Enfermaria 3A',
    bed: '05',
    processNumber: 'PRC-1005',
    doctor: 'Dr. Lucas Martins',
  },
  {
    id: '6',
    fullname: 'Rafael Moura',
    nursingPosition: 'Enfermaria 3B',
    bed: '06',
    processNumber: 'PRC-1006',
    doctor: 'Dra. Camila Farias',
  },
  {
    id: '7',
    fullname: 'Isabela Nogueira',
    nursingPosition: 'UTI 1A',
    bed: '07',
    processNumber: 'PRC-1007',
    doctor: 'Dr. André Costa',
  },
  {
    id: '8',
    fullname: 'Pedro Vinícius Mendes',
    nursingPosition: 'UTI 1B',
    bed: '08',
    processNumber: 'PRC-1008',
    doctor: 'Dra. Larissa Dias',
  },
  {
    id: '9',
    fullname: 'Juliana Silva Torres',
    nursingPosition: 'Enfermaria 4A',
    bed: '09',
    processNumber: 'PRC-1009',
    doctor: 'Dr. Gustavo Teixeira',
  },
  {
    id: '10',
    fullname: 'Luciano Ramos',
    nursingPosition: 'Enfermaria 4B',
    bed: '10',
    processNumber: 'PRC-1010',
    doctor: 'Dra. Renata Lima',
  },
  {
    id: '11',
    fullname: 'Cláudia Fernandes',
    nursingPosition: 'UTI 3A',
    bed: '11',
    processNumber: 'PRC-1011',
    doctor: 'Dr. Felipe Souza',
  },
  {
    id: '12',
    fullname: 'Marcelo Vieira',
    nursingPosition: 'UTI 3B',
    bed: '12',
    processNumber: 'PRC-1012',
    doctor: 'Dra. Bianca Rocha',
  },
  {
    id: '13',
    fullname: 'Aline Costa',
    nursingPosition: 'Enfermaria 5A',
    bed: '13',
    processNumber: 'PRC-1013',
    doctor: 'Dr. Tiago Carvalho',
  },
  {
    id: '14',
    fullname: 'Renato Pires',
    nursingPosition: 'Enfermaria 5B',
    bed: '14',
    processNumber: 'PRC-1014',
    doctor: 'Dra. Natália Ferreira',
  },
  {
    id: '15',
    fullname: 'Beatriz Campos',
    nursingPosition: 'UTI 4A',
    bed: '15',
    processNumber: 'PRC-1015',
    doctor: 'Dr. Leandro Melo',
  },
  {
    id: '16',
    fullname: 'Rodrigo Almeida',
    nursingPosition: 'UTI 4B',
    bed: '16',
    processNumber: 'PRC-1016',
    doctor: 'Dra. Paula Monteiro',
  },
  {
    id: '17',
    fullname: 'Tatiane Gomes',
    nursingPosition: 'Enfermaria 6A',
    bed: '17',
    processNumber: 'PRC-1017',
    doctor: 'Dr. Eduardo Barros',
  },
  {
    id: '18',
    fullname: 'Fábio Nascimento',
    nursingPosition: 'Enfermaria 6B',
    bed: '18',
    processNumber: 'PRC-1018',
    doctor: 'Dra. Carla Pimentel',
  },
  {
    id: '19',
    fullname: 'Vanessa Cruz',
    nursingPosition: 'UTI 5A',
    bed: '19',
    processNumber: 'PRC-1019',
    doctor: 'Dr. Rafael Lima',
  },
  {
    id: '20',
    fullname: 'Tiago Ribeiro',
    nursingPosition: 'UTI 5B',
    bed: '20',
    processNumber: 'PRC-1020',
    doctor: 'Dra. Gabriela Duarte',
  },
  {
    id: '21',
    fullname: 'Lívia Mourão',
    nursingPosition: 'Enfermaria 7A',
    bed: '21',
    processNumber: 'PRC-1021',
    doctor: 'Dr. Murilo Garcia',
  },
  {
    id: '22',
    fullname: 'Danilo Sales',
    nursingPosition: 'Enfermaria 7B',
    bed: '22',
    processNumber: 'PRC-1022',
    doctor: 'Dra. Heloísa Freitas',
  },
  {
    id: '23',
    fullname: 'Patrícia Oliveira',
    nursingPosition: 'UTI 6A',
    bed: '23',
    processNumber: 'PRC-1023',
    doctor: 'Dr. Alexandre Braga',
  },
  {
    id: '24',
    fullname: 'Murilo Santana',
    nursingPosition: 'UTI 6B',
    bed: '24',
    processNumber: 'PRC-1024',
    doctor: 'Dra. Juliana Bastos',
  },
  {
    id: '25',
    fullname: 'Letícia Ribeiro',
    nursingPosition: 'Enfermaria 8A',
    bed: '25',
    processNumber: 'PRC-1025',
    doctor: 'Dr. Roberto Nunes',
  },
  {
    id: '26',
    fullname: 'Alexandre Torres',
    nursingPosition: 'Enfermaria 8B',
    bed: '26',
    processNumber: 'PRC-1026',
    doctor: 'Dra. Ana Lúcia Vieira',
  },
  {
    id: '27',
    fullname: 'Camila Fernandes',
    nursingPosition: 'UTI 7A',
    bed: '27',
    processNumber: 'PRC-1027',
    doctor: 'Dr. Vitor Andrade',
  },
  {
    id: '28',
    fullname: 'Vinícius Matos',
    nursingPosition: 'UTI 7B',
    bed: '28',
    processNumber: 'PRC-1028',
    doctor: 'Dra. Sílvia Moreira',
  }
];

export async function getPatients({
  page
}: {
  fullname?: string;
  page: number;
}): Promise<ListPatient<Patient>>{
  try{
    
    return {
      patients: mockPatients.slice(0, 9),
      availablePages:  mockPatients.length/10,
      currentPage: page,
      totalItems: mockPatients.length
    }
  }catch {
    return {
      patients: [],
      availablePages: 1,
      currentPage: 1,
      totalItems: 1
    }
  }
}

export async function getHospitalized({
  page
}: {
  fullname?: string;
  page: number;
}): Promise<ListPatient<Hospitalized>>{
  try{
    
    return {
      patients: mockHospitalized.slice(0, 9),
      availablePages:  mockPatients.length/10,
      currentPage: page,
      totalItems: mockPatients.length
    }
  }catch {
    return {
      patients: [],
      availablePages: 1,
      currentPage: 1,
      totalItems: 1
    }
  }
}