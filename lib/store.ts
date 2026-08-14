import AsyncStorage from "@react-native-async-storage/async-storage";
import createContextHook from "@nkzw/create-context-hook";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type {
  Anchor,
  AnchorTimes,
  CustomBlock,
  Energy,
  FoodState,
  Meal,
  Mode,
  Task,
  WeekPlan,
  WorkoutState,
  WorkoutTemplate,
} from "@/lib/types";
import type { ThemeName } from "@/constants/theme";

const STORAGE_KEY = "procrastin8r.state.v1";

/** Minutes past midnight — the unit every schedule time is stored in. */
const MIN = { meds: 510, lunch: 780, gym: 1050, wind: 1320 };

export type Nudge = {
  text: string;
  doLabel: string;
  /** Which fix the "do it" button applies. */
  kind: "water" | "food";
};

type State = {
  /** Which day the daily counters belong to, as YYYY-MM-DD in local time. */
  dayKey: string;
  mode: Mode | null;
  energy: Energy | null;
  tasks: Task[];
  anchors: Anchor[];
  inbox: string[];
  water: number;
  food: FoodState;
  meals: Meal[];
  workoutDone: WorkoutState;
  crisisAte: boolean;
  crisisAnchorDone: boolean;
  schedDone: Record<string, boolean>;
  /** Suggestion blocks the user has explicitly pulled into the day. */
  accepted: Record<string, boolean>;
  hiddenBlocks: Record<string, boolean>;
  customBlocks: CustomBlock[];
  times: AnchorTimes;
  autoGym: boolean;
  weekPlan: WeekPlan;
  wTemplate: string;
  wSets: Record<string, number>;
  customTpls: WorkoutTemplate[];
  exDetails: Record<string, string>;
  theme: ThemeName;
  focusTotalMin: number;
};

const seedTasks: Task[] = [
  { id: "t1", title: "Email the landlord back", meta: "5 min · due today", done: false },
  { id: "t2", title: "Book the dentist", meta: "10 min · phone call", done: false },
  { id: "t3", title: "Draft the report intro", meta: "25 min · big one", done: false },
];

const seedAnchors: Anchor[] = [
  { id: "a1", label: "Up by 9", icon: "sun-horizon", done: false },
  { id: "a2", label: "Eat lunch", icon: "bowl-food", done: false },
  { id: "a3", label: "Wind-down at 10", icon: "moon-stars", done: false },
];

