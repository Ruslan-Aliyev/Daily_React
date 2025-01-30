import { useEffect } from "react";
import {
  DailyProvider,
  useCallFrame,
  useDaily,
} from "@daily-co/daily-react";

export default function Prebuild() {
  const callFrame = useCallFrame({ // https://docs.daily.co/reference/daily-react/use-call-frame
    options: {
      url: "https://ruslanaliyev.daily.co/ruslanaliyev_room1",
      iframeStyle: {
        width: "100%",
        height: "80vh",
      },
    },
  });

  useEffect(() => {
    if (!callFrame) return;
    
    callFrame?.join().catch((err) => {
      console.error("Error joining call", err);
    });
  }, [callFrame]);

  return (
    <DailyProvider callObject={callFrame}>

    </DailyProvider>
  );
};
