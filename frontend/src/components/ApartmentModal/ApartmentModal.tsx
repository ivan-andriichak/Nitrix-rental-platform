import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addApartment, AppDispatch, updateApartment } from '../../store';
import css from './ApartmentModal.module.css';


interface ApartmentModalProps {
  apartment?: any,
  onClose: () => void,
  onSave?: (apartment: any) => Promise<void>
}

const ApartmentModal: React.FC<ApartmentModalProps> = ({ apartment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: apartment?.title || '',
    description: apartment?.description || '',
    price: apartment?.price || 0,
    rooms: apartment?.rooms || 1,
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (apartment) {
      dispatch(updateApartment({ ...apartment, ...formData }));
    } else {
      dispatch(addApartment(formData));
    }
    onClose();
  };

  return (
    <div className={css.modal}>
      <div className={css.modalContent}>
        <h2>{apartment ? 'Edit Apartment' : 'Add Apartment'}</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" />
          <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" />
          <select name="rooms" value={formData.rooms} onChange={handleChange}>
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
          </select>
          <button type="submit">Save</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ApartmentModal;
