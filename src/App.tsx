import { useEffect, useMemo, useRef, useState } from "react";

import ReactWebChat, { createDirectLine, createStore } from "botframework-webchat";

import elsa from "./images/elsa.png";

const styleOptions = {
  botAvatarInitials: "",
  botAvatarImage: elsa,
};

export const sendStartConversationMiddleware =
  ({ dispatch }: any) =>
  (next: any) =>
  (action: any) => {
    if (action.type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      dispatch({
        meta: {
          method: 'keyboard',
        },
        payload: {
          activity: {
            channelData: {
              postBack: true,
            },
            // Web Chat will show the 'Greeting' System Topic message which has a trigger-phrase 'hello'
            name: 'startConversation',
            type: 'event',
          },
        },
        type: 'DIRECT_LINE/POST_ACTIVITY',
      });
    }
    return next(action);
  };


function App() {
  const [token, setToken] = useState<string | undefined>();
  const directLine = useMemo(() => createDirectLine({ token }), [token]);
  const store = useMemo(() => createStore({}, sendStartConversationMiddleware), []);

  const abortSignal = useRef(new AbortController()).current;

  useEffect(() => {
    (async () => {
      if (!abortSignal.signal.aborted) {
        const res = await fetch(
          "https://default663d2642cdb541daaba3322403c6cb.a9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/Default_modernDating/directline/token?api-version=2022-03-01-preview",
          { method: "GET" }
        );
        const { token } = await res.json();
        setToken(token);
      }
    })();

    return () => {
      abortSignal.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="webchat_demo__container">
      <ReactWebChat directLine={directLine} store={store} styleOptions={styleOptions} />
    </div>
  );
}

export default App;
