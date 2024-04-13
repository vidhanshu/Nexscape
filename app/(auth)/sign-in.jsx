import { Link, router } from "expo-router";
import React, { useState } from "react";
import { View, Text, ScrollView, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../../constants";
import Logo from "../../components/logo";
import CustomButtom from "../../components/custom-botton";
import FormField from "../../components/form-field";
import { getCurrentUser, signIn } from "../../lib/appwrite";
import { useGlobalContext } from "../../contexts/global-provider";

const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (!form.email || !form.password)
      return Alert.alert("Error", "Please fill in all details");

    setLoading(true);

    try {
      await signIn(form.email.trim(), form.password.trim());
      const user = await getCurrentUser();
      setUser(user);
      setIsLoggedIn(true);

      router.push("/home");
    } catch (error) {
      Alert.alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Logo />
          <FormField
            title="Email"
            otherStyle="mt-6"
            value={form.email}
            handleChangeText={(email) => setForm({ ...form, email })}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            otherStyle="mt-6"
            value={form.password}
            handleChangeText={(password) => setForm({ ...form, password })}
          />
          <CustomButtom
            onPress={submit}
            title="Sign in"
            isLoading={loading}
            className="mt-7"
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-sm text-gray-100 font-pregular">
              Don&apos;t have an account?
            </Text>
            <Link href="/sign-up">
              <Text className="text-secondary-200 font-psemibold">Sign up</Text>
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
