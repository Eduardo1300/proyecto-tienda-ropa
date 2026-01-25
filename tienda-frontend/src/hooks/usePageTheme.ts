import { useTheme } from '../context/ThemeContext';

export const usePageTheme = () => {
  const { isDarkMode } = useTheme();

  // Retorna las clases base para el fondo de la página
  const getPageBackground = () => {
    if (isDarkMode) {
      return 'bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900';
    }
    return 'bg-white';
  };

  // Retorna las clases para el texto principal
  const getTextColor = () => {
    if (isDarkMode) {
      return 'text-white';
    }
    return 'text-gray-900';
  };

  // Retorna las clases para el texto secundario
  const getSecondaryTextColor = () => {
    if (isDarkMode) {
      return 'text-gray-300';
    }
    return 'text-gray-600';
  };

  // Retorna las clases para tarjetas
  const getCardBackground = () => {
    if (isDarkMode) {
      return 'bg-white/10 backdrop-blur-md border border-white/20';
    }
    return 'bg-white border border-gray-200 shadow-md';
  };

  return {
    isDarkMode,
    getPageBackground,
    getTextColor,
    getSecondaryTextColor,
    getCardBackground,
  };
};
