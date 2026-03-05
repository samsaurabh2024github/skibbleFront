import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "../socket";

const avatars = ["😀", "😎", "🤖", "👽", "🐵", "🐱", "🐸"];

function Home() {
  const [name, setName] = useState("");
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [language, setLanguage] = useState("English");
  const [darkMode, setDarkMode] = useState(true);
  const [slideIndex, setSlideIndex] = useState(0);

  const navigate = useNavigate();

  // ✅ YOUR ORIGINAL LOGIC KEPT SAME
  const handleCreate = () => {
    if (!name) return alert("Enter your name");

    localStorage.setItem("playerName", name);
    localStorage.setItem("isHost", "true");
    localStorage.setItem("avatar", avatars[avatarIndex]);
    localStorage.setItem("language", language);

    socket.emit("create_room", {
      hostName: name,
      avatar: avatars[avatarIndex],
      language: language,
      settings: {
        maxPlayers: 8,
        rounds: 3,
        drawTime: 60,
        wordCount: 1,
      },
    });
  };

  // ✅ YOUR ORIGINAL SOCKET LISTENER
  useEffect(() => {
    socket.on("room_created", (room) => {
      navigate(`/lobby/${room.roomId}`);
    });

    return () => {
      socket.off("room_created");
    };
  }, [navigate]);

  const nextAvatar = () => {
    setAvatarIndex((prev) => (prev + 1) % avatars.length);
  };

  const prevAvatar = () => {
    setAvatarIndex((prev) =>
      prev === 0 ? avatars.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-blue-700 flex flex-col items-center justify-center text-white relative overflow-hidden">

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/doodles.png')]"></div>

      {/* Logo */}
      <h1 className="text-6xl font-extrabold mb-8 tracking-wider z-10">
        skribbl<span className="text-yellow-400">.io</span>
      </h1>

      {/* Main Card */}
      <div className="bg-blue-900 z-10 p-8 rounded-xl shadow-2xl w-96 text-center transition transform hover:scale-105">

        {/* Name + Language */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Your Name"
            className="flex-1 px-3 py-2 rounded text-black"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <select
            className="px-2 py-2 rounded text-black"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Spanish</option>
          </select>
        </div>

        {/* Avatar Selector */}
        <div className="flex items-center justify-center mb-6 gap-4">
          <button
            onClick={prevAvatar}
            className="text-2xl bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            ◀
          </button>

          <div className="text-6xl bg-blue-800 w-24 h-24 flex items-center justify-center rounded-full shadow-inner">
            {avatars[avatarIndex]}
          </div>

          <button
            onClick={nextAvatar}
            className="text-2xl bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            ▶
          </button>
        </div>

        {/* Play Button */}
        <button
          onClick={handleCreate}
          className="w-full bg-green-500 hover:bg-green-600 py-3 rounded text-lg font-bold transition"
        >
          Play!
        </button>
      </div>

      {/* Bottom Section */}
      <div
        className={`w-full mt-24 py-20 transition-all duration-500 ${
          darkMode ? "bg-blue-800 text-white" : "bg-gray-100 text-black"
        }`}
      >

        {/* Dark Mode Toggle */}
        <div className="text-center mb-10">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-7">

          {/* About */}
          <div className="p-6 rounded-xl shadow-xl bg-blue-900 bg-opacity-40">
            <h2 className="text-2xl font-bold mb-4">❓ About</h2>
            <p className="text-sm leading-relaxed">
              A multiplayer drawing & guessing game.
              One player draws while others guess.
              <br /><br />
              Win by scoring the highest points!
            </p>
          </div>

          {/* News */}
          <div className="p-6 rounded-xl shadow-xl bg-blue-900 bg-opacity-40">
            <h2 className="text-2xl font-bold mb-4">📰 News</h2>
            <div className="space-y-2 text-sm">
              <p>✔️ Real-time multiplayer enabled</p>
              <p>✔️ Smooth drawing engine</p>
              <p>✔️ Guess & score system</p>
              <p>✔️ Improved mobile support</p>
              <p>✔️ Player moderation tools</p>
              <p>✔️ Increased custom room size</p>
            </div>
          </div>

          {/* How To Play */}
          <div className="p-6 rounded-xl shadow-xl bg-blue-900 bg-opacity-40 text-center">
            <h2 className="text-2xl font-bold mb-4">✏️ How to Play</h2>

            <div className="transition-all duration-500 text-lg min-h-[120px] flex items-center justify-center">
              {slideIndex === 0 && <div>🎨 Draw your chosen word</div>}
              {slideIndex === 1 && <div>✏️ Others guess quickly</div>}
              {slideIndex === 2 && <div>🏆 Highest score wins!</div>}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  onClick={() => setSlideIndex(i)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${
                    slideIndex === i ? "bg-white" : "bg-gray-400"
                  }`}
                ></span>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-sm opacity-70">
          Contact • Terms • Credits • Privacy
        </div>
      </div>
    </div>
  );
}

export default Home;