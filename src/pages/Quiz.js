import React, { useState, useEffect, useRef } from 'react';
import "../styles/Quiz.css";

const Quiz = () => {
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);

  useEffect(() => {
    if (joined) {
      const socket = new WebSocket("ws://localhost:8765"); // 배포 시 공인 IP로 변경
      socketRef.current = socket;

      socket.onopen = () => {
        console.log("WebSocket 연결됨");
      };

      socket.onmessage = (event) => {
        const msg = event.data;
        setMessages((prev) => [...prev, { sender: "server", name: "서버", text: msg }]);
      };

      socket.onclose = () => {
        console.log("WebSocket 연결 종료");
      };

      return () => socket.close();
    }
  }, [joined]);

  const handleJoin = () => {
    if (name.trim() !== "") {
      setJoined(true);
    } else {
      alert("닉네임을 입력해주세요");
    }
  };

  const handleSubmit = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, { sender: "me", name: name, text: input }]);
    socketRef.current?.send(input);
    setInput("");
  };

  return (
    <div className="container">
      <h1 className="header">퀴즈게임</h1>
      <div className="section1">
        {!joined && (
          <>
            <div>닉네임을 입력해주세요</div>
            <div className="input-section">
              <input
                className="inputbox"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <br />
              <button className="entrybutton" onClick={handleJoin}>
                입장하기
              </button>
            </div>
          </>
        )}

        {joined && <div>현재 접속자: {name}</div>}
      </div>

      <div className="section">
        <div className="quiz-section">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble ${msg.sender}`}>
              <div className="chat-name">{msg.name}</div>
              <div>{msg.text}</div>
            </div>
          ))}
        </div>
        {joined && (
          <div className="input-section">
            <input
              className="inputbox"
              value={input}
              type="text"
              placeholder="정답을 입력하세요"
              onChange={(e) => setInput(e.target.value)}
            />
            <button className="submitbox" onClick={handleSubmit}>
              제출
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
