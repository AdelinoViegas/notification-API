import clsx from "clsx";

export default function FallbackComponent({ lines,className }: { lines?: number; className?: string }){
  const _class = "h-8 w-full bg-gray-200 animate-pulse rounded-lg";

  return(
    <div className={clsx("w-full", className)}>
      {lines && lines > 1 
      ? Array(lines).fill(null).map((_, k)=><div key={k} className={clsx(_class, "my-1")} />)
      : <div className={_class} />
      }
    </div>
  )
}