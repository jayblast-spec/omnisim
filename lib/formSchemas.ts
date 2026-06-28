export type FieldType = "text" | "textarea" | "select" | "multiselect" | "date" | "number" | "radio";

export interface FormField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  options?: string[];
  hint?: string;
}

export interface FormSection {
  title: string;
  subtitle?: string;
  fields: FormField[];
}

export interface FormSchema {
  type: string;
  title: string;
  description: string;
  icon: string;
  sections: FormSection[];
}

export const publicReactionSchema: FormSchema = {
  type: "public-reaction",
  title: "Public Reaction Simulation",
  description: "Simulate how the world will react to a person, brand, or organization before you publish anything.",
  icon: "📡",
  sections: [
    {
      title: "THE SUBJECT",
      subtitle: "Who or what is being put to the test?",
      fields: [
        { id: "subjectName", label: "Subject Name", type: "text", required: true, placeholder: "e.g. Elon Musk, Nike, OpenAI, Senator Jane Smith", hint: "The person, brand, or organization at the center of this simulation" },
        { id: "subjectType", label: "Subject Type", type: "select", required: true, options: ["Individual (Celebrity / Public Figure)", "Individual (Politician)", "Corporation (Global)", "Corporation (SMB)", "Government / Institution", "Sports Team / Athlete", "Media Organization", "NGO / Non-Profit", "AI Company / Tech", "Other"] },
        { id: "industry", label: "Industry / Sector", type: "select", required: true, options: ["Technology", "Finance / Banking", "Entertainment", "Sports", "Politics / Government", "Healthcare", "Retail / Consumer", "Media / Journalism", "Military / Defense", "Energy", "Fashion / Lifestyle", "Food & Beverage", "Real Estate", "Education", "Other"] },
        { id: "currentPerception", label: "Current Public Perception", type: "select", required: true, options: ["Very Positive — loved, celebrated", "Positive — generally well-regarded", "Neutral — largely unknown or uncontroversial", "Mixed — polarizing figure", "Negative — under criticism", "Very Negative — under major attack"] },
        { id: "subjectReach", label: "Audience Reach / Influence", type: "select", required: true, options: ["Global icon (1B+ impressions)", "Major national figure (100M+)", "Regional influencer (10M–100M)", "Niche influencer (1M–10M)", "Emerging / Local (under 1M)"] },
      ],
    },
    {
      title: "THE INCIDENT",
      subtitle: "What happened — or is about to happen?",
      fields: [
        { id: "eventDescription", label: "Describe the Event / Statement / Action", type: "textarea", required: true, rows: 5, placeholder: "Describe exactly what happened, what was said, what was announced, or what you are about to release. Be specific — the more detail, the more accurate the simulation.", hint: "Include exact words, actions, or decisions. Treat this like a legal brief." },
        { id: "incidentType", label: "Type of Incident", type: "select", required: true, options: ["Public Statement / Tweet / Post", "Product Announcement", "Leaked Information", "Scandal / Misconduct", "Corporate Decision (Layoffs, Mergers, etc.)", "Policy Change", "Celebrity Controversy", "Legal Charge / Arrest", "Financial Revelation", "Environmental / Ethical Breach", "Partnership / Endorsement", "Award / Achievement", "Other"] },
        { id: "incidentDate", label: "Event Date / Planned Release Date", type: "date", required: false, hint: "When did this happen or when do you plan to release this?" },
        { id: "revelationMethod", label: "How Will This Be Revealed?", type: "select", required: true, options: ["Press release", "Social media post", "News article / investigative report", "Live speech / event", "Leaked internally", "Leaked by press", "Court filing", "Annual report / financial disclosure", "Not yet decided"] },
        { id: "mediaCoverage", label: "Expected Media Coverage", type: "select", required: true, options: ["Breaking news / top story globally", "Major national coverage", "Industry-specific press only", "Social media first, then press", "Minimal — small story", "Unknown at this stage"] },
      ],
    },
    {
      title: "BACKGROUND & CONTEXT",
      subtitle: "Give the AI full context to simulate accurately",
      fields: [
        { id: "backgroundContext", label: "Background / History / Context", type: "textarea", required: true, rows: 5, placeholder: "What is the history behind this? What has this person or organization done before that is relevant? What is the public mood right now?", hint: "The AI uses this to calibrate agent reactions. More context = more accurate prediction." },
        { id: "patternStatus", label: "Is This Part of a Pattern?", type: "select", required: true, options: ["First-time incident — no prior pattern", "Second occurrence — possible pattern emerging", "Repeated behavior — clear pattern established", "Contradicts previous behavior — surprise factor", "Consistent with their known persona"] },
        { id: "comparison", label: "Similar Past Events for Reference", type: "textarea", required: false, rows: 3, placeholder: "Optional: Name similar incidents from history. e.g. 'Similar to United Airlines dragging a passenger (2017)'" },
        { id: "plannedResponse", label: "Planned Crisis Response (if any)", type: "select", required: false, options: ["Full public apology", "Partial apology with justification", "Denial — claim it is false", "No comment at this time", "Legal action against accusers", "Deflect / attack opposition", "Silent — no response planned", "Not yet decided"] },
      ],
    },
    {
      title: "SIMULATION PARAMETERS",
      subtitle: "Define who and where you want to simulate",
      fields: [
        { id: "targetRegions", label: "Target Regions to Simulate", type: "multiselect", required: true, options: ["North America", "Europe", "Sub-Saharan Africa", "Middle East / North Africa", "South Asia", "East Asia", "Southeast Asia", "Latin America", "Oceania", "Global (all regions)"], hint: "Select all regions where you want to measure reaction" },
        { id: "targetDemographics", label: "Target Demographics", type: "multiselect", required: true, options: ["Gen Z (18–25)", "Millennials (26–40)", "Gen X (41–55)", "Baby Boomers (56+)", "Working class", "Middle class", "Upper class", "Political left", "Political right", "Business community", "Academic / intellectual", "Religious communities"] },
        { id: "primaryQuestion", label: "Primary Simulation Question", type: "select", required: true, options: ["How will the public react emotionally?", "Will this damage or help the brand/reputation?", "Will there be boycotts or cancellations?", "How will different political groups respond?", "What will the media narrative be?", "Will this go viral — positive or negative?", "What is the long-term reputational impact?"] },
        { id: "timeframe", label: "Simulation Timeframe", type: "select", required: true, options: ["First 24 hours", "First 72 hours (3 days)", "First week", "First month", "6-month arc", "Long-term (12+ months)"] },
      ],
    },
    {
      title: "ADDITIONAL INTELLIGENCE",
      subtitle: "Optional — adds precision to agent reactions",
      fields: [
        { id: "mediaAllies", label: "Known Media Allies / Supporters", type: "textarea", required: false, rows: 2, placeholder: "e.g. Fox News, MSNBC, specific influencers or publications that are sympathetic" },
        { id: "mediaAdversaries", label: "Known Media Adversaries", type: "textarea", required: false, rows: 2, placeholder: "e.g. The Guardian, CNN, specific critics or opposition voices" },
        { id: "additionalNotes", label: "Anything Else the AI Should Know", type: "textarea", required: false, rows: 3, placeholder: "Any additional context, sensitivities, key stakeholders, internal concerns, or specific angles to explore" },
      ],
    },
  ],
};

