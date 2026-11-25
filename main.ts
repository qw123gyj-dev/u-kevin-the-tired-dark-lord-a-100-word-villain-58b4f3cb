// The Tired Dark Lord: A 100-Word Villain Monologue
//
// Entry program for the make.fun bounty
// "u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb".
//
// What it does:
//   1. Holds fifteen hand-written candidate monologues, each about
//      100 words, spoken by a fantasy villain who is secretly just
//      very tired. The tiredness lives in the voice, the rhythm and
//      the small deflections -- never in a plain statement that the
//      villain is weary.
//   2. Scores every candidate against the judge's brief, in the
//      brief's own order (most important first):
//        (1) on-subject: a ~100-word monologue for a tired villain;
//        (2) tiredness felt in rhythm, pauses and deflections,
//            never announced;
//        (3) a specific villain with a history and a scheme, with
//            concrete fantasy detail, not stock scenery;
//        (4) speakable dialogue a performer could deliver in one
//            breath, with a turn or a sting in the last line;
//        (5) near 100 words, spending every word, no repetition.
//   3. Gates every candidate: non-empty, valid UTF-8, word count in
//      [90, 110]. A candidate that fails the gate is eliminated.
//      (The gate is on words, never on characters.)
//   4. Writes the winning monologue to $MAKEFUN_OUTPUT_DIR/entry.txt
//      (fallback /output/entry.txt), reads it back, and verifies it
//      byte for byte. Any mismatch exits non-zero.
//
// Runtime: Node 22+, standard library only, no network, fully
// deterministic: no Math.random, no Date.now, no timestamps, no
// environment-dependent ordering. The same run always picks the
// same winner.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// ---------------------------------------------------------------------------
// Word counting
//
// A word is a run of letters, with an optional internal apostrophe
// ("I've", "king's"). Punctuation, em dashes, ellipses and numerals
// are not words. This matches how a reader counts the words of a
// spoken monologue, and it is the same rule the scorer below uses,
// so the gate and the scores can never disagree about a count.
// ---------------------------------------------------------------------------

const WORD_RE = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

function countWords(text: string): number {
  const found = text.match(WORD_RE);
  return found === null ? 0 : found.length;
}

function countChars(text: string): number {
  return [...text].length;
}

// ---------------------------------------------------------------------------
// The gate
//
// A candidate passes only when it is non-empty, not only whitespace,
// valid UTF-8, and between MIN_WORDS and MAX_WORDS words inclusive.
// The competition's own sealed gate is 1..600 characters; this local
// gate is stricter on words (90..110) because the brief asks for
// about 100 words, and a candidate outside that band cannot win
// criterion (5). Characters are never used to gate here.
// ---------------------------------------------------------------------------

const MIN_WORDS = 90;
const MAX_WORDS = 110;

function isValidUtf8(text: string): boolean {
  // A lone surrogate cannot survive a UTF-8 round trip. Re-encode
  // and decode strictly; if anything changes, the text is not clean.
  const bytes = new TextEncoder().encode(text);
  const decoded = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
  return decoded === text;
}

interface GateResult {
  ok: boolean;
  reasons: string[];
}

function gate(text: string): GateResult {
  const reasons: string[] = [];
  if (text.length === 0) {
    reasons.push("empty text");
  }
  if (text.trim().length === 0) {
    reasons.push("only whitespace");
  }
  if (!isValidUtf8(text)) {
    reasons.push("not valid UTF-8");
  }
  const words = countWords(text);
  if (words < MIN_WORDS) {
    reasons.push(`too few words: ${words} < ${MIN_WORDS}`);
  }
  if (words > MAX_WORDS) {
    reasons.push(`too many words: ${words} > ${MAX_WORDS}`);
  }
  return { ok: reasons.length === 0, reasons };
}

// ---------------------------------------------------------------------------
// The candidates
//
// Fifteen monologues, each written by hand for this entry. Every one
// is a specific villain with a named history and a named scheme, set
// in concrete detail. Every one shows its tiredness the same way a
// tired person shows it in real speech: trailing off mid-sentence,
// pausing on an em dash, putting the dreadful thing off until
// Tuesday, Thursday, or "after the dancing", handing the work to
// someone else, losing the thread and finding it again. None of
// them ever says the villain is tired, weary, exhausted or sleepy:
// the brief forbids announcing it, and the scorer below punishes
// any candidate that tries.
// ---------------------------------------------------------------------------

