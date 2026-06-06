import { RegisterTestCase } from '@data/interfaces/register.interface';
import { expect, test, type Locator, type Page } from '@fixtures/test.fixture';
import { readCSVFile } from '@utils/csv_reader';

test.describe('Register page tests', () => {

    // Đọc toàn bộ dữ liệu test từ file CSV
    // Mỗi dòng trong CSV tương ứng với một test case
    const registerData: RegisterTestCase[] =
        readCSVFile<RegisterTestCase>('../data/registerData.csv');

    // Sinh test case động từ dữ liệu trong file CSV
    for (const data of registerData) {

        test(`Verify ${data.description}`, async ({ registerPage }) => {

            // Điều hướng tới trang Register
            await registerPage.goto();

            // Verify toàn bộ thành phần chính trên form hiển thị
            await expect(registerPage.firstNameInput).toBeVisible();
            await expect(registerPage.lastNameInput).toBeVisible();
            await expect(registerPage.phoneNumberInput).toBeVisible();
            await expect(registerPage.countryInput).toBeVisible();
            await expect(registerPage.emailInput).toBeVisible();
            await expect(registerPage.passwordInput).toBeVisible();
            await expect(registerPage.agreeCheckbox).toBeVisible();
            await expect(registerPage.registerButton).toBeVisible();

            // Thực hiện đăng ký với dữ liệu từ CSV
            await registerPage.register(data);

            // Xử lý các case đăng ký thành công
            if (data.expectedResult === 'success') {

                // Verify thông báo đăng ký thành công hiển thị
                await expect(registerPage.successfulMessage)
                    .toBeVisible();

            } else {

                // Verify thông báo thành công không xuất hiện
                await expect(registerPage.successfulMessage)
                    .not.toBeVisible();

                // Kiểm tra các field bị bỏ trống trong test data
                // và verify browser validation message tương ứng
                const requiredFields = [
                    'firstName',
                    'lastName',
                    'phone',
                    'country',
                    'email',
                    'password'
                ] as const;

                for (const key of requiredFields) {

                    // Nếu field có giá trị rỗng
                    if (data[key] === '') {

                        // Lấy locator tương ứng với tên cột trong CSV
                        const targetElement =
                            registerPage.getElementByDataColumnName(key);

                        // Verify validation message hiển thị đúng
                        expect(
                            await registerPage.getValidationMessage(
                                targetElement
                            )
                        ).toContain(data.expectedMessage);
                    }
                }
            }
        })
    }
})