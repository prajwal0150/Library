import "../global.css";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../lib/api";
import { useEffect, useState } from "react";
import { View, ActivityIndicator } from "react-native";

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");

        if (!token) {
          router.replace("/auth/login");
          return;
        }

        const response = await api.get("/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          router.replace("/home/homepage");
        } else {
          router.replace("/auth/login");
        }
      } catch {
        await AsyncStorage.removeItem("token");
        await AsyncStorage.removeItem("user");
        router.replace("/auth/login");
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return null;
}
