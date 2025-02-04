import { useState, useEffect, FormEvent } from "react";
import { BiCheckCircle } from "react-icons/bi";
import { User, UserDrawerProps } from "../types/interface";
import OrderHistoryComponent from "../components/OrderHistoryComponent";
import axios from "axios";

interface UserRole {
  id: number;
  label: string;
}

export default function UserDrawer({
  isOpen,
  mode,
  user,
  onClose,
  onUpdate,
  onCreate,
}: UserDrawerProps) {
  const [formData, setFormData] = useState<Partial<User>>({});
  const [error, setError] = useState<string | null>(null);
  const [passwordVerify, setPasswordVerify] = useState<string | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);

  useEffect(() => {
    if ((mode === "update" || mode === "show") && user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        city: user.city,
        zip_code: user.zip_code,
        country: user.country,
      });
      setPasswordVerify(null);
      setError(null);
    } else if (mode === "create") {
      setFormData({ password: "" });
      setPasswordVerify("");
      setError(null);
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/roles`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((response) => {
        const data = response.data as { roles: UserRole[] };
        setRoles(data.roles);
      });
  }, [user, mode]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", options).replace(" à", " à");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (mode === "update" && user) {
      onUpdate(user.id, formData);
      setFormData({});
    } else if (mode === "create") {
      onCreate(formData);
      setFormData({});
    }
  };

  const getDrawerTitle = () => {
    switch (mode) {
      case "show":
        return "Détails de l'utilisateur";
      case "update":
        return "Modifier l'utilisateur";
      case "create":
        return "Créer un nouvel utilisateur";
      default:
        return "";
    }
  };

  const isSubmitDisabled =
    (mode === "create" && formData.password !== passwordVerify) ||
    formData.password === "" ||
    passwordVerify === "" ||
    formData.email === "";

  return (
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
        className={`absolute right-0 top-0 h-full bg-white shadow-xl p-6 z-50 flex flex-col transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } 
        w-full sm:w-96 md:w-2/3 lg:w-1/2 xl:w-1/3`}
      >
        <div className="flex justify-between items-center border-b pb-2 mb-4">
          <h2 className="text-lg font-semibold">{getDrawerTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Mode lecture seule (show) */}
        {mode === "show" && user && (
          <>
            <div className="space-y-4 text-sm leading-6 mb-4">
              <div>
                <span className="font-medium">Prénom:</span>{" "}
                {user.first_name || "-"}
              </div>
              <div>
                <span className="font-medium">Nom:</span>{" "}
                {user.last_name || "-"}{" "}
              </div>
              <div>
                <span className="font-medium">Email:</span> {user.email}
              </div>
              <div>
                <span className="font-medium">Téléphone:</span>{" "}
                {user.phone || "Non renseigné"}
              </div>
              <div>
                <span className="font-medium">Adresse:</span>{" "}
                {user.address || "Non renseigné"}
              </div>
              <div>
                <span className="font-medium">Ville:</span>{" "}
                {user.city || "Non renseigné"}
              </div>
              <div>
                <span className="font-medium">Code postal:</span>{" "}
                {user.zip_code || "Non renseigné"}
              </div>
              <div>
                <span className="font-medium">Pays:</span>{" "}
                {user.country || "Non renseigné"}
              </div>
              <div>
                <span className="font-medium">Créé le:</span>{" "}
                {formatDate(user.createdAt) || "N/A"}
              </div>
              <div>
                <span className="font-medium">Mis à jour le:</span>{" "}
                {formatDate(user.updatedAt) || "N/A"}
              </div>
              <div>
                <span className="font-medium">Rôle:</span>{" "}
                {user.role_id === 1 ? "Utilisateur" : "Administrateur"}
              </div>
            </div>

            {/* Historique des commandes */}
            <div className="max-h-64 overflow-y-auto">
              <OrderHistoryComponent userId={user.id} />
            </div>
          </>
        )}

        {/* Formulaire commun à "update" et "create" */}
        {(mode === "update" || mode === "create") && (
          <form onSubmit={handleSubmit} className="text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Nom */}
              <div className="col-span-1">
                <label className="block font-medium text-gray-700">
                  Nom <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.last_name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Prénom */}
              <div className="col-span-1">
                <label className="block font-medium text-gray-700">
                  Prénom <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.first_name || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Email */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Téléphone */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-medium text-gray-700">
                  Téléphone <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Adresse */}
              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Adresse <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.address || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Ville */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-medium text-gray-700">
                  Ville <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.city || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Code postal */}
              <div className="col-span-2 sm:col-span-1">
                <label className="block font-medium text-gray-700">
                  Code postal <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.zip_code || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      zip_code: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Pays */}
              <div className="col-span-2">
                <label className="block w-full font-medium text-gray-700">
                  Pays <span className="text-gray-500">(optionnel)</span>
                </label>
                <input
                  type="text"
                  value={formData.country || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      country: e.target.value,
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                />
              </div>

              {/* Rôle */}
              <div className="col-span-2">
                <label className="block font-medium text-gray-700">
                  Rôle <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.role_id || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role_id: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                >
                  <option value="">Sélectionner un rôle</option>

                  {/* Liste des rôles */}
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.label}
                    </option>
                  ))}
                </select>
              </div>

              {mode === "create" && (
                <>
                  {/* Mot de passe */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-gray-700">
                      Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={formData.password || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>

                  {/* Confirmation du mot de passe */}
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block font-medium text-gray-700">
                      Confirmer le mot de passe{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordVerify || ""}
                      onChange={(e) => {
                        setPasswordVerify(e.target.value);
                        // Petit message d'erreur si ça ne matche pas
                        if (formData.password !== e.target.value) {
                          setError("Les mots de passe ne correspondent pas");
                        } else {
                          setError(null);
                        }
                      }}
                      className="mt-1 block w-full border border-gray-300 rounded px-2 py-1"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              className={
                isSubmitDisabled
                  ? "bg-gray-300 text-white px-4 py-2 rounded mt-4"
                  : "bg-green-500 text-white px-4 py-2 rounded mt-4"
              }
              disabled={isSubmitDisabled}
            >
              <BiCheckCircle size={24} className="inline-block mr-2" />
              {mode === "update" ? "Modifier" : "Créer"}
            </button>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mt-4">
                {error}
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
