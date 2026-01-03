import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator, Text, Dimensions, ScrollView, StyleSheet, Animated, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-gifted-charts';
import axios from 'axios';

import { getExpenses } from '../services/expenses';

type Props = {
  title: string;
  value: number;
};

type Expense = {
  value: number;
  category: {
    label: string;
    color: string;
  };
};

type ChartItem = {
  value: number;
  color: string;
  text: string;
};

const screenWidth = Dimensions.get('window').width;

export default function ReportsScreen() {
  const [chartData, setChartData] = useState<ChartItem[]>([]);
  const [selected, setSelected] = useState<ChartItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  
  async function loadExpenses() {
    try {
      setLoading(true);
      const data = await getExpenses();
      const grouped = groupByCategory(data);

      setChartData(grouped);
      setSelected(null); // volta para total geral
      setLoading(false);
    } catch (err) {
      console.error('Erro ao buscar categorias', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadExpenses();
    }, [])
  );

  const total = useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 40 }} />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingTop: 24 }}>
        <Text style={styles.title}>Gastos por categoria</Text>

        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            donut
            radius={110}
            innerRadius={70}
            innerCircleColor="#F7F7F7"
            focusOnPress
            // hasLegend={true}
            onPress={(item: ChartItem) => {
              setSelected(prev =>
                prev?.text === item.text ? null : item
              );
            }}
            centerLabelComponent={() => (
              <CenterLabel
                title={selected ? selected.text : 'Total'}
                value={selected ? selected.value : total}
              />
            )}
          />

          <ChartLegend
            data={chartData}
            selected={selected}
            onSelect={item =>
              setSelected(prev =>
                prev?.text === item.text ? null : item
              )
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ChartLegend({
  data,
  selected,
  onSelect,
}: {
  data: ChartItem[];
  selected: ChartItem | null;
  onSelect: (item: ChartItem) => void;
}) {
  return (
    <ScrollView style={styles.legend}>
      {data.map(item => {
        const isActive = selected?.text === item.text;

        return (
          <Text
            key={item.text}
            style={[
              styles.legendItem,
              isActive && styles.legendItemActive,
            ]}
            onPress={() => onSelect(item)}
          >
            <Text
              style={[
                styles.legendDot,
                { color: item.color },
              ]}
            >
              ●
            </Text>{' '}
            {item.text}
          </Text>
        );
      })}
    </ScrollView>
  );
}

export function CenterLabel({ title, value }: Props) {
  const animatedValue = useRef(new Animated.Value(0)).current;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value,
      duration: 600,
      useNativeDriver: false,
    }).start();

    const listener = animatedValue.addListener(({ value }) => {
      setDisplayValue(value);
    });

    return () => {
      animatedValue.removeListener(listener);
    };
  }, [value]);

  return (
    <>
      <Text style={styles.centerTitle}>{title}</Text>
      <Animated.Text style={styles.centerValue}>
        R$ {displayValue.toFixed(2).replace('.', ',')}
      </Animated.Text>
    </>
  );
}

function groupByCategory(expenses: Expense[]): ChartItem[] {
  const map: Record<string, { value: number; color: string }> = {};

  expenses.forEach(expense => {
    const key = expense.category.label;

    if (!map[key]) {
      map[key] = {
        value: 0,
        color: expense.category.color,
      };
    }

    map[key].value += expense.value;
  });

  return Object.entries(map).map(([label, data]) => ({
    text: label,
    value: data.value,
    color: data.color,
  }));
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 24,
  },
  centerTitle: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
  },
  centerValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    textAlign: 'center',
  },

  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  legend: {
    marginLeft: 16,
    maxHeight: 220,
  },

  legendItem: {
    fontSize: 14,
    marginBottom: 10,
    color: '#333',
  },

  legendItemActive: {
    fontWeight: '700',
  },

  legendDot: {
    fontSize: 16,
  },


});