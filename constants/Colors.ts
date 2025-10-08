const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000014',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    // GateItem colors
    pressedBackground: '#eef',
    border: 'transparent',
    secondaryText: '#555',
    tertiaryText: '#999',
    // Input and card colors
    inputBackground: '#fff',
    inputBorder: '#ddd',
    cardBackground: '#fff',
    cardShadow: 'rgba(0,0,0,0.08)',
    // Additional UI colors
    emptyStateText: '#666',
    errorText: '#dc143c',
  },
  dark: {
    text: '#fff',
    background: '#000014',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    // GateItem colors
    pressedBackground: '#222',
    border: '#333',
    secondaryText: '#aaa',
    tertiaryText: '#666',
    // Input and card colors
    inputBackground: '#1a1a2e',
    inputBorder: '#333',
    cardBackground: '#1a1a2e',
    cardShadow: 'rgba(255,255,255,0.05)',
    // Additional UI colors
    emptyStateText: '#999',
    errorText: '#ff6b6b',
  },
};
