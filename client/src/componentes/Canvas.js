import React, {useState, useEffect} from 'react';
import io from "socket.io-client";
import Sketch from "react-p5";
import { useHistory } from 'react-router-dom';

let socket, endpoint = "https://syncplat-backend.herokuapp.com/", r, g, b, r1, g1, b1;

function CanvasMain() {   
    const [dataM, setDataM] = useState({
        x: 0,
        y: 0
    })

    let history = useHistory(); 
   
    const setup = (p5, canvasParentRef) => {
        let canvasDiv = document.getElementById('page-content');
        let width = canvasDiv.offsetWidth;
        let height = canvasDiv.offsetHeight;
        p5.createCanvas(width, height).parent(canvasParentRef);

        r = Math.random()*256;
        g = Math.random()*256;
        b = Math.random()*256;
        r1 = Math.random()*256;
        g1 = Math.random()*256;
        b1 = Math.random()*256;  
    };

    const mouseDragged = p5 => {
        let data_canvas = {
            x: p5.mouseX,
            y: p5.mouseY
        }

        socket.emit('mouse', data_canvas);

        p5.noStroke();
        p5.fill(r, g, b);
        p5.ellipse(p5.mouseX, p5.mouseY, 30, 30);
    };

    const setMouseCoords = data => {
        setDataM({x: data.x, y: data.y});
    }

    const draw = (p5) => {
        p5.noStroke();
        p5.fill(r1, g1, b1);
        p5.ellipse(dataM.x, dataM.y, 30, 30);
    }

    const keyPressed = (p5) => {
        if(p5.keyCode === 46){
            history.push("/temp");
            history.goBack();
        }
    }

    useEffect(() => {    
        socket = io(endpoint);

        socket.emit('new-user', localStorage.getItem("username"), localStorage.getItem("room"));

        socket.on('mouse', data => {
            setMouseCoords(data);
        });

        return () => socket.disconnect();
    }, []);

    return (
        <div className="container-fluid">
            <div className="alert alert-dismissable mt-2 text-center">
                <button type="button" className="close" data-dismiss="alert" aria-hidden="true">
                    &times;
                </button>
                Click and drag your mouse to start drawing! Press 'DEL' to clean the canvas.
            </div>
            <div id="sketch">
                <Sketch setup={setup} mouseDragged={mouseDragged} draw={draw} keyPressed={keyPressed} />
            </div>
        </div>
    );
}

export{
    CanvasMain
}