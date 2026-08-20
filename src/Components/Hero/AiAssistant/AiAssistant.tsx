import { useState } from "react";
import AiMascot, { type AiBlobState } from "./AiMascot";
import AiChat from "./AiChat";
import "./AiAssistant.css";

export default function AiAssistant() {
    const [mascotState, setMascotState] =
        useState<AiBlobState>("idle");

    return (
        <div className="ai-assistant">
            <div className="ai-assistant__mascot">
                <AiMascot state={mascotState} />
            </div>

            <AiChat
                assistantState={mascotState}
                onAssistantStateChange={setMascotState}
            />
        </div>
    );
}