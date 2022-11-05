// copy/paste this file in App.tsx and it should work
import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, View } from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

const SIZE = 200;
const WORDS = ["What's", "up", "mobile", "devs"];
const { width, height } = Dimensions.get("window");

//change component name to App
export default function InterpolateExample() {
  const translateX = useSharedValue(0);

  const scrollhandler = useAnimatedScrollHandler((event) => {
    translateX.value = event.contentOffset.x;
  });
  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        onScroll={scrollhandler}
        scrollEventThrottle={16}
      >
        {WORDS.map((item, index) => (
          <Page
            key={index}
            index={index}
            title={item}
            translateX={translateX}
          />
        ))}
      </Animated.ScrollView>
      <StatusBar style="auto" />
    </View>
  );
}

type PageProps = {
  title: string;
  index: number;
  translateX: Animated.SharedValue<number>;
};
function Page({ title, index, translateX }: PageProps) {
  const input = [(index - 1) * width, index * width, (index + 1) * width];
  const squareAnimation = useAnimatedStyle(() => {
    const scale = interpolate(
      translateX.value,
      input,
      [0, 1, 0],
      Extrapolate.CLAMP
    );
    const borderRadius = interpolate(
      translateX.value,
      input,
      [0, SIZE / 2, 0],
      Extrapolate.CLAMP
    );
    return {
      transform: [{ scale }],
      borderRadius,
    };
  });

  const textAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      input,
      [-2, 1, -2],
      Extrapolate.CLAMP
    );
    const translateY = interpolate(
      translateX.value,
      input,
      [-height / 2, 0, height / 2],
      Extrapolate.CLAMP
    );

    return { opacity, transform: [{ translateY }] };
  });
  return (
    <View
      style={[styles.page, { backgroundColor: `rgba(0,0,250,${index * 0.1})` }]}
    >
      <Animated.View style={[styles.square, squareAnimation]}>
        <Animated.Text style={[styles.text, textAnimation]}>
          {title}
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  page: {
    flex: 1,
    width,
    height,
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    borderRadius: 20,
    backgroundColor: "blue",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontWeight: "700",
    textTransform: "uppercase",
    fontSize: 50,
  },
});
