import React from "react";
import { Pressable, Text, View } from "react-native";
import { Avatar, Icon, ListItem } from "react-native-elements";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";

interface PostItemProps {
  item: any;
  onPressPost: () => void;
  onPressComment: () => void;
}

export const PostItem = ({
  item,
  onPressPost,
  onPressComment,
}: PostItemProps) => {
  const theme = useColorScheme();
  return (
    <ListItem
      containerStyle={{
        backgroundColor: Colors[theme].background,
      }}
      onPress={onPressPost}
    >
      <ListItem.Content>
        <ListItem.Content
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListItem.Title
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
            numberOfLines={2}
          >
            <Text style={{ color: Colors[theme].text }}>{item.title}</Text>
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Content
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ListItem.Subtitle
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "flex-start",
            }}
          >
            <Text style={{ color: Colors[theme].text }}>
              {item.time_ago} ({item.domain})
            </Text>
          </ListItem.Subtitle>
          <ListItem.Subtitle
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {/* <Text>{totalValue}</Text> */}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem.Content>
      <Avatar
        Component={() => {
          return (
            <Pressable
              onPress={onPressComment}
              style={{ paddingHorizontal: 8 }}
              hitSlop={8}
            >
              <View style={{ alignItems: "center" }}>
                <Icon
                  name="comment"
                  type="material"
                  color={Colors[theme].text}
                />
                <Text style={{ color: Colors[theme].text, marginTop: 4 }}>
                  {item.comments_count}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </ListItem>
  );
};
