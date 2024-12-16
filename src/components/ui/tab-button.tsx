import clsx from "clsx";
type TabButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &{
  isActive: boolean;
};
export default function TabButton({
  children,
  isActive,
  ...rest
}:TabButtonProps){
  return(
    <button {...rest} className={clsx("px-3 py-4", {
      "bg-red-500": isActive
    })}>
      {children}
    </button>
  )
}