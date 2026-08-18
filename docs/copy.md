# Every word in Procrastin8r

273 strings · roughly 1327 words. Generated from `lib/copy.ts` —
edit that file, not this one, then run `npm run copy:report`.

`{braces}` mark values filled in at runtime, not literal text.

## setup

| key | text |
| --- | --- |
| `setup.kicker` | First run · about 20 seconds |
| `setup.title` | When does your day happen? |
| `setup.intro` | Four times. Everything else — work blocks, meals, the gym slot — gets built around them, and you can move any of it later. |
| `setup.rows.meds.label` | Meds + breakfast |
| `setup.rows.meds.sub` | the peak window starts here |
| `setup.rows.lunch.label` | Lunch |
| `setup.rows.lunch.sub` | the food check-in fires here |
| `setup.rows.gym.label` | Workout slot |
| `setup.rows.gym.sub` | move it any day you want |
| `setup.rows.wind.label` | Wind-down |
| `setup.rows.wind.sub` | the day stops here |
| `setup.wakeNote` | Wake is set to {time} — half an hour before meds. Change meds and it follows. |
| `setup.confirm` | That's my day |

## checkIn

| key | text |
| --- | --- |
| `checkIn.kicker` | Daily check-in · 10 seconds |
| `checkIn.title` | How do you want today served? |
| `checkIn.sub` | Pick the mode. Change it anytime. |
| `checkIn.regular.title` | Regular |
| `checkIn.regular.sub` | The full setup — next 3, food, schedule, movement. |
| `checkIn.blunt.title` | The blunt list |
| `checkIn.blunt.sub` | No cards, no charts. Just do the things, in order. |
| `checkIn.cant.title` | I can't today |
| `checkIn.cant.sub` | Three things. Everything else goes away. No guilt. |

## home

| key | text |
| --- | --- |
| `home.today` | Today |
| `home.modeRegular` | regular |
| `home.modeLow` | low-capacity |
| `home.noticing.skipped` | Skipped a meal — noted, no lecture. Next food window is ~2pm. |
| `home.noticing.nothingEaten` | Nothing eaten since you woke up. Not a crisis. Just saying. |
| `home.noticing.noWater` | Food's handled. Water is at zero, though. Bottle's right there. |
| `home.noticing.allClear` | List cleared. You're free. Go be a person. |
| `home.noticing.remaining` | Fed and watered. {n} left — the top one takes 5 minutes. |
| `home.nextLabel.low` | next 1 — that's all today asks |
| `home.nextLabel.high` | next 3 — big one first, ride the wave |
| `home.nextLabel.mid` | next 3 — that's the whole list |
| `home.undo` | undo |
| `home.emptyTitle` | Nothing on the list. |
| `home.emptyBody` | Add the first thing below, or hit Capture and dump whatever's rattling around. |
| `home.start` | Start |
| `home.addTaskPlaceholder` | add anything — it joins the line |
| `home.queueLabel` | in line — bump one up when it starts to matter |
| `home.anchorsLabel` | Anchors |
| `home.anchor.wake` | Up by {time} |
| `home.anchor.lunch` | Eat lunch |
| `home.anchor.wind` | Wind-down at {time} |
| `home.foodLabel` | Food & water |
| `home.food.none` | Eat something. |
| `home.food.skipped` | Skipped — noted, no lecture. |
| `home.food.well` | Ate well. Solid. |
| `home.food.ate` | Ate. That's what matters. |
| `home.ate` | Ate |
| `home.ateWell` | Ate well |
| `home.skipped` | Skipped |
| `home.undoShort` | undo |
| `home.goTosLabel` | go-tos — tap to log, hold to drop |
| `home.mealPlaceholder` | what did you eat? |
| `home.calPlaceholder` | cal |
| `home.proPlaceholder` | g pro |
| `home.mealTotals` | today: {cal} cal · {pro}g pro |
| `home.water` | Water · {n} today |
| `home.movementLabel` | Movement |
| `home.movement.lowTitle` | 20-min walk |
| `home.movement.lowSub` | low-battery pick — outside counts double |
| `home.movement.noneTitle` | Move a bit |
| `home.movement.noneSub` | nothing planned today · 10 minutes still counts |
| `home.workedOut` | I worked out |
| `home.miniWorkout` | 10-min version |
| `home.workoutDoneFull` | Worked out. Logged. Done. |
| `home.workoutDoneMini` | 10 minutes done. Full win — that's the rule. |
| `home.capture` | Capture |
| `home.schedule` | Schedule |
| `home.cantToday` | I can't today |

