/**
 * Every user-facing word in the app, in one place.
 *
 * Edit here and the app changes — nothing below is duplicated in a screen.
 * Anything taking arguments is a function; everything else is a plain string.
 *
 * `npm run copy:report` dumps this to docs/copy.md and docs/copy.json if you
 * want to read or mark it up outside the editor.
 *
 * House style, for whatever it's worth when you rewrite:
 *   - The app states what it sees; it never issues an order.
 *   - Effort counts. Nothing is ever framed as a failure.
 *   - Everything renders lowercase, so capitals here are only for readability.
 */

export const copy = {
  // ── first run ───────────────────────────────────────────────────────────
  setup: {
    kicker: "First run · about 20 seconds",
    title: "When does your day happen?",
    intro:
      "Four times. Everything else — work blocks, meals, the gym slot — gets built around them, and you can move any of it later.",
    rows: {
      meds: { label: "Meds + breakfast", sub: "the peak window starts here" },
      lunch: { label: "Lunch", sub: "the food check-in fires here" },
      gym: { label: "Workout slot", sub: "move it any day you want" },
      wind: { label: "Wind-down", sub: "the day stops here" },
    },
    wakeNote: (wake: string) =>
      `Wake is set to ${wake} — half an hour before meds. Change meds and it follows.`,
    confirm: "That's my day",
  },

  // ── daily check-in ──────────────────────────────────────────────────────
  checkIn: {
    kicker: "Daily check-in · 10 seconds",
    title: "How do you want today served?",
    sub: "Pick the mode. Change it anytime.",
    regular: {
      title: "Regular",
      sub: "The full setup — next 3, food, schedule, movement.",
    },
    blunt: {
      title: "The blunt list",
      sub: "No cards, no charts. Just do the things, in order.",
    },
    cant: {
      title: "I can't today",
      sub: "Three things. Everything else goes away. No guilt.",
    },
  },

  // ── home ────────────────────────────────────────────────────────────────
  home: {
    today: "Today",
    modeRegular: "regular",
    modeLow: "low-capacity",

    /** The passive line at the top. States what it sees; never commands. */
    noticing: {
      skipped: "Skipped a meal — noted, no lecture. Next food window is ~2pm.",
      nothingEaten: "Nothing eaten since you woke up. Not a crisis. Just saying.",
      noWater: "Food's handled. Water is at zero, though. Bottle's right there.",
      allClear: "List cleared. You're free. Go be a person.",
      remaining: (open: number) => `Fed and watered. ${open} left — the top one takes 5 minutes.`,
    },

    nextLabel: {
      low: "next 1 — that's all today asks",
      high: "next 3 — big one first, ride the wave",
      mid: "next 3 — that's the whole list",
    },
    undo: "undo",
    emptyTitle: "Nothing on the list.",
    emptyBody: "Add the first thing below, or hit Capture and dump whatever's rattling around.",
    start: "Start",
    addTaskPlaceholder: "add anything — it joins the line",
    queueLabel: "in line — bump one up when it starts to matter",

    anchorsLabel: "Anchors",
    anchor: {
      wake: (time: string) => `Up by ${time}`,
      lunch: "Eat lunch",
      wind: (time: string) => `Wind-down at ${time}`,
    },

    foodLabel: "Food & water",
    food: {
      none: "Eat something.",
      skipped: "Skipped — noted, no lecture.",
      well: "Ate well. Solid.",
      ate: "Ate. That's what matters.",
    },
    ate: "Ate",
    ateWell: "Ate well",
    skipped: "Skipped",
    undoShort: "undo",
    goTosLabel: "go-tos — tap to log, hold to drop",
    mealPlaceholder: "what did you eat?",
    calPlaceholder: "cal",
    proPlaceholder: "g pro",
    mealTotals: (cal: number, pro: number) => `today: ${cal} cal · ${pro}g pro`,
    water: (count: number) => `Water · ${count} today`,

    movementLabel: "Movement",
    movement: {
      lowTitle: "20-min walk",
      lowSub: "low-battery pick — outside counts double",
      noneTitle: "Move a bit",
      noneSub: "nothing planned today · 10 minutes still counts",
    },
    workedOut: "I worked out",
    miniWorkout: "10-min version",
    workoutDoneFull: "Worked out. Logged. Done.",
    workoutDoneMini: "10 minutes done. Full win — that's the rule.",

    capture: "Capture",
    schedule: "Schedule",
    cantToday: "I can't today",
  },

  // ── the blunt list ──────────────────────────────────────────────────────
  blunt: {
    heading: "the list.",
    mode: "mode",
    addPlaceholder: "+ add",
    water: (count: number) => `water: ${count}`,
    food: { none: "food: none yet", skipped: "food: skipped", handled: "food: handled" },
    ate: "ate",
  },

  // ── low-capacity mode ───────────────────────────────────────────────────
  crisis: {
    kicker: "Low-capacity mode",
    title: "Everything else is gone until you say so.",
    sub: "Three things. Any one of them is a win.",
    eat: "Eat one thing",
    ateButton: "Ate",
    doneButton: "Done",
    doneCheck: "Done ✓",
    water: (count: number) => `Water · ${count}`,
    plusOne: "+1",
    bringBack: "Bring the rest back",
    fallbackAnchor: "Wind-down",
  },

  // ── capture + triage ────────────────────────────────────────────────────
  capture: {
    title: "Capture",
    prompt: "Dump it. Sorting is later's problem.",
    placeholder: "e.g. cancel the free trial",
    save: "Save it",
    laterLabel: "later — bump one up when it starts to matter",
    laterFooter: "They're safe here. Nothing expires.",
    laterEmpty: "Nothing in the later pile yet. Anything you file lands here.",

    triageKicker: "Saved. Two questions — then it's filed.",
    q1: "Due soon?",
    yes: "Yes",
    no: "Nah",
    q2: "If you skip it?",
    shrug: "Shrug — nothing happens",
    bad: "Bad — someone's waiting on it",
    veryBad: "Very bad — real consequences",

    filedToday: "Filed: Today.",
    filedLater: "Filed: Later.",
    filedTodaySub: "It's in the Next 3 line. You'll see it when it's its turn — not before.",
    filedLaterSub:
      "Out of your head, off today's plate. It's in the later pile on this screen — pull it up whenever it starts to matter.",
    backToToday: "Back to Today",
  },

  // ── focus timer ─────────────────────────────────────────────────────────
  focus: {
    title: "Focus",
    running: "you can see it moving",
    paused: "paused — fine",
    pause: "Pause",
    resume: "Resume",
    extend: "+5",
    lengthLabel: "how long — sticks for next time",
    interruptPlaceholder: "Stray thought? Dump it, stay on task",
    done: "Done",
    bail: "Bail — counts",
  },

  // ── schedule ────────────────────────────────────────────────────────────
  schedule: {
    title: "Schedule",
    progress: (held: number, total: number) => `${held} of ${total} held · dashed = suggestions`,
    editDay: "Edit day",
    statTasks: "Tasks",
    statBlocks: "Blocks held",
    statWorkout: "Workout",
    workoutDone: "Done ✓",
    workoutMini: "10-min ✓",
    medsNote: (from: string, to: string) =>
      `Meds peak ${from}–${to}. Hard work sits there; easy stuff after. The gym slot came from your battery, not a rulebook.`,
    now: "now",
    suggestionTag: "suggestion",
    addedTag: "added ×",
    ghostHint: (sub: string) => `${sub} · tap + to add`,

    /** Block titles and subtitles built into every day. */
    blocks: {
      meds: { title: "Breakfast + meds", sub: "anchor · food before the pill" },
      deep: {
        title: (task: string) => `Deep work · ${task}`,
        sub: (from: string, to: string) => `meds peak ${from}–${to} — the hard task fits here`,
      },
      break: { title: "Water + move for 5", sub: "break, not a reward", tag: "hide" },
      light: {
        title: (tasks: string) => `Small stuff · ${tasks}`,
        sub: (count: number) => `${count === 1 ? "a quick win" : "two quick wins"} before lunch`,
      },
      lunch: { title: "Lunch", sub: "anchor · safe-food list is loaded" },
      gym: { sub: "fits today's battery · 10-min version still counts" },
      dinner: { title: "Dinner", sub: "food · one-tap log", tag: "hide" },
      wind: { title: "Wind-down", sub: "anchor · screens dim, tomorrow's Next 3 gets set" },
    },
    workoutName: {
      low: "20-min walk",
      mid: "Push day · 40 min",
      high: "Push day + extras · 50 min",
    },
  },

  // ── edit day ────────────────────────────────────────────────────────────
  editDay: {
    title: "Edit day",
    intro:
      "Set the anchors once. Everything else — work blocks, meals, the gym slot — flexes around them on its own.",
    rows: {
      wake: { label: "Wake", sub: "anchor · everything counts from here" },
      meds: { label: "Meds + breakfast", sub: "work blocks follow the peak window" },
      lunch: { label: "Lunch", sub: "anchor · food check-in fires here" },
      gym: { label: "Workout slot", subAuto: "auto — adjust anyway if you want", subManual: "manual — your pick" },
      wind: { label: "Wind-down", sub: "anchor · drift alerts key off this" },
    },
    yourBlockSub: (sub: string) => `${sub} · remove with ×`,
    addBlockPlaceholder: "Add a block: class, shift, appointment…",
    addedBlockSub: "you added this",
    importCalendar: "Import a calendar (school, work) — events land as blocks",
    autoGym: "Auto-slot the workout",
    autoGymSub: "Placed from your battery + recovery. Off = you pick the time.",
    done: "Done — rebuild my day",
  },

  // ── calendar import ─────────────────────────────────────────────────────
  importCalendar: {
    title: "Import from calendar",
    loading: "Reading today's events…",
    unsupported: "Calendar access only works in the app on your phone, not in a browser.",
    denied:
      "Calendar access is off. You can turn it on in Settings › Procrastin8r › Calendars, or just add blocks by hand on the Edit day screen — nothing here depends on it.",
    error: "Could not read the calendar.",
    empty:
      "Nothing timed on your calendar today. All-day events are skipped — they have no place to sit on a timeline.",
    listLabel: "today's events — untick anything you don't want",
    alreadyAdded: "already on your day",
    fromCalendar: (name: string) => `from ${name}`,
    untitledEvent: "untitled event",
    nothingSelected: "Nothing selected",
    addBlocks: (n: number) => `Add ${n} ${n === 1 ? "block" : "blocks"}`,
    readOnlyNote: "Copied onto your day only. Procrastin8r never writes to your calendar.",
    back: "Back to Edit day",
  },

  // ── workout log ─────────────────────────────────────────────────────────
  workout: {
    title: "Log workout",
    templatesLabel: "One tap — saved templates",
    newNamePlaceholder: "name it — e.g. Pull day",
    newExPlaceholder: "exercises, comma-separated — rows, curls, face pulls",
    saveTemplate: "Save — it joins the day cycle below",
    weekLabel: "this week — tap a day to choose a plan",
    rest: "rest",
    weekSummary: (n: number) => `${n} sessions planned · rest is a plan, not a gap`,
    setsLabel: (name: string) => `${name} — tap to adjust, nothing required`,
    detailPlaceholder: "75 lb · last: 3×8",
    sets: (n: number) => `${n} sets`,
    voicePlaceholder: 'Or just say it: "bench, 135 for 8"',
    save: "Save — details optional, showing up is the win",
  },

  // ── the nudge card ──────────────────────────────────────────────────────
  nudge: {
    from: "navigator · now",
    later: "later",
    water: {
      messages: [
        "water's at zero. bottle. now-ish.",
        "still zero water. this is the follow-up.",
        "third ask: drink water. i'll stop after this one.",
      ],
      action: "logged +1",
    },
    food: {
      messages: [
        "nothing eaten yet. anything counts.",
        "second nudge: eat literally anything.",
        "last one: food. then i'm quiet.",
      ],
      action: "ate something",
    },
  },

  // ── toasts ──────────────────────────────────────────────────────────────
  toast: {
    /** Picked at random when nothing more specific fits. */
    wins: [
      "Logged. That's momentum.",
      "Done is done.",
      "One less thing.",
      "That counts. All of it.",
      "Look at you, deciding things.",
    ],
    taskAdded: "On the list. It'll surface when it's time.",
    taskErased: "Erased. Undo is right there if you change your mind.",
    taskSplit: "Shrunk it. The first step is the task now.",
    pulledUp: "Pulled up. It's in the line now.",
    dumped: "Dumped to inbox. Back to the task.",
    anchorHeld: "Anchor held. That's the backbone.",
    fed: "Fed. Brain works better now.",
    fedWell: "Fed, and well. Fancy.",
    firstWater: "First water of the day. Counts.",
    mealLogged: (pro: number) => `Logged. ${pro}g protein, zero decisions.`,
    macrosCounted: "Counted. That's all the math you owe today.",
    goToSaved: "Saved as a go-to. One tap from now on.",
    goToDuplicate: "Already one of your go-tos.",
    goToDropped: "Dropped from your go-tos.",
    workoutLogged: "Workout logged. No details needed.",
    workoutMini: "Showing up was the hard part.",
    workoutDetailed: "Workout logged — details and all.",
    workoutHeld: "Workout held. Logged everywhere.",
    numbersSaved: "Numbers saved. Next time it's pre-filled.",
    templateSaved: "Template saved. Tap any day below to slot it in.",
    voiceLogged: "Logged. No typing needed.",
    blockAdded: (time: string) => `On the timeline at ${time} — nudge it anytime.`,
    blockHeld: "Block held. The day is holding shape.",
    suggestionAdded: "Added. Your call, always.",
    focusExtended: "Five more. Still counts.",
    focusBailed: "You started. That already counts.",
    crisisAte: "That's the big one. Rest is optional.",
    crisisAnchor: "Anchor held on a bad day. Huge.",
    imported: (n: number) => `${n} ${n === 1 ? "event" : "events"} on the timeline.`,
  },

  /** The three ways a task gets shrunk when it is too big to start. */
  splitSteps: [
    "First step: open it. That's the whole task now.",
    "First step: 3 minutes, then you're allowed to stop.",
    "First step: write one bad sentence.",
  ],

  /** Task metadata lines the app writes itself. */
  meta: {
    addedByYou: "added by you",
    autoTriaged: "new · auto-triaged",
    pulledUp: "pulled up from later",
  },

  /** Screen-reader labels. Never shown on screen, but still read aloud. */
  a11y: {
    back: "Back",
    addTask: "Add task",
    moveUp: "Move up",
    shrink: "Shrink to the first step",
    eraseTask: "Erase from list",
    remove: "Remove",
    toggleTheme: "Toggle dark or light",
    lessWater: "One less water",
    moreWater: "One more water",
    logMeal: "Log meal",
    saveGoTo: "Save as a go-to",
    dumpToInbox: "Dump to inbox",
    addBlock: "Add block",
    newTemplate: "New template",
    logByVoice: "Log by voice",
    minutes: (n: number) => `${n} minutes`,
    earlier: (label: string) => `${label} earlier`,
    later: (label: string) => `${label} later`,
    removeNamed: (name: string) => `Remove ${name}`,
    pullUp: (name: string) => `Pull up ${name}`,
    drop: (name: string) => `Drop ${name}`,
    unAdd: (name: string) => `Un-add ${name}`,
    lessSets: (name: string) => `One less set of ${name}`,
    moreSets: (name: string) => `One more set of ${name}`,
  },
} as const;
