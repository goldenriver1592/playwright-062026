import { test as base, expect, type APIRequestContext } from '@playwright/test';

type ApiContext = {
    apiContext: APIRequestContext;
};

export const test = base.extend<ApiContext>({
    apiContext: async ({ playwright }, use) => {

        const apiContext = await playwright.request.newContext({
            baseURL: 'https://fakestoreapi.com',
        });

        await use(apiContext);

        await apiContext.dispose();
    },
});

export { expect };