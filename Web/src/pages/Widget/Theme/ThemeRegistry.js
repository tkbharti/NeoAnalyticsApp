import * as echarts from "echarts";

import Roma from "./roma"; 
import Dark from "./dark";  
import Vintage from "./vintage"; 
import Shine from "./shine"; 
import Macarons from "./macarons"; 
import Infographic from "./infographic";  

// ✅ Map of all themes
const themes = {
  default:"",
  roma: Roma,
  dark: Dark,
  vintage: Vintage,
  shine: Shine,
  macarons: Macarons,
  infographic: Infographic
}; 

// ✅ Register only once
let isRegistered = false;

export const ThemeRegistry = () => {
  if (isRegistered) return;

  Object.entries(themes).forEach(([name, theme]) => { 
    echarts.registerTheme(name, theme);
  }); 
  isRegistered = true;
};

// ✅ Optional helper
export const GetThemeNames = () => Object.keys(themes); 