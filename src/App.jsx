import { useCallback } from "react";
import {
  DailyEventObject,
  DailyEventObjectParticipant,
} from "@daily-co/daily-js";
import {
  DailyAudio,
  DailyVideo,
  useDaily,
  useDailyEvent,
  useMeetingState,
  useParticipantCounts,
  useParticipantIds,
  useScreenShare,
} from "@daily-co/daily-react";

export default function App() {
  const callObject = useDaily();

  const logEvent = useCallback((evt) => {
    if ("action" in evt) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      console.log(`logEvent: ${evt.action}`, evt);
    } else {
      console.log("logEvent:", evt);
    }
  }, []);

  const { screens } = useScreenShare();

  const participantIds = useParticipantIds({
    onParticipantJoined: useCallback(
      (ev) => {
        logEvent(ev);

        if (!callObject) return;

        callObject.updateParticipant(ev.participant.session_id, {
          setSubscribedTracks: {
            audio: true,
            video: true,
            custom: true,
            screenAudio: true,
            screenVideo: true,
          },
        });
      },
      [callObject, logEvent]
    ),
    onParticipantLeft: logEvent,
    onParticipantUpdated: logEvent,
    onActiveSpeakerChange: logEvent,
  });

  useDailyEvent("left-meeting", logEvent);

  const joinRoom = useCallback(() => {
    if (!callObject) {
      return;
    }

    callObject
      .join({
        url: "https://ruslanaliyev.daily.co/ruslanaliyev_room1",
      })
      .catch((err) => {
        console.error("Error joining room:", err);
      });
    console.log("joined!");
  }, [callObject]);

  const leaveRoom = useCallback(() => {
    if (!callObject) {
      return;
    }
    callObject.leave().catch((err) => {
      console.error("Error leaving room:", err);
    });
  }, [callObject]);

  const { hidden, present } = useParticipantCounts({
    onParticipantCountsUpdated: logEvent,
  });

  const participantCounts = hidden + present;
  const meetingState = useMeetingState();

  return (
    <>
      <div className="App">
        <button onClick={joinRoom}>
          Join call
        </button>
        <br />
        <button onClick={leaveRoom}>Leave call</button>
      </div>
      {participantIds.map((id) => (
        <DailyVideo type="video" key={id} automirror sessionId={id} />
      ))}
      {screens.map((screen) => (
        <DailyVideo
          type="screenVideo"
          key={screen.screenId}
          automirror
          sessionId={screen.session_id}
        />
      ))}
      <DailyAudio />
      <div id="meetingState">Meeting State: {meetingState}</div>
      <div id="participantCount">Total Participants: {participantCounts}</div>
    </>
  );
}
