import { useNavigation, useRoute } from "@react-navigation/core";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { Header } from "react-native-elements";
import { CryptoLineChart } from "../components/CryptoLineChart";
import { Text, View } from "../components/Themed";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import { RootStackScreenProps } from "../types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "react-native-gesture-handler";
import balancesJson from "../constants/balances.json";
import { coingeckoUrl } from "../constants/Api";
import UniswapIcon from "../assets/icons/UniswapIcon";
import EthereumIcon from "../assets/icons/EthereumIcon";
import DogecoinIcon from "../assets/icons/DogecoinIcon";
import LunaIcon from "../assets/icons/LunaIcon";
import SafemoonIcon from "../assets/icons/SafemoonIcon";
import LitecoinIcon from "../assets/icons/LitecoinIcon";
import DashIcon from "../assets/icons/DashIcon";

interface CoinData {
  title: string;
  value: string;
  textColor?: string;
}

const iconMap = {
  uniswap: <UniswapIcon />,
  ethereum: <EthereumIcon />,
  dogecoin: <DogecoinIcon />,
  "terra-luna": <LunaIcon />,
  safemoon: <SafemoonIcon />,
  litecoin: <LitecoinIcon />,
  dash: <DashIcon />,
};

export default function ModalScreen({
  navigation,
}: RootStackScreenProps<"CoinDetail">) {
  const route: any = useRoute();
  const theme = useColorScheme();
  const [coinData, setCoinData] = useState<CoinData[][]>();
  const [marketData, setMarketData] = useState();
  const [coinName, setCoinName] = useState("");
  const [coinPrice, setCoinPrice] = useState("");
  const [chartDays, setChartDays] = useState(1);
  const [loading, setLoading] = useState(false);
  const { goBack } = useNavigation();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const currency = (await AsyncStorage.getItem("currency")) || "aud";
        const url = `${coingeckoUrl}coins/${route.params.id}/market_chart?vs_currency=${currency}&days=${chartDays}`;
        const response = await fetch(url);
        const json = await response.json();
        setMarketData(
          json.prices.map((price: any) => {
            return {
              timestamp: price[0],
              value: price[1],
            };
          })
        );
      } catch (error) {
        alert("An network error has occurred, please refresh to try again");
        console.log("error", error);
      }
    };

    fetchData();
  }, [chartDays]);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const currency = (await AsyncStorage.getItem("currency")) || "aud"; //country.currency;
      const url = `https://api.coingecko.com/api/v3/coins/${route.params.id}/`;
      const formatter = new Intl.NumberFormat("en-US", {
        currency,
        style: "currency",
      });
      const response = await fetch(url);
      const json = await response.json();
      const balance = balancesJson[
        balancesJson.length - 1
      ].balancesByCurrency.find(
        (bal) => bal.currency.id === route.params.id
      )?.balance;
      setCoinPrice(formatter.format(json.market_data.current_price[currency]));
      setCoinName(json.name);
      setCoinData([
        [
          {
            title: "Quantity",
            value: (balance || "") as string,
          },
          {
            title: "Market Value (MKTV)",
            value: formatter.format(
              json.market_data.current_price[currency] * (balance || 0)
            ),
          },
        ],
        [
          {
            title: "MKTV Change (24hr)",
            value: formatter.format(
              (balance || 0) *
                json.market_data.price_change_24h_in_currency[currency]
            ),
            textColor:
              (balance || 0) *
                json.market_data.price_change_24h_in_currency[currency] >
              0
                ? "green"
                : "red",
          },
          {
            title: "% Price Change (7d)",
            value: `${json.market_data.price_change_percentage_7d_in_currency[currency]}%`,
            textColor:
              json.market_data.price_change_percentage_7d_in_currency[
                currency
              ] > 0
                ? "green"
                : "red",
          },
        ],
        [
          {
            title: "$ Price Change (24h)",
            value: formatter.format(
              json.market_data.price_change_24h_in_currency[currency]
            ),
            textColor:
              json.market_data.price_change_24h_in_currency[currency] > 0
                ? "green"
                : "red",
          },
          {
            title: "% Price Change (24h)",
            value: `${json.market_data.price_change_percentage_24h_in_currency[currency]}%`,
            textColor:
              json.market_data.price_change_percentage_24h_in_currency[
                currency
              ] > 0
                ? "green"
                : "red",
          },
        ],
        [
          {
            title: "Market Cap",
            value: formatter.format(json.market_data.market_cap[currency]),
          },
          {
            title: "Total Volume (24h)",
            value: formatter.format(json.market_data.total_volume[currency]),
          },
        ],
      ]);
      setLoading(false);
    } catch (error) {
      alert("An network error has occurred, please refresh to try again");
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      fetchDetails();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  if (!coinData) {
    return <ActivityIndicator />;
  }

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={loading} onRefresh={fetchDetails} />
      }
      contentContainerStyle={{
        ...styles.container,
        backgroundColor: Colors[theme].background,
      }}
    >
      <Header
        backgroundColor={Colors[theme].background}
        leftComponent={{
          icon: "arrow-back",
          color: Colors[theme].text,
          onPress: () => goBack(),
        }}
      />
      <View style={styles.headerContainer}>
        {iconMap[route.params.id]}
        <Text style={styles.title1}>{coinName}</Text>
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.subtitle}>{coinPrice}</Text>
      </View>
      <CryptoLineChart data={marketData || []} />
      <View style={{ flexDirection: "row" }}>
        {/* Map row of buttons to change graph range */}
        {[1, 7, 30].map((days) => {
          return (
            <Pressable
              key={days}
              onPress={() => setChartDays(days)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                ...styles.graphButton,
              })}
            >
              <Text
                style={{ fontWeight: chartDays === days ? "600" : undefined }}
              >
                {days}D
              </Text>
            </Pressable>
          );
        })}
      </View>
      {/* Map coindata to title/value views */}
      {coinData &&
        coinData.map((item) => (
          <View style={styles.rowContainer}>
            <View style={styles.detailItemsContainer}>
              <Text style={styles.detailItemsTitle}>{item[0].title}</Text>
              <Text
                style={{
                  ...styles.detailItemsValue,
                  color: item[0].textColor || Colors[theme].text,
                }}
              >
                {item[0].value}
              </Text>
            </View>
            <View style={styles.detailItemsContainer}>
              <Text style={styles.detailItemsTitle}>{item[1].title}</Text>
              <Text
                style={{
                  ...styles.detailItemsValue,
                  color: item[1].textColor || Colors[theme].text,
                }}
              >
                {item[1].value}
              </Text>
            </View>
          </View>
        ))}
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingBottom: Platform.OS === "ios" ? 36 : 0,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  graphButton: {
    alignItems: "center",
    flex: 1,
    paddingVertical: 12,
  },
  detailItemsContainer: { flex: 1, marginLeft: 12 },
  detailItemsTitle: { fontSize: 16, fontWeight: "600" },
  detailItemsValue: { fontSize: 16, marginTop: 8 },
  rowContainer: { flexDirection: "row", marginTop: 12 },
  title1: {
    marginLeft: 6,
    fontSize: 24,
    lineHeight: 30,
    fontWeight: "800",
    letterSpacing: -0.12, // -1%
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: "600",
    letterSpacing: -0.12, // -1%
  },
  titleContainer: {
    marginHorizontal: 20,
  },
  headerContainer: {
    marginHorizontal: 20,
    flexDirection: "row",
    marginTop: 12,
  },
});
