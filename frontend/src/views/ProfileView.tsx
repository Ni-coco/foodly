import { useState } from "react";
import axios from "axios";

interface UserData {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  address: string | null;
  zip_code: string | null;
  country: string | null;
  city: string | null;
  role_id: number;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [userData, setUserData] = useState<UserData>(
    JSON.parse(localStorage.getItem("user") || "{}")
  );

  const [firstName, setFirstName] = useState(userData.first_name || "");
  const [lastName, setLastName] = useState(userData.last_name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [address, setAddress] = useState(userData.address || "");
  const [zipCode, setZipCode] = useState(userData.zip_code || "");
  const [country, setCountry] = useState(userData.country || "");
  const [city, setCity] = useState(userData.city || "");

  // State pour le message de notification (success ou error)
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // State pour gérer l’animation d’apparition/disparition
  const [showNotification, setShowNotification] = useState(false);

  const formatDate = (date: string) => {
    const d = new Date(date);
    return `${d.getDate()}/${
      d.getMonth() + 1
    }/${d.getFullYear()} à ${d.getHours()}:${d.getMinutes()}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updated = {
      ...userData,
      first_name: firstName,
      last_name: lastName,
      email,
      phone,
      address,
      zip_code: zipCode,
      country,
      city,
      updatedAt: new Date().toISOString(),
    };
    setUserData(updated);
    localStorage.setItem("user", JSON.stringify(updated));

    const token = localStorage.getItem("token");

    axios
      .put(
        `${import.meta.env.VITE_API_URL}/users/${userData.id}`,
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          address,
          zip_code: zipCode,
          country,
          city,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // Affichage d'un message de succès
        setNotification({
          type: "success",
          message: "Profil mis à jour avec succès !",
        });
        setShowNotification(true);

        // On masque le message après 3 secondes
        setTimeout(() => {
          setShowNotification(false);
          setTimeout(() => setNotification(null), 300); // petite latence pour la transition
        }, 3000);
      })
      .catch((error) => {
        console.error("Error updating profile:", error.response?.data || error);
        // Affichage d'un message d'erreur
        setNotification({
          type: "error",
          message: "Une erreur est survenue lors de la mise à jour.",
        });
        setShowNotification(true);

        setTimeout(() => {
          setShowNotification(false);
          setTimeout(() => setNotification(null), 300);
        }, 3000);
      });
  };

  return (
    <div className="flex items-center justify-center mt-10">
      <div className="bg-white rounded-lg md:shadow-md p-4 relative z-50 w-full max-w-xl">
        {/* Bloc de notification s'il y a un message */}
        {notification && (
          <div
            className={`
              transition-all duration-500 mb-4 p-3 rounded 
              ${
                showNotification
                  ? "opacity-100 max-h-20"
                  : "opacity-0 max-h-0 overflow-hidden"
              }
              ${
                notification.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }
            `}
          >
            {notification.message}
          </div>
        )}

        <h1 className="text-black text-xl md:text-3xl font-bold text-teal-700 mb-5 text-center">
          Mon Profil
        </h1>

        <div className="w-full pb-2 border-b border-gray-300 mb-2">
          <p className="text-sm text-gray-500">
            Créé le :{" "}
            <span className="font-medium text-gray-700">
              {userData.createdAt ? formatDate(userData.createdAt) : "N/A"}
            </span>
          </p>
          <p className="text-sm text-gray-500">
            Dernière modification :{" "}
            <span className="font-medium text-gray-700">
              {userData.updatedAt ? formatDate(userData.updatedAt) : "N/A"}
            </span>
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Prénom
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-mint 
                           transition-colors text-black"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Nom
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-mint
                           transition-colors text-black"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-mint
                         transition-colors text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Téléphone
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-mint
                         transition-colors text-black"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Adresse
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-mint
                         transition-colors text-black"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="md:w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Code postal
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-mint
                           transition-colors text-black"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
              />
            </div>
            <div className="md:w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Ville
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2
                           focus:outline-none focus:ring-2 focus:ring-mint
                           transition-colors text-black"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Pays</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-md px-3 py-2
                         focus:outline-none focus:ring-2 focus:ring-mint
                         transition-colors text-black"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-terracotta text-white text-lg
                       font-semibold rounded-md py-2 
                       hover:brightness-110 transition-colors shadow-sm"
          >
            Mettre à jour
          </button>
        </form>
      </div>
    </div>
  );
}
