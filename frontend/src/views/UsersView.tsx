import { useEffect, useState } from "react";
import axios from "axios";
import UserDrawer from "../components/UserDrawer";
import { User } from "../types/interface";
import { IoMdAddCircleOutline, IoMdTrash, IoMdEye } from "react-icons/io";
import { PiNotePencilBold } from "react-icons/pi";

import TableComponent from "../components/TableComponent";
import { ColumnViewModel } from "../components/viewmodel/ColumnViewModel";
import { ColumnType } from "../components/viewmodel/ColumnType";

interface Role {
  id: number;
  label: string;
}

export default function UsersView() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [drawerMode, setDrawerMode] = useState<"show" | "update" | "create">(
    "show"
  );
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Filtre par rôle ("all" = aucun filtre particulier)
  const [filterRole, setFilterRole] = useState<number | "all">("all");

  // 1) Au montage, on récupère user depuis localStorage + liste utilisateurs + liste rôles
  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      try {
        const parsedUser = JSON.parse(userString) as User;
        setCurrentUser(parsedUser);
      } catch (e) {
        console.error("Impossible de parser le user de localStorage", e);
      }
    }

    // Récupération de la liste des utilisateurs
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data as { users: User[] };
        setUsers(Array.isArray(data.users) ? data.users : []);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to fetch users.");
      }
    };

    // Récupération de la liste des rôles
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/roles`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = response.data as { roles: Role[] };
        setRoles(data.roles);
      } catch (err: any) {
        console.error("Impossible de récupérer les rôles.", err);
      }
    };

    fetchUsers();
    fetchRoles();
  }, []);

  // 2) Filtrage par rôle (et exclusion éventuelle du currentUser si besoin)
  const filteredUsers = users
    // Si vous souhaitez exclure l'utilisateur courant de la liste :
    .filter((user) => user.id !== currentUser?.id)
    // Filtrage par rôle
    .filter((user) =>
      filterRole === "all" ? true : user.role_id === filterRole
    );

  // 3) Méthodes CRUD (Create / Update / Delete) + open/close drawer
  const handleDelete = (id: number) => async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to delete user.");
    }
  };

  const handleUpdate = async (id: number, data: Partial<User>) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/users/${id}`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user.id === id ? { ...user, ...data } : user))
      );
      setIsDrawerOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to update user.");
    }
  };

  const handleCreate = async (data: Partial<User>) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const responseData = response.data as { user: User };
      const newUser: User = responseData.user;
      setUsers((prevUsers) => [...prevUsers, newUser]);
      setIsDrawerOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create user.");
    }
  };

  const openShowDrawer = (user: User) => {
    setSelectedUser(user);
    setDrawerMode("show");
    setIsDrawerOpen(true);
  };

  const openUpdateDrawer = (user: User) => {
    setSelectedUser(user);
    setDrawerMode("update");
    setIsDrawerOpen(true);
  };

  const openCreateDrawer = () => {
    setSelectedUser(null);
    setDrawerMode("create");
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedUser(null);
  };

  const columns = [
    new ColumnViewModel("first_name", "Prénom", ColumnType.DEFAULT),
    new ColumnViewModel("last_name", "Nom", ColumnType.DEFAULT),
    new ColumnViewModel("email", "Email", ColumnType.DEFAULT),
  ];

  const editBtnLists = [
    {
      label: "Voir",
      actionCall: (u: User) => openShowDrawer(u),
      icon: <IoMdEye size={18} />,
    },
    {
      label: "Modifier",
      actionCall: (u: User) => openUpdateDrawer(u),
      icon: <PiNotePencilBold size={18} />,
    },
    {
      label: "Supprimer",
      actionCall: (u: User) => handleDelete(u.id),
      icon: <IoMdTrash size={18} />,
    },
  ];

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 pt-6">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Sélecteur de rôle (filtrage) */}
        <div className="flex items-center space-x-2 mb-4">
          <label htmlFor="roleSelect" className="text-gray-700 font-medium">
            Rôle :
          </label>
          <select
            id="roleSelect"
            value={filterRole}
            onChange={(e) => {
              const val = e.target.value;
              setFilterRole(val === "all" ? "all" : parseInt(val));
            }}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="all">Tous les rôles</option>
            {roles.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* On appelle désormais TableComponent pour lister nos utilisateurs filtrés */}
        <TableComponent
          title="Utilisateurs"
          data={filteredUsers}
          columns={columns}
          editBtnLists={editBtnLists}
          onAdd={openCreateDrawer}
          canAdd={true}
        />
      </div>

      {/* Drawer pour afficher/créer/modifier un user */}
      <UserDrawer
        isOpen={isDrawerOpen}
        mode={drawerMode}
        user={selectedUser}
        onClose={closeDrawer}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
      />
    </div>
  );
}
