export default async function Page({ params }:{
	params: Promise<{
		patientId: string;
	}>
}){
	const { patientId } = await params;
	console.log(patientId);
	return <div>Página principal</div> 
}