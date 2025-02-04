import { ColumnViewModel } from "./viewmodel/ColumnViewModel";
import { ColumnType } from "./viewmodel/ColumnType";
import { Button } from "@headlessui/react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { useState } from "react";
import { FaChevronCircleLeft, FaChevronCircleRight } from "react-icons/fa";

interface TableComponentProps<T> {
  title: string;
  data: T[];
  columns: ColumnViewModel[];
  editBtnLists: EditBtnProps[];
  onAdd: () => void;
  canAdd: boolean;
}

interface EditBtnProps {
  label: string;
  actionCall: (item: any) => void;
  icon?: JSX.Element | null;
}

export default function TableComponent<T>({
  title,
  data,
  columns,
  editBtnLists,
  onAdd,
  canAdd,
}: TableComponentProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 15;

  const filteredData = data.filter((item) => {
    return columns.some((col) => {
      const value = col.subProperty
        ? (item as any)[col.propertyName]?.[col.subProperty]
        : (item as any)[col.propertyName];

      return (
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ??
        false
      );
    });
  });

  // Pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedDatas = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  return (
    <div className="container p-2 mx-auto bg-white shadow-md rounded p-4">
      <nav className="flex align-left gap-5 w-full">
        <h2 className="mb-3 text-gray-600 text-2xl font-semibold leading-tight">
          {title}
        </h2>
        {/* FILTRES */}
        <div className="flex justify-between w-full">
          <div className="flex gap-4 mb-4">
            {/* Champ de recherche */}
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 flex-1"
            />
          </div>
          {canAdd && (
            <Button
              className="m-2 p-2 inline-flex items-center rounded-md bg-terracotta text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:brightness-110"
              onClick={onAdd}
            >
              <IoMdAddCircleOutline size={24} />
            </Button>
          )}
        </div>
      </nav>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="rounded-t-lg dark:bg-gray-300">
            <tr className="bg-gray-50">
              {columns.map((col, colIndex) => (
                <th
                  className="py-2 px-4 border text-left text-sm font-medium text-gray-600"
                  key={colIndex}
                >
                  {col.title}
                </th>
              ))}
              <th className="py-2 px-4 border text-left text-sm font-medium text-gray-600 border">
                Modifier
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedDatas.map((row: any, rowIndex) => (
              <tr key={rowIndex} className="text-right">
                {columns.map((col, cIndex) => {
                  const value = col.subProperty
                    ? row[col.propertyName]?.[col.subProperty]
                    : row[col.propertyName];

                  return (
                    <td className="py-2 px-4 border text-gray-600" key={cIndex}>
                      {col.type === ColumnType.DEFAULT ? (
                        <span>{value ?? "???"}</span>
                      ) : col.type === ColumnType.IMAGE ? (
                        <img
                          src={value ?? ""}
                          alt={col.title}
                          style={{ maxWidth: "3rem", maxHeight: "3rem" }}
                        />
                      ) : null}
                    </td>
                  );
                })}
                {/* Boutons d'édition/action */}
                <td className="py-2 px-4 border space-x-2">
                  {editBtnLists.map((editBtn, btnIndex) => (
                    <Button
                      key={btnIndex}
                      className="m-2 p-2 inline-flex items-center rounded-md bg-terracotta text-sm/6 font-semibold text-white focus:outline-none hover:brightness-110"
                      onClick={() => editBtn.actionCall(row)}
                    >
                      {editBtn.icon}
                    </Button>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={columns.length + 1}>
                <div className="flex items-center justify-end space-x-2 p-4">
                  <button
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50"
                  >
                    <FaChevronCircleLeft size={24} />
                  </button>
                  <span>
                    Page {currentPage} / {totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="px-3 py-1 text-gray-700 rounded disabled:opacity-50"
                  >
                    <FaChevronCircleRight size={24} />
                  </button>
                </div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
