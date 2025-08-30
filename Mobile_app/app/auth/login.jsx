import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/FontAwesome"; // For user icon


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email || !formData.password) {
      setError("Both fields are required.");
      return;
    }
    if (!emailRegex.test(formData.email)) {
      setError("Invalid Email.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/auth/login", formData);
      if (response.status === 200) {
        const data = response.data;
        const token = data.token;
        const user = data.user;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        router.replace("/home/homepage");
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  return (
    <LinearGradient
      colors={["#6286c6ff", "#3a4372ff"]} // Light background color
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 justify-center items-center p-5"
    >
      <View className="w-[420px] p-6 rounded-lg flex flex-col ">
        
        <View className="flex justify-center items-center mb-4">
          <Icon name="user" size={50} color="white" />
        </View>

        
        <Text className="text-center text-xl text-white mb-5">Login</Text>

        <View className="flex flex-col">
          {/* Email Input */}
          <View className="relative mb-4">
            <TextInput
              placeholder="Email"
              value={formData.email}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, email: text }))
              }
              autoCapitalize="none"
              keyboardType="email-address"
              required
              className="w-full h-12 pl-12 pr-4 rounded-full text-white text-base placeholder-white bg-transparent border border-white/20 outline-none focus:border-white"
            />
          </View>

          {/* Password Input */}
          <View className="relative mb-4">
            <TextInput
              placeholder="Password"
              value={formData.password}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, password: text }))
              }
              secureTextEntry={true}
              required
              className="w-full h-12 pl-12 pr-4 rounded-full text-white text-base placeholder-white bg-transparent border border-white/20 outline-none focus:border-white"
            />
          </View>

          {/* Error Message */}
          {error && <Text className="text-red-500 text-center mb-4">{error}</Text>}

          {/* Remember Me & Forgot Password */}
          <View className="flex-row justify-between items-center text-[14.5px] mb-5">
            <View className="flex-row items-center">
              
              <TouchableOpacity
                onPress={() => setRememberMe((prev) => !prev)}
                className="w-5 h-5 border border-white/50 rounded mr-2 justify-center items-center"
              >
                {rememberMe && (
                  <Icon name="check" size={14} color="white" />
                )}
              </TouchableOpacity>
              <Text className="text-white">Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text className="text-white hover:underline">Forgot Password?</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleLogin}
            className="w-full h-12 bg-sky-25 border border-white rounded-full shadow-md mb-2"
             // Simulate hover effect
                  style={{ justifyContent: "center", alignItems: "center" }}
                  >
                  <Text className="text-white text-center ">Login</Text>
                  </TouchableOpacity>

                  {/* Register */}
          <Text className="text-center text-sm text-white mt-5">
            Don't have an account?{" "}
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-white font-semibold hover:underline">Register</Text>
            </TouchableOpacity>
          </Text>

          {/* Social Login */}
          <View className="mt-4 text-center">
            <Text className="text-white flex justify-center items-center ">Or login with</Text>
            <View className="flex-row justify-center items-center gap-5 mt-2">
              <TouchableOpacity
                onPress={() => router.push("https://accounts.google.com/signin")}
                className="p-2"
              >
                <Icon name="google" size={24} color="#34A853" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("https://www.facebook.com/login")}
                className="p-2"
              >
                <Icon name="facebook" size={24} color="#072d78ff" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("https://twitter.com/login")}
                className="p-2"
              >
                <Icon name="twitter" size={24} color="#1DA1F2" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

export default Login;