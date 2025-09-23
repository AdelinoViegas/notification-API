import Accommodate from "@/components/hospitalization/accommodate";

export default async function Page({ }:{ 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ r: "r" | "h" | "n" }>;
}){
  
  return(
    <div>
      <div className="w-1/2">
        <Accommodate />
      </div>
    </div>
  )
}