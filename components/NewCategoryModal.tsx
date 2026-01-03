import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { useEffect, useState } from 'react';
import { IconPicker } from './IconPicker';
import { getRandomColor } from '../utils/colors';

type Props = {
  visible: boolean;
  usedColors: string[];
  onClose: () => void;
  onSave: (data: {
    label: string;
    icon: string;
    color: string;
    background: string;
  }) => void;
};

export function NewCategoryModal({
  visible,
  usedColors,
  onClose,
  onSave,
}: Props) {
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState<string | null>(null);
  const [color, setColor] = useState('');

  useEffect(() => {
    if (visible) {
      setColor(getRandomColor(usedColors));
    }
  }, [visible]);

  function handleSave() {
    if (!label || !icon) return;

    onSave({
      label,
      icon,
      color,
      background: color + '22',
    });

    setLabel('');
    setIcon(null);
  }

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <Text style={styles.title}>Nova categoria</Text>

          <TextInput
            placeholder="Nome da categoria"
            value={label}
            onChangeText={setLabel}
            style={styles.input}
          />

          <Text style={styles.subtitle}>Escolha um ícone</Text>
          <IconPicker selected={icon} onSelect={setIcon} />

          <TouchableOpacity
            style={[
              styles.button,
              (!label || !icon) && { opacity: 0.5 },
            ]}
            onPress={handleSave}
            disabled={!label || !icon}
          >
            <Text style={styles.buttonText}>Criar categoria</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onClose}>
            <Text style={styles.cancel}>Cancelar</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  subtitle: {
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#2ECC71',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  cancel: {
    textAlign: 'center',
    marginTop: 12,
    color: '#999',
  },
});
