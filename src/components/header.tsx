import clsx from "clsx";

export default function Header({
  title,
  children,
  center,
  className,
}: {
  children?: React.ReactNode;
  title: string;
  center?: boolean;
  className?: string;
}){
  if(center)
    return(
      <header className={clsx(className, "flex justify-center border-b pb-3 items-center px-2")}>
        <h2 className={`font-medium text-xl uppercase`}>{title}</h2>
      </header>
    );
  return(
    <header className={clsx(className, "flex justify-between border-b pb-3 items-center px-2")}>
      <h2 className={"font-medium text-xl"}>{title}</h2>
      {children}
    </header>
  );
}