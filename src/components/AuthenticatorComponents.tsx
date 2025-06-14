import { useTheme, View, Text, Image } from "@aws-amplify/ui-react";

export const AuthenticatorComponents = {
  Header() {
    const { tokens } = useTheme();

    return (
      <View textAlign={"center"} padding={tokens.space.large}>
        <Image alt="Task Manager Pro Logo" src="./logo.svg" height="10" />
      </View>
    );
  },
  Footer() {
    const { tokens } = useTheme();

    return (
      <View
        textAlign={"center"}
        padding={tokens.space.large}
        color={tokens.colors.font.secondary}
      >
        <Text color={tokens.colors.neutral[80]}>
          &copy; All Rights Reserved <br />
          <a href="www.thinhle.dev">www.thinhle.dev</a>
        </Text>
      </View>
    );
  },
};
