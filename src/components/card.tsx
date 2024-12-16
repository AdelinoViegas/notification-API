import clsx from "clsx";

export default function Card({
  children,
  className
}:{
  children: React.ReactNode;
  className?: string;
}){
  return(
    <div className={clsx(className, "bg-white border rounded-xl px-8 py-4")}>{children}</div>
  )
}