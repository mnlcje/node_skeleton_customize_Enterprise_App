import * as chai from 'chai';
import { app } from './../src/main';
import chaiHttp = require('chai-http');

chai.use(chaiHttp);
const expect = chai.expect;
const route = '/fgp';



describe('fgp test cases', () => {
    it('Get Overview details', () => {
        return chai.request(app).get(`${route}/overview/0012/LC`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(401);
            });
    });

    it('Get dashboard details', () => {
        return chai.request(app).get(`${route}/overview/capacitybuff/0012/LC`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(401);
            });
    });

    it('Get new order details', () => {
        return chai.request(app).get(`${route}/neworderdetails/0012/LC`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(401);
            });
    });

    it('Get PhaseData', () => {
        return chai.request(app).get(`${route}/phasedetails/0372/2019-08-02/true`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(401);
            });
    });

    it('Get orders without requirement', () => {
        return chai.request(app).get(`${route}/orders/witoutrequest/0372/LC`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get capacity buffer', () => {
        return chai.request(app).get(`${route}/overview/capacitybuff/0372/LC`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get saleorder item', () => {
        return chai.request(app).get(`${route}/saleorder/030044205896/00010`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get affectedmat', () => {
        return chai.request(app).get(`${route}/affectedmat/00010767253/0012`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get materialaffpo', () => {
        return chai.request(app).get(`${route}/materialaffpo/2019-08-02/0012`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/action', () => {
        return chai.request(app).get(`${route}/prodetail/action/0012/030044205896`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/action', () => {
        return chai.request(app).get(`${route}/affectedpo/0012/030044205896`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/action', () => {
        return chai.request(app).get(`${route}/affectedpo/0012/030044205896`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/comments', () => {
        return chai.request(app).get(`${route}/prodetail/comments/0012/00010767253`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail', () => {
        return chai.request(app).get(`${route}/prodetail/0012/00010767253/030044205896`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get processorder', () => {
        return chai.request(app).get(`${route}/processorder/00010767253`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get processorder', () => {
        return chai.request(app).get(`${route}/processorder/00010767253`)
            .then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get overview/process-orders', () => {
        return chai.request(app).post(`${route}/overview/process-orders`)
            .send('data').then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get actions', () => {
        return chai.request(app).post(`${route}/actions`)
            .send('data').then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/pocheck', () => {
        return chai.request(app).post(`${route}/prodetail/pocheck`)
            .send('data').then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

    it('Get prodetail/removeblend', () => {
        return chai.request(app).post(`${route}/prodetail/removeblend`)
            .send('data').then(res => {
                expect(res.status).to.equal(200);
            }).catch(err => {
                expect(err.status).to.equal(404);
            });
    });

})


