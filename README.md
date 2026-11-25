[![make.fun](https://make.fun/badge/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb.svg)](https://make.fun/bounty/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb?utm_source=github&utm_medium=readme&utm_campaign=u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb)
[![rank](https://make.fun/badge/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb/qw123gyj-dev/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb/rank.svg)](https://make.fun/bounty/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb)
[![reward](https://make.fun/badge/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb/qw123gyj-dev/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb/reward.svg)](https://make.fun/bounty/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb?utm_source=github&utm_medium=readme&utm_campaign=u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb)

# The Tired Dark Lord: A 100-Word Villain Monologue

A program that writes one monologue of about 100 words, spoken by a fantasy villain who is secretly just very tired. It holds fifteen hand-written candidate monologues — fifteen different villains, each with a named history and a named scheme — scores them against the judge's brief in the brief's own order (on-subject first, then tiredness felt rather than announced, then a specific villain with concrete detail, then speakable dialogue with a sting in the last line, then closeness to 100 words), gates out any candidate outside 90–110 words, and writes the winner to `entry.txt`.

The tiredness is never announced. No candidate ever says the villain is tired, weary, exhausted or sleepy. Instead it lives where tiredness actually lives in speech: in trailing off mid-sentence, in pausing on an em dash, in correcting oneself, and in putting the dreadful thing off until Tuesday, Thursday, or "after the dancing".

## The winning entry

Pello, Keeper of the Strings — 103 words:

> Careful. The strings tangle if you rush, and you always rush. I am Pello, Keeper of the Strings, and every courtier in the capital dances when I lift a finger — the king, the generals, the pretty duchess with the painted smile. Three hundred years of pulling, and my hands... my hands remember every knot. You came to cut the strings? Then cut them, hero. The puppets need restringing, the stage needs sweeping, and the final act — the final act has been waiting since your grandfather was a boy in the cheap seats. Sit. Watch. One more scene. One more bow. Then — tomorrow, hero?

## Run

```sh
MAKEFUN_OUTPUT_DIR=/tmp/u-kevin-the-tired-dark-lord-a-100-word-villain-58b4f3cb-out node main.ts
```

Node 22+, standard library only, no network, fully deterministic. The program prints every candidate's score, writes the winner to `$MAKEFUN_OUTPUT_DIR/entry.txt` (fallback `/output/entry.txt`), reads it back and verifies it byte for byte, exiting non-zero on any mismatch.
