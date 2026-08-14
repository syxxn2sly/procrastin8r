import { useMemo, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import {
  Btn, Card, CheckCircleBtn, Field, IconBtn, Kicker, NoteBar, Screen, T, useTheme,
} from "@/components/ui";
import { radius } from "@/constants/theme";
import { noticingLine, useStore } from "@/lib/store";
import type { Task } from "@/lib/types";

const safeFoods = [
  { name: "chicken bowl", cal: 620, pro: 45 },
  { name: "pb toast", cal: 340, pro: 14 },
  { name: "yogurt + granola", cal: 280, pro: 18 },
  { name: "protein shake", cal: 200, pro: 30 },
];

const workouts = {
  low: ["20-min walk", "Low-battery pick — outside counts double"],
  mid: ["Push day · 40 min", "Last push: 3 days ago · recovered"],
  high: ["Push day + extras · 50 min", "Wired is for barbells"],
};

const dateLine = () => {
  const d = new Date();
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${days[d.getDay()]} · ${months[d.getMonth()]} ${d.getDate()}`;
};

export default function Home() {
  const t = useTheme();
  const s = useStore();
  const [taskIn, setTaskIn] = useState("");
  const [mealIn, setMealIn] = useState("");
  const [calIn, setCalIn] = useState("");
  const [proIn, setProIn] = useState("");

  const energy = s.energy ?? "mid";
  const visibleCount = energy === "low" ? 1 : 3;

  /**
   * Low battery shows one task; high battery deliberately floats the biggest
   * one to the top to spend the energy while it exists. Everything else keeps
   * the user's own order.
   */
  const visible: Task[] = useMemo(() => {
    if (energy === "low") {
      return [...s.tasks].sort((a, b) => Number(a.done) - Number(b.done)).slice(0, 1);
    }
    if (energy === "high") {
      return [...s.tasks]
        .slice(0, 3)
        .sort(
          (a, b) =>
            b.title.length + (b.meta.includes("big") ? 100 : 0) -
            (a.title.length + (a.meta.includes("big") ? 100 : 0)),
        );
    }
    return s.tasks.slice(0, 3);
  }, [s.tasks, energy]);

  const queue = s.tasks.slice(visibleCount);
  const openTasks = s.tasks.filter((x) => !x.done).length;
  const doneCount = (energy === "low" ? s.tasks.slice(0, 1) : s.tasks).filter((x) => x.done).length;
  const w = workouts[energy];

  const nextLabel =
    energy === "low"
      ? "next 1 — that's all today asks"
      : energy === "high"
        ? "next 3 — big one first, ride the wave"
        : "next 3 — that's the whole list";

  const foodLine =
    s.food === null
      ? "Eat something."
      : s.food === "skipped"
        ? "Skipped — noted, no lecture."
        : s.food === "well"
          ? "Ate well. Solid."
          : "Ate. That's what matters.";

  const addMacros = () => {
    const cal = Number(calIn) || 0;
    const pro = Number(proIn) || 0;
    const name = mealIn.trim();
    if (!name && !cal && !pro) return;
    s.addMeal(name || "something", cal, pro);
    setMealIn("");
    setCalIn("");
    setProIn("");
  };

  const totals = s.meals.reduce(
    (a, m) => ({ cal: a.cal + m.cal, pro: a.pro + m.pro }),
    { cal: 0, pro: 0 },
  );

  return (
    <Screen>
      {/* header */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 14,
          paddingBottom: 10,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Kicker>{dateLine()}</Kicker>
          <T size={20} weight="medium" style={{ letterSpacing: -0.3 }}>
            Today
          </T>
        </View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable
            onPress={() => s.update({ theme: s.theme === "dark" ? "light" : "dark" })}
            accessibilityRole="button"
            accessibilityLabel="Toggle dark or light"
            style={({ pressed }) => ({
              width: 30,
              height: 30,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: t.neutral[800],
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Icon name={s.theme === "dark" ? "sun" : "moon"} size={15} color={t.neutral[300]} />
          </Pressable>
          <Pressable
            onPress={() => router.replace("/")}
            style={({ pressed }) => ({
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              paddingVertical: 6,
              paddingHorizontal: 11,
              borderRadius: radius.pill,
              borderWidth: 1,
              borderColor: t.neutral[800],
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Icon
              name={energy === "low" ? "cloud" : "squares-four"}
              size={15}
              color={t.accent}
            />
            <T size={12} weight="medium" color={t.neutral[300]}>
              {energy === "low" ? "low-capacity" : "regular"}
            </T>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingHorizontal: 20, marginBottom: 12 }}>
        <NoteBar icon="eye">{noticingLine(s.food, s.water, openTasks)}</NoteBar>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 16, gap: 18 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* next 3 */}
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 8,
            }}
          >
            <Kicker>{nextLabel}</Kicker>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              {s.canUndo ? (
                <Pressable
                  onPress={s.undoTasks}
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Icon name="arrow-counter-clockwise" size={12} color={t.neutral[500]} />
                  <T size={11} color={t.neutral[500]}>
                    undo
                  </T>
                </Pressable>
              ) : null}
              <T size={11} color={t.neutral[600]} tabular>
                {doneCount}/{visibleCount}
              </T>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            {visible.map((task) => (
              <Card
                key={task.id}
                style={{
                  gap: 10,
                  opacity: task.done ? 0.55 : 1,
                  paddingVertical: 13,
                  paddingHorizontal: 14,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                  <CheckCircleBtn
                    done={task.done}
                    onPress={() => s.toggleTask(task.id)}
                    label={task.title}
                  />
                  <View style={{ flex: 1 }}>
                    <T
                      size={14.5}
                      weight="medium"
                      color={task.done ? t.neutral[500] : t.text}
                      style={task.done ? { textDecorationLine: "line-through" } : undefined}
                    >
                      {task.title}
                    </T>
                    <T size={11.5} color={t.neutral[500]}>
                      {task.meta}
                    </T>
                  </View>
                  <Pressable
                    onPress={() => s.eraseTask(task.id)}
                    accessibilityRole="button"
                    accessibilityLabel="Erase from list"
                    hitSlop={6}
                    style={{ width: 26, height: 26, alignItems: "center", justifyContent: "center" }}
                  >
                    <Icon name="x" size={14} color={t.neutral[600]} />
                  </Pressable>
                </View>

                {/* The actions get their own row. Inline, they squeezed the
                    title into three broken lines on a 6.1" phone, and the task
                    name is the one thing here that has to read at a glance. */}
                {!task.done ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <Btn
                      label="Start"
                      variant="primary"
                      size={12.5}
                      style={{ flex: 1, paddingVertical: 8 }}
                      onPress={() => router.push({ pathname: "/focus", params: { id: task.id } })}
                    />
                    <IconBtn
                      icon="caret-up"
                      size={32}
                      label="Move up"
                      onPress={() => s.bumpTask(task.id)}
                    />
                    <IconBtn
                      icon="arrows-in-line-horizontal"
                      size={32}
                      label="Shrink to the first step"
                      onPress={() => s.splitTask(task.id)}
                    />
                  </View>
                ) : null}
              </Card>
            ))}

            {queue.length ? (
              <View style={{ gap: 4, paddingTop: 2 }}>
                <T size={10} color={t.neutral[600]} style={{ letterSpacing: 0.8 }}>
                  in line — bump one up when it starts to matter
                </T>
                {queue.map((q) => (
                  <View
                    key={q.id}
                    style={{ flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 }}
                  >
                    <T size={12} color={t.neutral[400]} numberOfLines={1} style={{ flex: 1 }}>
                      {q.title}
                    </T>
                    <IconBtn icon="caret-up" size={26} label="Move up" onPress={() => s.bumpTask(q.id)} />
                    <Pressable
                      onPress={() => s.eraseTask(q.id)}
                      accessibilityRole="button"
                      accessibilityLabel="Remove"
                      style={{ width: 26, height: 26, alignItems: "center", justifyContent: "center" }}
                    >
                      <Icon name="x" size={12} color={t.neutral[600]} />
                    </Pressable>
                  </View>
                ))}
              </View>
            ) : null}

            <View style={{ flexDirection: "row", gap: 6 }}>
              <Field
                value={taskIn}
                onChangeText={setTaskIn}
                onSubmitEditing={() => {
                  s.addTask(taskIn);
                  setTaskIn("");
                }}
                placeholder="add anything — it joins the line"
                style={{ flex: 1, fontSize: 12, paddingVertical: 9 }}
              />
              <IconBtn
                icon="plus"
                size={36}
                accent
                label="Add task"
                onPress={() => {
                  s.addTask(taskIn);
                  setTaskIn("");
                }}
              />
            </View>
          </View>
        </View>

        {/* anchors */}
        <View>
          <Kicker style={{ marginBottom: 8 }}>Anchors</Kicker>
          <View style={{ flexDirection: "row", gap: 8 }}>
            {s.anchors.map((a) => (
              <Pressable
                key={a.id}
                onPress={() => s.toggleAnchor(a.id)}
                style={({ pressed }) => ({
                  flex: 1,
                  gap: 4,
                  paddingVertical: 10,
                  paddingHorizontal: 11,
                  borderRadius: radius.md,
                  borderWidth: 1,
                  borderColor: a.done ? t.accentRamp[700] : t.neutral[800],
                  backgroundColor: a.done ? t.accentRamp[900] : t.surface,
                  opacity: pressed ? 0.6 : 1,
                })}
              >
                <Icon name={a.icon} size={17} color={a.done ? t.accentRamp[300] : t.neutral[400]} />
                <T size={11.5} weight="medium" style={{ lineHeight: 15 }}>
                  {a.label}
                </T>
              </Pressable>
            ))}
          </View>
        </View>

        {/* food & water */}
        <View>
          <Kicker style={{ marginBottom: 8 }}>Food &amp; water</Kicker>
          <Card style={{ gap: 11, paddingVertical: 13, paddingHorizontal: 14 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <T size={14} weight="medium" style={{ flex: 1 }}>
                {foodLine}
              </T>
              {s.food === null ? (
                <>
                  <Btn label="Ate" variant="primary" size={12} style={{ paddingVertical: 7, paddingHorizontal: 12 }} onPress={() => s.logFood("ate")} />
                  <Btn label="Ate well" size={12} style={{ paddingVertical: 7, paddingHorizontal: 12 }} onPress={() => s.logFood("well")} />
                  <Btn label="Skipped" variant="quiet" size={12} style={{ paddingVertical: 7, paddingHorizontal: 12 }} onPress={() => s.logFood("skipped")} />
                </>
              ) : (
                <Btn label="undo" variant="quiet" size={11} style={{ paddingVertical: 6, paddingHorizontal: 11 }} onPress={() => s.update({ food: null })} />
              )}
            </View>

            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
              {safeFoods.map((f) => (
                <Pressable
                  key={f.name}
                  onPress={() => s.addMeal(f.name, f.cal, f.pro, `Logged. ${f.pro}g protein, zero decisions.`)}
                  style={({ pressed }) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 6,
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: radius.pill,
                    borderWidth: 1,
                    borderColor: pressed ? t.accent : t.neutral[800],
                  })}
                >
                  <T size={11} color={t.neutral[300]}>
                    {f.name}
                  </T>
                  <T size={11} color={t.neutral[600]} tabular>
                    {f.cal} · {f.pro}g
                  </T>
                </Pressable>
              ))}
            </View>

            <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
              <Field
                value={mealIn}
                onChangeText={setMealIn}
                placeholder="what did you eat?"
                style={{ flex: 1, fontSize: 12, paddingVertical: 8, backgroundColor: t.bg }}
              />
              <Field
                value={calIn}
                onChangeText={(v) => setCalIn(v.replace(/\D/g, ""))}
                placeholder="cal"
                inputMode="numeric"
                style={{ width: 54, fontSize: 12, paddingVertical: 8, paddingHorizontal: 8, backgroundColor: t.bg }}
              />
              <Field
                value={proIn}
                onChangeText={(v) => setProIn(v.replace(/\D/g, ""))}
                placeholder="g pro"
                inputMode="numeric"
                style={{ width: 58, fontSize: 12, paddingVertical: 8, paddingHorizontal: 8, backgroundColor: t.bg }}
              />
              <IconBtn icon="plus" size={32} label="Log meal" onPress={addMacros} />
            </View>

            {s.meals.length ? (
              <View style={{ gap: 5, borderTopWidth: 1, borderTopColor: t.divider, paddingTop: 9 }}>
                {s.meals.map((m) => (
                  <View key={m.id} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <T size={11.5} color={t.neutral[500]} tabular>
                      {m.at}
                    </T>
                    <T size={11.5} color={t.neutral[300]} numberOfLines={1} style={{ flex: 1 }}>
                      {m.name}
                    </T>
                    <T size={11.5} color={t.neutral[500]} tabular>
                      {m.cal} · {m.pro}g
                    </T>
                    <Pressable
                      onPress={() => s.removeMeal(m.id)}
                      accessibilityRole="button"
                      accessibilityLabel={`Remove ${m.name}`}
                      hitSlop={8}
                    >
                      <Icon name="x" size={11} color={t.neutral[600]} />
                    </Pressable>
                  </View>
                ))}
                <T size={11} color={t.neutral[400]} tabular style={{ textAlign: "right", marginTop: 2 }}>
                  today: {totals.cal} cal · {totals.pro}g pro
                </T>
              </View>
            ) : null}

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                borderTopWidth: 1,
                borderTopColor: t.divider,
                paddingTop: 11,
              }}
            >
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center", gap: 8 }}>
                <Icon name="drop" size={16} color={t.accent} />
                <T size={14} weight="medium">
                  Water · {s.water} today
                </T>
              </View>
              <IconBtn icon="minus" label="One less water" onPress={s.removeWater} />
              <IconBtn icon="plus" accent label="One more water" onPress={s.addWater} />
            </View>
          </Card>
        </View>

        {/* movement */}
        <View>
          <Kicker style={{ marginBottom: 8 }}>Movement</Kicker>
          <Card style={{ paddingVertical: 13, paddingHorizontal: 14 }}>
            {s.workoutDone === null ? (
              <>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <Icon name="barbell" size={20} color={t.accent} />
                  <View style={{ flex: 1 }}>
                    <T size={14.5} weight="medium">
                      {w[0]}
                    </T>
                    <T size={11.5} color={t.neutral[500]}>
                      {w[1]}
                    </T>
                  </View>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <Btn
                    label="I worked out"
                    variant="primary"
                    size={12.5}
                    style={{ flex: 1, paddingVertical: 9 }}
                    onPress={() => s.logWorkout("full")}
                  />
                  <Btn
                    label="10-min version"
                    size={12.5}
                    style={{ flex: 1, paddingVertical: 9 }}
                    onPress={() => s.logWorkout("mini", "Showing up was the hard part.")}
                  />
                  <IconBtn icon="note-pencil" size={36} label="Log details" onPress={() => router.push("/workout")} />
                </View>
              </>
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                <Icon name="check-circle" size={20} color={t.accent} />
                <T size={14} color={t.neutral[300]} style={{ flex: 1 }}>
                  {s.workoutDone === "mini"
                    ? "10 minutes done. Full win — that's the rule."
                    : "Worked out. Logged. Done."}
                </T>
                <Btn
                  label="undo"
                  variant="quiet"
                  size={11}
                  style={{ paddingVertical: 6, paddingHorizontal: 11 }}
                  onPress={() => s.update({ workoutDone: null })}
                />
              </View>
            )}
          </Card>
        </View>
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          gap: 10,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 10,
          borderTopWidth: 1,
          borderTopColor: t.divider,
        }}
      >
        <Btn
          label="Capture"
          variant="primary"
          icon="plus-circle"
          size={14}
          style={{ flex: 1, paddingVertical: 13 }}
          onPress={() => router.push("/capture")}
        />
        <Btn
          label="Schedule"
          icon="calendar-blank"
          size={13}
          style={{ paddingVertical: 13, paddingHorizontal: 16 }}
          onPress={() => router.push("/schedule")}
        />
        <Btn
          label="I can't today"
          variant="quiet"
          size={13}
          style={{ paddingVertical: 13, paddingHorizontal: 14 }}
          onPress={() => router.push("/crisis")}
        />
      </View>
    </Screen>
  );
}
