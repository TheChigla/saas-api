export interface IBaseInterface {
  email: string;
  password: string;
  verified: boolean;
  sentAt: Date;
  changedPassword?: boolean;
}

export interface ILoginInterface {
  email: string;
  password: string;
}
