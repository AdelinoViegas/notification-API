import clsx from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
  children: React.ReactNode;
  cancel?: boolean;
  className?: string;
}

export default function Button({
  children,
  cancel,
  className,
  ...rest
}: ButtonProps){
  return(
    <button
      {...rest}
      className={clsx(
        "rounded-lg disabled:cursor-not-allowed transition-colors disabled:bg-gray-400 mt-4 flex items-center justify-center px-4 py-1.5 font-medium text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 aria-disabled:cursor-not-allowed aria-disabled:opacity-50",
        {
          "bg-red-600 hover:bg-red-700 active:bg-red-800": cancel,
          "bg-primary hover:opacity-90 active:opacity-80": !cancel,
        },
        className,
      )}
    >
      {children}
    </button>
  );
}