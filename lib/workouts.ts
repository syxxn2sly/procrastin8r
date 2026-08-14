import type { WorkoutTemplate } from "@/lib/types";

/**
 * The stock three. They are deliberately few — a template picker with fifteen
 * options is another decision to make on a day when deciding is the problem.
 * Users add their own from the log screen, capped at seven total.
 */
export const builtInTemplates: Record<string, WorkoutTemplate> = {
  push: {
    id: "push",
    name: "Push day",
    icon: "barbell",
    sub: "3 lifts · ~40 min",
    ex: [
      ["bench", "Bench press", "135 lb · last: 3×8"],
      ["ohp", "Overhead press", "75 lb · last: 3×8"],
      ["dips", "Dips", "bodyweight · last: 2×10"],
    ],
  },
  legs: {
    id: "legs",
    name: "Leg day",
    icon: "person-simple-run",
    sub: "3 lifts · ~45 min",
    ex: [
      ["squat", "Squat", "155 lb · last: 3×5"],
      ["rdl", "Romanian deadlift", "135 lb · last: 3×8"],
      ["lunge", "Walking lunges", "bodyweight · last: 2×12"],
    ],
  },
  walk: {
    id: "walk",
    name: "Walk",
    icon: "footprints",
    sub: "outside counts double",
    ex: [["walk", "Walk", "20+ min, any pace"]],
  },
};

export const MAX_TEMPLATES = 7;

export const customIcons = ["hand-fist", "heartbeat", "bicycle", "mountains"];
