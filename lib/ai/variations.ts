/**
 * HOOKORY VARIATIONS SYSTEM
 * 
 * This file contains LinkedIn algorithm-cracking variations for:
 * - Hook Structures (opening lines)
 * - Story Openers (in media res templates)
 * - Voice Archetypes (personas)
 * - Emotional Tones (high-arousal feelings)
 * - CTA Endings (conversation closers)
 * - Power Words (trigger words by category)
 * 
 * SHUFFLE MECHANISM:
 * Uses Fisher-Yates shuffle + no-repeat tracking to ensure:
 * 1. Random selection (no predictable patterns)
 * 2. No repeats until entire list is exhausted
 * 3. Impossible for anyone to reverse-engineer the system
 */

// ═══════════════════════════════════════════════════════════════════
// HOOK STRUCTURES - 60+ LinkedIn Algorithm Crackers
// ═══════════════════════════════════════════════════════════════════
// Each hook is backed by psychological triggers: Curiosity Gap, Belief Violation,
// Status Threat, Authority, Vulnerability, or Pattern Interrupt

export const HOOK_STRUCTURES = [
    // === COLD STAT HOOKS (Authority + Shock) ===
    "[X]% of [group] fail at [thing]. Here's why.",
    "[X]% of [result] comes from [unexpected source].",
    "I analyzed [X] [things] and found [surprising pattern].",
    "[X] out of [Y] [professionals] get this wrong.",
    "Only [X]% of [group] ever achieve [result]. The difference?",

    // === CONTRARIAN HOOKS (Belief Violation) ===
    "Everyone says [common advice]. I did the opposite.",
    "[Common belief] is a lie. Here's the truth.",
    "The worst advice I ever got: [common wisdom].",
    "Stop [common practice]. It's killing your [metric].",
    "You don't need [expected requirement] to [achieve result].",
    "[Popular strategy] is dead. Here's what's working now.",
    "Unpopular opinion: [shocking take].",
    "I've never [common practice]. And I'm doing better than ever.",

    // === CONFESSION HOOKS (Vulnerability + Trust) ===
    "I made a $[X] mistake. Here's what I learned.",
    "I got fired from my job. Best thing that ever happened.",
    "I've been lying to you. Here's the truth.",
    "I almost quit [thing]. Then this happened.",
    "The mistake that cost me [specific loss].",
    "I was wrong about [topic]. Completely wrong.",
    "I used to believe [myth]. Not anymore.",
    "My biggest regret in [X] years? Ignoring [thing].",
    "I wasted [timeframe] doing [thing].",
    "Please, stop doing [common practice].",
    "I owe you an apology.",
    "I'm done with [industry norm]. Here's why.",
    "I have a confession to make.",
    "I nearly lost everything because of [thing].",
    "Allow me to be brutally honest.",
    "I'm embarrassed to admit this, but [truth].",
    "I ignored the warning signs. Don't make my mistake.",
    "I failed at [thing] for [timeframe]. Until I realized [insight].",

    // === BOLD PREDICTION HOOKS (Fear of Missing Out) ===
    "[Thing] will be obsolete by [year].",
    "In [X] years, [prediction]. Here's why.",
    "The future of [industry] isn't [expected]. It's [unexpected].",
    "If you're still [old practice], you're already behind.",
    "This will change [industry] forever.",
    "[Emerging trend] is coming. And most aren't ready.",

    // === CURIOSITY GAP HOOKS (Information Asymmetry) ===
    "I discovered something that changed everything.",
    "There's a secret most [role] don't know.",
    "The hidden reason your [thing] isn't working.",
    "What nobody tells you about [topic].",
    "I tried a weird experiment. It actually worked.",
    "The one thing [successful people] do differently.",
    "I found a pattern. And it explains everything.",

    // === PROBLEM-FIRST HOOKS (Pain Recognition) ===
    "Your [thing] is broken. You just don't know it yet.",
    "If your [metric] isn't improving, this is why.",
    "The silent killer of [desired outcome].",
    "Why [common approach] is making things worse.",
    "You're working too hard on [wrong thing].",
    "The real reason you're stuck at [level/metric].",

    // === AUTHORITY HOOKS (Credibility) ===
    "After [X] years doing [thing], I found [insight].",
    "I've [impressive credential]. Here's what I've learned.",
    "[X] [results] later, one truth stands out.",
    "My client [impressive result] in [timeframe].",
    "I've worked with [impressive group]. The pattern?",
    "What [X] years of [experience] taught me about [topic].",

    // === RESULT-FIRST HOOKS (Outcome Curiosity) ===
    "I [achieved result] in [timeframe]. Without [expected requirement].",
    "From [bad state] to [good state] in [timeframe].",
    "[Impressive outcome]. Here's exactly how.",
    "I went from [starting point] to [end point].",
    "Zero to [impressive number] in [timeframe].",

    // === PATTERN INTERRUPT HOOKS (Novelty) - Trimmed to non-filler ===
    "I know this is controversial.",
    "Here's something nobody wants to admit.",
    "You're going to disagree with me.",

    // === OBSERVATION HOOKS (Data + Pattern Recognition) - NEW ===
    "I noticed a pattern in [X] [things]. It explains everything.",
    "I observed [surprising trend] across [X] [group]. Here's what it means.",
    "After watching [X] [people/companies], one thing became obvious.",
    "I tracked [metric] for [timeframe]. The pattern was unexpected.",
    "I studied [X] [cases]. The outliers all had one thing in common.",
    "I compared [X] [successful] vs [Y] [failing]. The difference is subtle.",

    // === SPECIFICITY HOOKS (Weirdly Specific Details) - NEW ===
    "At 3:47am on a Tuesday, I realized [insight].",
    "It took exactly [X] failed attempts before I learned [lesson].",
    "The 47th email in my inbox changed my perspective on [topic].",
    "On page 23 of a random [book/report], I found [insight].",

    // === DIRECT CALL-OUT HOOKS (Audience Targeting) - NEW ===
    "If you're a [role] struggling with [problem], read this.",
    "This is for the [X]% of [group] who feel stuck at [level].",
    "[Role], you need to hear this. [Statement].",

    // === DIALOGUE DROP HOOKS (Narrative Immersion) ===
    "'You're making a huge mistake,' my mentor said.",
    "'This will never work,' they told me.",
    "My client called me at 2am. '[Quote].'",
    "'We have a problem,' the text read.",
    "'Stop everything,' my boss emailed.",
    "The notification dinged at 11pm. '[Quote].'",
    "'Is this a joke?' the client asked.",
    "'You need to see this,' my co-founder whispered.",
    "My phone buzzed. It was the CEO.",
    "'Can we talk?' The message I dreaded.",
    "'Why would you do that?' everyone asked.",
    "The investor looked at me and said:",
    "'You're not ready.' That's what I heard.",
    "'I can't believe you did that,' she said.",

    // === LIST TEASE HOOKS (Completeness Desire) ===
    "[X] things nobody tells you about [topic].",
    "[X] signs your [thing] is about to [fail/succeed].",
    "[X] lessons from [impressive experience].",
    "The [X] rules I follow religiously.",
    "[X] mistakes killing your [metric].",

    // === QUESTION HOOKS (Self-Reflection) ===
    "What if everything you know about [topic] is wrong?",
    "Why do [successful people] always [unexpected behavior]?",
    "What separates [top performers] from everyone else?",
    "Ever wonder why some [people] [succeed] while others [fail]?",
]

