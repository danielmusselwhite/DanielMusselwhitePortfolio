import {
    useMemo,
    useRef,
    useState,
    type FormEvent,
} from "react";
import "./AiChat.css";

interface AiChatProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChatMessage {
    id: number;
    role: "user" | "assistant";
    content: string;
}

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content:
            "Hi! Ask me anything about Daniel's experience, projects or tech stack.",
    },
];

function getFakeResponse(input: string) {
    const normalized = input.toLowerCase();

    if (
        normalized.includes("c#") ||
        normalized.includes("csharp") ||
        normalized.includes(".net")
    ) {
        return "C# and .NET are part of Daniel's core stack. Soon I'll answer this using his actual portfolio data.";
    }

    if (
        normalized.includes("azure") ||
        normalized.includes("cloud")
    ) {
        return "Cloud-native systems are a major focus, with Azure forming an important part of the stack.";
    }

    if (
        normalized.includes("project") ||
        normalized.includes("built") ||
        normalized.includes("portfolio")
    ) {
        return "Soon I'll be able to read Daniel's project JSON files and explain what he built, which technologies he used, and why.";
    }

    if (
        normalized.includes("experience") ||
        normalized.includes("years")
    ) {
        return "Once the backend is connected, I'll answer experience questions directly from Daniel's portfolio data rather than guessing.";
    }

    return "That's exactly the kind of question this assistant will answer once we connect the real AI backend.";
}

export default function AiChat({
    isOpen,
    onClose,
}: AiChatProps) {
    const [messages, setMessages] =
        useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");

    const nextIdRef = useRef(2);

    const canSubmit = useMemo(
        () => input.trim().length > 0,
        [input],
    );

    function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const trimmed = input.trim();

        if (!trimmed) {
            return;
        }

        const userMessage: ChatMessage = {
            id: nextIdRef.current++,
            role: "user",
            content: trimmed,
        };

        const assistantMessage: ChatMessage = {
            id: nextIdRef.current++,
            role: "assistant",
            content: getFakeResponse(trimmed),
        };

        setMessages((current) => [
            ...current,
            userMessage,
            assistantMessage,
        ]);

        setInput("");
    }

    if (!isOpen) {
        return null;
    }

    return (
        <section
            className="ai-chat"
            aria-label="Portfolio assistant chat"
        >
            <div className="ai-chat__header">
                <div className="ai-chat__header-title">
                    <span
                        className="ai-chat__status-dot"
                        aria-hidden="true"
                    />
                    <span>developer.assistant</span>
                </div>

                <div className="ai-chat__header-actions">
                    <span className="ai-chat__status-label">
                        local
                    </span>

                    <button
                        type="button"
                        className="ai-chat__close"
                        onClick={onClose}
                        aria-label="Close assistant"
                    >
                        ×
                    </button>
                </div>
            </div>

            <div
                className="ai-chat__messages"
                aria-live="polite"
            >
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={[
                            "ai-chat__message",
                            `ai-chat__message--${message.role}`,
                        ].join(" ")}
                    >
                        <span className="ai-chat__message-prefix">
                            {message.role === "user"
                                ? "you"
                                : "bot"}
                        </span>

                        <p>{message.content}</p>
                    </div>
                ))}
            </div>

            <form
                className="ai-chat__composer"
                onSubmit={handleSubmit}
            >
                <span
                    className="ai-chat__prompt-symbol"
                    aria-hidden="true"
                >
                    $
                </span>

                <input
                    type="text"
                    value={input}
                    onChange={(event) =>
                        setInput(event.target.value)
                    }
                    placeholder="ask about experience..."
                    aria-label="Ask the portfolio assistant"
                    autoComplete="off"
                />

                <button
                    type="submit"
                    disabled={!canSubmit}
                >
                    send
                </button>
            </form>

            <p className="ai-chat__footer">
                <span>$</span> portfolio --ask-anything
            </p>
        </section>
    );
}
