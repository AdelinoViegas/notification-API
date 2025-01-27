import clsx from "clsx";

type ParamsProps = {
  status: boolean;
  customText?: string; 
}

export default function LabelStatus({
  status,
  customText
}: ParamsProps){
  return(
    <div className={clsx(
      'font-medium text-sm font-sans px-3 py-1 rounded-md',
      {
       'bg-green-200 text-green-700': status === true,
       'bg-red-200 text-red-700': status == false 
      }
    )}>
      {!customText && (status ?'Activado': 'Desativado')}

      {
        customText &&(
          status ? 
            <div className="flex gap-3">
              <p>{customText}</p>
              {/* <HandThumbUpIcon className="h-5" /> */}
            </div>
            :
            <div className="flex gap-3">
              <p>{customText}</p>
              {/* <HandThumbDownIcon className="h-5" /> */}
            </div>
        )
      }
    </div>
  )
}