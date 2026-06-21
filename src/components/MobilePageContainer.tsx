import { PropsWithChildren } from "react";
import { StyleSheet, View } from "react-native";

export function MobilePageContainer({ children }: PropsWithChildren) {
  return <View style={styles.container}>{children}</View>;
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    maxWidth: 440,
    alignSelf: "center",
    paddingHorizontal: 16
  }
});
