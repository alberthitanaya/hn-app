import * as React from "react";
import Svg, { G, Circle, Path } from "react-native-svg";

function DashIcon(props: any) {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} {...props}>
      <G fill="none">
        <Circle cx={16} cy={16} r={16} fill="#008CE7" />
        <G fill="#FFF">
          <Path d="M19.086 8.004H11.81l-.602 3.367 6.562.01c3.231 0 4.19 1.173 4.159 3.12-.014.998-.449 2.686-.633 3.23-.497 1.46-1.521 3.122-5.359 3.117l-6.378-.004-.602 3.371h7.257c2.559 0 3.649-.299 4.8-.83 2.554-1.178 4.075-3.701 4.686-6.994.906-4.9-.224-8.387-6.615-8.387z" />
          <Path d="M15.807 15.798c.237-.985.312-1.38.312-1.38H8.673c-1.904 0-2.176 1.24-2.357 1.99-.237.981-.312 1.381-.312 1.381h7.447c1.903 0 2.175-1.24 2.356-1.991z" />
        </G>
      </G>
    </Svg>
  );
}

export default DashIcon;