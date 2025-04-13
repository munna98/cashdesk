import { Types } from "mongoose";

export interface ITransaction {
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