export const electionSchema: FormSchema = {
  type: "election",
  title: "Election Outcome Simulation",
  description: "Predict election results, voter behavior, and swing dynamics before a single ballot is cast.",
  icon: "🗳️",
  sections: [
    {
      title: "THE ELECTION",
      subtitle: "Define the race being simulated",
      fields: [
        { id: "electionName", label: "Election Name", type: "text", required: true, placeholder: "e.g. 2024 US Presidential Election, UK General Election 2025, Lagos Governorship 2027" },
        { id: "electionType", label: "Type of Election", type: "select", required: true, options: ["Presidential", "Parliamentary / Legislative", "Gubernatorial / State", "Local / Municipal", "Referendum / Ballot Measure", "Party Primary", "Other"] },
        { id: "country", label: "Country / Region", type: "text", required: true, placeholder: "e.g. United States, United Kingdom, Nigeria, France" },
        { id: "electionDate", label: "Election Date", type: "date", required: false },
        { id: "electionSystem", label: "Electoral System", type: "select", required: true, options: ["First Past the Post (winner-takes-all)", "Proportional Representation", "Two-Round System (Runoff)", "Electoral College", "Mixed System", "Ranked Choice Voting", "Other"] },
      ],
    },
    {
      title: "THE CANDIDATES",
      subtitle: "Who is running and what do they represent?",
      fields: [
        { id: "candidates", label: "List All Candidates / Parties", type: "textarea", required: true, rows: 4, placeholder: "List all major candidates or parties. Include their name, party, ideology, and key position. One per line." },
        { id: "leadingCandidate", label: "Currently Leading Candidate / Party", type: "text", required: true, placeholder: "Who is currently ahead in polls or perception?" },
        { id: "trailingCandidate", label: "Currently Trailing Candidate / Party", type: "text", required: true, placeholder: "Who is behind? What is their gap?" },
        { id: "wildCardCandidate", label: "Wild Card / Third Party (if any)", type: "text", required: false, placeholder: "Any independent or minor party that could affect the outcome?" },
        { id: "incumbentStatus", label: "Incumbent Running?", type: "select", required: true, options: ["Yes — incumbent is running for re-election", "No — open seat, no incumbent", "Incumbent is term-limited", "Incumbent party but different candidate"] },
      ],
    },
    {
      title: "THE ISSUES",
      subtitle: "What is this election really about?",
      fields: [
        { id: "majorIssues", label: "Major Issues in This Election", type: "multiselect", required: true, options: ["Economy / Cost of living", "Immigration", "Healthcare", "Crime / Public safety", "Climate / Environment", "Education", "Corruption / Governance", "Foreign policy / War", "Jobs / Unemployment", "Housing", "Religious / Cultural values", "Race / Identity politics"] },
        { id: "politicalClimate", label: "Current Political Climate", type: "select", required: true, options: ["Highly polarized — deeply divided electorate", "Moderate — center holds", "Populist surge — anti-establishment mood", "Nationalist wave", "Progressive momentum", "Voter apathy / low engagement", "Post-crisis / recovery mood"] },
        { id: "mediaLandscape", label: "Media Landscape", type: "select", required: true, options: ["Balanced and independent", "Skewed toward incumbent", "Skewed toward opposition", "Fragmented — each side has its own media", "State-controlled", "Social media dominant"] },
        { id: "currentPolling", label: "Current Polling Numbers", type: "textarea", required: false, rows: 3, placeholder: "e.g. Candidate A: 48%, Candidate B: 42%, Undecided: 10%. Include margin of error if known." },
      ],
    },
    {
      title: "VOTER DYNAMICS",
      subtitle: "Who votes, how, and why",
      fields: [
        { id: "voterDemographics", label: "Key Voter Blocs", type: "multiselect", required: true, options: ["Urban voters", "Rural voters", "Suburban swing voters", "Young voters (18–30)", "Senior voters (60+)", "Women", "Ethnic minorities", "Working class whites", "College-educated", "Evangelical / religious", "Union members", "Business owners"] },
        { id: "turnoutExpectation", label: "Expected Voter Turnout", type: "select", required: true, options: ["Very high (80%+)", "High (65–80%)", "Average (50–65%)", "Low (35–50%)", "Very low (under 35%)"] },
        { id: "keySwingGroups", label: "Key Swing Groups That Could Decide This", type: "textarea", required: true, rows: 3, placeholder: "Which demographic or geographic groups are undecided or persuadable? What would move them?" },
        { id: "foreignInterference", label: "External Interference Risk", type: "select", required: false, options: ["High — confirmed foreign interference attempts", "Medium — suspected interference", "Low — minimal external concern", "None identified"] },
      ],
    },
    {
      title: "ADDITIONAL FACTORS",
      subtitle: "Historical context and wild cards",
      fields: [
        { id: "historicalContext", label: "Historical Electoral Context", type: "textarea", required: false, rows: 3, placeholder: "How has this region voted historically? What patterns exist? Any realignment signals?" },
        { id: "scandals", label: "Active Scandals / Controversies", type: "textarea", required: false, rows: 3, placeholder: "Any pending investigations, controversies, or October surprises that could shift votes?" },
        { id: "economicConditions", label: "Economic Conditions at Time of Vote", type: "select", required: true, options: ["Strong growth, low unemployment", "Moderate growth, stable", "Stagnant, concern rising", "Recession / contraction", "High inflation, cost-of-living crisis", "Economic recovery underway"] },
        { id: "additionalNotes", label: "Anything Else the AI Should Factor In", type: "textarea", required: false, rows: 3, placeholder: "Any specific local dynamics, endorsements, or factors not covered above" },
      ],
    },
  ],
};

export const marketsSchema: FormSchema = {
  type: "markets",
  title: "Market Movement Simulation",
  description: "Simulate how markets, assets, and investor sentiment respond to events before they move.",
  icon: "📈",
  sections: [
    {
      title: "THE SCENARIO",
      subtitle: "What market event are you simulating?",
      fields: [
        { id: "marketScenario", label: "Scenario Title", type: "text", required: true, placeholder: "e.g. Federal Reserve surprise rate hike, China invades Taiwan, Apple launches AI chip" },
        { id: "assetClass", label: "Asset Classes Affected", type: "multiselect", required: true, options: ["US Equities", "Global Equities", "Cryptocurrencies", "US Bonds / Treasuries", "Commodities (Oil, Gold, etc.)", "Real Estate / REITs", "Forex / Currency pairs", "Emerging Market assets", "Tech / Growth stocks", "Energy stocks", "Financial sector"] },
        { id: "specificAssets", label: "Specific Assets / Tickers", type: "textarea", required: false, rows: 2, placeholder: "e.g. BTC, ETH, AAPL, NVDA, S&P 500, EUR/USD, Gold spot, WTI Crude" },
        { id: "triggerEvent", label: "The Trigger Event", type: "textarea", required: true, rows: 4, placeholder: "Describe exactly what the triggering event is. What happened, who announced it, when, and how it was revealed. Be specific about the nature of the surprise or confirmation." },
        { id: "eventDate", label: "Event Date / Expected Date", type: "date", required: false },
      ],
    },
    {
      title: "CURRENT MARKET CONDITIONS",
      subtitle: "Where are markets right now?",
      fields: [
        { id: "currentMarketState", label: "Current Market State", type: "select", required: true, options: ["Bull market — strong uptrend", "Bear market — sustained downtrend", "Sideways / consolidation", "Near all-time highs", "Post-crash recovery", "Elevated volatility (VIX high)", "Low volatility, complacent"] },
        { id: "priceLevel", label: "Key Price Levels / Context", type: "textarea", required: false, rows: 2, placeholder: "e.g. S&P at 5,200, BTC at $95,000, Gold at $2,400/oz, 10Y yield at 4.5%" },
        { id: "marketTrend", label: "Recent Market Trend (30 days)", type: "select", required: true, options: ["Strong uptrend (+10% or more)", "Moderate uptrend (+3–10%)", "Flat (-3% to +3%)", "Moderate downtrend (-3–10%)", "Strong downtrend (-10% or more)"] },
      ],
    },
    {
      title: "MACRO CONTEXT",
      subtitle: "The economic backdrop",
      fields: [
        { id: "economicContext", label: "Economic Environment", type: "select", required: true, options: ["Strong growth, soft landing achieved", "Moderate growth, balanced", "Slowing growth, recession fears", "Active recession", "Stagflation (high inflation + slow growth)", "Recovery phase"] },
        { id: "centralBankStance", label: "Central Bank Stance", type: "select", required: true, options: ["Actively hiking rates", "Pausing — rates on hold", "Actively cutting rates", "Emergency easing mode", "Quantitative tightening (QT)", "Quantitative easing (QE)"] },
        { id: "inflationRate", label: "Current Inflation Rate", type: "select", required: true, options: ["Under 2% (below target)", "2–3% (on target)", "3–5% (above target)", "5–8% (high)", "8%+ (very high / crisis)"] },
        { id: "geopoliticalFactors", label: "Active Geopolitical Risks", type: "textarea", required: false, rows: 2, placeholder: "e.g. Russia-Ukraine conflict, US-China trade war, Middle East tensions, election uncertainty" },
      ],
    },
    {
      title: "INVESTOR SENTIMENT",
      subtitle: "Who is positioned how?",
      fields: [
        { id: "investorSentiment", label: "Current Investor Sentiment", type: "select", required: true, options: ["Extreme greed — FOMO driven", "Greed — risk-on", "Neutral", "Fear — risk-off", "Extreme fear — panic selling"] },
        { id: "institutionalPositioning", label: "Institutional Positioning", type: "select", required: false, options: ["Heavily long / overweight", "Slightly long", "Neutral / balanced", "Slightly short / hedged", "Heavily short / defensive", "Unknown"] },
        { id: "retailSentiment", label: "Retail / Crypto Community Sentiment", type: "select", required: false, options: ["Extremely bullish", "Bullish", "Neutral", "Bearish", "Panic / selling"] },
        { id: "timeframe", label: "Simulation Timeframe", type: "select", required: true, options: ["Immediate reaction (minutes to hours)", "Short-term (1–7 days)", "Medium-term (1–4 weeks)", "Long-term (1–6 months)"] },
        { id: "outcomeQuestion", label: "What Outcome Are You Predicting?", type: "select", required: true, options: ["Direction of price movement", "Magnitude of move (%)", "How quickly markets recover", "Which assets move most", "Whether a crash or rally occurs", "How different investor types react"] },
      ],
    },
    {
      title: "ADDITIONAL CONTEXT",
      subtitle: "Help the AI simulate more accurately",
      fields: [
        { id: "historicalPrecedent", label: "Historical Comparisons", type: "textarea", required: false, rows: 3, placeholder: "e.g. 'Similar to the 2020 COVID crash' or 'Like the 2018 rate hike surprise that tanked markets 20%'" },
        { id: "additionalNotes", label: "Other Key Details", type: "textarea", required: false, rows: 3, placeholder: "Upcoming earnings, expiry dates, regulatory decisions, or any market-specific factors" },
      ],
    },
  ],
};

