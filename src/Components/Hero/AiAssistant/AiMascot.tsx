import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type KeyboardEvent,
    type MouseEvent as ReactMouseEvent,
    type PointerEvent as ReactPointerEvent,
} from "react";
import "./AiMascot.css";

export type AiBlobState = "idle" | "listening" | "thinking" | "busy" | "speaking" | "error" | "angry" | "party";

interface AiMascotProps {
    state?: AiBlobState;
    onOpenChat?: () => void;
}

type EyeMood = "neutral" | "curious" | "wide" | "squint";

const TICKLE_DURATION = 720;
const RAPID_CLICK_WINDOW = 1800;
const ANNOYANCE_CLICK_COUNT = 6;
const ANNOYED_DURATION = 2400;
const DRAG_SOFT_LIMIT = 340;
const SNAP_DURATION = 1050;

export default function AiMascot({
    state = "idle",
    onOpenChat,
}: AiMascotProps) {
    const rootRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<SVGGElement>(null);
    const partyDragRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number | null>(null);
    const snapRafRef = useRef<number | null>(null);
    const tickleTimerRef = useRef<number | null>(null);
    const blinkTimerRef = useRef<number | null>(null);
    const expressionTimerRef = useRef<number | null>(null);
    const annoyedTimerRef = useRef<number | null>(null);
    const idleGazeStartTimerRef = useRef<number | null>(null);
    const idleGazeMoveTimerRef = useRef<number | null>(null);
    const idleGazeActiveRef = useRef(false);
    const lastPointerMoveRef = useRef(Date.now());

    const clickTimesRef = useRef<number[]>([]);
    const dragStateRef = useRef({
        active: false,
        pointerId: -1,
        startX: 0,
        startY: 0,
        dx: 0,
        dy: 0,
        moved: false,
    });

    const [isBlinking, setIsBlinking] = useState(false);
    const [isTickled, setIsTickled] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [isSnappingBack, setIsSnappingBack] = useState(false);
    const [isAnnoyed, setIsAnnoyed] = useState(false);
    const [isTantruming, setIsTantruming] = useState(false);
    const [eyeMood, setEyeMood] = useState<EyeMood>("neutral");

    useEffect(() => {
        const rootElement = rootRef.current;

        if (!rootElement) {
            return;
        }

        const root = rootElement as HTMLDivElement;
        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        );
        const finePointer = window.matchMedia("(pointer: fine)");

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

        let rootRect = root.getBoundingClientRect();
        let isInViewport = true;
        let isPageVisible = !document.hidden;
        let pointerListenerAttached = false;

        const maxLean = 10;
        const settleThreshold = 0.001;

        function animationNeeded() {
            return (
                Math.abs(targetLookX - currentLookX) > settleThreshold ||
                Math.abs(targetLookY - currentLookY) > settleThreshold ||
                Math.abs(targetDistance - currentDistance) > settleThreshold ||
                Math.abs(targetLeanX - currentLeanX) > settleThreshold ||
                Math.abs(targetLeanY - currentLeanY) > settleThreshold
            );
        }

        function canAnimate() {
            return isPageVisible && isInViewport && !reducedMotion.matches;
        }

        function requestRender() {
            if (!canAnimate() || rafRef.current !== null) {
                return;
            }

            rafRef.current = window.requestAnimationFrame(renderFrame);
        }

        function updateRootRect() {
            rootRect = root.getBoundingClientRect();
        }

        function setIdleGazeTarget() {
            if (
                reducedMotion.matches ||
                !idleGazeActiveRef.current ||
                !root.classList.contains("ai-blob--idle") ||
                root.classList.contains("ai-blob--dragging") ||
                root.classList.contains("ai-blob--annoyed")
            ) {
                return;
            }

            const angle = Math.random() * Math.PI * 2;
            const strength = 0.28 + Math.random() * 0.58;

            targetLookX = Math.cos(angle) * strength;
            targetLookY = Math.sin(angle) * strength * 0.72;
            targetDistance = 0.28 + strength * 0.48;

            targetLeanX = targetLookX * maxLean * 0.18;
            targetLeanY = targetLookY * maxLean * 0.10;

            requestRender();

            const holdFor = 900 + Math.random() * 2600;

            idleGazeMoveTimerRef.current = window.setTimeout(
                setIdleGazeTarget,
                holdFor,
            );
        }

        function beginIdleGaze() {
            if (
                !root.classList.contains("ai-blob--idle") ||
                root.classList.contains("ai-blob--dragging") ||
                root.classList.contains("ai-blob--annoyed")
            ) {
                scheduleIdleGaze();
                return;
            }

            idleGazeActiveRef.current = true;
            setIdleGazeTarget();
        }

        function stopIdleGaze() {
            idleGazeActiveRef.current = false;

            if (idleGazeMoveTimerRef.current !== null) {
                window.clearTimeout(idleGazeMoveTimerRef.current);
                idleGazeMoveTimerRef.current = null;
            }
        }

        function scheduleIdleGaze() {
            stopIdleGaze();

            if (idleGazeStartTimerRef.current !== null) {
                window.clearTimeout(idleGazeStartTimerRef.current);
            }

            const idleDelay = 6500 + Math.random() * 4500;

            idleGazeStartTimerRef.current = window.setTimeout(
                beginIdleGaze,
                idleDelay,
            );
        }

        function renderFrame() {
            rafRef.current = null;

            if (!canAnimate()) {
                return;
            }

            currentLookX += (targetLookX - currentLookX) * 0.38;
            currentLookY += (targetLookY - currentLookY) * 0.38;
            currentDistance += (targetDistance - currentDistance) * 0.24;

            currentLeanX += (targetLeanX - currentLeanX) * 0.2;
            currentLeanY += (targetLeanY - currentLeanY) * 0.2;

            const horizontal = currentLookX;
            const vertical = currentLookY;
            const distance = currentDistance;
            const eyeTurnStrength = distance * distance;

            const eyesShiftX = horizontal * (5 + eyeTurnStrength * 10);
            const eyesShiftY = vertical * (3 + eyeTurnStrength * 6);

            const pupilTravelX = horizontal * (8 + eyeTurnStrength * 10);
            const pupilTravelY = vertical * (5 + eyeTurnStrength * 7);

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

            const cursorEyeScaleY =
                1 +
                Math.max(-vertical, 0) * 0.08 -
                Math.max(vertical, 0) * 0.12;

            root.style.setProperty("--look-x", `${horizontal}`);
            root.style.setProperty("--look-y", `${vertical}`);
            root.style.setProperty("--look-distance", `${distance}`);
            root.style.setProperty("--eyes-shift-x", `${eyesShiftX}px`);
            root.style.setProperty("--eyes-shift-y", `${eyesShiftY}px`);
            root.style.setProperty("--left-eye-scale-x", `${leftEyeScaleX}`);
            root.style.setProperty("--right-eye-scale-x", `${rightEyeScaleX}`);
            root.style.setProperty("--cursor-eye-scale-y", `${cursorEyeScaleY}`);
            root.style.setProperty(
                "--left-eye-rotate",
                `${horizontal * -3.2 + vertical * -1.6}deg`,
            );
            root.style.setProperty(
                "--right-eye-rotate",
                `${horizontal * -3.2 + vertical * 1.6}deg`,
            );
            root.style.setProperty("--pupil-x", `${pupilTravelX}px`);
            root.style.setProperty("--pupil-y", `${pupilTravelY}px`);
            root.style.setProperty("--lean-x", `${currentLeanX}px`);
            root.style.setProperty("--lean-y", `${currentLeanY}px`);
            root.style.setProperty(
                "--lean-rotate",
                `${(currentLeanX / maxLean) * 3.2}deg`,
            );

            if (animationNeeded()) {
                requestRender();
            }
        }

        function handlePointerMove(event: PointerEvent) {
            lastPointerMoveRef.current = Date.now();
            stopIdleGaze();
            scheduleIdleGaze();

            if (reducedMotion.matches) {
                targetLookX = 0;
                targetLookY = 0;
                targetLeanX = 0;
                targetLeanY = 0;
                targetDistance = 0;
                return;
            }

            const centreX = rootRect.left + rootRect.width / 2;
            const centreY = rootRect.top + rootRect.height / 2;

            const dx = event.clientX - centreX;
            const dy = event.clientY - centreY;

            targetLookX = Math.max(-1, Math.min(1, dx / 300));
            targetLookY = Math.max(-1, Math.min(1, dy / 230));
            targetDistance = Math.min(1, Math.hypot(dx / 560, dy / 430));

            const farLeanBoost = 0.55 + targetDistance * 0.45;

            targetLeanX = targetLookX * maxLean * farLeanBoost;
            targetLeanY = targetLookY * maxLean * 0.58 * farLeanBoost;

            requestRender();
        }

        function resetPointer() {
            stopIdleGaze();
            targetLookX = 0;
            targetLookY = 0;
            targetLeanX = 0;
            targetLeanY = 0;
            targetDistance = 0;
            requestRender();
        }

        function attachPointerListener() {
            if (!finePointer.matches || pointerListenerAttached) {
                return;
            }

            window.addEventListener("pointermove", handlePointerMove, {
                passive: true,
            });
            pointerListenerAttached = true;
        }

        function detachPointerListener() {
            if (!pointerListenerAttached) {
                return;
            }

            window.removeEventListener("pointermove", handlePointerMove);
            pointerListenerAttached = false;
        }

        function handlePointerCapabilityChange() {
            if (finePointer.matches) {
                attachPointerListener();
            } else {
                detachPointerListener();
                resetPointer();
            }
        }

        function handleVisibilityChange() {
            isPageVisible = !document.hidden;

            if (!isPageVisible) {
                if (rafRef.current !== null) {
                    window.cancelAnimationFrame(rafRef.current);
                    rafRef.current = null;
                }
                return;
            }

            updateRootRect();
            requestRender();
        }

        const resizeObserver = new ResizeObserver(updateRootRect);
        resizeObserver.observe(root);

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                isInViewport = entry?.isIntersecting ?? true;

                if (!isInViewport) {
                    if (rafRef.current !== null) {
                        window.cancelAnimationFrame(rafRef.current);
                        rafRef.current = null;
                    }
                    return;
                }

                updateRootRect();
                requestRender();
            },
            { rootMargin: "120px" },
        );
        intersectionObserver.observe(root);

        attachPointerListener();
        window.addEventListener("blur", resetPointer);
        window.addEventListener("resize", updateRootRect, { passive: true });
        window.addEventListener("scroll", updateRootRect, {
            passive: true,
            capture: true,
        });
        document.addEventListener("visibilitychange", handleVisibilityChange);
        finePointer.addEventListener("change", handlePointerCapabilityChange);

        scheduleIdleGaze();

        return () => {
            detachPointerListener();
            window.removeEventListener("blur", resetPointer);
            window.removeEventListener("resize", updateRootRect);
            window.removeEventListener("scroll", updateRootRect, true);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            finePointer.removeEventListener(
                "change",
                handlePointerCapabilityChange,
            );

            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            stopIdleGaze();

            if (idleGazeStartTimerRef.current !== null) {
                window.clearTimeout(idleGazeStartTimerRef.current);
            }

            if (rafRef.current !== null) {
                window.cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        const stateMood: Record<AiBlobState, EyeMood> = {
            idle: "neutral",
            listening: "wide",
            thinking: "squint",
            busy: "wide",
            speaking: "wide",
            error: "squint",
            angry: "squint",
            party: "wide",
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

    function applyDragTransform(dx: number, dy: number) {
        const drag = dragRef.current;
        const partyDrag = partyDragRef.current;
        const root = rootRef.current;

        if (!drag || !partyDrag || !root) {
            return;
        }

        const distance = Math.hypot(dx, dy);

        /*
         * Almost-free drag with gentle resistance only at larger distances.
         */
        const over = Math.max(0, distance - DRAG_SOFT_LIMIT);
        const resistedDistance =
            distance <= DRAG_SOFT_LIMIT
                ? distance
                : DRAG_SOFT_LIMIT + over * 0.72;

        const ratio =
            distance === 0
                ? 1
                : resistedDistance / distance;

        const draggedX = dx * ratio;
        const draggedY = dy * ratio;

        const strength = Math.min(
            1,
            resistedDistance / 520,
        );

        /*
         * Stretch along the direction being pulled and compress slightly
         * across it so the blob still feels jelly-like.
         */
        const horizontalBias =
            Math.abs(draggedX) /
            Math.max(
                1,
                Math.abs(draggedX) + Math.abs(draggedY),
            );

        const verticalBias = 1 - horizontalBias;

        const scaleX =
            1 +
            horizontalBias * strength * 0.23 -
            verticalBias * strength * 0.05;

        const scaleY =
            1 +
            verticalBias * strength * 0.23 -
            horizontalBias * strength * 0.05;

        const rotate =
            Math.max(
                -12,
                Math.min(12, draggedX / 24),
            );

        const dragTransform = `
            translate(${draggedX}px, ${draggedY}px)
            rotate(${rotate}deg)
            scale(${scaleX}, ${scaleY})
        `;

        if (state === "party") {
            /*
             * Party mode moves the entire visual bundle together:
             * mascot + dedicated aura + orbs.
             *
             * The inner SVG drag group stays neutral so the mascot is not
             * translated twice.
             */
            partyDrag.style.transform = dragTransform;
            drag.style.transform = `
                translate(0px, 0px)
                rotate(0deg)
                scale(1)
            `;
        } else {
            drag.style.transform = dragTransform;
            partyDrag.style.transform = `
                translate(0px, 0px)
                rotate(0deg)
                scale(1)
            `;
        }

        /*
         * Move the glow with him while dragging.
         */
        root.style.setProperty(
            "--drag-x",
            `${draggedX}px`,
        );
        root.style.setProperty(
            "--drag-y",
            `${draggedY}px`,
        );
        root.style.setProperty(
            "--drag-strength",
            `${strength}`,
        );

        dragStateRef.current.dx = draggedX;
        dragStateRef.current.dy = draggedY;
    }

    function snapDragBack() {
        if (snapRafRef.current !== null) {
            window.cancelAnimationFrame(
                snapRafRef.current,
            );
        }

        const startX = dragStateRef.current.dx;
        const startY = dragStateRef.current.dy;
        const startTime = performance.now();

        setIsSnappingBack(true);

        function frame(now: number) {
            const t = Math.min(
                1,
                (now - startTime) / SNAP_DURATION,
            );

            /*
             * Damped spring: overshoots home several times before settling.
             */
            const decay = Math.pow(1 - t, 2.15);
            const oscillation =
                Math.cos(t * Math.PI * 5.4);
            const factor = decay * oscillation;

            applyDragTransform(
                startX * factor,
                startY * factor,
            );

            if (t < 1) {
                snapRafRef.current =
                    window.requestAnimationFrame(frame);
                return;
            }

            applyDragTransform(0, 0);
            setIsSnappingBack(false);
            snapRafRef.current = null;
        }

        snapRafRef.current =
            window.requestAnimationFrame(frame);
    }

    function triggerAnnoyance() {
        if (isAnnoyed) {
            return;
        }

        setIsBlinking(false);
        setIsTickled(false);
        setIsTantruming(true);
        setIsAnnoyed(true);
        setEyeMood("squint");

        /*
         * Eyes squeeze shut during the initial tantrum, then reopen angry.
         */
        window.setTimeout(() => {
            setIsTantruming(false);
        }, 650);

        if (annoyedTimerRef.current !== null) {
            window.clearTimeout(
                annoyedTimerRef.current,
            );
        }

        annoyedTimerRef.current = window.setTimeout(() => {
            setIsAnnoyed(false);
            setIsTantruming(false);
            setEyeMood("neutral");
            clickTimesRef.current = [];
            annoyedTimerRef.current = null;
        }, ANNOYED_DURATION);
    }

    function registerPoke() {
        if (isAnnoyed || isSnappingBack) {
            return;
        }

        const now = Date.now();

        clickTimesRef.current = [
            ...clickTimesRef.current.filter(
                (time) =>
                    now - time < RAPID_CLICK_WINDOW,
            ),
            now,
        ];

        if (
            clickTimesRef.current.length >=
            ANNOYANCE_CLICK_COUNT
        ) {
            clickTimesRef.current = [];
            triggerAnnoyance();
            return;
        }

        triggerTickle();
    }

    function triggerTickle() {
        if (isAnnoyed || isSnappingBack) {
            return;
        }

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

        /*
         * Browsers emit click after pointer-up. Ignore the click produced by a
         * real drag; otherwise register it as a normal poke and open chat.
         */
        if (dragStateRef.current.moved) {
            dragStateRef.current.moved = false;
            return;
        }

        registerPoke();
        onOpenChat?.();
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (
            (event.key === "Enter" || event.key === " ") &&
            !isAnnoyed &&
            !isSnappingBack
        ) {
            event.preventDefault();
            registerPoke();
            onOpenChat?.();
        }
    }

    function handlePointerDown(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        if (
            event.button !== 0 ||
            isAnnoyed ||
            isSnappingBack
        ) {
            return;
        }

        dragStateRef.current = {
            active: true,
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            dx: 0,
            dy: 0,
            moved: false,
        };

        event.currentTarget.setPointerCapture(
            event.pointerId,
        );

        setIsDragging(true);
    }

    function handlePointerDrag(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        if (!dragStateRef.current.active) {
            return;
        }

        const dx =
            event.clientX -
            dragStateRef.current.startX;
        const dy =
            event.clientY -
            dragStateRef.current.startY;

        if (Math.hypot(dx, dy) > 5) {
            dragStateRef.current.moved = true;
        }

        applyDragTransform(dx, dy);
    }

    function finishDrag(
        event: ReactPointerEvent<HTMLDivElement>,
    ) {
        if (!dragStateRef.current.active) {
            return;
        }

        const wasMoved =
            dragStateRef.current.moved;

        dragStateRef.current.active = false;

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId,
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId,
            );
        }

        setIsDragging(false);

        /*
         * A plain press/release is still a click. Only start the spring when
         * the pointer actually moved.
         */
        if (!wasMoved) {
            applyDragTransform(0, 0);
            return;
        }

        snapDragBack();
    }

    const eyeOpen =
        isBlinking || isTickled || isTantruming
            ? "0.025"
            : isAnnoyed || state === "angry"
                ? "0.58"
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
            state === "error"
                ? "-7deg"
                : state === "angry"
                    ? "0deg"
                    : eyeMood === "curious"
                        ? "-4deg"
                        : "0deg",
        "--mood-right-rotate":
            state === "error"
                ? "7deg"
                : state === "angry"
                    ? "0deg"
                    : eyeMood === "curious"
                        ? "4deg"
                        : "0deg",
    } as CSSProperties;

    useEffect(() => {
        return () => {
            if (snapRafRef.current !== null) {
                window.cancelAnimationFrame(
                    snapRafRef.current,
                );
            }

            if (annoyedTimerRef.current !== null) {
                window.clearTimeout(
                    annoyedTimerRef.current,
                );
            }
        };
    }, []);

    return (
        <div
            ref={rootRef}
            className={[
                "ai-blob",
                `ai-blob--${state}`,
                `ai-blob--eyes-${eyeMood}`,
                isBlinking ? "ai-blob--blinking" : "",
                isTickled ? "ai-blob--tickled" : "",
                isDragging ? "ai-blob--dragging" : "",
                isSnappingBack ? "ai-blob--snapping" : "",
                isAnnoyed || state === "angry"
                    ? "ai-blob--annoyed"
                    : "",
                isTantruming ? "ai-blob--tantrum" : "",
            ]
                .filter(Boolean)
                .join(" ")}
            style={style}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerDrag}
            onPointerUp={finishDrag}
            onPointerCancel={finishDrag}
            role="button"
            tabIndex={0}
            aria-label="Open portfolio assistant"
            title="Poke me"
        >
            <div
                ref={partyDragRef}
                className="ai-blob__party-drag"
            >
                <div className="ai-blob__party-stage">
                    <div
                        className="ai-blob__party-glow"
                        aria-hidden="true"
                    />

                    <div
                        className="ai-blob__party-orbs"
                        aria-hidden="true"
                    >
                        <span className="ai-blob__party-orb ai-blob__party-orb--1" />
                        <span className="ai-blob__party-orb ai-blob__party-orb--2" />
                        <span className="ai-blob__party-orb ai-blob__party-orb--3" />
                        <span className="ai-blob__party-orb ai-blob__party-orb--4" />
                        <span className="ai-blob__party-orb ai-blob__party-orb--5" />
                        <span className="ai-blob__party-orb ai-blob__party-orb--6" />
                    </div>

                    <div className="ai-blob__glow" aria-hidden="true" />

                    <svg
                        className="ai-blob__svg"
                        viewBox="0 0 320 320"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <defs>
                            <filter
                                id="ai-blob-party-wobble"
                                x="-25%"
                                y="-25%"
                                width="150%"
                                height="150%"
                            >
                                <feTurbulence
                                    type="fractalNoise"
                                    baseFrequency="0.018 0.026"
                                    numOctaves="2"
                                    seed="7"
                                    result="noise"
                                >
                                    <animate
                                        attributeName="baseFrequency"
                                        dur="0.42s"
                                        values="0.018 0.026;0.034 0.018;0.022 0.038;0.018 0.026"
                                        repeatCount="indefinite"
                                    />
                                    <animate
                                        attributeName="seed"
                                        dur="1.2s"
                                        values="7;11;17;23;7"
                                        repeatCount="indefinite"
                                    />
                                </feTurbulence>

                                <feDisplacementMap
                                    in="SourceGraphic"
                                    in2="noise"
                                    scale="20"
                                    xChannelSelector="R"
                                    yChannelSelector="G"
                                >
                                    <animate
                                        attributeName="scale"
                                        dur="0.34s"
                                        values="12;24;16;28;12"
                                        repeatCount="indefinite"
                                    />
                                </feDisplacementMap>
                            </filter>

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

                        <g
                            ref={dragRef}
                            className="ai-blob__drag"
                        >
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

                                            <g className="ai-blob__angry-brows">
                                                <rect
                                                    className="ai-blob__angry-brow ai-blob__angry-brow--left"
                                                    x="107"
                                                    y="101"
                                                    width="40"
                                                    height="8"
                                                    rx="4"
                                                />
                                                <rect
                                                    className="ai-blob__angry-brow ai-blob__angry-brow--right"
                                                    x="173"
                                                    y="101"
                                                    width="40"
                                                    height="8"
                                                    rx="4"
                                                />
                                            </g>
                                        </g>
                                    </g>
                                </g>
                            </g>
                        </g>
                    </svg>
                </div>
            </div>
        </div>
    );
}