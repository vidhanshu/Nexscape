import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

const CustomButton = ({
  title = "button",
  className,
  textClassName,
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={`relative bg-secondary rounded-xl h-[45px] justify-center items-center px-4 ${className} ${
        isLoading ? "opacity-50" : ""
      }`}
      disabled={disabled || isLoading}
      {...props}
    >
      <Text
        className={`text-primary font-psemibold text-base ${textClassName}`}
      >
        {title}
      </Text>
      {isLoading && (
        <ActivityIndicator className="absolute inset-0 mx-auto" color="white" />
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;
