type AccordiumProps = {
  className?:string;
  title: string;
  children: React.ReactNode;
} & React.DetailsHTMLAttributes<HTMLDetailsElement>;

export default function Accordium({
  className,
  title,
  children,
  ...rest
}:AccordiumProps){

  return(
    <details {...rest} className="overflow-hidden border rounded-xl">
      <summary className={`select-none ${className?className:'hover:bg-primary/20 bg-primary/15'} hover:cursor-pointer font-sans font-medium px-3 py-2`}>{title}</summary>
      <div className="py-3 px-6">
        {children}
      </div>
    </details>
  )
}