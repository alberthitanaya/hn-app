import React from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  Pressable,
  Share,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import RenderHTML from "react-native-render-html";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useComments } from "../hooks/useComments";
import { Text } from "./Themed";

interface CommentsListProps {
  postId: number;
  postUrl: string;
  onClose: () => void;
}
export const CommentsList = ({
  postId,
  onClose,
  postUrl,
}: CommentsListProps) => {
  const { status, data, error, isFetching } = useComments(postId);
  const theme = useColorScheme();

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `See this post I found on Hacker News! ${postUrl}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        }
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          marginHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={{ color: Colors[theme].text, fontSize: 24 }}>
          Comments
        </Text>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={onShare} style={{ padding: 8 }}>
            <Icon
              name={Platform.OS === "ios" ? "ios-share" : "share"}
              type="material"
              color={Colors[theme].text}
            />
          </Pressable>
          <Pressable onPress={onClose} style={{ padding: 8 }}>
            <Icon name="close" type="material" color={Colors[theme].text} />
          </Pressable>
        </View>
      </View>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 20 }}
        contentContainerStyle={{ paddingVertical: 20 }}
        data={data?.comments && data.comments.length > 0 ? data.comments : []}
        renderItem={({ item }) => {
          const commentArray = [];

          const iterate = (obj) => {
            commentArray.push({
              content: obj.content,
              level: obj.level,
              user: obj.user,
              time_ago: obj.time_ago,
              points: obj.points,
            });
            obj.comments.forEach((comment) => {
              iterate(comment);
            });
          };
          iterate(item);

          return (
            <>
              {commentArray.map((comment) => (
                <View style={{ paddingLeft: comment.level * 8 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: Colors[theme].text,
                    }}
                  >
                    {comment.user} {comment.time_ago}
                  </Text>
                  <View>
                    <RenderHTML
                      contentWidth={Dimensions.get("screen").width - 20}
                      source={{ html: comment.content.substr(3) }} // get rid of <p> at start of comment
                    />
                  </View>
                </View>
              ))}
            </>
          );
        }}
      />
    </View>
  );
};
