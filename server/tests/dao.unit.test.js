const dao = require('../dao.js')
const sqlite = require('sqlite3');


describe("listServices", () => {
    test("U1: list services and there are at least two services", async () => {
        const expectedResult = [ 
            {name: "testService1", averageTime: 100},
            {name: "testService2", averageTime: 200}
        ]
        const st = await dao.addService("testService1", 100)
        const nd = await dao.addService("testService2", 200)

        const res = await dao.listServices()

        await dao.removeService(st)
        await dao.removeService(nd)
        
        expect(res).toContainEqual(expectedResult[0])
        expect(res).toContainEqual(expectedResult[1])
    })

});

describe("addService", () => {
    test("U1: add a service", async () => {
        const expectedResult = [ 
            {name: "testService1", averageTime: 100}
        ]
        const st = await dao.addService("testService1", 100)

        const res = await dao.listServices()

        await dao.removeService(st)
        
        expect(res).toContainEqual(expectedResult[0])
    })

    test("U2: add two services but the names are not unique", async () => {
        const expectedResult = [ 
            {name: "testService1", averageTime: 100},
            {name: "testService1", averageTime: 200}
        ]
        const okay = await dao.addService("testService1", 100)

        let err;
        try {
            const res = await dao.addService("testService1", 200)
        } catch (error) {
            err = error
        }

        await dao.removeService(okay)

        expect(err.errno).toBe(19)
    })

    test("U3: add two services but the names are unique", async () => {
        const expectedResult = [ 
            {name: "testService1", averageTime: 100},
            {name: "testService2", averageTime: 200}
        ]
        const st = await dao.addService("testService1", 100)
        const nd = await dao.addService("testService2", 200)

        const res = await dao.listServices()

        await dao.removeService(st)
        await dao.removeService(nd)
        
        expect(res).toContainEqual(expectedResult[0])
        expect(res).toContainEqual(expectedResult[1])
    })

    test("U4: add a service but the name is empty", async () => {
        const expectedResult = [ 
            {name: "", averageTime: 100}
        ]
        const st = await dao.addService("", 100)

        const res = await dao.listServices()

        await dao.removeService(st)
        
        expect(res).toContainEqual(expectedResult[0])
    })
});

describe("removeService", () => {
    test("U1: remove a service", async () => {
        const expectedResult = [ 
            {name: "testToBeRemoved", averageTime: 100}
        ]
        const st = await dao.addService("testToBeRemoved", 100)
        await dao.removeService(st)

        const res = await dao.listServices()

        
        expect(res).not.toContainEqual(expectedResult[0])
    })

    test("U2: remove a service twice so that it does not exist", async () => {
        const expectedResult = [ 
            {name: "testToBeRemoved", averageTime: 100}
        ]
        const st = await dao.addService("testToBeRemoved", 100)
        await dao.removeService(st)
        await dao.removeService(st)

        const res = await dao.listServices()

        
        expect(res).not.toContainEqual(expectedResult[0])
    })
})

describe("listServicesByCounter", () => {

})

describe("addServiceToCounter", () => {

})

describe("removeServiceToCounter", () => {

})
// describe('listServices', () => {
//     beforeEach(() => {
//         // Clear all mock calls between tests
//         jest.clearAllMocks();
//     });

//     test("U1", async () => {
//         const mockData = [
//             { name: 'shipping', averageTime: 30 },
//             { name: 'letters', averageTime: 45 },
//         ];

//         const mockSqlite = {
//             all: jest.fn((sql, params, callback) => {
//                 callback(null, mockData);
//             })
//         }

//         jest.spyOn(sqlite, 'Database').mockImplementation(() => mockSqlite)
//         // sqlite.Database.mock.instances[0].all.mockImplementation((sql, callback) => {
//         //     callback(null, mockData);
//         // });
//         const result = await dao.listServices();

//         // Your assertion here
//         expect(result).toEqual(mockData);
//     });
// })