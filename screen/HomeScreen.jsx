import {
  Image,
  PermissionsAndroid,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import moment from "moment/moment";
import { convertMonth } from "./helper";
import axios from "axios";
import { appid, endpoint } from "../env";
import Loading from "../component/Loading";
import GetLocation from "react-native-get-location";

const HomeScreen = () => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [latLng, setLatLng] = useState({
    lat : null,
    lng : null
  })

  const getLocation = async () => {
    try {
      setLoading(true);

      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );

      console.log(granted)

      if (granted) {
        const location = await GetLocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 60000,
        });
        console.log(location);

        setLatLng({
          lat : location.latitude,
          lng : location.longitude
        })
      } else {
        getLocation()
      }
      setLoading(false);

    } catch (error) {
      const { code, message } = error;
      console.warn(code, message);
      setLoading(false);

    }
  };
  

  const getWeather = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${endpoint}?lat=${latLng.lat}&lon=${latLng.lng}&units=metric&exclude=minutely,current&appid=${appid}`,
        {
          method: "GET",
        }
      );
      setData(response.data.hourly[0]);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  let weather = data?.weather?.[0].main;
  const image =
    weather == "Clouds"
      ? require("../assets/cloud.png")
      : weather === "Clear"
      ? require("../assets/clear.jpg")
      : weather === "Thunderstorm"
      ? require("../assets/thunderstorm.jpg")
      : weather === "Drizzle"
      ? require("../assets/drizzle.jpg")
      : weather === "Rain"
      ? require("../assets/rain.jpg")
      : weather === "Snow"
      ? require("../assets/snow.jpg")
      : data?.weather?.[0].icon === "50d"
      ? require("../assets/atmosphere.jpg")
      : require("../assets/cloud.png");

  useEffect(() => {
    getLocation()
  }, []);

  useEffect(()=>{
    if(latLng.lat){
      getWeather();
    }
  },[latLng.lat, latLng.lng])
  const navigation = useNavigation();
  return (
    <>
      <View
        style={{
          backgroundColor: "#2D2D2D",
          paddingHorizontal: 30,
          paddingVertical: 20,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexDirection: "row",
        }}
      >
        <TextComponent size={28}>
          {moment(new Date()).format("dddd")}
        </TextComponent>
        <TextComponent size={18}>
          {moment(new Date()).format("DD/MM/YYYY")}
        </TextComponent>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#2D2D2D" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getWeather} />
        }
      >
        <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
          <TextComponent
            size={28}
            style={{ textAlign: "center", marginTop: 20 }}
          >
            Weather
          </TextComponent>

          <View style={{ height: 200 }}>
            <Image
              source={image}
              style={{ resizeMode: "contain", width: "100%", height: 260 }}
            />
          </View>
          <View
            style={{
              backgroundColor: "rgba(0,0,0,0.8)",
              height: 51,

              paddingHorizontal: 15,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <TextComponent size={22} color="#8AFFC0">
              {data?.weather?.[0].description}
            </TextComponent>
            <TextComponent size={22}>{data?.temp} C</TextComponent>
          </View>

          <TextComponent
            size={28}
            style={{ textAlign: "center", marginTop: 20 }}
          >
            Detail
          </TextComponent>
          <View
            style={{
              width: "100%",
              padding: 20,
              backgroundColor: "#4D4D4D",
              borderRadius: 20,
              marginTop: 10,
            }}
          >
            <TextBetween text1={"Clouds"} text2={data?.clouds + "%"} />
            <TextBetween text1={"Pressure"} text2={`${data?.pressure} hPa`} />
            <TextBetween text1={"Humidity"} text2={`${data?.humidity}%`} />
            <TextBetween text1={"Dew Point"} text2={`${data?.dew_point} C`} />
            <TextBetween text1={"UVI"} text2={data?.uvi} />
            <TextBetween text1={"Visibility"} text2={`${data?.visibility} m`} />
            <TextBetween
              text1={"Wind Speed "}
              text2={`${data?.wind_speed} m/s`}
            />
            {data?.wind_gust && (
              <TextBetween
                text1={"Wind Gust"}
                text2={`${data?.wind_gust} m/s`}
              />
            )}
            <TextBetween
              text1={"Wind direction"}
              text2={`${data?.wind_deg} Degree`}
            />
          </View>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 20,
            }}
          >
            <ButtonComponent
              text={"Daily Weather"}
              onPress={() => {
                navigation.navigate("ListScreen", "harian");
              }}
            />
            <ButtonComponent
              text={"Hourly Weather"}
              onPress={() => {
                navigation.navigate("ListScreen", "perjam");
              }}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const TextComponent = ({ children, size, color, style }) => {
  return (
    <Text style={[{ color: color ? color : "#ffffff", fontSize: size }, style]}>
      {children}
    </Text>
  );
};

const TextBetween = ({ text1, text2 }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
      }}
    >
      <View style={{ width: "50%" }}>
        <TextComponent style={{ color: "#8AFFC0" }} size={16}>
          {text1}
        </TextComponent>
      </View>
      <View style={{ width: "50%" }}>
        <TextComponent size={16}>{text2}</TextComponent>
      </View>
    </View>
  );
};

const ButtonComponent = ({ text, onPress }) => {
  return (
    <TouchableOpacity
      style={{
        width: "45%",
        padding: 10,
        backgroundColor: "#4D4D4D",
        borderRadius: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onPress={onPress}
    >
      <TextComponent>{text}</TextComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
