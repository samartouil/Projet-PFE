import {useState ,React, useEffect} from 'react';
import request from '../utils/request';
import { Link } from 'react-router-dom'; 
import "./equipementList.css"
import { BsCollection, BsCartX, BsCardChecklist } from 'react-icons/bs';
import { BiSearch ,BiCheckCircle} from "react-icons/bi";
import { GrPowerReset, GrFormNext, GrFormPrevious  } from 'react-icons/gr';
import { FaTrash } from 'react-icons/fa'; 
import styles from "./Search.module.css";
import { debounce } from 'lodash';
import ArmoireSearchModal from "../pages/equipements/SearchModal"; 
import { useSelector } from "react-redux";
import { toast, ToastContainer  } from 'react-toastify'; 
import Swal from 'sweetalert2';

 


const EquipmentList = () => {

  const { user } = useSelector(state => state.auth);

  //1- get equipements
  const [equipements, setEquipements] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [equipementsPerPage, setEquipementsPerPage] = useState(8);

  const fetchAllEquipements = async () => {
    try {
      const response = await request.get('/api/equipements/');
      setEquipements(response.data);
    } catch (error) {
      console.error('Error fetching equipements:', error);
    }
  };


  //2- recherche 
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');

  const debouncedFetchEquipements = debounce(async (term, sort, criteria) => {
        try {
            const response = await request.get(`/api/equipements?searchTerm=${term}&sortOrder=${sort}`,{ params: criteria });
            setEquipements(response.data);
        } catch (error) {
            console.error('Erreur lors de la récupération des équipements:', error);
        }
    }, 300); 

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term); 
        debouncedFetchEquipements(term, sortOrder);  
    };

    const handleSortChange = (event) => {
        const sort = event.target.value; 
        setSortOrder(sort); 
        debouncedFetchEquipements(searchTerm, sort);
    };

    useEffect(() => {
        debouncedFetchEquipements(searchTerm, sortOrder); 
    }, [sortOrder, searchTerm]);

    //3- recherche par armoires
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };

    const closeModal = () => {
      setIsModalOpen(false);
    };

    const handleArmoireSearch = (armoireName) => {
      debouncedFetchEquipements(searchTerm, sortOrder, { armoire: armoireName });
      closeModal(); 
    };

    const handleReset = () => {
      setSearchTerm('');
      setSortOrder('asc');
      debouncedFetchEquipements('', 'asc');
    };


    //4- validation equipement
    const handleValidation = async (id) => {
      const result = await Swal.fire({
        title: 'Voulez-vous valider cet équipement?',
        text: 'Cette action ne peut pas être annulée.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      });
  
      if (result.isConfirmed) {
        try {
          await request.patch(`/api/equipements/valider/${id}`);
          toast.success('Équipement validé avec succès');
          fetchAllEquipements(); 
        } catch (error) {
          toast.error('Erreur lors de la validation de l\'équipement');
        }
      }
    };

    //5- nombre equipements
    const [totalEquipements, setTotalEquipements] = useState(0);
    const [equipementsHorsStock, setEquipementsHorsStock] = useState(0);
    const [equipementsInvalides, setEquipementsInvalides] = useState(0);
    const fetchEquipementsCount = async () => {
      try {
        const response = await request.get('/api/equipements/count');
        setTotalEquipements(response.data.total); 
        setEquipementsHorsStock(response.data.HorsStock); 
        setEquipementsInvalides(response.data.invalid); 
      } catch (error) {
        console.error('Erreur lors du comptage des équipements:', error);
      }
    };

    useEffect(() => {
      fetchAllEquipements();
      fetchEquipementsCount();
    }, []); 

    // Pagination logic
    const indexOfLastEquipement = currentPage * equipementsPerPage;
    const indexOfFirstEquipement = indexOfLastEquipement - equipementsPerPage;
    const currentEquipements = equipements.slice(
      indexOfFirstEquipement,
      indexOfLastEquipement
    );

    const totalPages = Math.ceil(equipements.length / equipementsPerPage);

    const paginate = (pageNumber) => {
      if (pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    };
  
    const goToPreviousPage = () => {
      if (currentPage > 1) {
        paginate(currentPage - 1);
      }
    };
  
    const goToNextPage = () => {
      if (currentPage < totalPages) {
        paginate(currentPage + 1);
      }
    };

    const handleDelete = async (id) => {
      const result = await Swal.fire({
        title: 'Voulez-vous supprimer cet équipement?',
        text: 'Cette action ne peut pas être annulée.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
      });
    
      if (result.isConfirmed) {
        try {
          await request.delete(`/api/equipements/${id}`);
          toast.success('Équipement supprimé avec succès');
          fetchAllEquipements();
        } catch (error) {
          toast.error('Erreur lors de la suppression de l\'équipement');
        }
      }
    };
  
  return (
    <div className="equipment-list">
      
      <h2>Liste Des Equipements</h2>
      <ToastContainer />
      <div className="boxes">
      <div className="box">
          <BsCollection /> 
          <span>Total des équipements :</span>
          <span>{totalEquipements}</span> 
        </div>
        {user.role !== 'stagiaire' && (
          <div className="boxH">
            <BsCartX /> 
            <span>Hors stocks :</span>
            <span>{equipementsHorsStock}</span> 
          </div>
        )}
        <div className="boxC">
          <BsCardChecklist /> 
          <span>Equipements non validés :</span>
          <span>{equipementsInvalides}</span> 
        </div>
      </div>
      <section className="search-bar" >
          <div className={styles.search}>
                <BiSearch size={18} className={styles.icon} />
                <input
                    type="text"
                    placeholder="Search products"
                    onChange={handleSearchChange}
                    
                />
                <div className='searchOp'>
                  <select onChange={handleSortChange}>
                    <option value="asc">A-Z</option>
                    <option value="desc">Z-A</option>
                  </select>
                  <button onClick={openModal} className='btnArmoire'>Rechercher par Armoire</button>
                  <GrPowerReset onClick={handleReset} title="Réinitialiser" size={24} style={{ cursor: 'pointer' }} /> 

                  <ArmoireSearchModal
                    isOpen={isModalOpen}
                    onRequestClose={closeModal}
                    onSearch={handleArmoireSearch}
                  />
                </div>
               
            </div>
            
      </section>
      
      
      <ul>
        {currentEquipements.map(equipment => {
          const armoireName = equipment.EQplace?.armoireId?.name || "Armoire inconnue";
          return(
          <li key={equipment._id}>
            {(user.role !== 'stagiaire')? (<button
                className="delete-button"
                onClick={() => handleDelete(equipment._id)}
                title="Supprimer cet équipement"
              ><FaTrash />
              </button>) : (<></>)}
            
                
            <Link to={`/equipements/${equipment._id}`}>
              <img src={equipment.EQphoto.url} alt={equipment.EQphoto} />
              <div>
                <h3>{equipment.EQname}</h3>
                <p>Stock: {equipment.EQstock}</p>
                <p>Emplacement: {armoireName} - {equipment.EQplace.name}</p>
                <p>Ajouté par: {equipment.createdBy.username} - {equipment.createdBy.role}</p>
                
              </div>
            </Link>
            {(user.role === 'stagiaire' && !equipment.isValid ) ?(
                  <span className="not-valid-button">Non validé</span>
                ) 
              : (
                !equipment.isValid && (
                  <button onClick={() => handleValidation(equipment._id)} title="Valider l'équipement" className='validation-button'>
                    <BiCheckCircle size={24} />  Valider
                  </button>
                )
              )}

          </li>
          );
        })}
      </ul>

      <div className="pagination">
        <button onClick={goToPreviousPage} className="pagination-button">
          <GrFormPrevious />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            className={i + 1 === currentPage ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}

        <button onClick={goToNextPage} className="pagination-button">
          <GrFormNext />
        </button>
      </div>

    </div>
  );
}

export default EquipmentList;
