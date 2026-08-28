import React from 'react';
import { View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { getCharacterById } from '../../data/characterSprites';

export default function PixelCharacterAvatar({ characterId = 'm1', size = 28, borderColor }) {
  const activeChar = getCharacterById(characterId);
  const borderCol = borderColor || activeChar.color || '#06b6d4';

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: 4,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: borderCol,
        backgroundColor: '#0f172a',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Svg width={size} height={size} viewBox="0 0 24 24">
        <Rect width="24" height="24" fill="#0f172a" />
        <Rect x="5" y="4" width="14" height="6" fill={activeChar.hairColor} />
        <Rect x="7" y="7" width="10" height="7" fill={activeChar.skinColor} />
        <Rect x="9" y="9" width="2" height="2" fill="#0f172a" />
        <Rect x="13" y="9" width="2" height="2" fill="#0f172a" />
        <Rect x="6" y="14" width="12" height="8" fill={activeChar.coatColor} />
        <Rect x="10" y="14" width="4" height="8" fill={activeChar.accentColor} />
      </Svg>
    </View>
  );
}
