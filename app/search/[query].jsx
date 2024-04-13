import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Logo from "../../components/logo";
import SearchInput from "../../components/search-input";
import Trending from "../../components/trending";
import Empty from "../../components/empty";
import { getAllPosts, getLatestPosts, searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/video-card";
import PageLayout from "../../components/page-layout";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, loading, refetch } = useAppwrite(searchPosts, query);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    refetch({ query });
    setRefreshing(false);
  };

  useEffect(() => {
    refetch({ query });
  }, [query]);

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
                  Search results for:
                </Text>
                <Text className="text-2xl font-psemibold text-gray-100">
                  {query}
                </Text>
              </View>
              <View className="mt-1.5">
                <Logo small routable={false} />
              </View>
            </View>
            <SearchInput
              initialQuery={query}
              placeholder="Search for a video topic"
            />

            {loading && <ActivityIndicator color="#fff" size="large" />}
          </View>
        )}
        ListEmptyComponent={() => (
          <>
            {loading ? null : (
              <Empty
                title={`No videos found "${query ? `for ${query}` : "query"}"`}
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

export default Search;
