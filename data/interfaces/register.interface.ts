export interface RegisterTestCase {
    description: string;
    firstName: string;
    lastName: string;
    phone: string;
    country: string;
    email: string;
    password: string;
    agree: boolean;
    expectedResult: "success" | "failure";
    expectedMessage: string;
}