import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
} from "react-native-reanimated";

const WORDS = ["What's", "up", "mobile", "devs"];
const { width: PAGE_WIDTH } = Dimensions.get("screen");

type ContextType = {
  translateX: number;
};
const MAX_TRANSLATE_X = -PAGE_WIDTH * (WORDS.length - 1);
export default function PanGestureScroll() {
  const translateX = useSharedValue(0);
  const clampedTranslateX = useDerivedValue(() => {
    const MIN_TRANSLATE_X = Math.min(translateX.value, 0);
    return Math.max(MIN_TRANSLATE_X, MAX_TRANSLATE_X);
  });

  const panGestureEvent = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    ContextType
  >({
    onStart: (_, context) => {
      context.translateX = clampedTranslateX.value;
    },
    onActive: (event, context) => {
      translateX.value = event.translationX + context.translateX;
    },
    onEnd: (event) => {
      translateX.value = withDecay({
        velocity: event.velocityX,
        // clamp: [MAX_TRANSLATE_X, 0], //not sure
      });
    },
  });
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <PanGestureHandler onGestureEvent={panGestureEvent}>
          <Animated.View style={styles.list}>
            {WORDS.map((item, index) => (
              <Page
                title={item}
                key={index.toString()}
                index={index}
                translateX={clampedTranslateX}
              />
            ))}
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
}

type PageProps = {
  title: string;
  index: number;
  translateX: Animated.SharedValue<number>;
};

function Page({ title, index, translateX }: PageProps) {
  const pageOffset = index * PAGE_WIDTH;
  const pageAnimation = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value + pageOffset }],
    };
  });
  return (
    <Animated.View
      style={[
        styles.page,
        { backgroundColor: `rgba(0,0,250,0.${index + 1})` },
        pageAnimation,
      ]}
    >
      <Text style={styles.text}>{title}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  list: {
    flexDirection: "row",
    flex: 1,
  },
  page: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 70,
    fontWeight: "700",
    letterSpacing: 5,
    textTransform: "uppercase",
  },
});
