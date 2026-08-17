import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Circle } from "react-native-svg";

import { Btn, Field, IconBtn, Screen, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { useStore } from "@/lib/store";

const SIZE = 200;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

/**
 * Four lengths, not a picker. 10 is the "I can't do 25 today" option and it is
 * there on purpose; 45 is for the days the wave is already going. A free-form
 * duration input would be one more decision at the exact moment the user is
 * trying to stop deciding.
 */
const PRESETS = [10, 15, 25, 45];

export default function Focus() {
  const t = useTheme();
  const s = useStore();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const task = s.tasks.find((x) => x.id === id);
  const [total, setTotal] = useState(s.focusTotalMin * 60);
  const [left, setLeft] = useState(s.focusTotalMin * 60);
  const [running, setRunning] = useState(true);
  const [interrupt, setInterrupt] = useState("");

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(tick);
  }, [running]);

  const elapsed = total - left;

  /**
   * Changing the length mid-session keeps the time already served rather than
   * starting over — you reach for this when you realise the block is the wrong
   * size, and throwing away ten minutes of work for that would teach you not
   * to touch it. The new length also becomes the default for next time.
   */
  const setMinutes = (min: number) => {
    const next = min * 60;
    setTotal(next);
    setLeft(Math.max(0, next - elapsed));
    s.update({ focusTotalMin: min });
  };

  /**
   * Extending persists too. The chip row shows the current length and the
   * label promises it sticks, so a +5 that silently reverted next time would
   * make both of those a lie.
   */
  const extend = () => {
    const next = Math.min(90, Math.round(total / 60) + 5);
    setTotal(next * 60);
    setLeft((v) => v + (next * 60 - total));
    s.update({ focusTotalMin: next });
    s.cheer("Five more. Still counts.");
  };

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = total > 0 ? 1 - left / total : 0;

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label="Back" onPress={() => router.back()} />
          <T size={16} weight="medium">
            Focus
          </T>
        </View>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 18 }}>
          <T size={14} color={t.neutral[400]} style={{ textAlign: "center", maxWidth: 260 }}>
            {task?.title ?? "Focus"}
          </T>

          <View style={{ width: SIZE, height: SIZE, alignItems: "center", justifyContent: "center" }}>
            <Svg width={SIZE} height={SIZE} style={{ position: "absolute" }}>
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke={t.neutral[900]}
                strokeWidth={STROKE}
                fill="none"
              />
              <Circle
                cx={SIZE / 2}
                cy={SIZE / 2}
                r={R}
                stroke={t.accent}
                strokeWidth={STROKE}
                fill="none"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - pct)}
                transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
              />
            </Svg>
            <T size={40} weight="medium" tabular style={{ letterSpacing: -0.8 }}>
              {mm}:{ss}
            </T>
            <T size={11} color={t.neutral[500]} style={{ letterSpacing: 1.1 }}>
              {running ? "you can see it moving" : "paused — fine"}
            </T>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Btn
              label={running ? "Pause" : "Resume"}
              variant="primary"
              size={14}
              style={{ paddingVertical: 11, paddingHorizontal: 26, borderRadius: 999 }}
              onPress={() => setRunning((v) => !v)}
            />
            <Btn
              label="+5"
              size={14}
              style={{ paddingVertical: 11, paddingHorizontal: 18, borderRadius: 999 }}
              onPress={extend}
            />
          </View>

          <View style={{ alignItems: "center", gap: 6 }}>
            <T size={10} color={t.neutral[600]} style={{ letterSpacing: 0.8 }}>
              how long — sticks for next time
            </T>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {PRESETS.map((min) => {
                const on = Math.round(total / 60) === min;
                return (
                  <Pressable
                    key={min}
                    onPress={() => setMinutes(min)}
                    accessibilityRole="button"
                    accessibilityLabel={`${min} minutes`}
                    accessibilityState={{ selected: on }}
                    style={({ pressed }) => ({
                      paddingVertical: 7,
                      paddingHorizontal: 14,
                      borderRadius: radius.pill,
                      borderWidth: 1,
                      borderColor: on ? t.accent : t.neutral[800],
                      backgroundColor: on ? t.accentRamp[900] : "transparent",
                      opacity: pressed ? 0.6 : 1,
                    })}
                  >
                    <T size={12.5} weight="medium" color={on ? t.accentRamp[200] : t.neutral[400]} tabular>
                      {min}m
                    </T>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={{ flexDirection: "row", gap: 8 }}>
          <Field
            value={interrupt}
            onChangeText={setInterrupt}
            placeholder="Stray thought? Dump it, stay on task"
            style={{ flex: 1, paddingVertical: 11, paddingHorizontal: 13 }}
            onSubmitEditing={() => {
              s.toInbox(interrupt);
              setInterrupt("");
            }}
          />
          <IconBtn
            icon="tray-arrow-down"
            size={44}
            label="Dump to inbox"
            onPress={() => {
              s.toInbox(interrupt);
              setInterrupt("");
            }}
          />
        </View>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <Btn
            label="Done"
            variant="primary"
            size={14}
            style={{ flex: 1, paddingVertical: 12 }}
            onPress={() => {
              if (task) s.completeTask(task.id);
              s.cheer();
              router.back();
            }}
          />
          {/* Bailing is a first-class outcome, not a failure state — the copy
              and the styling both have to say so, or nobody will ever tap it
              and they will just close the app instead. */}
          <Btn
            label="Bail — counts"
            variant="quiet"
            size={14}
            style={{ flex: 1, paddingVertical: 12 }}
            onPress={() => {
              s.cheer("You started. That already counts.");
              router.back();
            }}
          />
        </View>
      </View>
    </Screen>
  );
}
