/**
 * Danh sách các message lỗi được sử dụng trong test automation.
 *
 * Mục đích:
 * - Tránh hard-code message trong file test data hoặc test script.
 * - Dễ bảo trì khi application thay đổi nội dung message.
 * - Hỗ trợ Data Driven Testing thông qua message key.
 */
export const ERROR_MESSAGES = {

    /**
     * Thông báo xuất hiện khi đăng nhập thất bại
     * do email hoặc password không hợp lệ.
     */
    BAD_CREDENTIALS:
        "Bad credentials! Please try again! Make sure that you've registered."

} as const;

/**
 * Tự động tạo type từ các key của ERROR_MESSAGES.
 *
 * Kết quả:
 * type ErrorMessageKey = "BAD_CREDENTIALS"
 *
 * Lợi ích:
 * - Hạn chế typo khi sử dụng key.
 * - Được TypeScript kiểm tra trong compile time.
 */
export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;