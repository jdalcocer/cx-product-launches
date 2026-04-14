"use client"

import { useState, useEffect, useRef, useCallback, type CSSProperties, type ReactNode } from "react";

/* ── Design System Tokens ── */
const C = {
  brand400: "#6f93eb",
  brand600: "#4A6CF7",
  brand700: "#3B5CE4",
  brand800: "#213478",
  brand100: "#EFF2FF",
  bg: "#F5F6F8",
  white: "#FFFFFF",
  textPrimary: "#303036",
  textSecondary: "#636271",
  border: "#E9E9F4",
  greenSuccess: "#34A853",
  greenBg: "#E6F4EA",
  yellowWarning: "#E8A317",
  yellowBg: "#FFF8E1",
  shadow4dp: "-1px 4px 8px 0px rgba(233,233,244,1)",
  shadow8dp: "-1px 8px 16px 0px rgba(170,170,186,0.45)",
};

/* ── Cursor SVG ── */
const Cursor = ({ x, y, clicking }: { x: number; y: number; clicking: boolean }) => (
  <div
    style={{
      position: "absolute",
      left: x,
      top: y,
      zIndex: 200,
      pointerEvents: "none",
      transition: "left 0.7s cubic-bezier(0.4,0,0.2,1), top 0.7s cubic-bezier(0.4,0,0.2,1), transform 0.15s",
      transform: clicking ? "scale(0.75)" : "scale(1)",
      filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.2))",
    }}
  >
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M5 3L19 12L12 13L9 20L5 3Z" fill={C.textPrimary} stroke="white" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  </div>
);

/* ── Sparkle decorations ── */
const Sparkle = ({ x, y, delay, size = 16 }: { x: string; y: string; delay: number; size?: number }) => {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), delay); return () => clearTimeout(t); }, [delay]);
  return (
    <svg
      width={size} height={size} viewBox="0 0 20 20" fill="none"
      style={{
        position: "absolute", left: x, top: y, opacity: show ? 0.6 : 0,
        transform: show ? "scale(1) rotate(0)" : "scale(0) rotate(-90deg)",
        transition: "all 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      }}
    >
      <path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8L10 0Z" fill="white" />
    </svg>
  );
};

/* ── Reusable mini-components ── */
const MiniSidebar = ({ items, activeIndex, checkmarks = [] }: { items: string[]; activeIndex: number; checkmarks?: number[] }) => (
  <div style={{ width: 100, borderRight: `1px solid ${C.border}`, padding: "12px 0", background: C.white, flexShrink: 0 }}>
    {items.map((item, i) => (
      <div
        key={i}
        style={{
          padding: "6px 10px",
          fontSize: 7.5,
          fontWeight: i === activeIndex ? 600 : 400,
          color: i === activeIndex ? C.brand600 : C.textSecondary,
          background: i === activeIndex ? C.brand100 : "transparent",
          borderLeft: i === activeIndex ? `2px solid ${C.brand600}` : "2px solid transparent",
          display: "flex", alignItems: "center", gap: 4,
          transition: "all 0.3s",
        }}
      >
        {checkmarks.includes(i) && <span style={{ color: C.brand600, fontSize: 8 }}>✓</span>}
        {item}
      </div>
    ))}
  </div>
);

const MiniHeader = ({ title, badge, rightBtn }: { title: string; badge?: { text: string; bg: string; color: string } | null; rightBtn?: ReactNode }) => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px", borderBottom: `1px solid ${C.border}`, background: C.white }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ fontSize: 9, fontWeight: 600, color: C.textPrimary }}>{title}</span>
      {badge && (
        <span style={{ fontSize: 6, padding: "1px 5px", borderRadius: 999, background: badge.bg, color: badge.color, fontWeight: 600 }}>
          {badge.text}
        </span>
      )}
    </div>
    {rightBtn && (
      <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
        {rightBtn}
      </div>
    )}
  </div>
);

const MiniBtn = ({ label, primary, small }: { label: string; primary?: boolean; small?: boolean }) => (
  <div style={{
    padding: small ? "3px 8px" : "4px 12px",
    borderRadius: 4,
    fontSize: small ? 6 : 7,
    fontWeight: 600,
    color: primary ? C.white : C.brand600,
    background: primary ? C.brand600 : "transparent",
    border: primary ? "none" : `1px solid ${C.brand600}`,
    whiteSpace: "nowrap",
    letterSpacing: 0.2,
  }}>
    {label}
  </div>
);

