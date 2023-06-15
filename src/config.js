const config = {
    api: {
        userService: "http://localhost:4000",
        landService: "http://localhost:4000",
        projectService: "http://localhost:4001",
        workerService: "http://localhost:4001",
        inventoryService: "http://localhost:3333",
        orderService: "http://localhost:4002",
    },
    jwtSecret: "$2b$10$OstRst1LWEfDyKEGdKcOKO",
    adminRoles: {
        all: ["ADMIN_SUPER", "ADMIN_LANDOWNER", "ADMIN_BUYER", "ADMIN_WORKER", "ADMIN_PROJECT"],
        landowner: ["ADMIN_SUPER", "ADMIN_LANDOWNER"],
        buyer: ["ADMIN_SUPER", "ADMIN_BUYER"],
        worker: ["ADMIN_SUPER", "ADMIN_WORKER"],
        project: ["ADMIN_SUPER", "ADMIN_PROJECT"],
    }
}

export default config;