export const sportsSchema: FormSchema = {
  type: "sports",
  title: "Sports Match Simulation",
  description: "Run probabilistic simulations of match outcomes accounting for form, injuries, tactics, and crowd dynamics.",
  icon: "⚽",
  sections: [
    {
      title: "THE EVENT",
      subtitle: "Define the match or competition",
      fields: [
        { id: "eventName", label: "Match / Event Name", type: "text", required: true, placeholder: "e.g. Champions League Final 2025, NBA Game 7, Super Bowl LX, Wimbledon Men's Final" },
        { id: "sport", label: "Sport", type: "select", required: true, options: ["Football (Soccer)", "American Football (NFL)", "Basketball (NBA)", "Cricket", "Tennis", "Rugby", "Boxing / MMA", "Formula 1", "Baseball (MLB)", "Hockey (NHL)", "Athletics / Track", "Other"] },
        { id: "eventDate", label: "Match Date", type: "date", required: false },
        { id: "venue", label: "Venue / Location", type: "text", required: false, placeholder: "e.g. Wembley Stadium, London / Madison Square Garden, NYC" },
        { id: "competition", label: "Competition / Tournament Stage", type: "select", required: true, options: ["Final", "Semi-Final", "Quarter-Final", "Group Stage / Regular Season", "Play-off / Elimination game", "Derby / Rivalry match", "International / World Cup", "Friendly / Exhibition"] },
      ],
    },
    {
      title: "TEAM A / PLAYER A",
      subtitle: "First competitor profile",
      fields: [
        { id: "teamA", label: "Team A / Player A Name", type: "text", required: true, placeholder: "e.g. Real Madrid, Kansas City Chiefs, Novak Djokovic" },
        { id: "teamAForm", label: "Team A Recent Form", type: "select", required: true, options: ["Exceptional — winning streak, high confidence", "Good — mostly wins, solid momentum", "Average — inconsistent results", "Poor — recent losses, low morale", "Very poor — crisis mode"] },
        { id: "teamARecord", label: "Team A Season Record / Ranking", type: "text", required: false, placeholder: "e.g. W22 D5 L3, #1 seed, World Rank 2" },
        { id: "teamAKeyPlayers", label: "Team A Key Players / Stars", type: "textarea", required: false, rows: 2, placeholder: "List star players, their form, and any who are injury doubts" },
        { id: "teamAStrengths", label: "Team A Tactical Strengths", type: "textarea", required: false, rows: 2, placeholder: "e.g. High press, counter-attack specialist, dominant in the air, fast break offense" },
      ],
    },
    {
      title: "TEAM B / PLAYER B",
      subtitle: "Second competitor profile",
      fields: [
        { id: "teamB", label: "Team B / Player B Name", type: "text", required: true, placeholder: "e.g. Barcelona, San Francisco 49ers, Carlos Alcaraz" },
        { id: "teamBForm", label: "Team B Recent Form", type: "select", required: true, options: ["Exceptional — winning streak, high confidence", "Good — mostly wins, solid momentum", "Average — inconsistent results", "Poor — recent losses, low morale", "Very poor — crisis mode"] },
        { id: "teamBRecord", label: "Team B Season Record / Ranking", type: "text", required: false, placeholder: "e.g. W18 D7 L5, #3 seed, World Rank 1" },
        { id: "teamBKeyPlayers", label: "Team B Key Players / Stars", type: "textarea", required: false, rows: 2, placeholder: "List star players, their form, and any injury doubts" },
        { id: "teamBStrengths", label: "Team B Tactical Strengths", type: "textarea", required: false, rows: 2, placeholder: "e.g. Possession-based, set piece specialist, physical dominance, defensive solidity" },
      ],
    },
    {
      title: "MATCH INTELLIGENCE",
      subtitle: "Everything that could determine the outcome",
      fields: [
        { id: "headToHead", label: "Head-to-Head History", type: "textarea", required: false, rows: 3, placeholder: "Recent meetings: who won, scores, patterns. e.g. 'Last 5: A won 3, B won 1, drew 1. A always wins on neutral ground.'" },
        { id: "currentOdds", label: "Current Betting Odds / Probability", type: "text", required: false, placeholder: "e.g. Team A: 2.10, Draw: 3.40, Team B: 3.50 / Win probability A: 55%, B: 30%, Draw: 15%" },
        { id: "homeAdvantage", label: "Home Advantage", type: "select", required: true, options: ["Team A is at home (strong home record)", "Team A is at home (neutral home record)", "Team B is at home (strong home record)", "Team B is at home (neutral home record)", "Neutral venue", "Neutral venue but Team A has more fans present"] },
        { id: "injuries", label: "Injuries / Suspensions / Absences", type: "textarea", required: false, rows: 3, placeholder: "Any key players missing? Who is rated doubtful? Which positions are affected?" },
        { id: "weather", label: "Weather / Playing Conditions", type: "select", required: false, options: ["Perfect conditions — dry, firm pitch", "Hot and humid", "Cold and windy", "Rain / wet pitch", "Extreme heat", "Indoor / controlled environment", "Unknown"] },
      ],
    },
    {
      title: "DEEPER FACTORS",
      subtitle: "The intangibles that tip outcomes",
      fields: [
        { id: "pressureLevel", label: "Pressure Level for Each Team", type: "textarea", required: false, rows: 2, placeholder: "Who needs this win more? Which team has more at stake? Manager under pressure?" },
        { id: "crowdFactor", label: "Crowd / Fan Factor", type: "select", required: false, options: ["Hostile crowd — heavily against visiting team", "Strongly favors Team A", "Strongly favors Team B", "Split crowd", "Neutral / empty stadium", "N/A (individual sport)"] },
        { id: "additionalNotes", label: "Any Other Factors", type: "textarea", required: false, rows: 3, placeholder: "Derby rivalry history, managerial tactics, travel fatigue, fixture congestion, doping concerns, VAR patterns, etc." },
      ],
    },
  ],
};

