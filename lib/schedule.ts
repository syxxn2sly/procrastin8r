import type { CustomBlock, Energy, ScheduleBlock, WorkoutState } from "@/lib/types";
import type { AnchorTimes } from "@/lib/types";

const workoutName = (energy: Energy | null) =>
  energy === "low" ? "20-min walk" : energy === "high" ? "Push day + extras · 50 min" : "Push day · 40 min";

/**
 * The day is rebuilt from the anchors every time rather than stored as a list
 * of events. Move lunch and everything that keys off lunch moves with it —
 * which is the whole promise of "set the anchors once".
 *
 * Blocks marked `suggest` are proposals: they render dashed and do nothing
 * until the user accepts them. The app is allowed to have opinions; it is not
 * allowed to put things on your day without asking.
 */
export function buildSchedule(opts: {
  times: AnchorTimes;
  energy: Energy | null;
  workoutDone: WorkoutState;
  customBlocks: CustomBlock[];
  hiddenBlocks: Record<string, boolean>;
}): ScheduleBlock[] {
  const { times, energy, workoutDone, customBlocks, hiddenBlocks } = opts;

  const blocks: ScheduleBlock[] = [
    { id: "meds", min: times.meds, title: "Breakfast + meds", sub: "anchor · food before the pill", icon: "pill", kind: "anchor" },
    { id: "lecture", min: 540, title: "BIO 201 · lecture", sub: "from your school calendar", icon: "graduation-cap", kind: "school", tag: "imported" },
    { id: "deep", min: 630, title: "Deep work · the big one", sub: "meds peak 10–1 — the hard task fits here", icon: "brain", kind: "work", suggest: true, isNow: true },
    { id: "break", min: 690, title: "Water + move for 5", sub: "break, not a reward", icon: "drop", kind: "care" },
    { id: "light", min: 720, title: "Small stuff · quick wins", sub: "two quick wins before lunch", icon: "list-checks", kind: "work", suggest: true },
    { id: "lunch", min: times.lunch, title: "Lunch", sub: "anchor · safe-food list is loaded", icon: "bowl-food", kind: "anchor" },
    { id: "study", min: 930, title: "Study group · library", sub: "you added this", icon: "books", kind: "school", tag: "yours", removable: true },
    { id: "gym", min: times.gym, title: workoutName(energy), sub: "fits today's battery · 10-min version still counts", icon: "barbell", kind: "work", suggest: true, done: workoutDone !== null },
    { id: "dinner", min: 1140, title: "Dinner", sub: "food · one-tap log", icon: "fork-knife", kind: "care" },
    { id: "wind", min: times.wind, title: "Wind-down", sub: "anchor · screens dim, tomorrow's Next 3 gets set", icon: "moon-stars", kind: "anchor" },
    ...customBlocks.map((c) => ({ ...c, tag: "yours", removable: true })),
  ];

  return blocks.filter((b) => !hiddenBlocks[b.id]).sort((a, b) => a.min - b.min);
}
