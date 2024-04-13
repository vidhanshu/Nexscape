import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "../../components/logo";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import Empty from "../../components/empty";
import { getAllPosts, getLatestPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/video-card";
import { StatusBar } from "expo-status-bar";
import PageLayout from "../../components/page-layout";
import { useGlobalContext } from "../../contexts/global-provider";

const Home = () => {
  const { user } = useGlobalContext();
  const { data: posts, loading, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch();
    refetchLatestPosts();
    setRefreshing(false);
  };

  return (
    <PageLayout>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard {...item} />}
        ListHeaderComponent={() => (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome back!
                </Text>
                <Text className="text-2xl font-psemibold text-gray-100">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Logo small routable={false} />
              </View>
            </View>
            <SearchInput placeholder="Search for a video topic" />

            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
                Latest Videos
              </Text>
              <Trending posts={latestPosts} />
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

export default Home;
