import { io } from "socket.io-client";

// Connect to backend server
const socket = io("http://127.0.0.1:5005");

export default socket;
