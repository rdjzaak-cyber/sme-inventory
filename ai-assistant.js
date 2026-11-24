import { aiModel } from "./firebase.js";

// =====================================
// SME INVENTORY - AI ASSISTANT
// Real Gemini AI Integration
// =====================================

const style = document.createElement("style");

style.textContent = `
    #aiButton {
        position: fixed;
        bottom: 25px;
        right: 25px;
        width: 62px;
        height: 62px;
        border: none;
        border-radius: 50%;
        background: #1e3a5f;
        color: white;
        font-size: 27px;
        cursor: pointer;
        box-shadow: 0 5px 18px rgba(0,0,0,0.25);
        z-index: 9999;
        animation: robotFloat 3s ease-in-out infinite;
    }

    #aiButton:hover {
        background: #315b89;
        transform: scale(1.05);
    }

    #aiWindow {
        position: fixed;
        bottom: 100px;
        right: 25px;
        width: 360px;
        max-width: calc(100vw - 32px);
        height: 480px;
        max-height: calc(100vh - 125px);
        background: white;
        border-radius: 16px;
        box-shadow: 0 8px 35px rgba(0,0,0,0.2);
        display: none;
        flex-direction: column;
        overflow: hidden;
        z-index: 9999;
        font-family: Arial, sans-serif;
        animation: aiOpen 0.25s ease-out;
    }

    #aiHeader {
        background: #1e3a5f;
        color: white;
        padding: 17px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    #aiHeader h3 {
        margin: 0;
        font-size: 17px;
    }

    #aiHeader small {
        color: #dbeafe;
    }

    #aiClose {
        background: transparent;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
    }

    #aiMessages {
        flex: 1;
        padding: 15px;
        overflow-y: auto;
        background: #f1f5f9;
    }

    .aiMessage {
        padding: 11px 13px;
        border-radius: 12px;
        margin-bottom: 12px;
        max-width: 85%;
        font-size: 14px;
        line-height: 1.5;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
    }

    .aiBotMessage {
        background: white;
        color: #243447;
        border: 1px solid #e2e8f0;
    }

    .aiUserMessage {
        background: #1e3a5f;
        color: white;
        margin-left: auto;
    }

    .aiTyping {
        color: #64748b;
        font-style: italic;
    }

    #aiForm {
        display: flex;
        padding: 12px;
        gap: 8px;
        border-top: 1px solid #e2e8f0;
        background: white;
        align-items: center;
    }

    #aiInput {
        flex: 1;
        min-width: 0;
        min-height: 40px;
        max-height: 100px;
        padding: 11px;
        border: 1px solid #cbd5e1;
        border-radius: 16px;
        outline: none;
        font-size: 13px;
        font-family: Arial, sans-serif;
        resize: vertical;
    }

    #aiInput:focus {
        border-color: #315b89;
    }

    #aiSend {
        background: #1e3a5f;
        color: white;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        font-size: 17px;
        flex-shrink: 0;
    }

    #aiSend:hover {
        background: #315b89;
    }

    #aiSend:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    @keyframes robotFloat {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-7px); }
    }

    @keyframes aiOpen {
        from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }
        to {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }

    @media (max-width: 480px) {
        #aiWindow {
            right: 12px;
            bottom: 85px;
            width: calc(100vw - 24px);
            height: 470px;
        }

        #aiButton {
            right: 18px;
            bottom: 18px;
        }
    }
`;

document.head.appendChild(style);


// =====================================
// CREATE FLOATING BUTTON
// =====================================

const aiButton = document.createElement("button");

aiButton.id = "aiButton";
aiButton.innerHTML = "🤖";
aiButton.title = "Open AI Assistant";

document.body.appendChild(aiButton);


// =====================================
// CREATE CHAT WINDOW
// =====================================

const aiWindow = document.createElement("div");

aiWindow.id = "aiWindow";

aiWindow.innerHTML = `
    <div id="aiHeader">
        <div>
            <h3>🤖 AI Assistant</h3>
            <small>Your intelligent assistant</small>
        </div>

        <button id="aiClose" type="button">&times;</button>
    </div>

    <div id="aiMessages"></div>

    <form id="aiForm">
        <textarea
            id="aiInput"
            placeholder="Ask me anything..."
            rows="1"
        ></textarea>

        <button id="aiSend" type="submit"
            aria-label="Send message">
            ➤
        </button>
    </form>
`;

