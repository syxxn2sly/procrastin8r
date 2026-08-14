import { useCallback, useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";
import { router } from "expo-router";
import * as Calendar from "expo-calendar";

import { Icon } from "@/components/icon";
import { Btn, Card, CheckCircleBtn, IconBtn, Kicker, Screen, T, useTheme } from "@/components/ui";
import { fmtTime, useStore } from "@/lib/store";
import type { CustomBlock } from "@/lib/types";

type Found = {
  key: string;
  title: string;
  min: number;
  calendarTitle: string;
  /** Already on the day, so it is shown checked and importing it again is a no-op. */
  existing: boolean;
};

const minutesOf = (d: Date) => d.getHours() * 60 + d.getMinutes();

/**
 * Reads today's events and offers them as blocks. Read-only on purpose: the
 * app never writes to the calendar, so an import can always be undone by
 * removing the block, and a bug here cannot damage anything outside the app.
 */
export default function ImportCalendar() {
  const t = useTheme();
  const s = useStore();

  const [status, setStatus] = useState<"asking" | "denied" | "loading" | "ready" | "unsupported">(
    Platform.OS === "web" ? "unsupported" : "asking",
  );
  const [events, setEvents] = useState<Found[]>([]);
  const [picked, setPicked] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const { status: perm } = await Calendar.requestCalendarPermissionsAsync();
      if (perm !== "granted") {
        setStatus("denied");
        return;
      }
      setStatus("loading");

      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      if (!calendars.length) {
        setEvents([]);
        setStatus("ready");
        return;
      }

      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const raw = await Calendar.getEventsAsync(
        calendars.map((c) => c.id),
        start,
        end,
      );

      const byCalendar = new Map(calendars.map((c) => [c.id, c.title]));
      const found = raw
        // All-day events have no time to sit at, and a day-long band would
        // swamp a timeline whose whole point is where things sit in the day.
        .filter((e) => !e.allDay && e.startDate)
        .map((e): Found => {
          const startsAt = new Date(e.startDate as string);
          const min = minutesOf(startsAt);
          const title = (e.title ?? "").trim() || "untitled event";
          return {
            key: String(e.id),
            title,
            min,
            calendarTitle: byCalendar.get(e.calendarId) ?? "calendar",
            existing: s.customBlocks.some((b) => b.title === title && b.min === min),
          };
        })
        .sort((a, b) => a.min - b.min);

      setEvents(found);
      setPicked(Object.fromEntries(found.filter((f) => !f.existing).map((f) => [f.key, true])));
      setStatus("ready");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not read the calendar.");
      setStatus("ready");
    }
  }, [s.customBlocks]);

  useEffect(() => {
    if (status === "asking") load();
    // load() is only meant to run for the initial permission request; re-running
    // it on every customBlocks change would stomp the user's current selection.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const importPicked = () => {
    const chosen = events.filter((e) => picked[e.key] && !e.existing);
    if (!chosen.length) {
      router.back();
      return;
    }
    const blocks: CustomBlock[] = chosen.map((e, i) => ({
      id: `c${Date.now() + i}`,
      min: e.min,
      title: e.title,
      sub: `from ${e.calendarTitle}`,
      icon: "calendar-blank",
      kind: "school",
    }));
    s.update({ customBlocks: [...s.customBlocks, ...blocks] });
    s.cheer(`${blocks.length} ${blocks.length === 1 ? "event" : "events"} on the timeline.`);
    router.back();
  };

  const pickedCount = events.filter((e) => picked[e.key] && !e.existing).length;

  return (
    <Screen>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 14, paddingBottom: 16, gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <IconBtn icon="arrow-left" size={32} label="Back" onPress={() => router.back()} />
          <T size={16} weight="medium">
            Import from calendar
          </T>
        </View>

        {status === "unsupported" ? (
          <T size={13} color={t.neutral[400]} style={{ lineHeight: 19 }}>
            Calendar access only works in the app on your phone, not in a browser.
          </T>
        ) : null}

        {status === "loading" || status === "asking" ? (
          <T size={13} color={t.neutral[400]}>
            Reading today&apos;s events…
          </T>
        ) : null}

        {status === "denied" ? (
          <View style={{ gap: 12 }}>
            <T size={13} color={t.neutral[400]} style={{ lineHeight: 19 }}>
              Calendar access is off. You can turn it on in Settings › Procrastin8r › Calendars, or
              just add blocks by hand on the Edit day screen — nothing here depends on it.
            </T>
            <Btn label="Back to Edit day" variant="primary" onPress={() => router.back()} />
          </View>
        ) : null}

        {error ? (
          <T size={13} color={t.neutral[400]} style={{ lineHeight: 19 }}>
            {error}
          </T>
        ) : null}

        {status === "ready" && !error ? (
          events.length === 0 ? (
            <View style={{ gap: 12 }}>
              <T size={13} color={t.neutral[400]} style={{ lineHeight: 19 }}>
                Nothing timed on your calendar today. All-day events are skipped — they have no place
                to sit on a timeline.
              </T>
              <Btn label="Back to Edit day" variant="primary" onPress={() => router.back()} />
            </View>
          ) : (
            <>
              <Kicker>today&apos;s events — untick anything you don&apos;t want</Kicker>
              <ScrollView style={{ flex: 1 }} contentContainerStyle={{ gap: 8 }}>
                {events.map((e) => (
                  <Card
                    key={e.key}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 13,
                      opacity: e.existing ? 0.55 : 1,
                    }}
                  >
                    <T size={11} tabular color={t.neutral[500]} style={{ width: 44 }}>
                      {fmtTime(e.min)}
                    </T>
                    <View style={{ flex: 1 }}>
                      <T size={13.5} weight="medium" numberOfLines={2}>
                        {e.title}
                      </T>
                      <T size={11} color={t.neutral[500]}>
                        {e.existing ? "already on your day" : e.calendarTitle}
                      </T>
                    </View>
                    <CheckCircleBtn
                      size={24}
                      done={e.existing || !!picked[e.key]}
                      label={e.title}
                      onPress={() => {
                        if (e.existing) return;
                        setPicked((p) => ({ ...p, [e.key]: !p[e.key] }));
                      }}
                    />
                  </Card>
                ))}
              </ScrollView>

              <Btn
                label={
                  pickedCount === 0
                    ? "Nothing selected"
                    : `Add ${pickedCount} ${pickedCount === 1 ? "block" : "blocks"}`
                }
                variant="primary"
                size={14}
                style={{ paddingVertical: 13 }}
                disabled={pickedCount === 0}
                onPress={importPicked}
              />
              <T size={11} color={t.neutral[600]} style={{ lineHeight: 16 }}>
                Copied onto your day only. Procrastin8r never writes to your calendar.
              </T>
            </>
          )
        ) : null}

        {status === "unsupported" ? (
          <Pressable onPress={() => router.back()} style={{ paddingVertical: 8 }}>
            <T size={13} color={t.accentRamp[300]}>
              <Icon name="arrow-left" size={12} color={t.accentRamp[300]} /> back
            </T>
          </Pressable>
        ) : null}
      </View>
    </Screen>
  );
}
