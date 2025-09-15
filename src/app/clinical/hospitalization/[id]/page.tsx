import Accommodate from "@/components/hospitalization/accommodate";

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
      <div className="w-1/2">
        <Accommodate id={id} />
      </div>
    </div>
  )
}