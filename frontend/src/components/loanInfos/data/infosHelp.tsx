import React from 'react';

const infosHelps: Record<string, JSX.Element | string> = {
  want: (
    <>
      <a
        className="loan-infos-helpers-link"
        href="https://www.investopedia.com/articles/personal-finance/010516/how-apply-personal-loan.asp"
        target="_blank"
        rel="noreferrer">
        How Apply Personal Loan
      </a>
      <a
        className="loan-infos-helpers-link"
        href="https://www.experian.com/blogs/ask-experian/if-you-apply-for-a-personal-loan-do-you-have-to-take-it/"
        target="_blank"
        rel="noreferrer">
        Hif You Apply For A Personal Loan Do You Have To Take It
      </a>
      <a
        className="loan-infos-helpers-link"
        href="https://www.forbes.com/advisor/personal-loans/personal-loan-requirements/"
        target="_blank"
        rel="noreferrer">
        Personal Loan Requirements
      </a>
    </>
  ),
  conditions: (
    <>
      <a
        href="https://www.forbes.com/advisor/loans/what-are-loan-terms/"
        target="_blank"
        rel="noreferrer"
        className="loan-infos-helpers-link">
        What Are Loan Terms
      </a>
      <a
        href="https://www.debt.org/credit/loans/contracts/"
        target="_blank"
        rel="noreferrer"
        className="loan-infos-helpers-link">
        What Is a Loan Agreement
      </a>
    </>
  ),
  help: (
    <a href="https://en.wikipedia.org/wiki/Loan" target="_blank" rel="noreferrer" className="loan-infos-helpers-link">
      What Is Loan?
    </a>
  ),
};

export default infosHelps;