export const policySchema: FormSchema = {
  type: "policy",
  title: "Policy Impact Simulation",
  description: "Measure public and political reaction to laws and regulations before implementation.",
  icon: "📜",
  sections: [
    {
      title: "THE POLICY",
      subtitle: "What is being proposed or enacted?",
      fields: [
        { id: "policyName", label: "Policy / Law Name", type: "text", required: true, placeholder: "e.g. Universal Basic Income Act, Carbon Tax Bill, National ID Card Mandate, Crypto Regulation Framework" },
        { id: "policyType", label: "Type of Policy", type: "select", required: true, options: ["Economic / Fiscal policy", "Social policy (healthcare, education, welfare)", "Environmental / Climate policy", "Security / Defense policy", "Immigration policy", "Tax policy", "Technology / AI regulation", "Criminal justice reform", "Trade / Economic sanctions", "Constitutional / Electoral reform", "Public health mandate", "Other"] },
        { id: "issuingBody", label: "Who is Issuing This Policy?", type: "text", required: true, placeholder: "e.g. US Congress, UK Parliament, Nigerian Presidency, EU Commission, State Governor" },
        { id: "effectiveDate", label: "Effective Date / Implementation Timeline", type: "date", required: false },
        { id: "jurisdiction", label: "Jurisdiction / Scope", type: "select", required: true, options: ["National — affects entire country", "State / Regional", "Municipal / Local", "International / Multilateral", "Industry-specific", "Pilot / experimental program"] },
      ],
    },
    {
      title: "POLICY CONTENT",
      subtitle: "What does it actually do?",
      fields: [
        { id: "policyDescription", label: "Full Policy Description", type: "textarea", required: true, rows: 5, placeholder: "Describe the policy in detail. What does it mandate? What does it change? Who is affected? What are the penalties or incentives? What is the stated goal?" },
        { id: "keyProvisions", label: "Key Provisions / Main Points", type: "textarea", required: true, rows: 3, placeholder: "List the 3-5 most significant provisions. e.g. 'Citizens over 18 receive $1,000/month; funded by 5% wealth tax; replaces food stamps'" },
        { id: "affectedSectors", label: "Sectors Most Affected", type: "multiselect", required: true, options: ["General public / citizens", "Low-income households", "Small businesses", "Large corporations", "Farmers / agriculture", "Tech industry", "Financial sector", "Healthcare workers", "Immigrants / foreign nationals", "Youth / students", "Elderly / retirees", "Military / veterans"] },
        { id: "estimatedBudget", label: "Estimated Cost / Budget Impact", type: "text", required: false, placeholder: "e.g. $2.3 trillion over 10 years, $500M annual cost, revenue neutral" },
      ],
    },
    {
      title: "POLITICAL LANDSCAPE",
      subtitle: "The battle lines around this policy",
      fields: [
        { id: "politicalContext", label: "Political Context", type: "textarea", required: true, rows: 3, placeholder: "What is the political environment? Is this government popular? Is this policy driven by election promises, crisis response, or ideology?" },
        { id: "opposition", label: "Key Opposition Arguments", type: "textarea", required: true, rows: 3, placeholder: "What are the strongest arguments against this policy? Who leads the opposition?" },
        { id: "support", label: "Key Support Arguments", type: "textarea", required: true, rows: 3, placeholder: "What are the strongest arguments for this policy? Who are the champions?" },
        { id: "mediaFraming", label: "How is Media Framing This?", type: "select", required: true, options: ["Mostly positive / supportive", "Neutral / objective coverage", "Mixed — both sides represented", "Mostly negative / critical", "Highly polarized — split by outlet ideology", "Largely ignored so far"] },
      ],
    },
    {
      title: "SIMULATION PARAMETERS",
      subtitle: "Define the simulation scope",
      fields: [
        { id: "targetRegions", label: "Target Regions", type: "multiselect", required: true, options: ["Urban centers", "Rural areas", "Suburban communities", "North America", "Europe", "Africa", "Asia", "Latin America", "Global"] },
        { id: "targetDemographics", label: "Key Demographics to Simulate", type: "multiselect", required: true, options: ["Gen Z (18–25)", "Millennials (26–40)", "Gen X (41–55)", "Baby Boomers (56+)", "Working class", "Middle class", "Business owners", "Religious communities", "Political left", "Political right", "Political center"] },
        { id: "timeframe", label: "Impact Timeframe", type: "select", required: true, options: ["Immediate public reaction (days)", "Short-term (1–3 months)", "Medium-term (6–12 months)", "Long-term (2–5 years)", "Generational impact"] },
        { id: "primaryQuestion", label: "Primary Question", type: "select", required: true, options: ["Will the public support or oppose this?", "What will be the political fallout?", "Will this cause social unrest or protest?", "What is the economic impact?", "Will this policy survive legally?", "How will different demographics react?"] },
      ],
    },
    {
      title: "STAKEHOLDER MAP",
      subtitle: "How key groups will respond",
      fields: [
        { id: "businessReaction", label: "Expected Business / Industry Reaction", type: "textarea", required: false, rows: 2, placeholder: "Will businesses comply, lobby against it, relocate, or adapt?" },
        { id: "internationalResponse", label: "Expected International Response", type: "textarea", required: false, rows: 2, placeholder: "How will other countries or international bodies react?" },
        { id: "implementationRisks", label: "Implementation / Compliance Risks", type: "textarea", required: false, rows: 2, placeholder: "What could go wrong in rolling this out? Enforcement challenges?" },
        { id: "additionalNotes", label: "Additional Context", type: "textarea", required: false, rows: 2, placeholder: "Constitutional challenges, activist groups, historic precedents" },
      ],
    },
  ],
};

export const productLaunchSchema: FormSchema = {
  type: "product-launch",
  title: "Product Launch Simulation",
  description: "Simulate how your target market receives a new product, feature, or pricing change before you ship.",
  icon: "🚀",
  sections: [
    {
      title: "THE PRODUCT",
      subtitle: "What are you launching?",
      fields: [
        { id: "productName", label: "Product Name", type: "text", required: true, placeholder: "e.g. iPhone 17 Pro, GPT-5, Nike Flyknit 2025, Stripe Capital for SMBs" },
        { id: "companyName", label: "Company Name", type: "text", required: true, placeholder: "e.g. Apple, OpenAI, Nike, Stripe, YourStartupName" },
        { id: "productCategory", label: "Product Category", type: "select", required: true, options: ["Consumer Hardware / Device", "Enterprise Software (B2B SaaS)", "Consumer App / Platform", "AI Product / Tool", "Physical Consumer Product", "Financial Product", "Healthcare / Biotech", "Fashion / Apparel", "Food & Beverage", "Gaming", "Media / Content", "Other"] },
        { id: "launchDate", label: "Planned Launch Date", type: "date", required: false },
        { id: "pricePoint", label: "Price Point / Pricing Model", type: "text", required: true, placeholder: "e.g. $999 one-time, $29/month, Freemium + $49/month Pro, Free with ads" },
      ],
    },
    {
      title: "THE PROPOSITION",
      subtitle: "Why should anyone care?",
      fields: [
        { id: "productDescription", label: "Product Description", type: "textarea", required: true, rows: 4, placeholder: "Describe what the product does, what problem it solves, and what is genuinely new or different about it." },
        { id: "uniqueValueProp", label: "Unique Value Proposition (UVP)", type: "textarea", required: true, rows: 3, placeholder: "In 1-2 sentences: why will customers choose this over alternatives? What is the killer feature?" },
        { id: "differentiators", label: "Key Differentiators from Competition", type: "textarea", required: true, rows: 3, placeholder: "List 3-5 concrete ways this is better, different, or cheaper than what exists today" },
        { id: "targetCustomer", label: "Ideal Target Customer", type: "textarea", required: true, rows: 2, placeholder: "Who is the exact person who will buy this? Age, job, pain point, location, spending habits" },
      ],
    },
    {
      title: "COMPETITIVE LANDSCAPE",
      subtitle: "What are you walking into?",
      fields: [
        { id: "competition", label: "Main Competitors", type: "textarea", required: true, rows: 3, placeholder: "List direct and indirect competitors. Include their prices, strengths, and weaknesses." },
        { id: "marketShare", label: "Current Market Share Landscape", type: "select", required: true, options: ["Monopoly / near-monopoly (one player dominates 70%+)", "Duopoly (two players split most of the market)", "Fragmented (many players, no dominant leader)", "Emerging category (no clear leader yet)", "Disrupting an analog / offline market"] },
        { id: "incumbentAdvantage", label: "Incumbent Advantage Level", type: "select", required: true, options: ["Very high — established players with massive switching costs", "High — strong brand loyalty and distribution", "Medium — customers open to switching", "Low — customers are actively unhappy with incumbents", "None — new category"] },
        { id: "firstMoverStatus", label: "First Mover Status", type: "select", required: true, options: ["First to market — creating a new category", "Fast follower — second but better", "Late entrant — entering established market", "Re-entering — pivoted from failed product"] },
      ],
    },
    {
      title: "GO-TO-MARKET STRATEGY",
      subtitle: "How you plan to launch",
      fields: [
        { id: "launchMarkets", label: "Initial Launch Markets", type: "multiselect", required: true, options: ["United States", "United Kingdom", "European Union", "India", "Nigeria / West Africa", "Southeast Asia", "Latin America", "Japan / South Korea", "Middle East", "Global simultaneous launch"] },
        { id: "channelStrategy", label: "Distribution Channels", type: "multiselect", required: true, options: ["Direct-to-consumer (D2C / website)", "App stores (iOS / Android)", "Retail partnerships", "Enterprise sales team", "Influencer / creator marketing", "SEO / content marketing", "Paid ads (Facebook, Google)", "Product Hunt / press launch", "Partnership / white-label"] },
        { id: "marketingBudget", label: "Marketing Budget Range", type: "select", required: true, options: ["Bootstrapped — organic only (< $10K)", "Small budget ($10K – $100K)", "Medium budget ($100K – $1M)", "Large budget ($1M – $10M)", "Enterprise scale ($10M+)"] },
        { id: "partnershipStrategy", label: "Key Partnerships / Endorsements", type: "textarea", required: false, rows: 2, placeholder: "Any celebrity endorsements, media partnerships, distribution deals, or platform integrations?" },
      ],
    },
    {
      title: "BRAND & MARKET CONTEXT",
      subtitle: "The trust and perception environment",
      fields: [
        { id: "brandReputation", label: "Brand Reputation in This Category", type: "select", required: true, options: ["Iconic brand — trusted globally", "Strong brand — well-regarded", "Neutral brand — unknown in this space", "Mixed brand — some controversy", "Damaged brand — needs to rebuild trust", "Brand new — no existing perception"] },
        { id: "targetDemographics", label: "Primary Buyer Demographics", type: "multiselect", required: true, options: ["Gen Z (18–25)", "Millennials (26–40)", "Gen X (41–55)", "Baby Boomers (56+)", "Enterprise buyers / CIOs", "Small business owners", "Developers / technical users", "Creatives / designers", "Health-conscious consumers", "Luxury buyers"] },
        { id: "additionalNotes", label: "Other Context the AI Should Know", type: "textarea", required: false, rows: 3, placeholder: "Pre-launch hype, waitlist size, beta feedback, influencer seeding, past failed launches, regulatory concerns" },
      ],
    },
  ],
};