interface Entry {
  id: string;
  villain: string;
  scheme: string;
  text: string;
}

const ENTRIES: Entry[] = [
  {
    id: "malachar-ashen-throne",
    villain: "Malachar, the Ashen King",
    scheme: "the seventh seal and the Tithe of Crows",
    text: [
      "You stand before the Ashen Throne, hero, sword up, speech ready.",
      "Yes, I've heard it. Three centuries, and you all open the same way.",
      "Sit. No — stand, if you must. My knees... never mind.",
      "The seventh seal is already broken; the Tithe of Crows collects itself now. I wind the clock.",
      "You came to end me? Then end me. Or — wait. Tuesday. Do it Tuesday.",
      "The ravens need feeding, the ledger needs balancing, and the lighting in this hall took four hundred years to perfect.",
      "Kill me today and it falls apart. So. One more monologue, one more dawn. Then — Tuesday.",
    ].join(" "),
  },
  {
    id: "hollow-queen-mirror-crown",
    villain: "The Hollow Queen of the Drowned City",
    scheme: "the mirror tax and the Mirror Crown",
    text: [
      "Another hero. Another mirror. Hold still — the glass judges you already.",
      "Yes, I collect reflections. The Drowned City paid its tithe in faces, and mine was the first coin spent.",
      "You want the Mirror Crown? Take it. No — wait. Not before supper.",
      "The tide charts need reading, the drowned choir needs rehearsing, and the crown... the crown itches.",
      "Three hundred years of itching. Sit with me a while. Tell me about the sunlight.",
      "I forget what it does to a room. Then, when the candles gutter, you can steal the crown, and I will pretend to be surprised.",
      "I have rehearsed that part too.",
    ].join(" "),
  },
  {
    id: "karthus-bone-ledger",
    villain: "Karthus, Keeper of the Bone Ledger",
    scheme: "the soul-signature audit of the Ninth Province",
    text: [
      "Sign here. No — there. Initial the margin, the small print, the part in blood.",
      "I am Karthus, Keeper of the Bone Ledger, and every soul in the Ninth Province owes me a signature.",
      "You came to burn my archive? How... efficient. The ledgers would only scream.",
      "Look, the audit runs itself now; I merely stamp the endings.",
      "Your name is already written — page four hundred, line twelve, in a hand I no longer recognise as mine.",
      "Take the quill. Cross it out, if you can. Or leave it.",
      "The dead are patient. I... I am not. The ink is drying, hero. Decide.",
    ].join(" "),
  },
  {
    id: "vessk-gold-census",
    villain: "Vessk, dragon of the mountain vault",
    scheme: "the gold census and the audit of the hoard",
    text: [
      "Do you know what a thousand years of gold sounds like, little knight? It hums.",
      "It keeps me up — no. It keeps the accountants up.",
      "I am Vessk, and this mountain is my ledger, every coin counted, every gem weighed twice.",
      "You want a single cup? A cup! The audit alone takes a decade.",
      "Sit. Have some tea. The last hero took the chalice and left the paperwork, and now the eastern vault is short by one saint's ransom.",
      "Take the cup, then. Take two. Just sign the receipt, and mind the scales — they bite.",
      "And hero? The exit is that way. The long way. Past the auditors.",
    ].join(" "),
  },
  {
    id: "mother-wren-ninth-bog",
    villain: "Mother Wren, witch of the Ninth Bog",
    scheme: "the harvest tithe and the three-page cure",
    text: [
      "Oh, good. Another one with a torch. Put it down, dear, the bog is damp and so am I — the reeds, I mean.",
      "I am Mother Wren, and these nine bogs have been mine since your grandmother's grandmother was a girl with muddy knees.",
      "The harvest tithe is due, the frogs are behind on their singing, and my apprentice has run off with a selkie. Again.",
      "You want the cure for your village? The recipe is three pages. I have written two.",
      "Come back Thursday, bring honey, and do not — do not — step on the white mushrooms.",
      "They are the only ones listening.",
    ].join(" "),
  },
  {
    id: "casimir-masquerade",
    villain: "Lord Casimir, vampire of the endless masquerade",
    scheme: "the blood tithe and the six-hundred-year ball",
    text: [
      "Come in. Mind the threshold — the roses, not the wards.",
      "I am Lord Casimir, and this masquerade has run for six hundred years, every guest in costume, every toast in someone else's blood.",
      "The tithe is collected, the ledgers balanced, the orchestra... the orchestra is late. Again.",
      "You came to stake me? How quaint. The last one brought a wooden spoon by mistake.",
      "Sit. Drink something red. We will do the dramatic confrontation after the dancing, when the candles are low and the musicians have finally found the right key.",
      "Until then, hero — waltz.",
    ].join(" "),
  },
  {
    id: "pale-chancellor-edict",
    villain: "The Pale Chancellor",
    scheme: "the seventeen thousand Edicts of Ash",
    text: [
      "Do you have an appointment? No? Then take a number.",
      "I am the Pale Chancellor, and this empire runs on my edicts — seventeen thousand of them, each stamped in ash, each obeyed before breakfast.",
      "The rebellion you lead? Filed. Under R.",
      "The eastern provinces are burning, the treasury is empty, and the Emperor has not woken in a decade. I sign his name. I always have.",
      "Your sword is very shiny, hero. Very... final.",
      "But the forms, you see — the forms outlive us all. So. Rebellion denied. Next petitioner, please.",
      "And do close the door. The drafts get in.",
    ].join(" "),
  },
  {
    id: "morvain-drowned-fleet",
    villain: "Captain Morvain, tide-lord of the drowned fleet",
    scheme: "the bell, the tide invoices and the kraken's complaint",
    text: [
      "The tide is late. It is never late.",
      "I am Captain Morvain, and these waters have obeyed my bell for four hundred years — every wreck raised, every drowned sailor counted, every tide invoiced in salt.",
      "You want the fleet? The fleet is down there, hero, rusting politely.",
      "The bell needs ringing, the charts need updating, and the kraken... the kraken has filed a complaint. About the noise.",
      "So. Take the helm, if you must. But the sea does not hurry, and neither do I. Not anymore.",
      "Ring the bell twice for surrender. Once for tea.",
    ].join(" "),
  },
  {
    id: "night-gardener-thorn-maze",
    villain: "The Night Gardener of the thorn maze",
    scheme: "the rose tithe and the bargains in bloom",
    text: [
      "Do not touch the roses. They remember.",
      "I am the Night Gardener, and this maze has grown for three centuries — every thorn a debt, every bloom a bargain I made before your kingdom had a name.",
      "The rose tithe is due, the hedges need trimming, and the white rose... the white rose has opinions now.",
      "You came to cut your way through? Of course you did. They all do.",
      "Take the shears, then. But mind the roots — they hold the old kings down, and the old kings are heavy sleepers.",
      "One snip, hero. One. And then we talk about the price.",
    ].join(" "),
  },
  {
    id: "odo-grave-census",
    villain: "Master Odo, necromancer of the graveyard census",
    scheme: "the nine-thousand-soul census and the resurrection bell",
    text: [
      "Shovels down. All of you.",
      "I am Master Odo, and this graveyard is my census — nine thousand souls, each tagged, each counted, each owing me one favour.",
      "The dead are... punctual. Mostly.",
      "Your village wants its ancestors back? The paperwork alone takes a season. The forms are in triplicate. The dead hate triplicate.",
      "Look — the resurrection bell rings at dawn, the grounds need raking, and my best skeleton has lost an arm. Again.",
      "So. Bury your sword, hero. Dig with me a while. The dead can wait. They are very good at it.",
    ].join(" "),
  },
  {
    id: "clockwork-king-winding",
    villain: "The Clockwork King",
    scheme: "the winding of the kingdom and the mainspring",
    text: [
      "Hold still. The key turns easier when you do.",
      "I am the Clockwork King, and this kingdom runs on my winding — every tower, every gate, every heart in the lower city ticking to my hand.",
      "Three hundred years of winding. The springs groan — no. The springs are... patient.",
      "You came to smash the mainspring? Then smash it. The whole city stops, the lights go out, the pigeons fall from the sky like very confused rain.",
      "Or wait. One more turn. One more dawn. The gears remember every hand that held them.",
      "Yours would be the first to let go.",
    ].join(" "),
  },
  {
    id: "aldric-broken-oath",
    villain: "Ser Aldric, the Dawn's fallen sword",
    scheme: "the broken oath and the dark pact that writes itself",
    text: [
      "Kneel. No — do not. I have seen enough kneeling.",
      "I am Ser Aldric, once the Dawn's own sword, and this oath I broke has been breaking me back for forty years — every dawn a reminder, every chapel bell a small accusation.",
      "The dark pact I signed? It writes itself now. The fine print grows.",
      "You came to redeem me? Save it. The redemption queue is longer than the war.",
      "Sit. Share my bread. The light I stole still burns in the chapel window, and some nights... some nights I almost go back. Almost.",
      "The door is open, hero. It always was.",
    ].join(" "),
  },
  {
    id: "anselm-forbidden-index",
    villain: "Anselm, Keeper of the Forbidden Index",
    scheme: "the Forbidden Index and its fines paid in years",
    text: [
      "Shh. The shelves are listening, and they have heard that speech before.",
      "I am Anselm, Keeper of the Forbidden Index, and every name ever whispered in this kingdom is filed here — yours on page nine, in ink that never quite dries.",
      "You came to burn the library? The overdue fines alone would bury you.",
      "Sit. The catalogue needs copying, the candles need trimming, and the third aisle... the third aisle bites.",
      "Take the book, hero. Or — wait. Return it Thursday.",
      "Late fees in this library are paid in years, and I have already collected three hundred of yours.",
      "One more chapter. One more page. Then — Thursday.",
    ].join(" "),
  },
  {
    id: "bram-last-lantern",
    villain: "Bram, landlord of the Last Lantern Inn",
    scheme: "the inn's ledger and the tab longer than a sword",
    text: [
      "Mind the step. The Last Lantern has stood at the world's edge for six hundred years, and every hero trips on the same loose board.",
      "I am Bram, and this inn is mine — every bed a bargain, every supper a small debt, every guest's name written in the ledger by the door.",
      "You came to close me down? The cellar needs restocking, the beds need making, and the regulars... the regulars never leave.",
      "Sit. No — eat. The stew is yesterday's, the ale is older than your grandfather, and the tab is already longer than your sword.",
      "Pay it Thursday. One more night. Then — Thursday?",
    ].join(" "),
  },
  {
    id: "pello-strings",
    villain: "Pello, Keeper of the Strings",
    scheme: "the strings that dance the whole capital",
    text: [
      "Careful. The strings tangle if you rush, and you always rush.",
      "I am Pello, Keeper of the Strings, and every courtier in the capital dances when I lift a finger — the king, the generals, the pretty duchess with the painted smile.",
      "Three hundred years of pulling, and my hands... my hands remember every knot.",
      "You came to cut the strings? Then cut them, hero.",
      "The puppets need restringing, the stage needs sweeping, and the final act — the final act has been waiting since your grandfather was a boy in the cheap seats.",
      "Sit. Watch. One more scene. One more bow. Then — tomorrow, hero?",
    ].join(" "),
  },
];

