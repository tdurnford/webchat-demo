import  { useEffect, useMemo, useRef, useState } from "react";

import ReactWebChat, { createDirectLine } from 'botframework-webchat';

function App() {
  const [token, setToken] = useState<string | undefined>();
  const directLine = useMemo(() => createDirectLine({ token }), [token]);

  const abortSignal = useRef(new AbortController()).current;

  useEffect(() => {
    (async () => {
      if (!abortSignal.signal.aborted) {
        const res = await fetch('https://webchat-mockbot.azurewebsites.net/directline/token', { method: 'POST' });
        const { token } = await res.json();
        setToken(token)
      }
    })();

    return () => {
      abortSignal.abort();
    }
   // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [])


  return (
    <div className="webchat_demo__container">
      <ReactWebChat directLine={directLine} />
    </div>
  );
}

export default App;
