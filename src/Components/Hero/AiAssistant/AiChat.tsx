import {
    useEffect,
    useMemo,
    useRef,
    useState,
    type FormEvent,
} from "react";
import type { AiBlobState } from "./AiMascot";
import { buildPortfolioContext } from "./portfolioContext";
import "./AiChat.css";

interface AiChatProps {
    isOpen: boolean;
    assistantState: AiBlobState;
    onAssistantStateChange: (
        state: AiBlobState,
    ) => void;
    onClose: () => void;
}

interface ChatMessage {
    id: number;
    role: "user" | "assistant";
    content: string;
}

interface ChatApiResponse {
    answer?: string;
    error?: string;
}

const initialMessages: ChatMessage[] = [
    {
        id: 1,
        role: "assistant",
        content:
            "Hi! Ask me anything about Daniel's experience, projects or tech stack.",
    },
];

const stateLabels: Record<AiBlobState, string> = {
    idle: "active",
    listening: "listening",
    thinking: "thinking",
    busy: "busy",
    speaking: "replying",
    error: "error",
    angry: "angry",
};

const debugCommands: Record<string, AiBlobState> = {
    "/idle": "idle",
    "/listening": "listening",
    "/thinking": "thinking",
    "/busy": "busy",
    "/speaking": "speaking",
    "/error": "error",
    "/angry": "angry",
};

export default function AiChat({
    isOpen,
    assistantState,
    onAssistantStateChange,
    onClose,
}: AiChatProps) {
    const [messages, setMessages] =
        useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const nextIdRef = useRef(2);
    const messagesEndRef =
        useRef<HTMLDivElement>(null);
    const speakingTimerRef =
        useRef<number | null>(null);
    const busyTimerRef =
        useRef<number | null>(null);

    const portfolioContext = useMemo(
        () => buildPortfolioContext(),
        [],
    );

    const canSubmit =
        input.trim().length > 0 && !isSubmitting;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, isSubmitting]);

    useEffect(() => {
        return () => {
            if (speakingTimerRef.current !== null) {
                window.clearTimeout(
                    speakingTimerRef.current,
                );
            }

            if (busyTimerRef.current !== null) {
                window.clearTimeout(
                    busyTimerRef.current,
                );
            }
        };
    }, []);

    function handleInputChange(value: string) {
        setInput(value);

        if (isSubmitting) {
            return;
        }

        onAssistantStateChange(
            value.trim().length > 0
                ? "listening"
                : "idle",
        );
    }

    function runDebugCommand(command: string) {
        const state =
            debugCommands[command.toLowerCase()];

        if (!state) {
            return false;
        }

        if (busyTimerRef.current !== null) {
            window.clearTimeout(
                busyTimerRef.current,
            );
            busyTimerRef.current = null;
        }

        if (speakingTimerRef.current !== null) {
            window.clearTimeout(
                speakingTimerRef.current,
            );
            speakingTimerRef.current = null;
        }

        onAssistantStateChange(state);

        setMessages((current) => [
            ...current,
            {
                id: nextIdRef.current++,
                role: "user",
                content: command,
            },
            {
                id: nextIdRef.current++,
                role: "assistant",
                content:
                    `Debug animation forced: ${state}. ` +
                    "No API request was made.",
            },
        ]);

        setInput("");

        /*
         * Keep idle persistent; other showcase states reset automatically.
         */
        if (state !== "idle") {
            speakingTimerRef.current =
                window.setTimeout(() => {
                    onAssistantStateChange("idle");
                    speakingTimerRef.current = null;
                }, state === "angry" ? 2800 : 2200);
        }

        return true;
    }

    async function handleSubmit(
        event: FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();

        const trimmed = input.trim();

        if (!trimmed || isSubmitting) {
            return;
        }

        /*
         * Secret local-only showcase commands.
         * These never call the Netlify/OpenAI endpoint.
         */
        if (runDebugCommand(trimmed)) {
            return;
        }

        const userMessage: ChatMessage = {
            id: nextIdRef.current++,
            role: "user",
            content: trimmed,
        };

        const history = messages
            .slice(-8)
            .map(({ role, content }) => ({
                role,
                content,
            }));

        setMessages((current) => [
            ...current,
            userMessage,
        ]);
        setInput("");
        setIsSubmitting(true);
        onAssistantStateChange("thinking");

        /*
         * If the backend takes a while, transition into a more expressive
         * fluid "busy" animation rather than looping the basic think state.
         */
        if (busyTimerRef.current !== null) {
            window.clearTimeout(
                busyTimerRef.current,
            );
        }

        busyTimerRef.current =
            window.setTimeout(() => {
                onAssistantStateChange("busy");
                busyTimerRef.current = null;
            }, 2200);

        try {
            const response = await fetch(
                "/api/portfolio-chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        message: trimmed,
                        history,
                        portfolioContext,
                    }),
                },
            );

            const data =
                (await response.json()) as ChatApiResponse;

            if (!response.ok || !data.answer) {
                throw new Error(
                    data.error ||
                    "The assistant could not reply.",
                );
            }

            if (busyTimerRef.current !== null) {
                window.clearTimeout(
                    busyTimerRef.current,
                );
                busyTimerRef.current = null;
            }

            setMessages((current) => [
                ...current,
                {
                    id: nextIdRef.current++,
                    role: "assistant",
                    content: data.answer!,
                },
            ]);

            onAssistantStateChange("speaking");

            if (speakingTimerRef.current !== null) {
                window.clearTimeout(
                    speakingTimerRef.current,
                );
            }

            speakingTimerRef.current =
                window.setTimeout(() => {
                    onAssistantStateChange("idle");
                    speakingTimerRef.current = null;
                }, 1100);
        } catch (error) {
            if (busyTimerRef.current !== null) {
                window.clearTimeout(
                    busyTimerRef.current,
                );
                busyTimerRef.current = null;
            }

            const message =
                error instanceof Error
                    ? error.message
                    : "Something went wrong.";

            setMessages((current) => [
                ...current,
                {
                    id: nextIdRef.current++,
                    role: "assistant",
                    content:
                        "I couldn't reach the assistant backend. " +
                        message,
                },
            ]);

            onAssistantStateChange("error");

            speakingTimerRef.current =
                window.setTimeout(() => {
                    onAssistantStateChange("idle");
                    speakingTimerRef.current = null;
                }, 1600);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <section
            className={[
                "ai-chat",
                `ai-chat--${assistantState}`,
            ].join(" ")}
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
                        {stateLabels[assistantState]}
                    </span>
                </div>
            </div>

            <div
                className="ai-chat__messages"
                aria-live="polite"
                aria-busy={isSubmitting}
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

                {isSubmitting && (
                    <div className="ai-chat__message ai-chat__message--assistant ai-chat__message--thinking">
                        <span className="ai-chat__message-prefix">
                            bot
                        </span>

                        <p>
                            <span className="ai-chat__thinking-dots">
                                <span />
                                <span />
                                <span />
                            </span>
                        </p>
                    </div>
                )}

                <div ref={messagesEndRef} />
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
                        handleInputChange(
                            event.target.value,
                        )
                    }
                    placeholder={
                        isSubmitting
                            ? "thinking..."
                            : "ask about experience..."
                    }
                    aria-label="Ask the portfolio assistant"
                    autoComplete="off"
                    maxLength={500}
                    disabled={isSubmitting}
                />

                <button
                    type="submit"
                    disabled={!canSubmit}
                >
                    {isSubmitting ? "..." : "send"}
                </button>
            </form>

            <p className="ai-chat__footer">
                <span>$</span> portfolio --ask-anything
            </p>
        </section>
    );
}