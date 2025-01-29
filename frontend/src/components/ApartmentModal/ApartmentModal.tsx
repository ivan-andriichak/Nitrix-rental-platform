import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addApartment, AppDispatch, updateApartment } from '../../store';
import css from './ApartmentModal.module.css';

interface ApartmentModalProps {
  apartment?: any;
  onClose: () => void;
  onSave?: (apartment: any) => Promise<void>;
}

const ApartmentModal: React.FC<ApartmentModalProps> = ({ apartment, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: apartment?.title || '',
    description: apartment?.description || '',
    price: apartment?.price || 0,
    rooms: apartment?.rooms || 0,
    photos: apartment?.photos || [],
  });

  useEffect(() => {
    if (apartment) {
      setFormData({
        title: apartment.title,
        description: apartment.description,
        price: apartment.price,
        rooms: apartment.rooms,
        photos: apartment.photos,
      });
    }
  }, [apartment]);

  const dispatch = useDispatch<AppDispatch>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const photoUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setFormData({ ...formData, photos: photoUrls });
    }
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
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
          />
          <input
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price"
            required
          />
          <select
            name="rooms"
            value={formData.rooms}
            onChange={handleChange}
            required
          >
            <option value={1}>1 Room</option>
            <option value={2}>2 Rooms</option>
            <option value={3}>3 Rooms</option>
            <option value={4}>4 Rooms</option>
            <option value={5}>5 Rooms</option>
          </select>
          <div>
            <label htmlFor="photos">Upload Photos:</label>
            <input
              type="file"
              name="photos"
              id="photos"
              multiple
              onChange={handlePhotoChange}
            />
            <div>
              {formData.photos.map((photo: string | undefined, index: React.Key | null | undefined) => (
                <img
                  key={index}
                  src={photo}
                  alt={`Photo ${index }`}
                  style={{ width: 100, height: 100, margin: 5 }}
                />
              ))}
            </div>
          </div>
          <button type="submit">Save</button>
        </form>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default ApartmentModal;
