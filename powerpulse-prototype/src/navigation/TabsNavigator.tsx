import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import type { TabsParamList } from './types';
import { HomeScreen } from '../screens/HomeScreen';
import { AppliancesScreen } from '../screens/AppliancesScreen';
import { ChallengeScreen } from '../screens/ChallengeScreen';
import { RewardsScreen } from '../screens/RewardsScreen';
import { InsightsScreen } from '../screens/InsightsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator<TabsParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: { backgroundColor: '#0F1A30' },
        headerTintColor: '#EAF0FF',
        tabBarStyle: {
          backgroundColor: '#0F1A30',
          borderTopColor: '#22304A',
        },
        tabBarActiveTintColor: '#4DA3FF',
        tabBarInactiveTintColor: '#7F92B8',
        tabBarIcon: ({ color, size }) => {
          const map: Record<keyof TabsParamList, keyof typeof Ionicons.glyphMap> =
            {
              Home: 'flash',
              Appliances: 'grid',
              Challenge: 'trophy',
              Rewards: 'gift',
              Insights: 'bar-chart',
              Settings: 'settings',
            };
          return <Ionicons name={map[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Appliances" component={AppliancesScreen} />
      <Tab.Screen name="Challenge" component={ChallengeScreen} />
      <Tab.Screen name="Rewards" component={RewardsScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

