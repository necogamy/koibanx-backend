const assert = require('assert');
const request = require('supertest');
const app = require('../app');

describe('/api', () => {
    describe('/stores', () => {
        describe('GET', () => {
            it('Should return 401 Unauthorized if not Basic Auth credentials was providen', async () => {
                await request(app)
            });

            it('Should return 401 Unauthorized if the Basic Auth credentials are wrong', () => {

            });

            it('Should return 401 Unauthorized if the Basic Auth credentials are wrong', () => {

            });
        });

        describe('POST', () => {
            it('Should return 401 Unauthorized if not Basic Auth credentials was providen', () => {

            });

            it('Should return 401 Unauthorized if the Basic Auth credentials are wrong', () => {

            });
        });

        describe('DELETE', () => {
            it('Should return 401 Unauthorized if not Basic Auth credentials was providen', () => {

            });

            it('Should return 401 Unauthorized if the Basic Auth credentials are wrong', () => {

            });
        });
    });
});