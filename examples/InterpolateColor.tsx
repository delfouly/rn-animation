// copy/paste this file in App.tsx and it should work
import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Switch } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";

const Colors = {
  dark: {
    background: "#1E1E1E",
    circle: "#252525",
    text: "#F8F8F8",
  },
  light: {
    background: "#F8F8F8",
    circle: "#FFF",
    text: "#1E1E1E",
  },
};

const SWITCH_TRACK_COLOR = {
  true: "rgba(256, 0, 256, 0.2)",
  false: "rgba(0,0,0,0.1)",
};

//change component name to App
export default function InterpolateColorExample() {
  const [isDark, setIsDark] = React.useState(false);

  const progress = useDerivedValue(() => {
    return isDark ? withTiming(0) : withTiming(1);
  }, [isDark]);
  const bgAnimation = useAnimatedStyle(() => {
    //this is ooe way of writing it without using interpolateColors
    // const backgroundColor =
    //   progress.value === 0
    //     ? withTiming(Colors.dark.background)
    //     : withTiming(Colors.light.background);

    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.background, Colors.dark.background]
    );

    return { backgroundColor };
  });

  const circleAnimation = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.light.circle, Colors.dark.circle]
    );

    return { backgroundColor };
  });

  const textAnimation = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        progress.value,
        [0, 1],
        [Colors.light.text, Colors.dark.text]
      ),
    };
  });
  return (
    <Animated.View style={[styles.container, bgAnimation]}>
      <Animated.Text style={[styles.text, textAnimation]}>THEME</Animated.Text>
      <Animated.View style={[styles.circle, circleAnimation]}>
        <Switch
          value={isDark}
          onValueChange={setIsDark}
          thumbColor={"violet"}
          trackColor={SWITCH_TRACK_COLOR}
        />
      </Animated.View>
      <StatusBar style="auto" />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 200 / 2,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: {
      width: 0,
      height: 20,
    },
    shadowRadius: 10,
    shadowOpacity: 0.1,
    elevation: 5,
  },
  text: {
    fontSize: 50,
    fontWeight: "700",
    marginBottom: 24,
    letterSpacing: 14,
  },
});
