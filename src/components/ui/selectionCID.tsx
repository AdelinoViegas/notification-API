"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import clsx from "clsx";
import { SelectionOption } from "@/components/ui/selection";

type CustomCidProps = {
  options: SelectionOption[];
  onChange: (e: { target: { value: string } }) => void;
};

export default function SelectionCID({ options, onChange }: CustomCidProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<SelectionOption | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const formattedOptions = useMemo(() => {
    return (options ?? [])
      .filter((o) => o?._id && o?.label)
      .map((o) => ({
        _id: o._id.trim(),
        label: o.label.trim(),
      }));
  }, [options]);

  const selectOption = (option: SelectionOption) => {
    setSelected(option);
    setIsOpen(false);

    onChange({
      target: { value: option._id },
    });
  };

  // click outside
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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-[450px]">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full h-[34px] items-center justify-between rounded-md border-2 bg-white px-3 py-2 text-left hover:bg-gray-100 focus:border-blue-500"
      >
        <span className="flex-1 truncate">
          {selected?.label ?? "Selecione"}
        </span>

        {isOpen ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-40 overflow-y-auto rounded-md border bg-white shadow-lg">
          {formattedOptions.length === 0 ? (
            <div className="p-3 text-gray-500">
              Nenhuma opção disponível.
            </div>
          ) : (
            formattedOptions.map((option) => {
              const isActive = selected?._id === option._id;

              return (
                <button
                  key={option._id}
                  type="button"
                  onClick={() => selectOption(option)}
                  className={clsx(
                    "w-full border-b px-4 py-3 text-left hover:bg-gray-100 last:border-b-0",
                    isActive && "bg-blue-100"
                  )}
                >
                  {option.label}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}