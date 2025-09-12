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