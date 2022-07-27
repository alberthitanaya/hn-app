import { Picker, PickerIOS } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet } from "react-native";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Header } from "react-native-elements";
import { useNavigation } from "@react-navigation/core";

export default function TabTwoScreen() {
  const theme = useColorScheme();
  const [currency, setCurrency] = useState("aud");
  const { goBack } = useNavigation();

  useEffect(() => {
    const storedCurrency = async () => {
      const storedCurrency = await AsyncStorage.getItem("currency");
      setCurrency(storedCurrency || "usd");
    };
    storedCurrency();
  }, []);

  return (
    <View style={styles.container}>
      <Header
        backgroundColor={Colors[theme].background}
        leftComponent={{
          icon: "arrow-back",
          color: Colors[theme].text,
          onPress: () => goBack(),
        }}
        centerComponent={<Text style={styles.title}>Settings</Text>}
      />
      <View style={styles.optionContainer}>
        <Text style={styles.option}>Currency</Text>
      </View>
      <PickerIOS
        selectedValue={currency}
        onValueChange={(val) => setCurrency(val as string)}
      >
        <PickerIOS.Item color={Colors[theme].text} label="🇦🇺 AUD" value="aud" />
        <PickerIOS.Item color={Colors[theme].text} label="🇺🇸 USD" value="usd" />
      </PickerIOS>
      <Pressable
        style={({ pressed }) => ({
          ...styles.saveButton,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: Colors[theme].text,
          opacity: pressed ? 0.5 : 1,
          paddingVertical: 12,
          marginHorizontal: 20,
        })}
        onPress={async () => {
          await AsyncStorage.setItem("currency", currency);
          alert("Currency Saved!");
        }}
      >
        <Text style={styles.saveText}>Save</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  option: {
    fontSize: 16,
  },
  optionContainer: {
    marginTop: 20,
    alignItems: "flex-start",
  },
  saveButton: {
    flexDirection: "row",
    justifyContent: "center",
  },
  saveText: {
    fontSize: 16,
  },
});
