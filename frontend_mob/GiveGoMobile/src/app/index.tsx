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
    organization: 'Cruz Roja',
  },
];

function EventCard({
  event,
  onPress,
}: {
  event: Event;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.eventCard} onPress={onPress}>
      <View style={styles.cardContent}>
        <View style={styles.titleSection}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <Text style={styles.eventCategory}>{event.category}</Text>
        </View>

        <Text style={styles.eventDescription}>
          {event.description}
        </Text>

        <View style={styles.info}>
          <Text style={styles.infoText}>📅 {event.date}</Text>
          <Text style={styles.infoText}>
            🏢 {event.organization}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

export default function Index() {
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
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 16,
    borderRadius: 12,
    marginVertical: 16,
  },

  introductionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F1F1F',
    marginBottom: 6,
  },

  introductionText: {
    fontSize: 14,
    color: '#777777',
    lineHeight: 20,
  },

  list: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },

  eventCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },

  cardContent: {
    padding: 16,
  },

  titleSection: {
    marginBottom: 12,
  },

  eventTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1F1F',
    marginBottom: 4,
  },

  eventCategory: {
    fontSize: 12,
    color: '#D62828',
    fontWeight: '600',
  },

  eventDescription: {
    fontSize: 13,
    color: '#666666',
    lineHeight: 18,
    marginBottom: 12,
  },

  info: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },

  infoText: {
    fontSize: 12,
    color: '#777777',
    marginBottom: 4,
  },
});