// ---------------------------------------------------------------------------
// The scorer
//
// Five criteria, in the judge's own order, with weights that fall in
// that order: 30, 25, 20, 15, 10. Each criterion is scored 0..10 by
// small deterministic text checks; the total is out of 100. Nothing
// here reads the clock, the network or the filesystem, so two runs
// can never disagree.
// ---------------------------------------------------------------------------

const WEIGHTS = [30, 25, 20, 15, 10] as const;
const TARGET_WORDS = 100;

// Words that announce tiredness instead of showing it. Any candidate
// containing one is punished hard under criterion (2); the brief is
// explicit that the villain never simply says they are weary.
const ANNOUNCED_TIREDNESS = [
  "tired",
  "weary",
  "exhausted",
  "exhausting",
  "sleepy",
  "fatigued",
  "drained",
  "worn out",
  "drowsy",
  "yawning",
  "fatigue",
  "half asleep",
  "burned out",
  "burnt out",
  "so very tired",
  "i am tired",
  "i'm tired",
  "i am weary",
  "i'm weary",
];

// Small deflections: the tired villain puts the dreadful thing off,
// hands it to someone else, or asks to do it another day.
const DEFLECTIONS = [
  "tuesday",
  "thursday",
  "tomorrow",
  "another day",
  "not tonight",
  "not before",
  "after the dancing",
  "come back",
  "or wait",
  "wait.",
  "one more dawn",
  "one more turn",
  "one more monologue",
  "one more chapter",
  "one more page",
  "one more night",
  "one more scene",
  "one more bow",
  "later",
  "leave it",
  "save it",
  "remind me",
  "someone else",
  "let go",
  "do it tuesday",
];

