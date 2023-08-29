interface IMessage {
  text: string | JSX.Element;
  sender: 'user' | 'bot';
}

export default IMessage;
