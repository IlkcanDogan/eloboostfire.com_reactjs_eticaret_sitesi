import { createGlobalStyle } from "styled-components";
import TempusSans from "./fonts/tempus_sans_tc.woff";
import TWCenMT from "./fonts/tw_cen_mt_bold.woff";

const FontStyles = createGlobalStyle`

@font-face {
  font-family: 'Tempus Sans';
  src: url(${TempusSans}) format('woff');
}

@font-face {
    font-family: 'TWCenWT';
    src: url(${TWCenMT}) format('woff');
}
`;

export default FontStyles;