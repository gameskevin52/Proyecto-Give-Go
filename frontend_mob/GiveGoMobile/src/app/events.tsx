import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter, Href } from 'expo-router';

type Event = {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  status: string;
  organization: string;
};

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Jornada de voluntariado ambiental',
    category: 'Medio ambiente',
    description:
      'Actividad de limpieza y recuperación de espacios públicos.',
    date: '20 de agosto de 2026',
    status: 'Disponible',
    organization: 'Fundación Give&Go',
  },
  {
    id: '2',
    title: 'Donación de alimentos',
    category: 'Ayuda social',
    description:
      'Jornada de recolección y entrega de alimentos a familias.',
    date: '25 de agosto de 2026',
    status: 'Disponible',
    organization: 'Fundación Esperanza',
  },
  {
    id: '3',
    title: 'Apoyo educativo para niños',
    category: 'Educación',
    description:
      'Actividad de acompañamiento y apoyo escolar para niños.',
    date: '30 de agosto de 2026',
    status: 'Disponible',
    organization: 'Fundación Futuro',
  },
];

type EventCardProps = {
  event: Event;
  onPress: () => void;
};

function EventCard({ event, onPress }: EventCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
      onPress={onPress}
    >
      <View style={styles.cardHeader}>
        <Text style={styles.category}>{event.category}</Text>

        <View style={styles.status}>
          <Text style={styles.statusText}>{event.status}</Text>
        </View>
      </View>

      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.description} numberOfLines={2}>
        {event.description}
      </Text>

      <View style={styles.info}>
        <Text style={styles.infoText}>📅 {event.date}</Text>
        <Text style={styles.infoText}>
          🏢 {event.organization}
        </Text>
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const router = useRouter();

  const handleEventPress = (event: Event) => {
    router.push({
      pathname: '/event-detail',
      params: {
        id: event.id,
      },
    } as unknown as Href);
  };

  const handleCreateEvent = () => {
    router.push('/create-event' as Href);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.subtitle}>Give&Go</Text>
          <Text style={styles.headerTitle}>Eventos</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.createButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCreateEvent}
        >
          <Text style={styles.createButtonText}>
            + Crear
          </Text>
        </Pressable>
      </View>

      <View style={styles.introduction}>
        <Text style={styles.introductionTitle}>
          Encuentra una oportunidad para ayudar
        </Text>

        <Text style={styles.introductionText}>
          Consulta los eventos disponibles y participa como
          voluntario.
        </Text>
      </View>

      <FlatList
        data={EVENTS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            onPress={() => handleEventPress(item)}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },

  subtitle: {
    fontSize: 14,
    color: '#777777',
    marginBottom: 2,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: '700',
    color: '#1F1F1F',
  },

  createButton: {
    backgroundColor: '#D62828',
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
  },

  createButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },

  buttonPressed: {
    opacity: 0.75,
  },

  introduction: {
    marginHorizontal: 20,
    marginBottom: 10,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F7F7F7',
  },

  introductionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 5,
  },

  introductionText: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
  },

  list: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },

  cardPressed: {
    opacity: 0.8,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 9,
  },

  category: {
    color: '#D62828',
    fontSize: 13,
    fontWeight: '700',
  },

  status: {
    backgroundColor: '#E9F7EF',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 10,
  },

  statusText: {
    color: '#238B45',
    fontSize: 12,
    fontWeight: '700',
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#202020',
    marginBottom: 7,
  },

  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },

  info: {
    gap: 6,
  },

  infoText: {
    fontSize: 13,
    color: '#555555',
  },
});