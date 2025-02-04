import { useEffect, useState } from "react";
import { ApiCall } from "../services/ApiCall";
import { StockViewModel } from "./viewmodel/StockViewModel";
import TableComponent from "../components/TableComponent";
import { ColumnViewModel } from "../components/viewmodel/ColumnViewModel";
import { ColumnType } from "../components/viewmodel/ColumnType";
import "../style/StockManagmentView.css";
import LoadingComponent from "../components/LoadingComponent";
import { FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";
import DrawerComponent from "../components/DrawerComponent";
import { Button, Description, Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import ToastService from "../services/ToastService";

export const StockManagmentView = () => {
  const [stocks, setStocks] = useState<StockViewModel[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<any | null>();
  const [stockPriceInput,setStockPriceInput] = useState<number>(0);

  useEffect(() => {
    setIsLoading(true);
    ApiCall.Get<StockViewModel[]>(`${import.meta.env.VITE_API_URL}/stocks`)
      .then((response) => {
        if (response) {
          return response.data;
        } else {
          throw new Error("Response is undefined");
        }
      })
      .then((stocks) => {
        setStocks(stocks ?? []);
        setIsLoading(false);
      });
  }, []);

  const UpdateStock = (e: React.MouseEvent, product: any, quantity: number,price:number) => {
    if (quantity && quantity > 0) {
      ApiCall.Put(`${import.meta.env.VITE_API_URL}/stocks/` + product.id,
        {
          quantity: quantity,
          productId: product.id,
          price: price
        }
      )
        .then((response:any) => {
          var stockIndex = stocks.findIndex(e => e.productId == product.id);
          if (stockIndex) {
            stocks[stockIndex] = response;
            ToastService.success('Stock Modifié')
            setIsOpen(false);
          }
        })
        .catch(error =>
          ToastService.error(error))
    }
  };
  const [refillInput, setRefillInput] = useState<number>(0)

  const DeleteStock = () => {
    ApiCall.Delete(`${import.meta.env.VITE_API_URL}/stocks/` + selectedElement.productId)
    .then(response=>{
      const updatedListStocks = stocks.filter((stock) => stock.productId !== selectedElement.productId);
      setStocks(updatedListStocks);
      ToastService.success("Stock Supprimé")
    })
    .catch(error=>ToastService.error(error))
  };

  return (
    <>
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          <div className="relative min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 pt-6">
              <TableComponent
                title={"Stocks"}
                data={stocks}
                columns={[
                  new ColumnViewModel("id", "Id", ColumnType.DEFAULT),
                  new ColumnViewModel(
                    "productId",
                    "Id du produit",
                    ColumnType.DEFAULT
                  ),
                  new ColumnViewModel('price',"Prix",ColumnType.DEFAULT),
                  new ColumnViewModel(
                    "product",
                    "Marque",
                    ColumnType.DEFAULT,
                    "brands"
                  ),
                  new ColumnViewModel(
                    "product",
                    "Nom",
                    ColumnType.DEFAULT,
                    "generic_name"
                  ),
                  new ColumnViewModel(
                    "quantity",
                    "Quantité",
                    ColumnType.DEFAULT
                  ),
                ]}
                editBtnLists={[
                  {
                    label: "Voir",
                    actionCall: (obj: any) => {
                      setSelectedElement(obj);
                      setIsOpen(true);
                      setRefillInput(obj.quantity)
                      setStockPriceInput(obj.price)
                    },
                    icon: <FaEdit />,
                  },
                  {
                    label: "Supprimer",
                    actionCall: (obj: any) => {
                      setSelectedElement(obj);
                      setIsOpenModal(true)
                    },
                    icon: <FaTrash />,
                  },
                ]}
                onAdd={() => { }}
                canAdd={false}
              />
            </div>
          </div>
          <DrawerComponent
            isOpen={isOpen}
            title={
              selectedElement ? "Stock N°" + selectedElement.productId : ""
            }
            onClose={() => {
              setIsOpen(false);
            }}
          >
            <>
              <div className="flex flex-row justify-around">
                <div className="grow border rounded p-2m-2">
                  {selectedElement?.product?.img.front != null ? (
                    <img
                      src={selectedElement?.product?.img.front}
                      alt={selectedElement?.generic_name}
                    />
                  ) : (
                    <div className="flex border border-teal items-center justify-center w-full h-48 bg-ice rounded-sm sm:w-90 dark:bg-ice">
                      <svg
                        className="w-10 h-10 text-teal dark:text-teal"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 18"
                      >
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="grow flex flex-col m-2">
                  <span className="fs-2">
                    {selectedElement?.product?.generic_name ?? "???"}
                  </span>
                  <span>{selectedElement?.product?.brands ?? "???"}</span>
                  <span>{selectedElement?.product?.quantity ?? "???"}</span>
                  <span>{selectedElement?.product?.origins ?? "???"}</span>
                </div>
              </div>
              <section aria-labelledby="options-heading">
                <h3 id="options-heading" className="sr-only">Product Stock</h3>
                <div className="flex items-center flex-row justify-center m-2">
                <input
                    type="number"
                    value={ stockPriceInput || ''}
                    placeholder="Prix"
                    onChange={(e) =>
                      setStockPriceInput(e.target.value)
                    }
                    className="mt-1 block border border-gray-300 rounded px-2 py-1 px-3 m-1"
                  />
                  <span className="p-2">€</span>
                  <input
                    type="number"
                    value={refillInput || 0}
                    onChange={(e) =>
                      setRefillInput(e.target.value)
                    }
                    className="mt-1 block border border-gray-300 rounded px-2 py-1 px-3 m-1"
                  />
                  <span className="p-2">en stock</span>
                  
                </div>
                <div className="flex items-center flex-row justify-center m-2">
                <Button
                    type="submit"
                    className="text p-1 flex items-center justify-center rounded-md border-2 hover:border-teal border-transparent bg-teal text-white hover:bg-white hover:text-teal px-3  text-center "
                    onClick={(e) => UpdateStock(e, selectedElement?.product, refillInput,stockPriceInput)}
                  >
                    <FaShoppingCart />
                    <span className="p-1"> Sauvegarder </span>

                  </Button>
                </div>
                
                {/* <Button
                          type="submit"
                          className="text mt-6 flex w-full items-center justify-center rounded-md border-2 hover:border-teal border-transparent bg-teal text-white hover:bg-white hover:text-teal px-8 py-3 text-base font-medium"
                          onClick={(e) => handleAddProduct(e, product)}
                        >
                          <FaShoppingCart />
                          <span className="p-1">Buy The Stock </span>

                        </Button> */}
              </section>
            </>
          </DrawerComponent>
          <Dialog
          transition
          className="fixed inset-0 flex w-screen items-center justify-center bg-black/30 p-4 transition duration-100 ease-out data-[closed]:opacity-0"
           open={isOpenModal} onClose={() => setIsOpenModal(false)} >
            <DialogBackdrop className="fixed inset-0 bg-black/40" />
            <div className="fixed inset-0 flex items-center justify-center rounded">
              <DialogPanel className="max-w-lg space-y-4 bg-white rounded">
                <DialogTitle className="bg-[#006d77] text-white font-bold p-2 ">Supprimer le stock</DialogTitle>
                <Description className="p-4">Êtes vous sur de vouloir supprimer ce Stock ?</Description>
                <div className="flex gap-4">
                  <Button onClick={() => setIsOpenModal(false)}  className="m-2 p-2 inline-flex items-center rounded-md bg-terracotta text-sm/6 font-semibold text-white focus:outline-none hover:brightness-110">Annuler</Button>
                  <Button onClick={() =>{DeleteStock() ;setIsOpenModal(false)}}  className="m-2 p-2 inline-flex items-center rounded-md bg-red-500 text-sm/6 font-semibold text-white focus:outline-none hover:brightness-110">Supprimer</Button>
                </div>
              </DialogPanel>
            </div>
          </Dialog>
        </>
      )}
    </>
  );
};
