import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = parseInt(process.env.PORT || "3000", 10);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = createServer(async (req, res) => {
        try {
            // Be sure to pass `true` as the second argument to `url.parse`.
            // This tells it to parse the query portion of the URL.
            const parsedUrl = parse(req.url!, true);

            await handle(req, res, parsedUrl);
        } catch (err) {
            console.error('Error occurred handling', req.url, err);
            res.statusCode = 500;
            res.end('internal server error');
        }
    });

    const io = new Server(server);

    io.on("connection", (socket) => {
        console.log("Client connected", socket.id);

        // Join user's personal room for direct messages
        socket.on("join-user-room", (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined room`);
        });

        // Handle sending messages (real-time relay)
        // Note: The actual persistence handles via REST API, this is for immediate feedback
        // OR we can handle persistence here too.
        // For simplicity, we assume REST API saves it, and then client triggers this event 
        // OR we just listen to 'send-message' and broadcast.
        // Better approach: Client posts to API, API saves to DB, API *also* emits to socket (via Redis or internal logic).
        // But since this is a monolith for now:
        socket.on("send-message", (message) => {
            // message object should have: receiverId, content, etc.
            console.log("Broadcasting message to", message.receiverId);
            io.to(message.receiverId).emit("new-message", message);
        });

        // Typing indicators
        socket.on("typing", ({ roomId, userId }) => {
            socket.to(roomId).emit("user-typing", { userId });
        });

        socket.on("stop-typing", ({ roomId, userId }) => {
            socket.to(roomId).emit("user-stop-typing", { userId });
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    server.listen(port, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
    });
});
