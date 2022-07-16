import React, { useState, useContext } from "react";
import axios from "axios";
import ReactAudioPlayer from "react-audio-player";

import { characterContext } from "../../contexts/CharacterContext";

export default function InputBox({
  textMode,
  setUserText,
  setBotText,
  setBotTyping,
  setUserTyping,
}) {
  const { character } = useContext(characterContext);
  const [message, setMessage] = useState("");
  const [audio, setAudio] = useState("");
  const [gender] = useState(character.gender);

  function handleSendMsg(event) {
    if (message) {
      event.preventDefault();
      setUserText(message);
      setMessage("");
      setUserTyping(false);
      setTimeout(() => setBotTyping(true), 300);

      // Send message to api
      return axios({
        method: "POST",
        url: "/api/openai/textToSpeech",
        data: JSON.stringify({ message, gender }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log("React render stage", res);
          setAudio(`/${res.data.audioID}.mp3`);
          setBotText(res.data.aiText);
          setBotTyping(false);
        })
        .catch((e) => {
          setBotTyping(false);
          setBotText("Sorry, something is wrong, pleaes try again later!");
          console.log(e.message);
        });
    }
  }

  function handleChange(event) {
    setUserText("");
    const input = event.target.value;
    setMessage(input);
    input ? setUserTyping(true) : setUserTyping(false);
  }

  return (
    <div className="input-box-container__text">
      <ReactAudioPlayer src={audio} autoPlay={true} />

      <div className="chat-bar">
        <form
          className="chat-bar__message"
          onSubmit={(event) => handleSendMsg(event)}
        >
          <input
            className="chat-bar__input"
            type="text"
            value={message}
            onChange={(event) => handleChange(event)}
            placeholder="Sent Message..."
          />
        </form>
        <div className="chat-bar__send" onClick={handleSendMsg}>
          <i className="material-icons">send</i>
        </div>
      </div>
    </div>
  );
}
