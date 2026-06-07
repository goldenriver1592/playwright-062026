/**
 * Đường dẫn lưu storage state của user đã đăng nhập.
 *
 * File này được:
 * - Tạo trong global.setup.ts sau khi login thành công.
 * - Sử dụng trong playwright.config.ts thông qua storageState.
 * - Giúp các UI test bỏ qua bước đăng nhập.
 */
export const AUTH_FILE = 'playwright/auth/user.json';