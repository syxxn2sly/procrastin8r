import { View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, Kicker, Screen, T, useTheme } from "@/components/ui";
import { useStore } from "@/lib/store";

/**
 * Low-capacity mode. Three things, any one of which is a win, and no route to
 * the rest of the app except a deliberate one. The point is not to do less —
 * it is that a list you cannot face gets you zero, and three things gets you
 * more than zero.
 */
export default function Crisis() {
  const t = useTheme();
  const s = useStore();

  const anchor = s.anchors[s.anchors.length - 1];

  return (
    <Screen>
      <View style={{ flex: 1, justifyContent: "center", paddingHorizontal: 26, gap: 16 }}>
        <Kicker>Low-capacity mode</Kicker>
        <T size={24} weight="medium" style={{ letterSpacing: -0.35 }}>
          Everything else is gone until you say so.
        </T>
        <T size={13} color={t.neutral[400]} style={{ marginBottom: 6 }}>
          Three things. Any one of them is a win.
        </T>

        <View style={{ gap: 10 }}>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 15 }}>
            <Icon name="bowl-food" size={20} color={t.accent} />
            <T size={14.5} weight="medium" style={{ flex: 1 }}>
              Eat one thing
            </T>
            <Btn
              label={s.crisisAte ? "Done ✓" : "Ate"}
              variant="primary"
              size={12.5}
              style={{ paddingVertical: 8, paddingHorizontal: 14 }}
              onPress={() => {
                s.update({ crisisAte: true, food: s.food ?? "ate" });
                s.cheer("That's the big one. Rest is optional.");
              }}
            />
          </Card>

          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 15 }}>
            <Icon name="drop" size={20} color={t.accent} />
            <T size={14.5} weight="medium" style={{ flex: 1 }}>
              Water · {s.water}
            </T>
            <Btn
              label="+1"
              variant="primary"
              size={12.5}
              style={{ paddingVertical: 8, paddingHorizontal: 14 }}
              onPress={s.addWater}
            />
          </Card>

          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, padding: 15 }}>
            <Icon name="anchor-simple" size={20} color={t.accent} />
            <T size={14.5} weight="medium" style={{ flex: 1 }}>
              {anchor?.label ?? "Wind-down"}
            </T>
            <Btn
              label={s.crisisAnchorDone ? "Done ✓" : "Done"}
              variant="primary"
              size={12.5}
              style={{ paddingVertical: 8, paddingHorizontal: 14 }}
              onPress={() => {
                s.update({ crisisAnchorDone: true });
                if (anchor && !anchor.done) s.toggleAnchor(anchor.id);
                else s.cheer("Anchor held on a bad day. Huge.");
              }}
            />
          </Card>
        </View>

        <Btn
          label="Bring the rest back"
          variant="quiet"
          style={{ marginTop: 10, paddingVertical: 12 }}
          onPress={() => {
            s.update({ mode: "regular", energy: "mid" });
            router.replace("/home");
          }}
        />
      </View>
    </Screen>
  );
}
