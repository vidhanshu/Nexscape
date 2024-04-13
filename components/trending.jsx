import { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { icons } from "../constants";
import { ResizeMode, Video } from "expo-av";

const zoomIn = { 0: { scale: 0.9 }, 1: { scale: 1 } };
const zoomOut = { 0: { scale: 1 }, 1: { scale: 0.9 } };

const TrendingItem = ({ activeItem, $id, thumbnail, video }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === $id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.CONTAIN}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
          source={{ uri: video }}
        />
      ) : (
        <TouchableOpacity
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground
            resizeMode="cover"
            source={{ uri: thumbnail }}
            className="w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
          />

          <Image
            source={icons.play}
            className="absolute w-12 h-12"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};
const Trending = ({ posts = [] }) => {
  const [active, setActive] = useState(posts[0]?.$id);

  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 50 });

  const viewableItemsChange = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActive(viewableItems[0].item.$id);
    }
  };

  return (
    <FlatList
      data={posts}
      horizontal
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => <TrendingItem activeItem={active} {...item} />}
      onViewableItemsChanged={viewableItemsChange}
      viewabilityConfig={viewConfigRef.current}
      contentOffset={{ x: 170 }}
    />
  );
};

export default Trending;
