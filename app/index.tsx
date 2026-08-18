import { Pressable, View } from "react-native";
import { router, type Href } from "expo-router";

import { Icon } from "@/components/icon";
import { Kicker, Screen, T, useTheme } from "@/components/ui";
import { radius } from "@/constants/theme";
import { copy } from "@/lib/copy";
import { useStore } from "@/lib/store";
import type { Energy, Mode } from "@/lib/types";

const options: {
  mode: Mode;
  energy: Energy;
  icon: string;
  title: string;
  sub: string;
  route: Href;
  accentIcon?: boolean;
}[] = [
  {
    mode: "regular",
    energy: "mid",
    icon: "squares-four",
    title: copy.checkIn.regular.title,
    sub: copy.checkIn.regular.sub,
    route: "/home",
  },
  {
    mode: "blunt",
    energy: "mid",
    icon: "terminal",
    title: copy.checkIn.blunt.title,
    sub: copy.checkIn.blunt.sub,
    route: "/blunt",
    accentIcon: true,
  },
  {
    mode: "cant",
    energy: "low",
    icon: "cloud",
    title: copy.checkIn.cant.title,
    sub: copy.checkIn.cant.sub,
    route: "/crisis",
  },
];

/**
 * The check-in is one question with three answers and no wrong one. It is the
 * only gate in the app, and it exists so the rest of the interface can be
 * shaped by how much the user actually has today rather than by a default.
 */
export default function CheckIn() {
  const t = useTheme();
  const { update } = useStore();

  const pick = (o: (typeof options)[number]) => {
    update({ mode: o.mode, energy: o.energy });
    router.replace(o.route);
  };

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 28, gap: 10 }}>
        <Kicker>{copy.checkIn.kicker}</Kicker>
        <T size={28} weight="medium" style={{ letterSpacing: -0.4, marginBottom: 4 }}>
          {copy.checkIn.title}
        </T>
        <T size={13} color={t.neutral[400]} style={{ marginBottom: 18 }}>
          {copy.checkIn.sub}
        </T>

        <View style={{ gap: 10 }}>
          {options.map((o) => (
            <Pressable
              key={o.mode}
              onPress={() => pick(o)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderWidth: 1,
                borderColor: pressed ? t.accent : t.neutral[800],
                backgroundColor: pressed ? t.accentRamp[900] : "transparent",
                borderRadius: radius.md,
              })}
            >
              <Icon
                name={o.icon}
                size={22}
                color={o.accentIcon ? t.accent : t.neutral[400]}
              />
              <View style={{ flex: 1 }}>
                <T size={15} weight="medium">
                  {o.title}
                </T>
                <T size={12} color={t.neutral[500]} style={{ lineHeight: 17 }}>
                  {o.sub}
                </T>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Screen>
  );
}