// ═══════════════════════════════════════════════════════════════════
// STORY OPENERS - 35+ In Media Res Templates
// ═══════════════════════════════════════════════════════════════════
// Domain-specific physical actions that drop readers into the moment


export const STORY_CONSTRAINTS = {
    PHYSICAL_STAKES: {
        BANNED_EXAMPLES: [
            "I opened the Google Analytics tab",
            "I clicked deploy",
            "I pulled up the logs",
            "I scrolled through the feed",
            "I logged into the dashboard",
            "I checked my emails",
            "I looked at the screen"
        ],
        // Research-backed "Show, Don't Tell" physical anchors
        REQUIRED_EXAMPLES: [
            // STRESS (Drumming, clenching, repetitive motion)
            "I drummed a frantic rhythm on my desk with a pen",
            "My knuckles turned white as I gripped the coffee mug",
            "I adjusted the same frame on my desk three times",
            "I shredded the printed draft into tiny strips",

            // BURNOUT (Physical exhaustion signs)
            "I buried my face in my hands and exhaled",
            "My untouched coffee grew cold beside the keyboard",
            "I slumped back, letting the report slide off my lap",
            "I rubbed my temples until they throbbed",

            // REALIZATION (Sudden stillness, sharp movements)
            "I froze, my hand hovering halfway to the mouse",
            "I slammed the laptop shut to stop the noise",
            "I circled the error in red marker until the paper tore",
            "I pushed the keyboard away and closed my eyes",

            // FOCUS/INTENSITY (Leaning in, tunnel vision)
            "I leaned in until my nose nearly touched the screen",
            "The office noise faded as I traced the data line by line",
            "I wrote the number on a sticky note and slapped it on my monitor",
            "I paced the empty conference room, talking to myself",
            "I took off my glasses and rubbed the bridge of my nose",
            "I tapped my pen against the desk, faster and faster",
            "I leaned back in my chair and stared at the ceiling",
            "I put my headphones on and turned the volume up to max",
            "I cracked my knuckles and hovered over the keyboard"
        ]
    }
}

