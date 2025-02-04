export type UserRole = "EMPLOYEE" | "MANAGER" | "ADMIN";

export type Gender = "MALE" | "FEMALE" | "OTHER";

export type UserStatus =
  | "UNCONFIRMED"
  | "CONFIRMED"
  | "ARCHIVED"
  | "COMPROMISED"
  | "UNKNOWN"
  | "RESET_REQUIRED"
  | "FORCE_CHANGE_PASSWORD";

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  cognitoSub: string;
  cognitoUsername: string | null;
  emailVerified: boolean;
  status: UserStatus;
  gender: Gender;
  organizationId: string;
  team: string | null;
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  industry: string;
  size: string;
  country: string;
  city: string;
  email: string;
  phoneNumber: string | null;
  trialEndDate: Date;
  createdAt: Date;
  updatedAt: Date;
}
