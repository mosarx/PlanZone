import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { Feather, AntDesign, FontAwesome6 } from '@expo/vector-icons';
import oward from './assets/images/oward.png';
import { useFonts } from 'expo-font';

interface AuthScreenProps {
  user: any;
  email: string;
  password: string;
  loading: boolean;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  onLogin: () => void;
  onSignUp: () => void;
  onLogout: () => void;
  onGoogleLogin: () => void;
  googleDisabled: boolean;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  user,
  email,
  password,
  loading,
  setEmail,
  setPassword,
  onLogin,
  onSignUp,
  onLogout,
  onGoogleLogin,
  googleDisabled,
}) => {
  const [isSignUp, setIsSignUp] = React.useState(true);
  const [termsAccepted, setTermsAccepted] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const [fontsLoaded] = useFonts({
    'Jost-Medium': require('./assets/fonts/Jost-Medium.ttf'),
  });

  if (!fontsLoaded) return null;

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setEmail('');
    setPassword('');
    setTermsAccepted(false);
  };

  const validatePassword = (pwd: string): boolean => {
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_])(?=(?:.*\d){1,2}$).{6,}$/;
    return pattern.test(pwd);
  };

  const isFormValid = () => {
    if (!email || !password) return false;
    if (isSignUp && (!termsAccepted || !validatePassword(password))) return false;
    return true;
  };

  const handleSubmit = () => {
    if (!isFormValid()) {
      Alert.alert('Erreur', 'Veuillez remplir correctement tous les champs.');
      return;
    }

    isSignUp ? onSignUp() : onLogin();
  };

  return (
    <View style={styles.container}>
      <Image source={oward} style={styles.logo} />
      <Text style={styles.title}>{isSignUp ? 'Sign up' : 'Log in'}</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        placeholder="Your email"
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Enter your password"
          style={[
            styles.passwordInput,
            showPassword && { fontFamily: 'Jost-Medium' }, // ✅ affiche police SEULEMENT quand visible
          ]}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.iconButton}
        >
          <Feather name={showPassword ? 'eye-off' : 'eye'} size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {isSignUp && (
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => setTermsAccepted(!termsAccepted)}
            style={styles.checkbox}
          >
            <View
              style={[
                styles.checkboxBox,
                termsAccepted && styles.checkboxChecked,
              ]}
            />
          </TouchableOpacity>
          <Text style={styles.termsText}>I accept the terms and privacy policy</Text>
        </View>
      )}

      <TouchableOpacity
        style={[styles.button, !isFormValid() && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={!isFormValid() || loading}
      >
        <Text style={styles.buttonText}>
          {isSignUp ? 'Sign up' : 'Log in'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.orText}>
        Or {isSignUp ? 'register' : 'log in'} with
      </Text>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          onPress={onGoogleLogin}
          style={styles.socialButton}
          disabled={googleDisabled}
        >
          <AntDesign name="google" size={24} color="#DB4437" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => Alert.alert('Twitter login not implemented yet')}
          style={styles.socialButton}
        >
          <FontAwesome6 name="x-twitter" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={toggleForm} style={styles.toggleContainer}>
        <Text style={styles.toggleText}>
          {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
          <Text style={styles.toggleLink}>
            {isSignUp ? 'Log in' : 'Sign up'}
          </Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 25,
    textAlign: 'left',
    fontFamily: 'Jost-Medium',
  },
  label: {
    fontWeight: '700',
    marginBottom: 5,
    fontFamily: 'Jost-Medium',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    fontFamily: 'Jost-Medium',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  iconButton: {
    marginLeft: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: '#333',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: '#333',
  },
  termsText: {
    fontWeight: '600',
    fontFamily: 'Jost-Medium',
  },
  button: {
    backgroundColor: '#333',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 25,
  },
  buttonDisabled: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
    fontFamily: 'Jost-Medium',
  },
  orText: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontFamily: 'Jost-Medium',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginHorizontal: 8,
  },
  toggleContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  toggleText: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Jost-Medium',
  },
  toggleLink: {
    fontWeight: '700',
    color: '#000',
    fontFamily: 'Jost-Medium',
  },
});

export default AuthScreen;
