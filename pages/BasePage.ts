import { type Page, type Locator } from '@playwright/test';

/**
 * BasePage chứa các hàm dùng chung cho tất cả Page Object.
 */
export class BasePage {

    /**
     * Đối tượng Playwright Page đại diện cho tab/browser hiện tại.
     */
    readonly page: Page;
    readonly path: string;

    constructor(page: Page, path = '') {
        this.page = page;
        this.path = path;
    }

    /**
     * Điều hướng tới một URL.
     * Chờ tới khi DOM được load hoàn tất trước khi tiếp tục.
     */
    async navigate(url: string): Promise<void> {
        try {
            await this.page.goto(url, {
                waitUntil: 'domcontentloaded'
            });
        } catch (error) {
            console.error(`Failed to navigate to: ${url}`);
            throw error;
        }
    }

    /**
     * Click vào một phần tử trên giao diện.
     */
    async clickElement(locator: Locator): Promise<void> {
        try {
            await locator.click();
        } catch (error) {
            console.error('Failed to click element');
            throw error;
        }
    }

    /**
     * Nhập dữ liệu vào input field.
     * Nếu value rỗng thì xóa dữ liệu hiện có.
     */
    async fillField(locator: Locator, value: string): Promise<void> {
        try {
            if (value) {
                await locator.fill(value);
            } else {
                await locator.clear();
            }
        } catch (error) {
            console.error(`Failed to fill field with value: ${value}`);
            throw error;
        }
    }

    /**
     * Chọn giá trị trong dropdown/select box.
     */
    async selectOption(locator: Locator, value: string): Promise<void> {
        try {
            await locator.selectOption(value);
        } catch (error) {
            console.error(`Failed to select option: ${value}`);
            throw error;
        }
    }

    /**
     * Tick vào checkbox.
     * Nếu checkbox đã được tick thì Playwright sẽ tự xử lý.
     */
    async checkCheckbox(locator: Locator): Promise<void> {
        try {
            await locator.check();
        } catch (error) {
            console.error('Failed to check Checkbox');
            throw error;
        }
    }

    /**
     * Bỏ tick khỏi checkbox.
     * Nếu checkbox chưa được tick thì Playwright sẽ tự xử lý.
     */
    async uncheckCheckbox(locator: Locator): Promise<void> {
        try {
            await locator.uncheck();
        } catch (error) {
            console.error('Failed to uncheck Checkbox');
            throw error;
        }
    }

    /**
     * Lấy nội dung text hiển thị của một phần tử.
     */
    async getElementText(locator: Locator): Promise<string> {
        try {
            return await locator.innerText();
        } catch (error) {
            console.error('Failed to get inner text');
            throw error;
        }
    }

    /**
     * Kiểm tra phần tử có đang hiển thị trên giao diện hay không.
     * Trả về true nếu hiển thị, ngược lại trả về false.
     */
    async isElementVisible(locator: Locator): Promise<boolean> {
        try {
            return await locator.isVisible();
        } catch (error) {
            console.error('Failed to get locator visibility');
            throw error;
        }
    }

    /**
     * Đợi phần tử xuất hiện trên giao diện.
     *
     * @param locator Locator của phần tử cần chờ.
     * @param timeout Thời gian chờ tối đa (ms), mặc định 5000ms.
     */
    async waitForElement(
        locator: Locator,
        timeout: number = 5000
    ): Promise<void> {
        try {
            await locator.waitFor({
                state: 'visible',
                timeout
            });
        } catch (error) {
            console.error(
                `Element was not visible after ${timeout} ms`
            );
            throw error;
        }
    }

    /**
     * Lấy tiêu đề (title) của trang hiện tại.
     */
    async getPageTitle(): Promise<string> {
        try {
            return await this.page.title();
        } catch (error) {
            console.error('Failed to get page title');
            throw error;
        }
    }
}