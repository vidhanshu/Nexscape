import React from "react";
import { StatusBar } from "expo-status-bar";
import { Redirect, router } from "expo-router";
import { View, Text, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "../components/custom-botton";
import Logo from "../components/logo";
import { useGlobalContext } from "../contexts/global-provider";

const App = () => {
  const { loading, isLoggedIn } = useGlobalContext();

  if (!loading && isLoggedIn) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full items-center min-h-[85vh] py-10 px-4 gap-y-4">
          <Logo />
          <Image
            source={images.cards}
            className="max-w-[350px] w-full h-[280px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-psemibold text-center">
              Discover Endless Possibilites with{" "}
              <Text className="text-secondary-200">Nexscape</Text>
            </Text>
            <Image
              source={images.path}
              className="w-[136px] h-[15px] absolute -bottom-2 left-14"
              resizeMode="contain"
            />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">
            Where creativity meets innovation: embark on a journey of limitless
            exploration with Nexscape
          </Text>
          <CustomButton
            className="w-full"
            onPress={() => {
              router.push("/sign-in");
            }}
            title="Continue with Email"
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default App;
