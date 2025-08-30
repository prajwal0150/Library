import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";
import { LinearGradient } from "expo-linear-gradient";

const Home = () => {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black rounded-lg pt-3 m-2">
        
    <LinearGradient
      colors={["#6885e5ff", "#62708eff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      className="flex-1 p-5 pt-5 rounded-lg "
      
    >

      
      <View className="flex-row items-center justify-between ">
        <View className="flex-row items-center space-x-1">
          <Text className="text-4xl text-white font-serif font-bold">L</Text>
          <Text className="text-lg text-white font-semibold">M</Text>
          <Text className="text-lg text-white font-semibold">S</Text>
        </View>
        <View className="flex-1 mx-4">
          <TextInput
            placeholder="Search..."
            className="bg-white p-2 rounded-lg text-gray-700"
            placeholderTextColor="#6884b4ff"
          />
        </View>
        <View className="flex-row items-center space-x-4">
          <TouchableOpacity className="p-2 bg-sky-200 rounded-full">
            <Icon name="bell" size={24} color="blue" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={{ uri: "https://i.pravatar.cc/300" }} // Profile image
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </TouchableOpacity>
        </View>
      </View>

      
       <View className="flex-1 justify-center items-center">
        <Text className="text-white text-2xl  font-bold">Welcome to Our Library</Text>
      </View>
  
      <View className="flex-row justify-around items-center bg-white rounded-xl p-2 shadow-lg mt-4">
        <TouchableOpacity
          className="items-center p-2 flex-1"
          onPress={() => router.push("/home/dashboard")}
          activeOpacity={0.7} 
        >
          <Icon name="home" size={24} color="#4F46E5" />
          <Text
            className="text-sm text-gray-700"
            style={({ pressed }) => ({
              textDecorationLine: pressed ? "underline" : "none", 
              color: pressed ? "#2B6CB0" : "#4F46E5", 
            })}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center p-2 flex-1"
          onPress={() => router.push("/home/books")}
          activeOpacity={0.7}
        >
          <Icon name="book" size={24} color="#4F46E5" />
          <Text
            className="text-sm text-gray-700"
            style={({ pressed }) => ({
              textDecorationLine: pressed ? "underline" : "none",
              color: pressed ? "#2B6CB0" : "#4F46E5",
            })}
          >
            Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center p-2 flex-1"
          onPress={() => router.push("/home/about")}
          activeOpacity={0.7}
        >
          <Icon name="info-circle" size={24} color="#4F46E5" />
          <Text
            className="text-sm text-gray-700"
            style={({ pressed }) => ({
              textDecorationLine: pressed ? "underline" : "none",
              color: pressed ? "#2B6CB0" : "#4F46E5",
            })}
          >
            About Us
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="items-center p-2 flex-1"
          onPress={() => router.push("/home/contact")}
          activeOpacity={0.7}
        >
          <Icon name="envelope" size={24} color="#4F46E5" />
          <Text
            className="text-sm text-gray-700"
            style={({ pressed }) => ({
              textDecorationLine: pressed ? "underline" : "none",
              color: pressed ? "#2B6CB0" : "#4F46E5",
            })}
          >
            Contact Us
          </Text>
        </TouchableOpacity>
      </View>
      
    </LinearGradient>
    </View>
  );
};

export default Home;