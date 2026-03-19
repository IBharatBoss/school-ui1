/**
 * ============================================================================
 * CORE.JS - UI CONTROLLER & EVENT MANAGER (PHASE 2)
 * ============================================================================
 */

class UIController {
    constructor() {
        this.manifest = AppManifest;
        this.typewriterInterval = null;
        this.initDOM();
        this.bindEvents();
        this.startTypewriter();
    }

    // 1. Initialize DOM Elements
    initDOM() {
        this.elements = {
            offlineBanner: document.getElementById("offline-banner"),
            toastContainer: document.getElementById("toast-container"),
            heroSection: document.getElementById("hero-section"),
            messagesContainer: document.getElementById("messages-container"),
            loadingIndicator: document.getElementById("loading-indicator"),
            ragStatusIndicator: document.getElementById("rag-status-indicator"),
            chatCanvas: document.getElementById("chat-canvas"),
            searchBarTrigger: document.getElementById("search-bar-trigger"),
            inputPopupBackdrop: document.getElementById("input-popup-backdrop"),
            mainTextarea: document.getElementById("main-textarea"),
            charCounter: document.getElementById("char-counter"),
            sendBtn: document.getElementById("send-btn"),
            attachBtn: document.getElementById("popup-attach-btn"),
            fileInput: document.getElementById("image-upload-input"),
            previewContainer: document.getElementById("image-preview-container"),
            previewImg: document.getElementById("image-preview"),
            removeImgBtn: document.getElementById("remove-image-btn"),
            sidebar: document.getElementById("sidebar"),
            sidebarBackdrop: document.getElementById("sidebar-backdrop"),
            homeLogo: document.getElementById("home-logo"),
            themeToggle: document.getElementById("theme-toggle"),
            historyToggle: document.getElementById("history-toggle"),
            closeSidebar: document.getElementById("close-sidebar"),
            closePopupBtn: document.getElementById("close-popup-btn"),
            ragKbToggle: document.getElementById("rag-kb-toggle"),
            ragKbLabel: document.getElementById("rag-kb-label"),
            aiChips: document.querySelectorAll(".ai-chip")
        };
    }

