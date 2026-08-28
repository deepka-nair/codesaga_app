import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import PixelCharacterAvatar from './PixelCharacterAvatar';
import { CHARACTERS } from '../../data/characterSprites';

export default function CharacterPicker({ selectedId = 'm1', onSelectCharacter }) {
  return (
    <View style={styles.container}>
      <Text style={styles.pickerTitle}>CHOOSE YOUR DETECTIVE AVATAR</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
        {CHARACTERS.map((char) => {
          const isSelected = selectedId === char.id;
          return (
            <TouchableOpacity
              key={char.id}
              style={[
                styles.charCard,
                isSelected && { borderColor: '#f59e0b', backgroundColor: '#1e293b' }
              ]}
              onPress={() => onSelectCharacter(char.id)}
            >
              <PixelCharacterAvatar characterId={char.id} size={40} borderColor={char.color} />
              <Text style={[styles.charName, isSelected && { color: '#f59e0b' }]}>{char.name}</Text>
              <Text style={[styles.charTitle, { color: char.color }]}>{char.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  pickerTitle: {
    fontFamily: 'PressStart2P',
    color: '#94a3b8',
    fontSize: 9,
    marginBottom: 8
  },
  scrollRow: {
    gap: 8,
    paddingRight: 10
  },
  charCard: {
    width: 90,
    backgroundColor: '#0f172a',
    borderWidth: 2,
    borderColor: '#334155',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center'
  },
  charName: {
    fontFamily: 'PressStart2P',
    color: '#f8fafc',
    fontSize: 8,
    marginTop: 6,
    textAlign: 'center'
  },
  charTitle: {
    fontFamily: 'Outfit',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center'
  }
});
