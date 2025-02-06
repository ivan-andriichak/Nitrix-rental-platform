import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addApartment, AppDispatch, deleteApartment, fetchApartments, RootState, updateApartment } from '../../store';
import ApartmentModal from '../ApartmentModal/ApartmentModal';
import css from './ApartmentList.module.css';
import { Apartment } from '../../interfaces/types';

const BASE_URL = 'http://localhost:5000'; // Бекенд працює локально


const ApartmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { apartments, loading, error } = useSelector((state: RootState) => state.apartment);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingApartment, setEditingApartment] = useState<Apartment | undefined>(undefined);


  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  console.log(apartments); // Перевірка чи список оновлюється

  if (loading) return <p className={css.loadingMessage}>Loading...</p>;
  if (error) return <p className={css.errorMessage}>Error: {error}</p>;

  const handleAdd = () => {
    setEditingApartment(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (apartment: any) => {
    setEditingApartment(apartment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    console.log('Deleting apartment with id:', id);
    const isConfirmed = window.confirm('Are you sure you want to delete this apartment?');
    if (isConfirmed) {
      try {
        await dispatch(deleteApartment(id));
        setIsModalOpen(false);
      } catch (error) {
        console.error('Error deleting apartment:', error);
      }
    }
  };

  const handleSave = async (apartment: any) => {
    if (apartment.id) {
      await dispatch(updateApartment(apartment));
    } else {
      await dispatch(addApartment(apartment));
    }
    setIsModalOpen(false);
  };

  return (
    <div className={css.apartmentListContainer}>
      <button className={css.addApartmentButton} onClick={handleAdd}>
        Add Apartment
      </button>
      <ul className={css.apartmentList}>
        {apartments.map((apartment) => (
          <li key={apartment.id} className={css.apartmentListItem}>
            <h3 className={css.apartmentTitle}>{apartment.title}</h3>
            <p className={css.apartmentDescription}>{apartment.description}</p>

            {/* Додаємо зображення */}
            {apartment.photos && apartment.photos.length > 0 && (
              <div className={css.apartmentPhotos}>
                {apartment.photos.map((photo: string) => (
                  <img
                    key={photo}
                    src={`${BASE_URL}${photo}`} // Додаємо базову URL до шляху фото
                    alt={`photo: ${apartment.title}`}
                    className={css.apartmentImage}
                  />
                ))}
              </div>
            )}

            <div className={css.buttonContainer}>
              <button className={css.editButton} onClick={() => handleEdit(apartment)}>
                Edit
              </button>
              <button className={css.deleteButton} onClick={() => handleDelete(apartment.id)}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {isModalOpen && (
        <div className={css.modalOverlay}>
          <ApartmentModal
            apartment={editingApartment}
            onClose={() => setIsModalOpen(false)}
            onSave={handleSave}
          />
        </div>
      )}
    </div>
  );
};

export { ApartmentList };
