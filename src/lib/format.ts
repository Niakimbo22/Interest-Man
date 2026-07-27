// Helpers de formatage (euros, quantités, pourcentages) — locale FR.

const eur0 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const eur2 = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 })

/** Montant en euros ; sans décimales au-dessus de 100 €, sinon 2 décimales. */
export function money(v: number): string {
  return Math.abs(v) >= 100 ? eur0.format(v) : eur2.format(v)
}

/** Prix d'un actif : plus de précision pour les petits prix (ex: DOGE). */
export function price(v: number): string {
  if (v >= 1000) return eur0.format(v)
  if (v >= 1) return eur2.format(v)
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 4 }).format(v)
}

/** Quantité détenue : précision adaptée aux fractions de crypto. */
export function qty(v: number): string {
  if (v >= 1000) return v.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
  if (v >= 1) return v.toLocaleString('fr-FR', { maximumFractionDigits: 4 })
  return v.toLocaleString('fr-FR', { maximumFractionDigits: 6 })
}

export function pct(v: number): string {
  const s = (v * 100).toLocaleString('fr-FR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
  return `${v >= 0 ? '+' : ''}${s} %`
}

/** Variation relative entre deux prix. */
export function change(current: number, prev: number): number {
  if (!prev) return 0
  return (current - prev) / prev
}
