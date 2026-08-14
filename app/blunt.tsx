import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Field, Screen, T, useTheme } from "@/components/ui";
import { useStore } from "@/lib/store";

/**
 * The blunt list is the same data as Home with everything decorative removed.
 * No cards, no progress, no praise on screen — just numbered lines. It exists
 * for the days when the regular interface reads as noise.
 */
export default function Blunt() {
  const t = useTheme();
  const s = useStore();
  const [taskIn, setTaskIn] = useState("");

  const bluntFood =
    s.food === null ? "none yet" : s.food === "skipped" ? "skipped" : "handled";

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 18, paddingBottom: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <T size={12} color={t.neutral[500]}>
            the list.
          </T>
          <Pressable onPress={() => router.replace("/")} hitSlop={8}>
            <T size={11} color={t.neutral[600]}>
              mode
            </T>
          </Pressable>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingTop: 8 }}
          keyboardShouldPersistTaps="handled"
        >
          {s.tasks.map((task, i) => (
            <Pressable
              key={task.id}
              onPress={() => s.toggleTask(task.id)}
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                gap: 12,
                paddingVertical: 12,
                paddingHorizontal: 4,
                borderBottomWidth: 1,
                borderBottomColor: t.divider,
              }}
            >
              <T size={13} color={task.done ? t.neutral[700] : t.accentRamp[300]} tabular>
                {String(i + 1).padStart(2, "0")}
              </T>
              <T
                size={17}
                weight="medium"
                color={task.done ? t.neutral[600] : t.text}
                style={[{ flex: 1 }, task.done ? { textDecorationLine: "line-through" } : null]}
              >
                {task.title}
              </T>
            </Pressable>
          ))}

          <View style={{ flexDirection: "row", gap: 6, paddingTop: 12, paddingBottom: 4 }}>
            <Field
              value={taskIn}
              onChangeText={setTaskIn}
              onSubmitEditing={() => {
                s.addTask(taskIn);
                setTaskIn("");
              }}
              placeholder="+ add"
              style={{
                flex: 1,
                fontSize: 14,
                backgroundColor: "transparent",
                borderWidth: 0,
                borderBottomWidth: 1,
                borderBottomColor: t.neutral[800],
                borderRadius: 0,
                paddingHorizontal: 4,
              }}
            />
            <Pressable
              onPress={() => {
                s.addTask(taskIn);
                setTaskIn("");
              }}
              accessibilityRole="button"
              accessibilityLabel="Add task"
              style={{ width: 34, alignItems: "center", justifyContent: "center" }}
            >
              <Icon name="plus" size={16} color={t.neutral[400]} />
            </Pressable>
          </View>
        </ScrollView>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            borderTopWidth: 1,
            borderTopColor: t.divider,
            paddingTop: 12,
          }}
        >
          <T size={12} color={t.neutral[400]}>
            water: {s.water}
          </T>
          <Pressable
            onPress={s.addWater}
            style={{
              borderWidth: 1,
              borderColor: t.neutral[700],
              borderRadius: 8,
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}
          >
            <T size={11} weight="medium" color={t.neutral[300]}>
              +1
            </T>
          </Pressable>
          <T size={12} color={t.neutral[400]} style={{ flex: 1, textAlign: "right" }}>
            food: {bluntFood}
          </T>
          {s.food === null ? (
            <Pressable
              onPress={() => s.logFood("ate")}
              style={{
                borderWidth: 1,
                borderColor: t.neutral[700],
                borderRadius: 8,
                paddingVertical: 5,
                paddingHorizontal: 10,
              }}
            >
              <T size={11} weight="medium" color={t.neutral[300]}>
                ate
              </T>
            </Pressable>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}
