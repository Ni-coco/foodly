import { useEffect, useState, Fragment } from "react";
import axios from "axios";
import {
  Dialog,
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  XMarkIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import ProductCard from "../components/ProductCard";
import { Product, SearchChangeEvent } from "../types/interface";
import { filters, sortBy } from "../types/filters";
import DrawerComponent from "../components/DrawerComponent";
import SliderComponent from "../components/SliderComponent";
import LoadingComponent from "../components/LoadingComponent";

export default function ProductsView() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [activeFilters, setActiveFilters] = useState<{
    [key: string]: string[];
  }>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSort, setSelectedSort] = useState(sortBy[0].value);

  const [isOpen, setIsOpen] = useState(false);
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get<any>(
          `${import.meta.env.VITE_API_URL}/products`,
          {
            params: {
              page: currentPage,
              sortBy: selectedSort, 
            },
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        setProducts(response.data.products);
        setCount(response.data.count);
      setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, selectedSort]);

  const handleFilterToggle = (
    sectionName: string,
    optionValue: string
  ): void => {
    setActiveFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      if (newFilters[sectionName]?.includes(optionValue)) {
        newFilters[sectionName] = newFilters[sectionName].filter(
          (filter) => filter !== optionValue
        );
      } else {
        newFilters[sectionName] = [
          ...(newFilters[sectionName] || []),
          optionValue,
        ];
      }
      return newFilters;
    });
  };

  const handleSliderChange =
    (sectionName: string) => (event: Event, value: number | number[]) => {
      const section = filters.find((filter) => filter.id === sectionName);
      if (section) {
        const option = section.options.find((opt) => opt.markValue === value);
        if (option) {
          setActiveFilters((prevFilters) => ({
            ...prevFilters,
            [sectionName]: [option.value], // Remplace la valeur existante par la nouvelle
          }));
        }
      }
    };

  const updateProducts = async () => {
    setLoading(true);

    const filterParams = Object.entries(activeFilters)
      .map(([key, values]) => {
        return values.map((value) => `${key}=${value.split("=")[1]}`).join("&");
      })
      .join("&");

    const searchParams = searchTerm ? `search_terms=${searchTerm}&` : "";

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/products`,
        {
          params: {
            filters: `${searchParams}${filterParams}`,
            page: currentPage,
            sortBy: selectedSort,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setProducts(response.data.products);
      setCount(response.data.count);
      setIsOpen(false);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const handleSearchChange = (e: SearchChangeEvent): void => {
    setSearchTerm(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const filterForm = (
    <form className="text-sm">
      <div className="mb-4">
        {/* <div className="absolute inset-y-0 end-0 flex items-center ps-3 pointer-events-none mr-4">
          <svg
            className="w-4 h-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 18 20"
          >
            <path
              stroke="#272646"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div> */}
        <input
          type="text"
          id="simple-search"
          className="bg-white text text-black text-sm focus:ring-teal focus:border-teal w-full ps-10 p-2.5"
          placeholder="Chercher par mot-clés"
          style={{
            borderRadius: "10px",
            border: "#272646 2px solid",
          }}
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>
      {filters.map((section) => (
        <div key={section.id} className="mb-4 flex flex-col gap-2">
          <h3 className="text-md font-medium text-center text-gray-900">
            {section.name}
          </h3>
          <div className="mt-2 space-y-2">
            {section.slider ? (
              <SliderComponent
                marks={section.options.map((option) => ({
                  value: option.markValue!,
                  label: option.label,
                }))}
                defaultValue={0}
                onChange={handleSliderChange(section.id)}
              />
            ) : (
              section.options.map((option) => (
                <div key={option.value} className="flex items-center">
                  <input
                    id={`${section.id}-${option.value}`}
                    name={`${section.id}[]`}
                    type="checkbox"
                    checked={
                      activeFilters[section.id]?.includes(option.value) || false
                    }
                    onChange={() =>
                      handleFilterToggle(section.id, option.value)
                    }
                    className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <label
                    htmlFor={`${section.id}-${option.value}`}
                    className="ml-3 text-sm text-gray-700"
                  >
                    {option.label}
                  </label>
                </div>
              ))
            )}
          </div>
        </div>
      ))}
      <button
        type="button"
        className="mt-4 bg-teal text-white py-2 px-4 rounded w-fit m-auto"
        onClick={updateProducts}
      >
        Appliquer
      </button>
    </form>
  );

  return (
    <>
      {(loading && <LoadingComponent />) || (
        <div>
          {/* Mobile filter dialog */}
          <Transition.Root show={mobileFiltersOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40 lg:hidden"
              onClose={setMobileFiltersOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="transition-opacity ease-linear duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity ease-linear duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black bg-opacity-25" />
              </Transition.Child>

              <div className="fixed inset-0 z-40 flex">
                <Transition.Child
                  as={Fragment}
                  enter="transition ease-in-out duration-300 transform"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transition ease-in-out duration-300 transform"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                    <div className="flex items-center justify-between px-4">
                      <h2 className="text-lg font-medium text-gray-900 title">
                        Filters
                      </h2>
                      <button
                        type="button"
                        className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-teal"
                        onClick={() => setMobileFiltersOpen(false)}
                      >
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </button>
                    </div>
                    {filterForm}
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition.Root>

          <main className="mx-auto px-4 sm:px-6 lg:px-8">
            <section aria-labelledby="products-heading" className="pt-6">
              <h2 id="products-heading" className="sr-only">
                Products
              </h2>

              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                {/* Product grid */}
                <div className="lg:col-span-4 pb-6">
                  <div className="flex items-center max-w-sm mx-auto fixed z-10 right-10 gap-2">
                    <div>
                      <Popover>
                        {({ open }) => (
                          <>
                            <PopoverButton className="flex items-center px-2 h-8 rounded gap-2 transition-all duration-200 text-sm font-medium text-white bg-teal hover:bg-white hover:text-teal">
                              <FunnelIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </PopoverButton>
                            <PopoverPanel
                              anchor="bottom"
                              className="flex flex-col gap-2 p-4 shadow-md [--anchor-gap:8px] z-10 bg-white rounded-md"
                            >
                              {sortBy.map((sortOption) => (
                                <button
                                  key={sortOption.value}
                                  className={`p-2 rounded transition-all duration-200 text-sm font-medium ${
                                    selectedSort === sortOption.value
                                      ? "text-teal border-teal border-2"
                                      : "text-teal bg-white"
                                  } hover:text-white hover:bg-teal`}
                                  onClick={() =>
                                    setSelectedSort(sortOption.value)
                                  }
                                >
                                  {sortOption.label}
                                </button>
                              ))}
                            </PopoverPanel>
                          </>
                        )}
                      </Popover>
                    </div>
                    <div>
                      <button type="button" onClick={() => setIsOpen(true)}>
                        <span className="flex items-center gap-2 justify-center px-3 h-8 rounded-md transition-all duration-200 text-sm font-medium text-white bg-teal hover:bg-white hover:text-teal">
                          <AdjustmentsHorizontalIcon
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                          Filtres
                        </span>
                      </button>
                    </div>
                  </div>
                  {
                    <div>
                      <div className="lg:col-span-4 pb-6 mt-16">
                        <div className="explorer">
                          {products.map((product, index) => (
                            <ProductCard key={index} product={product} />
                          ))}
                        </div>
                        <div className="flex text flex-col items-center mt-10 text-black">
                            <span className="text-sm">
                            Affichage de {(currentPage - 1) * 50 + 1} à{" "}
                            {Math.min(currentPage * 50, count)} sur {count} entrées
                            </span>
                          <div className="inline-flex mt-2 gap-4">
                            <button
                              className="flex items-center justify-center px-3 h-8 rounded-md transition-all duration-200 text-sm font-medium text-white bg-teal hover:bg-white hover:text-teal"
                              onClick={() => setCurrentPage(currentPage - 1)}
                              disabled={currentPage === 1}
                            >
                              Précédent
                            </button>
                            <button
                              className="flex items-center justify-center px-3 h-8 rounded-md transition-all duration-200 text-sm font-medium text-white bg-teal hover:bg-white hover:text-teal"
                              onClick={() => setCurrentPage(currentPage + 1)}
                              disabled={currentPage * 50 >= count / 50}
                            >
                              Suivant
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </section>
          </main>
          {/* Mobile Filter Drawer */}
          <DrawerComponent
            isOpen={isOpen}
            onClose={toggleDrawer}
            title="Filtres"
          >
            {filterForm}
          </DrawerComponent>
        </div>
      )}
    </>
  );
}
