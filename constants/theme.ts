/**
 * Nocturne, as this app uses it.
 *
 * The design system's own accent is a blurple (#9184d9); this app deliberately
 * overrides it with a steel that matches the neutral ramp, so in dark mode the
 * accent and neutral ramps are the same nine steps. That is not a mistake to be
 * "fixed" — a monochrome accent is what keeps the interface quiet enough to use
 * on a bad day. Light mode inverts the ramps rather than re-hueing them.
 */

export type ThemeName = "dark" | "light";

export type Theme = {
  bg: string;
  surface: string;
  text: string;
  divider: string;
  /** 100 is lightest-on-dark; the ramp darkens as the number climbs. */
  neutral: Record<100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900, string>;
  accent: string;
  accentRamp: Record<100 | 200 | 300 | 600 | 700 | 800 | 900, string>;
  /** RN has no box-shadow; on dark these are hairline borders, on light a real shadow. */
  shadowSm: { borderColor: string; borderWidth: number };
  elevation: number;
};

export const dark: Theme = {
  bg: "#18181b",
  surface: "#232326",
  text: "#e9e9ed",
  divider: "rgba(233,233,237,0.14)",
  neutral: {
    100: "#f3f5fe",
    200: "#e4e7f5",
    300: "#cfd3e5",
    400: "#b2b6ca",
    500: "#9397ab",
    600: "#75798c",
    700: "#595d6c",
    800: "#3f424d",
    900: "#292b31",
  },
  accent: "#9397ab",
  accentRamp: {
    100: "#f3f5fe",
    200: "#e4e7f5",
    300: "#cfd3e5",
    600: "#75798c",
    700: "#595d6c",
    800: "#3f424d",
    900: "#292b31",
  },
  shadowSm: { borderColor: "#3f424d", borderWidth: 1 },
  elevation: 0,
};

export const light: Theme = {
  bg: "#f1f1f4",
  surface: "#fbfbfd",
  text: "#26272e",
  divider: "rgba(38,39,46,0.14)",
  neutral: {
    100: "#26272e",
    200: "#33343c",
    300: "#44454f",
    400: "#5b5c68",
    500: "#71737f",
    600: "#8f919c",
    700: "#b3b4bd",
    800: "#d9dade",
    900: "#e9e9ee",
  },
  accent: "#595d6c",
  accentRamp: {
    100: "#1f2027",
    200: "#2e2f38",
    300: "#3f414c",
    600: "#8f919c",
    700: "#c0c1c9",
    800: "#dcdde3",
    900: "#ececf1",
  },
  shadowSm: { borderColor: "#e0e1e6", borderWidth: 1 },
  elevation: 1,
};

export const themes: Record<ThemeName, Theme> = { dark, light };

export const radius = { sm: 4, md: 8, lg: 14, pill: 999 } as const;

export const font = {
  regular: "JetBrainsMono_400Regular",
  medium: "JetBrainsMono_500Medium",
  semibold: "JetBrainsMono_600SemiBold",
} as const;

/**
 * The whole interface is lowercase. It is set once here and applied by the
 * shared <T> component rather than per-call, so a new screen cannot forget it.
 */
export const lowercase = "lowercase" as const;
