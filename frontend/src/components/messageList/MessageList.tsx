import React from 'react';
import './style.css';
import IMessage from '../../interfaces/IMessage';
import Message from '../message/Message';

interface MessageListProps {
  messages: IMessage[];
}

function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list-container">
      {messages.map((message, index) => (
        <Message key={index} message={message} />
      ))}
    </div>
  );
}

export default MessageList;
