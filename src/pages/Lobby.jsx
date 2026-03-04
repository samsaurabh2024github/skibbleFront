import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import socket from "../socket";

function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    let playerName = localStorage.getItem("playerName");
    const isHost = localStorage.getItem("isHost");

    // If user opens lobby directly
    if (!playerName) {
      playerName = prompt("Enter your name");
      if (!playerName) return;

      localStorage.setItem("playerName", playerName);
      localStorage.removeItem("isHost");
    }

    // Only non-host users join room
    if (!isHost) {
      socket.emit("join_room", {
        roomId,
        playerName,
      });
    }

    // Update player list
    socket.on("player_joined", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });

    // 🔥 LISTEN FOR GAME START
    // socket.on("round_start", () => {
    //   navigate(`/game/${roomId}`);
    // });

    socket.on("game_started", () => {
  navigate(`/game/${roomId}`);
});

    return () => {
      socket.off("player_joined");
      socket.off("game_started");
    };
  }, [roomId, navigate]);

  const handleStartGame = () => {
    socket.emit("start_game", { roomId });
  };

  return (
    <div className="h-screen bg-gray-800 text-white flex flex-col items-center pt-20">
      <h2 className="text-3xl mb-4">Lobby</h2>
      <p className="mb-6">Room ID: {roomId}</p>

      <div className="bg-gray-700 p-6 rounded w-80">
        <h3 className="text-xl mb-4">Players</h3>
        {players.map((player, index) => (
          <div key={index} className="mb-2">
            {player.name}
          </div>
        ))}
      </div>

      {/* 🔥 START GAME BUTTON (HOST ONLY) */}
      {localStorage.getItem("isHost") === "true" && (
        <button
          onClick={handleStartGame}
          className="mt-6 bg-green-600 px-6 py-2 rounded"
        >
          Start Game
        </button>
      )}
    </div>
  );
}

export default Lobby;
