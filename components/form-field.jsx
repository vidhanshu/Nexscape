import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons, images } from "../constants";

const FormField = ({
  title,
  value,
  otherStyle,
  placeholder,
  handleChangeText,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyle}`}>
      <Text className="text-base text-gray-100 font-pregular">{title}</Text>
      <View className="w-full h-12 px-4 bg-black-100 border-2 border-black-200 rounded-lg focus:border-secondary justify-center flex-row items-center">
        <TextInput
          onChangeText={handleChangeText}
          className="flex-1 text-white font-pregular text-sm"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#7b7b8b"
          secureTextEntry={title === "Password" && !showPassword}
        />
        {title == "Password" && (
          <TouchableOpacity onPress={() => setShowPassword((p) => !p)}>
            <Image
              className="w-6 h-6"
              resizeMode="contain"
              source={showPassword ? icons.eye : icons.eyeHide}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
