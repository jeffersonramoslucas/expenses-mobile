import { View, Pressable, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_OPTIONS } from '../utils/constants';

type Props = {
  selected: string | null;
  onSelect: (icon: string) => void;
};

export function IconPicker({ selected, onSelect }: Props) {
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.grid}
      showsVerticalScrollIndicator={false}
    >
      {ICON_OPTIONS.map((icon) => {
        const isSelected = selected === icon;

        return (
          <Pressable
            key={icon}
            onPress={() => onSelect(icon)}
            style={[
              styles.item,
              isSelected && styles.selected,
            ]}
          >
            <MaterialCommunityIcons
              name={icon as any}
              size={22}
              color={isSelected ? '#FFF' : '#444'}
            />
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 180, // 👈 limita a área visível (≈ 12 ícones)
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  item: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    backgroundColor: '#2ECC71',
  },
});
