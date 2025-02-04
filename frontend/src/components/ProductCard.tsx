import React, { useState } from "react";
import { ShoppingBagIcon, EyeIcon } from "@heroicons/react/24/outline";
import ProductModal from "./ProductModal";
import { Product } from "../types/interface";
import Atropos from "atropos/react";
import noImage from "../assets/noimage.png";
import { capitalizeFirstLetter, removeAfterFirstComma } from "../services/TextUtils";
import "atropos/css";
import { ApiCall } from "../services/ApiCall";
import ToastService from "../services/ToastService";

export default function ProductCard({ product }: { product: Product }) {
  const imgPreview = product.img.front != null ? product.img.front : noImage;
  const [open, setOpen] = useState(false);

  const handleAddProduct = (e: React.MouseEvent, product: Product,quantity:number,price:number|null =null) => {
    e.preventDefault();
    e.stopPropagation();
    if(quantity && quantity > 0){
      if(price && price > 0){
        ApiCall.Put(`${import.meta.env.VITE_API_URL}/stocks/`+product.id+'/refill',
          {
            quantity : quantity,
            product_id : product.id,
            price:price
          }
        ).then((response:any) => {
          ToastService.success(response.message);
          setOpen(false);

        })
        .catch(error => ToastService.error(error))
      }else{
        ApiCall.Put(`${import.meta.env.VITE_API_URL}/stocks/`+product.id+'/refill',
          {
            quantity : quantity,
            product_id : product.id
          }
        ).then((response:any) => {
          ToastService.success(response.message)
          setOpen(false);
        })
        .catch(error => ToastService.error(error))
      }
     
    }
    
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  return (
    <>
      <Atropos shadow={false} rotateXInvert={true} rotateYInvert={true}>
        <div
          style={{
            backgroundColor: "white",
            width: "250px",
            height: "fit-content",
            cursor: "pointer",
            backfaceVisibility: "hidden",
          }}
          className={`ground relative rounded-lg w-[250px] md:w-[150px] border-2 border-white hover:border-2 hover:border-teal transition duration-150`}
        >
          <div
            className="aspect-h-1 aspect-w-1 w-full flex justify-center overflow-hidden rounded-lg lg:aspect-none lg:h-80 p-0.5"
            style={{
              borderBottomLeftRadius: "0px",
              borderBottomRightRadius: "0px",
            }}
          >
            {imgPreview ? (
              <img
                src={imgPreview}
                className="h-full object-contain rounded-md"
                alt="Product Preview"
              />
            ) : (
              <img
                src={noImage}
                className="h-full object-contain rounded-md"
                alt="No Image Available"
              />
            )}
          </div>
            {product?.brands && (
            <label
              style={{ padding: "1px 5px 1px 5px" }}
              className="text-sm m-auto mt-2 font-medium w-fit flex justify-center bg-black text-white text rounded-lg tt"
            >
              {removeAfterFirstComma(product?.brands) || "No brand"}
            </label>
            )}
          <div
            className="mt-4 flex justify-between"
            style={{ padding: "0px 20px 10px 20px" }}
          >
            <div style={{ backfaceVisibility: "hidden" }}>
              <h3 className="text-base title text-teal">
                  {product?.generic_name || product?.quantity && (
                  <a href="#">
                    <span aria-hidden="true" className="absolute inset-0"></span>
                    {capitalizeFirstLetter(product?.generic_name)} {product?.quantity}
                  </a>
                  )}
              </h3>
              {product?.origins && (
                <label className="mt-1 text-sm text-gray-500 text">
                  Origine : {removeAfterFirstComma(product?.origins) || "Unknown origin"}
                </label>
              )}
            </div>
            {/* <label className="text-base font-medium text-gray-900 text">
              ${price}
            </label> */}
          </div>
        </div>
        <div
          className={`absolute top-2 right-2 rounded-full transition duration-100 hover:bg-[#1a1a1a] hover:text-white bg-white text-[#1a1a1a]`}
        >
          <ShoppingBagIcon
            className={`size-8 p-1.5`}
            onClick={(e) => handleViewProduct(e)}
            style={{ backfaceVisibility: "hidden" }}
          />
        </div>
        <EyeIcon
          className={`size-8 absolute top-2 left-2 rounded-full p-1.5 transition duration-100 hover:bg-[#1a1a1a] hover:text-white bg-white text-[#1a1a1a]`}
          onClick={(e) => handleViewProduct(e)}
          style={{ backfaceVisibility: "hidden" }}
        />
      </Atropos>
      <ProductModal
        product={product}
        open={open}
        setOpen={setOpen}
        handleAddProduct={handleAddProduct}
      />
    </>
  );
}
