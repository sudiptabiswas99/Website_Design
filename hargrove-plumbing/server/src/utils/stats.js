// Pure statistics — no deps. Used to decide whether an A/B difference is real.

// Normal CDF via the Abramowitz & Stegun 7.1.26 error-function approximation.
function erf(x) {
  const t = 1 / (1 + 0.3275911 * Math.abs(x));
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) *
      t *
      Math.exp(-x * x);
  return x >= 0 ? y : -y;
}

const normCdf = (z) => 0.5 * (1 + erf(z / Math.SQRT2));

// Two-proportion z-test (two-tailed). Returns { z, p } or nulls when undefined.
export function twoProportionZTest(aConv, aN, bConv, bN) {
  if (!aN || !bN) return { z: null, p: null };
  const pA = aConv / aN;
  const pB = bConv / bN;
  const pPool = (aConv + bConv) / (aN + bN);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / aN + 1 / bN));
  if (se === 0) return { z: 0, p: 1 };
  const z = (pB - pA) / se;
  const p = 2 * (1 - normCdf(Math.abs(z)));
  return { z, p };
}
