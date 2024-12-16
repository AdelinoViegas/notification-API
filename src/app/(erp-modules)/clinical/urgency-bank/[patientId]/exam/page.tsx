"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/ui/button";
import Link from "next/link";

export default function Page(){
  const path = usePathname();
  return(
    <div className="flex gap-x-2">
      <Link href={`${path}`+"/see-exames"}>
        <Button>Ver Exames</Button>
      </Link>
      <Button className="bg-slate-700">Requisitar Exames</Button>
    </div>
  );
}