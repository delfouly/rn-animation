import * as React from "react";
import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const DATA = Array(50)
  .fill(0)
  .map((_, index) => ({ id: index }));

export default function FlatListExample() {
  const viewableItems = useSharedValue<ViewToken[]>([]);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        data={DATA}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingTop: 40 }}
        onViewableItemsChanged={({ viewableItems: vitems }) => {
          viewableItems.value = vitems;
        }}
        renderItem={({ item }) => {
          return <ListItem viewableItems={viewableItems} item={item} />;
        }}
      />
    </View>
  );
}

type ListItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  item: typeof DATA[number];
};
const ListItem = React.memo(({ viewableItems, item }: ListItemProps) => {
  const animation = useAnimatedStyle(() => {
    const isVisible = Boolean(
      viewableItems.value
        .filter((vi) => vi.isViewable)
        .find((i) => i.item.id === item.id)
    );
    return {
      opacity: withTiming(isVisible ? 1 : 0),
      transform: [{ scale: isVisible ? withTiming(1) : withTiming(0.5) }],
    };
  });

  return <Animated.View style={[styles.listItem, animation]} />;
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  listItem: {
    backgroundColor: "#78CAD2",
    marginTop: 20,
    borderRadius: 16,
    height: 50,
    width: "90%",
    alignSelf: "center",
  },
});
