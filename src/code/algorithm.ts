import { elementMap } from "./data";

export interface MatchPart {
    symbol: string;
    atomicNumber: number | null;
}

interface SearchResult {
    score: number;
    parts: MatchPart[];
}

export default function elementSpelling(word: string): MatchPart[] {
    word = word.toLowerCase();

    const memo = new Map<number, SearchResult>();

    function dfs(index: number): SearchResult {
        if (index === word.length) {
            return {
                score: 0,
                parts: []
            };
        }

        const cached = memo.get(index);
        if (cached) {
            return cached;
        }

        let best: SearchResult | null = null;

        // Prefer longer symbols
        for (let len = 2; len >= 1; len--) {
            if (index + len > word.length) continue;

            const symbol = word.substring(index, index + len);

            const atomicNumber = elementMap.get(symbol);

            if (atomicNumber === undefined) continue;

            const next = dfs(index + len);

            const candidate: SearchResult = {
                score: next.score + (len === 2 ? 100 : 10),
                parts: [
                    {
                        symbol,
                        atomicNumber
                    },
                    ...next.parts
                ]
            };

            if (!best || candidate.score > best.score) {
                best = candidate;
            }
        }

        // Allow unmatched characters
        const skipped = dfs(index + 1);

        const skipCandidate: SearchResult = {
            score: skipped.score - 50,
            parts: [
                {
                    symbol: word[index],
                    atomicNumber: null
                },
                ...skipped.parts
            ]
        };

        if (!best || skipCandidate.score > best.score) {
            best = skipCandidate;
        }

        memo.set(index, best);

        return best;
    }

    return dfs(0).parts;
}