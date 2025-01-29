import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  RootState,
  AppDispatch,
  fetchApartments,
  addApartment,
  updateApartment,
  deleteApartment,
} from "../../store";
import ApartmentModal from "../ApartmentModal/ApartmentModal";
import css from "./ApartmentList.module.css";

const ApartmentList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { apartments, loading, error } = useSelector(
    (state: RootState) => state.apartment
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingApartment, setEditingApartment] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchApartments());
  }, [dispatch]);

  if (loading) return <p className={css.loadingMessage}>Loading...</p>;
  if (error) return <p className={css.errorMessage}>Error: {error}</p>;

  const handleDelete = (id: string) => {
    dispatch(deleteApartment(id));
  };

  const handleEdit = (apartment: any) => {
    setEditingApartment(apartment);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingApartment(null);
    setIsModalOpen(true);
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
