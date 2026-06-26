"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { SelectionOption } from "@/components/ui/selection";

type CustomCidProps = {
  name?: string;
  options?: SelectionOption[];
  onChange?: (e: {
    target: {
      name?: string;
      value: string;
    };
  }) => void;
};

export default function SelectionCID({
  name,
  options,
  onChange,
}: CustomCidProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<{
    _id: string;
    label: string;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  /*trata valores indefinidos que podem vir da prop options*/
  const formattedOptions = useMemo(() => {
    return (options ?? [])
      .map((option) => ({
        _id: option._id ?? "",
        label: option.label ?? "",
      }))
      .filter(
        (option) =>
          option._id.trim() !== "" &&
          option.label.trim() !== ""
      );
  }, [options]);

  const selectOption = (option: {
    _id: string;
    label: string;
  }) => {
    setSelected(option);
    setIsOpen(false);

    onChange?.({
      target: {
        name,
        value: option._id,
      },
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-[450px]"
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex w-full h-[34px] items-center justify-between rounded-md border-2 bg-white px-3 py-2 text-left hover:bg-gray-100 focus-within:border-blue-500"
      >
        <span className="flex-1 truncate">
          {selected?.label ?? "Selecione"}
        </span>

        <span className="ml-2 transition-transform">
          {isOpen ? <IoIosArrowUp/> : <IoIosArrowDown/>}
        </span>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-md border bg-white shadow-lg">
          {formattedOptions.length === 0 ? (
            <div className="p-3 text-gray-500">
              Nenhuma opção disponível.
            </div>
          ) : (
            formattedOptions.map((option) => (
              <button
                key={option._id}
                type="button"
                onClick={() => selectOption(option)}
                className={`w-full border px-4 py-3 text-left last:border-b-0 hover:bg-gray-100 ${selected?._id === option._id ? "bg-blue-100": ""}`}
              >
                <span className="break-words whitespace-normal">
                  {option.label}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}