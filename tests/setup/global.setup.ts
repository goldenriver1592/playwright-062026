import { LoginTestCase } from '@data/interfaces/login.interface';
import { test as setup, expect } from '@fixtures/test.fixture';
import loginDataJSON from '@data/loginData.json';
import { AUTH_FILE } from '@data/constants/auth.constant';

/**
 * Global Setup
 *
 * Mục đích:
 * - Đăng nhập một lần trước khi chạy UI test.
 * - Lưu trạng thái đăng nhập (storage state).
 * - Tái sử dụng session cho các project phụ thuộc setup project.
 */
setup('authenticate as standard user', async ({ loginPage, page }) => {

    // Lấy tài khoản test đầu tiên từ file test data
    const loginData: LoginTestCase = loginDataJSON[0] as LoginTestCase;

    // Điều hướng tới trang đăng nhập
    await loginPage.goto();

    // Thực hiện đăng nhập
    await loginPage.login(loginData);

    // Xác nhận đăng nhập thành công
    await expect(
        page.getByRole('heading', { name: 'SHOPPING CART' })
    ).toBeVisible();

    // Lưu trạng thái đăng nhập để các test khác tái sử dụng
    await page.context().storageState({
        path: AUTH_FILE,
    });

    // Log phục vụ debug khi chạy setup project
    console.log('Global setup completed successfully.');
});