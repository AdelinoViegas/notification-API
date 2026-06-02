"use client";

import {
  useRouter,
  usePathname,
  useSearchParams,
} from "next/navigation";
import InputField from "@/components/ui/input-field";
import Button from "@/components/ui/button";
import { BsBackspace as BackspaceIcon } from "react-icons/bs";
import { useRef } from "react";

export default function PeriodFilter() {
  const searchParams = useSearchParams();
  const search = new URLSearchParams(searchParams);
  const pathname = usePathname();
  const router = useRouter();
  const fromRef = useRef<HTMLInputElement>(null);
  const toRef = useRef<HTMLInputElement>(null);

  const handleFilter = () => {
    const from = fromRef.current?.value;
    const to = toRef.current?.value;

    if (from) search.set("fromDate", from);
    else search.delete("fromDate");

    if (to) search.set("toDate", to);
    else search.delete("toDate");

    router.push(`${pathname}?${search.toString()}`);
  };

  const handleClear = () => {
    if (fromRef.current) fromRef.current.value = "";
    if (toRef.current) toRef.current.value = "";
    search.delete("fromDate");
    search.delete("toDate");
    router.push(`${pathname}?${search.toString()}`);
  };

  return (
    <div className="flex items-end gap-3">
      <InputField
        className="my-0"
        ref={fromRef}
        textLabel="De"
        type="date"
        defaultValue={searchParams.get("fromDate") ?? ""}
      />
      <InputField
        className="my-0"
        ref={toRef}
        textLabel="Até"
        type="date"
        defaultValue={searchParams.get("toDate") ?? ""}
      />
      <Button type="button" onClick={handleFilter}>
        Filtrar
      </Button>
      <Button type="button" cancel onClick={handleClear}>
        <BackspaceIcon className="size-5" />
      </Button>
    </div>
  );
}