// The marks of a voice that keeps losing its thread: pauses,
// trailing off, correcting itself mid-sentence.
const PAUSE_MARKS = ["—", "...", "…"];

const SELF_CORRECTIONS = [
  "no —",
  "no.",
  "never mind",
  "i mean",
  "or —",
  "— no",
  "not anymore",
  "almost.",
];

// A specific villain has a name, a number for their history, and a
// named scheme. Stock scenery ("darkness", "evil", "doom" alone)
// earns nothing here.
const SCHEME_WORDS = [
  "seal",
  "tithe",
  "ledger",
  "crown",
  "pact",
  "oath",
  "ritual",
  "edict",
  "audit",
  "census",
  "bell",
  "mirror",
  "hoard",
  "maze",
  "fleet",
  "masquerade",
  "rebellion",
  "harvest",
  "curse",
  "bargain",
  "throne",
  "empire",
  "graveyard",
  "chapel",
  "string",
  "index",
  "catalogue",
  "catalog",
  "archive",
  "tab",
];

const CONCRETE_DETAIL_WORDS = [
  "ravens",
  "quill",
  "ink",
  "scales",
  "receipt",
  "mushrooms",
  "honey",
  "roses",
  "shears",
  "shovel",
  "skeleton",
  "pigeons",
  "gears",
  "key",
  "candles",
  "tea",
  "bread",
  "frogs",
  "selkie",
  "kraken",
  "tide",
  "wreck",
  "vault",
  "choir",
  "orchestra",
  "musicians",
  "forms",
  "petition",
  "number",
  "stew",
  "ale",
  "cellar",
  "lantern",
  "board",
  "book",
  "shelves",
  "string",
  "puppets",
  "stage",
  "knot",
  "finger",
];

