"use client";

import { usePathname } from "next/navigation";
import clsx from "clsx";

export default function ExamLayout({ children } : {children:React.ReactNode}) {

  const pathname = usePathname();
  const isActive = pathname.startsWith("/clinical/office/66ec35932a5b95a94a120e06/exam");

  return (
      <div className={clsx("common-styles", { "active-styles": isActive })}>
        {children}
      </div>
  );
}