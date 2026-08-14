import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, Field, IconBtn, Screen, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { fmtTime, useStore } from "@/lib/store";
import type { AnchorTimes } from "@/lib/types";

type Row = {
  id: keyof AnchorTimes | "wake";
  icon: string;
  label: string;
  sub: string;
  /** Wake is derived from meds rather than set directly, so it cannot be nudged. */
  fixed?: boolean;
};

export default function EditDay() {
  const t = useTheme();
  const s = useStore();
  const [newBlock, setNewBlock] = useState("");

  const rows: Row[] = [
    { id: "wake", icon: "sun-horizon", label: "Wake", sub: "anchor · everything counts from here", fixed: true },
    { id: "meds", icon: "pill", label: "Meds + breakfast", sub: "work blocks follow the peak window" },
    { id: "lunch", icon: "bowl-food", label: "Lunch", sub: "anchor · food check-in fires here" },
    {
      id: "gym",
      icon: "barbell",
      label: "Workout slot",
      sub: s.autoGym ? "auto — adjust anyway if you want" : "manual — your pick",
    },
    { id: "wind", icon: "moon-stars", label: "Wind-down", sub: "anchor · drift alerts key off this" },
  ];

  const timeOf = (r: Row) => (r.id === "wake" ? s.times.meds - 30 : s.times[r.id as keyof AnchorTimes]);

  const nudge = (r: Row, delta: number) => {
    if (r.fixed) return;
    const key = r.id as keyof AnchorTimes;
    s.update({ times: { ...s.times, [key]: s.times[key] + delta } });
  };

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label="Back" onPress={() => router.back()} />
          <T size={16} weight="medium">
            Edit day
          </T>
        </View>

        <T size={12.5} color={t.neutral[400]} style={{ lineHeight: 18 }}>
          Set the anchors once. Everything else — work blocks, meals, the gym slot — flexes around them
          on its own.
        </T>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }} keyboardShouldPersistTaps="handled">
          {rows.map((r) => (
            <Card
              key={r.id}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 13 }}
            >
              <Icon name={r.icon} size={18} color={t.accent} />
              <View style={{ flex: 1 }}>
                <T size={13.5} weight="medium">
                  {r.label}
                </T>
                <T size={11} color={t.neutral[500]}>
                  {r.sub}
                </T>
              </View>
              <IconBtn icon="caret-left" label={`${r.label} earlier`} onPress={() => nudge(r, -30)} />
              <T size={14} weight="medium" tabular style={{ width: 56, textAlign: "center" }}>
                {fmtTime(timeOf(r))}
              </T>
              <IconBtn icon="caret-right" label={`${r.label} later`} onPress={() => nudge(r, 30)} />
            </Card>
          ))}

          <View style={{ flexDirection: "row", gap: 8, paddingVertical: 2 }}>
            <Field
              value={newBlock}
              onChangeText={setNewBlock}
              placeholder="Add a block: class, shift, appointment…"
              style={{ flex: 1, paddingVertical: 11, paddingHorizontal: 13 }}
            />
            <IconBtn
              icon="plus"
              size={44}
              accent
              label="Add block"
              onPress={() => {
                const clean = newBlock.trim();
                if (!clean) return;
                s.update({
                  customBlocks: [
                    ...s.customBlocks,
                    {
                      id: `c${Date.now()}`,
                      min: 960,
                      title: clean,
                      sub: "you added this",
                      icon: "bookmark-simple",
                      kind: "school",
                    },
                  ],
                });
                setNewBlock("");
                s.cheer("On the timeline. 4:00p — nudge it anytime.");
              }}
            />
          </View>

          <Pressable
            onPress={() => s.cheer("Would open your calendar picker — events land as blocks.")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingVertical: 12,
              paddingHorizontal: 13,
              borderWidth: 1,
              borderStyle: "dashed",
              borderColor: t.neutral[700],
              borderRadius: radius.md,
            }}
          >
            <Icon name="calendar-plus" size={18} color={t.accent} />
            <T size={13} weight="medium" color={t.neutral[300]} style={{ flex: 1, lineHeight: 18 }}>
              Import a calendar (school, work) — events land as blocks
            </T>
          </Pressable>

          <Card style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 12, paddingHorizontal: 13 }}>
            <Icon name="barbell" size={18} color={s.autoGym ? t.accent : t.neutral[500]} />
            <View style={{ flex: 1 }}>
              <T size={13.5} weight="medium">
                Auto-slot the workout
              </T>
              <T size={11} color={t.neutral[500]} style={{ lineHeight: 16 }}>
                Placed from your battery + recovery. Off = you pick the time.
              </T>
            </View>
            <Pressable
              onPress={() => s.update({ autoGym: !s.autoGym })}
              accessibilityRole="switch"
              accessibilityState={{ checked: s.autoGym }}
              accessibilityLabel="Auto-slot the workout"
              style={{
                width: 46,
                height: 27,
                borderRadius: radius.pill,
                borderWidth: 1,
                borderColor: s.autoGym ? t.accentRamp[600] : t.neutral[700],
                backgroundColor: s.autoGym ? t.accentRamp[800] : "transparent",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  position: "absolute",
                  left: s.autoGym ? 23 : 3,
                  width: 19,
                  height: 19,
                  borderRadius: radius.pill,
                  backgroundColor: s.autoGym ? t.accentRamp[300] : t.neutral[600],
                }}
              />
            </Pressable>
          </Card>
        </ScrollView>

        <Btn
          label="Done — rebuild my day"
          variant="primary"
          size={14}
          style={{ paddingVertical: 13 }}
          onPress={() => router.back()}
        />
      </View>
    </Screen>
  );
}
