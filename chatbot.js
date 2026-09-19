document.addEventListener("DOMContentLoaded", function () {
    // 1. Inject CSS Dynamically
    const style = document.createElement("style");
    style.innerHTML = `
        #chatbot-container {
            position: fixed;
            bottom: 200px;
            left: 25px;
            z-index: 99999;
            user-select: none;
            display: flex;
            flex-direction: column;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        /* AI badge strictly on top of ANGEL button */
        .ai-badge {
            font-size: 10px;
            font-weight: 800;
            color: #ffd700;
            background: #0d1b2a;
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: -5px;
            z-index: 2;
            border: 1px solid #ffd700;
            box-shadow: 0 0 6px rgba(255, 215, 0, 0.6);
            letter-spacing: 1px;
        }

        .chatbot-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0d1b2a;
            border: 2px solid #ffd700;
            border-radius: 25px;
            padding: 8px 22px;
            box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }

        .chatbot-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(255, 215, 0, 0.7);
        }

        .chatbot-btn .name {
            font-size: 14px;
            font-weight: bold;
            color: #ffd700;
            letter-spacing: 1.5px;
        }

        /* Modern Frosted Glass UI Container */
        .chat-window {
            position: absolute;
            bottom: 65px;
            left: 0;
            width: 340px;
            height: 450px;
            background: rgba(255, 255, 255, 0.75);
            backdrop-filter: blur(20px) saturate(180%);
            -webkit-backdrop-filter: blur(20px) saturate(180%);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            z-index: 99998;
        }

        .chat-window.hidden {
            display: none !important;
        }

        .chat-header {
            background: rgba(255, 255, 255, 0.6);
            padding: 12px 16px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(0, 0, 0, 0.06);
            cursor: move;
        }

        .chat-title {
            font-weight: 700;
            color: #0d1b2a;
            font-size: 15px;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .close-btn {
            background: none;
            border: none;
            font-size: 20px;
            color: #5f6368;
            cursor: pointer;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background 0.2s;
        }

        .close-btn:hover {
            background: rgba(0, 0, 0, 0.08);
        }

        .chat-messages {
            flex: 1;
            padding: 14px;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        /* Message Wrapper */
        .msg-wrapper {
            display: flex;
            flex-direction: column;
            max-width: 88%;
        }

        .msg-wrapper.user {
            align-self: flex-end;
            align-items: flex-end;
        }

        .msg-wrapper.bot {
            align-self: flex-start;
            align-items: flex-start;
        }

        /* Message Bubbles */
        .message-bubble {
            padding: 10px 14px;
            border-radius: 18px;
            font-size: 13.5px;
            line-height: 1.5;
            word-wrap: break-word;
        }

        .msg-wrapper.bot .message-bubble {
            background: #ffffff;
            color: #1f1f1f;
            border-top-left-radius: 4px;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .msg-wrapper.user .message-bubble {
            background: #f0f4f9;
            color: #000000;
            border-top-right-radius: 4px;
            font-weight: 500;
        }

        .message-img {
            max-width: 100%;
            border-radius: 12px;
            margin-top: 6px;
            display: block;
        }

        /* Gemini-style Bottom Action Toolbar */
        .msg-toolbar {
            display: flex;
            align-items: center;
            gap: 6px;
            margin-top: 4px;
            padding: 0 2px;
        }

        .action-icon-btn {
            background: transparent;
            border: none;
            color: #5f6368;
            padding: 4px 6px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 12px;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
            opacity: 0.8;
        }

        .action-icon-btn:hover {
            background: rgba(0, 0, 0, 0.06);
            color: #1a73e8;
            opacity: 1;
        }

        /* Input Bar Area */
        .chat-input-area {
            padding: 10px 12px;
            display: flex;
            gap: 8px;
            align-items: center;
            background: rgba(255, 255, 255, 0.85);
            border-top: 1px solid rgba(0, 0, 0, 0.05);
        }

        .chat-input-area input[type="text"] {
            flex: 1;
            padding: 9px 14px;
            border-radius: 22px;
            border: 1px solid #dadce0;
            background: #ffffff;
            color: #000000 !important;
            font-size: 13.5px;
            outline: none;
            transition: border-color 0.2s;
        }

        .chat-input-area input[type="text"]:focus {
            border-color: #1a73e8;
        }

        .chat-input-area input[type="text"]::placeholder {
            color: #757575;
        }

        .send-btn {
            background: #0d1b2a;
            color: #ffd700;
            border: 1px solid #ffd700;
            padding: 8px 16px;
            border-radius: 20px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            transition: background 0.2s;
        }

        .send-btn:hover {
            background: #1b2a3a;
        }

        .image-btn {
            background: #f1f3f4;
            color: #3c4043;
            border: 1px solid #dadce0;
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 18px;
            font-weight: 500;
            transition: background 0.2s;
        }

        .image-btn:hover {
            background: #e8eaed;
        }

        #file-input {
            display: none;
        }

        .greeting-popup {
            position: absolute;
            bottom: 65px;
            left: 0;
            background: #ffffff;
            color: #0d1b2a;
            padding: 8px 12px;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
            font-size: 12px;
            font-weight: bold;
            white-space: nowrap;
            border-left: 4px solid #ffd700;
        }
    `;
    document.head.appendChild(style);

    // 2. Inject HTML Dynamically
    const chatbotWrapper = document.createElement("div");
    chatbotWrapper.id = "chatbot-container";
    chatbotWrapper.innerHTML = `
        <div class="ai-badge">AI</div>
        <div class="chatbot-btn" id="chatbot-btn">
            <span class="name">ANGEL</span>
        </div>
        <div id="chat-window" class="chat-window hidden">
            <div class="chat-header" id="chat-header">
                <span class="chat-title">✨ Angel AI Assistant</span>
                <button id="close-chat" class="close-btn">&times;</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-area">
                <label for="file-input" class="image-btn" title="Attach Image">+</label>
                <input type="file" id="file-input" accept="image/*" />
                <input type="text" id="chat-input" placeholder="Ask Angel anything..." />
                <button id="send-btn" class="send-btn">Send</button>
            </div>
        </div>
    `;
    document.body.appendChild(chatbotWrapper);

    // 3. UI Elements & Logic
    const chatbotContainer = document.getElementById("chatbot-container");
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatWindow = document.getElementById("chat-window");
    const closeChat = document.getElementById("close-chat");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatMessages = document.getElementById("chat-messages");
    const fileInput = document.getElementById("file-input");
    const chatHeader = document.getElementById("chat-header");

    let isDragging = false;
    let hasDragged = false;

    // Greeting logic
    if (!sessionStorage.getItem("angelGreetingShown")) {
        const greetingBox = document.createElement("div");
        greetingBox.className = "greeting-popup";
        greetingBox.innerText = "👋 Hi! Click here to chat with Angel AI";
        chatbotContainer.appendChild(greetingBox);
        sessionStorage.setItem("angelGreetingShown", "true");

        setTimeout(() => greetingBox.remove(), 5000);
    }

    // Toggle Window
    chatbotBtn.addEventListener("click", function (e) {
        e.stopPropagation();
        if (hasDragged) return;

        chatWindow.classList.toggle("hidden");

        if (!chatWindow.classList.contains("hidden") && chatMessages.children.length === 0) {
            addMessage("Hello! I am Angel AI. How can I help you today?", "bot");
        }
    });

    closeChat.addEventListener("click", function (e) {
        e.stopPropagation();
        chatWindow.classList.add("hidden");
    });

    // Send Message Function
    function sendMessage() {
        const text = chatInput.value.trim();
        const file = fileInput.files[0];

        if (!text && !file) return;

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                addMessage(text, "user", e.target.result);
                setTimeout(() => {
                    addMessage("Received your image! How would you like me to process or analyze it?", "bot");
                }, 600);
            };
            reader.readAsDataURL(file);
            fileInput.value = "";
        } else {
            addMessage(text, "user");
            setTimeout(() => {
                addMessage("Angel AI Response: " + text, "bot");
            }, 600);
        }

        chatInput.value = "";
    }

    sendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
    });

    // Add Message with Gemini-like Layout & Options
    function addMessage(text, sender, imgSrc = null) {
        const wrapper = document.createElement("div");
        wrapper.className = `msg-wrapper ${sender}`;

        const bubble = document.createElement("div");
        bubble.className = "message-bubble";

        const contentSpan = document.createElement("span");
        if (text) {
            contentSpan.innerText = text;
            bubble.appendChild(contentSpan);
        }

        if (imgSrc) {
            const img = document.createElement("img");
            img.src = imgSrc;
            img.className = "message-img";
            bubble.appendChild(img);
        }

        wrapper.appendChild(bubble);

        // Bottom Action Bar (Gemini / LLM Style)
        const toolbar = document.createElement("div");
        toolbar.className = "msg-toolbar";

        // Copy Option (For Both User & Bot)
        const copyBtn = document.createElement("button");
        copyBtn.className = "action-icon-btn";
        copyBtn.innerHTML = `<span>📋</span> <span>Copy</span>`;
        copyBtn.onclick = function () {
            if (text) {
                navigator.clipboard.writeText(text);
                copyBtn.innerHTML = `<span>✅</span> <span>Copied</span>`;
                setTimeout(() => {
                    copyBtn.innerHTML = `<span>📋</span> <span>Copy</span>`;
                }, 1500);
            }
        };
        toolbar.appendChild(copyBtn);

        // User Option: Edit
        if (sender === "user") {
            const editBtn = document.createElement("button");
            editBtn.className = "action-icon-btn";
            editBtn.innerHTML = `<span>✏️</span> <span>Edit</span>`;
            editBtn.onclick = function () {
                if (text) {
                    chatInput.value = text;
                    chatInput.focus();
                }
            };
            toolbar.appendChild(editBtn);
        }

        // Bot Option: Refresh / Regenerate
        if (sender === "bot" && text !== "Hello! I am Angel AI. How can I help you today?") {
            const refreshBtn = document.createElement("button");
            refreshBtn.className = "action-icon-btn";
            refreshBtn.innerHTML = `<span>🔄</span> <span>Regenerate</span>`;
            refreshBtn.onclick = function () {
                contentSpan.innerText = "Regenerating response...";
                setTimeout(() => {
                    contentSpan.innerText = "Angel AI Response: (New updated response for: " + text + ")";
                }, 800);
            };
            toolbar.appendChild(refreshBtn);
        }

        wrapper.appendChild(toolbar);
        chatMessages.appendChild(wrapper);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 4. Floating Chatbot Button Dragging
    let offsetX, offsetY;
    chatbotBtn.addEventListener("mousedown", function (e) {
        hasDragged = false;
        isDragging = true;
        offsetX = e.clientX - chatbotContainer.getBoundingClientRect().left;
        offsetY = e.clientY - chatbotContainer.getBoundingClientRect().top;

        function onMouseMove(e) {
            if (!isDragging) return;
            hasDragged = true;

            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;

            chatbotContainer.style.left = `${Math.max(0, x)}px`;
            chatbotContainer.style.top = `${Math.max(0, y)}px`;
            chatbotContainer.style.bottom = "auto";
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });

    // 5. Chat Window Header Dragging
    let winOffsetX, winOffsetY, isWinDragging = false;
    chatHeader.addEventListener("mousedown", function (e) {
        if (e.target === closeChat) return;
        isWinDragging = true;
        winOffsetX = e.clientX - chatbotContainer.getBoundingClientRect().left;
        winOffsetY = e.clientY - chatbotContainer.getBoundingClientRect().top;

        function onWinMouseMove(e) {
            if (!isWinDragging) return;
            let x = e.clientX - winOffsetX;
            let y = e.clientY - winOffsetY;

            chatbotContainer.style.left = `${Math.max(0, x)}px`;
            chatbotContainer.style.top = `${Math.max(0, y)}px`;
            chatbotContainer.style.bottom = "auto";
        }

        function onWinMouseUp() {
            isWinDragging = false;
            document.removeEventListener("mousemove", onWinMouseMove);
            document.removeEventListener("mouseup", onWinMouseUp);
        }

        document.addEventListener("mousemove", onWinMouseMove);
        document.addEventListener("mouseup", onWinMouseUp);
    });
});
