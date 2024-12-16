import clsx from "clsx";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
  textLabel?: string;
  isStrongPassword?: boolean;
  password?: boolean;
  className?: string;
}

export default function InputField({
  textLabel,
  isStrongPassword,
  password,
  className,
  ...rest
}: InputFieldProps){

  return(
    <div className={clsx("flex flex-col my-4", className)}>
      <label className="text-xs font-medium">{textLabel}</label>
      <input 
        {...rest} 
        autoComplete="off"
        className={clsx("focus:invalid:border-red-500 disabled:text-gray-500 disabled:bg-gray-100 rounded-lg border-2 placeholder:text-sm outline-none transition focus:border-blue-500 py-1 px-2",
          {
            "focus:border-red-500": !isStrongPassword && password,
            "focus:border-green-500": !!isStrongPassword && password
          }
        )} />
      <label className={clsx('text-sm font-medium',
        {
          "hidden": !password,
          "text-green-600": isStrongPassword,
          "text-red-500": !isStrongPassword
        }
        )}>
        {
          isStrongPassword?"Senha excelente!":"Senha muito fraca!"
        }
      </label>
    </div>
  )
}