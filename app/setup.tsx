import { View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, IconBtn, Kicker, Screen, T, useTheme } from "@/components/ui";
import { fmtTime, useStore } from "@/lib/store";
import type { AnchorTimes } from "@/lib/types";

const clampDay = (min: number) => Math.max(0, Math.min(23 * 60 + 30, min));

const rows: { id: keyof AnchorTimes; icon: string; label: string; sub: string }[] = [
  { id: "meds", icon: "pill", label: "Meds + breakfast", sub: "the peak window starts here" },
  { id: "lunch", icon: "bowl-food", label: "Lunch", sub: "the food check-in fires here" },
  { id: "gym", icon: "barbell", label: "Workout slot", sub: "move it any day you want" },
  { id: "wind", icon: "moon-stars", label: "Wind-down", sub: "the day stops here" },
];

/**
 * First run, and the only setup the app ever asks for. Four times is enough to
 * build a whole day around, and asking for anything more up front is how you
 * lose someone before they have used the thing once.
 */
export default function Setup() {
  const t = useTheme();
  const s = useStore();

  const nudge = (id: keyof AnchorTimes, delta: number) =>
    s.update({ times: { ...s.times, [id]: clampDay(s.times[id] + delta) } });

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 20, gap: 12 }}>
        <Kicker>First run · about 20 seconds</Kicker>
        <T size={26} weight="medium" style={{ letterSpacing: -0.4 }}>
          When does your day happen?
        </T>
        <T size={13} color={t.neutral[400]} style={{ lineHeight: 19, marginBottom: 4 }}>
          Four times. Everything else — work blocks, meals, the gym slot — gets built around them,
          and you can move any of it later.
        </T>

        <View style={{ flex: 1, gap: 8, justifyContent: "center" }}>
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
              <IconBtn icon="caret-left" label={`${r.label} earlier`} onPress={() => nudge(r.id, -30)} />
              <T size={14} weight="medium" tabular style={{ width: 56, textAlign: "center" }}>
                {fmtTime(s.times[r.id])}
              </T>
              <IconBtn icon="caret-right" label={`${r.label} later`} onPress={() => nudge(r.id, 30)} />
            </Card>
          ))}

          <T size={11.5} color={t.neutral[600]} style={{ marginTop: 4, lineHeight: 17 }}>
            Wake is set to {fmtTime(s.times.meds - 30)} — half an hour before meds. Change meds and it
            follows.
          </T>
        </View>

        <Btn
          label="That's my day"
          variant="primary"
          size={15}
          style={{ paddingVertical: 14 }}
          onPress={() => {
            s.update({ onboarded: true });
            router.replace("/");
          }}
        />
      </View>
    </Screen>
  );
}
