import React, {useState, useEffect} from 'react';
import io from "socket.io-client";

let socket, endpoint = "https://syncplat-backend.herokuapp.com/";

function ChatMain() {
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
    }

    useEffect(() => {    
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.on('chat-message', content => {
            receiveMessages(content);
            document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
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
        document.getElementById('chat-messages').scrollTop = document.getElementById('chat-messages').scrollHeight;
    };
    
    return (
        <div className="chat">
            <div id="chat-messages">
                {messages.map(msg =>
                    <div className="msg" key={i++}>
                        <p><b><i style={{color: "#2db4b0"}}>{msg.name}></i></b>&nbsp;{msg.message}</p>
                    </div>
                )}
                <br/>
            </div>
            
            <form id="send-container" onSubmit={onSubmitForm}>
              <div className="form-group">
                <input type="text" className="form-control" id="message" value={message} onChange={e => onChange(e)} autoComplete="off"/>
              </div>
              <button type="submit" className="btn" id="send-button"><i className="fa fa-paper-plane-o" aria-hidden="true"></i></button>
            </form>	
        </div>
    );
}

export{
    ChatMain
}