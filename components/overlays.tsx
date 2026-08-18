import { useEffect, useRef } from "react";
import { Animated, View } from "react-native";
import { usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Icon } from "@/components/icon";
import { Btn, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { copy } from "@/lib/copy";
import { useStore } from "@/lib/store";

/** Praise for anything logged. Fades itself out; never needs dismissing. */
export function Toast() {
  const { toast } = useStore();
  const t = useTheme();
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fade, { toValue: toast ? 1 : 0, duration: 160, useNativeDriver: true }).start();
  }, [toast, fade]);

  if (!toast) return null;
  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        left: 24,
        right: 24,
        bottom: 96,
        opacity: fade,
        flexDirection: "row",
        alignItems: "center",
        gap: 9,
        paddingVertical: 13,
        paddingHorizontal: 16,
        backgroundColor: t.accentRamp[900],
        borderWidth: 1,
        borderColor: t.accentRamp[700],
        borderRadius: radius.md,
      }}
    >
      <Icon name="sparkle" size={16} color={t.accentRamp[300]} />
      <T size={13.5} weight="medium" color={t.accentRamp[100]} style={{ flex: 1 }}>
        {toast}
      </T>
    </Animated.View>
  );
}

/**
 * The nudge only fires on the two screens that represent "the user is looking
 * at their day". Interrupting a focus timer or a crisis screen with a reminder
 * to drink water would undo the exact thing those screens are protecting.
 */
export function Nudge() {
  const { nudge, armNudge, dismissNudge, applyNudge } = useStore();
  const t = useTheme();
  const path = usePathname();
  const insets = useSafeAreaInsets();
  const eligible = path === "/home" || path === "/blunt";

  useEffect(() => {
    if (!eligible) return;
    const id = setInterval(armNudge, 14_000);
    return () => clearInterval(id);
  }, [eligible, armNudge]);

  if (!nudge || !eligible) return null;

  return (
    <View
      style={{
        position: "absolute",
        left: 14,
        right: 14,
        // The overlay sits outside the screen's SafeAreaView, so it has to
        // clear the status bar and Dynamic Island itself — at a flat offset it
        // rendered straight over the clock.
        top: insets.top + 8,
        gap: 8,
        padding: 14,
        backgroundColor: t.surface,
        borderWidth: 1,
        borderColor: t.neutral[700],
        borderRadius: radius.lg,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
        <View
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
            backgroundColor: t.accentRamp[800],
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon name="eye" size={12} color={t.accentRamp[200]} />
        </View>
        <T size={10} color={t.neutral[500]} style={{ letterSpacing: 0.6 }}>
          {copy.nudge.from}
        </T>
      </View>
      <T size={13} weight="medium" style={{ lineHeight: 18 }}>
        {nudge.text}
      </T>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Btn label={nudge.doLabel} variant="primary" size={12} onPress={applyNudge} style={{ flex: 1 }} />
        <Btn label={copy.nudge.later} variant="quiet" size={12} onPress={() => dismissNudge(true)} />
      </View>
    </View>
  );
}
