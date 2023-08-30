import { useEffect } from 'react';

function useDocumentTitle(title: string, prevailOnUnmount = false) {
  useEffect(() => {
    console.log('montou');
    document.title = title;
  }, [title]);
}

export default useDocumentTitle;
