const codeColumns = [
  "0101 OMNISIM TRUE RISK PATH FUTURE",
  "AI 3910 HUMAN VAR MODEL TRUST SIGNAL",
  "0110 REACT MARKET LOVE HEALTH LEGACY",
  "FUTURE PATH SIMULATION ACTIVE 4729",
  "TRUTH CHECKPOINT AGENT MEMORY LOOP",
  "PHONE REACH SIGNAL PROFIT RESILIENCE",
  "0101 OMNISIM HUMAN RESPONSE MODEL",
  "RISK FIELD TRUST MONEY TIME SAFETY",
  "AI 3910 FUTURE PATH TRUE FALSE",
  "MODEL ACTIVE HEALTH LOVE MARKET POLICY",
  "0110 SIGNAL AGENT OUTCOME VECTOR",
  "SIMULATE BEFORE IT HAPPENS 0101",
];

export default function SimWorldBackground() {
  return (
    <div className="sim-world" aria-hidden="true">
      <div className="sim-world__curtain">
        {codeColumns.map((text, index) => (
          <span key={index} style={{ left: `${index * 8.8}%` }}>
            {text}
          </span>
        ))}
      </div>
      <div className="sim-world__horizon" />
      <div className="sim-world__floor" />
      <div className="sim-world__wire sim-world__wire--one" />
      <div className="sim-world__wire sim-world__wire--two" />
      <div className="sim-world__beams" />
    </div>
  );
}