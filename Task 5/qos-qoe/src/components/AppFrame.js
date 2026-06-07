import { StatusBar } from 'expo-status-bar';
import { Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles';
import { translate } from '../config/i18n';

const logoImg = require('../../assets/logo.png');

const TAB_ICONS = {
  collect: 'pulse-outline',
  dashboard: 'stats-chart-outline',
  map: 'map-outline',
  records: 'list-outline',
  settings: 'settings-outline',
};

export function AppFrame({ activeTab, children, language = 'en', onToggleLanguage, roleLabel, setActiveTab, tabs, user }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { paddingTop: insets.top }]}>
      <StatusBar style="light" />
      <View style={[styles.header, { backgroundColor: '#086cf2' }]}>
        <View style={styles.brandHeader}>
          <View style={[styles.brandLogo, { width: 42, height: 42, borderRadius: 10 }]}>
            <Image source={logoImg} style={styles.brandLogoImage} resizeMode="contain" />
          </View>
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={[styles.brandName, { fontSize: 18 }]}>KILObYTES</Text>
              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 }}>
                <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900', textTransform: 'uppercase' }}>{roleLabel}</Text>
              </View>
            </View>
            <Text style={[styles.userLine, { color: 'rgba(255,255,255,0.8)', marginTop: 0 }]}>
              {user.name}
            </Text>
          </View>
        </View>

        <View style={styles.headerActions}>
          <Pressable onPress={onToggleLanguage} style={styles.languageButton}>
            <Text style={styles.languageText}>{language === 'en' ? 'FR' : 'EN'}</Text>
          </Pressable>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
      <View style={[styles.tabs, { bottom: insets.bottom + 14 }]}>
        {tabs.map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setActiveTab(key)}
            style={[styles.tab, activeTab === key && styles.tabActive]}
          >
            <Ionicons 
              name={activeTab === key ? TAB_ICONS[key].replace('-outline', '') : TAB_ICONS[key]} 
              size={22} 
              color={activeTab === key ? '#ffffff' : '#91a0b4'} 
            />
            <Text style={[styles.tabText, activeTab === key && styles.tabTextActive]}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