export const geopoliticalSchema: FormSchema = {
  type: "geopolitical",
  title: "Geopolitical Event Simulation",
  description: "Model the global ripple effects of conflicts, sanctions, treaties, or diplomatic crises across nations.",
  icon: "🌍",
  sections: [
    {
      title: "THE EVENT",
      subtitle: "What geopolitical event is being simulated?",
      fields: [
        { id: "eventName", label: "Event Name / Title", type: "text", required: true, placeholder: "e.g. China Invades Taiwan, US Sanctions Iran, Russia-NATO Direct Confrontation, Sudan Civil War Escalation" },
        { id: "eventType", label: "Event Type", type: "select", required: true, options: ["Military conflict / invasion", "Economic sanctions / trade war", "Diplomatic crisis / expulsion", "Treaty / Peace agreement", "Nuclear escalation", "Cyber attack / infrastructure hit", "Revolution / Coup d'etat", "Territorial dispute", "Refugee / humanitarian crisis", "Alliance formation / breakdown", "Assassination / Leadership change", "Other"] },
        { id: "involvedParties", label: "Countries / Parties Directly Involved", type: "textarea", required: true, rows: 3, placeholder: "List all state and non-state actors directly involved. Include their roles: aggressor, defender, mediator, ally, etc." },
        { id: "eventDate", label: "Date / When This Occurs", type: "date", required: false },
        { id: "geographicScope", label: "Geographic Scope", type: "select", required: true, options: ["Bilateral (2 countries)", "Regional (multiple neighboring countries)", "Continental", "Global / multi-theater", "Cyber / non-physical"] },
      ],
    },
    {
      title: "THE TRIGGER",
      subtitle: "What sparked this, and what happened immediately?",
      fields: [
        { id: "trigger", label: "The Trigger Event", type: "textarea", required: true, rows: 4, placeholder: "What specifically caused this? Was it a surprise attack, a political announcement, a military exercise gone wrong, an assassination? Describe the triggering moment in detail." },
        { id: "immediateActions", label: "Immediate Actions Taken", type: "textarea", required: false, rows: 3, placeholder: "What has already happened? Military deployments, border closures, emergency sessions, sanctions announced?" },
        { id: "officialStatements", label: "Official Statements / Justifications", type: "textarea", required: false, rows: 2, placeholder: "What have the key parties said publicly? What justification has been given?" },
        { id: "internationalReaction", label: "Initial International Reaction", type: "textarea", required: false, rows: 2, placeholder: "How have the UN, US, EU, China, or regional bodies initially responded?" },
      ],
    },
    {
      title: "HISTORICAL CONTEXT",
      subtitle: "The deep roots of this conflict or event",
      fields: [
        { id: "historicalContext", label: "Historical Background", type: "textarea", required: true, rows: 5, placeholder: "What is the history between these parties? Past wars, treaties, grievances, colonial history, territorial disputes, ethnic tensions. The deeper the context, the more accurate the simulation." },
        { id: "currentTensions", label: "Current Tensions Before This Event", type: "textarea", required: true, rows: 3, placeholder: "What was the state of relations before this happened? Any recent provocations, diplomatic breakdowns, or military buildups?" },
        { id: "alliances", label: "Key Alliances & Treaties", type: "textarea", required: false, rows: 2, placeholder: "Which major alliances are invoked? NATO Article 5? CSTO? BRICS solidarity? Belt & Road dependencies?" },
      ],
    },
    {
      title: "STAKES & INTERESTS",
      subtitle: "What is really at stake here?",
      fields: [
        { id: "economicStakes", label: "Economic Stakes", type: "textarea", required: true, rows: 3, placeholder: "Oil supplies, trade routes, semiconductor production, grain exports, energy pipelines, financial markets. What economic systems are at risk?" },
        { id: "resourcesInvolved", label: "Strategic Resources Involved", type: "multiselect", required: false, options: ["Oil & Gas", "Semiconductors / Technology", "Grain / Food supply", "Rare earth minerals", "Water rights", "Maritime routes", "Nuclear assets", "Cyber infrastructure", "Financial system"] },
        { id: "escalationRisk", label: "Escalation Risk Assessment", type: "select", required: true, options: ["Extremely high — nuclear threshold could be crossed", "High — direct great power confrontation possible", "Medium — regional escalation likely", "Low — likely contained diplomatically", "Very low — symbolic / political theater"] },
      ],
    },
    {
      title: "SIMULATION PARAMETERS",
      subtitle: "Define scope and outcomes to model",
      fields: [
        { id: "targetRegions", label: "Regions to Simulate Impact In", type: "multiselect", required: true, options: ["North America", "Europe", "Russia / Central Asia", "Middle East", "Africa", "South Asia", "East Asia", "Southeast Asia", "Latin America", "Global"] },
        { id: "timeframe", label: "Simulation Timeframe", type: "select", required: true, options: ["Immediate (hours to days)", "Short-term (1–4 weeks)", "Medium-term (1–6 months)", "Long-term (6 months – 2 years)", "Decade-level structural shift"] },
        { id: "primaryQuestion", label: "Primary Outcome Question", type: "select", required: true, options: ["Will this escalate to full-scale war?", "How will global markets react?", "What will the human cost be?", "How will alliances shift?", "What is the most likely resolution?", "Who gains and who loses geopolitically?"] },
        { id: "additionalNotes", label: "Any Other Intelligence the AI Should Know", type: "textarea", required: false, rows: 3, placeholder: "Classified context, proxy actors, internal political pressures, leadership psychology, pending elections that affect decision-making" },
      ],
    },
  ],
};

