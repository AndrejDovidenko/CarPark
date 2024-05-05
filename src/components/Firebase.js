import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  logOut,
  signOut,
} from "firebase/auth";
import spa from "../main";
import LoginForm from "./LoginForm";

const firebaseConfig = {
  apiKey: "AIzaSyCv0NijHKxa2raBAqVFVS5WoYdAA0iqLvU",
  authDomain: "itacademyproject-66716.firebaseapp.com",
  projectId: "itacademyproject-66716",
  storageBucket: "itacademyproject-66716.appspot.com",
  messagingSenderId: "622088889484",
  appId: "1:622088889484:web:ff7f77a7f881ac723f87a9",
  measurementId: "G-GCPLNY93V9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

class FirebaseAPI {
  constructor(app, auth) {
    this.app = app;
    this.auth = auth;
  }

  async createAccount(email, password) {
    try {
      await createUserWithEmailAndPassword(this.auth, email, password);

      this.signInEmailPassword(email, password);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          LoginForm.showInfo("Введен некоректный адрес электронной почты");
          break;
        case "auth/email-already-in-use":
          LoginForm.showInfo(
            "Такой Email уже существует, попробуйте войти в аккаунт!"
          );
          break;
        case "auth/missing-password":
          LoginForm.showInfo("Введите пароль!");
          break;
        case "auth/weak-password":
          LoginForm.showInfo("Пароль слишком слабый. Минимум 6 символов!");
          break;
      }
    }
  }

  async signInEmailPassword(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.auth,
        email,
        password
      );

      console.log(userCredential.user);
    } catch (error) {
      switch (error.code) {
        case "auth/invalid-email":
          LoginForm.showInfo("Введен некоректный адрес электронной почты");
          break;
        case "auth/invalid-credential":
          LoginForm.showInfo("Введены неверный email пароль!");
          break;
        case "auth/missing-password":
          LoginForm.showInfo("Введите пароль!");
          break;
      }
    }
  }

  async monitorAuthState() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        spa.openUserProfile();
        console.log(user);
        const uid = user.uid;
        // ...
      } else {
        spa.renderLoginForm();
        LoginForm.showInfo("Введите логин и пароль что бы войти!");
        // console.log("ytdthysq kjuby");
        // User is signed out
        // ...
      }
    });
  }

  async logOut() {
    await signOut(this.auth);
  }
}

const Firebase = new FirebaseAPI(app, auth);

export default Firebase;
