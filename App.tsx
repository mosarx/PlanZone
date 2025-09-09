import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Alert, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithCredential,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

import AuthScreen from './authscreen';

// ✅ Ajout Dimensions pour récupérer width
const { width, height } = Dimensions.get('window');

SplashScreen.preventAutoHideAsync();
WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
  apiKey: "AIzaSyCS_FcqSB8Ls3wV5hlG4n74bwtHlMVyFRM",
  authDomain: "planzone-37b62.firebaseapp.com",
  projectId: "planzone-37b62",
  storageBucket: "planzone-37b62.appspot.com",
  messagingSenderId: "152003794034",
  appId: "1:152003794034:web:b600a831da432cccc31eeb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isMorning = new Date().getHours() < 18;

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '152003794034-d3q29jrvqmjtp4jm2gfrpmg18nn3cjg6.apps.googleusercontent.com',
    iosClientId: '152003794034-poa7h2sfeee5367u5usbgnrv10mmaaku.apps.googleusercontent.com',
    androidClientId: '152003794034-nnd661rli7bjp2hbkk2c6qo3iik7mr2q.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ native: 'planzone://redirect' })
  });

  // Splash pendant 7 secondes
  useEffect(() => {
    const timer = setTimeout(async () => {
      setShowSplash(false);
      setIsReady(true);
      await SplashScreen.hideAsync();
    }, 7000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usr) => {
      setUser(usr);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((err) => {
        console.log("Erreur Google Auth:", err.message);
        Alert.alert("Erreur", "Échec de la connexion Google.");
      });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Connexion réussie !");
    } catch (err: any) {
      Alert.alert("Erreur connexion", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!email || !password) {
      Alert.alert("Erreur", "Veuillez entrer un email et un mot de passe.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Succès", "Inscription réussie !");
    } catch (err: any) {
      Alert.alert("Erreur inscription", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.log("Erreur déconnexion:", err);
    }
  };

  // ✅ Splash personnalisé intégré
  if (showSplash) {
    return (
      <View style={[styles.splashContainer, { backgroundColor: isMorning ? '#FFFFFF' : '#FAB0B0' }]}>
        <Image
          source={isMorning ? require('./assets/images/elvira.png') : require('./assets/images/omerta.png')}
          style={styles.splashImage}
          resizeMode="contain"
        />
      </View>
    );
  }

  // ✅ App principale
  return (
    <>
      <StatusBar style="dark" />
      <AuthScreen
        user={user}
        email={email}
        password={password}
        loading={loading}
        setEmail={setEmail}
        setPassword={setPassword}
        onLogin={handleLogin}
        onSignUp={handleSignUp}
        onLogout={handleLogout}
        onGoogleLogin={() => promptAsync()}
        googleDisabled={!request}
      />
    </>
  );
}

// 🎨 Styles du splash
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashImage: {
    width: width * 0.6,      // ✅ 50% de la largeur de l’écran
    height: width * 0.6,     // ✅ carré, donc même taille
    resizeMode: 'contain',   // ✅ pour que l'image garde ses proportions
  },
});
