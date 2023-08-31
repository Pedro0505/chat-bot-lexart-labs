import React, { useContext, useState } from 'react';
import { RiSendPlane2Fill } from 'react-icons/ri';
import './style.css';
import { ChatContext } from '../../context/chatContext/ChatContext';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
}

function MessageInput({ onSendMessage }: MessageInputProps) {
  const [input, setInput] = useState('');
  const { submitBtnDisable, endChat, resetChat, handleEndChat } = useContext(ChatContext);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleSendMessage = () => {
    if (input.trim() !== '') {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="message-input-container">
      {endChat ? (
        <button
          className="message-input-reset-chat"
          onClick={() => {
            resetChat();
            handleEndChat(false);
          }}>
          Reset Chat
        </button>
      ) : (
        <div className="message-input-content">
          <input
            type="text"
            placeholder="Digite sua mensagem..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
          />
          {!submitBtnDisable && (
            <button onClick={handleSendMessage} className="message-input-send">
              <RiSendPlane2Fill />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default MessageInput;