document.body.appendChild(aiWindow);


// =====================================
// ELEMENTS AND CHAT SESSION
// =====================================

const aiMessages = document.getElementById("aiMessages");
const aiInput = document.getElementById("aiInput");
const aiForm = document.getElementById("aiForm");
const aiSend = document.getElementById("aiSend");

let chatSession = null;
let isSending = false;
let requestVersion = 0;


// =====================================
// DISPLAY MESSAGES
// =====================================

function addMessage(message, type) {

    const messageElement = document.createElement("div");

    messageElement.className =
        "aiMessage " +
        (type === "user" ? "aiUserMessage" : "aiBotMessage");

    messageElement.textContent = message;

    aiMessages.appendChild(messageElement);

    aiMessages.scrollTop = aiMessages.scrollHeight;

    return messageElement;
}


// =====================================
// OPEN CHAT
// =====================================

function openAIChat() {

    aiWindow.style.display = "flex";

    if (aiMessages.children.length === 0) {

        addMessage(
            "Hello! I am your AI Assistant. How can I assist you today?",
            "bot"
        );

    }

    aiInput.focus();
}


// =====================================
// CLOSE CHAT
// =====================================

function closeAIChat() {

    aiWindow.style.display = "none";

    aiMessages.innerHTML = "";

    aiInput.value = "";

    chatSession = null;

    requestVersion++;

    isSending = false;

    aiSend.disabled = false;
}


// =====================================
// BUTTON EVENTS
// =====================================

aiButton.addEventListener("click", openAIChat);

document.getElementById("aiClose")
    .addEventListener("click", closeAIChat);


// =====================================
// CLOSE WHEN CLICKING OUTSIDE
// =====================================

document.addEventListener("click", function(event) {

    const clickedInsideChat = aiWindow.contains(event.target);

    const clickedAIButton = aiButton.contains(event.target);

    const chatIsOpen = aiWindow.style.display === "flex";

    if (
        chatIsOpen &&
        !clickedInsideChat &&
        !clickedAIButton
    ) {
        closeAIChat();
    }

});


// =====================================
// SEND MESSAGE TO GEMINI
// =====================================

async function sendMessage(message) {

    if (!message.trim() || isSending) return;

    const userMessage = message.trim();

    addMessage(userMessage, "user");

    aiInput.value = "";

    isSending = true;
    aiSend.disabled = true;

    const currentRequest = ++requestVersion;

    const typingMessage = addMessage(
        "Thinking...",
        "bot"
    );

    typingMessage.classList.add("aiTyping");

    try {

        if (!chatSession) {
            chatSession = aiModel.startChat();
        }

        // Request a streamed response
        const result = await chatSession.sendMessageStream(
            userMessage
        );

        let fullResponse = "";

        // Display response chunks immediately
        for await (const chunk of result.stream) {

            if (currentRequest !== requestVersion) return;

            const chunkText = chunk.text();

            if (chunkText) {

                fullResponse += chunkText;

                typingMessage.classList.remove("aiTyping");

                typingMessage.textContent = fullResponse;

                aiMessages.scrollTop = aiMessages.scrollHeight;
            }
        }

        // Confirm the completed response
        const finalResponse = await result.response;

        if (currentRequest !== requestVersion) return;

        if (!fullResponse.trim()) {

            fullResponse = finalResponse.text();

            typingMessage.textContent =
                fullResponse || "Please try again.";

        }

        typingMessage.classList.remove("aiTyping");

    } catch (error) {

        if (currentRequest !== requestVersion) return;

        console.error("AI Assistant Error:", error);

        typingMessage.classList.remove("aiTyping");

        typingMessage.textContent =
            "Sorry, I couldn't connect. Please try again.";

    } finally {

        if (currentRequest === requestVersion) {

            isSending = false;
            aiSend.disabled = false;
            aiInput.focus();

        }
    }
}


// =====================================
// FORM SUBMISSION
// =====================================

aiForm.addEventListener("submit", function(event) {

    event.preventDefault();

    sendMessage(aiInput.value);

});


// =====================================
// ENTER TO SEND
// SHIFT + ENTER FOR NEW LINE
// =====================================

aiInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter" && !event.shiftKey) {

        event.preventDefault();

        aiForm.requestSubmit();

    }

});