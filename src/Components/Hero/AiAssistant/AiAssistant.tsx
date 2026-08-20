import { useState } from "react";
import AiMascot from "./AiMascot";
import AiChat from "./AiChat";
import "./AiAssistant.css";

export default function AiAssistant() {
    const [isChatOpen, setIsChatOpen] = useState(true);

    return (
        <div className="ai-assistant">
            <div className="ai-assistant__mascot">
                <AiMascot
                    state="idle"
                    onOpenChat={() => setIsChatOpen(true)}
                />

            </div>

            <AiChat
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
            />
        </div>
    );
}