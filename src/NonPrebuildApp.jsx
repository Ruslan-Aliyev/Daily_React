import { useEffect, useCallback } from "react";
import {
  DailyAudio,
  DailyVideo,

  // Both below are ok
  useDaily, // WORKS ONLY INSIDE <DailyProvider>
  // useCallObject,

  // useDailyEvent, // TypeScript Only
  useMeetingState,
  useParticipantCounts,
  useParticipantIds,
  useScreenShare,
} from "@daily-co/daily-react";

export default function NonPrebuildApp() {
  const callObject = useDaily();

  const logEvent = useCallback((evt) => {
    if ("action" in evt) {
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

  // useDailyEvent("left-meeting", logEvent); // TypeScript Only


  // QUESTION: WHY THIS DONT WORK? WHY callObject have no '.on'? 
  // Ref: https://docs.daily.co/reference/rn-daily-js/events/participant-events#participant-left
  // Ref: https://docs.daily.co/reference/rn-daily-js/events/meeting-events#error

  // callObject  
  //   .on('participant-left', (event) => {
  //     console.log('participant-left event: ', event);
  //   })
  //   .on('error', (event) => {
  //     console.log('error event: ', event);
  //   });

  const joinRoom = useCallback(() => {
    if (!callObject) {
      return;
    }

    callObject
      .join({
        url: "https://ruslanaliyev.daily.co/ruslanaliyev_room1",
        startVideoOff: true,
      })
      .catch((err) => {
        console.error("Error joining room:", err);
      });
    console.log("joined!");
  }, [callObject]);

  const leaveRoom = useCallback(async () => {
    if (!callObject) {
      return;
    }

    try {
      await callObject.leave();
      await callObject.destroy();
    } catch(error) {
      console.error("Error leaving room:", error);
    };
  }, [callObject]);

  const { hidden, present } = useParticipantCounts({
    onParticipantCountsUpdated: logEvent,
  });

  const participantCounts = hidden + present;
  const meetingState = useMeetingState();

  // QUESTION: WHY MUTING DONT ACTUALLY WORK?
  // Ref: https://docs.daily.co/reference/rn-daily-js/instance-methods/set-local-audio
  const mute = useCallback(async () => {
    if (!callObject) {
      return;
    }
    callObject.setLocalAudio(true);
  });
  const unmute = useCallback(async () => {
    if (!callObject) {
      return;
    }
    callObject.setLocalAudio(false);
  });

  // Ref: https://docs.daily.co/reference/rn-daily-js/instance-methods/set-local-video
  const videoOn = useCallback(async () => {
    if (!callObject) {
      return;
    }
    callObject.setLocalVideo(true);
  });
  const videoOff = useCallback(async () => {
    if (!callObject) {
      return;
    }
    callObject.setLocalVideo(false);
  });

  return (
    <>
      <div>
        <button onClick={joinRoom}>Join call</button>
        <br />
        <button onClick={leaveRoom}>Leave call</button>
      </div>

      <div>
        <button onClick={videoOn}>Video on</button>
        <br />
        <button onClick={videoOff}>Video off</button>
      </div>

      <div>
        <button onClick={mute}>Mute Mic</button>
        <br />
        <button onClick={unmute}>Unmute Mic</button>
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
