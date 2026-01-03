import { Pressable, Text, StyleSheet, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Category } from '../types/Category';

type Props = {
  category: Category;
  onPress: () => void;
  isAdd?: boolean;
};

export function CategoryButton({ category, onPress, isAdd }: Props) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: category.background },
        isAdd && pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
      ]}
    >
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: category.color + '22' },
        ]}
      >
        <MaterialCommunityIcons
          name={category.icon as any}
          size={20}
          color={category.color}
        />
      </View>

      <Text style={styles.label}>{category.label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 110,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1C1C1E',
  },
});