export const customSchema: FormSchema = {
  type: "custom",
  title: "Custom Scenario Simulation",
  description: "Build any simulation scenario you can imagine. Climate events, social movements, technological disruptions — anything.",
  icon: "⚡",
  sections: [
    {
      title: "SCENARIO BASICS",
      subtitle: "Define your custom simulation",
      fields: [
        { id: "scenarioTitle", label: "Scenario Title", type: "text", required: true, placeholder: "e.g. AGI is Announced Tomorrow, Pandemic Variant X Emerges, Global Internet Blackout, Mars Colony Established" },
        { id: "scenarioCategory", label: "Scenario Category", type: "select", required: true, options: ["Technological Disruption", "Climate / Environmental Crisis", "Public Health / Pandemic", "Social Movement / Civil Unrest", "Economic Collapse / Boom", "Space / Scientific Discovery", "Media / Information Event", "Criminal / Justice Event", "Entertainment / Cultural Shift", "Religious / Ideological Event", "Infrastructure Failure", "Other"] },
        { id: "scenarioDate", label: "When Does This Happen?", type: "date", required: false },
        { id: "geographicScope", label: "Geographic Scope of Impact", type: "select", required: true, options: ["Local / City-level", "National", "Regional (multiple countries)", "Global", "Digital / Online space"] },
      ],
    },
    {
      title: "THE SCENARIO",
      subtitle: "Tell the AI exactly what is happening",
      fields: [
        { id: "scenarioDescription", label: "Full Scenario Description", type: "textarea", required: true, rows: 6, placeholder: "Describe the scenario in as much detail as possible. What happened? Who was involved? How was it revealed? What is the immediate known impact? Think of this as briefing an intelligence analyst." },
        { id: "keyEntities", label: "Key Entities Involved", type: "textarea", required: true, rows: 3, placeholder: "List all key people, organizations, governments, companies, or communities involved and their role in the scenario" },
        { id: "stakeholders", label: "Key Stakeholders Affected", type: "textarea", required: false, rows: 2, placeholder: "Who are the winners, losers, and bystanders in this scenario?" },
      ],
    },
    {
      title: "CONTEXT & VARIABLES",
      subtitle: "The world in which this happens",
      fields: [
        { id: "context", label: "World Context at Time of Event", type: "textarea", required: true, rows: 4, placeholder: "Describe the state of the world when this happens. Economic climate, political tensions, technological state, public mood, any relevant background events. Context is everything for accurate simulation." },
        { id: "historicalPrecedent", label: "Historical Precedents", type: "textarea", required: false, rows: 3, placeholder: "Has anything similar happened before? What lessons does history offer? e.g. 'Similar to the 1918 Spanish flu' or 'Like when ChatGPT launched in Nov 2022'" },
        { id: "variables", label: "Key Variables That Could Change the Outcome", type: "textarea", required: false, rows: 3, placeholder: "What are the 3-5 factors that most determine how this plays out? e.g. government response speed, media framing, economic resilience, international cooperation" },
      ],
    },
    {
      title: "SIMULATION GOALS",
      subtitle: "What do you want to understand?",
      fields: [
        { id: "outcomeQuestion", label: "Primary Outcome Question", type: "textarea", required: true, rows: 3, placeholder: "What is the single most important question you want this simulation to answer? Be specific. e.g. 'Will the public accept AI replacing 30% of white collar jobs, and how will they respond?'" },
        { id: "secondaryQuestions", label: "Secondary Questions (optional)", type: "textarea", required: false, rows: 2, placeholder: "Any additional angles or questions you want the simulation to explore?" },
      ],
    },
    {
      title: "PARAMETERS",
      subtitle: "Simulation scope and demographic focus",
      fields: [
        { id: "targetRegions", label: "Target Regions", type: "multiselect", required: true, options: ["North America", "Europe", "Sub-Saharan Africa", "Middle East / North Africa", "South Asia", "East Asia", "Southeast Asia", "Latin America", "Oceania", "Global"] },
        { id: "targetDemographics", label: "Key Demographics to Simulate", type: "multiselect", required: true, options: ["Gen Z (18–25)", "Millennials (26–40)", "Gen X (41–55)", "Baby Boomers (56+)", "Working class", "Middle class", "Upper class", "Business leaders", "Political class", "Scientific / academic community", "Religious communities", "Activist / civil society"] },
        { id: "timeframe", label: "Simulation Timeframe", type: "select", required: true, options: ["Immediate (hours to 48 hours)", "Short-term (1–4 weeks)", "Medium-term (1–6 months)", "Long-term (1–5 years)", "Generational (5–25 years)"] },
        { id: "complexityLevel", label: "Simulation Complexity", type: "select", required: true, options: ["Simple — focus on public reaction only", "Standard — reaction + key factors + recommendations", "Deep — full analysis with timeline, risks, opportunities", "Maximum — everything including dissenting views and edge cases"] },
      ],
    },
  ],
};

export const profitPathSchema: FormSchema = {
  type: "profit-path",
  title: "$1K Profit Path Simulation",
  description: "Turn limited starting capital into a practical cash-flow experiment using AI, automation, service income, and reinvestment discipline. Educational only; no guaranteed profit.",
  icon: "💸",
  sections: [
    {
      title: "CAPITAL BASE",
      subtitle: "Define the money, time, and risk guardrails",
      fields: [
        { id: "startingCapital", label: "Starting Capital", type: "number", required: true, placeholder: "1000", hint: "The amount available to test. The simulator should protect the base before chasing upside." },
        { id: "monthlyNeed", label: "Monthly Profit Goal", type: "number", required: true, placeholder: "300" },
        { id: "timeframe", label: "Timeframe", type: "select", required: true, options: ["30 days", "60 days", "90 days", "6 months", "12 months"] },
        { id: "riskTolerance", label: "Risk Tolerance", type: "select", required: true, options: ["Very low — protect capital first", "Low — small controlled tests", "Medium — balanced tests", "High — willing to lose capital for upside"] },
      ],
    },
    {
      title: "SKILLS AND ASSETS",
      subtitle: "Small capital works best when paired with execution leverage",
      fields: [
        { id: "skills", label: "Current Skills", type: "multiselect", required: true, options: ["Writing / content", "Sales / outreach", "Design", "Coding / no-code", "Video editing", "Data research", "Customer support", "Local services", "E-commerce", "None yet"] },
        { id: "availableTime", label: "Weekly Time Available", type: "select", required: true, options: ["Under 5 hours", "5-10 hours", "10-20 hours", "20-40 hours", "Full-time"] },
        { id: "toolsAccess", label: "Tools Already Available", type: "multiselect", required: false, options: ["AI chat tools", "Canva / design tools", "Website builder", "CRM / spreadsheet", "Email outreach tool", "Social accounts", "Payment processor", "Marketplace profile"] },
      ],
    },
    {
      title: "PROFIT MODEL",
      subtitle: "Pick the cash-flow lane to test first",
      fields: [
        { id: "preferredModel", label: "Preferred Model", type: "select", required: true, options: ["AI-assisted service business", "Digital product / templates", "Local lead generation", "Content + affiliate revenue", "Small e-commerce test", "Education / coaching", "Not sure — recommend one"] },
        { id: "targetBuyer", label: "Target Buyer", type: "textarea", required: true, rows: 3, placeholder: "Who exactly would pay? Describe their problem, budget, and urgency." },
        { id: "offerIdea", label: "Offer Idea", type: "textarea", required: true, rows: 3, placeholder: "What will you sell, what outcome does it create, and why would someone trust it?" },
      ],
    },
    {
      title: "AUTOMATION PLAN",
      subtitle: "Use AI and tech to reduce manual work, not to gamble",
      fields: [
        { id: "automationTargets", label: "What Should AI Automate?", type: "multiselect", required: true, options: ["Market research", "Lead list building", "Cold email / DM drafts", "Landing page copy", "Proposal writing", "Customer onboarding", "Delivery templates", "Reporting / analytics", "Follow-up reminders"] },
        { id: "spendPlan", label: "Planned Spend Allocation", type: "textarea", required: true, rows: 4, placeholder: "Example: $250 reserve, $350 website/tools, $200 lead generation test, $200 learning/templates. Include any platform fees." },
        { id: "stopRules", label: "Stop-Loss Rules", type: "textarea", required: true, rows: 3, placeholder: "When do you stop spending? Example: no qualified leads after $100 test, no replies after 100 targeted messages." },
      ],
    },
    {
      title: "REINVESTMENT LOOP",
      subtitle: "Continuous profit comes from measured compounding, not promises",
      fields: [
        { id: "metrics", label: "Metrics to Track", type: "multiselect", required: true, options: ["Revenue", "Profit margin", "Cash reserve", "Lead conversion", "Customer acquisition cost", "Repeat purchase", "Referral rate", "Hours spent", "Tool costs"] },
        { id: "reinvestmentRule", label: "Reinvestment Rule", type: "select", required: true, options: ["Reinvest 10% of profit", "Reinvest 25% of profit", "Reinvest 50% of profit", "Only reinvest after 3 profitable weeks", "Do not reinvest until capital is recovered"] },
        { id: "biggestConcern", label: "Biggest Concern", type: "textarea", required: false, rows: 2, placeholder: "What could make this fail: scams, weak offer, no time, no audience, low trust, platform risk?" },
      ],
    },
  ],
};