const MiniCard = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div style={{
    background: C.white, borderRadius: 6, border: `1px solid ${C.border}`,
    padding: "8px 10px", ...style,
  }}>
    {children}
  </div>
);

const MiniInput = ({ label, placeholder, width }: { label: string; placeholder: string; width?: string }) => (
  <div style={{ width: width || "100%", marginBottom: 4 }}>
    <div style={{ fontSize: 6.5, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>{label}</div>
    <div style={{
      border: `1px solid ${C.border}`, borderRadius: 4, padding: "3px 6px",
      fontSize: 6, color: "#999", background: C.white,
    }}>
      {placeholder}
    </div>
  </div>
);

const MiniTableRow = ({ cells, isHeader }: { cells: { text: string; flex?: number; color?: string }[]; isHeader?: boolean }) => (
  <div style={{
    display: "flex", borderBottom: `1px solid ${C.border}`,
    background: isHeader ? C.brand100 : C.white,
  }}>
    {cells.map((cell, i) => (
      <div key={i} style={{
        flex: cell.flex || 1, padding: "5px 6px", fontSize: 6.5,
        fontWeight: isHeader ? 600 : 400,
        color: isHeader ? C.brand800 : (cell.color || C.textPrimary),
      }}>
        {cell.text}
      </div>
    ))}
  </div>
);

const GrayLine = ({ w }: { w?: string }) => (
  <div style={{ height: 3, width: w || "60%", background: "#E9E9F4", borderRadius: 2, marginBottom: 3 }} />
);

/* ── SCREEN COMPONENTS ── */

/* 1. Job Listing Table */
const ScreenEmpleos = () => (
  <div style={{ display: "flex", height: "100%", background: C.bg }}>
    {/* App sidebar */}
    <div style={{ width: 90, background: C.white, borderRight: `1px solid ${C.border}`, padding: "8px 6px", display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: 9, fontWeight: 600, color: C.brand600, letterSpacing: -0.3, marginBottom: 6 }}>humand</div>
      {["Inicio", "Usuarios", "OrgChart", "Roles y Permisos", "Muro", "Grupos", "Reclutamiento"].map((item, i) => (
        <div key={i} style={{
          fontSize: 6, padding: "3px 5px", borderRadius: 4,
          color: i === 6 ? C.brand600 : C.textSecondary,
          fontWeight: i === 6 ? 600 : 400,
          background: i === 6 ? C.brand100 : "transparent",
        }}>
          {item}
        </div>
      ))}
      <div style={{ fontSize: 6, padding: "3px 5px 3px 14px", color: C.brand600, fontWeight: 600, background: C.brand100, borderRadius: 4 }}>
        Empleos
      </div>
    </div>
    {/* Main */}
    <div style={{ flex: 1, padding: "10px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary }}>Empleos</div>
          <div style={{ fontSize: 6, color: C.textSecondary }}>Centraliza y gestiona todas las búsquedas laborales</div>
        </div>
        <MiniBtn label="+ Nuevo empleo" primary />
      </div>
      <div style={{ background: C.white, borderRadius: 6, overflow: "hidden", boxShadow: C.shadow4dp }}>
        <MiniTableRow isHeader cells={[
          { text: "Empleo", flex: 2 }, { text: "Departamento", flex: 1.5 },
          { text: "Estado", flex: 1 }, { text: "Candidatos", flex: 0.8 }, { text: "Creación", flex: 1.2 },
        ]} />
        {[...Array(6)].map((_, i) => (
          <MiniTableRow key={i} cells={[
            { text: "Nombre empleo", flex: 2 },
            { text: "Departamento", flex: 1.5 },
            { text: "Status", flex: 1, color: C.brand600 },
            { text: "10", flex: 0.8 },
            { text: "dd/mm/aaaa", flex: 1.2 },
          ]} />
        ))}
      </div>
    </div>
  </div>
);

/* 2. Configuración General */
const ScreenConfigGeneral = ({ typing }: { typing?: boolean }) => (
  <div style={{ display: "flex", height: "100%" }}>
    <MiniSidebar items={["Configuración general", "Etapas del proceso", "Publicación", "Revisión"]} activeIndex={0} />
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "10px 14px", overflowY: "auto" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Configuración general</div>
        <div style={{ fontSize: 6, color: C.textSecondary, marginBottom: 8 }}>Carga la información inicial del empleo</div>

        <MiniCard style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Identificación del empleo</div>
          <div style={{ display: "flex", gap: 8 }}>
            <MiniInput label="Nombre interno*" placeholder={typing ? "Cajero (temporada de inv..." : "Nombre interno del empleo"} width="50%" />
            <MiniInput label="ID de referencia" placeholder="Código personalizado" width="50%" />
          </div>
        </MiniCard>

        <MiniCard style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Estructura organizacional</div>
          <div style={{ display: "flex", gap: 8 }}>
            <MiniInput label="Departamento*" placeholder="Área o sector" width="50%" />
            <MiniInput label="Puesto (opcional)" placeholder="Título del puesto" width="50%" />
          </div>
        </MiniCard>

        <MiniCard>
          <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Detalles de la vacante</div>
          <MiniInput label="Motivo de contratación" placeholder="Seleccionar" />
          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <MiniInput label="Fecha contratación" placeholder="DD/MM/AAAA" width="50%" />
            <MiniInput label="Fecha ingreso" placeholder="DD/MM/AAAA" width="50%" />
          </div>
        </MiniCard>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <MiniBtn label="Cancelar" />
        <MiniBtn label="Siguiente" primary />
      </div>
    </div>
  </div>
);

/* 3. Etapas del proceso */
const ScreenEtapas = () => (
  <div style={{ display: "flex", height: "100%" }}>
    <MiniSidebar items={["Configuración general", "Etapas del proceso", "Publicación", "Revisión"]} activeIndex={1} checkmarks={[0]} />
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Etapas del proceso</div>
        <div style={{ fontSize: 6, color: C.textSecondary, marginBottom: 8 }}>Establece el proceso de selección para este empleo.</div>

        {[
          { icon: "🔒", title: "Revisión de perfil", desc: "Evalúa la aplicación del candidato" },
        ].map((e, i) => (
          <MiniCard key={i} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9 }}>{e.icon}</span>
            <div>
              <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary }}>{e.title}</div>
              <div style={{ fontSize: 5.5, color: C.textSecondary }}>{e.desc}</div>
            </div>
          </MiniCard>
        ))}

        <div style={{ border: `1px dashed ${C.border}`, borderRadius: 6, padding: "6px", textAlign: "center", fontSize: 7, color: C.brand600, marginBottom: 6 }}>
          + Añadir etapa
        </div>

        {[
          { icon: "🔒", title: "Oferta", desc: "Comunica al candidato seleccionado" },
          { icon: "🔒", title: "Oferta aceptada", desc: "Confirma la aceptación y contrata" },
        ].map((e, i) => (
          <MiniCard key={i} style={{ marginBottom: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 9 }}>{e.icon}</span>
            <div>
              <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary }}>{e.title}</div>
              <div style={{ fontSize: 5.5, color: C.textSecondary }}>{e.desc}</div>
            </div>
          </MiniCard>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <MiniBtn label="Atrás" />
        <MiniBtn label="Siguiente" primary />
      </div>
    </div>
  </div>
);

/* 4. Publicación */
const ScreenPublicacion = () => (
  <div style={{ display: "flex", height: "100%" }}>
    <MiniSidebar items={["Configuración general", "Etapas del proceso", "Publicación", "Revisión"]} activeIndex={2} checkmarks={[0, 1]} />
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Publicación</div>
        <div style={{ fontSize: 6, color: C.textSecondary, marginBottom: 8 }}>Configura la publicación que verán los candidatos</div>

        <MiniCard style={{ marginBottom: 8 }}>
          <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 6 }}>Detalles de la publicación</div>
          <MiniInput label="Nombre público*" placeholder="Cajero (temporada de invierno)" />
          <div style={{ marginTop: 4 }}>
            <div style={{ fontSize: 6.5, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Descripción del empleo*</div>
            <div style={{ border: `1px solid ${C.border}`, borderRadius: 4, minHeight: 40, padding: 4 }}>
              <div style={{ display: "flex", gap: 4, borderBottom: `1px solid ${C.border}`, paddingBottom: 3, marginBottom: 3 }}>
                {["B", "I", "U", "S"].map((b) => (
                  <span key={b} style={{ fontSize: 6, fontWeight: 600, color: C.textSecondary, width: 12, textAlign: "center" }}>{b}</span>
                ))}
              </div>
              <div style={{ fontSize: 5.5, color: "#999" }}>Describí brevemente las responsabilidades...</div>
            </div>
          </div>
        </MiniCard>

        <MiniCard>
          <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 4 }}>Formulario de aplicación</div>
          {["Nombre y apellido → Obligatorio", "Número de celular → Obligatorio", "Email → Opcional", "CV → Opcional"].map((row, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 6, color: C.textSecondary, padding: "2px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>
              <span>{row.split("→")[0]}</span>
              <span style={{ fontSize: 5.5 }}>{row.split("→")[1]}</span>
            </div>
          ))}
        </MiniCard>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <MiniBtn label="Atrás" />
        <div style={{ display: "flex", gap: 4 }}>
          <MiniBtn label="Saltar paso" />
          <MiniBtn label="Siguiente" primary />
        </div>
      </div>
    </div>
  </div>
);

