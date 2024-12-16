import clsx from "clsx";

export default function SubTitle({
  children,
  className
}:{
  children: React.ReactNode;
  className?: string;
}){
  return(
    <div>
      <h2 className={clsx(className, 'border text-sm font-medium bg-blue-100 text-primary px-3 py-1 rounded-full text-center')}>
        {children}
      </h2>
    </div>
  )
}