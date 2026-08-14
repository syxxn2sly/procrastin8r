import { useEffect, useState } from "react";
import { View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import Svg, { Circle } from "react-native-svg";

import { Btn, Field, IconBtn, Screen, T, useTheme } from "@/components/ui";
import { useStore } from "@/lib/store";

const SIZE = 200;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * R;

export default function Focus() {
  const t = useTheme();
  const s = useStore();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const task = s.tasks.find((x) => x.id === id);
  const total = s.focusTotalMin * 60;
  const [left, setLeft] = useState(total);
  const [running, setRunning] = useState(true);
  const [interrupt, setInterrupt] = useState("");

  useEffect(() => {
    if (!running) return;
    const tick = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(tick);
  }, [running]);

  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");
  const pct = 1 - left / total;

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

          <Btn
            label={running ? "Pause" : "Resume"}
            variant="primary"
            size={14}
            style={{ paddingVertical: 11, paddingHorizontal: 26, borderRadius: 999 }}
            onPress={() => setRunning((v) => !v)}
          />
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
            label="Bail — still counts"
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
