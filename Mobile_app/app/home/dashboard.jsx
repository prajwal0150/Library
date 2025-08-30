import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ScrollView } from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Dashboard = () => {
  const [books, setBooks] = useState([]);

  
  const fetchBooks = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("https://library-1-e1mi.onrender.com/book/getAllBooks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBooks(Array.isArray(res.data.books) ? res.data.books : []);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <View className="flex-1 bg-sky-200 p-5">
    
      <View className="bg-white p-5 rounded-2xl shadow mb-4">
        <Text className="text-2xl font-bold text-gray-800">📚 Dashboard</Text>
        <Text className="text-gray-600 mt-1">Total Books: {books.length}</Text>
      </View>

     
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity
          className="flex-row items-center bg-green-500 px-4 py-3 rounded-xl flex-1 mr-2"
          onPress={() => alert("Add Book Clicked")}
        >
          <Ionicons name="add-circle" size={22} color="white" />
          <Text className="text-white font-semibold ml-2">Add Book</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center bg-blue-500 px-4 py-3 rounded-xl flex-1 ml-2"
          onPress={() => alert("Borrow Records Clicked")}
        >
          <Ionicons name="document-text" size={22} color="white" />
          <Text className="text-white font-semibold ml-2">Borrow Records</Text>
        </TouchableOpacity>
      </View>

      
      <FlatList
        data={books}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="bg-white p-4 mb-3 rounded-xl shadow">
            <View className="flex-row items-center mb-2">
              <Ionicons name="book" size={22} color="#4B5563" />
              <Text className="text-lg font-bold text-gray-800 ml-2">
                {item.title}
              </Text>
            </View>
            <Text className="text-gray-700">👨‍💼 Author: {item.author}</Text>
            <Text className="text-gray-700">📖 ISBN: {item.isbn}</Text>
            <Text className="text-gray-700">📦 Quantity: {item.quantity}</Text>
            <Text className="text-gray-700">✅ Available: {item.available}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No books available
          </Text>
        }
      />
    </View>
  );
};

export default Dashboard;
