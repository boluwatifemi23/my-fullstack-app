export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;     // optional because we don’t return it to frontend
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

