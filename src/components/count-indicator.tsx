import type { CountIndicator } from "@/backend/api/type-schema";
import { countIndicator } from "@/backend/api/clinical/workplace-api";
import clsx from "clsx";

export default async function CountIndicator({ from }: { from: CountIndicator }){
  const quantity = await countIndicator(from);

  return(
    <>
      <div className="relative inline-flex">
        <h2 className={clsx("bg-red-500 text-white inline-flex p-2 text-xs font-bold rounded-full", quantity <= 9 && "px-3")}>{quantity > 50 ? "50": quantity}</h2>
        {quantity > 50 && <p className="absolute top-0 right-0 text-white">+</p>}
      </div>
    </>
  )
}