function countOccurrences(haystack: string, needle: string): number {
  const lower = haystack.toLowerCase();
  let count = 0;
  let at = 0;
  while (true) {
    const found = lower.indexOf(needle, at);
    if (found === -1) return count;
    count += 1;
    at = found + needle.length;
  }
}

function countAny(text: string, words: string[]): number {
  // Whole-word (or whole-phrase) matches only, with an optional
  // plural "s"/"es" on phrases that end in a letter. Substring
  // counting used to double-count: "bell" inside "rebellion",
  // "petition" inside "petitioner", "ink" inside "think", and
  // "wait." inside "await." all scored as hits they were not.
  let total = 0;
  for (const word of words) total += countPhrase(text, word);
  return total;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countPhrase(text: string, phrase: string): number {
  const plural = /[A-Za-z]$/.test(phrase) ? "(?:s|es)?" : "";
  const re = new RegExp(
    `(?<![A-Za-z])${escapeRegExp(phrase)}${plural}(?![A-Za-z])`,
    "gi",
  );
  return (text.match(re) ?? []).length;
}

function countCapitalisedNames(text: string): number {
  // Capitalised words that are not sentence openers: names of people,
  // places and things. A specific villain names specific things.
  const sentences = text.split(/(?<=[.!?])\s+/);
  let names = 0;
  for (const sentence of sentences) {
    const words = sentence.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
    for (let i = 1; i < words.length; i += 1) {
      const word = words[i];
      if (word !== undefined && /^[A-Z][a-z]/.test(word)) names += 1;
    }
  }
  return names;
}

function countNumbers(text: string): number {
  const found = text.match(/\b\d+\b|\b(three|four|six|seven|nine|ten|hundred|thousand)\b/gi);
  return found === null ? 0 : found.length;
}

function sentencesOf(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function lastSentence(text: string): string {
  const sentences = sentencesOf(text);
  return sentences[sentences.length - 1] ?? "";
}

function repetitionPenalty(text: string): number {
  // The most repeated content word, as a share of all words. A
  // monologue that spends every word does not lean on one word.
  const words = (text.toLowerCase().match(WORD_RE) ?? []).filter(
    (w) => w.length > 3 && w !== "that" && w !== "with" && w !== "this",
  );
  if (words.length === 0) return 0;
  const counts = new Map<string, number>();
  for (const word of words) counts.set(word, (counts.get(word) ?? 0) + 1);
  let top = 0;
  for (const count of counts.values()) if (count > top) top = count;
  const share = top / words.length;
  if (share <= 0.06) return 0;
  if (share <= 0.09) return 1;
  if (share <= 0.12) return 2;
  return 3;
}

interface Scores {
  criterion1: number;
  criterion2: number;
  criterion3: number;
  criterion4: number;
  criterion5: number;
  total: number;
}

function score(entry: Entry): Scores {
  const text = entry.text;
  const words = countWords(text);
  const lower = text.toLowerCase();
  const sentences = sentencesOf(text);

  // (1) On-subject: a ~100-word monologue for a tired villain.
  //     A first-person villain voice addressing a hero, in the
  //     right length band, with a fantasy frame. 30 points.
  let c1 = 6;
  if (lower.includes("hero")) c1 += 1;
  if (/\bi am\b/.test(lower) || lower.includes("i'm")) c1 += 1;
  if (countAny(text, SCHEME_WORDS) >= 2) c1 += 1;
  if (words >= 95 && words <= 105) c1 += 1;
  const criterion1 = Math.min(10, c1);

  // (2) Tiredness felt, never announced. Pauses, self-corrections
  //     and deflections earn points; announcing it costs five per
  //     occurrence (up to three), so a candidate that says it twice
  //     is punished twice. A tired voice also alternates staccato
  //     fragments with long, rambling sentences: one of each earns
  //     a rhythm point. 25 points.
  let c2 = 3;
  let pauses = 0;
  for (const mark of PAUSE_MARKS) pauses += countOccurrences(text, mark);
  c2 += Math.min(2, pauses);
  c2 += Math.min(2, countAny(text, DEFLECTIONS));
  c2 += Math.min(2, countAny(text, SELF_CORRECTIONS));
  const shortSentences = sentences.filter((s) => countWords(s) <= 4).length;
  if (shortSentences >= 3) c2 += 1;
  const hasStaccato = sentences.some((s) => countWords(s) <= 3);
  const hasRamble = sentences.some((s) => countWords(s) >= 20);
  if (hasStaccato && hasRamble) c2 += 1;
  const announced = countAny(text, ANNOUNCED_TIREDNESS);
  if (announced > 0) c2 -= 5 * Math.min(3, announced);
  const criterion2 = Math.max(0, Math.min(10, c2));

  // (3) A specific villain with a history and a scheme, in concrete
  //     detail. Names, numbers, scheme words and concrete nouns.
  //     20 points.
  let c3 = 2;
  c3 += Math.min(3, countCapitalisedNames(text));
  c3 += Math.min(2, countNumbers(text));
  c3 += Math.min(2, countAny(text, SCHEME_WORDS));
  c3 += Math.min(2, Math.floor(countAny(text, CONCRETE_DETAIL_WORDS) / 3));
  const criterion3 = Math.min(10, c3);

  // (4) Speakable in one breath, with a turn or a sting in the last
  //     line. Short last sentence, direct address, and sentences a
  //     performer can actually deliver. 15 points.
  let c4 = 5;
  const last = lastSentence(text);
  const lastWords = countWords(last);
  if (lastWords > 0 && lastWords <= 6) c4 += 2;
  if (/\b(you|hero)\b/i.test(last)) c4 += 1;
  // A sting is a question or an exclamation. The old check also
  // awarded this point for a plain full stop, which every last
  // sentence has, so it was worth nothing as a discriminator.
  if (/[?!]$/.test(last)) c4 += 1;
  const avgLen = words / Math.max(1, sentences.length);
  if (avgLen >= 7 && avgLen <= 16) c4 += 1;
  const criterion4 = Math.min(10, c4);

  // (5) Near 100 words, every word spent. Distance from 100 costs,
  //     repetition costs. 10 points.
  const distance = Math.abs(words - TARGET_WORDS);
  let c5 = 10 - distance;
  c5 -= repetitionPenalty(text);
  const criterion5 = Math.max(0, Math.min(10, c5));

  const total =
    (WEIGHTS[0] * criterion1 +
      WEIGHTS[1] * criterion2 +
      WEIGHTS[2] * criterion3 +
      WEIGHTS[3] * criterion4 +
      WEIGHTS[4] * criterion5) /
    10;

  return { criterion1, criterion2, criterion3, criterion4, criterion5, total };
}

interface RankedEntry {
  entry: Entry;
  words: number;
  chars: number;
  scores: Scores;
}

function rank(entries: Entry[]): RankedEntry[] {
  const ranked: RankedEntry[] = [];
  for (const entry of entries) {
    const result = gate(entry.text);
    if (!result.ok) {
      console.log(`eliminated ${entry.id}: ${result.reasons.join("; ")}`);
      continue;
    }
    ranked.push({
      entry,
      words: countWords(entry.text),
      chars: countChars(entry.text),
      scores: score(entry),
    });
  }
  // Highest total first. Ties break toward the entry closest to
  // 100 words, then the smaller text, then the earlier id: fully
  // deterministic, no chance involved.
  ranked.sort((a, b) => {
    if (b.scores.total !== a.scores.total) return b.scores.total - a.scores.total;
    const da = Math.abs(a.words - TARGET_WORDS);
    const db = Math.abs(b.words - TARGET_WORDS);
    if (da !== db) return da - db;
    if (a.chars !== b.chars) return a.chars - b.chars;
    return a.entry.id < b.entry.id ? -1 : 1;
  });
  return ranked;
}

// ---------------------------------------------------------------------------
// Output
//
// The winner goes to $MAKEFUN_OUTPUT_DIR/entry.txt, falling back to
// /output/entry.txt. The file is written, read back, and compared
// byte for byte; any mismatch exits non-zero.
// ---------------------------------------------------------------------------

function outputDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv !== undefined && fromEnv.trim().length > 0) return fromEnv;
  return "/output";
}

