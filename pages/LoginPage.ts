import { type Locator, type Page } from '@playwright/test'
import { BasePage } from "@pages/BasePage";
import { LoginTestCase } from '@data/interfaces/login.interface';

/**
 * Page Object đại diện cho trang Login.
 * Chứa toàn bộ locator và các thao tác liên quan tới chức năng đăng nhập.
 */
export class LoginPage extends BasePage {

    /**
     * Locator của ô Email.
     */
    readonly emailInput: Locator;

    /**
     * Locator của ô Password.
     */
    readonly passwordInput: Locator;

    /**
     * Locator của nút Submit/Login.
     */
    readonly submitButton: Locator;

    constructor(page: Page) {
        super(page, 'auth_ecommerce.html');

        // Khởi tạo các locator sử dụng trên trang Login
        this.emailInput = page.getByLabel('Email', { exact: true });
        this.passwordInput = page.getByLabel('Password', { exact: true });
        this.submitButton = page.getByRole('button', { name: 'Submit' })
    }

    /**
     * Điều hướng tới trang Login.
     */
    async goto(): Promise<void> {
        await this.navigate(this.path);
    }

    /**
     * Nhập email vào ô Email.
     */
    async inputEmail(email: string): Promise<void> {
        await this.fillField(this.emailInput, email);
    }

    /**
     * Nhập password vào ô Password.
     */
    async inputPassword(password: string): Promise<void> {
        await this.fillField(this.passwordInput, password);
    }

    /**
     * Click nút Submit để gửi form login.
     */
    async clickSubmit(): Promise<void> {
        await this.clickElement(this.submitButton);
    }

    /**
     * Thực hiện luồng đăng nhập hoàn chỉnh:
     * 1. Nhập email
     * 2. Nhập password
     * 3. Click Submit
     */
    async login(data: LoginTestCase): Promise<void> {
        await this.inputEmail(data.email);
        await this.inputPassword(data.password);
        await this.clickSubmit();
    }

    /**
     * Lấy locator của thông báo lỗi login.
     * Thông báo này chỉ xuất hiện khi đăng nhập thất bại.
     */
    getLoginError(): Locator {
        try {
            return this.page.getByRole('alert');
        } catch (error) {
            console.error(`Failed to get login error`);
            throw error;
        }
    }

    /**
     * Lấy nội dung text của thông báo lỗi.
     */
    async getErrorMessage(errorLocator: Locator): Promise<string> {
        return errorLocator.innerText();
    }

}