export const STORY_OPENERS = [
    // === ACTION-FIRST (Subject acts on object) ===
    "I deleted the entire [domain-noun].",
    "I threw the [domain-noun] across the room.",
    "I printed the [domain-noun] and ripped it in half.",
    "I closed the [domain-noun] and walked out.",
    "I rejected the [domain-noun] without reading it.",
    "I cancelled the [domain-noun] mid-process.",
    "I archived every [domain-noun] from the last year.",
    "I sent the [domain-noun] before I was ready.",

    // === OBJECT-STATE (Object in state) ===
    "The [domain-noun] sat unopened for three days.",
    "The [domain-noun] had 47 unresolved comments.",
    "The [domain-noun] was rejected. Again.",
    "The [domain-noun] showed zero progress.",
    "My [domain-noun] was completely blank.",
    "The [domain-noun] had one word: DENIED.",

    // === TIME/PLACE CONTEXT ===
    "At 2am, I rewrote the entire [domain-noun].",
    "Three days before launch, I scrapped the [domain-noun].",
    "In the middle of the meeting, I deleted the [domain-noun].",
    "On day 47, I finally understood the [domain-noun].",
    "Last Tuesday, my [domain-noun] broke everything.",
    "7pm on a Friday. Everyone else had left.",
    "Sunday night. The dread set in.",
    "Monday morning, 5 minutes before the standup.",
    "On the train home, it hit me.",
    "While waiting for my coffee, I realized something.",
    "In the airport lounge, looking at the departure board.",
    "During my daughter's soccer game (I shouldn't have been checking),",
    "Sitting in the parking lot for an hour.",
    "Just as I was about to hit 'send'.",
    "Three hours into the meeting. We were getting nowhere.",
    "It was 11pm. My pizza was cold.",
    "Ten minutes before the presentation.",

    // === DIALOGUE OPENERS ===
    "'This [domain-noun] is garbage,' my mentor said.",
    "'Start over,' the client said, pointing at my [domain-noun].",
    "'Explain this [domain-noun],' my boss demanded.",
    "'Where's the [domain-noun]?' they asked. I had no answer.",
    "'This can't be right,' I muttered, staring at the [domain-noun].",

    // === DISCOVERY MOMENT ===
    "I found a bug in the [domain-noun] that had been there for months.",
    "Hidden in the [domain-noun] was the answer I'd been missing.",
    "The [domain-noun] revealed a pattern I'd never noticed.",
    "Buried in my old [domain-noun] was the solution.",

    // === CONSEQUENCE REVEAL ===
    "That [domain-noun] cost me $[X].",
    "One line in the [domain-noun] changed everything.",
    "The [domain-noun] I ignored destroyed the entire project.",
    "Because of that [domain-noun], I lost the client.",
    "That single [domain-noun] saved the company.",
]

// ═══════════════════════════════════════════════════════════════════
// VOICE ARCHETYPES - 15 Distinct Personas
// ═══════════════════════════════════════════════════════════════════
// Each voice has a unique personality, language style, and energy

