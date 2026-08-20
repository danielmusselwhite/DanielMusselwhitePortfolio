import { useState } from "react";
import AiMascot, {
    type AiBlobState,
} from "./AiMascot";
import AiChat from "./AiChat";
import "./AiAssistant.css";

export default function AiAssistant() {
    const [isChatOpen, setIsChatOpen] = useState(true);
    const [mascotState, setMascotState] =
        useState<AiBlobState>("idle");

    function handleCloseChat() {
        setMascotState("idle");
        setIsChatOpen(false);
    }

    return (
        <div className="ai-assistant">
            <div className="ai-assistant__mascot">
                <AiMascot
                    state={mascotState}
                    onOpenChat={() => setIsChatOpen(true)}
                />
            </div>

            <AiChat
                isOpen={isChatOpen}
                assistantState={mascotState}
                onAssistantStateChange={setMascotState}
                onClose={handleCloseChat}
            />
        </div>
    );
}
