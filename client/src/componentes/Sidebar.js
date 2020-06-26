import React, {useState, useEffect} from 'react';
import { Link } from "react-router-dom";
import io from "socket.io-client";
import { OnlineUsers } from './OnlineUsers';

let socket, endpoint = "https://syncplat-backend.herokuapp.com/";

function GlobalChatToggle() {
    var wrapper = document.getElementById("wrapper");
    wrapper.classList.toggle("chat_aberto");

    if(document.getElementById("wrapper").classList.contains("chat_aberto") && document.getElementById("global").classList.contains("blinking"))
        document.getElementById("global").classList.remove("blinking");

    return false;
}

function SidebarGlobal() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    let i = Math.random();

    const onChange = e => {
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
        setMessage(e.target.value);
    }

    const receiveMessages = content => {
        if(content.message !== "")
            setMessages(oldMsgs => [...oldMsgs, content]);
        if(!document.getElementById("wrapper").classList.contains("chat_aberto")) {
            document.getElementById("global").classList.add("blinking");
            document.getElementById("notification").play();
        }
        
    }

    useEffect(() => {    
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.on('chat-message', content => {
            receiveMessages(content);
        });

        return () => socket.disconnect();
    }, []);

    const onSubmitForm = async e => {
        e.preventDefault();

        const sentMessage = [];
        sentMessage.push({"message": message, "name": "Eu"});

        receiveMessages(sentMessage[0])
        setMessage("");

        socket.emit('send-chat-message', message);
    };
    
    return (
        <div id="chat_global">
            <div id="sidebar_chat_button">
                <button id="global" onClick={GlobalChatToggle} className="btn"><i className="fa fa-comments" aria-hidden="true"></i></button>
            </div> 
            <div id="sidebar_chat" className="mt-3">
                <div id="chat-messages" className="chat_global">
                    {messages.map(msg =>
                        <div className="msg" key={i++}>
                            <p><b><i style={{color: "#48d1cd"}}>{msg.name}></i></b>&nbsp;{msg.message}</p>
                        </div>
                    )}
                </div>
                <form id="send-container" className="chat_global_form" onSubmit={onSubmitForm}>
                    <div className="form-group">
                    <input type="text" className="form-control" id="message" value={message} onChange={e => onChange(e)} autoComplete="off"/>
                    </div>
                    <button type="submit" className="btn btn-dark" id="send-button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
                </form>	
            </div>
            <audio id="notification">
                <source src="mp3/juntos.mp3" type="audio/mpeg"/>
                Your browser does not support the audio element.
            </audio>
        </div>
    );
}

function SidebarChat() {
    return (
        <div id="sidebar">
            <div className="sidebar-heading">
                <p><b>Room: {localStorage.getItem("room")}</b></p>
            </div>
            <div className="list-group list-group-flush">
                <button className="list-group-item list-group-item-action atual"><i className="fa fa-comments" aria-hidden="true"></i> Chat</button>
                <Link to="/Watch" id="assistir" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-television" aria-hidden="true"></i> Watch</Link>
                <Link to="/Canvas" id="canvas" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-paint-brush" aria-hidden="true"></i> Canvas</Link>
            </div>
            <OnlineUsers />    
            <div className="footer">Made by <a style={{color: "#48d1cd"}} target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro</a></div>
        </div>
    );
}

function SidebarVideos() {
    return (
        <div id="sidebar">
            <div className="sidebar-heading">
                <p><b>Room: {localStorage.getItem("room")}</b></p>
            </div>
            <div className="list-group list-group-flush">
                <Link to="/Chat" id="chat" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-comments" aria-hidden="true"></i> Chat</Link>
                <button className="list-group-item list-group-item-action atual"><i className="fa fa-television" aria-hidden="true"></i> Watch</button>
                <Link to="/Canvas" id="canvas" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-paint-brush" aria-hidden="true"></i> Canvas</Link>
            </div>
            <OnlineUsers /> 
            <div className="footer">Made by <a style={{color: "#48d1cd"}} target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro</a></div>
        </div>
    );
}

function SidebarCanvas() {
    return (
        <div id="sidebar">
            <div className="sidebar-heading">
                <p><b>Room: {localStorage.getItem("room")}</b></p>
            </div>
            <div className="list-group list-group-flush">
                <Link to="/Chat" id="chat" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-comments" aria-hidden="true"></i> Chat</Link>
                <Link to="/Watch" id="assistir" className="list-group-item list-group-item-action bg-dark"><i className="fa fa-television" aria-hidden="true"></i> Watch</Link>
                <button className="list-group-item list-group-item-action atual"><i className="fa fa-paint-brush" aria-hidden="true"></i> Canvas</button>
            </div>
            <OnlineUsers /> 
            <div className="footer">Made by <a style={{color: "#48d1cd"}} target="_blank" rel="noopener noreferrer" href="https://github.com/xSerpine">Luís Ferro</a></div>
        </div>
    );
}

export{
    SidebarGlobal,
    SidebarChat,
    SidebarVideos,
    SidebarCanvas
}