// import { useEffect, useRef, useState } from "react";
// import { useParams } from "react-router-dom";
// import socket from "../socket";

// function Game() {

//   const { roomId } = useParams();
//   const canvasRef = useRef(null);

//   const [drawerId, setDrawerId] = useState(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [guess, setGuess] = useState("");
//   const [timeLeft, setTimeLeft] = useState(0);

//   const [color, setColor] = useState("#ffffff");
//   const [brushSize, setBrushSize] = useState(3);
//   const [isErasing, setIsErasing] = useState(false);

//   // socket listeners
//   useEffect(() => {

//      if (!socket.connected) {
//     socket.connect();
//   }


//     socket.on("round_start", (data) => {

//       setDrawerId(data.drawerId);
//       setTimeLeft(data.timeLeft);

//       const ctx = canvasRef.current.getContext("2d");
//       ctx.clearRect(0,0,800,400);
//      ctx.beginPath();
//     });

//     socket.on("timer_update", (data) => {
//       setTimeLeft(data.timeLeft);
//     });

//     socket.on("draw_data", (data) => {
//       drawFromSocket(data);
//     });

//     socket.on("clear_canvas", () => {

//   const ctx = canvasRef.current.getContext("2d");

//   ctx.clearRect(0,0,800,400);
//   ctx.beginPath();

// });

//     socket.on("guess_result", (data) => {
//       if(data.correct){
//         alert("Correct Guess 🎉");
//       }
//     });

//     return () => {
//       socket.off("round_start");
//       socket.off("timer_update");
//       socket.off("draw_data");
//       socket.off("guess_result");

//     };

//   }, []);

//   // check if current player is drawer
//   const isDrawer = socket.id === drawerId;

//   // const isDrawer = drawerId && socket.id === drawerId;

//   const startDrawing = (e) => {

//     if(!isDrawer) return;

//     const rect = canvasRef.current.getBoundingClientRect();
//     const ctx = canvasRef.current.getContext("2d");

//     ctx.beginPath();
//     ctx.moveTo(
//       e.clientX - rect.left,
//       e.clientY - rect.top
//     );

//     setIsDrawing(true);
//   };

//   const stopDrawing = () => {

//     setIsDrawing(false);

//     const ctx = canvasRef.current.getContext("2d");
//     ctx.beginPath();
//   };

//   const draw = (e) => {

//     if(!isDrawing || !isDrawer) return;

//     const rect = canvasRef.current.getBoundingClientRect();

//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const ctx = canvasRef.current.getContext("2d");

//     ctx.lineWidth = brushSize;
//     ctx.lineCap = "round";
//     ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
//     ctx.strokeStyle = color;

//     ctx.lineTo(x,y);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(x,y);

//     socket.emit("draw_move",{
//       roomId,
//       data:{x,y,color,brushSize,isErasing}
//     });

//   };

//   const drawFromSocket = ({x,y,color,brushSize,isErasing}) => {

//     const ctx = canvasRef.current.getContext("2d");

//     ctx.lineWidth = brushSize;
//     ctx.lineCap = "round";
//     ctx.globalCompositeOperation = isErasing ? "destination-out" : "source-over";
//     ctx.strokeStyle = color;

//     ctx.lineTo(x,y);
//     ctx.stroke();
//     ctx.beginPath();
//     ctx.moveTo(x,y);
//   };

//   const handleGuess = () => {

//     if(!guess.trim()) return;

//     socket.emit("guess",{
//       roomId,
//       text:guess
//     });

//     setGuess("");
//   };


//   if (!drawerId) {
//   return (
//     <div className="h-screen flex items-center justify-center text-white bg-gray-900">
//       Waiting for round to start...
//     </div>
//   );
// }
//   return (

//     <div className="h-screen bg-gray-900 text-white flex flex-col items-center pt-6">

//       <h2 className="text-3xl mb-2">Game Room</h2>

//       <div className="text-xl mb-2">
//         ⏱ {timeLeft}s
//       </div>

