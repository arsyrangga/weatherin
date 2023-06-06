import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";

const Loading = () => {
  return (
    <View style={{ display : "flex", justifyContent: "center", position : "absolute", top : 0, left : 0, alignItems : 'center', width : "100%", height :  Dimensions.get('window').height, zIndex : 9999 }}>
      <ActivityIndicator size="large" color="#00ff00" />
    </View>
  );
};

export default Loading;

const styles = StyleSheet.create({});
