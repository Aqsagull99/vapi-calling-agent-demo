import { HERO } from '../config'

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-copy">
        <span className="eyebrow">
          <span className="eyebrow-dot" aria-hidden="true" />
          {HERO.eyebrow}
        </span>
        <h1>{HERO.title}</h1>
        <p>{HERO.subtitle}</p>
      </div>
      <dl className="hero-stats">
        {HERO.stats.map((stat) => (
          <div key={stat.label}>
            <dt>{stat.value}</dt>
            <dd>{stat.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
