import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function Loading(){
  return(
    <main className="flex justify-center items-center h-screen">
      <AiOutlineLoading3Quarters className="animate-spin" />
    </main>
  )
}