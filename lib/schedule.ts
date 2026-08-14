import { fmtTime } from "@/lib/store";
import type {
  AnchorTimes, CustomBlock, Energy, ScheduleBlock, Task, WorkoutState,
} from "@/lib/types";

const workoutName = (energy: Energy | null) =>
  energy === "low" ? "20-min walk" : energy === "high" ? "Push day + extras · 50 min" : "Push day · 40 min";

/** The one that reads as the hard task: flagged "big", else the longest title. */
function pickBig(open: Task[]): Task | null {
  if (!open.length) return null;
  const flagged = open.find((t) => t.meta.includes("big"));
  if (flagged) return flagged;
  return [...open].sort((a, b) => b.title.length - a.title.length)[0];
}

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/**
 * The day is rebuilt from the anchors every time rather than stored as a list
 * of events. Move lunch and everything that keys off lunch moves with it —
 * which is the whole promise of "set the anchors once".
 *
 * The work blocks are generated from the user's own Next 3, not from fixtures:
 * the hard task goes in the medication peak window and the quick ones stack up
 * before lunch. A schedule that names someone else's tasks is furniture.
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
  tasks: Task[];
  /** Minutes past midnight, for marking the block you are currently inside. */
  nowMin: number;
}): ScheduleBlock[] {
  const { times, energy, workoutDone, customBlocks, hiddenBlocks, tasks, nowMin } = opts;

  const open = tasks.filter((t) => !t.done);
  const big = pickBig(open);
  const quick = open.filter((t) => t.id !== big?.id).slice(0, 2);

  const peakStart = times.meds + 120;
  const peakEnd = times.meds + 300;

  const blocks: ScheduleBlock[] = [
    {
      id: "meds",
      min: times.meds,
      title: "Breakfast + meds",
      sub: "anchor · food before the pill",
      icon: "pill",
      kind: "anchor",
    },
    ...(big
      ? [
          {
            id: "deep",
            min: peakStart,
            title: `Deep work · ${lower(big.title)}`,
            sub: `meds peak ${fmtTime(peakStart)}–${fmtTime(peakEnd)} — the hard task fits here`,
            icon: "brain",
            kind: "work" as const,
            suggest: true,
          },
        ]
      : []),
    {
      id: "break",
      min: times.meds + 180,
      title: "Water + move for 5",
      sub: "break, not a reward",
      icon: "drop",
      kind: "care",
      tag: "hide",
      removable: true,
    },
    ...(quick.length
      ? [
          {
            id: "light",
            min: times.lunch - 60,
            title: `Small stuff · ${quick.map((t) => lower(t.title)).join(", ")}`,
            sub: `${quick.length === 1 ? "a quick win" : "two quick wins"} before lunch`,
            icon: "list-checks",
            kind: "work" as const,
            suggest: true,
          },
        ]
      : []),
    {
      id: "lunch",
      min: times.lunch,
      title: "Lunch",
      sub: "anchor · safe-food list is loaded",
      icon: "bowl-food",
      kind: "anchor",
    },
    {
      id: "gym",
      min: times.gym,
      title: workoutName(energy),
      sub: "fits today's battery · 10-min version still counts",
      icon: "barbell",
      kind: "work",
      suggest: true,
      done: workoutDone !== null,
    },
    {
      id: "dinner",
      min: times.wind - 180,
      title: "Dinner",
      sub: "food · one-tap log",
      icon: "fork-knife",
      kind: "care",
      tag: "hide",
      removable: true,
    },
    {
      id: "wind",
      min: times.wind,
      title: "Wind-down",
      sub: "anchor · screens dim, tomorrow's Next 3 gets set",
      icon: "moon-stars",
      kind: "anchor",
    },
    ...customBlocks.map((c) => ({ ...c, tag: "yours", removable: true })),
  ];

  const visible = blocks.filter((b) => !hiddenBlocks[b.id]).sort((a, b) => a.min - b.min);

  // "Now" is the last block you have already reached — the one you are inside,
  // not the next one coming up. Before the first block of the day, nothing is
  // marked rather than falsely pointing at breakfast.
  let nowId: string | null = null;
  for (const b of visible) {
    if (b.min <= nowMin) nowId = b.id;
    else break;
  }

  return visible.map((b) => (b.id === nowId ? { ...b, isNow: true } : b));
}

/** Where a newly added block lands: mid-afternoon, then nudge it from Edit day. */
export const defaultBlockTime = (times: AnchorTimes) => times.lunch + 120;