export const relationshipSchema: FormSchema = {
  type: "relationship",
  title: "Relationship Future Simulation",
  description: "Model relationship durability, repair paths, conflict recovery, trust, shared values, and safety signals. This is not therapy or a command to stay or leave.",
  icon: "❤️",
  sections: [
    {
      title: "RELATIONSHIP CONTEXT",
      subtitle: "What kind of relationship is being simulated?",
      fields: [
        { id: "relationshipType", label: "Relationship Type", type: "select", required: true, options: ["Dating", "Marriage", "Long-distance", "Co-parenting", "Friendship", "Family", "Co-founder / business partner"] },
        { id: "duration", label: "Relationship Duration", type: "select", required: true, options: ["Under 3 months", "3-12 months", "1-3 years", "3-7 years", "7+ years"] },
        { id: "primaryQuestion", label: "Primary Question", type: "textarea", required: true, rows: 3, placeholder: "Example: Can this relationship recover if we rebuild trust and communicate better?" },
      ],
    },
    {
      title: "PATTERN SCAN",
      subtitle: "The patterns matter more than one argument",
      fields: [
        { id: "trustLevel", label: "Trust Level", type: "select", required: true, options: ["Strong and consistent", "Mostly good with some damage", "Fragile", "Repeatedly broken", "Unknown"] },
        { id: "conflictPattern", label: "Conflict Pattern", type: "select", required: true, options: ["Calm disagreement and repair", "Frequent arguments but some repair", "Criticism / defensiveness cycle", "Stonewalling / silent treatment", "Contempt or disrespect", "Avoidance — issues never discussed"] },
        { id: "repairAttempts", label: "Repair Attempts", type: "select", required: true, options: ["Both people repair quickly", "One person usually repairs", "Repair happens but slowly", "Apologies without change", "No real repair"] },
        { id: "affection", label: "Affection / Friendship", type: "select", required: true, options: ["Strong", "Present but declining", "Inconsistent", "Mostly gone", "Not sure"] },
      ],
    },
    {
      title: "FUTURE PRESSURES",
      subtitle: "Stress reveals the real system",
      fields: [
        { id: "pressureSources", label: "Pressure Sources", type: "multiselect", required: true, options: ["Money", "Family", "Distance", "Career", "Children / parenting", "Trust breach", "Intimacy", "Different life goals", "Mental health stress", "Business pressure"] },
        { id: "sharedValues", label: "Shared Values", type: "select", required: true, options: ["Highly aligned", "Mostly aligned", "Some major gaps", "Conflicting futures", "Unclear"] },
        { id: "changeWillingness", label: "Willingness to Change", type: "select", required: true, options: ["Both actively willing", "One willing, one uncertain", "Both say yes but little action", "One refuses", "Neither is willing"] },
      ],
    },
    {
      title: "SAFETY CHECK",
      subtitle: "Safety overrides normal relationship optimization",
      fields: [
        { id: "safetyConcern", label: "Any fear, threats, coercion, stalking, or violence?", type: "radio", required: true, options: ["No safety concern", "Yes — there is fear, threats, coercion, stalking, or violence"] },
        { id: "safetyDetails", label: "Safety Details", type: "textarea", required: false, rows: 3, placeholder: "Optional. If there is danger, the simulator should prioritize safety planning and outside support, not relationship optimization." },
      ],
    },
    {
      title: "DESIRED OUTCOME",
      subtitle: "Choose what the simulation should optimize for",
      fields: [
        { id: "desiredOutcome", label: "Desired Outcome", type: "select", required: true, options: ["Repair and stay together", "Understand if repair is realistic", "Set healthy boundaries", "Prepare a hard conversation", "Separate respectfully", "Rebuild trust after a breach"] },
        { id: "nextConversation", label: "Next Conversation Needed", type: "textarea", required: true, rows: 3, placeholder: "What conversation needs to happen next, but keeps getting avoided?" },
      ],
    },
  ],
};


