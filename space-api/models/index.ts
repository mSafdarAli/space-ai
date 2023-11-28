import { ObjectId } from "mongodb";


export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  salt?: string;
  otp?: number;
  roleId: ObjectId;
  role?: Role;
  account_type: string;
  isProfileCompleted: boolean;
  active?: boolean;
}

export interface Role {
  _id: ObjectId;
  name: string;
  permissions: { [key: string]: { [key: string]: boolean } };
}
export interface Property {
  _id: ObjectId;
  space_link: string;
  scrap_done: boolean;
  details: PropertyDetails
}

export interface PropertyDetails{
  title:string;
  address:string;
  images: string[];
  overview: string;
  spaceDetails: string[];
  availableSpaces: string[];
  transportation: string[];
  amenities: string[];
  retails: string[];
  team: string[];

  
}