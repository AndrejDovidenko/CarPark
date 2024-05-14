import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDoc,
  getDocs,
  setDoc,
  doc,
  query,
  addDoc,
  updateDoc,
  deleteDoc,
  limit,
  orderBy,
} from "firebase/firestore/lite";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  currentUser,
} from "firebase/auth";
import spa from "../main";
import LoginForm from "./LoginForm";
// import firebase from "firebase/compat/app";

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
const db = getFirestore(app);

class FirebaseAPI {
  constructor(app, myAuth, db) {
    this.app = app;
    this.myAuth = myAuth;
    this.db = db;
    this.monitorAuthState();
    this.pathUserCars = null;
    this.pathUserNotes = null;
    this.pathUserParts = null;
  }

  async getItemsArr(path) {
    const snapshot = await getDocs(query(collection(this.db, path)));

    // console.log();
    // console.log(x);
    return snapshot;
  }

  async getItem(path, id) {
    const docSnap = await getDoc(doc(this.db, `${path}/${id}`));

    return docSnap.data();
  }

  async createItem(id, data = {}, path = this.pathUserCars) {
    await setDoc(doc(this.db, path, id), data);
  }

  async deleteItem(id, path = this.pathUserCars) {
    await deleteDoc(doc(this.db, path, id));
  }

  async createDocUser(path, id, data = {}) {
    await setDoc(doc(this.db, path, id), data);
  }

  // async createCollectionUser(path, id, data = {}) {
  //   await addDoc(collection(this.db, path, id), data);
  // }

  async createAccount(email, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        this.myAuth,
        email,
        password
      );

      await this.signInEmailPassword(email, password);
      this.createDocUser("Users", userCredential.user.uid, {});
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
        this.myAuth,
        email,
        password
      );
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

  monitorAuthState() {
    onAuthStateChanged(this.myAuth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user

        // console.log(this);
        this.pathUserCars = `Users/${user.uid}/cars`;
        this.pathUserNotes = `Users/${user.uid}/notes`;
        this.pathUserParts = `Users/${user.uid}/parts`;

        spa.openUserProfile();
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
    await signOut(this.myAuth);
  }
}

const Firebase = new FirebaseAPI(app, auth, db);

export default Firebase;