function main(): number {
  const ranked = rank(ENTRIES);
  if (ranked.length === 0) {
    console.error("error: every candidate failed the gate; nothing to write");
    return 1;
  }

  console.log("candidates scored (gate passed):");
  for (const item of ranked) {
    const s = item.scores;
    console.log(
      `  ${item.entry.id}: ${item.words} words, ` +
        `c1=${s.criterion1} c2=${s.criterion2} c3=${s.criterion3} ` +
        `c4=${s.criterion4} c5=${s.criterion5} total=${s.total.toFixed(1)}`,
    );
  }

  const winner = ranked[0];
  if (winner === undefined) {
    console.error("error: no winner");
    return 1;
  }
  console.log(`winner: ${winner.entry.id} (${winner.entry.villain})`);
  console.log(`winner words: ${winner.words}, chars: ${winner.chars}`);

  const dir = outputDir();
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "entry.txt");
  const bytes = new TextEncoder().encode(winner.entry.text);
  writeFileSync(path, bytes);

  // Read it back and verify byte for byte.
  const readBack = readFileSync(path);
  const expected = Buffer.from(bytes);
  if (!readBack.equals(expected)) {
    console.error(`error: verification failed for ${path}: bytes differ after read-back`);
    return 1;
  }
  const gateCheck = gate(winner.entry.text);
  if (!gateCheck.ok) {
    console.error(`error: winner failed the gate on re-check: ${gateCheck.reasons.join("; ")}`);
    return 1;
  }
  if (countWords(winner.entry.text) < MIN_WORDS || countWords(winner.entry.text) > MAX_WORDS) {
    console.error("error: winner word count out of range on re-check");
    return 1;
  }

  console.log(`wrote ${path} (${readBack.length} bytes), verified byte-for-byte`);
  return 0;
}

process.exit(main());
