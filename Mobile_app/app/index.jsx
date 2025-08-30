import "../global.css";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Index() {
  const router = useRouter();

  const verifyToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const response = await axios.get("https://library-1-e1mi.onrender.com", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        router.replace("/home/homepage"); 
      } else {
        router.replace("/auth/login"); 
      }
    } catch (error) {
      console.error("Token verification failed:", error);
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      router.replace("/auth/login");
    } 
  };

  useEffect(() => {
    verifyToken();
  }, []);

  
    return (null);
  }



