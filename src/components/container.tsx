import clsx from "clsx";

type ContainerProps = { 
  children: React.ReactNode;
  className?: string; // para adicionar style
} & React.HtmlHTMLAttributes<HTMLElement>;

export default function Container({
  children,
  className,
  ...rest
}: ContainerProps){
  return(
    <main {...rest} className={clsx(className, "mx-6 lg:mx-48")}>
      {children}
    </main>
  )
}