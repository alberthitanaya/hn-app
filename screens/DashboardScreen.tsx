import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RootTabScreenProps } from "../types";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePosts } from "../hooks/usePosts";
import { PostItem } from "../components/PostItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";

interface GraphValues {
  timestamp: number;
  value: number;
}

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<"Dashboard">) {
  const { status, data, error, isFetching } = usePosts();
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    if (data) {
      setFilteredData(data.filter((item) => item.title.includes(searchTerm)));
    }
  }, [searchTerm]);

  return (
    <SafeAreaView
      testID="DashboardScreen"
      style={[styles.container, { paddingTop: insets.top }]}
    >
      {(() => {
        if (status === "loading") {
          return <ActivityIndicator />;
        }
      })()}
      {(() => {
        if (status === "error") {
          return <Text>An error has occured, please try again later.</Text>;
        }
      })()}
      {(() => {
        if (status === "success") {
          return (
            <View>
              <SearchBar
                platform="default"
                placeholder="Type Here..."
                onChangeText={(text) => setSearchTerm(text)}
                value={searchTerm}
              />
              <FlatList
                data={
                  filteredData && filteredData.length > 0 ? filteredData : data
                }
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  return (
                    <PostItem
                      item={item}
                      onPressPost={async () => {
                        await WebBrowser.openBrowserAsync(item.url);
                      }}
                      onPressComment={() => {}}
                    />
                  );
                }}
              />
            </View>
          );
        }
      })()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
