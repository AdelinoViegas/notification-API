import clsx from "clsx";

type TitleType = {
  children: string | number | undefined;
  size?: 'md' | 'lg' | 'xl'
}

export default function Title({
  children,
  size
}: TitleType){
  return(
    <h1 className={clsx('text-black font-sans font-medium',{
      'text-xl': size == 'xl',
      'text-lg': size == 'lg' || !size,
      'text-md': size == 'md'
    })}>
      {children}
    </h1>
  )
}