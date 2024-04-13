import React, { useState } from "react";
import { ResizeMode, Video } from "expo-av";
import * as ImgP from "expo-image-picker";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Button,
} from "react-native";

import CustomButton from "../../components/custom-botton";
import PageLayout from "../../components/page-layout";
import FormField from "../../components/form-field";
import { icons } from "../../constants";
import { router } from "expo-router";
import { useGlobalContext } from "../../contexts/global-provider";
import { createVideo } from "../../lib/appwrite";

const defaultValues = {
  title: "",
  video: null,
  thumbnail: null,
  prompt: "",
};
const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState(defaultValues);

  const submit = async () => {
    if (!form.title || !form.video || !form.thumbnail || !form.prompt) {
      Alert.alert("All fields are required");
      return;
    }

    setUploading(true);

    try {
      await createVideo({ ...form, userId: user?.$id });
      Alert.alert("Success", "post uploaded successfully");
      setForm(defaultValues);
      router.push("/home");
    } catch (error) {
      Alert.alert("An error occurred, please try again", error.message);
    } finally {
      setUploading(false);
    }
  };
  const openPicker = async (type) => {
    const result = await ImgP.launchImageLibraryAsync({
      mediaTypes:
        type === "image"
          ? ImgP.MediaTypeOptions.Images
          : ImgP.MediaTypeOptions.Videos,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "image") {
        setForm((prev) => ({ ...prev, thumbnail: result.assets[0] }));
      }

      if (type === "video") {
        setForm((prev) => ({ ...prev, video: result.assets[0] }));
      }
    }
  };

  return (
    <PageLayout>
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-psemibold">Upload Video</Text>
        <FormField
          title="Video title"
          value={form.title}
          placeholder="Give your video a catchy title"
          handleChangeText={(title) => setForm((prev) => ({ ...prev, title }))}
          otherStyle="mt-10"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Upload video
          </Text>
          <TouchableOpacity
            className="relative"
            onPress={() => openPicker("video")}
            disabled={form.video || uploading}
          >
            {form.video ? (
              <Video
                isLooping
                useNativeControls
                source={{ uri: form.video.uri }}
                resizeMode={ResizeMode.COVER}
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border border-dashed border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}

            {uploading && (
              <ActivityIndicator
                className="absolute top-[48%] left-[47%]"
                color="#fff"
              />
            )}
          </TouchableOpacity>
          {form.video && (
            <TouchableOpacity
              onPress={() => {
                setForm((prev) => ({ ...prev, video: null }));
              }}
              className="absolute right-0 top-2 rounded-full bg-secondary-200 justify-center items-center w-8 h-8"
            >
              <Text className="text-lg text-white font-pregular">X</Text>
            </TouchableOpacity>
          )}
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-gray-100 text-base font-pmedium">
            Thumbnail image
          </Text>
          <TouchableOpacity
            className="relative"
            onPress={() => openPicker("image")}
            disabled={form.thumbnail || uploading}
          >
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                resizeMode="cover"
                className="w-full h-64 rounded-2xl"
              />
            ) : (
              <View className="relative w-full h-16 px-4 bg-black-100 rounded-2xl justify-center items-center border-2 border-black-200 flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />
                <Text className="text-sm text-gray-100 font-pmedium">
                  choose a file
                </Text>

                {uploading && (
                  <ActivityIndicator
                    className="absolute inset-0"
                    color="#fff"
                  />
                )}
              </View>
            )}

            {uploading && (
              <ActivityIndicator
                className="absolute top-[35%] left-[47%]"
                color="#fff"
              />
            )}
          </TouchableOpacity>

          {form.thumbnail && (
            <TouchableOpacity
              onPress={() => {
                setForm((prev) => ({ ...prev, thumbnail: null }));
              }}
              className="absolute right-0 top-2 rounded-full bg-secondary-200 justify-center items-center w-8 h-8"
            >
              <Text className="text-lg text-white font-pregular">X</Text>
            </TouchableOpacity>
          )}
        </View>

        <FormField
          title="Video prompt"
          value={form.prompt}
          placeholder="The prompt you used to create the video"
          handleChangeText={(prompt) =>
            setForm((prev) => ({ ...prev, prompt }))
          }
          otherStyle="mt-10"
        />

        <CustomButton
          onPress={submit}
          isLoading={uploading}
          title="Submit & Publish"
          className="mt-10"
        />
      </ScrollView>
    </PageLayout>
  );
};

export default Create;