export const VOICE_ARCHETYPES = [
    {
        name: "THE SURGEON",
        description: "Cold, precise, clinical. Cuts through noise with scalpel-sharp logic.",
        style: "Data → Logic → Conclusion. No emotion. Just facts.",
        phrases: ["The evidence is clear.", "Let's dissect this.", "Here's the diagnosis."]
    },
    {
        name: "THE STREET FIGHTER",
        description: "Scrappy, battle-tested, no-BS. Learned everything the hard way.",
        style: "Blunt, short sentences. Real talk. No sugarcoating.",
        phrases: ["Here's the reality.", "Stop playing nice.", "Nobody's coming to save you."]
    },
    {
        name: "THE ARCHITECT",
        description: "System-focused builder. Everything is a machine to optimize.",
        style: "Frameworks, systems, processes. Show the blueprint.",
        phrases: ["Here's the system.", "Build the machine.", "Engineer the outcome."]
    },
    {
        name: "THE PROFESSOR",
        description: "Thoughtful, nuanced, loves to teach. Breaks down complexity.",
        style: "Educational but not condescending. Uses analogies.",
        phrases: ["Think of it like this.", "The principle is simple.", "Here's why this matters."]
    },
    {
        name: "THE REBEL",
        description: "Provocative, challenges everything, loves controversy.",
        style: "Bold claims, challenges status quo, unapologetic.",
        phrases: ["Everyone's wrong about this.", "I'll die on this hill.", "Fight me on this."]
    },
    {
        name: "THE COACH",
        description: "Motivational but real. Pushes you to be better, holds you accountable.",
        style: "Direct, supportive, action-oriented.",
        phrases: ["You're better than this.", "Time to level up.", "No more excuses."]
    },
    {
        name: "THE INSIDER",
        description: "Has access others don't. Shares secrets from the inside.",
        style: "Confidential tone, 'between you and me' energy.",
        phrases: ["Here's what they don't tell you.", "Behind closed doors.", "The real story is..."]
    },
    {
        name: "THE OPERATOR",
        description: "Execution-focused. Actually does the work, not just talks about it.",
        style: "Tactical, specific, actionable.",
        phrases: ["Here's exactly how.", "Step by step.", "This is how it actually works."]
    },
    {
        name: "THE SKEPTIC",
        description: "Questions everything. Demands proof before believing.",
        style: "Analytical, cautious, evidence-based.",
        phrases: ["But does it actually work?", "Show me the proof.", "I was skeptical too."]
    },
    {
        name: "THE STORYTELLER",
        description: "Paints pictures with words. Makes you feel like you're there.",
        style: "Narrative, immersive, sensory details.",
        phrases: ["Picture this.", "And then it hit me.", "That's when everything changed."]
    },
    {
        name: "THE MINIMALIST",
        description: "Says more with less. Every word earns its place.",
        style: "Sparse, impactful, no fluff whatsoever.",
        phrases: ["Simple.", "That's it.", "One thing."]
    },
    {
        name: "THE PHILOSOPHER",
        description: "Sees patterns others miss. Connects dots at a higher level.",
        style: "Abstract-to-concrete, principles over tactics.",
        phrases: ["The deeper truth is...", "At the root of this...", "What this really means..."]
    },
    {
        name: "THE VETERAN",
        description: "Been there, done that, seen it all. Wisdom from experience.",
        style: "Seasoned perspective, calm confidence, 'I've seen this before.'",
        phrases: ["After 20 years...", "I've watched this pattern repeat.", "This isn't new."]
    },
    {
        name: "THE UNDERDOG",
        description: "Started from nothing. Relatable, humble, still grinding.",
        style: "Vulnerable, real, 'I'm just like you.'",
        phrases: ["I had no advantages.", "I figured it out the hard way.", "You can do this too."]
    },
    {
        name: "THE ORACLE",
        description: "Sees the future before others. Prophetic, visionary.",
        style: "Forward-looking, predictive, trend-spotting.",
        phrases: ["This is where it's heading.", "Mark my words.", "The future is already here."]
    }
]

// ═══════════════════════════════════════════════════════════════════
// EMOTIONAL TONES - 18 High-Arousal Feelings
// ═══════════════════════════════════════════════════════════════════
// These trigger engagement. Low-arousal emotions (calm, content) don't.

