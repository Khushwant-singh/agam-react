import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState, useContext } from "react";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import { ThemeContext, ThemeProvider } from "../context/ThemeContext"; // Remove .js

export default function App() {
  return (
    <ThemeProvider>
      <MainApp />
    </ThemeProvider>
  );
}

function MainApp() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { darkMode, toggleTheme } = useContext(ThemeContext); // Ensure darkMode exists in ThemeContext.tsx

  const handleSend = async () => {
    if (message.trim() === "") return;

    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setMessage("");

    try {
      const res = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            Authorization: `Bearer YOUR_OPENAI_API_KEY`,
            "Content-Type": "application/json",
          },
        }
      );

      const botReply = res.data.choices[0].message.content;
      setMessages([...newMessages, { role: "bot", content: botReply }]);
    } catch (error) {
      setMessages([...newMessages, { role: "bot", content: "Error: Unable to fetch response." }]);
    }
  };

  return (
    <View className={`flex-1 ${darkMode ? "bg-gray-900" : "bg-white"} p-4`}>
      <StatusBar style={darkMode ? "light" : "dark"} />
      <TouchableOpacity onPress={toggleTheme} className="p-2 bg-blue-500 rounded-lg self-end">
        <Text className="text-white">{darkMode ? "Light Mode" : "Dark Mode"}</Text>
      </TouchableOpacity>
      <Text className={`text-2xl font-bold text-center mt-10 ${darkMode ? "text-white" : "text-black"}`}>
        ChatGPT App
      </Text>
      <ScrollView className="flex-1 mt-5">
        {messages.map((msg, index) => (
          <View
            key={index}
            className={`p-3 rounded-lg my-2 ${
              msg.role === "user"
                ? "bg-blue-500 self-end"
                : darkMode
                ? "bg-gray-700 self-start"
                : "bg-gray-300 self-start"
            }`}
          >
            <Text className={darkMode ? "text-white" : "text-black"}>{msg.content}</Text>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row items-center border-t border-gray-700 p-3">
        <TextInput
          className={`flex-1 p-3 rounded-lg ${darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-black"}`}
          placeholder="Type a message..."
          placeholderTextColor="gray"
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity className="bg-blue-500 p-3 ml-2 rounded-lg" onPress={handleSend}>
          <Text className="text-white">Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
