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
  const TypeIcon = type == "info"? IoIosInformationCircle:
  type=="warn"?IoIosWarning:type == "success"?FaCircleCheck:BiSolidErrorAlt;

  return(
    <div className={clsx(
      'flex gap-3 px-3 py-2 font-medium rounded-md items-center',
      {
        'bg-red-200 text-red-700 border border-red-400': type == 'error',
        'bg-green-200 text-green-700 border border-green-400': type == 'success',
        'bg-yellow-200 text-yellow-700 border border-yellow-400': type == 'warn',
        'bg-blue-200 text-blue-700 border border-blue-400': type == "info"
      }
    )}>
      <TypeIcon className="size-6" />
      {message}
    </div>
  )
}