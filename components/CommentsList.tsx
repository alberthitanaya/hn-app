import React from "react";
import { Dimensions, FlatList, Pressable, View } from "react-native";
import { Icon } from "react-native-elements";
import RenderHTML from "react-native-render-html";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { useComments } from "../hooks/useComments";
import { Text } from "./Themed";

interface CommentsListProps {
  postId: number;
  onClose: () => void;
}
export const CommentsList = ({ postId, onClose }: CommentsListProps) => {
  const { status, data, error, isFetching } = useComments(postId);
  const theme = useColorScheme();

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
        <Text style={{ color: Colors[theme].background, fontSize: 24 }}>
          Comments
        </Text>
        <Pressable onPress={onClose} style={{ padding: 8 }}>
          <Icon name="close" type="material" color={Colors[theme].background} />
        </Pressable>
      </View>
      <FlatList
        style={{ flex: 1, paddingHorizontal: 20 }}
        data={data?.comments && data.comments.length > 0 ? data.comments : []}
        renderItem={({ item }) => {
          const commentArray = [];

          const iterate = (obj) => {
            commentArray.push({
              content: obj.content,
              level: obj.level,
              user: obj.user,
              time_ago: obj.time_ago,
            });
            obj.comments.forEach((comment) => {
              if (comment.comments.length > 0) {
                iterate(comment);
              }
            });
          };
          iterate(item);
          console.log("yo");
          console.log(commentArray);

          return (
            <>
              {commentArray.map((comment) => (
                <View style={{ paddingLeft: comment.level * 8 }}>
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: Colors[theme].background,
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
