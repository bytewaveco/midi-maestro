import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const config = useRuntimeConfig()
initializeApp(config.firebase)
export const storage = getStorage()