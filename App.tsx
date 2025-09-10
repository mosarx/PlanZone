import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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
  const [appIsReady, setAppIsReady] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '152003794034-d3q29jrvqmjtp4jm2gfrpmg18nn3cjg6.apps.googleusercontent.com',
    iosClientId: '152003794034-poa7h2sfeee5367u5usbgnrv10mmaaku.apps.googleusercontent.com',
    androidClientId: '152003794034-nnd661rli7bjp2hbkk2c6qo3iik7mr2q.apps.googleusercontent.com',
    scopes: ['profile', 'email'],
    redirectUri: AuthSession.makeRedirectUri({ native: 'planzone://redirect' }),
  });

  useEffect(() => {
    // Empêche le splash natif de disparaître automatiquement
    SplashScreen.preventAutoHideAsync();

    // Simule l'initialisation de l'app avant de cacher le splash
    const prepare = async () => {
      try {
        // Ici tu peux charger des données, polices, etc.
        await new Promise((resolve) => setTimeout(resolve, 7000)); // 7 secondes de splash
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepare();
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

  if (!appIsReady) {
    return null; // Reste sur le splash natif
  }

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