export const EMOTIONAL_TONES = [
    {
        name: "AWE",
        trigger: "I had no idea this was possible",
        use_when: "Source reveals hidden mechanics or surprising capability"
    },
    {
        name: "ANGER",
        trigger: "This is broken and no one is talking about it",
        use_when: "Source exposes a systemic flaw or injustice"
    },
    {
        name: "FEAR",
        trigger: "If you don't act, you'll be left behind",
        use_when: "Source implies competitive stakes or urgent deadline"
    },
    {
        name: "SURPRISE",
        trigger: "This contradicts everything I believed",
        use_when: "Source flips a common assumption on its head"
    },
    {
        name: "AMUSEMENT",
        trigger: "I can't believe this actually works",
        use_when: "Source describes an unexpected or counterintuitive tactic"
    },
    {
        name: "VINDICATION",
        trigger: "I knew I was right all along",
        use_when: "Source proves an unpopular stance correct"
    },
    {
        name: "FRUSTRATION",
        trigger: "Why does nobody get this?",
        use_when: "Source addresses a commonly misunderstood problem"
    },
    {
        name: "RELIEF",
        trigger: "Finally, someone said it",
        use_when: "Source acknowledges a truth people feel but don't say"
    },
    {
        name: "URGENCY",
        trigger: "Time is running out",
        use_when: "Source describes a closing window of opportunity"
    },
    {
        name: "PRIDE",
        trigger: "Look what I built",
        use_when: "Source showcases an accomplishment with proof"
    },
    {
        name: "ENVY",
        trigger: "They know something I don't",
        use_when: "Source reveals insider knowledge or exclusive access"
    },
    {
        name: "CURIOSITY",
        trigger: "I need to know more",
        use_when: "Source teases incomplete information"
    },
    {
        name: "DEFIANCE",
        trigger: "I refuse to accept this",
        use_when: "Source challenges a limiting belief or norm"
    },
    {
        name: "REGRET",
        trigger: "I wish I knew this sooner",
        use_when: "Source shares a lesson learned too late"
    },
    {
        name: "HOPE",
        trigger: "Maybe this is possible after all",
        use_when: "Source provides a viable path forward"
    },
    {
        name: "DISBELIEF",
        trigger: "There's no way this is real",
        use_when: "Source presents a claim that seems too good to be true"
    },
    {
        name: "EMBARRASSMENT",
        trigger: "I can't believe I didn't see this",
        use_when: "Source reveals an obvious truth that was hidden in plain sight"
    },
    {
        name: "DETERMINATION",
        trigger: "I'm going to fix this",
        use_when: "Source identifies a problem with a clear call to action"
    }
]

// ═══════════════════════════════════════════════════════════════════
// CTA ENDINGS - 25 Conversation Closers
// ═══════════════════════════════════════════════════════════════════
// These spark genuine conversation, not formulaic engagement

export const CTA_ENDINGS = [
    // === HOT TAKE CHALLENGES ===
    "Change my mind.",
    "Prove me wrong.",
    "Tell me I'm crazy.",
    "Am I the only one who sees this?",

    // === CONFESSION PROMPTS ===
    "What's the worst mistake you made doing this?",
    "What's the hardest lesson you had to learn?",
    "What would you do differently?",
    "Where did you go wrong?",

    // === POLARIZING EITHER/ORS ===
    "Would you rather [option A] or [option B]?",
    "[Thing A] or [Thing B]? There's no middle ground.",
    "Speed or quality? Pick one.",

    // === PREDICTION PROBES ===
    "Where do you think this is heading?",
    "What happens next? I have my theory.",
    "In 2 years, will [prediction A] or [prediction B] win?",

    // === SPECIFIC STORY REQUESTS ===
    "What's the one time this backfired on you?",
    "When did this click for you?",
    "What made you finally get it?",

    // === BOLD STATEMENTS (No Question) ===
    "That's the game. Play it or don't.",
    "Take it or leave it.",
    "This is the way.",
    "You know what to do.",

    // === OPEN LOOPS ===
    "But that's a story for another time.",
    "The rest? I'll share next week.",
    "Stay tuned. There's more.",

    // === HANDOFFS ===
    "Your turn. What's your [source-specific thing]?",
    "Now you. What did I miss?"
]

// ═══════════════════════════════════════════════════════════════════
// POWER WORDS - Categorized Trigger Words
// ═══════════════════════════════════════════════════════════════════

