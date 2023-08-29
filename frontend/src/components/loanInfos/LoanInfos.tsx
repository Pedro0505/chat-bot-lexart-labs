import React, { useContext } from 'react';
import { ChatContext } from '../../context/chatContext/ChatContext';
import infosHelps from './data/infosHelp';

function LoanInfos() {
  const { addMessage } = useContext(ChatContext);

  const handleInfos = (event: React.MouseEvent<HTMLButtonElement>) => {
    const message = infosHelps[event.currentTarget.name];

    addMessage({ sender: 'bot', text: message });
  };

  return (
    <div>
      <button name="want" onClick={handleInfos}>
        Do you want to apply for a loan?
      </button>
      <button name="conditions" onClick={handleInfos}>
        Loan conditions
      </button>
      <button name="help" onClick={handleInfos}>
        Help
      </button>
    </div>
  );
}

export default LoanInfos;
