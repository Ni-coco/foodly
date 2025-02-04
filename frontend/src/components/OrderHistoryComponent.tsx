import { useState, useEffect } from "react";
import axios from "axios";
import { Order, Invoice } from "../types/interface";
import { generateInvoicePDF } from "../types/pdfGenerator";

import ProductOrderHistoryComponent from "./ProductOrderHistoryComponent";
// Types
type OrderHistoryProps = {
  userId: number;
};

export default function OrderHistoryComponent({ userId }: OrderHistoryProps) {
  // Stocke la liste des commandes
  const [orders, setOrders] = useState<Order[]>([]);
  // Stocke la liste des ID de commandes "déroulées"
  const [expandedOrderIds, setExpandedOrderIds] = useState<number[]>([]);

  // État pour le tri
  const [sortOption, setSortOption] = useState<string>("dateDesc");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/${userId}/orders`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data as Order[];
        setOrders(data);
      } catch (err: any) {
        console.error(
          err.response?.data?.error || "Impossible de récupérer les commandes."
        );
      }
    };
    fetchOrders();
  }, [userId]);

  const exportOrderToPDF = (order: Order) => {
    if (order.id === undefined) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/orders/${order.id}/invoice`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((response) => {
        generateInvoicePDF(order, response.data.invoice);
      })
      .catch((error) => {
        console.error(
          "Impossible de récupérer la facture de la commande.",
          error
        );
      });
  };

  // Fonction de formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Ouvrir/fermer le panel d'une commande
  const toggleExpand = (orderId: number) => {
    if (expandedOrderIds.includes(orderId)) {
      // Retire l'ID du tableau -> replie le panel
      setExpandedOrderIds((prev) => prev.filter((id) => id !== orderId));
    } else {
      // Ajoute l'ID -> déplie le panel
      setExpandedOrderIds((prev) => [...prev, orderId]);
    }
  };

  // 1) On copie la liste des commandes
  const sortedOrders = [...orders];

  // 2) On trie en fonction de l’option sélectionnée
  switch (sortOption) {
    case "dateAsc":
      sortedOrders.sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      break;
    case "dateDesc":
      sortedOrders.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      break;
    case "amountAsc":
      sortedOrders.sort((a, b) => a.total_amount - b.total_amount);
      break;
    case "amountDesc":
      sortedOrders.sort((a, b) => b.total_amount - a.total_amount);
      break;
    default:
      // Pas de tri particulier
      break;
  }

  return (
    <div className="bg-gray-100 p-4 rounded shadow-md">
      {/* Sélecteur de tri */}
      <div className="mb-4">
        <label className="mr-2 font-semibold text-gray-700">
          Trier les commandes :
        </label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="dateDesc">Date (plus récentes en premier)</option>
          <option value="dateAsc">Date (plus anciennes en premier)</option>
          <option value="amountDesc">Montant (du + cher au - cher)</option>
          <option value="amountAsc">Montant (du - cher au + cher)</option>
        </select>
      </div>

      {/* Affichage des commandes */}
      {sortedOrders.length === 0 ? (
        <div>Aucune commande.</div>
      ) : (
        <ul className="space-y-4">
          {sortedOrders.map((order) => {
            // Nombre d'articles
            const itemCount = order.order_items?.length || 0;
            // Est-ce que ce panel est ouvert ?
            const isExpanded = expandedOrderIds.includes(order.id);

            return (
              <li
                key={order.id}
                className="border border-gray-300 bg-white rounded-md"
              >
                {/* Entête du panel - infos principales */}
                <div
                  className="flex justify-between items-center p-3 cursor-pointer hover:bg-gray-50"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div>
                    <div className="font-semibold text-lg">
                      Commande #{order.id} – {itemCount} article
                      {itemCount > 1 && "s"}
                    </div>
                    <div className="text-sm text-gray-500">
                      Montant total : {order.total_amount} € |{" "}
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    {order.status.toUpperCase()}
                  </div>
                  <button
                    onClick={() => exportOrderToPDF(order)}
                    className="text-blue-500 hover:underline"
                  >
                    Exporter en PDF
                  </button>
                </div>

                {/* Détail du panel : liste des produits */}
                {isExpanded && (
                  <div className="px-4 pb-4">
                    {itemCount === 0 ? (
                      <p className="text-sm text-gray-600">
                        Aucun produit dans cette commande.
                      </p>
                    ) : (
                      // <-- Nouveau conteneur "scrollable"
                      <div className="max-h-64 overflow-y-auto">
                        <ul className="mt-2 space-y-1">
                          {order.order_items.map((item) => (
                            <li key={item.id}>
                              <ProductOrderHistoryComponent
                                productId={item.product_id}
                                quantity={item.quantity}
                              />
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
