import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  return (
    <div style={{ background: '#0a0a0f', minHeight: '100vh', color: '#e8e8f0', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>
      
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.2rem 2.5rem',
        background: 'rgba(10,10,15,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e1e2e',
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '1.1rem' }}>
          Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button onClick={() => navigate('/login')} style={{
            background: 'transparent', border: '1px solid #1e1e2e',
            color: '#6b6b80', padding: '0.5rem 1.2rem', borderRadius: '6px',
            cursor: 'pointer', fontSize: '0.85rem',
          }}>
            Sign In
          </button>
          <button onClick={() => navigate('/register')} style={{
            background: '#ff4d6d', border: 'none',
            color: 'white', padding: '0.5rem 1.2rem', borderRadius: '6px',
            cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600,
          }}>
            Start Free →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '8rem 2rem 4rem',
        background: 'radial-gradient(ellipse at top, rgba(255,77,109,0.08) 0%, transparent 60%)',
      }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
          fontFamily: 'Space Mono, monospace', fontSize: '0.7rem',
          color: '#00d9ff', border: '1px solid rgba(0,217,255,0.25)',
          background: 'rgba(0,217,255,0.06)', padding: '0.35rem 0.9rem',
          borderRadius: '999px', marginBottom: '2rem', letterSpacing: '0.08em',
        }}>
          <span style={{ width: 6, height: 6, background: '#00d9ff', borderRadius: '50%', display: 'inline-block' }} />
          FREE DURING BETA · NO CREDIT CARD
        </div>

        <h1 style={{
          fontFamily: 'Space Mono, monospace', fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 700, lineHeight: 1.1, letterSpacing: '-0.04em',
          maxWidth: '800px', marginBottom: '1.5rem',
        }}>
          Stop getting<br />
          <span style={{ color: '#ff4d6d' }}>blindsided</span> by<br />
          API <span style={{ color: '#00d9ff' }}>breaking changes</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: '#6b6b80', maxWidth: '520px', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          SpecWatch watches your GitHub repo. Every push, it diffs your OpenAPI spec and fires a Slack or email alert before your frontend team finds out the hard way.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button onClick={() => navigate('/register')} style={{
            background: '#ff4d6d', border: 'none', color: 'white',
            padding: '0.9rem 2rem', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.04em',
          }}>
            START FOR FREE →
          </button>
          <button onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })} style={{
            background: 'transparent', border: '1px solid #1e1e2e', color: '#6b6b80',
            padding: '0.9rem 2rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.9rem',
          }}>
            See how it works
          </button>
        </div>

        {/* Terminal Demo */}
        <div style={{ marginTop: '4rem', width: '100%', maxWidth: '680px' }}>
          <div style={{
            background: '#0d0d14', border: '1px solid #1e1e2e', borderRadius: '10px',
            overflow: 'hidden', textAlign: 'left',
            boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
          }}>
            <div style={{
              background: '#161622', padding: '0.7rem 1rem',
              display: 'flex', alignItems: 'center', gap: '0.4rem',
              borderBottom: '1px solid #1e1e2e',
            }}>
              {['#ff5f56','#ffbd2e','#27c93f'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: '#6b6b80', marginLeft: 'auto', marginRight: 'auto' }}>
                specwatch · monitoring push to main
              </span>
            </div>
            <div style={{ padding: '1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '0.78rem', lineHeight: 2 }}>
              <div style={{ color: '#6b6b80' }}>$ specwatch diff openapi.yaml</div>
              <div style={{ color: '#00d9ff' }}>→ Comparing v2.1.0 → v2.2.0</div>
              <div style={{ color: '#6b6b80' }}>─────────────────────────────</div>
              <div style={{ color: '#69db7c' }}>✓ POST /users/login &nbsp;&nbsp; no change</div>
              <div style={{ color: '#ff6b6b' }}>✗ DELETE /orders/{'{'}{'}id{'}'} &nbsp;<span style={{ color: '#ff4d6d', fontWeight: 700 }}>BREAKING</span> — param renamed</div>
              <div style={{ color: '#ffd43b' }}>⚠ GET &nbsp;/users/{'{'}{'}id{'}'} &nbsp;&nbsp; response field added</div>
              <div style={{ color: '' }}>&nbsp;</div>
              <div style={{ color: '#ff4d6d', fontWeight: 700 }}>1 BREAKING CHANGE DETECTED</div>
              <div style={{ color: '#00d9ff' }}>→ Sending alert to #api-updates...</div>
              <div style={{ color: '#69db7c' }}>✓ Alert sent.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{ padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#ff4d6d', letterSpacing: '0.12em', marginBottom: '1rem' }}>
          // THE PROBLEM
        </div>
        <h2 style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
          Every team has a horror story.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {[
            { icon: '💥', title: 'Silent breaking changes', desc: 'Backend dev renames a param, pushes to main, tells nobody. Frontend breaks in prod 3 hours later.' },
            { icon: '📄', title: 'Docs always out of date', desc: 'Swagger files drift. No one updates them. New devs trust the docs and get burned.' },
            { icon: '🕵️', title: 'Hours debugging nothing', desc: 'Frontend spends 3 hours debugging a 400 error that was just a renamed field in the API.' },
            { icon: '📱', title: 'Mobile apps break in prod', desc: "Mobile clients can't hot-reload. A breaking API change means a broken app until the next release." },
          ].map(item => (
            <div key={item.title} style={{
              background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px', padding: '1.5rem',
              transition: 'border-color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,77,109,0.4)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#1e1e2e'}
            >
              <div style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{item.icon}</div>
              <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#ff4d6d', marginBottom: '0.5rem' }}>{item.title}</h3>
              <p style={{ fontSize: '0.88rem', color: '#6b6b80', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{ padding: '6rem 2rem', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#ff4d6d', letterSpacing: '0.12em', marginBottom: '1rem' }}>
            // HOW IT WORKS
          </div>
          <h2 style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
            Set up in 5 minutes.<br />Works silently forever.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
            {[
              { num: '01', title: 'Connect repo', desc: 'Paste your GitHub repo URL and the path to your OpenAPI YAML file.' },
              { num: '02', title: 'Every push', desc: 'SpecWatch reads your spec via webhook on every push to any branch.' },
              { num: '03', title: 'Diff & classify', desc: 'Automatically diffs the new spec. Classifies every change as breaking or safe.' },
              { num: '04', title: 'Instant alert', desc: 'Email or Slack notification with exactly what changed and why it matters.' },
            ].map(step => (
              <div key={step.num} style={{
                background: '#111118', border: '1px solid #1e1e2e', borderRadius: '8px',
                padding: '2rem 1.5rem', textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = '#1e1e2e' }}
              >
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '2rem', fontWeight: 700, color: '#1e1e2e', marginBottom: '1rem' }}>{step.num}</div>
                <h3 style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.85rem', fontWeight: 700, color: '#00d9ff', marginBottom: '0.5rem' }}>{step.title}</h3>
                <p style={{ fontSize: '0.85rem', color: '#6b6b80', lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ padding: '6rem 2rem', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#ff4d6d', letterSpacing: '0.12em', marginBottom: '1rem' }}>
          // PRICING
        </div>
        <h2 style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '3rem' }}>
          Simple. No seat fees.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
          {[
            {
              name: 'STARTER', price: 'Free', desc: 'For small teams and open source.',
              features: ['1 repository', 'Email alerts', '7-day history', 'Breaking change detection'],
              cta: 'Get Started Free', primary: false,
            },
            {
              name: 'TEAM', price: '$19', desc: 'For teams shipping fast.', featured: true,
              features: ['Up to 10 repositories', 'Email + Slack + Discord', 'Unlimited history', 'Multi-branch monitoring', 'Priority support'],
              cta: 'Start Free Trial →', primary: true,
            },
            {
              name: 'PRO', price: '$49', desc: 'For agencies and multi-team orgs.',
              features: ['Unlimited repositories', 'All notification channels', 'Unlimited history + exports', 'Custom webhook support'],
              cta: 'Contact Us', primary: false,
            },
          ].map(plan => (
            <div key={plan.name} style={{
              background: plan.featured ? 'rgba(255,77,109,0.05)' : '#111118',
              border: `1px solid ${plan.featured ? '#ff4d6d' : '#1e1e2e'}`,
              borderRadius: '10px', padding: '2rem',
              position: 'relative',
              transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#ff4d6d', color: 'white', fontSize: '0.65rem', fontWeight: 700,
                  padding: '0.25rem 0.8rem', borderRadius: '999px', fontFamily: 'Space Mono, monospace',
                  letterSpacing: '0.08em',
                }}>MOST POPULAR</div>
              )}
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: '#6b6b80', letterSpacing: '0.1em', marginBottom: '0.8rem' }}>{plan.name}</div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '2.4rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                {plan.price} <span style={{ fontSize: '0.9rem', color: '#6b6b80', fontWeight: 400 }}>{plan.price !== 'Free' ? '/ month' : ''}</span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b6b80', marginBottom: '1.5rem' }}>{plan.desc}</p>
              <ul style={{ listStyle: 'none', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: '0.85rem', color: '#e8e8f0', display: 'flex', alignItems: 'center', gap: '0.5rem', textAlign: 'left' }}>
                    <span style={{ color: '#00d9ff', fontFamily: 'monospace' }}>→</span> {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} style={{
                width: '100%', padding: '0.8rem',
                background: plan.primary ? '#ff4d6d' : 'transparent',
                border: plan.primary ? 'none' : '1px solid #1e1e2e',
                color: plan.primary ? 'white' : '#6b6b80',
                borderRadius: '4px', cursor: 'pointer',
                fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', fontWeight: 700,
                letterSpacing: '0.06em',
              }}>
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 2rem', textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,77,109,0.08), rgba(0,217,255,0.05))',
        borderTop: '1px solid #1e1e2e',
      }}>
        <h2 style={{ fontFamily: 'Space Mono, monospace', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 700, letterSpacing: '-0.03em', marginBottom: '1rem' }}>
          First 10 teams get<br /><span style={{ color: '#ff4d6d' }}>Team plan free</span> for 3 months.
        </h2>
        <p style={{ color: '#6b6b80', marginBottom: '2rem', fontSize: '0.95rem' }}>
          We're in beta. Sign up now and get the full Team plan free while we build.
        </p>
        <button onClick={() => navigate('/register')} style={{
          background: '#ff4d6d', border: 'none', color: 'white',
          padding: '1rem 2.5rem', borderRadius: '6px', cursor: 'pointer',
          fontSize: '0.9rem', fontWeight: 700, fontFamily: 'Space Mono, monospace',
          letterSpacing: '0.06em',
        }}>
          GET EARLY ACCESS →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '2rem 2.5rem', borderTop: '1px solid #1e1e2e',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem',
      }}>
        <div style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '0.9rem' }}>
          Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          {['GitHub', 'Docs', 'Twitter', 'Contact'].map(link => (
            <a key={link} href="#" style={{ fontSize: '0.78rem', color: '#6b6b80', textDecoration: 'none' }}>{link}</a>
          ))}
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#6b6b80' }}>
          Built with Spring Boot + React
        </div>
      </footer>

    </div>
  )
}