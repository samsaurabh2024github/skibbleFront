import React from 'react';

import socket from "../socket";

function PlayerList({ players, drawerId }) {
  // Sort players by score descending to keep it competitive
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-gray-800 rounded-lg p-4 h-auto lg:h-full shadow-lg border border-gray-700">
      <h3 className="text-xl font-bold mb-4 text-center border-b border-gray-600 pb-2">
        Leaderboard
      </h3>
      <div className="space-y-3">
        {sortedPlayers.map((player) => (
          <div 
            key={player.socketId} 
            className={`flex items-center justify-between p-2 rounded transition ${
              player.socketId === drawerId ? "bg-yellow-600/20 ring-1 ring-yellow-500" : "bg-gray-700"
            }`}
          >
           <div className="flex items-center justify-between p-2 rounded text-sm md:text-base">
              <span className="text-lg">{player.avatar || "👤"}</span>
              <span className={`font-medium ${player.socketId === drawerId ? "text-yellow-400" : "text-white"}`}>
                {player.name} {player.socketId === socket.id && "(You)"}
              </span>
              {player.socketId === drawerId && <span title="Drawing now">✏️</span>}
            </div>
            <div className="text-green-400 font-bold">
              {player.score} pts
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlayerList;