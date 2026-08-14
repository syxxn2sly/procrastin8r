export type Mode = "regular" | "blunt" | "cant";
export type Energy = "low" | "mid" | "high";

/** null = nothing logged yet. "skipped" is a logged choice, not an absence. */
export type FoodState = null | "ate" | "well" | "skipped";

/** null = not done. "mini" is the 10-minute version, which counts fully. */
export type WorkoutState = null | "full" | "mini";

export type Task = {
  id: string;
  title: string;
  meta: string;
  done: boolean;
};

/**
 * Anchors carry no stored label — it is derived from the times so that moving
 * wind-down to 11 doesn't leave a card still reading "wind-down at 10".
 */
export type Anchor = {
  id: "wake" | "lunch" | "wind";
  /** Phosphor icon name, resolved through components/icon.tsx. */
  icon: string;
  done: boolean;
};

export type Meal = {
  id: string;
  name: string;
  cal: number;
  pro: number;
  /** Formatted clock time, e.g. "1:15p". */
  at: string;
};

/** The five movable points the rest of the day is laid out around. */
export type AnchorTimes = {
  meds: number;
  lunch: number;
  gym: number;
  wind: number;
};

export type WorkoutTemplate = {
  id: string;
  name: string;
  icon: string;
  sub: string;
  /** [id, display name, default detail line] */
  ex: [string, string, string][];
};

export type CustomBlock = {
  id: string;
  min: number;
  title: string;
  sub: string;
  icon: string;
  kind: BlockKind;
};

export type BlockKind = "anchor" | "school" | "work" | "care";

export type ScheduleBlock = {
  id: string;
  min: number;
  title: string;
  sub: string;
  icon: string;
  kind: BlockKind;
  /** Suggestions render dashed and do nothing until accepted. */
  suggest?: boolean;
  isNow?: boolean;
  tag?: string;
  removable?: boolean;
  done?: boolean;
};

export type WeekDay = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

/** null on a day means rest, which is a plan rather than a gap. */
export type WeekPlan = Record<WeekDay, string | null>;

export type Triage = "q1" | "q2" | "done";