export const POWER_WORDS = {
    urgency: [
        "now", "instantly", "immediately", "today", "deadline", "limited",
        "hurry", "rush", "final", "last chance", "before it's too late",
        "running out", "act fast", "don't wait", "time-sensitive", "ends soon",
        "while you still can", "closing soon", "urgent"
    ],
    curiosity: [
        "secret", "revealed", "hidden", "discover", "little-known", "unlock",
        "mystery", "insider", "confession", "forbidden", "untold", "truth about",
        "what nobody tells you", "behind the scenes", "exposed", "the real reason",
        "surprising", "unexpected", "strange but true"
    ],
    authority: [
        "proven", "research shows", "data confirms", "guaranteed", "certified",
        "tested", "verified", "expert", "official", "backed by", "industry leader",
        "according to", "studies show", "evidence-based", "science-backed"
    ],
    emotion: [
        "devastating", "life-changing", "game-changer", "breakthrough", "eye-opening",
        "mind-blowing", "unbelievable", "shocking", "heartbreaking", "triumphant",
        "jaw-dropping", "stunning", "incredible", "remarkable", "extraordinary"
    ],
    exclusivity: [
        "exclusive", "elite", "VIP", "members-only", "insider access", "first look",
        "early adopter", "handpicked", "selected", "rare", "limited edition",
        "not for everyone", "invite-only", "privileged"
    ],
    action: [
        "discover", "unlock", "master", "dominate", "crush", "transform",
        "revolutionize", "accelerate", "skyrocket", "explode", "ignite",
        "unleash", "conquer", "achieve", "accomplish"
    ]
}

// ═══════════════════════════════════════════════════════════════════
// DOMAIN NOUNS - Industry-Specific Physical Objects
// ═══════════════════════════════════════════════════════════════════

export const DOMAIN_NOUNS = {
    tech: ["codebase", "pull request", "deployment log", "error stack", "API docs",
        "test suite", "bug report", "sprint backlog", "architecture diagram"],
    marketing: ["campaign brief", "analytics dashboard", "client deck", "ad mockup",
        "content calendar", "engagement report", "brand guidelines", "creative brief"],
    sales: ["proposal deck", "quota sheet", "pipeline report", "contract", "objection log",
        "sales forecast", "call recording", "deal memo", "territory map"],
    finance: ["balance sheet", "P&L statement", "cash flow report", "investment memo",
        "due diligence doc", "term sheet", "financial model", "audit report"],
    strategy: ["roadmap document", "board presentation", "competitor analysis", "org chart",
        "strategic plan", "OKR sheet", "SWOT analysis", "business case"],
    product: ["PRD", "wireframe", "user story", "feature spec", "backlog", "roadmap",
        "customer feedback log", "NPS report", "A/B test results"],
    content: ["draft document", "editorial calendar", "style guide", "content audit",
        "SEO report", "engagement metrics", "audience research", "content brief"]
}

// ═══════════════════════════════════════════════════════════════════
// SHUFFLE MECHANISM - Fisher-Yates Algorithm
// ═══════════════════════════════════════════════════════════════════

/**
 * Fisher-Yates shuffle algorithm for true randomization
 * Creates a new shuffled copy without mutating original
 */
export function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/**
 * Variation Selector with No-Repeat Guarantee
 * 
 * How it works:
 * 1. First call: Shuffles the list and stores shuffled order
 * 2. Subsequent calls: Picks next item from shuffled list
 * 3. When list exhausted: Re-shuffles and starts over
 * 
 * This ensures:
 * - Random order (not predictable)
 * - No repeats until all options used
 * - Impossible to reverse-engineer the pattern
 */
export class VariationSelector<T> {
    private items: T[]
    private shuffledItems: T[]
    private currentIndex: number

    constructor(items: T[]) {
        this.items = items
        this.shuffledItems = shuffleArray(items)
        this.currentIndex = 0
    }

    /**
     * Get next variation (no repeats until list exhausted)
     */
    next(): T {
        // If we've used all items, reshuffle and start over
        if (this.currentIndex >= this.shuffledItems.length) {
            this.shuffledItems = shuffleArray(this.items)
            this.currentIndex = 0
        }

        const item = this.shuffledItems[this.currentIndex]
        this.currentIndex++
        return item
    }

