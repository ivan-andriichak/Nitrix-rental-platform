export interface Apartment {
  _id: string;
  title: string;
  description: string;
  price: number;
  rooms: number;
}

export interface FormData {
  title: string;
  description: string;
  price: number;
  rooms: number;
}
