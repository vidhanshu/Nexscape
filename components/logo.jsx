import { Link } from "expo-router";
import { View, Text, Image } from "react-native";

import { images } from "../constants";

const Logo = () => {
  return (
    <Link className="h-[60px]" href="/">
      <Image
        source={images.logo}
        className="w-[185px] h-[35px]"
        resizeMode="contain"
      />
    </Link>
  );
};

export default Logo;
