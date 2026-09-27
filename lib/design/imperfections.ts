export const imperfectionAngleVariants = ["base", 1, 2, 3, 4, 5, 6, 7, 8] as const;
export const imperfectionLengthVariants = ["compact", "regular", "wide"] as const;
export const imperfectionCutVariants = imperfectionAngleVariants;

export type ImperfectionAngle = (typeof imperfectionAngleVariants)[number];
export type ImperfectionLength = (typeof imperfectionLengthVariants)[number];
export type ImperfectionCut = (typeof imperfectionCutVariants)[number];

export type Imperfection = Readonly<{
  angle: ImperfectionAngle;
  cut: ImperfectionCut;
  length: ImperfectionLength;
  samples: readonly number[];
}>;

function hashIdentifier(identifier: string): number {
  let hash = 0x811c9dc5;

  for (const character of identifier) {
    hash ^= character.codePointAt(0) ?? 0;
    hash = Math.imul(hash, 0x01000193);
  }

  return hash >>> 0;
}

function pick<T>(values: readonly T[], hash: number, offset: number): T {
  const value = values[(hash >>> offset) % values.length];
  if (value === undefined) throw new Error("Imperfection variant is unavailable.");
  return value;
}

export function getImperfection(identifier: string): Imperfection {
  const normalizedIdentifier = identifier.trim();
  if (!normalizedIdentifier) {
    throw new Error("A stable business identifier is required for imperfections.");
  }

  const hash = hashIdentifier(normalizedIdentifier);
  let sampleHash = hash;
  const samples = Array.from({ length: 16 }, (_, index) => {
    sampleHash ^= index + 0x9e3779b9;
    sampleHash = Math.imul(sampleHash ^ (sampleHash >>> 16), 0x21f0aaad);
    sampleHash = Math.imul(sampleHash ^ (sampleHash >>> 15), 0x735a2d97);
    sampleHash ^= sampleHash >>> 15;
    return ((sampleHash >>> 0) / 0xffffffff) * 2 - 1;
  });

  return {
    angle: pick(imperfectionAngleVariants, hash, 0),
    cut: pick(imperfectionCutVariants, hash, 0),
    length: pick(imperfectionLengthVariants, hash, 8),
    samples,
  };
}
