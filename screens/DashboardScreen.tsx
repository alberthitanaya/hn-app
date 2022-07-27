import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import { CoinListItem } from "../components/CoinListItem/CoinListItem";
import balancesJson from "../constants/balances.json";
import OverallPosition from "../components/OverallPosition/OverallPositionContainer";
import { RootTabScreenProps } from "../types";
import { useNavigation } from "@react-navigation/core";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "intl";
import { coingeckoUrl } from "../constants/Api";

interface GraphValues {
  timestamp: number;
  value: number;
}
const currenciesIdsCSV =
  "uniswap,dogecoin,terra-luna,ethereum,safemoon,litecoin,dash";

export default function DashboardScreen({
  navigation,
}: RootTabScreenProps<"Dashboard">) {
  const [data, setData] = useState<GraphValues[]>();
  const [balances, setBalances] = useState<any>();
  const [currentCurrency, setCurrentCurrency] = useState("aud");
  const [isRefreshing, setIsRefreshing] = useState<any>(false);
  const { navigate } = useNavigation();

  const fetchData = async () => {
    try {
      setIsRefreshing(true);
      const currency = (await AsyncStorage.getItem("currency")) || "aud";
      const url = `${coingeckoUrl}simple/price?vs_currencies=USD,AUD&include_24hr_vol=true&include_market_cap&include_24hr_change=true&&ids=${currenciesIdsCSV}`;
      setCurrentCurrency(currency);
      const formatter = new Intl.NumberFormat("en-US", {
        currency,
        style: "currency",
      });
      const response = await fetch(url);
      const json = await response.json();
      const currentBalances = balancesJson[
        balancesJson.length - 1
      ].balancesByCurrency.map((bal) => {
        return {
          ...bal,
          change: json[bal.currency.id][`${currency}_24h_change`],
          vol: formatter.format(json[bal.currency.id][`${currency}_24h_vol`]),
          price: formatter.format(json[bal.currency.id][currency || "aud"]),
          totalValue: formatter.format(
            bal.balance * json[bal.currency.id][currency || "aud"]
          ),
        };
      });
      setBalances(currentBalances);

      // get todays price
      const data = balancesJson.map((period) => {
        const result = period.balancesByCurrency.map((balance) => {
          return balance.balance * json[balance.currency.id][currency];
        });
        const change24hr = period.balancesByCurrency.map((balance) => {
          return (
            balance.balance *
            json[balance.currency.id][`${currency}_24h_change`]
          );
        });
        const reducer = (prev: number, curr: number) => prev + curr;
        // sum coins value
        const sum = result.reduce(reducer);
        // sum coins change in the last 24hr
        const change = change24hr.reduce(reducer);
        return {
          change,
          timestamp: period.timestamp,
          value: sum,
        };
      });
      setData(data);
      setIsRefreshing(false);
    } catch (error) {
      setIsRefreshing(false);
      alert("An network error has occurred, please refresh to try again");
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
      fetchData();
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView testID="DashboardScreen" style={styles.container}>
      <FlatList
        accessibilityLabel="DashboardScreen"
        refreshing={isRefreshing}
        onRefresh={() => {
          fetchData();
        }}
        data={balances}
        keyExtractor={(item) => item?.item?.currency.id}
        showsVerticalScrollIndicator={false}
        renderItem={(item) => {
          return (
            <CoinListItem
              item={item}
              onPress={() =>
                navigate("CoinDetail", { id: item.item.currency.id })
              }
            />
          );
        }}
        ListHeaderComponent={
          <OverallPosition data={data} currency={currentCurrency} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 70,
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
