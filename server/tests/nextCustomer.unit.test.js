const index_app = require('../index.js')
const request = require('supertest')
const dao = require('../dao.js')

describe('/api/nextCustomer/:id', () => {
    test('U1: calling nextCustomer and id is not an integer should return a 422 error', async () => {
        const resp = await request(index_app)
            .get(`/api/nextCustomer/notInt`)

        expect(resp.status).toBe(422)
    })

    test('U2: calling nextCustomer and id is less than 0 should return a 422 error', async () => {
        const resp = await request(index_app)
            .get(`/api/nextCustomer/-5`)

        expect(resp.status).toBe(422)
    })

    test('U3: calling nextCustomer', async () => {

        const test_services = ['service1', 'service2']
        jest.spyOn(dao, 'listServicesByCounter').mockImplementation( () => { return test_services })
        jest.spyOn(dao, 'queuesState').mockImplementation( () => {
            return [
                {name:'service1', current: 1, last: 10, averageTime: 5},
                {name:'service2', current: 8, last: 10, averageTime: 20}
            ]
        })
        const resp = await request(index_app)
            .get(`/api/nextCustomer/1`)

        console.log(resp.body)
        expect(resp.status).toBe(200)
        expect(resp.body.service).toBe('service1')
        expect(resp.body.nextCustomer).toBe(2)

    })
})
