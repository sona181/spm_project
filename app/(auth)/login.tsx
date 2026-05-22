import { Link } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { useAuth } from '../../src/context/AuthContext';

export default function LoginScreen() {
  const { login } = useAuth();
  const theme = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
    } catch (e: unknown) {
      const msg =
        (e as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed. Please check your credentials.';
      setError(Array.isArray(msg) ? msg.join(' ') : msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo / brand */}
        <View style={styles.header}>
          <Text variant="displaySmall" style={[styles.brand, { color: theme.colors.primary }]}>
            UniLearn
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Sign in to continue learning
          </Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            returnKeyType="next"
            left={<TextInput.Icon icon="email-outline" />}
            mode="outlined"
          />

          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoComplete="password"
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            left={<TextInput.Icon icon="lock-outline" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off-outline' : 'eye-outline'}
                onPress={() => setShowPassword((v) => !v)}
              />
            }
            mode="outlined"
            style={styles.mt12}
          />

          {!!error && (
            <HelperText type="error" visible>
              {error}
            </HelperText>
          )}

          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.mt20}
            contentStyle={styles.btnContent}
          >
            Sign In
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text variant="bodyMedium">Don't have an account? </Text>
          <Link href="/(auth)/register" asChild>
            <Text variant="bodyMedium" style={{ color: theme.colors.primary, fontWeight: '600' }}>
              Register
            </Text>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: '#F5F7FA' },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: { alignItems: 'center', marginBottom: 40 },
  brand: { fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: '#666', marginTop: 6 },
  form: { gap: 0 },
  mt12: { marginTop: 12 },
  mt20: { marginTop: 20 },
  btnContent: { paddingVertical: 6 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 32,
  },
});
