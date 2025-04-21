import { io } from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL_D, { transports: ["websocket"] });

export default socket;