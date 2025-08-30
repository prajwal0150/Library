import { View, Text, TextInput, TouchableOpacity, Picker } from "react-native";
import React, { useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("borrower");
  const [error, setError] = useState(null);

  const router = useRouter();

  
  const handleRegister = async () => {
  
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Invalid email address");
      return;
    }

    try {
      const response = await axios.post("https://library-1-e1mi.onrender.com/auth/register", {
        email,
        password,
        name,
        role,
      });

      if (response.status === 200 || response.status === 201) {
        const { token, user } = response.data; 
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(user));
        alert("Registration successful! Please login now.");
        router.replace("/auth/login"); 
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Registration failed"
      );
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-gray-100">
      <View className=" max-w-md bg-white p-8 rounded-2xl shadow-lg p-6">
        <Text className="text-2xl font-bold text-center text-gray-800 mb-6 p-2">
          Register a New Account
        </Text>

        

        <View className="space-y-5">
       
          <TextInput
            placeholder="Username"
            value={name}
            onChangeText={setName}
            autoCapitalize="none"
            required
            className="w-full h-10 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

        
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            required
            className="w-full h-10 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
            required
            className="w-full h-10 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <View className="w-full h-10 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 justify-center">
            <Picker
              selectedValue={role}
              onValueChange={(itemValue) => setRole(itemValue)}
              style={{ color: "#000" }} 
            >
              
              <Picker.Item label="Librarian" value="librarian" />
            </Picker>
          </View>
          {error && (
          <Text className="text-red-500 text-sm text-center mb-4">{error}</Text>
        )}

          <TouchableOpacity
            onPress={handleRegister}
            className="w-full bg-blue-500 p-2 rounded-lg"
            activeOpacity={0.7} 
          >
            <Text className="text-white text-center text-base">Register</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-blue-500 hover:underline">Login</Text>
          </TouchableOpacity>
        </Text>
      </View>
    </View>
  );
};

export default register;