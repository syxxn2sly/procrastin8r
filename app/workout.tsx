import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, Field, IconBtn, Kicker, Screen, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { useStore } from "@/lib/store";
import { MAX_TEMPLATES, builtInTemplates, customIcons } from "@/lib/workouts";
import type { WeekDay } from "@/lib/types";

const week: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const todayKey: WeekDay = week[(new Date().getDay() + 6) % 7];

export default function Workout() {
  const t = useTheme();
  const s = useStore();

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEx, setNewEx] = useState("");
  const [voice, setVoice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const templates = { ...builtInTemplates, ...Object.fromEntries(s.customTpls.map((c) => [c.id, c])) };
  const current = templates[s.wTemplate] ?? builtInTemplates.push;
  const canAdd = Object.keys(templates).length < MAX_TEMPLATES;

  const saveNewTemplate = () => {
    const name = newName.trim();
    if (!name || !canAdd) return;
    const id = `c${Date.now()}`;
    const ex = newEx
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((n, i): [string, string, string] => [
        `${id}-${i}`,
        n.charAt(0).toUpperCase() + n.slice(1),
        "tap to add weight · reps",
      ]);

    s.update({
      customTpls: [
        ...s.customTpls,
        {
          id,
          name,
          icon: customIcons[s.customTpls.length % customIcons.length],
          sub: ex.length ? `${ex.length} ${ex.length === 1 ? "lift" : "lifts"} · yours` : "yours",
          ex: ex.length ? ex : [[`${id}-0`, name, "log it your way"]],
        },
      ],
      wTemplate: id,
    });
    setNewOpen(false);
    setNewName("");
    setNewEx("");
    s.cheer("Template saved. Tap any day below to slot it in.");
  };

  return (
    <Screen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, gap: 12 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label="Back" onPress={() => router.back()} />
          <T size={16} weight="medium">
            Log workout
          </T>
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>One tap — saved templates</Kicker>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(templates).map(([id, tpl]) => {
              const on = id === s.wTemplate;
              return (
                <Pressable
                  key={id}
                  onPress={() => s.update({ wTemplate: id })}
                  style={{
                    flexGrow: 1,
                    minWidth: 96,
                    gap: 4,
                    paddingVertical: 11,
                    paddingHorizontal: 12,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderColor: on ? t.accentRamp[700] : t.neutral[800],
                    backgroundColor: on ? t.accentRamp[900] : t.surface,
                  }}
                >
                  <Icon name={tpl.icon} size={18} color={on ? t.accentRamp[300] : t.neutral[400]} />
                  <T size={12} weight="medium">
                    {tpl.name}
                  </T>
                  <T size={10.5} color={t.neutral[500]}>
                    {tpl.sub}
                  </T>
                </Pressable>
              );
            })}
            {canAdd ? (
              <Pressable
                onPress={() => setNewOpen((v) => !v)}
                accessibilityLabel="New template"
                style={{
                  width: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  borderWidth: 1,
                  borderStyle: "dashed",
                  borderColor: t.neutral[700],
                  borderRadius: radius.md,
                }}
              >
                <Icon name={newOpen ? "x" : "plus"} size={16} color={t.neutral[400]} />
              </Pressable>
            ) : null}
          </View>

          {newOpen ? (
            <Card style={{ gap: 6, marginTop: 8 }}>
              <Field value={newName} onChangeText={setNewName} placeholder="name it — e.g. Pull day" style={{ backgroundColor: t.bg, fontSize: 12 }} />
              <Field
                value={newEx}
                onChangeText={setNewEx}
                placeholder="exercises, comma-separated — rows, curls, face pulls"
                style={{ backgroundColor: t.bg, fontSize: 12 }}
              />
              <Btn
                label="Save — it joins the day cycle below"
                variant="primary"
                size={12}
                style={{ paddingVertical: 9 }}
                onPress={saveNewTemplate}
              />
            </Card>
          ) : null}
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>this week — tap a day to choose a plan</Kicker>
          <View style={{ flexDirection: "row", gap: 6 }}>
            {week.map((d) => {
              const planned = s.weekPlan[d];
              const tpl = planned ? templates[planned] : null;
              const isToday = d === todayKey;
              return (
                <Pressable
                  key={d}
                  onPress={() => {
                    // Cycle through rest → each template → rest again, so one
                    // control sets the whole week without a picker modal.
                    const cycle: (string | null)[] = [null, ...Object.keys(templates)];
                    const next = cycle[(cycle.indexOf(planned) + 1) % cycle.length];
                    s.update({ weekPlan: { ...s.weekPlan, [d]: next } });
                  }}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    gap: 3,
                    paddingVertical: 8,
                    paddingHorizontal: 2,
                    borderRadius: radius.md,
                    borderWidth: 1,
                    borderStyle: planned || isToday ? "solid" : "dashed",
                    borderColor: isToday ? t.accentRamp[600] : planned ? t.accentRamp[800] : t.neutral[800],
                    backgroundColor: planned ? t.accentRamp[900] : "transparent",
                  }}
                >
                  <T size={10} color={isToday ? t.accentRamp[200] : t.neutral[500]}>
                    {d}
                  </T>
                  <Icon
                    name={tpl?.icon ?? "moon"}
                    size={15}
                    color={tpl ? t.accentRamp[300] : t.neutral[600]}
                  />
                  <T size={8.5} color={t.neutral[500]}>
                    {tpl ? tpl.name.split(" ")[0] : "rest"}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <T size={10.5} color={t.neutral[600]} style={{ marginTop: 6 }}>
            {Object.values(s.weekPlan).filter(Boolean).length} sessions planned · rest is a plan, not a gap
          </T>
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>{current.name} — tap to adjust, nothing required</Kicker>
          <View style={{ gap: 8 }}>
            {current.ex.map(([id, name, detail]) => {
              const sets = s.wSets[id] ?? 3;
              return (
                <Card
                  key={id}
                  style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 13 }}
                >
                  <View style={{ flex: 1 }}>
                    <T size={13.5} weight="medium">
                      {name}
                    </T>
                    {editing === id ? (
                      <Field
                        value={editVal}
                        onChangeText={setEditVal}
                        autoFocus
                        placeholder="75 lb · last: 3×8"
                        onBlur={() => {
                          const v = editVal.trim();
                          setEditing(null);
                          if (v) {
                            s.update({ exDetails: { ...s.exDetails, [id]: v } });
                            s.cheer("Numbers saved. Next time it's pre-filled.");
                          }
                        }}
                        style={{
                          marginTop: 2,
                          paddingVertical: 4,
                          paddingHorizontal: 6,
                          fontSize: 11,
                          backgroundColor: t.bg,
                          borderColor: t.accentRamp[700],
                        }}
                      />
                    ) : (
                      <Pressable
                        onPress={() => {
                          setEditing(id);
                          setEditVal(s.exDetails[id] ?? "");
                        }}
                        style={{ flexDirection: "row", alignItems: "center", gap: 5 }}
                      >
                        <T size={11} color={t.neutral[500]}>
                          {s.exDetails[id] ?? detail}
                        </T>
                        <Icon name="pencil-simple" size={10} color={t.neutral[500]} />
                      </Pressable>
                    )}
                  </View>
                  <IconBtn
                    icon="minus"
                    label={`One less set of ${name}`}
                    onPress={() => s.update({ wSets: { ...s.wSets, [id]: Math.max(0, sets - 1) } })}
                  />
                  <T size={14} weight="medium" tabular style={{ width: 52, textAlign: "center" }}>
                    {sets} sets
                  </T>
                  <IconBtn
                    icon="plus"
                    accent
                    label={`One more set of ${name}`}
                    onPress={() => s.update({ wSets: { ...s.wSets, [id]: sets + 1 } })}
                  />
                </Card>
              );
            })}
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Field
            value={voice}
            onChangeText={setVoice}
            placeholder={'Or just say it: "bench, 135 for 8"'}
            style={{ flex: 1, paddingVertical: 11, paddingHorizontal: 13 }}
            onSubmitEditing={() => {
              if (!voice.trim()) return;
              setVoice("");
              s.cheer("Logged. No typing needed.");
            }}
          />
          <IconBtn
            icon="microphone"
            size={44}
            label="Log by voice"
            onPress={() => {
              if (!voice.trim()) return;
              setVoice("");
              s.cheer("Logged. No typing needed.");
            }}
          />
        </View>

        <Btn
          label="Save — details optional, showing up is the win"
          variant="primary"
          size={14}
          style={{ paddingVertical: 13 }}
          onPress={() => {
            s.logWorkout("full", "Workout logged — details and all.");
            router.back();
          }}
        />
      </ScrollView>
    </Screen>
  );
}
