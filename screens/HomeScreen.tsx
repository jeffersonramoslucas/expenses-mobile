import { Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import uuid from 'react-native-uuid';

import { CategoryButton } from '../components/CategoryButton';
import { ExpenseModal } from '../components/ExpenseModal';
import { NewCategoryModal } from '../components/NewCategoryModal';
import { Category } from '../types/Category';

import { getCategories, createCategory} from '../services/categories';

// const initialCategories: Category[] = [
//   {
//     id: '1',
//     label: 'Alimentação',
//     icon: 'food',
//     color: '#E74C3C',
//     background: '#FDECEC',
//   },
//   {
//     id: '2',
//     label: 'Transporte',
//     icon: 'bus',
//     color: '#3498DB',
//     background: '#EAF2FD',
//   },
//   {
//     id: '3',
//     label: 'Lazer',
//     icon: 'gamepad-variant',
//     color: '#9B59B6',
//     background: '#F3E9FA',
//   },
//   {
//     id: '4',
//     label: 'Mercado',
//     icon: 'cart',
//     color: '#27AE60',
//     background: '#EAF8F1',
//   },
//   {
//     id: '5',
//     label: 'Assinaturas',
//     icon: 'credit-card',
//     color: '#F39C12',
//     background: '#FFF3E0',
//   },
//   {
//     id: '6',
//     label: 'Saúde',
//     icon: 'heart',
//     color: '#F06595',
//     background: '#F06595' + 22,
//   },
//   {
//     id: '7',
//     label: 'Educação',
//     icon: 'school',
//     color: '#1C7ED6',
//     background: '#1C7ED6' + 22,
//   },
//   {
//     id: '8',
//     label: 'Outros',
//     icon: 'dots-horizontal',
//     color: '#7F8C8D',
//     background: '#F0F0F0',
//   },
// ];

export function HomeScreen() {
  // const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryVisible, setNewCategoryVisible] = useState(false);
  const usedColors = categories.map((c) => c.color);
  // const [modalVisible, setModalVisible] = useState(false);
  

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  async function loadCategories() {
    try {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Erro ao buscar categorias', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  // 🔄 Loading
  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        {/* <ActivityIndicator size={32} /> */}
        <Text style={styles.loadingText}>Carregando categorias...</Text>
      </SafeAreaView>
    );
  }

  // ❌ Erro
  if (error) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.errorText}>Erro ao carregar categorias</Text>

        <TouchableOpacity onPress={loadCategories}>
          <Text style={styles.retryText}>Tentar novamente</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
  
  // function handleCreateCategory(data: {
  //   label: string;
  //   icon: string;
  //   color: string;
  //   background: string;
  // }) {
  //   const newCategory: Category = {
  //     id: String(uuid.v4()),
  //     ...data,
  //   };

  //   setCategories((prev) => [...prev, newCategory]);
  //   setNewCategoryVisible(false);
  // }

  async function handleCreateCategory(data: {
    label: string;
    icon: string;
    color: string;
    background: string;
  }) {
    try {
      await createCategory(data);
      setNewCategoryVisible(false);
      await loadCategories(); // 🔁 Recarrega do backend
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
    }
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Novo gasto</Text>

      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 24 }}
        renderItem={({ item }) => (
          <CategoryButton
            category={item}
            onPress={() => setSelectedCategory(item)}
          />
        )}
        ListFooterComponent={
          <TouchableOpacity
            style={styles.addCategory}
            onPress={() => setNewCategoryVisible(true)}
          >
            <Text style={styles.addCategoryText}>+ Nova categoria</Text>
          </TouchableOpacity>
        }
      />

      {/* <TouchableOpacity
        style={styles.addCategory}
        onPress={() => setNewCategoryVisible(true)}
      >
        <Text style={styles.addCategoryText}>+ Nova categoria</Text>
      </TouchableOpacity> */}

      {/* Modal de gasto */}
      <ExpenseModal
        visible={!!selectedCategory}
        category={selectedCategory}
        onClose={() => setSelectedCategory(null)}
      />

      {/* Modal de nova categoria */}
      <NewCategoryModal
        visible={newCategoryVisible}
        usedColors={categories.map((c) => c.color)}
        onClose={() => setNewCategoryVisible(false)}
        onSave={handleCreateCategory}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  addCategory: {
    marginTop: 12,
    marginBottom: 50,
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ECECEC',
    alignItems: 'center',
  },
  addCategoryText: {
    fontWeight: '600',
    color: '#555',
  },
});