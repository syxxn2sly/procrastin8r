import { useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";

import { Icon } from "@/components/icon";
import { Btn, Card, Field, IconBtn, Kicker, Screen, T, useTheme } from "@/components/ui";
import { useStore } from "@/lib/store";

type Step = "dump" | "q1" | "q2" | "done";

/**
 * Capture is a dump box plus exactly two questions. Two is the budget: it is
 * enough to sort today from later, and a third is where people abandon the
 * flow and the inbox silently becomes a place things go to die.
 */
export default function Capture() {
  const t = useTheme();
  const s = useStore();
  const [step, setStep] = useState<Step>("dump");
  const [text, setText] = useState("");
  const [pending, setPending] = useState("");
  const [dueSoon, setDueSoon] = useState(false);
  const [filedTo, setFiledTo] = useState<"today" | "later">("later");

  const file = (severity: "shrug" | "bad" | "verybad") => {
    setFiledTo(s.fileCapture(pending, dueSoon, severity));
    setStep("done");
  };

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label="Back" onPress={() => router.back()} />
          <T size={16} weight="medium">
            Capture
          </T>
        </View>

        {step === "dump" ? (
          <>
            <T size={13} color={t.neutral[400]}>
              Dump it. Sorting is later&apos;s problem.
            </T>
            <Field
              value={text}
              onChangeText={setText}
              placeholder="e.g. cancel the free trial"
              multiline
              textAlignVertical="top"
              style={{ minHeight: 110, fontSize: 15, padding: 13 }}
            />
            <Btn
              label="Save it"
              variant="primary"
              size={14}
              style={{ paddingVertical: 12 }}
              onPress={() => {
                const clean = text.trim();
                if (!clean) return;
                setPending(clean);
                setText("");
                setStep("q1");
              }}
            />
            {/* The "later" pile, visible and reachable. Filing something away
                only feels safe if you can see it sitting there and pull it
                back up the moment it starts to matter. */}
            {s.inbox.length ? (
              <View style={{ flex: 1, gap: 8, minHeight: 0 }}>
                <View style={{ flexDirection: "row", alignItems: "baseline", justifyContent: "space-between" }}>
                  <Kicker>later — bump one up when it starts to matter</Kicker>
                  <T size={11} color={t.neutral[600]} tabular>
                    {s.inbox.length}
                  </T>
                </View>
                <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 6 }}>
                  {s.inbox.map((item, i) => (
                    <Card
                      key={`${item}-${i}`}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                      }}
                    >
                      <T size={13} color={t.neutral[300]} style={{ flex: 1 }} numberOfLines={2}>
                        {item}
                      </T>
                      <IconBtn
                        icon="caret-up"
                        size={30}
                        accent
                        label={`Pull up ${item}`}
                        onPress={() => s.promoteFromInbox(i)}
                      />
                      <Pressable
                        onPress={() => s.removeFromInbox(i)}
                        accessibilityRole="button"
                        accessibilityLabel={`Drop ${item}`}
                        hitSlop={6}
                        style={{ width: 24, height: 24, alignItems: "center", justifyContent: "center" }}
                      >
                        <Icon name="x" size={13} color={t.neutral[600]} />
                      </Pressable>
                    </Card>
                  ))}
                </ScrollView>
                <T size={11.5} color={t.neutral[600]}>
                  They&apos;re safe here. Nothing expires.
                </T>
              </View>
            ) : (
              <T size={11.5} color={t.neutral[600]}>
                Nothing in the later pile yet. Anything you file lands here.
              </T>
            )}
          </>
        ) : null}

        {step === "q1" ? (
          <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
            <Kicker>Saved. Two questions — then it&apos;s filed.</Kicker>
            <Card>
              <T size={14.5} weight="medium">
                &quot;{pending}&quot;
              </T>
            </Card>
            <T size={21} weight="medium" style={{ marginTop: 6 }}>
              Due soon?
            </T>
            <View style={{ flexDirection: "row", gap: 10 }}>
              <Btn
                label="Yes"
                variant="primary"
                size={14}
                style={{ flex: 1, paddingVertical: 14 }}
                onPress={() => {
                  setDueSoon(true);
                  setStep("q2");
                }}
              />
              <Btn
                label="Nah"
                size={14}
                style={{ flex: 1, paddingVertical: 14 }}
                onPress={() => {
                  setDueSoon(false);
                  setStep("q2");
                }}
              />
            </View>
          </View>
        ) : null}

        {step === "q2" ? (
          <View style={{ flex: 1, justifyContent: "center", gap: 14 }}>
            <Card>
              <T size={14.5} weight="medium">
                &quot;{pending}&quot;
              </T>
            </Card>
            <T size={21} weight="medium" style={{ marginTop: 6 }}>
              If you skip it?
            </T>
            <View style={{ gap: 9 }}>
              <Btn
                label="Shrug — nothing happens"
                variant="quiet"
                size={14}
                style={{ paddingVertical: 13, justifyContent: "flex-start" }}
                onPress={() => file("shrug")}
              />
              <Btn
                label="Bad — someone's waiting on it"
                variant="quiet"
                size={14}
                style={{ paddingVertical: 13, justifyContent: "flex-start" }}
                onPress={() => file("bad")}
              />
              <Btn
                label="Very bad — real consequences"
                variant="quiet"
                size={14}
                style={{ paddingVertical: 13, justifyContent: "flex-start" }}
                onPress={() => file("verybad")}
              />
            </View>
          </View>
        ) : null}

        {step === "done" ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "flex-start", gap: 12 }}>
            <Icon name="tray-arrow-down" size={34} color={t.accent} />
            <T size={21} weight="medium">
              {filedTo === "today" ? "Filed: Today." : "Filed: Later."}
            </T>
            <T size={13} color={t.neutral[400]} style={{ lineHeight: 19 }}>
              {filedTo === "today"
                ? "It's in the Next 3 line. You'll see it when it's its turn — not before."
                : "Out of your head, off today's plate. It's in the later pile on this screen — pull it up whenever it starts to matter."}
            </T>
            <Btn
              label="Back to Today"
              variant="primary"
              size={14}
              style={{ marginTop: 8, paddingVertical: 12, paddingHorizontal: 22 }}
              onPress={() => router.back()}
            />
          </View>
        ) : null}
      </View>
    </Screen>
  );
}
