import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, Field, IconBtn, Kicker, Screen, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { copy } from "@/lib/copy";
import { useStore } from "@/lib/store";
import { BLANK_DETAIL, MAX_TEMPLATES, builtInTemplates, customIcons } from "@/lib/workouts";
import type { WeekDay } from "@/lib/types";

const week: WeekDay[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const todayKey: WeekDay = week[(new Date().getDay() + 6) % 7];

export default function Workout() {
  const t = useTheme();
  const s = useStore();

  const [newOpen, setNewOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEx, setNewEx] = useState("");
  /** null = the form is creating; an id = it is editing that template. */
  const [editingTpl, setEditingTpl] = useState<string | null>(null);
  const [voice, setVoice] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const templates = Object.fromEntries(
    Object.entries({
      ...builtInTemplates,
      ...Object.fromEntries(s.customTpls.map((c) => [c.id, { ...c, custom: true }])),
    }).filter(([id]) => !s.hiddenTpls[id]),
  );
  const current = templates[s.wTemplate] ?? Object.values(templates)[0] ?? builtInTemplates.push;
  const canAdd = Object.keys(templates).length < MAX_TEMPLATES;

  const closeForm = () => {
    setNewOpen(false);
    setEditingTpl(null);
    setNewName("");
    setNewEx("");
  };

  /**
   * Editing reuses the create form rather than adding a second one. Exercise
   * detail lines already logged against a name are carried over, so renaming
   * the template does not wipe the numbers underneath it.
   */
  const openForEdit = (id: string) => {
    const tpl = templates[id];
    if (!tpl?.custom) return;
    setEditingTpl(id);
    setNewOpen(true);
    setNewName(tpl.name);
    setNewEx(tpl.ex.map(([, name]) => name).join(", "));
  };

  const buildEx = (id: string): [string, string, string][] => {
    const names = newEx.split(",").map((x) => x.trim()).filter(Boolean);
    return names.map((n, i) => [
      `${id}-${i}`,
      n.charAt(0).toUpperCase() + n.slice(1),
      s.exDetails[`${id}-${i}`] ?? BLANK_DETAIL,
    ]);
  };

  const saveTemplate = () => {
    const name = newName.trim();
    if (!name) return;

    if (editingTpl) {
      const ex = buildEx(editingTpl);
      s.update({
        customTpls: s.customTpls.map((c) =>
          c.id === editingTpl
            ? {
                ...c,
                name,
                sub: ex.length ? `${ex.length} ${ex.length === 1 ? "lift" : "lifts"} · yours` : "yours",
                ex: ex.length ? ex : [[`${editingTpl}-0`, name, "log it your way"]],
              }
            : c,
        ),
      });
      closeForm();
      s.cheer(copy.toast.templateUpdated);
      return;
    }

    if (!canAdd) return;
    const id = `c${Date.now()}`;
    const ex = buildEx(id);
    s.update({
      customTpls: [
        ...s.customTpls,
        {
          id,
          custom: true,
          name,
          icon: customIcons[s.customTpls.length % customIcons.length],
          sub: ex.length ? `${ex.length} ${ex.length === 1 ? "lift" : "lifts"} · yours` : "yours",
          ex: ex.length ? ex : [[`${id}-0`, name, "log it your way"]],
        },
      ],
      wTemplate: id,
    });
    closeForm();
    s.cheer(copy.toast.templateSaved);
  };

  /**
   * Yours are deleted outright; the built-ins are only hidden, since they are
   * code rather than data and there is nothing to delete. Either way the week
   * plan has to let go of it or the calendar points at a template that is gone.
   */
  const deleteTemplate = (id: string) => {
    const tpl = templates[id];
    if (!tpl) return;
    const weekPlan = Object.fromEntries(
      Object.entries(s.weekPlan).map(([d, v]) => [d, v === id ? null : v]),
    ) as typeof s.weekPlan;
    const remaining = Object.keys(templates).filter((x) => x !== id);

    s.update({
      weekPlan,
      customTpls: tpl.custom ? s.customTpls.filter((c) => c.id !== id) : s.customTpls,
      hiddenTpls: tpl.custom ? s.hiddenTpls : { ...s.hiddenTpls, [id]: true },
      wTemplate: s.wTemplate === id ? (remaining[0] ?? "") : s.wTemplate,
    });
    closeForm();
    s.cheer(copy.toast.templateDeleted);
  };

  return (
    <Screen>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 20, gap: 12 }}
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        keyboardDismissMode="interactive"
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label={copy.a11y.back} onPress={() => router.back()} />
          <T size={16} weight="medium">
            {copy.workout.title}
          </T>
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>{copy.workout.templatesLabel}</Kicker>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {Object.entries(templates).map(([id, tpl]) => {
              const on = id === s.wTemplate;
              return (
                <Pressable
                  key={id}
                  onPress={() => s.update({ wTemplate: id })}
                  onLongPress={() => openForEdit(id)}
                  delayLongPress={450}
                  accessibilityLabel={tpl.custom ? copy.a11y.editTemplate(tpl.name) : tpl.name}
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
                onPress={() => (newOpen ? closeForm() : setNewOpen(true))}
                accessibilityLabel={copy.a11y.newTemplate}
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
              <Field value={newName} onChangeText={setNewName} placeholder={copy.workout.newNamePlaceholder} style={{ backgroundColor: t.bg, fontSize: 12 }} />
              <Field
                value={newEx}
                onChangeText={setNewEx}
                placeholder={copy.workout.newExPlaceholder}
                style={{ backgroundColor: t.bg, fontSize: 12 }}
              />
              <Btn
                label={editingTpl ? copy.workout.updateTemplate : copy.workout.saveTemplate}
                variant="primary"
                size={12}
                style={{ paddingVertical: 9 }}
                onPress={saveTemplate}
              />
              {editingTpl ? (
                <Btn
                  label={copy.workout.deleteTemplate}
                  variant="quiet"
                  size={12}
                  style={{ paddingVertical: 9 }}
                  onPress={() => deleteTemplate(editingTpl)}
                />
              ) : null}
            </Card>
          ) : null}
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>{copy.workout.weekLabel}</Kicker>
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
                    {tpl ? tpl.name.split(" ")[0] : copy.workout.rest}
                  </T>
                </Pressable>
              );
            })}
          </View>
          <T size={10.5} color={t.neutral[600]} style={{ marginTop: 6 }}>
            {copy.workout.weekSummary(Object.values(s.weekPlan).filter(Boolean).length)}
          </T>
        </View>

        <View>
          <Kicker style={{ marginBottom: 8 }}>{copy.workout.setsLabel(current.name)}</Kicker>
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
                        placeholder={copy.workout.detailPlaceholder}
                        onBlur={() => {
                          const v = editVal.trim();
                          setEditing(null);
                          if (v) {
                            s.update({ exDetails: { ...s.exDetails, [id]: v } });
                            s.cheer(copy.toast.numbersSaved);
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
                    label={copy.a11y.lessSets(name)}
                    onPress={() => s.update({ wSets: { ...s.wSets, [id]: Math.max(0, sets - 1) } })}
                  />
                  <T size={14} weight="medium" tabular style={{ width: 52, textAlign: "center" }}>
                    {copy.workout.sets(sets)}
                  </T>
                  <IconBtn
                    icon="plus"
                    accent
                    label={copy.a11y.moreSets(name)}
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
            placeholder={copy.workout.voicePlaceholder}
            style={{ flex: 1, paddingVertical: 11, paddingHorizontal: 13 }}
            onSubmitEditing={() => {
              if (!voice.trim()) return;
              setVoice("");
              s.cheer(copy.toast.voiceLogged);
            }}
          />
          <IconBtn
            icon="microphone"
            size={44}
            label={copy.a11y.logByVoice}
            onPress={() => {
              if (!voice.trim()) return;
              setVoice("");
              s.cheer(copy.toast.voiceLogged);
            }}
          />
        </View>

        <Btn
          label={copy.workout.save}
          variant="primary"
          size={14}
          style={{ paddingVertical: 13 }}
          onPress={() => {
            s.logWorkout("full", copy.toast.workoutDetailed);
            router.back();
          }}
        />
      </ScrollView>
    </Screen>
  );
}
