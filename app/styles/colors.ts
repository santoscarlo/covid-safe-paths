const applyOpacity = (hexColor: string, opacity: number): string => {
  const red = parseInt(hexColor.slice(1, 3), 16);
  const green = parseInt(hexColor.slice(3, 5), 16);
  const blue = parseInt(hexColor.slice(5, 7), 16);

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
};

// Black and White
export const black = '#000000';
export const white = '#ffffff';

// Grays
export const faintGray = '#f8f8f8';
export const lightestGray = '#ededed';
export const lighterGray = '#d3d3d3';
export const lightGray = '#999999';
export const gray = '#333333';
export const mediumGray = '#606060';
export const darkGray = '#4e4e4e';
export const darkestGray = '#2e2e2e';
export const silver = '#bebebe';

// Reds
export const red = '#ff0000';

export const primaryRed = red;

// Blues
export const royalBlue = '#4051db';
export const royalerBlue = '#5061e6';
export const midnightBlue = '#161a25';

export const primaryBlue = royalBlue;
export const secondaryBlue = midnightBlue;
export const tertiaryBlue = royalerBlue;

// Yellows
export const amber = '#ffc000';
export const kournikova = '#ffdd76';
export const orangePeel = '#ff9900';

export const primaryYellow = amber;
export const secondaryYellow = kournikova;
export const tertiaryYellow = orangePeel;

// Violets
export const jacksonsPurple = '#1f2c9b';
export const cornflowerBlue = '#6979f8';
export const moonRaker = '#e5e7fa';
export const melrose = '#a5affb';

export const primaryViolet = royalBlue;
export const secondaryViolet = jacksonsPurple;
export const tertiaryViolet = melrose;

// Transparent
export const transparent = 'rgba(0, 0, 0, 0)';
export const transparentWhite = applyOpacity(white, 0.1);
export const transparentGray = applyOpacity(gray, 0.1);
export const transparentYellow = 'rgba(100, 100, 77, 0.4)';
export const transparentDark = 'rgba(0,0,0,0.7)';

// Accents
export const defaultAccent = primaryBlue;
export const defaultBlue = primaryBlue;
export const defaultRed = primaryRed;

// Backgrounds
export const primaryBackground = white;
export const primaryBackgroundFaintShade = faintGray;
export const secondaryBackground = lightestGray;
export const tertiaryBackground = lighterGray;
export const quaternaryBackground = lightGray;
export const invertedSecondaryBackground = tertiaryBlue;
export const invertedTertiaryBackground = secondaryBlue;
export const invertedQuaternaryBackground = primaryBlue;

// Nav
export const mainNav = royalerBlue;
export const mainNavBorder = applyOpacity(royalerBlue, 0.6);

// Text
export const violetText = royalBlue;
export const violetTextDark = jacksonsPurple;

// Icons
export const icon = mediumGray;

// Buttons
export const disabledButton = darkGray;
export const violetButton = cornflowerBlue;
export const violetButtonLight = moonRaker;
export const violetButtonDark = royalBlue;

// Switches
export const switchDisabled = lightGray;
export const switchEnabled = defaultBlue;

// Text
export const primaryText = midnightBlue;
export const secondaryText = darkGray;
export const tertiaryText = secondaryBlue;
export const invertedText = white;
export const invertedSecondaryText = lightGray;

// Forms
export const formText = primaryText;
export const formPlaceholderText = mediumGray;
export const formInputBackground = primaryBackgroundFaintShade;
export const formInputBorder = tertiaryBackground;

// Gradients
export const gradientStart = { x: 0, y: 0.25 };
export const gradientEnd = { x: 1, y: 1 };
export const primaryGradient = [primaryBlue, tertiaryBlue];
export const secondaryGradient = [primaryBlue, secondaryBlue];
export const disabledGradient = [darkGray, darkGray];

// Exposure History
export const exposureRiskWarning = royalBlue;