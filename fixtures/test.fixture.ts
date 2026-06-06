import { test as base } from '@playwright/test'
import { LoginPage } from '@pages/LoginPage'
import { RegisterPage } from '@pages/RegisterPage';

/**
 * Khai báo các custom fixture được sử dụng trong project.
 */
type TestFixture = {

    /**
     * Fixture cung cấp LoginPage cho test.
     */
    loginPage: LoginPage;

    /**
     * Fixture cung cấp RegisterPage cho test.
     */
    registerPage: RegisterPage;
}

/**
 * Extend fixture mặc định của Playwright.
 * Mục đích:
 * - Khởi tạo Page Object.
 * - Inject Page Object vào test.
 */
export const test = base.extend<TestFixture>({

    /**
     * Fixture khởi tạo LoginPage.
     *
     * Flow:
     * 1. Nhận page từ Playwright.
     * 2. Khởi tạo LoginPage.
     * 3. Truyền LoginPage vào test thông qua use().
     */
    loginPage: async ({ page }, use) => {

        // Khởi tạo LoginPage với page hiện tại
        const loginPage = new LoginPage(page);

        // Cung cấp fixture cho test sử dụng
        await use(loginPage);
    },

    /**
     * Fixture khởi tạo RegisterPage.
     *
     * Flow:
     * 1. Nhận page từ Playwright.
     * 2. Khởi tạo RegisterPage.
     * 3. Truyền RegisterPage vào test thông qua use().
     */
    registerPage: async ({ page }, use) => {

        // Khởi tạo RegisterPage với page hiện tại
        const registerPage = new RegisterPage(page);

        // Cung cấp fixture cho test sử dụng
        await use(registerPage);
    }
})

/**
 * Re-export các object thường dùng
 * để test chỉ cần import từ fixture này.
 */
export { expect, type Locator, type Page } from '@playwright/test'