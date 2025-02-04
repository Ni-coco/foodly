import { Fragment, useEffect, useState } from "react";
import { Button, Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { ProductModalProps } from "../types/interface";
import { Swiper, SwiperSlide } from "swiper/react";

import 'swiper/css';
// @ts-ignore
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import { Zoom, Keyboard, Pagination, Navigation } from 'swiper/modules';

import nutriscoreA from "../assets/nutriscore-a-new-fr.svg";
import nutriscoreB from "../assets/nutriscore-b-new-fr.svg";
import nutriscoreC from "../assets/nutriscore-c-new-fr.svg";
import nutriscoreD from "../assets/nutriscore-d-new-fr.svg";
import nutriscoreE from "../assets/nutriscore-e-new-fr.svg";
import { FaShoppingCart } from "react-icons/fa";
import { ApiCall } from "../services/ApiCall";
import ToastService from "../services/ToastService";

export default function ProductModal({
  product,
  open,
  setOpen,
  handleAddProduct,
}: ProductModalProps) {
  const [refillInput,setRefillInput] = useState<number>(0)
  const [stockPriceInput,setStockPriceInput] = useState<number|null>(null)
  const [stock,setStock] = useState<any|null>(null)
  const listImg: string[] = [];
  if (product?.img) {
    if (product.img.front != null) listImg.push(product.img.front);
    if (product.img.ingredients != null) listImg.push(product.img.ingredients);
    if (product.img.nutrition != null) listImg.push(product.img.nutrition);
  }

  useEffect(()=>{
    loadStock();
  },[open])

  const handleStockProduct = (e: React.MouseEvent, product: any,quantity : number,price:number|null)=>{
    handleAddProduct(e, product,refillInput,stockPriceInput);
  }

  const loadStock = ()=>{
    ApiCall.Get(`${import.meta.env.VITE_API_URL}/stocks/`+product.id)
    .then((response:any) => response.data)
    .then((data:any)=>{
      console.log(data.message)
      setStock(data.stock)
    })
    .catch(error=>ToastService.error(error))
  }

  // Fonction pour afficher l'image Nutriscore
  const displayNutriscore = (value: string) => {
    switch (value) {
      case "a":
        return nutriscoreA;
      case "b":
        return nutriscoreB;
      case "c":
        return nutriscoreC;
      case "d":
        return nutriscoreD;
      case "e":
        return nutriscoreE;
      default:
        return "";
    }
  };

  const validBrand = (brands: string | null) => {
    if (!brands) return "";
    let listBrands: any[] = [];
    listBrands = brands.split(",");
    return listBrands[0];
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 hidden bg-gray-500 bg-opacity-75 transition-opacity md:block" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
              enterTo="opacity-100 translate-y-0 md:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 md:scale-100"
              leaveTo="opacity-0 translate-y-4 md:translate-y-0 md:scale-95"
            >
              <Dialog.Panel className="flex rounded w-[60%] transform text-left text-base transition md:my-8 md:px-4">
                <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pb-8 pt-14 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8 rounded-md">
                  <button
                    type="button"
                    className="absolute right-4 top-4 rounded text-teal hover:text-white hover:bg-teal sm:right-6 sm:top-8 md:right-6 md:top-6 lg:right-8 lg:top-8"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon
                      className="h-6 w-6 text-black"
                      aria-hidden="true"
                    />
                  </button>

                  <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8 h-full">
                    {/* Carrousel */}
                    <div className="aspect-w-2 aspect-h-2 overflow-hidden rounded-lg bg-white sm:col-span-4 lg:col-span-5 h-full">
                      <Swiper
                        slidesPerView={1}
                        spaceBetween={30}
                        zoom={true}
                        loop
                        keyboard={{
                          enabled: true,
                        }}
                        pagination={{
                          clickable: true,
                        }}
                        navigation={true}
                        modules={[Zoom, Keyboard, Pagination, Navigation]}
                        className="mySwiper h-full flex justify-center align-middle"
                      >
                        {listImg.map((img, index) => (
                          <SwiperSlide key={index} className="flex items-center justify-center">
                            <div className="swiper-zoom-container flex flex-col justify-center align-middle items-center h-full">
                              <p className="text-black object-contain max-w-[200px] text-xs mb-1">Double-cliquez pour zoomer</p>
                              <img
                                src={img}
                                className="object-contain max-w-[200px] h-auto "
                                alt={`Product image ${index + 1}`}
                                loading="lazy"
                              />
                            </div>
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    </div>


                    {/* Informations sur le produit */}
                    <div className="sm:col-span-8 lg:col-span-7 flex flex-col gap-2 text-black">
                      <div>
                        <h2 className="text-2xl font-bold text-teal sm:pr-12 title">
                          {product.generic_name === "Unknown" ? validBrand(product.brands) : product.generic_name}
                        </h2>
                      </div>
                      <div className=" flex flex-row">
                        <div className="flex flex-col justify-between">
                          <div>
                            <section aria-labelledby="information-heading" className="mt-2">
                              <label className="text-2xl text-gray-700 text">{validBrand(product.brands)}</label>
                            </section>

                            <section>
                              <label className="text text-base">{product.quantity}</label>
                            </section>
                          </div>
                          <div>
                            <section className="w-full">
                              <label className="text text-base">
                                {product.nutriscore?.nutriscore?.grade && (
                                  <img
                                    src={displayNutriscore(product.nutriscore.nutriscore.grade)}
                                    alt={"Nutriscore = " + product.nutriscore.nutriscore.grade}
                                    className="max-w-[100px]"
                                  />
                                )}
                              </label>
                            </section>
                          </div>
                        </div>
                        <div className="h-full w-full">
                          <section>
                            <div
                              className="border border-gray-300 shadow-sm rounded-lg overflow-hidden max-w-sm mx-auto mt-2 ml-5">
                              <table className="w-full text-sm leading-5">
                                <thead className="bg-gray-100">
                                  <tr>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Nutriment</th>
                                    <th className="py-3 px-4 text-left font-medium text-gray-600">Par (100g)
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="py-3 px-4 text-left font-medium text-gray-600">Calories</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments["energy-kcal_100g"]} kcal</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 px-4 text-left font-medium text-gray-600">Matières grasses</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments.fat_100g} g</td>
                                  </tr>
                                  <tr className="bg-gray-50">
                                    <td className="py-3 px-4 text-left font-medium text-gray-600 pl-8">Gras saturé</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments["saturated-fat_100g"]} g</td>
                                  </tr>

                                  <tr>
                                    <td className="py-3 px-4 text-left font-medium text-gray-600">Glucides</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments.carbohydrates_100g} g</td>
                                  </tr>
                                  <tr className="bg-gray-50">
                                    <td className="py-3 px-4 text-left font-medium text-gray-600 pl-8">Sucres</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments.sugars_100g} g</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 px-4 text-left font-medium text-gray-600">Protéines</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments.proteins_100g} g</td>
                                  </tr>
                                  <tr>
                                    <td className="py-3 px-4 text-left font-medium text-gray-600">Sel</td>
                                    <td className="py-3 px-4 text-left">{product.nutriments.salt_100g} g</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </section>
                        </div>
                      </div>

                      <section aria-labelledby="options-heading">
                        <h3 id="options-heading" className="sr-only">Product Stock</h3>
                        <div className="flex items-center flex-row justify-center m-2">
                          {stock == null &&
                            <input
                            type="number"
                            value={ stockPriceInput || ''}
                            placeholder="Prix"
                            onChange={(e) =>
                              setStockPriceInput(e.target.value)
                            }
                            className="mt-1 block border border-gray-300 rounded px-2 py-1 px-3 m-1"
                          />
                          }
                          {
                            stock && 
                            <span className="p-2">En Stock : {stock.quantity}</span>
                          }
                          <input
                            type="number"
                            value={ refillInput || ''}
                            placeholder="Quantité"
                            onChange={(e) =>
                              setRefillInput(e.target.value)
                            }
                            className="mt-1 block border border-gray-300 rounded px-2 py-1 px-3 m-1"
                          />
                          <Button
                            type="submit"
                            className="text p-1 flex items-center justify-center rounded-md border-2 hover:border-teal border-transparent bg-teal text-white hover:bg-white hover:text-teal px-3  text-center "
                            onClick={(e) => handleStockProduct(e, product,refillInput,stockPriceInput)}
                          >
                            <FaShoppingCart />
                            {stock ? 
                              <span className="p-1">Remplir le Stock </span>: <span className='p-1'>Ajouter au Stock</span>}

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
                    </div>

                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div >
      </Dialog >
    </Transition.Root >
  );
}
