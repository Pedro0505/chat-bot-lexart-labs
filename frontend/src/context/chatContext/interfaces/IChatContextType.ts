import IMessage from '../../../interfaces/IMessage';

interface IChatContextType {
  messages: IMessage[];
  addMessage: (message: IMessage) => void;
  submitBtnDisable: boolean;
  handleSubmitBtnDisable: (isDisable: boolean) => void;
  loginSuccessfully: boolean;
  handleLoginSuccessfully: (isDisable: boolean) => void;
  endChat: boolean;
  handleEndChat: (isDisable: boolean) => void;
  resetChat: () => void;
}

export default IChatContextType;
