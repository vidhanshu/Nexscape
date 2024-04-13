import { View, Text, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { getAllPosts } from "./appwrite";

const useAppwrite = (fn, q) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    refetch({ query: q });
  }, []);

  const refetch = ({ query } = {}) => {
    setLoading(true);
    fn?.(query)
      .then((res) => {
        setData(res);
      })
      .catch((error) => Alert.alert("Fetch error", error.message))
      .finally(() => {
        setLoading(false);
      });
  };

  return {
    data,
    loading,
    refetch,
  };
};

export default useAppwrite;
