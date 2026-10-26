import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function BottomNavBar({ activeTab, onTabPress }) {
  const tabs = [
    { id: 'quests', label: 'QUESTS', icon: '\u{1F3F0}' },
    { id: 'inventory', label: 'INVENTORY', icon: '\u{1F392}' },
    { id: 'battle', label: 'BATTLE', icon: '\u2694\uFE0F' },
    { id: 'stats', label: 'STATS', icon: '\u{1F4CA}' },
    { id: 'shop', label: 'SHOP', icon: '\u{1FA99}' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || (activeTab === 'dashboard' && tab.id === 'quests') || (activeTab === 'worlds' && tab.id === 'inventory') || (activeTab === 'profile' && tab.id === 'stats') || (activeTab === 'certificates' && tab.id === 'shop') || (activeTab === 'github' && tab.id === 'battle');
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabPress(tab.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text style={[styles.tabLabel, isActive && styles.activeTabLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#080f1a',
    borderTopColor: '#1e293b',
    borderTopWidth: 1.5,
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    marginHorizontal: 2,
    borderRadius: 6
  },
  activeTabButton: {
    backgroundColor: '#0d2235',
    borderColor: '#38bdf8',
    borderWidth: 1
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 4
  },
  tabLabel: {
    fontFamily: 'PressStart2P',
    fontSize: 7,
    color: '#64748b',
    textAlign: 'center'
  },
  activeTabLabel: {
    color: '#38bdf8'
  }
});
