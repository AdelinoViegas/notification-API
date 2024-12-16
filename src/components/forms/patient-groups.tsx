"use client";

import Selection from "@/components/ui/selection";
import { useState } from "react";
import AssuredInputs from "./patient-groups/assured-inputs";
import Enterprise from "./patient-groups/enterprise-inputs";
import Employee from "./patient-groups/employee-inputs";
import { patientGroup } from "@/app/backend/api/clinical/translator";

export default function PatientGroups(){
  const [ selectedPatientGroup, setSelectedPatientGroup ] = useState("");
  
  return(
    <div>
      <Selection
        className="w-96"
        name="patientGroup"
        label="Escolha o grupo de utentes"
        options={patientGroup}
        onChange={(e)=>setSelectedPatientGroup(e.target.value)}
      />

      { selectedPatientGroup==="assured" &&
        <AssuredInputs />
      }

      { selectedPatientGroup==="enterprise" &&
        <Enterprise />
      }

      { selectedPatientGroup==="employee" &&
        <Employee />
      }
    </div>
  );  
}