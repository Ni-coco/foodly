import { ReactNode } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function DrawerComponent({
  isOpen,
  onClose,
  title,
  children,
}: DrawerProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={onClose}
        />

        {/* Responsive Drawer */}
        <div
          className={`absolute right-0 top-0 h-full bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 overflow-scroll ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } 
                        w-full md:w-2/3 lg:w-1/2 xl:w-2/5`}
        >
          <div className="w-full flex justify-between items-center border-b p-3 bg-[#006d77] text-white">
            <h1 className="text-lg font-semibold">{title}</h1>
            <button
              onClick={onClose}
              className="text-teal hover:text-white rounded-full p-1 bg-white hover:bg-terracotta transition-all duration-150"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <div className="bg-[#f3f4f6] p-6 flex flex-col justify-center items-center w-full">
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
