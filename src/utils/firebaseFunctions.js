import {
    collection,
    doc,
    getDocs,
    orderBy,
    query,
    setDoc,
  } from "firebase/firestore";
  import { firestore } from "../firebase.config";
  
  // Saving new Item
  export const saveItem = async (data) => {
    await setDoc(doc(firestore, "Plants", `${Date.now()}`), data, {
      merge: true,
    });
  };
  
  // getall food items
  export const getAllPlants = async () => {
    const items = await getDocs(
      query(collection(firestore, "Plants"), orderBy("id", "desc"))
    );
  
    return items.docs.map((doc) => doc.data());
  };
  