import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "@/constants/theme";

export type AppIconName =
  | "home"
  | "plus"
  | "camera"
  | "image"
  | "calendar"
  | "settings"
  | "trash"
  | "refresh"
  | "zap"
  | "file"
  | "chevronLeft"
  | "alert"
  | "clock"
  | "check"
  | "scan";

type Props = {
  name: AppIconName;
  size?: number;
  color?: string;
  accent?: string;
  stroke?: number;
  style?: StyleProp<ViewStyle>;
};

export function AppIcon({ name, size = 22, color = colors.textMuted, accent = colors.mint, stroke = 2, style }: Props) {
  const line = { backgroundColor: color, borderRadius: stroke / 2 };
  const border = { borderColor: color, borderWidth: stroke };
  const dim = { width: size, height: size };

  return (
    <View style={[styles.root, dim, style]} pointerEvents="none">
      {name === "home" ? (
        <>
          <View style={[styles.homeRoofLeft, line, { width: size * 0.46, height: stroke, left: size * 0.14, top: size * 0.31 }]} />
          <View style={[styles.homeRoofRight, line, { width: size * 0.46, height: stroke, right: size * 0.14, top: size * 0.31 }]} />
          <View style={[styles.homeBody, border, { width: size * 0.54, height: size * 0.42, left: size * 0.23, top: size * 0.44, borderTopWidth: 0 }]} />
        </>
      ) : null}

      {name === "plus" ? (
        <>
          <View style={[styles.circle, border, dim]} />
          <View style={[styles.centerLine, line, { width: size * 0.46, height: stroke }]} />
          <View style={[styles.centerLine, line, { width: stroke, height: size * 0.46 }]} />
        </>
      ) : null}

      {name === "camera" ? (
        <>
          <View style={[styles.cameraBody, border, { width: size * 0.82, height: size * 0.58, left: size * 0.09, top: size * 0.28 }]} />
          <View style={[styles.cameraTop, line, { width: size * 0.28, height: stroke, left: size * 0.2, top: size * 0.22 }]} />
          <View style={[styles.lens, { borderColor: accent, borderWidth: stroke, width: size * 0.26, height: size * 0.26, left: size * 0.37, top: size * 0.44 }]} />
        </>
      ) : null}

      {name === "image" ? (
        <>
          <View style={[styles.roundRect, border, { width: size * 0.78, height: size * 0.62, left: size * 0.11, top: size * 0.2 }]} />
          <View style={[styles.dot, { backgroundColor: accent, width: size * 0.12, height: size * 0.12, left: size * 0.24, top: size * 0.33 }]} />
          <View style={[styles.mountainLeft, line, { width: size * 0.34, height: stroke, left: size * 0.25, top: size * 0.62 }]} />
          <View style={[styles.mountainRight, line, { width: size * 0.3, height: stroke, right: size * 0.22, top: size * 0.61 }]} />
        </>
      ) : null}

      {name === "calendar" ? (
        <>
          <View style={[styles.roundRect, border, { width: size * 0.74, height: size * 0.74, left: size * 0.13, top: size * 0.16 }]} />
          <View style={[styles.calendarLine, line, { width: size * 0.74, height: stroke, left: size * 0.13, top: size * 0.38 }]} />
          <View style={[styles.dot, { backgroundColor: accent, width: size * 0.1, height: size * 0.1, left: size * 0.32, top: size * 0.58 }]} />
          <View style={[styles.dot, { backgroundColor: color, width: size * 0.1, height: size * 0.1, right: size * 0.32, top: size * 0.58 }]} />
        </>
      ) : null}

      {name === "settings" ? (
        <>
          <View style={[styles.lens, border, { width: size * 0.34, height: size * 0.34, left: size * 0.33, top: size * 0.33 }]} />
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <View
              key={i}
              style={[
                styles.tick,
                line,
                {
                  width: stroke,
                  height: size * 0.18,
                  left: size / 2 - stroke / 2,
                  top: size * 0.06,
                  transform: [{ rotate: `${i * 60}deg` }, { translateY: -size * 0.02 }]
                }
              ]}
            />
          ))}
        </>
      ) : null}

      {name === "trash" ? (
        <>
          <View style={[styles.trashLid, line, { width: size * 0.54, height: stroke, left: size * 0.23, top: size * 0.24 }]} />
          <View style={[styles.trashTop, line, { width: size * 0.22, height: stroke, left: size * 0.39, top: size * 0.16 }]} />
          <View style={[styles.trashCan, border, { width: size * 0.46, height: size * 0.54, left: size * 0.27, top: size * 0.34, borderTopWidth: 0 }]} />
        </>
      ) : null}

      {name === "refresh" ? (
        <>
          <View style={[styles.circle, border, { width: size * 0.72, height: size * 0.72, left: size * 0.14, top: size * 0.14, borderLeftColor: "transparent" }]} />
          <View style={[styles.refreshHead, line, { width: size * 0.2, height: stroke, right: size * 0.13, top: size * 0.2 }]} />
        </>
      ) : null}

      {name === "zap" ? (
        <>
          <View style={[styles.zapOne, line, { width: size * 0.42, height: stroke, left: size * 0.31, top: size * 0.32 }]} />
          <View style={[styles.zapTwo, line, { width: size * 0.42, height: stroke, left: size * 0.25, top: size * 0.58 }]} />
          <View style={[styles.dot, { backgroundColor: accent, width: size * 0.12, height: size * 0.12, right: size * 0.2, top: size * 0.18 }]} />
        </>
      ) : null}

      {name === "file" ? (
        <>
          <View style={[styles.roundRect, border, { width: size * 0.64, height: size * 0.78, left: size * 0.2, top: size * 0.1 }]} />
          <View style={[styles.fileLine, line, { width: size * 0.34, height: stroke, left: size * 0.33, top: size * 0.42 }]} />
          <View style={[styles.fileLine, line, { width: size * 0.28, height: stroke, left: size * 0.33, top: size * 0.58 }]} />
        </>
      ) : null}

      {name === "chevronLeft" ? (
        <>
          <View style={[styles.chevTop, line, { width: size * 0.42, height: stroke, left: size * 0.3, top: size * 0.36 }]} />
          <View style={[styles.chevBottom, line, { width: size * 0.42, height: stroke, left: size * 0.3, top: size * 0.62 }]} />
        </>
      ) : null}

      {name === "alert" ? (
        <>
          <View style={[styles.circle, border, dim]} />
          <View style={[styles.centerLine, line, { width: stroke, height: size * 0.32, top: size * 0.24 }]} />
          <View style={[styles.dot, { backgroundColor: color, width: size * 0.1, height: size * 0.1, left: size * 0.45, top: size * 0.68 }]} />
        </>
      ) : null}

      {name === "clock" ? (
        <>
          <View style={[styles.circle, border, dim]} />
          <View style={[styles.clockHandTall, line, { width: stroke, height: size * 0.28, left: size * 0.49, top: size * 0.24 }]} />
          <View style={[styles.clockHandWide, line, { width: size * 0.22, height: stroke, left: size * 0.5, top: size * 0.5 }]} />
        </>
      ) : null}

      {name === "check" ? (
        <>
          <View style={[styles.checkShort, line, { width: size * 0.28, height: stroke, left: size * 0.2, top: size * 0.56 }]} />
          <View style={[styles.checkLong, line, { width: size * 0.5, height: stroke, left: size * 0.38, top: size * 0.48 }]} />
        </>
      ) : null}

      {name === "scan" ? (
        <>
          <View style={[styles.corner, border, { left: size * 0.12, top: size * 0.12, borderRightWidth: 0, borderBottomWidth: 0 }]} />
          <View style={[styles.corner, border, { right: size * 0.12, top: size * 0.12, borderLeftWidth: 0, borderBottomWidth: 0 }]} />
          <View style={[styles.corner, border, { left: size * 0.12, bottom: size * 0.12, borderRightWidth: 0, borderTopWidth: 0 }]} />
          <View style={[styles.corner, border, { right: size * 0.12, bottom: size * 0.12, borderLeftWidth: 0, borderTopWidth: 0 }]} />
          <View style={[styles.centerLine, { backgroundColor: accent, width: size * 0.58, height: stroke }]} />
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center"
  },
  circle: {
    position: "absolute",
    borderRadius: 999
  },
  roundRect: {
    position: "absolute",
    borderRadius: 5
  },
  centerLine: {
    position: "absolute",
    left: "50%",
    top: "50%",
    transform: [{ translateX: -0.5 }, { translateY: -0.5 }]
  },
  dot: {
    position: "absolute",
    borderRadius: 999
  },
  homeRoofLeft: { position: "absolute", transform: [{ rotate: "-38deg" }] },
  homeRoofRight: { position: "absolute", transform: [{ rotate: "38deg" }] },
  homeBody: { position: "absolute", borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  cameraBody: { position: "absolute", borderRadius: 6 },
  cameraTop: { position: "absolute" },
  lens: { position: "absolute", borderRadius: 999 },
  mountainLeft: { position: "absolute", transform: [{ rotate: "-42deg" }] },
  mountainRight: { position: "absolute", transform: [{ rotate: "38deg" }] },
  calendarLine: { position: "absolute" },
  tick: { position: "absolute" },
  trashLid: { position: "absolute" },
  trashTop: { position: "absolute" },
  trashCan: { position: "absolute", borderBottomLeftRadius: 4, borderBottomRightRadius: 4 },
  refreshHead: { position: "absolute", transform: [{ rotate: "35deg" }] },
  zapOne: { position: "absolute", transform: [{ rotate: "-62deg" }] },
  zapTwo: { position: "absolute", transform: [{ rotate: "-62deg" }] },
  fileLine: { position: "absolute" },
  chevTop: { position: "absolute", transform: [{ rotate: "-45deg" }] },
  chevBottom: { position: "absolute", transform: [{ rotate: "45deg" }] },
  clockHandTall: { position: "absolute" },
  clockHandWide: { position: "absolute" },
  checkShort: { position: "absolute", transform: [{ rotate: "42deg" }] },
  checkLong: { position: "absolute", transform: [{ rotate: "-48deg" }] },
  corner: {
    position: "absolute",
    width: "28%",
    height: "28%"
  }
});
