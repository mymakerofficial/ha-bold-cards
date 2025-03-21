import { svg } from "lit";
import { TemplateResult } from "lit-element";

const BOLD_ICON_PREFIX = "bold:";

export function isBoldIcon(icon: string) {
  return icon.startsWith(BOLD_ICON_PREFIX);
}

export function getBoldIconName(icon: string) {
  return icon.slice(BOLD_ICON_PREFIX.length);
}

const icons: { [key: string]: TemplateResult<2> } = {
  ["sun"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.11111,0,0,1.11111,-44.4444,-44.4444)">
        <path d="M272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C699.791,328.825 715,362.65 715,400C715,437.35 699.791,471.175 675.243,495.626C666.795,504.039 662.032,515.462 661.999,527.384C661.795,601.589 601.589,661.795 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001Z" style="fill:url(#_Radial1);"/>
      </g>
      <defs>
        <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(495.232,0,0,495.232,353.291,320.305)"><stop offset="0" style="stop-color:rgb(255,200,0);stop-opacity:1"/><stop offset="0.54" style="stop-color:rgb(255,196,0);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,160,0);stop-opacity:1"/></radialGradient>
      </defs>
    </svg>
  `,
  ["sun-hot"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.11111,0,0,1.11111,-44.4444,-44.4444)">
        <path d="M624.824,611.539C625.004,616.966 622.842,622.208 618.888,625.93C594.842,648.215 562.699,661.902 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C693.45,322.509 706.519,345.8 712.056,371.861C712.447,373.743 711.956,375.7 710.722,377.175C709.489,378.649 707.65,379.478 705.728,379.426C688.566,379.427 648.733,379.422 648.733,379.422C640.441,379.422 632.504,382.787 626.739,388.747C620.973,394.707 617.874,402.752 618.15,411.04C618.15,411.04 623.54,572.969 624.824,611.539Z" style="fill:url(#_Radial1);"/>
      </g>
      <g transform="matrix(2.73822,0,0,2.73822,-665.061,-1137.19)">
        <path d="M512.262,565.448C513.152,565.448 514.004,565.81 514.624,566.45C515.243,567.09 515.576,567.954 515.547,568.844C515.094,582.581 513.401,633.943 512.961,647.277C512.903,649.049 511.449,650.456 509.676,650.456L495.901,650.456C494.128,650.456 492.675,649.05 492.616,647.278C492.172,633.947 490.462,582.584 490.005,568.845C489.975,567.954 490.308,567.09 490.927,566.45C491.547,565.81 492.399,565.448 493.29,565.448C498.226,565.448 507.326,565.448 512.262,565.448ZM489.217,676.735C489.217,673.187 490.453,670.212 492.924,667.81C495.396,665.408 498.696,664.207 502.824,664.207C506.934,664.207 510.225,665.408 512.695,667.81C515.165,670.212 516.401,673.187 516.401,676.735C516.401,680.245 515.165,683.202 512.695,685.604C510.225,688.006 506.934,689.207 502.824,689.207C498.696,689.207 495.396,688.006 492.924,685.604C490.453,683.202 489.217,680.245 489.217,676.735Z" style="fill:rgb(255,61,17);fill-rule:nonzero;"/>
      </g>
      <defs>
        <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(495.232,0,0,495.232,353.291,320.305)"><stop offset="0" style="stop-color:rgb(255,179,0);stop-opacity:1"/><stop offset="0.5" style="stop-color:rgb(255,148,0);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,0,29);stop-opacity:1"/></radialGradient>
      </defs>
    </svg>
  `,
  ["partly-cloudy"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.11111,0,0,1.11111,-44.4444,-44.4444)">
        <path d="M272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C699.791,328.825 715,362.65 715,400C715,437.35 699.791,471.175 675.243,495.626C666.795,504.039 662.032,515.462 661.999,527.384C661.795,601.589 601.589,661.795 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001Z" style="fill:url(#_Radial1);"/>
      </g>
      <path d="M319.197,466.904C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750C332.787,750 400,682.787 400,600C400,542.165 367.197,491.931 319.197,466.904Z" style="fill:url(#_Radial2);"/>
      <g transform="matrix(0.681081,0,0,0.681081,-59.6283,239.189)">
        <circle cx="454.613" cy="529.762" r="220.238" style="fill:url(#_Radial3);"/>
      </g>
      <defs>
        <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(495.232,0,0,495.232,353.291,320.305)"><stop offset="0" style="stop-color:rgb(255,200,0);stop-opacity:1"/><stop offset="0.54" style="stop-color:rgb(255,196,0);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,160,0);stop-opacity:1"/></radialGradient>
        <radialGradient id="_Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(179.13,440.839,-440.839,179.13,415.551,209.372)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
        <radialGradient id="_Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(355.811,559.881,-559.881,355.811,319.04,-30.1189)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
      </defs>
    </svg>
  `,
  ["cloudy"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <g transform="matrix(1.07639,0,0,1.07639,-57.6389,-170.486)">
        <path d="M250,750C167.213,750 100,682.787 100,600C100,517.213 167.213,450 250,450C274.952,450 298.489,456.106 319.198,466.903C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750Z" style="fill:url(#_Radial1);"/>
      </g>
      <defs>
        <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(279.438,551.534,-551.534,279.438,257.775,68.046)"><stop offset="0" style="stop-color:rgb(249,249,249);stop-opacity:0.21"/><stop offset="1" style="stop-color:rgb(194,196,200);stop-opacity:1"/></radialGradient>
      </defs>
    </svg>
  `,
  ["moon"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
      <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
      <defs>
        <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
      </defs>
    </svg>
  `,
} as const;

export function getBoldIconSvg(icon: string) {
  return icons[getBoldIconName(icon)];
}
