
import * as chai from 'chai';
import { app } from './../src/main';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const route = '/fgp';

it('Invalid routing', async () => {
    try {
        const res = await chai.request(app).get(route + '/unknownrouting');
    } catch (err) {
        expect(err.status).to.equal(401);
    }
});

it('/overview/:plantid/:technology', async () => {
    try {
        const res = await chai.request(app).get('/overview/:plantid/:technology');
        expect(res.status).to.equal(200);
    } catch (err) {
        expect(err.status).to.equal(401);
    }
});

// it('/overview/prolist/', async () => {
//   try {
//     const res = await chai.request(app).post('/overview/prolist/')
//       .send('data');
//     expect(res.status).to.equal(200);
//   } catch (err) {
//     expect(err.status).to.equal(401);
//   }
// });

it('/neworderdetails/:plantId/:equipmentType', async () => {
    try {
        const res = await chai.request(app).get('/neworderdetails/:plantId/:equipmentType');
        expect(res.status).to.equal(200);
    } catch (err) {
        expect(err.status).to.equal(401);
    }
});


it('/dashboarddetails/:plantId/:equipmentType', async () => {
    try {
        const res = await chai.request(app).get('/dashboarddetails/:plantId/:equipmentType');
        expect(res.status).to.equal(200);
    } catch (err) {
        expect(err.status).to.equal(401);
    }
});