    // 2. Bind All Event Listeners
    bindEvents() {
        // Theme Toggle
        this.elements.themeToggle.addEventListener("click", () => {
            this.hapticFeedback();
            document.body.classList.toggle("dark-mode");
            this.manifest.state.currentTheme = document.body.classList.contains("dark-mode") ? "dark-mode" : "light-mode";
        });

        // Sidebar Navigation
        this.elements.historyToggle.addEventListener("click", () => { this.hapticFeedback(); this.toggleSidebar(true); });
        this.elements.closeSidebar.addEventListener("click", () => { this.hapticFeedback(); this.toggleSidebar(false); });
        this.elements.sidebarBackdrop.addEventListener("click", () => this.toggleSidebar(false));

        // Home Navigation
        this.elements.homeLogo.addEventListener("click", () => { this.hapticFeedback(); this.resetToHome(); });

        // Input Popup Logic
        this.elements.searchBarTrigger.addEventListener("click", () => { this.hapticFeedback(); this.toggleInputPopup(true); });
        this.elements.closePopupBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hapticFeedback();
            this.toggleInputPopup(false);
        });
        this.elements.inputPopupBackdrop.addEventListener("click", (e) => {
            if (e.target === this.elements.inputPopupBackdrop) this.toggleInputPopup(false);
        });

        // RAG Toggle Logic
        this.elements.ragKbToggle.addEventListener("click", (e) => {
            e.stopPropagation();
            this.hapticFeedback();
            this.manifest.systemConfig.ragSystem.isKbActive = !this.manifest.systemConfig.ragSystem.isKbActive;
            
            if (this.manifest.systemConfig.ragSystem.isKbActive) {
                this.elements.ragKbToggle.classList.add("active-search");
                this.elements.ragKbLabel.innerText = "Knowledge Base: Active";
                this.showToast("School Knowledge Base Connected", "database");
            } else {
                this.elements.ragKbToggle.classList.remove("active-search");
                this.elements.ragKbLabel.innerText = "Knowledge Base: Off";
                this.showToast("General AI Mode Active", "globe");
            }
        });

        // Textarea Logic
        this.elements.mainTextarea.addEventListener("input", () => this.updateCharCount());

        // File Attachment Logic
        this.elements.attachBtn.addEventListener("click", () => { this.hapticFeedback(); this.elements.fileInput.click(); });
        this.elements.fileInput.addEventListener("change", (e) => this.handleFileUpload(e));
        this.elements.removeImgBtn.addEventListener("click", () => { this.hapticFeedback(); this.removeFile(); });

        // Submit Logic
        this.elements.sendBtn.addEventListener("click", () => { this.hapticFeedback(true); this.handleMessageSubmit(); });
        this.elements.mainTextarea.addEventListener("keydown", (e) => {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                this.elements.sendBtn.click();
            }
        });

        // AI Chips Logic
        this.elements.aiChips.forEach(chip => {
            chip.addEventListener("click", (e) => {
                this.hapticFeedback();
                const chipText = e.currentTarget.innerText.trim();
                this.processShowcaseMessage(chipText, true);
            });
        });

        // Network Status
        window.addEventListener("offline", () => this.elements.offlineBanner.classList.remove("hidden"));
        window.addEventListener("online", () => {
            this.elements.offlineBanner.classList.add("hidden");
            this.showToast(this.manifest.uiText.offlineMsg, "wifi");
        });
    }

    // 3. UI Utility Functions
    hapticFeedback(heavy = false) {
        if (navigator.vibrate) {
            navigator.vibrate(heavy ? [30, 50, 30] : 15);
        }
    }

    showToast(message, icon = "info") {
        const toast = document.createElement("div");
        toast.className = "premium-toast";
        toast.innerHTML = `<i data-lucide="${icon}" size="18"></i> <span>${message}</span>`;
        this.elements.toastContainer.appendChild(toast);
        lucide.createIcons();
        
        setTimeout(() => {
            toast.classList.add("toast-fade-out");
            setTimeout(() => toast.remove(), 400);
        }, 3000);
    }

    startTypewriter() {
        const text = this.manifest.uiText.typewriter;
        let i = 0;
        const twText = document.getElementById("typewriter-text");
        if (this.typewriterInterval) clearInterval(this.typewriterInterval);
        
        this.typewriterInterval = setInterval(() => {
            if (twText && text) {
                twText.innerText = text.substring(0, i + 1);
                i = (i + 1) % text.length;
            }
        }, 150);
    }

    toggleSidebar(show) {
        if (show) {
            this.elements.sidebar.classList.remove("hidden");
            this.elements.sidebarBackdrop.classList.remove("hidden");
            setTimeout(() => this.elements.sidebar.classList.add("active"), 10);
        } else {
            this.elements.sidebar.classList.remove("active");
            setTimeout(() => {
                this.elements.sidebar.classList.add("hidden");
                this.elements.sidebarBackdrop.classList.add("hidden");
            }, 400);
        }
    }

    toggleInputPopup(show) {
        if (show) {
            this.elements.inputPopupBackdrop.classList.remove("hidden");
            setTimeout(() => this.elements.mainTextarea.focus(), 300);
        } else {
            this.elements.inputPopupBackdrop.classList.add("hidden");
        }
    }

    resetToHome() {
        this.elements.messagesContainer.classList.add("hidden");
        this.elements.messagesContainer.innerHTML = "";
        this.elements.heroSection.classList.remove("hidden");
        this.manifest.state.chatMemory = [];
        this.elements.ragStatusIndicator.classList.add("hidden");
        this.elements.loadingIndicator.classList.add("hidden");
    }

    updateCharCount() {
        const len = this.elements.mainTextarea.value.length;
        this.elements.charCounter.innerText = `${len}/${this.manifest.uiText.charLimit}`;
        this.elements.charCounter.classList.toggle("limit-reached", len >= this.manifest.uiText.charLimit);
    }

    handleFileUpload(e) {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) return this.showToast("File is too large! (Max 5MB)", "alert-circle");
            
            const reader = new FileReader();
            reader.onload = (re) => {
                this.manifest.state.uploadedImage.base64 = re.target.result;
                this.manifest.state.uploadedImage.mimeType = file.type;
                
                // Show preview based on file type
                if(file.type.startsWith('image/')) {
                    this.elements.previewImg.src = re.target.result;
                } else {
                    // Placeholder for documents
                    this.elements.previewImg.src = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='currentColor' viewBox='0 0 16 16'><path d='M14 4.5V14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5zm-3 0A1.5 1.5 0 0 1 9.5 3V1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V4.5h-2z'/></svg>";
                }
                
                this.elements.previewContainer.classList.remove("hidden");
                this.elements.attachBtn.classList.add("active-attachment");
                this.showToast("Document attached", "paperclip");
            };
            reader.readAsDataURL(file);
        }
    }

    removeFile() {
        this.manifest.state.uploadedImage = { base64: null, mimeType: null };
        this.elements.fileInput.value = "";
        this.elements.previewContainer.classList.add("hidden");
        this.elements.attachBtn.classList.remove("active-attachment");
    }

    // 4. Core Logic: RAG Search & Streaming Response
    handleMessageSubmit() {
        const text = this.elements.mainTextarea.value.trim();
        const hasFile = this.manifest.state.uploadedImage.base64 !== null;
        
        if (text || hasFile) {
            this.processShowcaseMessage(text || "Analyze this document.", false);
            this.elements.mainTextarea.value = "";
            this.updateCharCount();
            this.removeFile();
            this.toggleInputPopup(false);
        }
    }

    processShowcaseMessage(userText, isFromChip) {
        if (this.manifest.state.isGenerating) return;
        this.manifest.state.isGenerating = true;

        // UI Transitions
        this.elements.heroSection.classList.add("hidden");
        this.elements.messagesContainer.classList.remove("hidden");

        // Render User Message
        const userDiv = document.createElement("div");
        userDiv.className = "user-msg-block";
        const imgState = this.manifest.state.uploadedImage.base64;
        const imageHtml = imgState && this.manifest.state.uploadedImage.mimeType.startsWith('image/') 
            ? `<img src="${imgState}" style="max-width:200px; border-radius:12px; margin-bottom:10px; display:block;">` : "";
        
        userDiv.innerHTML = `${imageHtml}<div class="user-text">${userText}</div>`;
        this.elements.messagesContainer.appendChild(userDiv);
        this.elements.chatCanvas.scrollTop = this.elements.chatCanvas.scrollHeight;

        // Determine Response Data
        let kbResponse = null;
        if (isFromChip && this.manifest.knowledgeBase[userText]) {
            kbResponse = this.manifest.knowledgeBase[userText];
        } else {
            kbResponse = {
                text: "Based on the school's general guidelines, your query regarding **'" + userText.substring(0, 30) + "...'** has been logged. For immediate exact answers, please try clicking one of the predefined topics.",
                citation: "General AI Logic"
            };
        }

        // RAG Simulation (If KB is active)
        if (this.manifest.systemConfig.ragSystem.isKbActive) {
            this.elements.ragStatusIndicator.classList.remove("hidden");
            this.elements.chatCanvas.scrollTop = this.elements.chatCanvas.scrollHeight;
            
            setTimeout(() => {
                this.elements.ragStatusIndicator.classList.add("hidden");
                this.startStreamingResponse(kbResponse);
            }, this.manifest.systemConfig.ragSystem.searchDelayMs);
        } else {
            this.elements.loadingIndicator.classList.remove("hidden");
            setTimeout(() => {
                this.elements.loadingIndicator.classList.add("hidden");
                this.startStreamingResponse(kbResponse);
            }, 800);
        }
    }

    // 5. Streaming Markdown Effect Engine
    startStreamingResponse(kbData) {
        const aiDiv = document.createElement("div");
        aiDiv.className = "ai-msg-block";
        
        const aiTextContainer = document.createElement("div");
        aiTextContainer.className = "ai-text streaming-cursor";
        aiDiv.appendChild(aiTextContainer);
        this.elements.messagesContainer.appendChild(aiDiv);
        
        const fullText = kbData.text;
        let currentIndex = 0;
        let currentRenderedText = "";
        
        // Simulating network stream chunks
        const streamInterval = setInterval(() => {
            // Add 1 to 5 characters at a time to simulate real streaming
            const chunkSize = Math.floor(Math.random() * 5) + 1; 
            currentRenderedText += fullText.substring(currentIndex, currentIndex + chunkSize);
            currentIndex += chunkSize;

            // Use marked.js to parse markdown dynamically
            aiTextContainer.innerHTML = marked.parse(currentRenderedText);
            this.elements.chatCanvas.scrollTop = this.elements.chatCanvas.scrollHeight;

            if (currentIndex >= fullText.length) {
                clearInterval(streamInterval);
                this.finalizeResponse(aiDiv, aiTextContainer, kbData.citation);
            }
        }, 15); // Fast typing speed
    }

    finalizeResponse(aiDiv, aiTextContainer, citationLabel) {
        aiTextContainer.classList.remove("streaming-cursor");
        
        // Add Citation Badge if RAG is active
        if (this.manifest.systemConfig.ragSystem.isKbActive && citationLabel) {
            const citationHtml = `<span class="rag-citation" title="Source Document"><i data-lucide="file-text" size="10"></i> ${citationLabel}</span>`;
            // Append citation nicely at the end of the last paragraph
            const lastP = aiTextContainer.querySelector('p:last-of-type');
            if(lastP) lastP.innerHTML += " " + citationHtml;
            else aiTextContainer.innerHTML += citationHtml;
        }

        // Add Action Bar
        const actionBar = document.createElement("div");
        actionBar.className = "action-bar";
        actionBar.innerHTML = `
            <button title="Copy"><i data-lucide="copy"></i> Copy</button>
            <button title="Share"><i data-lucide="share-2"></i> Share</button>
        `;
        aiDiv.appendChild(actionBar);
        
        lucide.createIcons();
        this.elements.chatCanvas.scrollTop = this.elements.chatCanvas.scrollHeight;
        this.manifest.state.isGenerating = false;
        this.hapticFeedback(); // Gentle buzz when generation is complete
    }
}

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", () => {
    window.AppUIController = new UIController();
});


