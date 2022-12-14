import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

function LitecoinIcon(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} {...props}>
      <G fill="none">
        <Circle cx={16} cy={16} r={16} fill="#BFBBBB" />
        <Path
          fill="#FFF"
          d="M10.427 19.214L9 19.768l.688-2.759 1.444-.58L13.213 8h5.129l-1.519 6.196 1.41-.571-.68 2.75-1.427.571-.848 3.483H23L22.127 24H9.252z"
        />
      </G>
    </Svg>
  );
}

export default LitecoinIcon;