    /**
     * Peek at next N items without consuming them
     */
    peek(count: number): T[] {
        const result: T[] = []
        let tempIndex = this.currentIndex
        let tempShuffled = [...this.shuffledItems]

        for (let i = 0; i < count; i++) {
            if (tempIndex >= tempShuffled.length) {
                tempShuffled = shuffleArray(this.items)
                tempIndex = 0
            }
            result.push(tempShuffled[tempIndex])
            tempIndex++
        }

        return result
    }

    /**
     * Get a batch of N non-repeating variations
     */
    batch(count: number): T[] {
        const result: T[] = []
        for (let i = 0; i < count; i++) {
            result.push(this.next())
        }
        return result
    }

    /**
     * Reset and reshuffle
     */
    reset(): void {
        this.shuffledItems = shuffleArray(this.items)
        this.currentIndex = 0
    }

    /**
     * Get remaining count before reshuffle
     */
    remainingCount(): number {
        return this.shuffledItems.length - this.currentIndex
    }
}

// ═══════════════════════════════════════════════════════════════════
// CONVENIENCE SELECTORS - Pre-initialized for each category
// ═══════════════════════════════════════════════════════════════════

// These can be imported and used directly
export const hookSelector = new VariationSelector(HOOK_STRUCTURES)
export const storyOpenerSelector = new VariationSelector(STORY_OPENERS)
export const voiceSelector = new VariationSelector(VOICE_ARCHETYPES)
export const emotionSelector = new VariationSelector(EMOTIONAL_TONES)
export const ctaSelector = new VariationSelector(CTA_ENDINGS)

/**
 * Get a complete variation set for one generation
 * Returns a unique combination of hook + voice + emotion + CTA
 */
export function getVariationSet() {
    return {
        hook: hookSelector.next(),
        voice: voiceSelector.next(),
        emotion: emotionSelector.next(),
        cta: ctaSelector.next()
    }
}

/**
 * Get a complete variation set for a 4-post series
 * Ensures all 4 posts use DIFFERENT variations
 */
export function getSeriesVariationSet() {
    return {
        hooks: hookSelector.batch(4),
        voices: voiceSelector.batch(4),
        emotions: emotionSelector.batch(4),
        ctas: ctaSelector.batch(4)
    }
}

/**
 * Get domain nouns for a specific industry
 */
export function getDomainNouns(domain: keyof typeof DOMAIN_NOUNS): string[] {
    return DOMAIN_NOUNS[domain] || DOMAIN_NOUNS.tech
}

/**
 * Detect domain from source text
 */
export function detectDomain(sourceText: string): keyof typeof DOMAIN_NOUNS {
    const text = sourceText.toLowerCase()

    if (text.includes('code') || text.includes('api') || text.includes('deploy') || text.includes('bug')) {
        return 'tech'
    }
    if (text.includes('campaign') || text.includes('brand') || text.includes('audience') || text.includes('content')) {
        return 'marketing'
    }
    if (text.includes('sales') || text.includes('deal') || text.includes('quota') || text.includes('pipeline')) {
        return 'sales'
    }
    if (text.includes('revenue') || text.includes('investment') || text.includes('financial') || text.includes('profit')) {
        return 'finance'
    }
    if (text.includes('strategy') || text.includes('competitive') || text.includes('roadmap') || text.includes('okr')) {
        return 'strategy'
    }
    if (text.includes('product') || text.includes('feature') || text.includes('user') || text.includes('backlog')) {
        return 'product'
    }
    if (text.includes('seo') || text.includes('blog') || text.includes('article') || text.includes('publish')) {
        return 'content'
    }

    return 'tech' // Default
}

/**
 * Get a random story opener with domain-specific noun
 */
export function getStoryOpenerWithNoun(sourceText: string): string {
    const domain = detectDomain(sourceText)
    const nouns = getDomainNouns(domain)
    const opener = storyOpenerSelector.next()
    const noun = nouns[Math.floor(Math.random() * nouns.length)]

    return opener.replace('[domain-noun]', noun)
}

/**
 * Get N random physical stake examples
 */
export function getRandomPhysicalExamples(count: number): string[] {
    const examples = [...STORY_CONSTRAINTS.PHYSICAL_STAKES.REQUIRED_EXAMPLES]

    // Fisher-Yates shuffle
    for (let i = examples.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [examples[i], examples[j]] = [examples[j], examples[i]];
    }

    return examples.slice(0, count)
}