export const healthSignalSchema: FormSchema = {
  type: "health-signal",
  title: "Health Signal Simulation",
  description: "A careful health intake simulator that organizes symptoms, risk factors, vitals, labs, genotype, blood type, medication context, and urgency signals. This is educational triage support, not diagnosis or medical advice.",
  icon: "🩺",
  sections: [
    {
      title: "PERSON AND BASELINE",
      subtitle: "Health answers need real biological context",
      fields: [
        { id: "age", label: "Age", type: "number", required: true, placeholder: "e.g. 34" },
        { id: "sexAtBirth", label: "Sex At Birth", type: "select", required: true, options: ["Female", "Male", "Intersex", "Prefer not to say"] },
        { id: "currentLocation", label: "Country / Region", type: "text", required: true, placeholder: "e.g. Lagos, Nigeria; Texas, USA; London, UK" },
        { id: "heightWeight", label: "Height and Weight", type: "text", required: false, placeholder: "e.g. 5ft 10in, 82kg" },
        { id: "bloodType", label: "Blood Type", type: "select", required: true, options: ["Unknown", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
        { id: "genotype", label: "Genotype / Sickle Cell Status", type: "select", required: true, options: ["Unknown", "AA", "AS", "SS", "AC", "SC", "Other / tested but unsure"] },
      ],
    },
    {
      title: "SYMPTOMS AND TIMELINE",
      subtitle: "What is happening, when it started, and what changed",
      fields: [
        { id: "mainConcern", label: "Main Health Question", type: "textarea", required: true, rows: 4, placeholder: "Describe the main concern in plain words. What worries you most?" },
        { id: "symptoms", label: "Symptoms", type: "textarea", required: true, rows: 5, placeholder: "List symptoms, severity 1-10, location, pattern, what improves/worsens it, and whether it is getting better or worse." },
        { id: "startedWhen", label: "When Did It Start?", type: "select", required: true, options: ["Within the last hour", "Today", "1-3 days ago", "4-7 days ago", "1-4 weeks ago", "More than 1 month", "Long-term / recurring"] },
        { id: "progression", label: "Progression", type: "select", required: true, options: ["Rapidly worsening", "Slowly worsening", "Comes and goes", "Stable", "Improving", "New symptom after medication / food / exposure"] },
        { id: "painOrFever", label: "Pain, Fever, or Bleeding Details", type: "textarea", required: false, rows: 3, placeholder: "Temperature, pain score, bleeding amount/color, vomiting/diarrhea frequency, breathing issues, headache pattern, etc." },
      ],
    },
    {
      title: "MEDICAL CONTEXT",
      subtitle: "Known conditions, medicines, allergies, and exposures matter",
      fields: [
        { id: "knownConditions", label: "Known Medical Conditions", type: "textarea", required: true, rows: 3, placeholder: "e.g. asthma, diabetes, high blood pressure, sickle cell, ulcers, pregnancy, kidney disease, anxiety, surgeries" },
        { id: "medications", label: "Current Medications / Supplements", type: "textarea", required: true, rows: 3, placeholder: "Name, dose if known, how often, recent antibiotics, painkillers, herbs, contraceptives, or injections." },
        { id: "allergies", label: "Drug / Food Allergies", type: "textarea", required: true, rows: 2, placeholder: "Write none if none known." },
        { id: "pregnancyStatus", label: "Pregnancy / Postpartum Status", type: "select", required: true, options: ["Not applicable", "No", "Possibly pregnant", "Pregnant", "Postpartum under 6 weeks", "Prefer not to say"] },
        { id: "exposures", label: "Recent Exposures", type: "textarea", required: false, rows: 3, placeholder: "Travel, sick contacts, new food, alcohol/drugs, insect bites, injury, sexual exposure, chemicals, new medication, intense exercise." },
      ],
    },
    {
      title: "VITALS, TESTS, AND RED FLAGS",
      subtitle: "Use measured facts where available",
      fields: [
        { id: "vitals", label: "Vitals If Known", type: "textarea", required: false, rows: 3, placeholder: "Temperature, blood pressure, pulse, oxygen level, blood sugar, weight change, urine output." },
        { id: "labs", label: "Recent Labs / Test Results", type: "textarea", required: false, rows: 4, placeholder: "Blood tests, malaria test, pregnancy test, COVID test, genotype result, scans, ECG, urinalysis, doctor notes." },
        { id: "redFlags", label: "Emergency Red Flags Present?", type: "multiselect", required: true, options: ["None known", "Chest pain", "Severe trouble breathing", "Fainting / confusion", "Stroke signs", "Severe allergic reaction", "Severe bleeding", "Severe abdominal pain", "Pregnancy bleeding/pain", "Seizure", "Suicidal thoughts", "High fever in baby", "Very stiff neck", "Worst headache of life"] },
        { id: "careAccess", label: "Access To Care Right Now", type: "select", required: true, options: ["Emergency care available now", "Clinic available today", "Pharmacy only", "Telehealth only", "No easy access", "Not sure"] },
      ],
    },
  ],
};
export const legacyViewSchema: FormSchema = {
  type: "legacy-view",
  title: "Loved One Legacy View",
  description: "A reflective simulator for imagining how a passed father, mother, sister, brother, or loved one might view your life now, grounded in memory, stoic encouragement, power-awareness, and resilience.",
  icon: "🕊️",
  sections: [
    {
      title: "YOUR LOVED ONE",
      subtitle: "Who are you reflecting with?",
      fields: [
        { id: "lovedOneName", label: "Loved One's Name", type: "text", required: true, placeholder: "e.g. Dad, Mum, Aisha, Michael" },
        { id: "relationshipToYou", label: "Relationship To You", type: "select", required: true, options: ["Father", "Mother", "Sister", "Brother", "Grandparent", "Spouse / partner", "Child", "Friend", "Mentor", "Other loved one"] },
        { id: "theirPersonality", label: "What Were They Like?", type: "textarea", required: true, rows: 4, placeholder: "Describe their voice, values, humor, discipline, faith, work ethic, kindness, standards, or the way they corrected you." },
        { id: "theirValues", label: "Values They Lived By", type: "multiselect", required: true, options: ["Faith", "Family", "Hard work", "Education", "Discipline", "Kindness", "Truth", "Courage", "Respect", "Service", "Independence", "Humility", "Loyalty", "Wisdom", "Protection"] },
      ],
    },
    {
      title: "WHERE YOU ARE NOW",
      subtitle: "Let the mirror see your current season clearly",
      fields: [
        { id: "currentSeason", label: "Current Life Season", type: "select", required: true, options: ["Trying to rebuild", "Growing but tired", "Successful but lonely", "Facing grief", "Starting over", "Carrying family responsibility", "Building a business", "Healing from failure", "Seeking direction", "Becoming stronger"] },
        { id: "lifeUpdate", label: "What Would You Tell Them About Your Life Now?", type: "textarea", required: true, rows: 5, placeholder: "Tell them what has happened, what you are building, what hurts, what you survived, and what you wish they could see." },
        { id: "proudMoments", label: "What Might Make Them Proud?", type: "textarea", required: false, rows: 3, placeholder: "What have you endured, achieved, protected, learned, or refused to give up on?" },
        { id: "privateStruggle", label: "What Are You Quietly Struggling With?", type: "textarea", required: true, rows: 4, placeholder: "Be honest: fear, guilt, anger, money pressure, loneliness, family burden, confidence, discipline, regret, or direction." },
      ],
    },
    {
      title: "THE MESSAGE YOU NEED",
      subtitle: "Set the emotional tone carefully",
      fields: [
        { id: "desiredTone", label: "Tone", type: "select", required: true, options: ["Stoic and steady", "Warm but honest", "Fatherly discipline", "Motherly comfort", "Big sibling truth", "Calm spiritual encouragement", "Direct no-excuses guidance"] },
        { id: "mainQuestion", label: "What Do You Wish You Could Ask Them?", type: "textarea", required: true, rows: 3, placeholder: "Example: Would you be proud of me? Am I becoming strong? What would you tell me to stop doing?" },
        { id: "needMost", label: "What Do You Need Most Right Now?", type: "select", required: true, options: ["Hope", "Forgiveness", "Courage", "Discipline", "Direction", "Closure", "Confidence", "Peace", "A reason to keep going", "A practical next step"] },
        { id: "avoidTone", label: "Avoid This Tone", type: "multiselect", required: false, options: ["Too sentimental", "Too harsh", "Religious language", "Pretending to speak from the afterlife", "Toxic positivity", "Generic advice", "Shaming"] },
      ],
    },
    {
      title: "RESILIENCE AND POWER FILTER",
      subtitle: "Stoic hope, strategic power, and practical strength",
      fields: [
        { id: "resilienceFocus", label: "Resilience Focus", type: "multiselect", required: true, options: ["Control what you can control", "Master your emotions", "Turn pain into duty", "Build quietly", "Protect your reputation", "Choose discipline over mood", "Keep your word to yourself", "Use loss as fuel", "Serve your family", "Do not beg for respect", "Be useful", "Keep moving after failure"] },
        { id: "powerLesson", label: "Power Lesson Needed", type: "select", required: true, options: ["Guard your reputation", "Never appear desperate", "Use timing wisely", "Say less and observe more", "Choose allies carefully", "Turn weakness into leverage", "Avoid unnecessary enemies", "Make your actions speak", "Do not waste energy proving yourself"] },
        { id: "nextStep", label: "One Real Step You Can Take This Week", type: "textarea", required: false, rows: 2, placeholder: "Optional: a call, apology, budget, workout, prayer, business task, boundary, study plan, or family responsibility." },
      ],
    },
  ],
};

const truthCalibrationSection: FormSection = {
  title: "TRUTH CALIBRATION",
  subtitle: "The deeper and more honest this section is, the more useful the simulation becomes",
  fields: [
    { id: "knownFacts", label: "Known Facts", type: "textarea", required: true, rows: 3, placeholder: "List the facts you know are true. Include numbers, dates, names, amounts, messages, symptoms, evidence, constraints, or history." },
    { id: "unknowns", label: "Unknowns / Missing Information", type: "textarea", required: true, rows: 3, placeholder: "What do you not know yet? What could change the answer if discovered?" },
    { id: "evidenceQuality", label: "Evidence Quality", type: "select", required: true, options: ["Measured data / documents", "Direct personal experience", "Trusted witness", "Mixed evidence", "Mostly assumptions", "Rumor / unverified"] },
    { id: "constraints", label: "Real-World Constraints", type: "textarea", required: true, rows: 3, placeholder: "Money, time, health, law, location, skills, family, safety, tools, access, culture, politics, reputation, or deadlines." },
    { id: "idealOutcome", label: "Ideal Outcome", type: "textarea", required: true, rows: 2, placeholder: "What would a genuinely good outcome look like, not just an emotional win?" },
    { id: "unacceptableOutcome", label: "Unacceptable Outcome / Boundary", type: "textarea", required: true, rows: 2, placeholder: "What must not happen? What boundary, loss, risk, or harm should the simulator avoid?" },
  ],
};

function attachTruthCalibration(schema: FormSchema) {
  if (!schema.sections.some((section) => section.title === truthCalibrationSection.title)) {
    schema.sections.push(truthCalibrationSection);
  }
}

[
  publicReactionSchema,
  electionSchema,
  marketsSchema,
  sportsSchema,
  policySchema,
  productLaunchSchema,
  geopoliticalSchema,
  profitPathSchema,
  relationshipSchema,
  healthSignalSchema,
  legacyViewSchema,
  customSchema,
].forEach(attachTruthCalibration);
export const formSchemas: Record<string, FormSchema> = {
  "public-reaction": publicReactionSchema,
  election: electionSchema,
  markets: marketsSchema,
  sports: sportsSchema,
  policy: policySchema,
  "product-launch": productLaunchSchema,
  geopolitical: geopoliticalSchema,
  "profit-path": profitPathSchema,
  relationship: relationshipSchema,
  "health-signal": healthSignalSchema,
  "legacy-view": legacyViewSchema,
  custom: customSchema,
};