const todayKey = () => {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const initial: State = {
  dayKey: todayKey(),
  mode: null,
  energy: null,
  tasks: seedTasks,
  anchors: seedAnchors,
  inbox: ["renew library card"],
  water: 0,
  food: null,
  meals: [],
  workoutDone: null,
  crisisAte: false,
  crisisAnchorDone: false,
  schedDone: { meds: true },
  accepted: {},
  hiddenBlocks: {},
  customBlocks: [],
  times: MIN,
  autoGym: true,
  weekPlan: { mon: "push", tue: null, wed: "legs", thu: null, fri: "push", sat: "walk", sun: null },
  wTemplate: "push",
  wSets: { bench: 3, ohp: 3, dips: 2, squat: 3, rdl: 3, lunge: 2, walk: 1 },
  customTpls: [],
  exDetails: {},
  theme: "dark",
  focusTotalMin: 25,
};

/**
 * A new day clears what the day accumulated and asks the check-in question
 * again, but keeps the setup the user has invested in: task list (minus what
 * they finished), anchor times, templates, week plan, theme.
 */
const rollDay = (s: State): State => ({
  ...s,
  dayKey: todayKey(),
  mode: null,
  energy: null,
  tasks: s.tasks.filter((t) => !t.done),
  anchors: s.anchors.map((a) => ({ ...a, done: false })),
  water: 0,
  food: null,
  meals: [],
  workoutDone: null,
  crisisAte: false,
  crisisAnchorDone: false,
  schedDone: {},
  accepted: {},
});

export const fmtTime = (m: number) => {
  const h = Math.floor(m / 60);
  const mm = m % 60;
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${String(mm).padStart(2, "0")}${h < 12 ? "a" : "p"}`;
};

export const nowStr = () => {
  const d = new Date();
  return fmtTime(d.getHours() * 60 + d.getMinutes());
};

const wins = [
  "Logged. That's momentum.",
  "Done is done.",
  "One less thing.",
  "That counts. All of it.",
  "Look at you, deciding things.",
];

export const splitSteps = [
  "First step: open it. That's the whole task now.",
  "First step: 3 minutes, then you're allowed to stop.",
  "First step: write one bad sentence.",
];

export const [StoreProvider, useStore] = createContextHook(() => {
  const [state, setState] = useState<State>(initial);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [nudge, setNudge] = useState<Nudge | null>(null);
  const [prevTasks, setPrevTasks] = useState<Task[] | null>(null);

  const toastT = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nudgeLevel = useRef(0);
  const snoozedAt = useRef(0);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) {
          const saved = { ...initial, ...(JSON.parse(raw) as Partial<State>) };
          setState(saved.dayKey === todayKey() ? saved : rollDay(saved));
        }
      } catch {
        // A corrupt or unreadable blob is not worth blocking the app over —
        // the seed state is a perfectly good place to start.
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, hydrated]);

  const update = useCallback((patch: Partial<State> | ((s: State) => Partial<State>)) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const cheer = useCallback((msg?: string) => {
    setToast(msg ?? wins[Math.floor(Math.random() * wins.length)]);
    if (toastT.current) clearTimeout(toastT.current);
    toastT.current = setTimeout(() => setToast(null), 2400);
  }, []);

  useEffect(() => () => {
    if (toastT.current) clearTimeout(toastT.current);
  }, []);

  /**
   * The nudge escalates over three messages and then goes quiet, which is the
   * whole point — an app that nags forever gets uninstalled or ignored, and
   * both failures cost the user the thing they installed it for.
   */
  const armNudge = useCallback(() => {
    if (nudge) return;
    if (Date.now() - snoozedAt.current < 30_000) return;
    const lvl = Math.min(nudgeLevel.current, 2);
    if (state.water === 0) {
      setNudge({
        text: [
          "water's at zero. bottle. now-ish.",
          "still zero water. this is the follow-up.",
          "third ask: drink water. i'll stop after this one.",
        ][lvl],
        doLabel: "logged +1",
        kind: "water",
      });
      nudgeLevel.current += 1;
    } else if (state.food === null) {
      setNudge({
        text: [
          "nothing eaten yet. anything counts.",
          "second nudge: eat literally anything.",
          "last one: food. then i'm quiet.",
        ][lvl],
        doLabel: "ate something",
        kind: "food",
      });
      nudgeLevel.current += 1;
    }
  }, [nudge, state.water, state.food]);

  const dismissNudge = useCallback((snooze: boolean) => {
    if (snooze) snoozedAt.current = Date.now();
    setNudge(null);
  }, []);

  const applyNudge = useCallback(() => {
    if (!nudge) return;
    if (nudge.kind === "water") update((s) => ({ water: s.water + 1 }));
    else update({ food: "ate" });
    nudgeLevel.current = 0;
    setNudge(null);
  }, [nudge, update]);

  // ── tasks ───────────────────────────────────────────────────────────────

  const toggleTask = useCallback(
    (id: string) => {
      setPrevTasks(state.tasks);
      const was = state.tasks.find((t) => t.id === id)?.done;
      update({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)) });
      if (!was) cheer();
    },
    [state.tasks, update, cheer],
  );

  const eraseTask = useCallback(
    (id: string) => {
      setPrevTasks(state.tasks);
      update({ tasks: state.tasks.filter((t) => t.id !== id) });
      cheer("Erased. Undo is right there if you change your mind.");
    },
    [state.tasks, update, cheer],
  );

  const bumpTask = useCallback(
    (id: string) => {
      const i = state.tasks.findIndex((t) => t.id === id);
      if (i <= 0) return;
      const arr = [...state.tasks];
      [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
      update({ tasks: arr });
    },
    [state.tasks, update],
  );

  const splitTask = useCallback(
    (id: string) => {
      const step = splitSteps[Math.floor(Math.random() * splitSteps.length)];
      update({ tasks: state.tasks.map((t) => (t.id === id ? { ...t, meta: step } : t)) });
      cheer("Shrunk it. The first step is the task now.");
    },
    [state.tasks, update, cheer],
  );

  const addTask = useCallback(
    (title: string, meta = "added by you") => {
      const clean = title.trim();
      if (!clean) return;
      setPrevTasks(state.tasks);
      update({
        tasks: [...state.tasks, { id: `t${Date.now()}`, title: clean, meta, done: false }],
      });
      cheer("On the list. It'll surface when it's time.");
    },
    [state.tasks, update, cheer],
  );

  const undoTasks = useCallback(() => {
    if (!prevTasks) return;
    update({ tasks: prevTasks });
    setPrevTasks(null);
  }, [prevTasks, update]);

  const completeTask = useCallback(
    (id: string) => update((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? { ...t, done: true } : t)) })),
    [update],
  );

  // ── anchors, food, water, movement ──────────────────────────────────────

  const toggleAnchor = useCallback(
    (id: string) => {
      const was = state.anchors.find((a) => a.id === id)?.done;
      update({ anchors: state.anchors.map((a) => (a.id === id ? { ...a, done: !a.done } : a)) });
      if (!was) cheer("Anchor held. That's the backbone.");
    },
    [state.anchors, update, cheer],
  );

  const logFood = useCallback(
    (v: FoodState) => {
      update({ food: v });
      if (v === "ate") cheer("Fed. Brain works better now.");
      else if (v === "well") cheer("Fed, and well. Fancy.");
    },
    [update, cheer],
  );

  const addMeal = useCallback(
    (name: string, cal: number, pro: number, msg?: string) => {
      update((s) => ({
        meals: [...s.meals, { id: `m${Date.now()}`, name, cal, pro, at: nowStr() }],
        food: s.food === null || s.food === "skipped" ? "ate" : s.food,
      }));
      cheer(msg ?? "Counted. That's all the math you owe today.");
    },
    [update, cheer],
  );

  const removeMeal = useCallback(
    (id: string) =>
      update((s) => {
        const meals = s.meals.filter((m) => m.id !== id);
        return { meals, food: meals.length ? s.food : null };
      }),
    [update],
  );

  const addWater = useCallback(() => {
    update((s) => ({ water: s.water + 1 }));
    if (state.water === 0) cheer("First water of the day. Counts.");
  }, [state.water, update, cheer]);

  const removeWater = useCallback(
    () => update((s) => ({ water: Math.max(0, s.water - 1) })),
    [update],
  );

  const logWorkout = useCallback(
    (v: WorkoutState, msg?: string) => {
      update({ workoutDone: v });
      if (v) cheer(msg ?? "Workout logged. No details needed.");
    },
    [update, cheer],
  );

  // ── capture inbox ───────────────────────────────────────────────────────

  const toInbox = useCallback(
    (text: string) => {
      const clean = text.trim();
      if (!clean) return;
      update((s) => ({ inbox: [...s.inbox, clean] }));
      cheer("Dumped to inbox. Back to the task.");
    },
    [update, cheer],
  );

  /**
   * Triage is two questions on purpose. "Due soon" plus "what happens if you
   * skip it" is enough to sort today from later, and a third question is where
   * people quit and the inbox becomes a graveyard.
   */
  const fileCapture = useCallback(
    (title: string, dueSoon: boolean, severity: "shrug" | "bad" | "verybad") => {
      const today = dueSoon || severity === "verybad";
      if (today) addTask(title, "new · auto-triaged");
      else update((s) => ({ inbox: [...s.inbox, title] }));
      return today ? "today" : "later";
    },
    [addTask, update],
  );

  const value = useMemo(
    () => ({
      ...state,
      hydrated,
      toast,
      cheer,
      nudge,
      armNudge,
      dismissNudge,
      applyNudge,
      canUndo: prevTasks !== null,
      undoTasks,
      update,
      toggleTask,
      eraseTask,
      bumpTask,
      splitTask,
      addTask,
      completeTask,
      toggleAnchor,
      logFood,
      addMeal,
      removeMeal,
      addWater,
      removeWater,
      logWorkout,
      toInbox,
      fileCapture,
    }),
    [
      state, hydrated, toast, cheer, nudge, armNudge, dismissNudge, applyNudge,
      prevTasks, undoTasks, update, toggleTask, eraseTask, bumpTask, splitTask,
      addTask, completeTask, toggleAnchor, logFood, addMeal, removeMeal,
      addWater, removeWater, logWorkout, toInbox, fileCapture,
    ],
  );

  return value;
});

/**
 * The passive line at the top of Home. It states what the app can see and
 * never tells the user to do anything — every response to it is a tap the
 * user chooses. Order matters: food outranks water, water outranks the list.
 */
export const noticingLine = (food: FoodState, water: number, openTasks: number) => {
  if (food === "skipped") return "Skipped a meal — noted, no lecture. Next food window is ~2pm.";
  if (food === null) return "Nothing eaten since you woke up. Not a crisis. Just saying.";
  if (water === 0) return "Food's handled. Water is at zero, though. Bottle's right there.";
  if (openTasks === 0) return "List cleared. You're free. Go be a person.";
  return `Fed and watered. ${openTasks} left — the top one takes 5 minutes.`;
};
