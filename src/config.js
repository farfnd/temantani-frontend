const config = {
    api: {
        userService: "http://localhost:4000",
        landService: "http://localhost:4000",
        projectService: "http://localhost:4000",
        workerService: "http://localhost:4001",
        inventoryService: "http://localhost:3333",
        orderService: "http://localhost:4002",
        invoiceService: "http://localhost:4005",
    },
    jwtSecret: "$2b$10$OstRst1LWEfDyKEGdKcOKO",
    adminRoles: {
        all: ["ADMIN_SUPER", "ADMIN_LANDOWNER", "ADMIN_BUYER", "ADMIN_WORKER", "ADMIN_PROJECT"],
        landowner: ["ADMIN_SUPER", "ADMIN_LANDOWNER"],
        buyer: ["ADMIN_SUPER", "ADMIN_BUYER"],
        worker: ["ADMIN_SUPER", "ADMIN_WORKER"],
        project: ["ADMIN_SUPER", "ADMIN_PROJECT"],
    },
    midtrans: {
        clientKey: "SB-Mid-client-ObmJinWW8tqcjZtQ",
    },
    googleMapsApiKey: 'AIzaSyBiSH85zr_h9i4mkaZOcNNSekc1FWJi5ZI',
    shipping: {
        origin: {
            subdistrict: 'Keputih',
            district: 'Sukolilo',
            city: 'Surabaya',
            postalCode: '60111',
        },
        cost: {
            base: 10000,
            perKmUnder10Km: 2000,
            perKmAbove10Km: 2500,
        }
    }
}

export default config;