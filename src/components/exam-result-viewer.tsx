import clsx from "clsx";
import Card from "./ui/card";
import { FileHandler } from "@/lib/client-files";
import { getDataAndHoursFormat } from "@/lib/date-formater";
import Link from "next/link";

type ExamResult = {
  name: string;
  plainText?: string;
  file?: {
    name: string;
    size: number;
    link: string;
  },
  createdAt: Date;
} 
export default function ExamResultViewer({
  results
}: { 
  results: ExamResult[] 
}){
  return(
    <Card>
      <h2 className="text-primary font-medium text-lg">Histórico de Exames realizados</h2>
      <div className="h-96 overflow-auto px-3">
        { results.reverse().map((item, i)=>(
          <div key={i} className={clsx(!(results.length - 1 === i) &&"border-b", "my-3")}>
            <p><span className="font-medium">Tipo de exame:</span> {item.name}</p>
            <p><span className="font-medium">Feito em:</span> { getDataAndHoursFormat(item.createdAt)}</p>
            {!!item.plainText && <p><span className="font-medium text-red-500">Resultado Descritivo: </span> {item.plainText}</p>}
            {!!item.file?.size && <>
              <p><span className="font-medium">Resultado Documental: </span>
                <Link 
                  className="hover:text-sky-500 hover:underline text-sky-800" 
                  target="_blank" 
                  href={item.file.link}
                >
                  {item.file?.name}
                </Link>
              </p>
              <p><span className="font-medium">Tamanho do Ficheiro:</span> {FileHandler.getFileHandlerToString(item.file.size)}</p>
            </>}
          </div>
        ))}
      </div>
    </Card>
  );
}