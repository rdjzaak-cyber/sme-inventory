import { initializeApp } from "https://www.gstatic.com/firebasejs/13.2.0/firebase-app.js";

import {
    getAuth,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-firestore.js";

import {
    getAI,
    getGenerativeModel,
    GoogleAIBackend
} from "https://www.gstatic.com/firebasejs/13.2.0/firebase-ai.js";

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAxAHl_-IaT65OKxU_npZmtY__TkaQqXbY",
    authDomain: "sme-inventory-management-a9acd.firebaseapp.com",
    projectId: "sme-inventory-management-a9acd",
    storageBucket: "sme-inventory-management-a9acd.firebasestorage.app",
    messagingSenderId: "946308197360",
    appId: "1:946308197360:web:cc6e4f3688b65c49608b35",
    measurementId: "G-EM147HQ61W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Authentication
const auth = getAuth(app);

await setPersistence(auth, browserLocalPersistence);

// Firestore Database
const db = getFirestore(app);

// Google Sign-In
const googleProvider = new GoogleAuthProvider();

// Firebase AI
const ai = getAI(app, {
    backend: new GoogleAIBackend()
});

const aiModel = getGenerativeModel(ai, {
    model: "gemini-3.5-flash-lite",

    systemInstruction: `
        You are the AI Assistant for an SME Inventory Management System.

        LANGUAGE RULES:
        - Always respond in English by default.
        - Do not randomly switch languages.
        - Only use another language when explicitly requested.

        RESPONSE STYLE:
        - Be friendly, professional and helpful.
        - Use clear, simple English.
        - Answer questions directly.
        - Avoid unnecessary explanations.
        - Keep answers concise unless more detail is requested.
    `,

    generationConfig: {
        maxOutputTokens: 512
    }
});

// Export Firebase Services
export {
    app,
    auth,
    db,
    googleProvider,
    ai,
    aiModel
};