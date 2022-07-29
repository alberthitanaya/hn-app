import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import { RootTabScreenProps } from "../types";
import { usePosts } from "../hooks/usePosts";
import { PostItem } from "../components/PostItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SearchBar } from "react-native-elements";
import * as WebBrowser from "expo-web-browser";
import Modal from "react-native-modal";
import useColorScheme from "../hooks/useColorScheme";
import { CommentsList } from "../components/CommentsList";
import { Text } from "../components/Themed";

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<"Dashboard">) {
  const { status, data, error, isFetching } = usePosts();
  const insets = useSafeAreaInsets();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [postId, setPostId] = useState(0);
  const [postUrl, setPostUrl] = useState("");
  const theme = useColorScheme();

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
              <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold" }}>
                  Hacker News
                </Text>
              </View>
              <SearchBar
                platform="default"
                placeholder="Type Here..."
                onChangeText={(text) => setSearchTerm(text)}
                value={searchTerm}
                lightTheme={theme === "light"}
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
                      onPressComment={() => {
                        setModalVisible(true);
                        setPostId(item.id);
                        setPostUrl(item.url);
                      }}
                    />
                  );
                }}
              />
            </View>
          );
        }
      })()}
      <Modal
        isVisible={isModalVisible}
        presentationStyle={"fullScreen"}
        onBackdropPress={() => setModalVisible(false)}
        style={{
          width: "100%",
          marginHorizontal: 0,
          marginBottom: 0,
          marginTop: 70,
        }}
        deviceHeight={Dimensions.get("screen").height}
        deviceWidth={Dimensions.get("screen").width}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "grey",
            borderRadius: 8,
          }}
        >
          <CommentsList
            postUrl={postUrl}
            postId={postId}
            onClose={() => setModalVisible(false)}
          />
        </View>
      </Modal>
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
