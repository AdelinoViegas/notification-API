import clsx from "clsx";

type AccordiumProps = {
  className?:string;
  title: string;
  children: React.ReactNode;
  extraClassName?: string;
} & React.DetailsHTMLAttributes<HTMLDetailsElement>;

export default function Accordium({
  className,
  title,
  children,
  extraClassName,
  ...rest
}:AccordiumProps){

  return(
    <details {...rest} className={clsx("overflow-hidden border rounded-xl", extraClassName)}>
      <summary className={`select-none ${className?className:'hover:bg-primary/20 bg-primary/15'} hover:cursor-pointer font-sans font-medium px-3 py-2`}>{title}</summary>
      <div className="py-3 px-6">
        {children}
      </div>
    </details>
  )
}

