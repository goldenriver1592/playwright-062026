import { test, expect } from '@fixtures/api.fixtures'
import { isNonEmptyArray, isPositiveNumber, isNonEmptyString, isNonArrayObject } from '@utils/helpers'
import { productData } from '@data/interfaces/product_data';

// Test data dùng cho API tạo sản phẩm
const testData: productData = {
    title: 'Test Product for Exam',
    price: 99.99,
    description: 'A product created by automated API test.',
    image: 'https://i.pravatar.cc',
    category: 'electronics',
}

test.describe('Phần 1: TEST API RIÊNG LẺ: TẠO MỘT NOTE MỚI', () => {

    // Lưu danh sách category hợp lệ để tái sử dụng ở các test case
    let validCategories: string[];

    test.beforeAll(async ({ apiContext }) => {

        // Lấy danh sách category từ hệ thống
        const response = await apiContext.get('products/categories');

        expect(response.status()).toBe(200);

        const body = await response.json();

        // Đảm bảo API trả về category hợp lệ
        expect(isNonEmptyArray(body)).toBeTruthy();

        validCategories = body;
    });

    test('TC-01: GET /products', async ({ apiContext }) => {

        // Lấy toàn bộ danh sách sản phẩm
        const response = await apiContext.get('products')

        expect(response.status()).toBe(200)

        const body = await response.json();

        // Response phải là mảng và có dữ liệu
        expect(isNonEmptyArray(body)).toBeTruthy();

        // Validate các field cơ bản của từng sản phẩm
        for (const data of body) {
            expect(isPositiveNumber(data.id)).toBeTruthy();
            expect(isNonEmptyString(data.title)).toBeTruthy();
            expect(isPositiveNumber(data.price)).toBeTruthy();
            expect(isNonEmptyString(data.category)).toBeTruthy();
        }

        // Đảm bảo không có sản phẩm nào bị trùng id
        const ids = new Set<number>();

        for (const item of body) {
            expect(ids.has(item.id)).toBe(false);
            ids.add(item.id);
        }
    })

    test('TC-02: GET /products/:id', async ({ apiContext }) => {

        // Lấy chi tiết sản phẩm có id = 1
        const response = await apiContext.get('products/1')

        expect(response.status()).toBe(200)

        const body = await response.json();

        // Validate dữ liệu chi tiết sản phẩm
        expect(body.id).toEqual(1);
        expect(isNonEmptyString(body.title)).toBeTruthy();
        expect(isPositiveNumber(body.price)).toBeTruthy();

        // Category phải nằm trong danh sách category hợp lệ
        expect(validCategories).toContain(body.category);

        // Rating tối đa là 5 sao
        expect(body.rating.rate).toBeLessThanOrEqual(5);

        expect(isPositiveNumber(body.rating.rate)).toBeTruthy();
        expect(isPositiveNumber(body.rating.count)).toBeTruthy();
    })

    test('TC-03: POST /products', async ({ apiContext }) => {

        // Tạo mới sản phẩm
        const response = await apiContext.post('products', {
            data: testData
        })

        expect([200, 201]).toContain(response.status());

        const body = await response.json();

        // Kiểm tra dữ liệu trả về khớp với dữ liệu đã gửi
        expect(isPositiveNumber(body.id)).toBeTruthy();
        expect(body.title).toEqual(testData.title);
        expect(body.price).toEqual(testData.price);
        expect(body.category).toEqual(testData.category);
    })

    test('TC-04: DELETE /products/:id', async ({ apiContext }) => {

        // Xóa sản phẩm có id = 6
        const response = await apiContext.delete('products/6', {
            data: testData
        })

        expect(response.status()).toBe(200)

        const body = await response.json();

        // Đảm bảo response là object hợp lệ
        expect(isNonArrayObject(body)).toBeTruthy();

        // Kiểm tra dữ liệu sản phẩm đã xóa
        expect(body.id).toEqual(6);
        expect(isNonEmptyString(body.title)).toBeTruthy();
        expect(isPositiveNumber(body.price)).toBeTruthy();
    })
})