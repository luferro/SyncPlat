import React, { useState } from 'react';

function FormLogin({setAuth}) {
    const [inputs, setInputs] = useState({
        username: "",
        room: ""
    });

    const { username, room } = inputs;
    
    const onChange = e => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    }
    
    const onSubmitForm = async e => {
        e.preventDefault();
        
        localStorage.setItem("username", username);
        localStorage.setItem("room", room.toUpperCase());

        setAuth(true);
    };
    return (
        <form onSubmit={onSubmitForm}>
            <div className="form-group">
                <label htmlFor="name">Username</label>
                <input type="text" name="username" className="form-control" id="name" value={username} onChange={e => onChange(e)} required/>
                <br/>
                <label htmlFor="room" data-toggle="tooltip" data-placement="right" title="Room name can't have more than 14 characters">Room*</label>
                <input type="text" name="room" className="form-control" id="room" pattern="[A-Za-z0-9_-]{1,14}" value={room} onChange={e => onChange(e)} required/>
            </div>
            <button type="submit" className="btn btn-blueish">Join</button>
        </form>
    );
}

export{
    FormLogin
}