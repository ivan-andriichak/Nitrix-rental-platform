import React, { FC, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addApartment, AppDispatch, updateApartment } from '../../store';
import styles from './ApartmentModal.module.css';
import { Apartment, FormDataState } from '../../interfaces/types';

interface ApartmentModalProps {
  apartment?: Apartment,
  onClose: () => void,
  onSave?: (apartment: Apartment) => Promise<void>
}

const ApartmentModal: FC<ApartmentModalProps> = ({ apartment, onClose, onSave }) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formData, setFormData] = useState<FormDataState>({
    title: '',
    description: '',
    price: 0,
    rooms: 0,
    photos: [] as File[],
    photoPreviews: [] as string[],
  });

  useEffect(() => {
    setFormData({
      title: apartment?.title || '',
      description: apartment?.description || '',
      price: apartment?.price || 10,
      rooms: apartment?.rooms || 1,
      photos: [],
      photoPreviews: apartment?.photos || [],
    });
  }, [apartment]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setFormData(prev => ({
        ...prev,
        photos: fileArray,
        photoPreviews: fileArray.map(file => URL.createObjectURL(file)),
      }));
    }
  };

  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price.toString());
    formDataToSend.append('rooms', formData.rooms.toString());

    formData.photos.forEach((photo) => {
      formDataToSend.append('photos', photo);
    });

    try {
      if (apartment) {
        await dispatch(updateApartment({ id: apartment.id, formData: formDataToSend }));
      } else {
        await dispatch(addApartment(formDataToSend));
      }

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error saving apartment:', error);
    }
  };



  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <h2>{apartment ? 'Edit Apartment' : 'Add Apartment'}</h2>
        <form onSubmit={handleSubmit}>
          <input className={styles.input} name="title" value={formData.title} onChange={handleChange}
                 placeholder="Title" required />
          <textarea className={styles.input} name="description" value={formData.description} onChange={handleChange}
                    placeholder="Description" required />
          <input className={styles.input} name="price" type="number" value={formData.price} onChange={handleChange}
                 placeholder="Price" required />
          <select className={styles.input} name="rooms" value={formData.rooms} onChange={handleChange} required>
            {[1, 2, 3].map(num => <option key={num} value={num}>{num} Room(s)</option>)}
          </select>

          <label htmlFor="photos">Завантажити фото:</label>
          <input type="file" name="photos" id="photos" multiple onChange={handlePhotoChange} />

          <div className={styles.photoPreviewsContainer}>
            {formData.photoPreviews.map((photo, index) => (
              <img key={index} src={photo} alt={`Preview: ${index}`} className={styles.photoPreview} />
            ))}
          </div>
          <div className={styles.buttonsContainer}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={success}>Закрити</button>
            <button type="submit" className={styles.saveButton} disabled={success}>{
              apartment ? 'Update' : 'Add'
            }</button>
          </div>
          {success && <p>Квартира {apartment ? 'updated' : 'added'} successfully!</p>}
        </form>
      </div>
    </div>
  );
};

export default ApartmentModal;
