import { test, expect, type Locator } from '@fixtures/test.fixture'
import loginDataJSON from '@data/loginData.json'
import { LoginTestCase } from '@data/interfaces/login.interface';
import { ERROR_MESSAGES } from '@data/constants/errorMessages';

test.describe('Login page tests', () => {

    // Convert dữ liệu JSON sang mảng LoginTestCase
    // Dùng cho Data Driven Testing
    const loginData: LoginTestCase[] = loginDataJSON as LoginTestCase[];

    // Sinh test case động từ dữ liệu trong file JSON
    for (const data of loginData) {

        test(`Verify ${data.description}`, async ({ loginPage }) => {

            // Mở trang login
            await loginPage.goto();

            // Verify các thành phần chính trên form login hiển thị
            await expect(loginPage.emailInput).toBeVisible();
            await expect(loginPage.passwordInput).toBeVisible();
            await expect(loginPage.submitButton).toBeVisible();

            // Thực hiện login với dữ liệu từ file test data
            await loginPage.login(data);

            // Lấy locator của thông báo lỗi
            const loginErrorMessage: Locator = loginPage.getLoginError();

            // Xử lý các case login thất bại
            if (data.expectedResult === 'failure') {

                // Verify thông báo lỗi hiển thị
                await expect(loginErrorMessage).toBeVisible();

                // Nếu test data có expectedMessage thì verify nội dung message
                if (data.expectedMessage) {

                    // Lấy text của thông báo lỗi
                    const errorMessageText: string =
                        await loginPage.getErrorMessage(loginErrorMessage);

                    // Verify message thực tế chứa message mong đợi
                    expect(errorMessageText)
                        .toContain(ERROR_MESSAGES[data.expectedMessage]);
                }

            } else {

                // Login thành công:
                // Verify nút Login không còn hiển thị
                // (đã chuyển sang màn hình sau login)
                await expect(loginPage.submitButton)
                    .not.toBeVisible();

                // Verify không xuất hiện thông báo lỗi
                await expect(loginErrorMessage).toBeVisible({ visible: false })
            }
        });
    }

});