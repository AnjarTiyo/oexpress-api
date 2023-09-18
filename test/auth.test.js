const { registerUser, login, me } = require("../api/auth.api");
const { faker } = require("@faker-js/faker");

require('dotenv').config();

describe('Feature: Register new Sociocommerce user', () => {
    const validApiKey = process.env.VALID_API_KEY;

    it('Register new valid sociocommerce user', async () => {
        const payload = {
            'name': faker.person.fullName(),
            'email': faker.internet.email({ provider: 'yopmail.com' }).toLowerCase(),
            'password': 'Keon123!',
            'phone': '089999999999999',
            'address': faker.location.secondaryAddress() + faker.location.city(),
            'member-category': 'social-commerce',
            'branch_id': '619ca842f936eb2a7c1422b7',
            'is_active': false
        };

        const res = await registerUser({
            apiKey: validApiKey,
            memberCategory: 'social-commerce',
            isActive: false,
            payloads: payload
        });

        const resBody = res.body;

        expect(res.status).toBe(200);
        expect(resBody.data.email).toBe(payload.email);
        expect(resBody.data.name).toBe(payload.name);
        // expect(resBody.data.phone).toBe(payload.phone);
        expect(resBody.data.address).toBe(payload.address);

        expect(resBody.message).toBe('Member berhasil terdaftar');
        expect(resBody.error_code).toBe(0);
    });

    it('Register with invalid API KEY', async () => {
        const res = await registerUser({
            apiKey: 'invalid',
            memberCategory: 'social-commerce',
            isActive: false
        });

        const resBody = res.body;

        expect(res.status).toBe(401);

        expect(resBody.message).toBe('Invalid Api Key');
        expect(resBody.error_code).toBe(0);
    });

    it('After register new valid user, the credentials can be used to login', async () => {
        const payload = {
            'name': faker.person.fullName(),
            'email': faker.internet.email({ provider: 'yopmail.com' }).toLowerCase(),
            'password': 'Keon123!',
            'phone': '089999999999999',
            'address': faker.location.secondaryAddress() + faker.location.city(),
            'member-category': 'social-commerce',
            'branch_id': '619ca842f936eb2a7c1422b7',
            'is_active': true
        };

        const reg = await registerUser({
            apiKey: validApiKey,
            memberCategory: 'social-commerce',
            payloads: payload
        });

        const res = await login(payload.email, payload.password);
        const resBody = res.body;

        expect(res.status).toBe(200);
        expect(resBody.data.access_token).not.toBeNull();
        expect(resBody.data.member_id).toBe(reg.body.data._id);

        expect(resBody.message).toBe('Login success');
        expect(resBody.error_code).toBe(0);
    });

    it('Register already registered phone number', async () => {
        const payload = {
            'name': faker.person.fullName(),
            'email': faker.internet.email({ provider: 'yopmail.com' }).toLowerCase(),
            'password': 'Keon123!',
            'phone': '089999999999999',
            'address': faker.location.secondaryAddress() + faker.location.city(),
            'member-category': 'social-commerce',
            'branch_id': '619ca842f936eb2a7c1422b7',
            'is_active': false
        };

        await registerUser({
            apiKey: validApiKey,
            memberCategory: 'social-commerce',
            payloads: payload
        });

        payload.email = faker.internet.email({ provider: 'yopmail.com' }).toLowerCase();

        const res = await registerUser({
            apiKey: validApiKey,
            memberCategory: 'social-commerce',
            payloads: payload
        });

        const resBody = res.body;

        expect(res.status).toBe(400);

        expect(resBody.message).toBe('phone number sudah terdaftar.');
        expect(resBody.error_code).toBe(0);
    });
});

describe('Feature: Check Current User Session', () => {
    let access_token;
    
    beforeAll(async () => {
        access_token = (await login(process.env.VALID_USERNAME, process.env.VALID_PASSWORD)).body.data.access_token
    });

    it('Check current user session after login', async () => {
        const res = await me(access_token);

        expect(res.status).toBe(200);
        expect(res.body.data.email).toBe(process.env.VALID_USERNAME);
        expect(res.body.message).toBe('');
        expect(res.body.error_code).toBe(0);
    });

    it('Check current user session without api key', async () => {
        const res = await me(access_token, '');

        expect(res.status).toBe(401);
        expect(res.body.message).toBe('API Key tidak tersedia')
    });
})