import { svg } from "lit";
import { TemplateResult } from "lit-element";

const BOLD_ICON_PREFIX = "bold:";

export function isBoldIcon(icon: string) {
  return icon.startsWith(BOLD_ICON_PREFIX);
}

export function getBoldIconName(icon: string) {
  return icon.slice(BOLD_ICON_PREFIX.length);
}

export const boldIconsMap = {
  ["weather-cloudy"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.07639,0,0,1.07639,-57.6389,-170.486)">
            <path d="M250,750C167.213,750 100,682.787 100,600C100,517.213 167.213,450 250,450C274.952,450 298.489,456.106 319.198,466.903C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750Z" style="fill:url(#_Radial1);"/>
        </g>
        <defs>
            <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(279.438,551.534,-551.534,279.438,257.775,68.046)"><stop offset="0" style="stop-color:rgb(249,249,249);stop-opacity:0.21"/><stop offset="1" style="stop-color:rgb(194,196,200);stop-opacity:1"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-clear-day"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.11111,0,0,1.11111,-44.4444,-44.4444)">
            <path d="M272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C699.791,328.825 715,362.65 715,400C715,437.35 699.791,471.175 675.243,495.626C666.795,504.039 662.032,515.462 661.999,527.384C661.795,601.589 601.589,661.795 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001Z" style="fill:url(#_Radial1);"/>
        </g>
        <defs>
            <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(495.232,0,0,495.232,353.291,320.305)"><stop offset="0" style="stop-color:rgb(255,200,0);stop-opacity:1"/><stop offset="0.54" style="stop-color:rgb(255,196,0);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,160,0);stop-opacity:1"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-clear-night"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
        <defs>
            <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
        </defs>
    </svg>
  `,
  ["weather-hot"]: svg`
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
  ["weather-mostly-clear-day"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(1.11111,0,0,1.11111,-44.4444,-44.4444)">
            <path d="M272.615,138.001C284.538,137.968 295.96,133.205 304.374,124.757C328.825,100.209 362.65,85 400,85C437.35,85 471.175,100.209 495.626,124.757C504.039,133.205 515.462,137.968 527.384,138.001C601.589,138.205 661.795,198.411 661.999,272.615C662.032,284.538 666.795,295.96 675.243,304.374C699.791,328.825 715,362.65 715,400C715,437.35 699.791,471.175 675.243,495.626C666.795,504.039 662.032,515.462 661.999,527.384C661.795,601.589 601.589,661.795 527.385,661.999C515.462,662.032 504.04,666.795 495.626,675.243C471.175,699.791 437.35,715 400,715C362.65,715 328.825,699.791 304.374,675.243C295.961,666.795 284.538,662.032 272.616,661.999C198.411,661.795 138.205,601.589 138.001,527.385C137.968,515.462 133.205,504.04 124.757,495.626C100.209,471.175 85,437.35 85,400C85,362.65 100.209,328.825 124.757,304.374C133.205,295.961 137.968,284.538 138.001,272.616C138.205,198.411 198.411,138.205 272.615,138.001Z" style="fill:url(#_Radial1);"/>
        </g>
        <g transform="matrix(0.727876,0,0,0.727876,204.093,204.093)">
            <path d="M319.197,466.904C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750C332.787,750 400,682.787 400,600C400,542.165 367.197,491.931 319.197,466.904Z" style="fill:url(#_Radial2);"/>
        </g>
        <g transform="matrix(0.495742,0,0,0.495742,160.691,378.193)">
            <circle cx="454.613" cy="529.762" r="220.238" style="fill:url(#_Radial3);"/>
        </g>
        <defs>
            <radialGradient id="_Radial1" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(495.232,0,0,495.232,353.291,320.305)"><stop offset="0" style="stop-color:rgb(255,200,0);stop-opacity:1"/><stop offset="0.54" style="stop-color:rgb(255,196,0);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(255,160,0);stop-opacity:1"/></radialGradient>
            <radialGradient id="_Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(179.13,440.839,-440.839,179.13,415.551,209.372)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
            <radialGradient id="_Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(355.811,559.881,-559.881,355.811,319.04,-30.1189)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-mostly-clear-night"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
        <g transform="matrix(0.727876,0,0,0.727876,204.093,204.093)">
            <path d="M319.197,466.904C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750C332.787,750 400,682.787 400,600C400,542.165 367.197,491.931 319.197,466.904Z" style="fill:url(#_Radial2);"/>
        </g>
        <g transform="matrix(0.495742,0,0,0.495742,160.691,378.193)">
            <circle cx="454.613" cy="529.762" r="220.238" style="fill:url(#_Radial3);"/>
        </g>
        <defs>
            <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
            <radialGradient id="_Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(179.13,440.839,-440.839,179.13,415.551,209.372)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
            <radialGradient id="_Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(355.811,559.881,-559.881,355.811,319.04,-30.1189)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-mostly-cloudy-day"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(0.804683,0,0,0.804683,-32.1873,-32.1873)">
            <path d="M272.663,155.137C289.126,155.091 304.898,148.515 316.516,136.85C337.863,115.418 367.391,102.136 400,102.136C432.609,102.136 462.137,115.418 483.484,136.85C495.102,148.515 510.874,155.091 527.337,155.137C592.122,155.316 644.685,207.879 644.863,272.663C644.909,289.126 651.485,304.898 663.15,316.516C684.582,337.863 697.864,367.391 697.864,400C697.864,432.609 684.582,462.137 663.15,483.484C651.485,495.102 644.909,510.874 644.863,527.337C644.684,592.122 592.121,644.685 527.337,644.863C510.874,644.909 495.102,651.485 483.484,663.15C462.137,684.582 432.609,697.864 400,697.864C367.391,697.864 337.863,684.582 316.516,663.15C304.898,651.485 289.126,644.909 272.663,644.863C207.878,644.684 155.315,592.121 155.137,527.337C155.091,510.874 148.515,495.102 136.85,483.484C115.418,462.137 102.136,432.609 102.136,400C102.136,367.391 115.418,337.863 136.85,316.516C148.515,304.898 155.091,289.126 155.137,272.663C155.316,207.878 207.879,155.315 272.663,155.137Z" style="fill:url(#_Radial1);"/>
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
  ["weather-mostly-cloudy-night"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <g transform="matrix(0.628727,0,0,0.628727,68.5637,18.6279)">
            <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
        </g>
        <path d="M319.197,466.904C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750C332.787,750 400,682.787 400,600C400,542.165 367.197,491.931 319.197,466.904Z" style="fill:url(#_Radial2);"/>
        <g transform="matrix(0.681081,0,0,0.681081,-59.6283,239.189)">
            <circle cx="454.613" cy="529.762" r="220.238" style="fill:url(#_Radial3);"/>
        </g>
        <defs>
            <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
            <radialGradient id="_Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(179.13,440.839,-440.839,179.13,415.551,209.372)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
            <radialGradient id="_Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(355.811,559.881,-559.881,355.811,319.04,-30.1189)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-partly-cloudy-day"]: svg`
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
  ["weather-partly-cloudy-night"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
        <path d="M319.197,466.904C346.352,376.187 430.507,310 530,310C651.421,310 750,408.579 750,530C750,651.421 651.421,750 530,750C529.526,750 529.053,749.999 528.571,749.995L528.575,750L250,750C332.787,750 400,682.787 400,600C400,542.165 367.197,491.931 319.197,466.904Z" style="fill:url(#_Radial2);"/>
        <g transform="matrix(0.681081,0,0,0.681081,-59.6283,239.189)">
            <circle cx="454.613" cy="529.762" r="220.238" style="fill:url(#_Radial3);"/>
        </g>
        <defs>
            <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
            <radialGradient id="_Radial2" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(179.13,440.839,-440.839,179.13,415.551,209.372)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
            <radialGradient id="_Radial3" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="matrix(355.811,559.881,-559.881,355.811,319.04,-30.1189)"><stop offset="0" style="stop-color:white;stop-opacity:0.2"/><stop offset="1" style="stop-color:rgb(235,235,235);stop-opacity:0.9"/></radialGradient>
        </defs>
    </svg>
  `,
  ["weather-starry-night"]: svg`
    <svg width="100%" height="100%" viewBox="0 0 800 800" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xml:space="preserve" xmlns:serif="http://www.serif.com/" style="fill-rule:evenodd;clip-rule:evenodd;stroke-linejoin:round;stroke-miterlimit:2;">
        <path d="M677.298,613.478C613.275,696.487 512.838,750 400,750C206.83,750 50,593.17 50,400C50,210.545 200.855,56.046 388.895,50.173C318.837,109.822 274.37,198.648 274.37,297.779C274.37,477.201 420.042,622.869 599.47,622.869C626.291,622.869 652.359,619.614 677.298,613.478Z" style="fill:url(#_Linear1);"/>
        <g transform="matrix(0.855548,0,0,0.967036,2.88082,-51.678)">
            <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z" style="fill:url(#_Linear2);"/>
        </g>
        <g transform="matrix(0.619685,0,0,0.700437,9.3323,120.949)">
            <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z" style="fill:url(#_Linear3);"/>
        </g>
        <g transform="matrix(0.505633,0,0,0.608923,212.357,162.393)">
            <clipPath id="_clip4">
                <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z"/>
            </clipPath>
            <g clip-path="url(#_clip4)">
                <g transform="matrix(1.97772,-0,-0,1.64224,-419.982,-266.689)">
                    <use xlink:href="#_Image5" x="467.927" y="279.149" width="60px" height="63px"/>
                </g>
            </g>
        </g>
        <g transform="matrix(0.509871,0,0,0.614027,160.849,258.888)">
            <clipPath id="_clip6">
                <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z"/>
            </clipPath>
            <g clip-path="url(#_clip6)">
                <g transform="matrix(1.96128,-0,-0,1.62859,-315.47,-421.623)">
                    <use xlink:href="#_Image7" x="418.562" y="376.623" width="60px" height="64px"/>
                </g>
            </g>
        </g>
        <g transform="matrix(0.675047,0,0,0.763014,188.964,262.069)">
            <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z" style="fill:url(#_Linear8);"/>
        </g>
        <g transform="matrix(0.764163,0,0,0.863743,183.372,81.1931)">
            <path d="M552.2,253.787C542.46,245.17 505.447,243.446 505.447,243.446C505.447,243.446 542.46,241.723 552.2,233.105C561.941,224.488 563.889,191.742 563.889,191.742C563.889,191.742 565.837,224.488 575.577,233.105C585.317,241.723 622.331,243.446 622.331,243.446C622.331,243.446 585.317,245.17 575.577,253.787C565.837,262.405 563.889,295.151 563.889,295.151C563.889,295.151 561.941,262.405 552.2,253.787Z" style="fill:url(#_Linear9);"/>
        </g>
        <defs>
            <linearGradient id="_Linear1" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(553.317,639.78,-639.78,553.317,440.096,0)"><stop offset="0" style="stop-color:rgb(211,235,247);stop-opacity:1"/><stop offset="1" style="stop-color:rgb(48,132,207);stop-opacity:1"/></linearGradient>
            <linearGradient id="_Linear2" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-41.2398,-43.5476,49.2224,-36.4853,563.889,243.446)"><stop offset="0" style="stop-color:rgb(255,226,122);stop-opacity:1"/><stop offset="1" style="stop-color:white;stop-opacity:1"/></linearGradient>
            <linearGradient id="_Linear3" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-41.2398,-43.5476,49.2224,-36.4853,563.889,243.446)"><stop offset="0" style="stop-color:rgb(255,226,122);stop-opacity:1"/><stop offset="1" style="stop-color:white;stop-opacity:1"/></linearGradient>
            <image id="_Image5" width="60px" height="63px" xlink:href="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCAA/ADwDAREAAhEBAxEB/8QAGwABAQACAwEAAAAAAAAAAAAAAAQCAwEFBgj/xAAYEAEBAQEBAAAAAAAAAAAAAAAAAgMRAf/EABsBAQEBAAMBAQAAAAAAAAAAAAADBAECBQYH/8QAGBEBAQEBAQAAAAAAAAAAAAAAAAIDARH/2gAMAwEAAhEDEQA/APssGF1xK9PHbnGjS2HTVaZT6Ww6aqzKbS2HTVaZT6WwaarTKfS2HTVaZafa96yd06pzj113x+oXp4+f5KfS2LTVWZT6WwaarTKbS2HTVaZT6Ww6arTKfS2DTVWZaa96yVXqvOeOHVy9Ppb9F01eHMp9LYNNVplNpbDpqtMp9LYdNVZlPpbBpqtMtXvvWXvfVOccOHIDvtLfa6avJmU2lsGmq0yn0th01WmU+lsOmq0y1e+9Zu99dxw5AAdppb6XTVgmU+lsGmq0ynu2HTRXktbP3vqgAAACvS3q6as0ynu+sN6erclgg7gAAAAM7rqt6euvOMEnYAAAAAAAAAAAAAB//9k="/>
            <image id="_Image7" width="60px" height="64px" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADwAAABACAYAAABGHBTIAAAACXBIWXMAAA7EAAAOxAGVKw4bAAAB50lEQVRoge2b0ZKCMAxFz3b4/y9Wug+Au0BoQumuJPU+OWVsPO2tF6N+5ZwzVRohPyGPwHN6vIy9rgljzM+RxlbXNmNLjVI9w9xDO1it2AGAZeGqFkme+zxw1Qu6Byyc2uGsWOwKiGbfk3MX6qWeYI2WzoZimsVag9TWUy09NgJpdTaN9cS5pzAqWDoeLHC0w9fPyjsyVp57fZsh7HBc2P0OVxXTLN0axDq3rBk4TuzAeAgLkHqCnXZYLVZzDq+A1NbTYecd7gf2Z4erQQwWa7lwSsYagR/KqrcGaTn3+Y/yqSdYWFlamvjC2XxDxlqUeoIFGCJlrA34X0Fqzv252NGUeoKF15uWBNLqbBoXrkHGWpR6ggUY4NEIpOUi/Q3sBHxoaZ+xo+nA0jFhYZXDF8/hDTLWotQTLGxvPJxnrA1YtLTf2NEkWDouLIiW9puxFqWeYGHbtXSesRYNpnPoKHY0pZ5gYWdp3xlrkdK1jAULVxvxN8tYi+RGvOPY0bS3dGBYULuWvjLWokLXMh4siF+1+M1Yiyob8T5hoaoR7xcWSl1Lhxlrkdy1DAoLvxvxATLWooKlfcaOpgNLx4SFUtcyqOSuZWBtupaxYWFl6TjvxCWlnmBh+TVtRzL+jSeOPsDR9QGOrm/GdDLEzScoRwAAAABJRU5ErkJggg=="/>
            <linearGradient id="_Linear8" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-41.2398,-43.5476,49.2224,-36.4853,563.889,243.446)"><stop offset="0" style="stop-color:rgb(255,226,122);stop-opacity:1"/><stop offset="1" style="stop-color:white;stop-opacity:1"/></linearGradient>
            <linearGradient id="_Linear9" x1="0" y1="0" x2="1" y2="0" gradientUnits="userSpaceOnUse" gradientTransform="matrix(-41.2398,-43.5476,49.2224,-36.4853,563.889,243.446)"><stop offset="0" style="stop-color:rgb(255,226,122);stop-opacity:1"/><stop offset="1" style="stop-color:white;stop-opacity:1"/></linearGradient>
        </defs>
    </svg>
  `,
} as const satisfies { [key: string]: TemplateResult<2> };

const boldIconAliases = {
  ["sun"]: "weather-clear-day",
  ["moon"]: "weather-clear-night",
  ["cloud"]: "weather-cloudy",
  ["hot"]: "weather-hot",
  ["stars"]: "weather-starry-night",
} as const satisfies {
  [key: string]: keyof typeof boldIconsMap;
};

export type BoldIcon =
  | `bold:${keyof typeof boldIconsMap}`
  | `bold:${keyof typeof boldIconAliases}`;

export function getBoldIconSvg(icon: string) {
  const name = getBoldIconName(icon);
  return boldIconsMap[boldIconAliases[name] ?? name];
}
