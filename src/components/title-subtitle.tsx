import clsx from "clsx";

export default function TitleAndSubtitle({
  label,
  value,
  className
}:{
  label: string;
  value: string | React.ReactNode;
  className?: {
    label?: string;
    content?: string;
  };
}){
  return(
    <div className="mt-3">
      <p className={clsx(className?.label?className.label:"font-medium text-gray-500")}>{label}</p>
      <div className={clsx(className?.content?className.content:"ml-3")}>{value}</div>
    </div>
  )
}