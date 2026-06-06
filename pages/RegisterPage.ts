import { type Page, type Locator } from '@playwright/test'
import { BasePage } from '@pages/BasePage';
import { RegisterTestCase } from '@data/interfaces/register.interface';

type RegisterField =
  | 'firstName'
  | 'lastName'
  | 'phone'
  | 'country'
  | 'email'
  | 'password';

/**
 * Page Object đại diện cho trang Register.
 * Chứa toàn bộ locator và các thao tác liên quan tới chức năng đăng ký tài khoản.
 */
export class RegisterPage extends BasePage {

    /**
     * Locator của ô First Name.
     */
    readonly firstNameInput: Locator;

    /**
     * Locator của ô Last Name.
     */
    readonly lastNameInput: Locator;

    /**
     * Locator của ô Phone Number.
     */
    readonly phoneNumberInput: Locator;

    /**
     * Locator của dropdown Country.
     */
    readonly countryInput: Locator;

    /**
     * Locator của ô Email.
     */
    readonly emailInput: Locator;

    /**
     * Locator của ô Password.
     */
    readonly passwordInput: Locator;

    /**
     * Locator của checkbox đồng ý điều khoản.
     */
    readonly agreeCheckbox: Locator;

    /**
     * Locator của nút Register.
     */
    readonly registerButton: Locator;

    /**
     * Locator của thông báo đăng ký thành công.
     */
    readonly successfulMessage: Locator;

    constructor(page: Page) {
        super(page, 'register.html');

        // Khởi tạo các locator sử dụng trên trang Register
        this.firstNameInput = page.getByLabel('First Name', { exact: true });
        this.lastNameInput = page.getByLabel('Last Name', { exact: true });
        this.phoneNumberInput = page.getByLabel('Phone number', { exact: true });
        this.countryInput = page.locator('#countries_dropdown_menu');
        this.emailInput = page.getByPlaceholder('Enter email', { exact: true });
        this.passwordInput = page.getByPlaceholder('Password', { exact: true });
        this.agreeCheckbox = page.getByRole('checkbox', {
            name: 'I agree with the terms and conditions'
        });
        this.registerButton = page.getByRole('button', {
            name: 'Register'
        });
        this.successfulMessage = page.getByText(
            'The account has been successfully created!'
        );
    }

    /**
     * Điều hướng tới trang Register.
     */
    async goto(): Promise<void> {
        await this.navigate(this.path);
    }

    /**
     * Nhập First Name.
     */
    async inputFirstName(firstName: string): Promise<void> {
        await this.fillField(this.firstNameInput, firstName);
    }

    /**
     * Nhập Last Name.
     */
    async inputLastName(lastName: string): Promise<void> {
        await this.fillField(this.lastNameInput, lastName);
    }

    /**
     * Nhập Phone Number.
     */
    async inputPhoneNumber(phoneNumber: string): Promise<void> {
        await this.fillField(this.phoneNumberInput, phoneNumber);
    }

    /**
     * Chọn Country trong dropdown.
     */
    async selectCountry(country: string): Promise<void> {
        await this.selectOption(this.countryInput, country);
    }

    /**
     * Nhập Email.
     */
    async inputEmail(email: string): Promise<void> {
        await this.fillField(this.emailInput, email);
    }

    /**
     * Nhập Password.
     */
    async inputPassword(password: string): Promise<void> {
        await this.fillField(this.passwordInput, password);
    }

    /**
     * Tick checkbox đồng ý điều khoản.
     */
    async checkAgree(): Promise<void> {
        await this.checkCheckbox(this.agreeCheckbox);
    }

    /**
     * Bỏ tick checkbox đồng ý điều khoản.
     */
    async uncheckAgree(): Promise<void> {
        await this.uncheckCheckbox(this.agreeCheckbox);
    }

    /**
     * Click nút Register để gửi form đăng ký.
     */
    async clickRegisterButton(): Promise<void> {
        await this.clickElement(this.registerButton);
    }

    /**
     * Thực hiện luồng đăng ký hoàn chỉnh:
     * 1. Nhập First Name
     * 2. Nhập Last Name
     * 3. Nhập Phone Number
     * 4. Chọn Country
     * 5. Nhập Email
     * 6. Nhập Password
     * 7. Tick hoặc bỏ tick Agree
     * 8. Click Register
     */
    async register(data: RegisterTestCase): Promise<void> {
        await this.inputFirstName(data.firstName);
        await this.inputLastName(data.lastName);
        await this.inputPhoneNumber(data.phone);
        await this.selectCountry(data.country);
        await this.inputEmail(data.email);
        await this.inputPassword(data.password);

        // Chuyển giá trị agree thành boolean
        const checkAgreeStatus = Boolean(data.agree);

        // Tick hoặc bỏ tick checkbox theo dữ liệu test
        if (checkAgreeStatus) {
            await this.checkAgree();
        } else {
            await this.uncheckAgree();
        }

        await this.clickRegisterButton();
    }

    /**
     * Lấy validation message của HTML5 form validation.
     *
     * Ví dụ:
     * - Please fill out this field.
     * - Please select an item in the list.
     */
    async getValidationMessage(fieldLocator: Locator): Promise<string> {
        const validationMessage = await fieldLocator.evaluate(
            (el: HTMLInputElement) => el.validationMessage
        );

        return validationMessage;
    }

    /**
     * Mapping tên cột trong file CSV
     * sang locator tương ứng trên giao diện.
     *
     * Dùng để xác định field nào đang bị bỏ trống
     * và kiểm tra validation message tương ứng.
     */
    getElementByDataColumnName(columnName: RegisterField): Locator {

        switch (columnName) {

            case "firstName":
                return this.firstNameInput;

            case "lastName":
                return this.lastNameInput;

            case "phone":
                return this.phoneNumberInput;

            case "country":
                return this.countryInput;

            case "email":
                return this.emailInput;

            case "password":
                return this.passwordInput;

            default:
                throw new Error(`Invalid column name: ${columnName}`);
        }
    }
}