//       {isDrawer ? (
//         <div className="text-green-400 mb-3">
//           You are the Drawer 🎨
//         </div>
//       ) : (
//         <div className="text-yellow-400 mb-3">
//           Guess the Word ✏️
//         </div>
//       )}

//       <canvas
//         ref={canvasRef}
//         width={800}
//         height={400}
//         className="bg-gray-700 rounded"
//         onMouseDown={startDrawing}
//         onMouseUp={stopDrawing}
//         onMouseMove={draw}
//         onMouseLeave={stopDrawing}
//       />

//       {isDrawer && (

//         <div className="flex gap-4 mt-4 items-center">

//           <input
//             type="color"
//             value={color}
//             onChange={(e)=>{
//               setColor(e.target.value);
//               setIsErasing(false);
//             }}
//           />

//           <input
//             type="range"
//             min="1"
//             max="20"
//             value={brushSize}
//             onChange={(e)=>{
//               setBrushSize(Number(e.target.value));
//             }}
//           />

//           <button
//             onClick={()=>setIsErasing(true)}
//             className="bg-red-500 px-3 py-1 rounded"
//           >
//             Eraser
//           </button>

//           <button
//             onClick={()=>{
//               const ctx = canvasRef.current.getContext("2d");
//               ctx.clearRect(0,0,800,400);

//               socket.emit("clear_canvas", { roomId });
//             }}
//             className="bg-gray-600 px-3 py-1 rounded"
//           >
//             Clear
//           </button>

//         </div>

//       )}

//       {!isDrawer && (

//         <div className="mt-6 flex">

//           <input
//             type="text"
//             placeholder="Enter guess"
//             className="px-4 py-2 rounded text-black"
//             value={guess}
//             onChange={(e)=>setGuess(e.target.value)}
//           />

//           <button
//             onClick={handleGuess}
//             className="ml-2 bg-blue-600 px-4 py-2 rounded"
//           >
//             Send
//           </button>

//         </div>

//       )}

//     </div>
//   );
// }

// export default Game;

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import PlayerList from "../components/PlayerList";
import ChatBox from "../components/ChatBox";

function Game() {

  const { roomId } = useParams();
  const canvasRef = useRef(null);

  const [drawerId, setDrawerId] = useState(null);
  const [wordOptions, setWordOptions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);

  const [guess, setGuess] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);

  const [color,setColor] = useState("#ffffff");
  const [brushSize,setBrushSize] = useState(3);
  const [isErasing,setIsErasing] = useState(false);

