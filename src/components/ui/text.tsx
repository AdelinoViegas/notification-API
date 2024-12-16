import clsx from "clsx";

export default function Text({
  children,
  className
}:{
  children: string;
  className: string;
}){
  return(
    <p className={clsx('text-black', className)}>{children}</p>
  )
}