// ==========================================
// PWA CUSTOM INSTALL LOGIC
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('install-app-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent browser's default mini-infobar
    e.preventDefault();
    deferredPrompt = e;
    
    // Show the header install button
    if(installBtn) installBtn.classList.remove('hidden');

    // Create and show 10-second Custom Popup Toast
    const installToast = document.createElement("div");
    installToast.className = "premium-toast";
    installToast.style.cursor = "pointer";
    installToast.innerHTML = `<i data-lucide="download-cloud" size="18" style="color: var(--accent-color);"></i> <span>Install School AI App for better experience!</span>`;
    document.getElementById("toast-container").appendChild(installToast);
    lucide.createIcons();

    // Remove popup after 10 seconds automatically
    let toastTimer = setTimeout(() => {
        installToast.classList.add("toast-fade-out");
        setTimeout(() => installToast.remove(), 400);
    }, 10000);

    // If user clicks the 10-second popup
    installToast.addEventListener('click', async () => {
        clearTimeout(toastTimer);
        installToast.remove();
        triggerInstall();
    });
});

// If user clicks the persistent header button
if(installBtn) {
    installBtn.addEventListener('click', triggerInstall);
}

async function triggerInstall() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
            if(installBtn) installBtn.classList.add('hidden');
        }
        deferredPrompt = null;
    }
}

// Hide button if already installed
window.addEventListener('appinstalled', () => {
    if(installBtn) installBtn.classList.add('hidden');
});
