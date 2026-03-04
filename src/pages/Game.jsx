import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";

function Game() {

  const { roomId } = useParams();
  const canvasRef = useRef(null);

  const [drawerId, setDrawerId] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [guess, setGuess] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  const [color, setColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(3);
  const [isErasing, setIsErasing] = useState(false);

  // socket listeners
  useEffect(() => {

     if (!socket.connected) {
    socket.connect();
  }


    socket.on("round_start", (data) => {

      setDrawerId(data.drawerId);
      setTimeLeft(data.timeLeft);

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0,0,800,400);
     ctx.beginPath();
    });

    socket.on("timer_update", (data) => {
      setTimeLeft(data.timeLeft);
    });

    socket.on("draw_data", (data) => {
      drawFromSocket(data);
    });

    socket.on("clear_canvas", () => {

  const ctx = canvasRef.current.getContext("2d");

  ctx.clearRect(0,0,800,400);
  ctx.beginPath();

});

    socket.on("guess_result", (data) => {
      if(data.correct){
        alert("Correct Guess 🎉");
      }
    });

    return () => {
      socket.off("round_start");
      socket.off("timer_update");
      socket.off("draw_data");
      socket.off("guess_result");
      
    };

  }, []);

  // check if current player is drawer
  const isDrawer = socket.id === drawerId;

  // const isDrawer = drawerId && socket.id === drawerId;

  const startDrawing = (e) => {

    if(!isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();
    ctx.moveTo(
      e.clientX - rect.left,
      e.clientY - rect.top
    );

    setIsDrawing(true);
  };

  const stopDrawing = () => {

    setIsDrawing(false);

    const ctx = canvasRef.current.getContext("2d");
    ctx.beginPath();
  };

  const draw = (e) => {

    if(!isDrawing || !isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    ctx.strokeStyle = color;

    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x,y);

    socket.emit("draw_move",{
      roomId,
      data:{x,y,color,brushSize,isErasing}
    });

  };

  const drawFromSocket = ({x,y,color,brushSize,isErasing}) => {

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
    ctx.strokeStyle = color;

    ctx.lineTo(x,y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x,y);
  };

  const handleGuess = () => {

    if(!guess.trim()) return;

    socket.emit("guess",{
      roomId,
      text:guess
    });

    setGuess("");
  };


  if (!drawerId) {
  return (
    <div className="h-screen flex items-center justify-center text-white bg-gray-900">
      Waiting for round to start...
    </div>
  );
}
  return (

    <div className="h-screen bg-gray-900 text-white flex flex-col items-center pt-6">

      <h2 className="text-3xl mb-2">Game Room</h2>

      <div className="text-xl mb-2">
        ⏱ {timeLeft}s
      </div>

      {isDrawer ? (
        <div className="text-green-400 mb-3">
          You are the Drawer 🎨
        </div>
      ) : (
        <div className="text-yellow-400 mb-3">
          Guess the Word ✏️
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={800}
        height={400}
        className="bg-gray-700 rounded"
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseMove={draw}
        onMouseLeave={stopDrawing}
      />

      {isDrawer && (

        <div className="flex gap-4 mt-4 items-center">

          <input
            type="color"
            value={color}
            onChange={(e)=>{
              setColor(e.target.value);
              setIsErasing(false);
            }}
          />

          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e)=>{
              setBrushSize(Number(e.target.value));
            }}
          />

          <button
            onClick={()=>setIsErasing(true)}
            className="bg-red-500 px-3 py-1 rounded"
          >
            Eraser
          </button>

          <button
            onClick={()=>{
              const ctx = canvasRef.current.getContext("2d");
              ctx.clearRect(0,0,800,400);

              socket.emit("clear_canvas", { roomId });
            }}
            className="bg-gray-600 px-3 py-1 rounded"
          >
            Clear
          </button>

        </div>

      )}

      {!isDrawer && (

        <div className="mt-6 flex">

          <input
            type="text"
            placeholder="Enter guess"
            className="px-4 py-2 rounded text-black"
            value={guess}
            onChange={(e)=>setGuess(e.target.value)}
          />

          <button
            onClick={handleGuess}
            className="ml-2 bg-blue-600 px-4 py-2 rounded"
          >
            Send
          </button>

        </div>

      )}

    </div>
  );
}

export default Game;