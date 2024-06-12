import './usersList.css';
import React, { useState, useEffect } from 'react';
import request from '../utils/request'; 
import { toast } from 'react-toastify'; 
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';


const UserListe = () => {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(''); 

  const { user } = useSelector(state => state.auth);

  const fetchUsers = async () => {
    try {
      const response = await request.get('/api/users/profile', {params: { role } });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [role]);

  const confirmAction = async (action, userId, message, successMessage) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr?',
      text: message,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui',
      cancelButtonText: 'Non',
    });

    if (result.isConfirmed) {
      try {
        await action(userId);
        fetchUsers();
        toast.success(successMessage); 
      } catch (error) {
        console.error(error);
        const errorMessage = error.response?.data?.message || 'Erreur lors de la mise à jour';
        toast.error(errorMessage); 
      }
    }
  };

  const handleActivate = async (id) => {
    await request.put(`/api/users/profile/${id}/activate`, { activated: true });
  };

  const handleDeactivate = async (id) => {
    await request.put(`/api/users/profile/${id}/activate`, { activated: false });
  };



  

  return (
    <div className="container p-4 mt-4">
       <div className="filter-container">
          <label htmlFor="role-select" className='filter-title'>Filter par Rôle:</label>
          <select
            id="role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
            <option value="">Tous</option>
            {user && (user.isAdmin || user.role === 'responsable laboratoire') && (<option value="chercheur">chercheur</option>)}
            {user?.isAdmin? <option  value="responsable laboratoire">Responsable Laboratoire</option> : <></>}
            <option value="stagiaire">stagiaire</option>
          </select>
      </div>
      <div className="container-title">
        <i className="bi bi-people"></i> Liste des Utilisateurs
      </div>
      <table className="user-table">
        <thead>
          <tr>
            <th className="user-table-header">Nom</th>
            <th className="user-table-header">Email</th>
            <th className="user-table-header">Numéro de téléphone</th>
            <th className="user-table-header">Rôle</th>
            <th className="user-table-header">État du Compte</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="user-table-row">
              <td className="user-table-data">{user.username}</td>
              <td className="user-table-data">{user.email}</td>
              <td className="user-table-data">{user.phone}</td>
              <td className="user-table-data">{user.role}</td>
              <td className="user-table-data">
                <div className="button-group">
                  {user.activated ? (
                    <button
                      className="deactivate-button"
                      onClick={() =>
                        confirmAction(
                          handleDeactivate,
                          user._id,
                          'Voulez-vous vraiment désactiver cet utilisateur?',
                          'Désactivé avec succès'
                        )
                      }
                    >
                      Désactiver
                    </button>
                  ) : (
                    <button
                      className="activate-button"
                      onClick={() =>
                        confirmAction(
                          handleActivate,
                          user._id,
                          'Voulez-vous vraiment activer cet utilisateur?',
                          'Activé avec succès'
                        )
                      }
                    >
                      Activer
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserListe;
