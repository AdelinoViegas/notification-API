import clsx from "clsx";

export type SelectionOption = {
  _id: string;
  label: string;
};

interface SelectProps extends React.InputHTMLAttributes<HTMLSelectElement>{
  label: string;
  className?: string;
  defaultOptionLabel?: string;
  options: SelectionOption[];
};

export default function Selection({
  label,
  options,
  defaultValue,
  defaultOptionLabel,
  className,
  ...rest
}: SelectProps){
  return(
    <div className={clsx("flex flex-col my-4 gap-y-1", className)}>
      <label className="text-xs font-medium">{label}</label>
      <select {...rest} className={clsx('disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500 bg-white focus:border-blue-500 px-3 py-[6px] border rounded-md border-2 hover:bg-gray-100',
        { 
          'w-auto': !className,
        }
      )}>
        <option value="">{defaultOptionLabel?defaultOptionLabel:"Selecione"}</option>
        {options.map((props, index)=> 
          <option 
            key={index} 
            value={props._id?.toString()}>
              {props.label}
          </option>
        )}
      </select>
    </div>
  )
}