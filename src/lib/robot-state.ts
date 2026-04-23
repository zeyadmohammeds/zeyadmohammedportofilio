export type RobotAction =
  | "Dance"
  | "Death"
  | "Idle"
  | "Jump"
  | "No"
  | "Punch"
  | "Running"
  | "Sitting"
  | "Standing"
  | "ThumbsUp"
  | "Walking"
  | "WalkJump"
  | "Wave"
  | "Yes";

export type RobotIntent =
  | "success"
  | "error"
  | "wrong"
  | "intro"
  | "online"
  | "offline"
  | "navigate"
  | "standing"
  | "idle";

export function emitRobotAction(action: RobotAction) {
  window.dispatchEvent(new CustomEvent<RobotAction>("robot:action", { detail: action }));
}

export function emitRobotSequence(actions: RobotAction[], stepMs = 900) {
  actions.forEach((action, index) => {
    window.setTimeout(() => emitRobotAction(action), index * stepMs);
  });
}

export function emitRobotIntent(intent: RobotIntent) {
  const map: Record<RobotIntent, RobotAction> = {
    success: "Yes",
    error: "Death",
    wrong: "No",
    intro: "Wave",
    online: "ThumbsUp",
    offline: "Death",
    navigate: "Walking",
    standing: "Standing",
    idle: "Idle",
  };
  emitRobotAction(map[intent]);

  // Add expressive combo behavior for richer reactions.
  if (intent === "success") {
    emitRobotSequence(["ThumbsUp", "Yes", "Idle"], 800);
  }
  if (intent === "error" || intent === "offline") {
    emitRobotSequence(["No", "Death"], 700);
  }
  if (intent === "online") {
    emitRobotSequence(["Standing", "ThumbsUp", "Idle"], 800);
  }
}