/* 5. Revisión */
const ScreenRevision = () => (
  <div style={{ display: "flex", height: "100%" }}>
    <MiniSidebar items={["Configuración general", "Etapas del proceso", "Publicación", "Revisión"]} activeIndex={3} checkmarks={[0, 1, 2]} />
    <div style={{ flex: 1, background: C.bg, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: "10px 14px" }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Revisión</div>
        <div style={{ fontSize: 6, color: C.textSecondary, marginBottom: 8 }}>Verifica que los datos sean correctos</div>

        {/* Accordion: Config general */}
        <MiniCard style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary }}>Configuración general</span>
            <span style={{ fontSize: 8, color: C.textSecondary }}>∧</span>
          </div>
          {[["Nombre interno", "Respuesta"], ["Departamento", "Respuesta"]].map(([k, v], i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 6, color: C.textSecondary, padding: "2px 0" }}>
              <span>{k}</span><span>{v}</span>
            </div>
          ))}
        </MiniCard>

        {/* Accordion: Etapas */}
        <MiniCard style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary }}>Etapas del proceso</span>
            <span style={{ fontSize: 8, color: C.textSecondary }}>∧</span>
          </div>
          {["Revisión de perfil", "Etapa personalizada", "Oferta", "Oferta aceptada"].map((e, i) => (
            <div key={i} style={{ fontSize: 6, color: C.textSecondary, padding: "2px 0", borderBottom: i < 3 ? `1px solid ${C.border}` : "none" }}>{e}</div>
          ))}
        </MiniCard>

        {/* Accordion: Publicación */}
        <MiniCard style={{ marginBottom: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <span style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary }}>Publicación</span>
            <span style={{ fontSize: 8, color: C.textSecondary }}>∧</span>
          </div>
          <GrayLine w="80%" /><GrayLine w="65%" /><GrayLine w="70%" />
        </MiniCard>

        {/* Warning */}
        <div style={{ background: C.yellowBg, borderLeft: `2px solid ${C.yellowWarning}`, borderRadius: 4, padding: "4px 8px", fontSize: 5.5, color: C.textSecondary }}>
          ⚠ Luego de abrir o publicar este empleo, no vas a poder editar su información.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 14px", borderTop: `1px solid ${C.border}`, background: C.white }}>
        <MiniBtn label="Atrás" />
        <div style={{ display: "flex", gap: 4 }}>
          <MiniBtn label="Abrir sin publicar" />
          <MiniBtn label="Publicar" primary />
        </div>
      </div>
    </div>
  </div>
);

