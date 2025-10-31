import clsx from "clsx";

export default function FallbackComponent({ lines,className }: { lines?: number; className?: string }){
  return(
    <div className={clsx("w-full", className)}>
      {lines && lines > 1 
      ? Array(lines).fill(null).map((_, k)=><div key={k} className="h-8 w-full bg-gray-100 animate-pulse rounded-lg my-1" />)
      : <div className="h-8 w-full bg-gray-100 animate-pulse rounded-lg" />
      }
    </div>
  )
}