## blunt

| key | text |
| --- | --- |
| `blunt.heading` | the list. |
| `blunt.mode` | mode |
| `blunt.addPlaceholder` | + add |
| `blunt.water` | water: {n} |
| `blunt.food.none` | food: none yet |
| `blunt.food.skipped` | food: skipped |
| `blunt.food.handled` | food: handled |
| `blunt.ate` | ate |

## crisis

| key | text |
| --- | --- |
| `crisis.kicker` | Low-capacity mode |
| `crisis.title` | Everything else is gone until you say so. |
| `crisis.sub` | Three things. Any one of them is a win. |
| `crisis.eat` | Eat one thing |
| `crisis.ateButton` | Ate |
| `crisis.doneButton` | Done |
| `crisis.doneCheck` | Done ✓ |
| `crisis.water` | Water · {n} |
| `crisis.plusOne` | +1 |
| `crisis.bringBack` | Bring the rest back |
| `crisis.fallbackAnchor` | Wind-down |

## capture

| key | text |
| --- | --- |
| `capture.title` | Capture |
| `capture.prompt` | Dump it. Sorting is later's problem. |
| `capture.placeholder` | e.g. cancel the free trial |
| `capture.save` | Save it |
| `capture.laterLabel` | later — bump one up when it starts to matter |
| `capture.laterFooter` | They're safe here. Nothing expires. |
| `capture.laterEmpty` | Nothing in the later pile yet. Anything you file lands here. |
| `capture.triageKicker` | Saved. Two questions — then it's filed. |
| `capture.q1` | Due soon? |
| `capture.yes` | Yes |
| `capture.no` | Nah |
| `capture.q2` | If you skip it? |
| `capture.shrug` | Shrug — nothing happens |
| `capture.bad` | Bad — someone's waiting on it |
| `capture.veryBad` | Very bad — real consequences |
| `capture.filedToday` | Filed: Today. |
| `capture.filedLater` | Filed: Later. |
| `capture.filedTodaySub` | It's in the Next 3 line. You'll see it when it's its turn — not before. |
| `capture.filedLaterSub` | Out of your head, off today's plate. It's in the later pile on this screen — pull it up whenever it starts to matter. |
| `capture.backToToday` | Back to Today |

## focus

| key | text |
| --- | --- |
| `focus.title` | Focus |
| `focus.running` | you can see it moving |
| `focus.paused` | paused — fine |
| `focus.pause` | Pause |
| `focus.resume` | Resume |
| `focus.extend` | +5 |
| `focus.lengthLabel` | how long — sticks for next time |
| `focus.interruptPlaceholder` | Stray thought? Dump it, stay on task |
| `focus.done` | Done |
| `focus.bail` | Bail — counts |

## schedule

| key | text |
| --- | --- |
| `schedule.title` | Schedule |
| `schedule.progress` | {held} of {total} held · dashed = suggestions |
| `schedule.editDay` | Edit day |
| `schedule.statTasks` | Tasks |
| `schedule.statBlocks` | Blocks held |
| `schedule.statWorkout` | Workout |
| `schedule.workoutDone` | Done ✓ |
| `schedule.workoutMini` | 10-min ✓ |
| `schedule.medsNote` | Meds peak {from}–{to}. Hard work sits there; easy stuff after. The gym slot came from your battery, not a rulebook. |
| `schedule.now` | now |
| `schedule.suggestionTag` | suggestion |
| `schedule.addedTag` | added × |
| `schedule.ghostHint` | {sub} · tap + to add |
| `schedule.blocks.meds.title` | Breakfast + meds |
| `schedule.blocks.meds.sub` | anchor · food before the pill |
| `schedule.blocks.deep.title` | Deep work · {task} |
| `schedule.blocks.deep.sub` | meds peak {from}–{to} — the hard task fits here |
| `schedule.blocks.break.title` | Water + move for 5 |
| `schedule.blocks.break.sub` | break, not a reward |
| `schedule.blocks.break.tag` | hide |
| `schedule.blocks.light.title` | Small stuff · {tasks} |
| `schedule.blocks.light.sub` | two quick wins before lunch |
| `schedule.blocks.lunch.title` | Lunch |
| `schedule.blocks.lunch.sub` | anchor · safe-food list is loaded |
| `schedule.blocks.gym.sub` | fits today's battery · 10-min version still counts |
| `schedule.blocks.dinner.title` | Dinner |
| `schedule.blocks.dinner.sub` | food · one-tap log |
| `schedule.blocks.dinner.tag` | hide |
| `schedule.blocks.wind.title` | Wind-down |
| `schedule.blocks.wind.sub` | anchor · screens dim, tomorrow's Next 3 gets set |
| `schedule.workoutName.low` | 20-min walk |
| `schedule.workoutName.mid` | Push day · 40 min |
| `schedule.workoutName.high` | Push day + extras · 50 min |

