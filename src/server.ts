import app from './app';
import prisma from "./libs/prismadb";
import dotenv from 'dotenv';
import { Server } from 'http';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Function to handle graceful shutdown
const shutdown = async (signal: string, server: Server) => {
    console.log(`Received ${signal}. Shutting down server...`);

    server.close(async () => {
        console.log('HTTP server closed.');
        try {
            await prisma.$disconnect();
            console.log('Prisma connection closed.');
            process.exit(0);
        } catch (error) {
            console.error('Error closing Prisma connection:', error);
            process.exit(1);
        }
    });
};

// Function to start the server
const startServer = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Connected to the database using Prisma.');

        const server = app.listen(PORT, () => {
            console.log(`🚀 Server is running on http://127.0.0.1:${PORT}`);
        });

        process.on('SIGINT', () => shutdown('SIGINT', server));
        process.on('SIGTERM', () => shutdown('SIGTERM', server));
    } catch (err) {
        console.error('❌ Failed to connect to the database:', err);
        process.exit(1);
    }
};

// Start the server
startServer().catch((err) => {
    console.error('❌ Failed to start server:', err);
    process.exit(1);
});
