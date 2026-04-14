"use client"

import { useState, useEffect, useRef, type CSSProperties } from "react";

const COLORS = {
  bg: "#4A6CF7",
  bgLight: "#5B7DF8",
  cardBg: "#FFFFFF",
  textPrimary: "#303036",
  textSecondary: "#636271",
  green: "#34A853",
  greenBg: "#E6F4EA",
  border: "#E9E9F4",
  shadow4dp: "-1px 4px 8px 0px rgba(233,233,244,1)",
  shadow8dp: "-1px 8px 16px 0px rgba(170,170,186,0.45)",
};

const CursorIcon = ({ style }: { style?: CSSProperties }) => (
  <div
    style={{
      position: "absolute",
      zIndex: 100,
      pointerEvents: "none",
      transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
      ...style,
    }}
  >
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 3L19 12L12 13L9 20L5 3Z"
        fill="#303036"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const SparkleIcon = ({ style, delay = 0 }: { style?: CSSProperties; delay?: number }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <div
      style={{
        position: "absolute",
        opacity: visible ? 1 : 0,
        transform: visible ? "scale(1) rotate(0deg)" : "scale(0) rotate(-45deg)",
        transition: "all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        ...style,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="white" opacity="0.7" />
      </svg>
    </div>
  );
};

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M13.5 2.25L15.75 4.5M12 15.75H15.75M3.75 11.625L2.25 15.75L6.375 14.25L15.2197 5.40533C15.6384 4.98661 15.6384 4.31339 15.2197 3.89467L14.1053 2.78033C13.6866 2.36161 13.0134 2.36161 12.5947 2.78033L3.75 11.625Z"
      stroke="#636271"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ANIMATION_STEPS = [
  { target: "profile", duration: 1200 },
  { target: "basic", duration: 1000 },
  { target: "basic-click", duration: 600 },
  { target: "work", duration: 1000 },
  { target: "work-click", duration: 600 },
  { target: "skills", duration: 1000 },
  { target: "skills-click", duration: 600 },
  { target: "reset-pause", duration: 1500 },
];

export default function ProfileCardAnimation() {
  const [step, setStep] = useState(-1);
  const [cursorPos, setCursorPos] = useState({ x: 300, y: 50 });
  const [clicking, setClicking] = useState(false);
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({
    basic: false,
    work: false,
    skills: false,
  });
  const [profileVisible, setProfileVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([false, false, false]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetState = () => {
    setProfileVisible(false);
    setCardsVisible([false, false, false]);
    setExpandedCards({ basic: false, work: false, skills: false });
    setClicking(false);
    setCursorPos({ x: 300, y: 50 });
  };

  useEffect(() => {
    const t1 = setTimeout(() => setProfileVisible(true), 300);
    const t2 = setTimeout(() => setCardsVisible([true, false, false]), 700);
    const t3 = setTimeout(() => setCardsVisible([true, true, false]), 900);
    const t4 = setTimeout(() => setCardsVisible([true, true, true]), 1100);
    const t5 = setTimeout(() => setStep(0), 1500);
    return () => {
      [t1, t2, t3, t4, t5].forEach(clearTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (step < 0) return;

    const currentStep = ANIMATION_STEPS[step % ANIMATION_STEPS.length];

    switch (currentStep.target) {
      case "profile":
        setCursorPos({ x: 190, y: 160 });
        break;
      case "basic":
        setCursorPos({ x: 340, y: 325 });
        break;
      case "basic-click":
        setClicking(true);
        setTimeout(() => {
          setClicking(false);
          setExpandedCards((p) => ({ ...p, basic: !p.basic }));
        }, 200);
        break;
      case "work":
        setCursorPos({ x: 340, y: expandedCards.basic ? 445 : 385 });
        break;
      case "work-click":
        setClicking(true);
        setTimeout(() => {
          setClicking(false);
          setExpandedCards((p) => ({ ...p, work: !p.work }));
        }, 200);
        break;
      case "skills":
        setCursorPos({
          x: 340,
          y:
            (expandedCards.basic ? 445 : 385) +
            (expandedCards.work ? 60 : 0) +
            60,
        });
        break;
      case "skills-click":
        setClicking(true);
        setTimeout(() => {
          setClicking(false);
          setExpandedCards((p) => ({ ...p, skills: !p.skills }));
        }, 200);
        break;
      case "reset-pause":
        setCursorPos({ x: 300, y: 50 });
        setTimeout(() => {
          resetState();
          setTimeout(() => {
            setProfileVisible(true);
            setTimeout(() => setCardsVisible([true, false, false]), 400);
            setTimeout(() => setCardsVisible([true, true, false]), 600);
            setTimeout(() => setCardsVisible([true, true, true]), 800);
          }, 100);
        }, 800);
        break;
    }

    timeoutRef.current = setTimeout(() => {
      setStep((s) => s + 1);
    }, currentStep.duration);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [step]);

  const cardBaseStyle: CSSProperties = {
    background: COLORS.cardBg,
    borderRadius: "8px",
    padding: "14px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: COLORS.shadow4dp,
    cursor: "pointer",
    transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fontFamily: "Roboto, sans-serif",
  };

  const getCardTransform = (index: number) => {
    if (!cardsVisible[index]) return "translateY(30px) scale(0.95)";
    return "translateY(0) scale(1)";
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 24,
        fontFamily: "Roboto, sans-serif",
        position: "relative",
        overflow: "hidden",
        letterSpacing: "0.2px",
      }}
    >
      {/* Sparkles */}
      <SparkleIcon style={{ top: "12%", left: "18%" }} delay={500} />
      <SparkleIcon style={{ top: "8%", right: "20%" }} delay={800} />
      <SparkleIcon style={{ bottom: "15%", left: "22%" }} delay={1100} />
      <SparkleIcon style={{ bottom: "10%", right: "18%" }} delay={1400} />
      <SparkleIcon style={{ top: "35%", right: "12%" }} delay={600} />
      <SparkleIcon style={{ top: "45%", left: "12%" }} delay={900} />

      {/* Main container */}
      <div
        style={{
          width: 420,
          position: "relative",
        }}
      >
        {/* Profile Card */}
        <div
          style={{
            background: COLORS.cardBg,
            borderRadius: "16px",
            padding: "28px 24px 24px",
            textAlign: "center",
            boxShadow: COLORS.shadow8dp,
            marginBottom: 16,
            opacity: profileVisible ? 1 : 0,
            transform: profileVisible
              ? "translateY(0) scale(1)"
              : "translateY(-20px) scale(0.95)",
            transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
          }}
        >
          {/* Avatar */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "999px",
              background: "linear-gradient(135deg, #F0E6D3 0%, #D4B896 100%)",
              margin: "0 auto 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              border: "3px solid #E9E9F4",
            }}
          >
            <div style={{ fontSize: 32 }}>👨‍💻</div>
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: 22,
                height: 22,
                borderRadius: "999px",
                background: COLORS.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
                <circle cx="6" cy="7" r="2.5" />
                <path d="M2 4h1.5l1-1.5h3l1 1.5H10a1 1 0 011 1v4a1 1 0 01-1 1H2a1 1 0 01-1-1V5a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.4, whiteSpace: "nowrap" }}>
              Juan Martín Pérez (Juanma)
            </span>
            <span style={{ fontSize: 10, fontWeight: 600, color: COLORS.green, background: COLORS.greenBg, padding: "2px 8px", borderRadius: "999px", lineHeight: 1.4 }}>
              Active
            </span>
          </div>

          <div style={{ fontSize: 14, color: COLORS.textSecondary, marginBottom: 12, lineHeight: 1.4 }}>
            Tech Leader | Engineering
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 24, fontSize: 12, color: COLORS.textSecondary, lineHeight: 1.4 }}>
            <span>📅 10 February</span>
            <span>🏢 1 year in the organisation</span>
          </div>
        </div>

        {/* Expandable Cards */}
        {[
          {
            key: "basic",
            label: "Basic Information",
            content: (
              <div style={{ padding: "12px 0 4px", fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span>Email</span>
                  <span style={{ color: COLORS.textPrimary }}>juanma@company.com</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span>Phone</span>
                  <span style={{ color: COLORS.textPrimary }}>+54 11 5555-1234</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0" }}>
                  <span>Location</span>
                  <span style={{ color: COLORS.textPrimary }}>Buenos Aires, AR</span>
                </div>
              </div>
            ),
          },
          {
            key: "work",
            label: "Work History",
            content: (
              <div style={{ padding: "12px 0 4px", fontSize: 13, color: COLORS.textSecondary, lineHeight: 1.6 }}>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ color: COLORS.textPrimary, fontWeight: 600 }}>Tech Leader</div>
                  <div>Engineering · 2025 - Present</div>
                </div>
                <div style={{ padding: "4px 0" }}>
                  <div style={{ color: COLORS.textPrimary, fontWeight: 600 }}>Senior Developer</div>
                  <div>Engineering · 2023 - 2025</div>
                </div>
              </div>
            ),
          },
          {
            key: "skills",
            label: "Skills & Expertise",
            content: (
              <div style={{ padding: "12px 0 4px", display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["React", "Node.js", "TypeScript", "AWS", "Leadership"].map((s) => (
                  <span key={s} style={{ fontSize: 12, padding: "4px 12px", borderRadius: "999px", background: "#EFF2FF", color: "#213478", fontWeight: 400, lineHeight: 1.4 }}>
                    {s}
                  </span>
                ))}
              </div>
            ),
          },
        ].map((card, i) => (
          <div
            key={card.key}
            style={{
              ...cardBaseStyle,
              flexDirection: "column",
              alignItems: "stretch",
              marginBottom: 12,
              opacity: cardsVisible[i] ? 1 : 0,
              transform: getCardTransform(i),
              boxShadow: expandedCards[card.key] ? COLORS.shadow8dp : COLORS.shadow4dp,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: COLORS.textPrimary, lineHeight: 1.4 }}>
                {card.label}
              </span>
              <div style={{ width: 32, height: 32, borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", background: expandedCards[card.key] ? "#F5F6F8" : "transparent", transition: "background 0.2s" }}>
                <EditIcon />
              </div>
            </div>
            <div style={{ maxHeight: expandedCards[card.key] ? 200 : 0, overflow: "hidden", transition: "max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }}>
              {card.content}
            </div>
          </div>
        ))}

        {/* Stacked cards illusion */}
        <div style={{ position: "relative", height: 20, marginTop: -4 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ position: "absolute", left: 12 + i * 8, right: 12 + i * 8, top: i * 4, height: 8, background: `rgba(255,255,255,${0.5 - i * 0.15})`, borderRadius: "0 0 8px 8px", zIndex: 3 - i }} />
          ))}
        </div>

        {/* Animated cursor */}
        <CursorIcon
          style={{
            left: cursorPos.x,
            top: cursorPos.y,
            transform: clicking ? "scale(0.8)" : "scale(1)",
          }}
        />
      </div>
    </div>
  );
}
