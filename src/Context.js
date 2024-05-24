import { createContext, useState, useRef, useEffect } from "react"; 
import { io } from 'socket.io-client';
import Peer from 'simple-peer';


const SocketContext = createContext();
const socket = io('http://localhost:8000')
const ContextProvider = ({ children }) => {
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [stream, setStream] = useState();
    const [name, setName] = useState('');
    const [call, setCall] = useState({});
    const [me, setMe] = useState('');
    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();


    
}