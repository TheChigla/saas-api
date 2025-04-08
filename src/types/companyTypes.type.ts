import { Document, Types } from "mongoose";
import { IBaseInterface } from "./identityTypes.type";
import { IRegisteredSubscription } from "./subscriptionTypes.type";

export type companyField =
  | "name"
  | "email"
  | "password"
  | "country"
  | "industry";

export type industry =
  | "Finance"
  | "E-commerce"
  | "Healthcare"
  | "Technology"
  | "Education"
  | "Real Estate"
  | "Manufacturing"
  | "Energy"
  | "Telecommunications"
  | "Entertainment"
  | "Transportation"
  | "Retail"
  | "Hospitality"
  | "Media"
  | "Construction"
  | "Automotive"
  | "Food & Beverage";

export interface ICompany extends IBaseInterface, Document {
  name: string;
  email: string;
  password: string;
  country: string;
  industry: industry;
  balance: number;
  registeredSubscriptionId: Types.ObjectId | IRegisteredSubscription;
}
