import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { hackerWebUrl } from "../constants/Api";

export function usePosts() {
    return useQuery(["posts"], async () => {
      const { data } = await axios.get(
        `${hackerWebUrl}/news`
      );
      return data;
    });
  }
  