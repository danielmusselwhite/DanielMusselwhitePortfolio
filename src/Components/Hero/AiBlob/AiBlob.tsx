import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
} from "react";
import "./AiBlob.css";

export type AiBlobState = "idle" | "thinking" | "speaking" | "error";

interface AiBlobProps {
    state?: AiBlobState;
}

type EyeMood = "neutral" | "curious" | "wide" | "squint";

const TICKLE_DURATION = 720;

export default function AiBlob({ state = "idle" }: AiBlobProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const tickleTimerRef = useRef<number | null>(null);
    const blinkTimerRef = useRef<number | null>(null);
    const expressionTimerRef = useRef<number | null>(null);

    const [isBlinking, setIsBlinking] = useState(false);
    const [isTickled, setIsTickled] = useState(false);
    const [eyeMood, setEyeMood] = useState<EyeMood>("neutral");

    useEffect(() => {
        const root = rootRef.current;

        if (!root) {
            return;
        }

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );

        let targetLookX = 0;
        let targetLookY = 0;
        let currentLookX = 0;
        let currentLookY = 0;

        let targetLeanX = 0;
        let targetLeanY = 0;
        let currentLeanX = 0;
        let currentLeanY = 0;

        let targetDistance = 0;
        let currentDistance = 0;

        const maxLean = 10;

        function renderFrame() {
            /*
             * Gaze reacts quickly.
             * Body lean is deliberately a little softer so it feels organic.
             */
            currentLookX += (targetLookX - currentLookX) * 0.38;
            currentLookY += (targetLookY - currentLookY) * 0.38;
            currentDistance += (targetDistance - currentDistance) * 0.24;

            currentLeanX += (targetLeanX - currentLeanX) * 0.2;
            currentLeanY += (targetLeanY - currentLeanY) * 0.2;

            const horizontal = currentLookX;
            const vertical = currentLookY;
            const distance = currentDistance;

            /*
             * At short distances the eyes mostly stay centred.
             * At long distances the entire eye pair travels toward the cursor,
             * which helps sell the illusion that the blob is turning its face.
             */
            const eyeTurnStrength = distance * distance;

            const eyesShiftX =
                horizontal * (5 + eyeTurnStrength * 10);

            const eyesShiftY =
                vertical * (3 + eyeTurnStrength * 6);

            /*
             * Pupils move further than the eye whites and are intentionally
             * allowed to leave the eye shape slightly at extreme gaze.
             * There is no clipping mask on purpose.
             */
            const pupilTravelX =
                horizontal * (8 + eyeTurnStrength * 10);

            const pupilTravelY =
                vertical * (5 + eyeTurnStrength * 7);

            /*
             * Eye widths subtly change with direction so the face feels like
             * it is rotating rather than simply translating.
             */
            const leftEyeScaleX =
                1 +
                (horizontal < 0
                    ? Math.abs(horizontal) * 0.10
                    : -horizontal * 0.12);

            const rightEyeScaleX =
                1 +
                (horizontal > 0
                    ? horizontal * 0.10
                    : -Math.abs(horizontal) * 0.12);

            /*
             * Looking up opens the eyes a touch; looking down narrows them.
             * Keep this subtle because the base eye shape is already skinny.
             */
            const cursorEyeScaleY =
                1 +
                Math.max(-vertical, 0) * 0.08 -
                Math.max(vertical, 0) * 0.12;

            root.style.setProperty("--look-x", `${horizontal}`);
            root.style.setProperty("--look-y", `${vertical}`);
            root.style.setProperty("--look-distance", `${distance}`);

            root.style.setProperty(
                "--eyes-shift-x",
                `${eyesShiftX}px`,
            );
            root.style.setProperty(
                "--eyes-shift-y",
                `${eyesShiftY}px`,
            );

            root.style.setProperty(
                "--left-eye-scale-x",
                `${leftEyeScaleX}`,
            );
            root.style.setProperty(
                "--right-eye-scale-x",
                `${rightEyeScaleX}`,
            );
            root.style.setProperty(
                "--cursor-eye-scale-y",
                `${cursorEyeScaleY}`,
            );

            root.style.setProperty(
                "--left-eye-rotate",
                `${horizontal * -3.2 + vertical * -1.6}deg`,
            );
            root.style.setProperty(
                "--right-eye-rotate",
                `${horizontal * -3.2 + vertical * 1.6}deg`,
            );

            root.style.setProperty(
                "--pupil-x",
                `${pupilTravelX}px`,
            );
            root.style.setProperty(
                "--pupil-y",
                `${pupilTravelY}px`,
            );

            root.style.setProperty(
                "--lean-x",
                `${currentLeanX}px`,
            );
            root.style.setProperty(
                "--lean-y",
                `${currentLeanY}px`,
            );
            root.style.setProperty(
                "--lean-rotate",
                `${(currentLeanX / maxLean) * 3.2}deg`,
            );

            rafRef.current = window.requestAnimationFrame(renderFrame);
        }

        function handlePointerMove(event: PointerEvent) {
            if (reducedMotion.matches) {
                targetLookX = 0;
                targetLookY = 0;
                targetLeanX = 0;
                targetLeanY = 0;
                targetDistance = 0;
                return;
            }

            const rect = root.getBoundingClientRect();
            const centreX = rect.left + rect.width / 2;
            const centreY = rect.top + rect.height / 2;

            const dx = event.clientX - centreX;
            const dy = event.clientY - centreY;

            /*
             * Full gaze is reached fairly quickly so eye movement feels
             * immediate even if the cursor is only a few hundred px away.
             */
            targetLookX = Math.max(-1, Math.min(1, dx / 300));
            targetLookY = Math.max(-1, Math.min(1, dy / 230));

            /*
             * Distance is independent from direction and is used to decide
             * how dramatically the eyes + body should turn.
             */
            targetDistance = Math.min(
                1,
                Math.hypot(dx / 560, dy / 430),
            );

            const farLeanBoost = 0.55 + targetDistance * 0.45;

            targetLeanX =
                targetLookX * maxLean * farLeanBoost;

            targetLeanY =
                targetLookY * maxLean * 0.58 * farLeanBoost;
        }

        function resetPointer() {
            targetLookX = 0;
            targetLookY = 0;
            targetLeanX = 0;
            targetLeanY = 0;
            targetDistance = 0;
        }

        window.addEventListener("pointermove", handlePointerMove, {
            passive: true,
        });
        window.addEventListener("blur", resetPointer);

        rafRef.current = window.requestAnimationFrame(renderFrame);

        return () => {
            window.removeEventListener("pointermove", handlePointerMove);
            window.removeEventListener("blur", resetPointer);

            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    useEffect(() => {
        const stateMood: Record<AiBlobState, EyeMood> = {
            idle: "neutral",
            thinking: "squint",
            speaking: "wide",
            error: "squint",
        };

        setEyeMood(stateMood[state]);
    }, [state]);

    useEffect(() => {
        if (state !== "idle" || isTickled) {
            return;
        }

        let cancelled = false;

        function scheduleBlink() {
            const delay = 1700 + Math.random() * 2800;

            blinkTimerRef.current = window.setTimeout(() => {
                if (cancelled) {
                    return;
                }

                setIsBlinking(true);

                blinkTimerRef.current = window.setTimeout(() => {
                    if (!cancelled) {
                        setIsBlinking(false);

                        if (Math.random() < 0.2) {
                            blinkTimerRef.current = window.setTimeout(() => {
                                if (!cancelled) {
                                    setIsBlinking(true);

                                    blinkTimerRef.current = window.setTimeout(() => {
                                        if (!cancelled) {
                                            setIsBlinking(false);
                                            scheduleBlink();
                                        }
                                    }, 150);
                                }
                            }, 145);
                        } else {
                            scheduleBlink();
                        }
                    }
                }, 165);
            }, delay);
        }

        scheduleBlink();

        return () => {
            cancelled = true;

            if (blinkTimerRef.current !== null) {
                window.clearTimeout(blinkTimerRef.current);
            }
        };
    }, [state, isTickled]);

    useEffect(() => {
        if (state !== "idle" || isTickled || isBlinking) {
            return;
        }

        let cancelled = false;

        function scheduleExpression() {
            expressionTimerRef.current = window.setTimeout(() => {
                if (cancelled) {
                    return;
                }

                const nextMood: EyeMood =
                    Math.random() < 0.6 ? "curious" : "wide";

                setEyeMood(nextMood);

                expressionTimerRef.current = window.setTimeout(() => {
                    if (!cancelled) {
                        setEyeMood("neutral");
                        scheduleExpression();
                    }
                }, 420 + Math.random() * 500);
            }, 3000 + Math.random() * 3600);
        }

        scheduleExpression();

        return () => {
            cancelled = true;

            if (expressionTimerRef.current !== null) {
                window.clearTimeout(expressionTimerRef.current);
            }
        };
    }, [state, isTickled, isBlinking]);

    function triggerTickle() {
        if (
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        if (tickleTimerRef.current !== null) {
            window.clearTimeout(tickleTimerRef.current);
        }

        setIsBlinking(false);
        setIsTickled(false);

        window.requestAnimationFrame(() => {
            window.requestAnimationFrame(() => {
                setIsTickled(true);

                tickleTimerRef.current = window.setTimeout(() => {
                    setIsTickled(false);

                    if (state === "thinking" || state === "error") {
                        setEyeMood("squint");
                    } else if (state === "speaking") {
                        setEyeMood("wide");
                    } else {
                        setEyeMood("neutral");
                    }

                    tickleTimerRef.current = null;
                }, TICKLE_DURATION);
            });
        });
    }

    function handleClick(event: ReactMouseEvent<HTMLDivElement>) {
        event.preventDefault();
        triggerTickle();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            triggerTickle();
        }
    }

    const eyeOpen =
        isBlinking || isTickled
            ? "0.025"
            : eyeMood === "wide"
                ? "1.16"
                : eyeMood === "squint"
                    ? "0.62"
                    : "1";

    const style = {
        "--eye-open": eyeOpen,
        "--mood-eye-scale":
            eyeMood === "wide"
                ? "1.06"
                : eyeMood === "curious"
                    ? "1.02"
                    : "1",
        "--mood-left-rotate":
            eyeMood === "curious" ? "-4deg" : "0deg",
        "--mood-right-rotate":
            eyeMood === "curious" ? "4deg" : "0deg",
    } as CSSProperties;

    return (
        <div
            ref={rootRef}
            className={[
                "ai-blob",
                `ai-blob--${state}`,
                `ai-blob--eyes-${eyeMood}`,
                isBlinking ? "ai-blob--blinking" : "",
                isTickled ? "ai-blob--tickled" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-label="Animated portfolio assistant"
            title="Poke me"
        >
            <div className="ai-blob__glow" aria-hidden="true" />

            <svg
                className="ai-blob__svg"
                viewBox="0 0 320 320"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="ai-blob-fill"
                        x1="72"
                        y1="58"
                        x2="252"
                        y2="270"
                        gradientUnits="userSpaceOnUse"
                    >
                        <stop
                            offset="0%"
                            stopColor="var(--blob-highlight)"
                        />
                        <stop
                            offset="52%"
                            stopColor="var(--blob-main)"
                        />
                        <stop
                            offset="100%"
                            stopColor="var(--blob-shadow)"
                        />
                    </linearGradient>

                    <radialGradient
                        id="ai-blob-shine"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(113 93) rotate(52) scale(118 108)"
                    >
                        <stop
                            stopColor="white"
                            stopOpacity="0.34"
                        />
                        <stop
                            offset="1"
                            stopColor="white"
                            stopOpacity="0"
                        />
                    </radialGradient>

                    <linearGradient
                        id="ai-blob-shimmer"
                        x1="55"
                        y1="70"
                        x2="265"
                        y2="250"
                    >
                        <stop
                            offset="0%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                        <stop
                            offset="44%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                        <stop
                            offset="52%"
                            stopColor="white"
                            stopOpacity="0.22"
                        />
                        <stop
                            offset="60%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                        <stop
                            offset="100%"
                            stopColor="white"
                            stopOpacity="0"
                        />
                    </linearGradient>
                </defs>

                <g className="ai-blob__lean">
                    <g className="ai-blob__tickle">
                        <g className="ai-blob__floating">
                            <path
                                className="ai-blob__body ai-blob__body--back"
                                d="M159 37C215 34 264 70 279 121C295 174 279 233 231 266C184 298 119 290 76 253C34 217 24 155 47 106C70 57 105 40 159 37Z"
                            />

                            <path
                                className="ai-blob__body"
                                d="M159 37C215 34 264 70 279 121C295 174 279 233 231 266C184 298 119 290 76 253C34 217 24 155 47 106C70 57 105 40 159 37Z"
                                fill="url(#ai-blob-fill)"
                            />

                            <path
                                className="ai-blob__shine"
                                d="M159 37C215 34 264 70 279 121C295 174 279 233 231 266C184 298 119 290 76 253C34 217 24 155 47 106C70 57 105 40 159 37Z"
                                fill="url(#ai-blob-shine)"
                            />

                            <path
                                className="ai-blob__shimmer"
                                d="M159 37C215 34 264 70 279 121C295 174 279 233 231 266C184 298 119 290 76 253C34 217 24 155 47 106C70 57 105 40 159 37Z"
                                fill="url(#ai-blob-shimmer)"
                            />

                            <g className="ai-blob__eyes">
                                <g className="ai-blob__eye ai-blob__eye--left">
                                    <rect
                                        className="ai-blob__sclera"
                                        x="110"
                                        y="111"
                                        width="28"
                                        height="76"
                                        rx="14"
                                    />

                                    <rect
                                        className="ai-blob__pupil"
                                        x="117"
                                        y="130"
                                        width="14"
                                        height="38"
                                        rx="7"
                                    />
                                </g>

                                <g className="ai-blob__eye ai-blob__eye--right">
                                    <rect
                                        className="ai-blob__sclera"
                                        x="182"
                                        y="111"
                                        width="28"
                                        height="76"
                                        rx="14"
                                    />

                                    <rect
                                        className="ai-blob__pupil"
                                        x="189"
                                        y="130"
                                        width="14"
                                        height="38"
                                        rx="7"
                                    />
                                </g>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>

            <span
                className="ai-blob__status-dot"
                aria-hidden="true"
            />
        </div>
    );
}