"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const prismadb_1 = __importDefault(require("./libs/prismadb"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const PORT = process.env.PORT || 5000;
// Function to handle graceful shutdown
const shutdown = async (signal, server) => {
    console.log(`Received ${signal}. Shutting down server...`);
    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await prismadb_1.default.$disconnect();
            console.log('Prisma connection closed.');
            process.exit(0);
        }
        catch (error) {
            console.error('Error closing Prisma connection:', error);
            process.exit(1);
        }
    });
};
// Function to start the server
const startServer = async () => {
    try {
        // Test Prisma connection
        await prismadb_1.default.$connect();
        console.log('Connected to the database using Prisma.');
        const server = app_1.default.listen(PORT, () => {
            console.log(`Server is running on http://127.0.0.1:${PORT}`);
        });
        // Listen for termination signals
        process.on('SIGINT', () => shutdown('SIGINT', server));
        process.on('SIGTERM', () => shutdown('SIGTERM', server));
    }
    catch (err) {
        console.error('Failed to connect to the database:', err);
        process.exit(1);
    }
};
// Start the server
startServer().catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
