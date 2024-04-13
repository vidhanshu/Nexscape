import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../components/logo";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import Empty from "../../components/empty";
import { useGlobalContext } from "../../contexts/global-provider";
import {
  getAllPosts,
  getLatestPosts,
  getUserposts,
  searchPosts,
  signOut,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/video-card";
import PageLayout from "../../components/page-layout";
import { icons } from "../../constants";
import InfoBox from "../../components/infobox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, setIsLoggedIn } = useGlobalContext();
  const {
    data: posts,
    loading,
    refetch,
  } = useAppwrite(getUserposts, user?.$id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch({ query: user?.$id });
    setRefreshing(false);
  };

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false);

    router.replace("/sign-in");
  };

  return (
    <PageLayout>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard {...item} />}
        ListHeaderComponent={() => (
          <View className="w-full mt-6 mb-12 justify-center items-center">
            <TouchableOpacity
              onPress={logout}
              className="w-full items-end mb-10 mr-4"
            >
              <Image
                source={icons.logout}
                resizeMode="contain"
                className="w-6 h-6"
              />
            </TouchableOpacity>

            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image
                source={{ uri: user?.avatar }}
                className="w-[90%] h-[90%] rounded-lg"
                resizeMode="cover"
              />
            </View>

            <InfoBox
              title={user?.username}
              containerClassName="mt-5"
              titleClassName="text-lg"
            />

            <View className="flex-row">
              <InfoBox
                title={posts.length || 0}
                subtitle="Posts"
                containerClassName="mr-10"
                titleClassName="text-xl"
              />

              <InfoBox
                title="1.2k"
                subtitle="Followers"
                titleClassName="text-xl"
              />
            </View>
            {loading && (
              <ActivityIndicator className="mt-4" color="#fff" size="large" />
            )}
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {loading ? null : (
              <Empty
                containerClassName="mb-8"
                title="No videos found"
                subtitle="Be the first one to upload a video"
              />
            )}
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </PageLayout>
  );
};

export default Profile;
