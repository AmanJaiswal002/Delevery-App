let io;

const initSocket = (server) => {
    const { Server } = require("socket.io");
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        // console.log(`Socket connected: ${socket.id}`);

        // Join personal room for private notifications
        socket.on("join", (userId) => {
            socket.join(userId);
            // console.log(`User joined room: ${userId}`);
        });

        socket.on("disconnect", () => {
            // console.log(`Socket disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized");
    return io;
};

module.exports = { initSocket, getIO };
