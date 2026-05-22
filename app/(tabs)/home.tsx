import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import {
  Avatar,
  Button,
  Card,
  Chip,
  ProgressBar,
  Text,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/context/AuthContext';
import { courseService } from '../../src/services/courseService';
import type { EnrollmentSummary } from '../../src/types/course';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const router = useRouter();
  const [enrollments, setEnrollments] = useState<EnrollmentSummary[]>([]);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const displayName = user?.profile?.displayName ?? user?.email ?? 'Learner';
  const initials = displayName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    courseService
      .myEnrollments()
      .then(setEnrollments)
      .catch(() => {})
      .finally(() => setLoadingEnrollments(false));
  }, []);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="bodyLarge" style={styles.greeting}>
              Welcome back,
            </Text>
            <Text variant="headlineSmall" style={[styles.name, { color: theme.colors.primary }]}>
              {displayName}
            </Text>
          </View>
          {user?.profile?.avatarUrl ? (
            <Avatar.Image size={48} source={{ uri: user.profile.avatarUrl }} />
          ) : (
            <Avatar.Text size={48} label={initials} />
          )}
        </View>

        {/* Streak / XP chips */}
        <View style={styles.chips}>
          <Chip icon="fire" style={styles.chip}>
            Streak coming soon
          </Chip>
          <Chip icon="star" style={styles.chip}>
            XP coming soon
          </Chip>
        </View>

        {/* My courses */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              My Courses
            </Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
              <Text variant="labelMedium" style={{ color: theme.colors.primary }}>
                Browse all
              </Text>
            </TouchableOpacity>
          </View>

          {loadingEnrollments ? null : enrollments.length === 0 ? (
            <Card style={styles.emptyCard} mode="elevated">
              <Card.Content>
                <Text variant="bodyMedium" style={{ color: '#666', textAlign: 'center' }}>
                  You haven't enrolled in any courses yet.
                </Text>
                <Button
                  mode="contained"
                  style={{ marginTop: 12 }}
                  onPress={() => router.push('/(tabs)/courses')}
                >
                  Explore Courses
                </Button>
              </Card.Content>
            </Card>
          ) : (
            <FlatList
              data={enrollments}
              keyExtractor={(e) => e.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.courseList}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/course/${item.course.slug}`)}
                  activeOpacity={0.85}
                >
                  <Card style={styles.courseCard} mode="elevated">
                    <Card.Content>
                      <Text
                        variant="labelSmall"
                        style={{ color: theme.colors.primary, marginBottom: 4 }}
                      >
                        {item.course.category?.name ?? item.course.level}
                      </Text>
                      <Text variant="titleSmall" numberOfLines={2} style={styles.courseTitle}>
                        {item.course.title}
                      </Text>
                      <Text variant="bodySmall" style={styles.courseAuthor}>
                        {item.course.author.displayName}
                      </Text>
                      {item.progress && (
                        <View style={styles.progress}>
                          <ProgressBar
                            progress={Number(item.progress.progressPercent) / 100}
                            color={theme.colors.primary}
                            style={styles.progressBar}
                          />
                          <Text variant="bodySmall" style={styles.progressLabel}>
                            {Number(item.progress.progressPercent).toFixed(0)}% complete
                          </Text>
                        </View>
                      )}
                    </Card.Content>
                  </Card>
                </TouchableOpacity>
              )}
            />
          )}
        </View>

        {/* Java Basics course */}
        <View style={styles.section}>
          <Text variant="titleMedium" style={[styles.sectionTitle, { marginBottom: 12 }]}>
            Start Learning
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/course/java-basics/learn')}
            activeOpacity={0.85}
          >
            <Card style={styles.javaCard} mode="elevated">
              <Card.Content>
                <View style={styles.javaCardRow}>
                  <View style={styles.javaIcon}>
                    <Text style={styles.javaEmoji}>☕</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Chip compact style={{ backgroundColor: '#EEF2FF', alignSelf: 'flex-start', marginBottom: 6 }}>
                      Beginner
                    </Chip>
                    <Text variant="titleSmall" style={{ fontWeight: '700', marginBottom: 2 }}>
                      Java Basics
                    </Text>
                    <Text variant="bodySmall" style={{ color: '#666' }}>
                      Variables, loops, OOP and more · 6 units
                    </Text>
                  </View>
                </View>
                <Button
                  mode="contained"
                  icon="play"
                  style={{ marginTop: 12 }}
                  contentStyle={{ paddingVertical: 4 }}
                  onPress={() => router.push('/course/java-basics/learn')}
                >
                  Start Learning
                </Button>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        </View>

        {/* Sign out */}
        <Button
          mode="outlined"
          onPress={logout}
          style={styles.logoutBtn}
          icon="logout"
          compact
        >
          Sign Out
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  scroll: { paddingBottom: 32 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginBottom: 12,
  },
  greeting: { color: '#666' },
  name: { fontWeight: '700' },
  chips: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  chip: { backgroundColor: '#EEF2FF' },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: { fontWeight: '700' },
  emptyCard: { borderRadius: 12 },
  courseList: { gap: 12, paddingRight: 4 },
  courseCard: { width: 200, borderRadius: 12 },
  courseTitle: { fontWeight: '600', marginBottom: 4, lineHeight: 20 },
  courseAuthor: { color: '#888', marginBottom: 10 },
  progress: { marginTop: 4 },
  progressBar: { height: 6, borderRadius: 3 },
  progressLabel: { color: '#888', marginTop: 4 },
  logoutBtn: { marginHorizontal: 20, marginTop: 8 },
  javaCard: { borderRadius: 12 },
  javaCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  javaIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#FFF7ED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  javaEmoji: { fontSize: 28 },
});
