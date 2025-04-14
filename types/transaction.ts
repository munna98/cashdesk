
// types/transaction.ts
// import { Types } from "mongoose";

// export interface ITransaction {
//   _id?: string;
//   transactionNumber: string;
//   accountId: Types.ObjectId | any;
//   type: "receipt" | "payment";
//   amount: number;
//   date: Date;
//   note?: string;
//   createdAt?: Date;
//   updatedAt?: Date;
// }

// types/transaction.ts
import { Types } from "mongoose";

export interface ITransaction {
  _id?: string;
  transactionNumber: string;
  accountId: Types.ObjectId | any;
  type: "receipt" | "payment";
  amount: number;
  date: Date;
  note?: string;

  deleted?: boolean;
  deletedAt?: Date;

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isLocked?: boolean;
  lockedAt?: Date;

  createdAt?: Date;
  updatedAt?: Date;
}
