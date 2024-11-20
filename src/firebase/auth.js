import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";

// Function to register a new user
const registerUser = async (name, email, password) => {
  const auth = getAuth();
  try {
    // Register the user with Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Display name
    await updateProfile(userCredential.user, { displayName: name });

    // Prepare data for firestore
    const userDoc = {
      uid: userCredential.user.uid,
      name: name,
      email: email,
      registrationDate: new Date().toISOString(),
    };

    // Add the user data to "users"
    await addDoc(collection(db, "users"), userDoc);
    console.log("User successfully registered!");
  } catch (error) {
    // Log errors
    console.error("Error registering user:", error);
  }
};

export default registerUser;