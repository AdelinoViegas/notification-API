import type { CountIndicator } from "@/backend/api/type-schema";
import { countIndicator } from "@/backend/api/clinical/workplace-api";

export default async function CountIndicator({ from }: { from: CountIndicator }){
  await countIndicator(from);
  const quantity = 95;

  return(
    <>
      <div className="relative inline-flex">
        <h2 className="bg-red-500 text-white inline-flex p-2 text-xs font-bold rounded-full">{quantity > 50 ? "50": quantity}</h2>
        {quantity > 50 && <p className="absolute top-0 right-0 text-white">+</p>}
      </div>
    </>
  )
}