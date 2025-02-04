import { useEffect, useState } from "react";
import TableComponent from "../components/TableComponent";
import { ColumnType } from "../components/viewmodel/ColumnType";
import { ColumnViewModel } from "../components/viewmodel/ColumnViewModel";
import DrawerComponent from "../components/DrawerComponent";
import { ApiCall } from "../services/ApiCall";
import { FaEdit, FaShoppingCart, FaTrash } from "react-icons/fa";
import { Button } from "@headlessui/react";
import axios from "axios";
import { Invoice } from "../types/interface";
import LoadingComponent from "../components/LoadingComponent";

export default function InvoicesView() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedElement, setSelectedElement] = useState<Invoice | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/invoices`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      })
      .then((response) => {
        if (response) {
          return response.data.invoices;
        } else {
          throw new Error("Response is undefined");
        }
      })
      .then((invoices) => {
        setInvoices(invoices ?? []);
        setIsLoading(false);
      });
  }, []);

  const DeleteInvoice = (invoice: Invoice) => {
    const confirmDeletion = confirm(
      "Êtes-vous sûr de vouloir supprimer la facture " + invoice.id + " ?"
    );
    if (confirmDeletion) {
      ApiCall.Delete(`${import.meta.env.VITE_API_URL}/invoices/` + invoice.id)
        .then((response) => {
          if (response) {
            return response;
          } else {
            throw new Error("Response is undefined");
          }
        })
        .then(() => {
          setInvoices(invoices.filter((inv) => inv.id !== invoice.id));
        });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedElement) {
      setIsOpen(false);
      axios
        .put(
          `${import.meta.env.VITE_API_URL}/invoices/` + selectedElement.id,
          { ...selectedElement },
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        )
        .then((response) => {
          if (response) {
            return response.data;
          } else {
            throw new Error("Response is undefined");
          }
        })
        .then((invoice) => {
          setInvoices(
            invoices.map((inv) =>
              inv.id === invoice.invoice.id ? invoice.invoice : inv
            )
          );
        })
        .catch((error) => {
          console.error("Erreur lors de la mise à jour :", error);
        });
    }
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
            title={"Invoices"}
            data={invoices}
            columns={[
              new ColumnViewModel("id", "Id", ColumnType.DEFAULT),
              new ColumnViewModel(
                "order_id",
                "Id de commande",
                ColumnType.DEFAULT
              ),
              new ColumnViewModel(
                "billing_address",
                "Adresse de facturation",
                ColumnType.DEFAULT
              ),
              new ColumnViewModel(
                "payment_method",
                "Mode de paiement",
                ColumnType.DEFAULT
              ),
              new ColumnViewModel(
                "payment_status",
                "Statut de paiement",
                ColumnType.DEFAULT
              ),
              new ColumnViewModel("cp", "Code postal", ColumnType.DEFAULT),
            ]}
            editBtnLists={[
              {
                label: "Edit",
                actionCall: (obj: Invoice) => {
                  setSelectedElement(obj);
                  setIsOpen(true);
                },
                icon: <FaEdit />,
              },
              {
                label: "Delete",
                actionCall: (obj: Invoice) => {
                  DeleteInvoice(obj);
                },
                icon: <FaTrash />,
              },
            ]}
            onAdd={() => {}}
            canAdd={false}
          />
          </div>
          </div>

          {/* DrawerComponent */}
          <DrawerComponent
            isOpen={isOpen}
            title={
              selectedElement
                ? "Modifier la Facture N°" + selectedElement.order_id
                : "Facture"
            }
            onClose={() => {
              setIsOpen(false);
            }}
          >
              <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <div>
                  <label
                    htmlFor="order_id"
                    className="block text-sm font-semibold"
                  >
                    Id de commande
                  </label>
                  <input
                    type="text"
                    id="order_id"
                    disabled
                    className="w-full p-2 border rounded"
                    value={selectedElement?.order_id ?? ""}
                    onChange={(e) =>
                      setSelectedElement((prev) =>
                        prev
                          ? { ...prev, order_id: Number(e.target.value) }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="billing_address"
                    className="block text-sm font-semibold"
                  >
                    Adresse de facturation
                  </label>
                  <input
                    type="text"
                    id="billing_address"
                    className="w-full p-2 border rounded"
                    value={selectedElement?.billing_address ?? ""}
                    onChange={(e) =>
                      setSelectedElement((prev) =>
                        prev
                          ? { ...prev, billing_address: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment_method"
                    className="block text-sm font-semibold"
                  >
                    Mode de paiement
                  </label>
                  <input
                    type="text"
                    id="payment_method"
                    disabled
                    className="w-full p-2 border rounded"
                    value={selectedElement?.payment_method ?? ""}
                    onChange={(e) =>
                      setSelectedElement((prev) =>
                        prev
                          ? { ...prev, payment_method: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label
                    htmlFor="payment_status"
                    className="block text-sm font-semibold"
                  >
                    Statut du paiement
                  </label>
                  <input
                    type="text"
                    id="payment_status"
                    disabled
                    className="w-full p-2 border rounded"
                    value={selectedElement?.payment_status ?? ""}
                    onChange={(e) =>
                      setSelectedElement((prev) =>
                        prev
                          ? { ...prev, payment_status: e.target.value }
                          : null
                      )
                    }
                  />
                </div>
                <div>
                  <label htmlFor="cp" className="block text-sm font-semibold">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="cp"
                    className="w-full p-2 border rounded"
                    value={selectedElement?.cp ?? ""}
                    onChange={(e) =>
                      setSelectedElement((prev) =>
                        prev ? { ...prev, cp: e.target.value } : null
                      )
                    }
                  />
                </div>
                <Button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded mt-4"
                >
                  {selectedElement
                    ? "Enregistrer les modifications"
                    : "Ajouter"}
                </Button>
              </form>
          </DrawerComponent>
        </>
      )}
    </>
  );
}
