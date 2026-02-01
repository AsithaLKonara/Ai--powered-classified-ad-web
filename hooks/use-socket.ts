import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export const useSocket = () => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Connect to the same host/port as the server
        const socketInstance = io({
            path: '/socket.io',
            addTrailingSlash: false,
        });

        socketInstance.on('connect', () => {
            setIsConnected(true);
            console.log('Socket connected:', socketInstance.id);
        });

        socketInstance.on('disconnect', () => {
            setIsConnected(false);
            console.log('Socket disconnected');
        });

        setSocket(socketInstance);

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return { socket, isConnected };
};
