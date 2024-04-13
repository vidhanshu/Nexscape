import { Link } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";

const Logo = ({ small = false, routable = true }) => {
  const Comp = routable ? Link : View;
  return (
    <Comp className="h-[60px]" {...(routable ? { href: "/home" } : {})}>
      {small ? (
        <Image
          source={images.logoSmall}
          className="w-9 h-10"
          resizeMode="contain"
        />
      ) : (
        <Image
          source={images.logo}
          className="w-[185px] h-[35px]"
          resizeMode="contain"
        />
      )}
    </Comp>
  );
};

export default Logo;
