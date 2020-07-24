import React, { useEffect, useState, useRef, Fragment} from 'react';
import io from "socket.io-client";
import ReactPlayer from 'react-player';

let socket, endpoint = "https://syncplat-backend.herokuapp.com/";

function SourcesToggle() {
    var slider = document.getElementsByClassName("slider")[0];
    slider.classList.toggle("close");

    return false;
}

function Player() {
    const [url, setURL] = useState("");
    const [src, setSrc] = useState("");
    const [playing, setPlaying] = useState(false);
    const [seeking, setSeeking] = useState(false);
    const player = useRef(null);

    const onReady = () => {
        if(src !== "Outro") {
            setPlaying(false);
            socket.emit('pause');
            console.log("Player ready!");
        }
    }
    const onPlay = () => {
        setPlaying(true);
        socket.emit('play');
        if(src === "Youtube") {
            socket.emit('video-time', player.current.getCurrentTime());
        }
    }
    const onPause = () => {
        if(src !== "Twitch" && !seeking) {
            setPlaying(false);
            socket.emit('pause');
        }
    }
    const onBuffer = () => {
        if(src !== "Outro" && src !== "Twitch") {
            socket.emit('video-time', player.current.getCurrentTime());
        }
    }
    const onSeek = (e) => {
        setSeeking(true);
        socket.emit('video-time', e);
    }

    const setURLtoWatch = (url_to_watch) => {
        if(url_to_watch.includes("youtube")) setSrc("Youtube");
        if(url_to_watch.includes("twitch")) setSrc("Twitch");
        if(url_to_watch.includes("vimeo")) setSrc("Vimeo");
        if(url_to_watch.includes("m3u8") || url_to_watch.includes("mp4")) setSrc("Outro");

        setURL(url_to_watch);
    }
    const setVideoTimer = time => {
        setSeeking(false);
        if(Math.trunc(time) !== Math.trunc(player.current.getCurrentTime())) {
            player.current.seekTo(time, 'seconds');
        }
    }

    useEffect(() => {    
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.on('chosen-video', url_to_watch => {
            setURLtoWatch(url_to_watch);
        }) 
        socket.on('play', () => {
            setPlaying(true);
        }) 
        socket.on('pause', () => {
            setPlaying(false);
        }) 
        socket.on('video-time', time => {
            setVideoTimer(time);
        }) 

        return () => socket.disconnect();
    }, []);

    const onSubmitForm = async e => {
        e.preventDefault();
        let content = ["youtube", "twitch", "vimeo", "m3u8", "mp4"]

        let getUrl = document.getElementById('url_video').value;

        if(!content.some(el => getUrl.includes(el)))
            getUrl = "";

        if(getUrl.includes("youtube")) setSrc("Youtube");
        if(getUrl.includes("twitch")) setSrc("Twitch");
        if(getUrl.includes("vimeo")) setSrc("Vimeo");
        if(getUrl.includes("m3u8") || getUrl.includes("mp4")) setSrc("Outro");

        setURLtoWatch(getUrl);

        socket.emit('chosen-video', getUrl);
    };
    
    return (
        <Fragment>
            <div className="container-fluid">
                <form id="videoForm" onSubmit={onSubmitForm}>
                    <div className="form-group">
                        <input type="text" className="form-control" id="url_video" placeholder="Introduza um URL para assistir" autoComplete="off"/>
                    </div>
                    <button type="submit" className="btn" style={{backgroundColor: '#24908d', color: '#fff'}}><i className="fa fa-search" aria-hidden="true"></i></button>
                </form>	
                <div className="player_all">
                    <ReactPlayer 
                        ref={player}
                        url={url} 
                        controls={true} 
                        muted={true}
                        width="80%" 
                        height="75vh"
                        onReady={onReady}
                        onPlay={onPlay}  
                        onPause={onPause}  
                        onSeek={e => onSeek(e)}
                        onBuffer={onBuffer}
                        playing={playing}
                        className="reactPlayer"
                    />
                </div>
            </div>
            <div className="show-wrapper">
                <button className="show-sources btn btn-blueish" onClick={SourcesToggle}>Sources <i className="fa fa-info-circle" aria-hidden="true"></i></button>
            </div>
            <div className="slider close">
                <h3 onClick={SourcesToggle} className="mt-3 text-center" style={{color: "#fff", cursor: "pointer"}}>Available sources <i className="fa fa-times" aria-hidden="true"></i></h3>
                <div className="grid-container">
                    <div className="card-video">
                        <img src="/imagens/youtube_logo.svg" alt="Logo Youtube"/>
                        <h4>Youtube</h4>    
                    </div>
                    <div className="card-video">
                        <img src="/imagens/twitch_logo.svg" alt="Logo Youtube"/>
                        <h4>Twitch</h4>    
                    </div>
                    <div className="card-video">
                        <img src="/imagens/vimeo_logo.svg" alt="Logo Vimeo"/>
                        <h4>Vimeo</h4>    
                    </div>
                </div>
            </div>  
        </Fragment>
    );
}


export{
    Player
}