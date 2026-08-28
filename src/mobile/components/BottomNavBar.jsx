import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default function BottomNavBar({ activeTab, onTabPress }) {
  const tabs = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '🏰' },
    { id: 'worlds', label: 'WORLDS', icon: '🗺️' },
    { id: 'profile', label: 'PROFILE', icon: '👤' },
    { id: 'certificates', label: 'CERTS', icon: '🎓' },
    { id: 'github', label: 'GITHUB', icon: '🐙' }
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={() => onTabPress(tab.id)}
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
    backgroundColor: '#111827',
    borderTopWidth: 4,
    borderTopColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 4,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabButton: {
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6
  },
  activeTabButton: {
    backgroundColor: '#1e293b'
  },
  tabIcon: {
    fontSize: 16,
    marginBottom: 2
  },
  tabLabel: {
    fontFamily: 'PressStart2P',
    color: '#64748b',
    fontSize: 7
  },
  activeTabLabel: {
    color: '#14b8a6'
  }
});
