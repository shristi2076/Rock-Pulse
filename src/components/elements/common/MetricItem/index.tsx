import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Ionicons from '@react-native-vector-icons/ionicons';
import { Colors } from '@/theme/colors';

interface MetricItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  label: string;
  value: string | number;
}

const MetricItem: React.FC<MetricItemProps> = ({
  icon,
  color,
  label,
  value,
}) => {
  return (
    <View>
      <View style={styles.header}>
        <Ionicons name={icon} color={color} size={15} />
        <Text style={styles.label}>{label}</Text>
      </View>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
};

export default MetricItem;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  label: {
    color: '#aaa',
    fontSize: 14,
    marginLeft: 4,
  },

  value: {
    color: Colors.white,
    fontSize: 18,
    marginTop: 4,
  },
});
