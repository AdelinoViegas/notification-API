type InputDetailProps = {
  textLabel: string;
} & React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export default function InputDetails({
  textLabel,
  rows,
  ...rest
}: InputDetailProps){
  return(
    <div className="flex flex-col gap-2 my-4">
      <label className="text-xs font-semibold text-gray-700">{textLabel}</label>
      <textarea 
        rows={rows?rows:5}
        className={"focus:invalid:border-red-500 disabled:text-gray-500 disabled:bg-gray-100 rounded-lg border-2 placeholder:text-sm outline-none transition focus:border-blue-500 py-1 px-2"}
        {...rest} 
      />
    </div>
  )
}