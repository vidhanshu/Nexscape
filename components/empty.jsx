import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "../constants";
import CustomButton from "../components/custom-botton";
import { router } from "expo-router";

const Empty = ({ title = "Data not found", subtitle, containerClassName }) => {
  return (
    <View className={`justify-center items-center px-4 ${containerClassName}`}>
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {title}
      </Text>
      {subtitle && (
        <Text className="font-pmedium text-sm text-gray-100">{subtitle}</Text>
      )}
      <CustomButton
        title="Create video"
        className="mt-4 w-full"
        onPress={() => router.push("/create")}
      />
    </View>
  );
};

export default Empty;
