"use server";

import { ListPatient } from "./types";

export async function getPatients({
  
}: {
  fullname?: string;
  page?: number;
}){
  try{
    
    return {
      patients: [],
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