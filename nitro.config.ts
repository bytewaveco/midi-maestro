//https://nitro.unjs.io/config
export default defineNitroConfig({
    runtimeConfig: {
        firebase: {
            apiKey: process.env.FIREBASE_API_KEY,
            authDomain: "bytewave-midi-maestro.firebaseapp.com",
            projectId: "bytewave-midi-maestro",
            storageBucket: "bytewave-midi-maestro.appspot.com",
            messagingSenderId: "374238969873",
            appId: "1:374238969873:web:3557b1e8f1e0524392f1b0"
        }
    },
    experimental: {
        openAPI: true
    }
});
