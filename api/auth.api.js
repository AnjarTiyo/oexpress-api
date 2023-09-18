const supertest = require("supertest");
const { faker } = require("@faker-js/faker");

require("dotenv").config();

const baseUrl = process.env.BASE_URL;

async function registerUser({ apiKey, memberCategory, isActive = false, headers = undefined, payloads = undefined }) {
    const header = headers || {
        'Content-Type': 'application/json',
        'x-api-key': apiKey || process.env.API_KEY
    };

    const payload = payloads || {
        'name': faker.person.fullName(),
        'email': faker.internet.email({ provider: 'yopmail.com' }),
        'password': 'Keon123!',
        'phone': '089999999999999',
        'address': faker.location.secondaryAddress() + faker.location.city(),
        'member-category': memberCategory,
        'branch_id': '619ca842f936eb2a7c1422b7',
        'is_active': isActive
    };

    try {
        return await supertest(baseUrl)
            .post('/auth/member/register')
            .set(header)
            .send(payload)
    } catch (error) {
        console.log(error);
    }
}

async function login(username, password, apiKey = process.env.API_KEY) {
    const headers = {
        'Content-Type': 'application/json',
        'x-api-key': apiKey
    };
    const payload = {
        'email': username,
        'password': password
    };

    try {
        return await supertest(baseUrl)
            .post('/auth/member/login')
            .set(headers)
            .send(payload);
    } catch (error) {
        console.log(error);
    }
}

async function me(token, apiKey = process.env.API_KEY) {
    const headers = {
        'x-api-key': apiKey,
        'Authorization': 'Bearer ' + token
    };

    try {
        return await supertest(baseUrl)
            .get('/auth/member/me')
            .set(headers)
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    registerUser,
    login,
    me
}