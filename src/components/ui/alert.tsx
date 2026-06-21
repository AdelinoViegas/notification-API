import clsx from "clsx";
import { IoIosInformationCircle, IoIosWarning } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { BiSolidErrorAlt } from "react-icons/bi";

type AlertProps = {
  type: "info" | "error" | "success" | "warn";
  message: string;
};

export default function Alert({
  type,
  message
}: AlertProps){
  const IconComponent = type == "info"? IoIosInformationCircle:
  type=="warn"?IoIosWarning:type == "success"?FaCircleCheck:BiSolidErrorAlt;
  
  const titles = {
    warn: "Avizo",
    info: "Informação",
    success: "Sucesso",
    error: "Erro"
  }

  return(
    <div className={clsx(
      'flex gap-x-2 px-3 py-1 rounded-md items-center',
      {
        'bg-red-100 text-red-700 border border-red-600': type == 'error',
        'bg-green-100 text-green-700 border border-green-600': type == 'success',
        'bg-yellow-100 text-yellow-700 border border-yellow-600': type == 'warn',
        'bg-blue-100 text-blue-700 border border-blue-600': type == "info"
      }
    )}>
      <IconComponent className="size-6" />
      <div>
        <p className="font-bold">{titles[type]}</p>
        <p>{message}</p>
      </div>
    </div>
  )
}