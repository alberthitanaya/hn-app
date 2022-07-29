import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { hackerWebUrl } from "../constants/Api";

export function useComments(postId: number) {
    return useQuery(["comments", postId], async () => {
      const { data } = await axios.get(
        `${hackerWebUrl}/item/${postId}`
      );
      return data;
    }, { enabled: !!postId });
  }
  