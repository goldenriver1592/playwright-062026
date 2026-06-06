import { ErrorMessageKey } from "../constants/errorMessages";

export interface LoginTestCase {
    description: string;
    email: string;
    password: string;
    expectedResult: "success" | "failure";
    expectedMessage?: ErrorMessageKey;
}