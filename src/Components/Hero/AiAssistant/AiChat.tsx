import {
    useEffect,
    useRef,
    useState,
    type FormEvent,
    type KeyboardEvent,
} from "react";
import type { AiBlobState } from "./AiMascot";
import "./AiChat.css";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface AiChatProps {
    assistantState: AiBlobState;
    onAssistantStateChange: (
        state: AiBlobState,
    ) => void;
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
            "Hey, I'm Bloop 👋 Ask me anything about Daniel's experience, projects or tech stack. If you don't have a question, try typing /party 👀",
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
    party: "party",
};

interface AssistantCommand {
    state: AiBlobState;
    reply: string;
    description: string;
}

const debugCommands: Record<
    string,
    AssistantCommand
> = {
    "/party": {
        state: "party",
        reply: "Okay... PARTY MODE!",
        description: "Maximum rainbow wiggle",
    },
    "/idle": {
        state: "idle",
        reply: "Okay, I'll idle.",
        description: "Let me relax",
    },
    "/listening": {
        state: "listening",
        reply: "I'm listening...",
        description: "Get my attention",
    },
    "/thinking": {
        state: "thinking",
        reply: "That's a lot to think about...",
        description: "Give me something to ponder",
    },
    "/busy": {
        state: "busy",
        reply: "Alright, give me a second!",
        description: "Keep me busy",
    },
    "/speaking": {
        state: "speaking",
        reply: "I've got something to say!",
        description: "Let me talk",
    },
    "/error": {
        state: "error",
        reply: "Uh oh... what did you do?",
        description: "Something went wrong",
    },
    "/angry": {
        state: "angry",
        reply: "You've made me angry.",
        description: "Don't say I didn't warn you",
    },

};

const commandEntries =
    Object.entries(debugCommands) as Array<
        [string, AssistantCommand]
    >;


export default function AiChat({
    assistantState,
    onAssistantStateChange,
}: AiChatProps) {
    const [messages, setMessages] =
        useState<ChatMessage[]>(initialMessages);
    const [input, setInput] = useState("");
    const [isSubmitting, setIsSubmitting] =
        useState(false);
    const [selectedCommandIndex, setSelectedCommandIndex] =
        useState(0);

    const nextIdRef = useRef(2);
    const messagesEndRef =
        useRef<HTMLDivElement>(null);
    const speakingTimerRef =
        useRef<number | null>(null);
    const busyTimerRef =
        useRef<number | null>(null);
    const partyTimerRefs =
        useRef<number[]>([]);

    const canSubmit =
        input.trim().length > 0 && !isSubmitting;

    const normalizedInput =
        input.trim().toLowerCase();

    const matchingCommands =
        normalizedInput.startsWith("/")
            ? commandEntries.filter(([command]) =>
                command.startsWith(
                    normalizedInput,
                ),
            )
            : [];

    const showCommandMenu =
        !isSubmitting &&
        input.startsWith("/") &&
        matchingCommands.length > 0;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
        });
    }, [messages, isSubmitting]);

    useEffect(() => {
        setSelectedCommandIndex(0);
    }, [input]);

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

            partyTimerRefs.current.forEach((timer) => {
                window.clearTimeout(timer);
            });
            partyTimerRefs.current = [];
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

    function clearShowcaseTimers() {
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

        partyTimerRefs.current.forEach((timer) => {
            window.clearTimeout(timer);
        });
        partyTimerRefs.current = [];
    }

    function addCommandMessages(
        command: string,
        reply: string,
    ) {
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
                content: reply,
            },
        ]);
    }

    function runPartyCommand() {
        clearShowcaseTimers();

        addCommandMessages(
            "/party",
            "Okay... PARTY MODE!",
        );

        setInput("");
        onAssistantStateChange("party");

        speakingTimerRef.current =
            window.setTimeout(() => {
                onAssistantStateChange("idle");
                speakingTimerRef.current = null;
            }, 30000);
    }

    function runDebugCommand(command: string) {
        const normalized =
            command.toLowerCase();

        /*
         * Party owns its own 30-second timer.
         * Do not let the generic showcase reset overwrite it.
         */
        if (normalized === "/party") {
            runPartyCommand();
            return true;
        }

        const config =
            debugCommands[normalized];

        if (!config) {
            return false;
        }

        clearShowcaseTimers();

        onAssistantStateChange(config.state);

        addCommandMessages(
            normalized,
            config.reply,
        );

        setInput("");

        /*
         * Normal showcase states are intentionally brief.
         */
        if (config.state !== "idle") {
            speakingTimerRef.current =
                window.setTimeout(() => {
                    onAssistantStateChange("idle");
                    speakingTimerRef.current = null;
                }, config.state === "angry" ? 2800 : 2200);
        }

        return true;
    }

    function selectCommand(command: string) {
        setInput(command);
        setSelectedCommandIndex(0);
    }

    function handleComposerKeyDown(
        event: KeyboardEvent<HTMLInputElement>,
    ) {
        if (!showCommandMenu) {
            return;
        }

        if (event.key === "ArrowDown") {
            event.preventDefault();

            setSelectedCommandIndex((current) =>
                (current + 1) %
                matchingCommands.length,
            );
            return;
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();

            setSelectedCommandIndex((current) =>
                (current - 1 +
                    matchingCommands.length) %
                matchingCommands.length,
            );
            return;
        }

        if (
            event.key === "Enter" &&
            matchingCommands[
            selectedCommandIndex
            ]
        ) {
            event.preventDefault();

            runDebugCommand(
                matchingCommands[
                selectedCommandIndex
                ][0],
            );
            return;
        }

        if (event.key === "Escape") {
            event.preventDefault();
            setInput("");
        }
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
                    <span>bloop.chat</span>
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

                        <div className="ai-chat__message-content">
                            {message.role === "assistant" ? (
                                <div className="ai-chat__markdown">
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            a: ({
                                                children,
                                                ...props
                                            }) => (
                                                <a
                                                    {...props}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    {children}
                                                </a>
                                            ),
                                        }}
                                    >
                                        {message.content}
                                    </ReactMarkdown>
                                </div>
                            ) : (
                                <p>{message.content}</p>
                            )}
                        </div>
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

            {showCommandMenu && (
                <div
                    className="ai-chat__command-menu"
                    role="listbox"
                    aria-label="Assistant commands"
                >
                    {matchingCommands.map(
                        (
                            [
                                command,
                                config,
                            ],
                            index,
                        ) => (
                            <button
                                key={command}
                                type="button"
                                className={[
                                    "ai-chat__command-option",
                                    index ===
                                        selectedCommandIndex
                                        ? "ai-chat__command-option--selected"
                                        : "",
                                ].join(" ")}
                                onMouseDown={(event) => {
                                    event.preventDefault();
                                    selectCommand(command);
                                }}
                                onClick={() =>
                                    runDebugCommand(
                                        command,
                                    )
                                }
                                role="option"
                                aria-selected={
                                    index ===
                                    selectedCommandIndex
                                }
                            >
                                <span className="ai-chat__command-name">
                                    {command}
                                </span>

                                <span className="ai-chat__command-description">
                                    {
                                        config.description
                                    }
                                </span>
                            </button>
                        ),
                    )}
                </div>
            )}

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
                    onKeyDown={
                        handleComposerKeyDown
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