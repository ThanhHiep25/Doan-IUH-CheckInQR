export interface User {

  id: string;
  name: string;
  email: string;
  seatNumber: string;
  organization?: string;
  avatar: string;
  address?: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
}
