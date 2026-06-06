import { test, expect } from '@fixtures/api.fixtures'
import { isNonEmptyArray, isPositiveNumber, isNonEmptyString, isNonArrayObject } from '@utils/helpers'
import { productData } from '@data/interfaces/product_data';

// Chạy tuần tự vì các bước trong scenario có phụ thuộc dữ liệu lẫn nhau
test.describe.serial('PHẦN 2: TEST API THEO SCENARIO', () => {

    test('TC-05: Luồng duyệt và đặt hàng (User Browsing Flow)', async ({ apiContext }) => {

        // Lưu dữ liệu để dùng cho các bước tiếp theo
        let productId: number;
        let userId: number;

        await test.step('Bước 1: Lấy sản phẩm theo category electronics', async () => {

            // Lấy danh sách sản phẩm thuộc category electronics
            const response = await apiContext.get('products/category/electronics');

            expect(response.status()).toBe(200);

            const body = await response.json();

            // Response phải là mảng và có dữ liệu
            expect(isNonEmptyArray(body)).toBeTruthy();

            // Đảm bảo server filter đúng category
            for (const product of body) {
                expect(product.category).toBe('electronics');
            }

            // Lưu productId đầu tiên để sử dụng cho bước tiếp theo
            productId = body[0].id;
            expect(isPositiveNumber(productId)).toBeTruthy();
        });

        await test.step('Bước 2: Xem chi tiết sản phẩm theo productId', async () => {

            // Lấy chi tiết sản phẩm từ productId lấy được ở bước 1
            const response = await apiContext.get(`products/${productId}`);

            expect(response.status()).toBe(200);

            const body = await response.json();

            // Đối chiếu dữ liệu với bước 1
            expect(body.id).toBe(productId);
            expect(body.category).toBe('electronics');

            // Kiểm tra dữ liệu cơ bản của sản phẩm
            expect(isPositiveNumber(body.price)).toBeTruthy();
            expect(isNonEmptyString(body.title)).toBeTruthy();
        });

        await test.step('Bước 3: Lấy thông tin người dùng', async () => {

            // Lấy thông tin user để chuẩn bị tạo cart
            const response = await apiContext.get('users/1');

            expect(response.status()).toBe(200);

            const body = await response.json();

            expect(body.id).toBe(1);

            // Validate email cơ bản
            expect(isNonEmptyString(body.email)).toBeTruthy();
            expect(body.email).toContain('@');

            // Validate họ và tên
            expect(isNonEmptyString(body.name.firstname)).toBeTruthy();
            expect(isNonEmptyString(body.name.lastname)).toBeTruthy();

            // Lưu userId cho bước tạo cart
            userId = body.id;
        });

        await test.step('Bước 4: Tạo giỏ hàng', async () => {

            // Tạo cart sử dụng productId và userId từ các bước trước
            const cartData = {
                userId: userId,
                date: '2026-06-04',
                products: [
                    {
                        productId: productId,
                        quantity: 2,
                    },
                ],
            };

            const response = await apiContext.post('carts', {
                data: cartData,
            });

            expect([200, 201]).toContain(response.status());

            const body = await response.json();

            // Kiểm tra server trả về đúng dữ liệu đã gửi
            expect(isPositiveNumber(body.id)).toBeTruthy();
            expect(body.userId).toBe(userId);

            expect(isNonEmptyArray(body.products)).toBeTruthy();
            expect(body.products.length).toBe(1);

            expect(body.products[0].productId).toBe(productId);
            expect(body.products[0].quantity).toBe(2);
        });

    })

    test('TC-06: Luồng quản lý sản phẩm (Product CRUD Flow)', async ({ apiContext }) => {

        // Lưu id sản phẩm được tạo để dùng cho PUT/PATCH/DELETE
        let createdId: number;

        // Payload tạo sản phẩm
        const testData: productData = {
            title: 'Test Product for Exam',
            price: 99.99,
            description: 'A product created by automated API test.',
            image: 'https://i.pravatar.cc',
            category: 'electronics',
        };

        await test.step('Bước 1: Tạo sản phẩm mới: Gửi POST /products với body hợp lệ', async () => {

            const response = await apiContext.post('products', {
                data: testData,
            });

            expect([200, 201]).toContain(response.status());

            const body = await response.json();

            // Lưu id sản phẩm mới tạo
            expect(isPositiveNumber(body.id)).toBeTruthy();
            createdId = body.id;

            // Đối chiếu toàn bộ dữ liệu với payload gửi lên
            expect(body.title).toBe(testData.title);
            expect(body.price).toBe(testData.price);
            expect(body.description).toBe(testData.description);
            expect(body.image).toBe(testData.image);
            expect(body.category).toBe(testData.category);
        });

        await test.step('Bước 2: Cập nhật sản phẩm: Gửi PUT /products/{createdId}', async () => {

            const updateProductData = {
                title: testData.title,
                price: 120.5,
                description: 'Updated product description.',
                image: testData.image,
                category: testData.category,
            };

            const response = await apiContext.put(`products/${createdId}`, {
                data: updateProductData,
            });

            expect(response.status()).toBe(200);

            const body = await response.json();

            // Id không được thay đổi sau khi update
            expect(body.id).toBe(createdId);

            // Đối chiếu dữ liệu vừa cập nhật
            expect(body.price).toBe(updateProductData.price);
            expect(body.description).toBe(updateProductData.description);
        });

        await test.step('Bước 3: Cập nhật một phần: Gửi PATCH /products/{createdId}', async () => {

            const patchData = {
                title: 'Updated title by PATCH',
            };

            const response = await apiContext.patch(`products/${createdId}`, {
                data: patchData,
            });

            expect(response.status()).toBe(200);

            const body = await response.json();

            // Id giữ nguyên, title được cập nhật
            expect(body.id).toBe(createdId);
            expect(body.title).toBe(patchData.title);
        });

        await test.step('Bước 4: Xoá sản phẩm: Gửi DELETE /products/{createdId}', async () => {

            const response = await apiContext.delete(`products/${createdId}`);

            expect(response.status()).toBe(200);

            const text = await response.text();

            // Fake Store API có thể trả JSON hoặc body rỗng
            if (text.trim().startsWith('{')) {
                const body = JSON.parse(text);

                expect(body).not.toBeNull();
                expect(body).not.toBeUndefined();

                // Đối chiếu id với sản phẩm đã tạo
                expect(body.id).toBe(createdId);
            }
        });
    });
});