/* 6. Empleo publicado */
const ScreenPublicado = ({ showSnackbar }: { showSnackbar?: boolean }) => (
  <div style={{ height: "100%", background: C.bg, display: "flex", flexDirection: "column", position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", borderBottom: `1px solid ${C.border}`, background: C.white }}>
      <span style={{ fontSize: 8, color: C.textSecondary }}>←</span>
      <span style={{ fontSize: 9, fontWeight: 600, color: C.textPrimary }}>Nombre empleo</span>
      <span style={{ fontSize: 6, padding: "1px 5px", borderRadius: 999, background: C.brand100, color: C.brand600, fontWeight: 600 }}>Publicado</span>
    </div>
    <div style={{ display: "flex", gap: 12, padding: "4px 12px", fontSize: 6, color: C.textSecondary, borderBottom: `1px solid ${C.border}`, background: C.white }}>
      <span>Departamento</span><span>Puesto</span><span>dd/mm/aaaa</span>
    </div>
    <div style={{ flex: 1, padding: "10px 14px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 600, color: C.textPrimary }}>Candidatos</span>
        <MiniBtn label="Añadir candidato" primary />
      </div>
      {/* Tabs/Chips */}
      <div style={{ display: "flex", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
        {["✓ Activos (0)", "Revisión de perfil (0)", "Entrevista (0)", "Oferta (0)", "Oferta aceptada (0)"].map((t, i) => (
          <span key={i} style={{
            fontSize: 5.5, padding: "2px 6px", borderRadius: 999,
            border: `1px solid ${i === 0 ? C.brand600 : C.border}`,
            color: i === 0 ? C.brand600 : C.textSecondary,
            background: i === 0 ? C.brand100 : C.white,
          }}>{t}</span>
        ))}
        <span style={{ width: 8 }} />
        {["Contratados (0)", "Rechazados (0)"].map((t, i) => (
          <span key={i} style={{ fontSize: 5.5, padding: "2px 6px", borderRadius: 999, border: `1px solid ${C.border}`, color: C.textSecondary, background: C.white }}>{t}</span>
        ))}
      </div>
      {/* Empty state */}
      <MiniCard style={{ textAlign: "center", padding: "20px 10px" }}>
        <div style={{ fontSize: 12, marginBottom: 4 }}>ⓘ</div>
        <div style={{ fontSize: 7, fontWeight: 600, color: C.textPrimary, marginBottom: 2 }}>Aún no tienes candidatos</div>
        <div style={{ fontSize: 6, color: C.textSecondary }}>Cuando recibas postulaciones, aparecerán aquí.</div>
      </MiniCard>
    </div>
    {/* Success snackbar */}
    {showSnackbar && (
      <div style={{
        position: "absolute", bottom: 10, left: "50%", transform: "translateX(-50%)",
        background: "#1B1B1B", color: C.white, borderRadius: 6, padding: "5px 12px",
        display: "flex", alignItems: "center", gap: 6, fontSize: 7, fontWeight: 600,
        boxShadow: C.shadow8dp,
        animation: "slideUp 0.4s ease-out",
      }}>
        <span style={{ color: C.greenSuccess, fontSize: 10 }}>✓</span>
        Empleo publicado
        <span style={{ color: "#888", cursor: "pointer", fontSize: 8 }}>✕</span>
      </div>
    )}
  </div>
);

/* ── MAIN ANIMATION COMPONENT ── */
const SCREENS = [
  { id: "empleos", label: "Lista de empleos" },
  { id: "config", label: "Configuración general" },
  { id: "etapas", label: "Etapas del proceso" },
  { id: "publicacion", label: "Publicación" },
  { id: "revision", label: "Revisión" },
  { id: "publicado", label: "Empleo publicado" },
];

const FLOW = [
  { screen: 0, cursor: { x: 380, y: 72 }, duration: 1800, label: "Click: + Nuevo empleo" },
  { screen: 1, cursor: { x: 220, y: 120 }, duration: 1200, label: "Completar formulario" },
  { screen: 1, cursor: { x: 220, y: 120 }, duration: 800, typing: true, label: "Escribiendo nombre..." },
  { screen: 1, cursor: { x: 380, y: 338 }, duration: 1000, label: "Click: Siguiente" },
  { screen: 2, cursor: { x: 250, y: 180 }, duration: 1500, label: "Revisar etapas" },
  { screen: 2, cursor: { x: 380, y: 330 }, duration: 1000, label: "Click: Siguiente" },
  { screen: 3, cursor: { x: 250, y: 140 }, duration: 1500, label: "Configurar publicación" },
  { screen: 3, cursor: { x: 400, y: 350 }, duration: 1000, label: "Click: Siguiente" },
  { screen: 4, cursor: { x: 270, y: 150 }, duration: 1500, label: "Revisar todo" },
  { screen: 4, cursor: { x: 400, y: 350 }, duration: 1200, label: "Click: Publicar" },
  { screen: 5, cursor: { x: 270, y: 260 }, duration: 2500, snackbar: true, label: "¡Empleo publicado!" },
];

export default function RecruitingFlowAnimation() {
  const [stepIdx, setStepIdx] = useState(0);
  const [clicking, setClicking] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const step = FLOW[stepIdx % FLOW.length];

  const advanceStep = useCallback(() => {
    const nextIdx = (stepIdx + 1) % FLOW.length;
    const currentScreen = FLOW[stepIdx % FLOW.length].screen;
    const nextScreen = FLOW[nextIdx].screen;

    if (currentScreen !== nextScreen) {
      setClicking(true);
      setTimeout(() => setClicking(false), 200);
      setTimeout(() => {
        setTransitioning(true);
        setTimeout(() => {
          setStepIdx(nextIdx);
          setTransitioning(false);
        }, 300);
      }, 300);
    } else {
      setStepIdx(nextIdx);
    }
  }, [stepIdx]);

  useEffect(() => {
    timeoutRef.current = setTimeout(advanceStep, step.duration);
    return () => clearTimeout(timeoutRef.current);
  }, [stepIdx, advanceStep]);

  const renderScreen = () => {
    switch (step.screen) {
      case 0: return <ScreenEmpleos />;
      case 1: return <ScreenConfigGeneral typing={step.typing} />;
      case 2: return <ScreenEtapas />;
      case 3: return <ScreenPublicacion />;
      case 4: return <ScreenRevision />;
      case 5: return <ScreenPublicado showSnackbar={step.snackbar} />;
      default: return null;
    }
  };

  /* Progress dots */
  const currentScreenIdx = step.screen;

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      fontFamily: "'Roboto', sans-serif", letterSpacing: 0.2, position: "relative", overflow: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes slideUp { from { opacity: 0; transform: translateX(-50%) translateY(10px); } to { opacity: 1; transform: translateX(-50%) translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }
      `}</style>

      {/* Sparkles */}
      <Sparkle x="8%" y="12%" delay={300} />
      <Sparkle x="88%" y="8%" delay={600} size={12} />
      <Sparkle x="5%" y="75%" delay={900} size={14} />
      <Sparkle x="92%" y="70%" delay={1200} />
      <Sparkle x="15%" y="45%" delay={500} size={10} />
      <Sparkle x="85%" y="45%" delay={800} size={10} />

      {/* Screen container with phone-like frame */}
      <div style={{
        width: 500, height: 420,
        borderRadius: 12, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.1)",
        position: "relative",
        background: C.white,
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "scale(0.96) translateY(4px)" : "scale(1) translateY(0)",
        transition: "opacity 0.3s, transform 0.3s",
      }}>
        {/* Top header bar */}
        <MiniHeader
          title={step.screen === 0 ? "humand" : (step.screen === 5 ? "" : "Nuevo empleo")}
          badge={step.screen >= 1 && step.screen <= 4 ? { text: "Borrador", bg: "#F0F0F0", color: C.textSecondary } : (step.screen === 5 ? { text: "Publicado", bg: C.brand100, color: C.brand600 } : null)}
          rightBtn={
            step.screen >= 1 && step.screen <= 4
              ? <span style={{ fontSize: 7, color: C.textSecondary }}>Guardado ✕</span>
              : (step.screen === 0 ? <span style={{ fontSize: 7, color: C.textSecondary }}>Admin</span> : null)
          }
        />
        {/* Screen content */}
        <div style={{ height: 390, overflow: "hidden" }}>
          {renderScreen()}
        </div>

        {/* Cursor */}
        <Cursor x={step.cursor.x} y={step.cursor.y} clicking={clicking} />
      </div>

      {/* Progress stepper */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 20, zIndex: 10 }}>
        {SCREENS.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              opacity: currentScreenIdx === i ? 1 : 0.5,
              transition: "opacity 0.4s",
            }}>
              <div style={{
                width: currentScreenIdx === i ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: currentScreenIdx === i ? C.white : "rgba(255,255,255,0.4)",
                transition: "all 0.4s cubic-bezier(0.4,0,0.2,1)",
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* Current step label */}
      <div style={{
        color: C.white, fontSize: 11, marginTop: 10, fontWeight: 400,
        opacity: 0.85, zIndex: 10, transition: "all 0.3s",
        letterSpacing: 0.2,
      }}>
        {SCREENS[currentScreenIdx].label}
      </div>
    </div>
  );
}
