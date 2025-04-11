import { Types } from "mongoose";

export interface IReceipt {
  _id?: Types.ObjectId;
  agentId: Types.ObjectId | {
    _id: Types.ObjectId;
    name: string;
  };
  amount: number;
  date: string;
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}