## editDay

| key | text |
| --- | --- |
| `editDay.title` | Edit day |
| `editDay.intro` | Set the anchors once. Everything else — work blocks, meals, the gym slot — flexes around them on its own. |
| `editDay.rows.wake.label` | Wake |
| `editDay.rows.wake.sub` | anchor · everything counts from here |
| `editDay.rows.meds.label` | Meds + breakfast |
| `editDay.rows.meds.sub` | work blocks follow the peak window |
| `editDay.rows.lunch.label` | Lunch |
| `editDay.rows.lunch.sub` | anchor · food check-in fires here |
| `editDay.rows.gym.label` | Workout slot |
| `editDay.rows.gym.subAuto` | auto — adjust anyway if you want |
| `editDay.rows.gym.subManual` | manual — your pick |
| `editDay.rows.wind.label` | Wind-down |
| `editDay.rows.wind.sub` | anchor · drift alerts key off this |
| `editDay.yourBlockSub` | {sub} · remove with × |
| `editDay.addBlockPlaceholder` | Add a block: class, shift, appointment… |
| `editDay.addedBlockSub` | you added this |
| `editDay.importCalendar` | Import a calendar (school, work) — events land as blocks |
| `editDay.autoGym` | Auto-slot the workout |
| `editDay.autoGymSub` | Placed from your battery + recovery. Off = you pick the time. |
| `editDay.done` | Done — rebuild my day |

## importCalendar

| key | text |
| --- | --- |
| `importCalendar.title` | Import from calendar |
| `importCalendar.loading` | Reading today's events… |
| `importCalendar.unsupported` | Calendar access only works in the app on your phone, not in a browser. |
| `importCalendar.denied` | Calendar access is off. You can turn it on in Settings › Procrastin8r › Calendars, or just add blocks by hand on the Edit day screen — nothing here depends on it. |
| `importCalendar.error` | Could not read the calendar. |
| `importCalendar.empty` | Nothing timed on your calendar today. All-day events are skipped — they have no place to sit on a timeline. |
| `importCalendar.listLabel` | today's events — untick anything you don't want |
| `importCalendar.alreadyAdded` | already on your day |
| `importCalendar.fromCalendar` | from {name} |
| `importCalendar.untitledEvent` | untitled event |
| `importCalendar.nothingSelected` | Nothing selected |
| `importCalendar.addBlocks` | Add {n} blocks |
| `importCalendar.readOnlyNote` | Copied onto your day only. Procrastin8r never writes to your calendar. |
| `importCalendar.back` | Back to Edit day |

## workout

| key | text |
| --- | --- |
| `workout.title` | Log workout |
| `workout.templatesLabel` | One tap — saved templates |
| `workout.newNamePlaceholder` | name it — e.g. Pull day |
| `workout.newExPlaceholder` | exercises, comma-separated — rows, curls, face pulls |
| `workout.saveTemplate` | Save — it joins the day cycle below |
| `workout.weekLabel` | this week — tap a day to choose a plan |
| `workout.rest` | rest |
| `workout.weekSummary` | {n} sessions planned · rest is a plan, not a gap |
| `workout.setsLabel` | {name} — tap to adjust, nothing required |
| `workout.detailPlaceholder` | 75 lb · last: 3×8 |
| `workout.sets` | {n} sets |
| `workout.voicePlaceholder` | Or just say it: "bench, 135 for 8" |
| `workout.save` | Save — details optional, showing up is the win |

## nudge

| key | text |
| --- | --- |
| `nudge.from` | navigator · now |
| `nudge.later` | later |
| `nudge.water.messages[0]` | water's at zero. bottle. now-ish. |
| `nudge.water.messages[1]` | still zero water. this is the follow-up. |
| `nudge.water.messages[2]` | third ask: drink water. i'll stop after this one. |
| `nudge.water.action` | logged +1 |
| `nudge.food.messages[0]` | nothing eaten yet. anything counts. |
| `nudge.food.messages[1]` | second nudge: eat literally anything. |
| `nudge.food.messages[2]` | last one: food. then i'm quiet. |
| `nudge.food.action` | ate something |

