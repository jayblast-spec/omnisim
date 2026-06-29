const codeColumns = [
  "010101001101OMNISIMFUTUREPATH",
  "AI3910TRUTHCHECKRISKMODEL0110",
  "HUMANVARIABLE4729SIGNALLOOP",
  "SIMULATIONACTIVE0101OUTCOME",
  "MARKETLOVEHEALTHLEGACYPOLICY",
  "AGENTMEMORYRISKPATHTRUEFALSE",
  "PHONEVECTORPROFITRESILIENCE",
  "TRUSTMONEYTIMEFAMILYSIGNAL",
  "OMNISIMFUTUREPATH01010100",
  "HUMANRESPONSEMODEL39100110",
  "VECTORFIELDTRUTHCHECKPOINT",
  "BEFOREITHAPPENS0101ACTIVE",
  "RELATIONSHIPMARKETHEALTHPOLICY",
  "RISKSAFETYTRUSTPATH4729AI",
  "FUTUREMODELAGENTLOOP0101",
  "OMNISIMACTIVEHUMANVARIABLE",
];

export default function SimWorldBackground() {
  return (
    <div className="sim-world" aria-hidden="true">
      <div className="sim-world__curtain">
        {codeColumns.map((text, index) => (
          <span key={index} style={{ left: `${index * 6.55}%` }}>
            {text}
          </span>
        ))}
      </div>
      <div className="sim-world__mountains" />
      <div className="sim-world__horizon" />
      <div className="sim-world__floor" />
      <div className="sim-world__glow" />
    </div>
  );
}