import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io(
  import.meta.env.PROD
    ? 'https://livechatapp-socketio.onrender.com'
    : 'http://localhost:3000'
);

function App() {
  const [chatActive, setChatActive] = useState(false);
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    socket.on('received-messages', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('received-messages');
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      alert('Message cannot be empty');
      return;
    }

    const messageData = {
      message: newMessage,
      user: username,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    socket.emit('send-message', messageData);
    setNewMessage('');
  };

  return (
    <div className="w-screen h-screen bg-gray-900 text-white flex flex-col justify-center items-center">
      {chatActive ? (
        <div className="w-full max-w-2xl h-full flex flex-col">
          <div className="bg-gray-800 rounded-t-md p-4">
            <h1 className="text-xl font-semibold">My Chat</h1>
          </div>

          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  username === message.user ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {username !== message.user && (
                    <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center font-bold">
                      {message.user.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div
                    className={`bg-blue-700 p-3 rounded-lg max-w-xs ${
                      username === message.user ? 'bg-green-600' : ''
                    }`}
                  >
                    <span className="block font-semibold">{message.user}</span>
                    <p>{message.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{message.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <form
            className="p-4 bg-gray-800 rounded-b-md flex"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow border-2 rounded-md outline-none px-3 py-2 bg-gray-700 text-white"
              onChange={(e) => setNewMessage(e.target.value)}
              value={newMessage}
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md font-bold ml-3"
            >
              SEND
            </button>
          </form>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center">
          <input
            type="text"
            placeholder="Enter your username"
            className="border-2 rounded-md px-4 py-2 bg-gray-700 text-white outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            type="button"
            className={`bg-blue-500 text-white px-4 py-2 rounded-md font-bold ${
              !username && 'opacity-50 cursor-not-allowed'
            }`}
            onClick={() => username && setChatActive(true)}
            disabled={!username}
          >
            Start Chat
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
