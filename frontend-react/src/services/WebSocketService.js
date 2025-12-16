import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {
    const socket = new SockJS('http://localhost:8081/ws');
    stompClient = Stomp.over(socket);

    // Disable debug logs to keep console clean
    stompClient.debug = () => { };

    stompClient.connect({}, (frame) => {
        console.log('Connected to WebSocket');
        stompClient.subscribe('/topic/appointments', (message) => {
            if (message.body) {
                onMessageReceived(message.body);
            }
        });
    }, (error) => {
        console.error('WebSocket error', error);
    });
};

export const disconnectWebSocket = () => {
    if (stompClient !== null) {
        stompClient.disconnect();
    }
    console.log("Disconnected");
};
