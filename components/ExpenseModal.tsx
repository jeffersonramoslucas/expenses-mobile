import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Animated,
} from 'react-native';
import { useEffect, useRef, useState } from 'react';
import { Category } from '../types/Category';
import { createExpense } from '../services/expenses';
import DateTimePicker from '@react-native-community/datetimepicker';


type Props = {
  visible: boolean;
  category: Category | null;
  onClose: () => void;
};

export function ExpenseModal({ visible, category, onClose }: Props) {
  const [value, setValue] = useState('');
  const [description, setDescription] = useState('');

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const translateY = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }).start();
    } else {
      translateY.setValue(300);
    }
  }, [visible]);

  async function handleSave() {
    if (!category) return;
    
    console.log({
      category,
      value: Number(value),
      description,
    });

    await createExpense({
      category_id: category.id,
      value: Number(value),
      description,
      date: date.toISOString().split('T')[0], // yyyy-mm-dd
    });

    setValue('');
    setDescription('');
    onClose();
  }

  return ( 
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
      <Pressable style={StyleSheet.absoluteFill} onPress={onClose}/>
        <View style={styles.appWidthWrapper}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Animated.View
              style={[
                styles.modal,
                { transform: [{ translateY }] },
              ]}
            >
              <Text style={styles.title}>{category?.label}</Text>

              <TextInput
                placeholder="Valor"
                keyboardType="numeric"
                value={value}
                onChangeText={setValue}
                style={styles.input}
              />

              <TextInput
                placeholder="Descrição (opcional)"
                value={description}
                onChangeText={setDescription}
                style={styles.input}
              />
              
              {Platform.OS === 'web' ? (
                <View style={styles.webDateWrapper}>
                  {/* <Text style={styles.dateLabel}>📅 Data</Text> */}
                  <input
                    type="date"
                    value={date.toISOString().split('T')[0]}
                    onChange={e => setDate(new Date(e.target.value))}
                    style={{
                      padding: 2,
                      borderRadius: 12,
                      border: '1px solid #DDD',
                      fontSize: 16,
                    }}
                  />
                </View>
              ) : (
                <>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowPicker(true)}
                  >
                    <Text style={styles.dateText}>
                      📅 {date.toLocaleDateString()}
                    </Text>
                  </TouchableOpacity>

                  {showPicker && (
                    <DateTimePicker
                      value={date}
                      mode="date"
                      display="default"
                      onChange={(_, selectedDate) => {
                        setShowPicker(false);
                        if (selectedDate) {
                          setDate(selectedDate);
                        }
                      }}
                    />
                  )}
                </>
              )}

              <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>Salvar gasto</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={onClose}>
                <Text style={styles.cancel}>Cancelar</Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
          </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    alignItems: 'center', 
  },

  appWidthWrapper: {
    width: '100%',           // ocupa a tela
    maxWidth: Platform.OS === 'web' ? 480 : '100%',
    alignSelf: 'center',     // centraliza
  },
  
  modal: {
    backgroundColor: '#FFF',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    },
  button: {
    backgroundColor: '#2ECC71',
    padding: 14,
    borderRadius: 8,
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
  dateButton: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#F0F0F0',
    marginBottom: 12,
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
});