## toast

| key | text |
| --- | --- |
| `toast.wins[0]` | Logged. That's momentum. |
| `toast.wins[1]` | Done is done. |
| `toast.wins[2]` | One less thing. |
| `toast.wins[3]` | That counts. All of it. |
| `toast.wins[4]` | Look at you, deciding things. |
| `toast.taskAdded` | On the list. It'll surface when it's time. |
| `toast.taskErased` | Erased. Undo is right there if you change your mind. |
| `toast.taskSplit` | Shrunk it. The first step is the task now. |
| `toast.pulledUp` | Pulled up. It's in the line now. |
| `toast.dumped` | Dumped to inbox. Back to the task. |
| `toast.anchorHeld` | Anchor held. That's the backbone. |
| `toast.fed` | Fed. Brain works better now. |
| `toast.fedWell` | Fed, and well. Fancy. |
| `toast.firstWater` | First water of the day. Counts. |
| `toast.mealLogged` | Logged. {pro}g protein, zero decisions. |
| `toast.macrosCounted` | Counted. That's all the math you owe today. |
| `toast.goToSaved` | Saved as a go-to. One tap from now on. |
| `toast.goToDuplicate` | Already one of your go-tos. |
| `toast.goToDropped` | Dropped from your go-tos. |
| `toast.workoutLogged` | Workout logged. No details needed. |
| `toast.workoutMini` | Showing up was the hard part. |
| `toast.workoutDetailed` | Workout logged — details and all. |
| `toast.workoutHeld` | Workout held. Logged everywhere. |
| `toast.numbersSaved` | Numbers saved. Next time it's pre-filled. |
| `toast.templateSaved` | Template saved. Tap any day below to slot it in. |
| `toast.voiceLogged` | Logged. No typing needed. |
| `toast.blockAdded` | On the timeline at {time} — nudge it anytime. |
| `toast.blockHeld` | Block held. The day is holding shape. |
| `toast.suggestionAdded` | Added. Your call, always. |
| `toast.focusExtended` | Five more. Still counts. |
| `toast.focusBailed` | You started. That already counts. |
| `toast.crisisAte` | That's the big one. Rest is optional. |
| `toast.crisisAnchor` | Anchor held on a bad day. Huge. |
| `toast.imported` | {n} events on the timeline. |

## splitSteps[0]

| key | text |
| --- | --- |
| `splitSteps[0]` | First step: open it. That's the whole task now. |

## splitSteps[1]

| key | text |
| --- | --- |
| `splitSteps[1]` | First step: 3 minutes, then you're allowed to stop. |

## splitSteps[2]

| key | text |
| --- | --- |
| `splitSteps[2]` | First step: write one bad sentence. |

## meta

| key | text |
| --- | --- |
| `meta.addedByYou` | added by you |
| `meta.autoTriaged` | new · auto-triaged |
| `meta.pulledUp` | pulled up from later |

## a11y

| key | text |
| --- | --- |
| `a11y.back` | Back |
| `a11y.addTask` | Add task |
| `a11y.moveUp` | Move up |
| `a11y.shrink` | Shrink to the first step |
| `a11y.eraseTask` | Erase from list |
| `a11y.remove` | Remove |
| `a11y.toggleTheme` | Toggle dark or light |
| `a11y.lessWater` | One less water |
| `a11y.moreWater` | One more water |
| `a11y.logMeal` | Log meal |
| `a11y.saveGoTo` | Save as a go-to |
| `a11y.dumpToInbox` | Dump to inbox |
| `a11y.addBlock` | Add block |
| `a11y.newTemplate` | New template |
| `a11y.logByVoice` | Log by voice |
| `a11y.minutes` | {n} minutes |
| `a11y.earlier` | {label} earlier |
| `a11y.later` | {label} later |
| `a11y.removeNamed` | Remove {name} |
| `a11y.pullUp` | Pull up {name} |
| `a11y.drop` | Drop {name} |
| `a11y.unAdd` | Un-add {name} |
| `a11y.lessSets` | One less set of {name} |
| `a11y.moreSets` | One more set of {name} |

