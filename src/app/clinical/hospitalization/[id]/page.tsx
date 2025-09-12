export default async function Page({ 
  params,
  searchParams 
}:{ 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r: "r" | "h" | "n" }>;
}){
  const [{ id }, { r }] = await Promise.all([ params,  searchParams ]);
  
  return(
    <div>
      formutario de acomodar
    </div>
  )
}