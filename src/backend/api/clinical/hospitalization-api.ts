"use server";

import { ListPatient } from "./types";

export async function getPatients({
  
}: {
  fullname?: string;
  page?: number;
}){
  try{
    
    return {
      patients: [
        {
          id: 1,
          age: 23,
          name: "test"
        },
        {
          id: 2,
          age: 1234,
          name: "user"
        }
      ],
      availablePages: 1,
      currentPage: 1,
      totalItems: 1
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