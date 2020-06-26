import React, {useState, useEffect, Fragment} from 'react';
import io from "socket.io-client";

let socket, endpoint = "https://syncplat-backend.herokuapp.com/";

function OnlineUsers() {
    const [users, setUsers] = useState([]);

    const refresh = () => {
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.emit("list-users", localStorage.getItem("room"))
    }

    useEffect(() => {    
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.emit("list-users", localStorage.getItem("room"))

        socket.on('list-users', users => {
            setUsers(users);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <Fragment>
            <button onClick={refresh} className="btn-online mt-5" style={{color: "#fff", textAlign: "center", cursor: "pointer"}}><b>Users in this room: {users.length} <i className="fa fa-refresh" aria-hidden="true"></i></b></button>
            <div className="online-users">
                {users.map(user =>
                    <p style={{color: "#48d1cd", textAlign: "center"}} key={Math.random()}> {user} </p>
                )}   
            </div>    
        </Fragment>    
    );
}

export {
    OnlineUsers
}