const [players, setPlayers] = useState([]);


  useEffect(()=>{

    socket.on("choose_word", (data) => {

  setWordOptions(data.words);
  setDrawerId(data.drawerId);

});

    socket.on("round_start",(data)=>{

      setDrawerId(data.drawerId);
      setTimeLeft(data.timeLeft);

      const ctx = canvasRef.current.getContext("2d");
      ctx.clearRect(0,0,800,400);
      ctx.beginPath();

    });

    socket.on("timer_update",(data)=>{
      setTimeLeft(data.timeLeft);
    });

    socket.on("draw_data",(data)=>{
      drawFromSocket(data);
    });

    socket.on("clear_canvas",()=>{

      const ctx = canvasRef.current.getContext("2d");

      ctx.clearRect(0,0,800,400);
      ctx.beginPath();

    });

    return ()=>{

      socket.off("choose_word");
      socket.off("round_start");
      socket.off("timer_update");
      socket.off("draw_data");
      socket.off("clear_canvas");

    };

  },[]);


  useEffect(() => {
  // Listen for the initial player list and any score updates
  socket.on("player_joined", (updatedPlayers) => {
    setPlayers(updatedPlayers);
  });

  // Handle guess results
  socket.on("guess_result", (data) => {
    if (data.correct) {
      // The "player_joined" emit from backend (Step 1) will 
      // automatically update the leaderboard scores here.
      console.log(`${data.playerName} got it right!`);
    }
  });

  return () => {
    socket.off("player_joined");
    socket.off("guess_result");
  };
}, []);

  // const isDrawer = socket.id === drawerId;

  const isDrawer = drawerId !== null && socket.id === drawerId;


  const chooseWord = (word)=>{

    socket.emit("word_chosen",{ roomId, word });

    setWordOptions([]);

  };


  const startDrawing = (e)=>{

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


  const stopDrawing = ()=>{

    setIsDrawing(false);

    const ctx = canvasRef.current.getContext("2d");

    ctx.beginPath();

  };


  const draw = (e)=>{

    if(!isDrawing || !isDrawer) return;

    const rect = canvasRef.current.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.globalCompositeOperation =
      isErasing ? "destination-out" : "source-over";

    ctx.lineTo(x,y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y);

    socket.emit("draw_move",{
      roomId,
      data:{x,y,color,brushSize,isErasing}
    });

  };

  const handleClearCanvas = () => {
  if (!isDrawer) return;

  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Notify the server to broadcast the clear action
  socket.emit("clear_canvas", { roomId });
};


  const drawFromSocket = ({x,y,color,brushSize,isErasing})=>{

    const ctx = canvasRef.current.getContext("2d");

    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;

    ctx.globalCompositeOperation =
      isErasing ? "destination-out" : "source-over";

    ctx.lineTo(x,y);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x,y);

  };


  const handleGuess = ()=>{

    if(!guess.trim()) return;

    socket.emit("guess",{ roomId, text:guess });

    setGuess("");

  };


 return (
  <div className="min-h-screen bg-gray-900 text-white flex flex-col lg:flex-row">

    {/* LEFT — Leaderboard */}
    <div className="lg:w-64 w-full bg-gray-800 p-4 overflow-y-auto">
      <h3 className="text-xl mb-4 font-bold text-center">Players</h3>
      <PlayerList players={players} drawerId={drawerId} />
    </div>


    {/* CENTER — Game */}
    <div className="flex-1 flex flex-col items-center p-4 md:p-6">

      <h2 className="text-2xl md:text-3xl mb-2 font-bold text-center">
        Game Room
      </h2>

      <div className="text-lg md:text-xl mb-3">
        ⏱ {timeLeft}s
      </div>

      {/* {isDrawer ? (
        <div className="text-green-400 mb-4 text-center">
          You are drawing
        </div>
      ) : (
        <div className="text-yellow-400 mb-4 text-center">
          Guess the word
        </div>
      )} */}

      {drawerId === null ? (
        <div className="text-xl text-blue-400 animate-pulse mb-4">
          Waiting for drawer to pick a word...
        </div>
      ) : isDrawer ? (
        <div className="text-green-400 mb-4 text-center font-bold">
          You are drawing! Pick a word below.
        </div>
      ) : (
        <div className="text-yellow-400 mb-4 text-center">
          Guess the word!
        </div>
      )}


      {/* Word Choices */}
      {isDrawer && wordOptions.length > 0 && (
        <div className="flex flex-wrap justify-center gap-3 mb-4">
          {wordOptions.map((word, i) => (
            <button
              key={i}
              onClick={() => chooseWord(word)}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
            >
              {word}
            </button>
          ))}
        </div>
      )}


      {/* Responsive Canvas */}
      <div className="w-full max-w-4xl">
        <canvas
          ref={canvasRef}
          width={800}
          height={400}
          className="bg-gray-700 rounded shadow-lg w-full h-auto"
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseMove={draw}
          onMouseLeave={stopDrawing}
        />
      </div>


      {/* Clear Canvas */}
      {isDrawer && (
        <button
          onClick={handleClearCanvas}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded mt-4"
        >
          Clear Canvas
        </button>
      )}


      {/* Guess Input */}
      {!isDrawer && (
        <div className="mt-6 flex w-full max-w-md">
          <input
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            className="flex-1 px-4 py-2 rounded text-black border border-black bg-white"
            placeholder="Enter guess"
          />

          <button
            onClick={handleGuess}
            className="ml-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      )}
    </div>


    {/* RIGHT — Chat */}
    <div className="lg:w-80 w-full bg-gray-800 p-4 flex flex-col">
      <ChatBox socket={socket} roomId={roomId} isDrawer={isDrawer} />
    </div>

  </div>
);
}

export default Game;