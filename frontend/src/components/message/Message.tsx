import React from 'react';
import IMessage from '../../interfaces/IMessage';
import botPhoto from './assets/botPhoto.png';
import userPhoto from './assets/userPhoto.png';
import './style.css';

interface MessageProps {
  message: IMessage;
}

function Message({ message }: MessageProps) {
  return (
    <div className={`${message.sender === 'bot' ? 'bot' : 'user'}`}>
      <div className="message">
        {message.sender === 'bot' ? (
          <div className="text-message">{message.text}</div>
        ) : (
          <p className="text-message">{message.text}</p>
        )}
      </div>
      <img className="message-imgs" src={message.sender === 'bot' ? botPhoto : userPhoto} alt="Foto de perfil" />
    </div>
  );
}

export default Message;
