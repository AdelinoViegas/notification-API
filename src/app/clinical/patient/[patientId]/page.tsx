import PatientForm from "@/components/forms/patient-form";

export default async function Page({ params }:{
	params: Promise<{ patientId: string }>
}){
  const { patientId } = await params;
	return <PatientForm {...{patientId}} /> 
}