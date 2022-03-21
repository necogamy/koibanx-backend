const assert = require('assert');
const request = require('supertest');
const app = require('../app');

const endpoint = `/api/stores`;
const basicAuthToken = 'dGVzdEBrb2liYW54LmNvbTp0ZXN0MTIz';
const invalidToken = 'aW52YWxpZHVzZXJAa29pYmFueC5jb206aW52YWxpZHBhc3N3b3Jk'; // invaliduser@koibanx.com | invalidpassword
const storeTest = {
    name: 'commerce-name-probe',
    cuit: '33-11111-62',
    conceptOne: 'concept-one',
    conceptTwo: 'concept-two',
    currentBalance: 33445,
    active: false,
    lastSale: '3/21/2022'
}
const invalidPayload = {
    name: 4124,
    cuit: '33-11111-62',
    currentBalance: 33445,
    active: false,
    lastSale: '3/21/2022'
}
const invalidId = 'invalidid9123';


describe('/api', () => {
    describe('/stores', () => {
        describe('ALL', () => {
            it('Should return 401 Unauthorized if not Basic Auth credentials was providen in any CRUD operation', async () => {
                const expectedStatus = 401;
                const expectedMessageStatus = 'Access Denied';
                
                const response = await request(app)
                    .get(endpoint)
                    .set("Accept", "application/json");
                
                assert.strictEqual(response.status, expectedStatus);
                assert.strictEqual(response.body.errors, expectedMessageStatus);
            });

            it('Should return 401 Unauthorized if the Basic Auth credentials are wrong in any CRUD operation', async () => {
                const expectedStatus = 401;
                const expectedMessageStatus = 'Access Denied';
                
                const response = await request(app)
                    .post(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${invalidToken}`)
                    .send(storeTest);
                
                assert.strictEqual(response.status, expectedStatus);
                assert.strictEqual(response.body.errors, expectedMessageStatus);
            });
        });

        describe('POST', () => {
            it('Should return 201 store created successfully with valid credentials and valid payload', async () => {
                const expectedStatus = 201;
                const expectedResponseProperty = 'data';
                const expectedMessageStatus = 'Store created successfully';

                const response = await request(app)
                    .post(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`)
                    .send(storeTest);
                
                assert.strictEqual(response.status, expectedStatus);
                assert.strictEqual(response.body.message, expectedMessageStatus);
                assert.ok(expectedResponseProperty in response.body);
            });
        });

        describe('GET', () => {
            it('Should return the stores with the valid Basic Auth credentials', async () => {
                const expectedStatus = 200;
                const expectedResponseProperty = 'data';
                
                const response = await request(app)
                    .get(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`);

                assert.strictEqual(response.status, expectedStatus);
                assert.ok(expectedResponseProperty in response.body);
            });

            it('Should return stores in no more than the limit query and the limit and total property with the desired value', async () => {
                const limitValue = 10;
                const query = `q={"limit": ${limitValue}}`;
                const finalEndpoint = `${endpoint}?${query}`;
                const expectedStatus = 200;
                const expectedResponseProperty = 'data';
                const expectedResponsePropertyTwo = 'limit';
                const expectedResponsePropertyThree = 'total';
                
                const response = await request(app)
                    .get(finalEndpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`);

                assert.strictEqual(response.status, expectedStatus);
                assert.ok(expectedResponseProperty in response.body);
                assert.ok(expectedResponsePropertyTwo in response.body);
                assert.ok(expectedResponsePropertyThree in response.body);
                assert.strictEqual(response.body.limit, limitValue);
                assert.ok(response.body.total <= 10);
            });
        });

        describe('DELETE', () => {
            it('Should return 200 deleted all stores successfully with valid credentials', async () => {
                const expectedStatus = 200;
                const expectedMessageStatus = 'Deleted all stores successfully';

                const response = await request(app)
                    .delete(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`);

                assert.strictEqual(response.status, expectedStatus);
                assert.strictEqual(response.text, expectedMessageStatus);
            });
        });


        describe('/:id', () => {
            let testStoreId;

            before(async () => {
                // Creating test store
                await request(app)
                    .post(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`)
                    .send(storeTest);

                let store = await request(app)
                    .get(endpoint)
                    .set("Accept", "application/json")
                    .set("Authorization", `Basic ${basicAuthToken}`);

                store = store.body.data.find(store => store['Comercio'] === storeTest.name);
                testStoreId = store.ID;
            });

            describe('PUT', async () => {
                it('Should return 404 store doesn\'t exists with valid credentials but with an invalid id', async () => {
                    const finalEndpoint = `${endpoint}/${invalidId}`;
                    const expectedStatus = 404;
                    const expectedMessageStatus = 'Store doesn\'t exists';

                    const response = await request(app)
                        .put(finalEndpoint)
                        .set("Accept", "application/json")
                        .set("Authorization", `Basic ${basicAuthToken}`)
                        .send(storeTest);

                    assert.strictEqual(response.status, expectedStatus);
                    assert.strictEqual(response.body.errors, expectedMessageStatus);
                });

                it('Should return 400 all fields must be filled with valid credentials but with an invalid payload', async () => {
                    const finalEndpoint = `${endpoint}/${testStoreId}`;
                    const expectedStatus = 400;
                    const expectedMessageStatus = 'All fields must be filled';

                    const response = await request(app)
                        .put(finalEndpoint)
                        .set("Accept", "application/json")
                        .set("Authorization", `Basic ${basicAuthToken}`)
                        .send(invalidPayload);

                    assert.strictEqual(response.status, expectedStatus);
                    assert.strictEqual(response.body.errors, expectedMessageStatus);
                });

                it('Should update the store with valid credentials, payload and id', async () => {
                    const finalEndpoint = `${endpoint}/${testStoreId}`;
                    const expectedStatus = 200;
                    const expectedMessageStatus = 'Update the store successfully';

                    const response = await request(app)
                        .put(finalEndpoint)
                        .set("Accept", "application/json")
                        .set("Authorization", `Basic ${basicAuthToken}`)
                        .send(storeTest);

                    assert.strictEqual(response.status, expectedStatus);
                    assert.strictEqual(response.text, expectedMessageStatus);
                });
            });

            describe('DELETE', () => {
                it('Should return 404 store doesn\'t exists with valid credentials but with a invalid id', async () => {
                    const finalEndpoint = `${endpoint}/${invalidId}`;
                    const expectedStatus = 404;
                    const expectedMessageStatus = 'Store doesn\'t exists';

                    const response = await request(app)
                        .delete(finalEndpoint)
                        .set("Accept", "application/json")
                        .set("Authorization", `Basic ${basicAuthToken}`);

                    assert.strictEqual(response.status, expectedStatus);
                    assert.strictEqual(response.body.errors, expectedMessageStatus);
                });

                it('Should delete the store with valid credentials and a valid id', async () => {
                    const finalEndpoint = `${endpoint}/${testStoreId}`;
                    const expectedStatus = 200;
                    const expectedMessageStatus = 'Deleted the store successfully';

                    const response = await request(app)
                        .delete(finalEndpoint)
                        .set("Accept", "application/json")
                        .set("Authorization", `Basic ${basicAuthToken}`);
                    
                    assert.strictEqual(response.status, expectedStatus);
                    assert.strictEqual(response.text, expectedMessageStatus);
                });
            });
        });
    });
});