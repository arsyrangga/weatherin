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
import moment from "moment";
import { appid, endpoint } from "../env";
import axios from "axios";
import Loading from "../component/Loading";
import GetLocation from "react-native-get-location";

const ListScreen = ({ route }) => {
  const { params } = route;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState();
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

        setLatLng({
          lat : location.latitude,
          lng : location.longitude
        })
      } else {
        getLocation()
      }
      setLoading(false);

    } catch (error) {
      setLoading(true);
      const { code, message } = error;
      console.warn(code, message);
    }
  };

  const getDate = (data) => {
    let unix_timestamp = data;
    var date = new Date(unix_timestamp * 1000);
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();

    if (params == "perjam") {
      return `${moment(date).format("DD-MM-YYYY")} ${hours}:${minutes}`;
    }
    return moment(date).format("DD-MM-YYYY");
  };

  const getWeather = async () => {
    try {
      setLoading(true);
      const response = await axios(
        `${endpoint}?lat=-6.261493&lon=106.810600&units=metric&exclude=minutely,current&appid=${appid}`,
        {
          method: "GET",
        }
      );
      if (params === "perjam") {
        setData(response.data.hourly);
        console.log(response.data.hourly);
      } else {
        setData(response.data.daily);
        console.log(response.data.daily);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log(err);
    }
  };

  useEffect(() => {
    getLocation()
  }, []);

  useEffect(()=>{
    if(latLng.lat){
      getWeather();
    }
  },[latLng.lat, latLng.lng])
  const navigation = useNavigation();

  const image = (weather) =>
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

  return (
    <>
      <View
        style={{
          backgroundColor: "#2D2D2D",
          paddingHorizontal: 30,
          paddingVertical: 20,
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: 20,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.pop();
          }}
        >
          <Image source={require("../assets/arrow.png")} />
        </TouchableOpacity>
        <TextComponent size={24}>Detail</TextComponent>
      </View>
      <ScrollView
        style={{ flex: 1, backgroundColor: "#2D2D2D" }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={getWeather} />
        }
      >
        <View style={{ paddingHorizontal: 30, paddingBottom: 20 }}>
          {/* perjam */}
          {params == "perjam" &&
            data?.map((e, i) => (
              <View
                style={{
                  width: "100%",
                  padding: 20,
                  backgroundColor: "#4D4D4D",
                  borderRadius: 20,
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                <View style={{ height: 200 }}>
                  <Image
                    source={image(e.weather?.[0].main)}
                    style={{
                      resizeMode: "contain",
                      width: "100%",
                      height: 200,
                      borderRadius: 20,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      height: 51,
                      paddingHorizontal: 15,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bottom: 50,
                    }}
                  >
                    <TextComponent size={22} color="#8AFFC0">
                      {e?.weather?.[0].description}
                    </TextComponent>
                  </View>
                </View>
                <View style={{ display: "flex", alignItems: "center" }}>
                  <TextComponent size={16} style={{ marginVertical: 20 }}>
                    {getDate(e?.dt)}
                  </TextComponent>
                </View>
                <TextBetween text1={"Temperature"} text2={e?.temp + " C"} />
                <TextBetween text1={"Clouds"} text2={e?.clouds + "%"} />
                <TextBetween text1={"Pressure"} text2={`${e?.pressure} hPa`} />
                <TextBetween text1={"Humidity"} text2={`${e?.humidity}%`} />
                <TextBetween text1={"Dew Point"} text2={`${e?.dew_point} C`} />
                <TextBetween text1={"UVI"} text2={e?.uvi} />
                <TextBetween
                  text1={"Visibility"}
                  text2={`${e?.visibility} m`}
                />
                <TextBetween
                  text1={"Wind Speed "}
                  text2={`${e?.wind_speed} m/s`}
                />
                {e?.wind_gust && (
                  <TextBetween
                    text1={"Wind Gust"}
                    text2={`${e?.wind_gust} m/s`}
                  />
                )}
                <TextBetween
                  text1={"Wind direction"}
                  text2={`${e?.wind_deg} Degree`}
                />
              </View>
            ))}
          {/* perjam */}

          {/* perhari */}
          {params !== "perjam" &&
            data?.map((e, i) => (
              <View
                style={{
                  width: "100%",
                  padding: 20,
                  backgroundColor: "#4D4D4D",
                  borderRadius: 20,
                  marginTop: 15,
                  marginBottom: 15,
                }}
              >
                <View style={{ height: 200 }}>
                  <Image
                    source={image(e.weather?.[0].main)}
                    style={{
                      resizeMode: "contain",
                      width: "100%",
                      height: 200,
                      borderRadius: 20,
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.8)",
                      height: 51,
                      paddingHorizontal: 15,
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      bottom: 50,
                    }}
                  >
                    <TextComponent size={22} color="#8AFFC0">
                      {e?.weather?.[0].description}
                    </TextComponent>
                  </View>
                </View>
                <View style={{ display: "flex", alignItems: "center" }}>
                  <TextComponent size={16} style={{ marginVertical: 20,  }}>
                    {getDate(e?.dt)}
                  </TextComponent>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    marginBottom: 15,
                  }}
                >
                  <View style={{ width: "50%" }}>
                    <TextComponent style={{ color: "#8AFFC0" }} size={16}>
                      Temperature
                    </TextComponent>
                  </View>
                  <View style={{ width: "50%" }}>
                    <TextComponent size={16}>
                      Min {e?.temp.min + " C"}
                    </TextComponent>
                    <TextComponent size={16}>
                      Max {e?.temp.max + " C"}
                    </TextComponent>
                    <TextComponent size={16}>
                      Morning {e?.temp.max + " C"}
                    </TextComponent>
                    <TextComponent size={16}>
                      Day {e?.temp.day + " C"}
                    </TextComponent>
                    <TextComponent size={16}>
                      Night {e?.temp.night + " C"}
                    </TextComponent>
                  </View>
                </View>
                <TextBetween text1={"Clouds"} text2={e?.clouds + "%"} />
                <TextBetween text1={"Pressure"} text2={`${e?.pressure} hPa`} />
                <TextBetween text1={"Humidity"} text2={`${e?.humidity}%`} />
                <TextBetween text1={"Dew Point"} text2={`${e?.dew_point} C`} />
                <TextBetween text1={"UVI"} text2={e?.uvi} />

                <TextBetween
                  text1={"Wind Speed "}
                  text2={`${e?.wind_speed} m/s`}
                />
                {e?.wind_gust && (
                  <TextBetween
                    text1={"Wind Gust"}
                    text2={`${e?.wind_gust} m/s`}
                  />
                )}
                <TextBetween
                  text1={"Wind direction"}
                  text2={`${e?.wind_deg} Degree`}
                />
                <TextBetween
                  text1={"Summary"}
                  text2={`${e?.summary} Degree`}
                  top
                />
              </View>
            ))}
          {/* perhari */}
        </View>
      </ScrollView>
    </>
  );
};

export default ListScreen;

const TextComponent = ({ children, size, color, style }) => {
  return (
    <Text style={[{ color: color ? color : "#ffffff", fontSize: size }, style]}>
      {children}
    </Text>
  );
};

const TextBetween = ({ text1, text2, top }) => {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: top ? "flex-start" : "center",
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

const ButtonComponent = ({ text }) => {
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
    >
      <TextComponent>{text}</TextComponent>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({});
