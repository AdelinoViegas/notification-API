"use client";

import { 
  useCallback, 
  useEffect, 
  useState 
} from "react";
import { 
  IoMdArrowDroprightCircle, 
  IoMdArrowDropleftCircle 
} from "react-icons/io";
import { 
  usePathname, 
  useSearchParams,
  useRouter
} from "next/navigation";
import clsx from "clsx";

const URL_KEYNAME = "p";

export default function Pagination({
  availablePages,
  totalItems,
}:{
  availablePages: number;
  totalItems: number;
}){
  const [ currentPage, setCurrentPage ] = useState("");
  const router = useRouter();
  const pageSearchParams = useSearchParams();
  const pathname = usePathname();
  const _availablePages = Math.ceil(availablePages);
  
  const getCurrentPage = useCallback(()=> pageSearchParams.get(URL_KEYNAME), [pageSearchParams]);
  
  const setSearchPage = useCallback((n: string)=>{
    const searchParams = new URLSearchParams(pageSearchParams);
    searchParams.set(URL_KEYNAME, n);
    router.push(`${pathname}?${searchParams.toString()}`);
  }, [router, pageSearchParams, pathname]);
  
  const nextPage = ()=>{
    const page = pageSearchParams.get(URL_KEYNAME);
    if(page && Number(page) < _availablePages)
      setSearchPage(String(Number(page)+1));
  }
  
  const previousPage = ()=>{
    const page = pageSearchParams.get(URL_KEYNAME);
    if(page && Number(page) > 1)
      setSearchPage(String(Number(page)-1));
  }
  
  const definedPage = (page: number) => {
    setSearchPage(String(page));
  }
  
  const genRange = (n: number)=> {
    const ranges = [];
    if(!n) return [1];
    for(let i = 1; i <= n; i++)
      ranges.push(i);
    return ranges;
  }
  
  useEffect(()=>{
    const page = getCurrentPage();
    if(page)
      setCurrentPage(page);
    else 
      setCurrentPage("1");
  }, [pageSearchParams, getCurrentPage]);

  useEffect(()=>{
    // router.push(`${pathname}?page=1`);
    setSearchPage("1");

  }, [router, pathname]);
  
  return(
    <div className="w-full inline-flex justify-center items-center gap-3">
      <div className="flex gap-3 border-2 border-gray-300 border rounded-md">
        <button 
          onClick={previousPage} 
          className="border rounded-r-none border-[1.5px] font-medium text-primary text-sm hover:bg-gray-300 bg-gray-200 px-2 rounded-md flex gap-2 items-center">
          <IoMdArrowDropleftCircle className="size-5" />
          Anterior
        </button>
        <div className="flex gap-3 max-w-md overflow-x-auto py-1">
          {genRange(_availablePages).map(item => (
            <button key={item} className={clsx('rounded-md border border-2 border-primary/25 hover:bg-blue-200 px-2', { "bg-primary text-white hover:bg-primary/50": Number(currentPage) === item})} onClick={()=>definedPage(item)}>{item}</button>
          ))}
        </div>
        <button 
          onClick={nextPage}
          className="border rounded-l-none border-[1.5px] font-medium text-primary text-sm hover:bg-gray-300 bg-gray-200 px-2 rounded-md flex gap-2 items-center">
            Proximo
            <IoMdArrowDroprightCircle className="size-5" />
        </button>
      </div>
      <p className="text-xs">Total de {totalItems} registros</p>
    </div>
  )
}