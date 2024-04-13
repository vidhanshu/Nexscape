import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons, images } from "../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({
  title,
  value,
  otherStyle,
  placeholder,
  handleChangeText,
  initialQuery,
  ...props
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  return (
    <View className="w-full h-12 px-4 bg-black-100 border-2 border-black-200 rounded-lg focus:border-secondary justify-center flex-row items-center space-x-4">
      <TextInput
        onChangeText={handleChangeText}
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#CDCDE0"
        value={query}
        onChangeText={(e) => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert("Please enter a search query");
          }
          if (pathname.startsWith("/search")) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
