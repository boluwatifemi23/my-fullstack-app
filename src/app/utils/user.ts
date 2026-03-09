export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;     
  role: "user" | "admin";
  comparePassword(candidatePassword: string): Promise<boolean>;
  createdAt?: Date;
  updatedAt?: Date;
}

