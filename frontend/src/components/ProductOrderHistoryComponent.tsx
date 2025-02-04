import axios from "axios";
import { useEffect, useState } from "react";
import { Product } from "../types/interface";

type ProductOrderHistoryProps = {
  productId: number;
  quantity: number;
};

export default function ProductOrderHistoryComponent({
  productId,
  quantity,
}: ProductOrderHistoryProps) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/products/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const rawData = response.data;
        setProduct(rawData);
      } catch (err: any) {
        console.error(
          err.response?.data?.error || "Impossible de récupérer le produit."
        );
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div className="border rounded p-3 flex gap-4 items-center mb-2">
      {/* Image ou fallback */}
      {product.img ? (
        <img
          src={product.img.front}
          alt={product.generic_name}
          className="w-auto h-32 object-cover rounded-md border border-gray-200"
        />
      ) : (
        <div className="w-16 h-16 flex items-center justify-center border border-gray-200 bg-gray-50 text-gray-400">
          No image
        </div>
      )}

      {/* Détails produit */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-bold mb-1">{product.generic_name}</h3>
        <div className="text-sm text-gray-700 space-y-1">
          {product.brands && (
            <p>
              <strong>Marque :</strong> {product.brands}
            </p>
          )}
          {product.origins && (
            <p>
              <strong>Origine :</strong> {product.origins}
            </p>
          )}
          {product.quantity && (
            <p>
              <strong>Quantité (pack) :</strong> {product.quantity}
            </p>
          )}
        </div>
      </div>

      <div className="font-semibold text-sm text-gray-700">
        Commandé : <span className="text-base">{quantity}x</span>
      </div>
    </div>
  );
}
