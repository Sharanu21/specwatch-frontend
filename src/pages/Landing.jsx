import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect, useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Shared responsive styles can be derived here
  const containerPadding = isMobile ? '1rem' : '2.5rem'
  const sectionPadding = isMobile ? '3rem 1.2rem' : '6rem 2rem'

  return (
    <div style={{
      background: '#0a0a0f',
      minHeight: '100vh',
      color: '#e8e8f0',
      fontFamily: 'DM Sans, sans-serif',
      overflowX: 'hidden',
      margin: 0,
      padding: 0,
    }}>
      {/* NAV */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: isMobile ? '1rem 1.2rem' : '1.2rem 2.5rem',
        background: 'rgba(10,10,15,0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #1e1e2e',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontWeight: 700,
          fontSize: isMobile ? '1rem' : '1.1rem',
          letterSpacing: '-0.02em',
        }}>
          Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '0.6rem' : '1rem', alignItems: 'center' }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: 'transparent',
              border: '1px solid #1e1e2e',
              color: '#6b6b80',
              padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              whiteSpace: 'nowrap',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#ff4d6d',
              border: 'none',
              color: 'white',
              padding: isMobile ? '0.4rem 0.8rem' : '0.5rem 1.2rem',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: isMobile ? '0.75rem' : '0.85rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}
          >
            Start Free →
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: isMobile ? '6rem 1.2rem 2.5rem' : '8rem 2rem 4rem',
        background: 'radial-gradient(ellipse at top, rgba(255,77,109,0.08) 0%, transparent 60%)',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          color: '#00d9ff',
          border: '1px solid rgba(0,217,255,0.25)',
          background: 'rgba(0,217,255,0.06)',
          padding: '0.35rem 0.9rem',
          borderRadius: '999px',
          marginBottom: '1.5rem',
          letterSpacing: '0.08em',
        }}>
          <span style={{ width: 6, height: 6, background: '#00d9ff', borderRadius: '50%', display: 'inline-block' }} />
          FREE DURING BETA · NO CREDIT CARD
        </div>

        <h1 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? 'clamp(1.8rem, 8vw, 2.6rem)' : 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 700,
          lineHeight: 1.15,
          letterSpacing: '-0.04em',
          maxWidth: '860px',
          marginBottom: '1.5rem',
        }}>
          Stop getting<br />
          <span style={{ color: '#ff4d6d' }}>blindsided</span> by<br />
          API <span style={{ color: '#00d9ff' }}>breaking changes</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '0.95rem' : '1.1rem',
          color: '#6b6b80',
          maxWidth: '540px',
          lineHeight: 1.7,
          marginBottom: '2rem',
          padding: '0 0.5rem',
        }}>
          SpecWatch watches your GitHub repo. Every push, it diffs your OpenAPI spec and fires a Slack or email alert before your frontend team finds out the hard way.
        </p>

        <div style={{
          display: 'flex',
          gap: '0.8rem',
          flexWrap: 'wrap',
          justifyContent: 'center',
          width: '100%',
          maxWidth: '400px',
        }}>
          <button
            onClick={() => navigate('/register')}
            style={{
              background: '#ff4d6d',
              border: 'none',
              color: 'white',
              padding: isMobile ? '0.8rem 1.5rem' : '0.9rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              fontWeight: 700,
              fontFamily: 'Space Mono, monospace',
              letterSpacing: '0.04em',
              flex: isMobile ? '1 1 160px' : 'none',
            }}
          >
            START FOR FREE →
          </button>
          <button
            onClick={() => document.getElementById('how').scrollIntoView({ behavior: 'smooth' })}
            style={{
              background: 'transparent',
              border: '1px solid #1e1e2e',
              color: '#6b6b80',
              padding: isMobile ? '0.8rem 1.5rem' : '0.9rem 2rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: isMobile ? '0.85rem' : '0.9rem',
              flex: isMobile ? '1 1 160px' : 'none',
            }}
          >
            See how it works
          </button>
        </div>

        {/* Terminal Demo - responsive width */}
        <div style={{
          marginTop: '3rem',
          width: '100%',
          maxWidth: '700px',
          padding: isMobile ? '0 0.5rem' : '0',
        }}>
          <div style={{
            background: '#0d0d14',
            border: '1px solid #1e1e2e',
            borderRadius: '12px',
            overflow: 'hidden',
            textAlign: 'left',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
          }}>
            <div style={{
              background: '#161622',
              padding: isMobile ? '0.6rem 0.8rem' : '0.7rem 1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              borderBottom: '1px solid #1e1e2e',
            }}>
              {['#ff5f56', '#ffbd2e', '#27c93f'].map(c => (
                <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
              ))}
              <span style={{
                fontFamily: 'monospace',
                fontSize: isMobile ? '0.65rem' : '0.7rem',
                color: '#6b6b80',
                marginLeft: 'auto',
                marginRight: 'auto',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                specwatch · monitoring push to main
              </span>
            </div>
            <div style={{
              padding: isMobile ? '1rem' : '1.5rem',
              fontFamily: 'Space Mono, monospace',
              fontSize: isMobile ? '0.68rem' : '0.78rem',
              lineHeight: 2,
              overflowX: 'auto',
            }}>
              <div style={{ color: '#6b6b80' }}>$ specwatch diff openapi.yaml</div>
              <div style={{ color: '#00d9ff' }}>→ Comparing v2.1.0 → v2.2.0</div>
              <div style={{ color: '#6b6b80' }}>─────────────────────────────</div>
              <div style={{ color: '#69db7c' }}>✓ POST /users/login &nbsp;&nbsp; no change</div>
              <div style={{ color: '#ff6b6b' }}>
                ✗ DELETE /orders/&#123;id&#125; &nbsp;
                <span style={{ color: '#ff4d6d', fontWeight: 700 }}>BREAKING</span> — param renamed
              </div>
              <div style={{ color: '#ffd43b' }}>⚠ GET &nbsp;/users/&#123;id&#125; &nbsp;&nbsp; response field added</div>
              <div>&nbsp;</div>
              <div style={{ color: '#ff4d6d', fontWeight: 700 }}>1 BREAKING CHANGE DETECTED</div>
              <div style={{ color: '#00d9ff' }}>→ Sending alert to #api-updates...</div>
              <div style={{ color: '#69db7c' }}>✓ Alert sent.</div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section style={{
        padding: sectionPadding,
        maxWidth: '1100px',
        margin: '0 auto',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          color: '#ff4d6d',
          letterSpacing: '0.12em',
          marginBottom: '0.75rem',
        }}>
          // THE PROBLEM
        </div>
        <h2 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? '1.5rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '2.5rem',
        }}>
          Every team has a horror story.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
        }}>
          {[
            { icon: '💥', title: 'Silent breaking changes', desc: 'Backend dev renames a param, pushes to main, tells nobody. Frontend breaks in prod 3 hours later.' },
            { icon: '📄', title: 'Docs always out of date', desc: 'Swagger files drift. No one updates them. New devs trust the docs and get burned.' },
            { icon: '🕵️', title: 'Hours debugging nothing', desc: 'Frontend spends 3 hours debugging a 400 error that was just a renamed field in the API.' },
            { icon: '📱', title: 'Mobile apps break in prod', desc: "Mobile clients can't hot-reload. A breaking API change means a broken app until the next release." },
          ].map(item => (
            <div key={item.title} style={{
              background: '#111118',
              border: '1px solid #1e1e2e',
              borderRadius: '10px',
              padding: '1.5rem',
              transition: 'border-color 0.2s, transform 0.2s',
              cursor: 'default',
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'rgba(255,77,109,0.4)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = '#1e1e2e';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '1.6rem', marginBottom: '0.8rem' }}>{item.icon}</div>
              <h3 style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#ff4d6d',
                marginBottom: '0.5rem',
              }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#6b6b80', lineHeight: 1.6 }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" style={{
        padding: sectionPadding,
        background: 'rgba(0,0,0,0.3)',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '0 0.5rem' : '0' }}>
          <div style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            color: '#ff4d6d',
            letterSpacing: '0.12em',
            marginBottom: '0.75rem',
          }}>
            // HOW IT WORKS
          </div>
          <h2 style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: isMobile ? '1.5rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 700,
            letterSpacing: '-0.03em',
            marginBottom: '2.5rem',
          }}>
            Set up in 5 minutes.<br />Works silently forever.
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
          }}>
            {[
              { num: '01', title: 'Connect repo', desc: 'Paste your GitHub repo URL and the path to your OpenAPI YAML file.' },
              { num: '02', title: 'Every push', desc: 'SpecWatch reads your spec via webhook on every push to any branch.' },
              { num: '03', title: 'Diff & classify', desc: 'Automatically diffs the new spec. Classifies every change as breaking or safe.' },
              { num: '04', title: 'Instant alert', desc: 'Email or Slack notification with exactly what changed and why it matters.' },
            ].map(step => (
              <div key={step.num} style={{
                background: '#111118',
                border: '1px solid #1e1e2e',
                borderRadius: '10px',
                padding: '1.8rem 1.2rem',
                textAlign: 'center',
                transition: 'transform 0.2s, border-color 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(0,217,255,0.3)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = '#1e1e2e';
                }}
              >
                <div style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '2rem',
                  fontWeight: 700,
                  color: '#1e1e2e',
                  marginBottom: '1rem',
                }}>
                  {step.num}
                </div>
                <h3 style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  color: '#00d9ff',
                  marginBottom: '0.5rem',
                }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#6b6b80', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{
        padding: sectionPadding,
        maxWidth: '1000px',
        margin: '0 auto',
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          color: '#ff4d6d',
          letterSpacing: '0.12em',
          marginBottom: '0.75rem',
        }}>
          // PRICING
        </div>
        <h2 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? '1.5rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '2.5rem',
        }}>
          Simple. No seat fees.
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
          padding: isMobile ? '0 0.3rem' : '0',
        }}>
          {[
            {
              name: 'STARTER',
              price: 'Free',
              desc: 'For small teams and open source.',
              features: ['1 repository', 'Email alerts', '7-day history', 'Breaking change detection'],
              cta: 'Get Started Free',
              primary: false,
            },
            {
              name: 'TEAM',
              price: '$19',
              desc: 'For teams shipping fast.',
              featured: true,
              features: ['Up to 10 repositories', 'Email + Slack + Discord', 'Unlimited history', 'Multi-branch monitoring', 'Priority support'],
              cta: 'Start Free Trial →',
              primary: true,
            },
            {
              name: 'PRO',
              price: '$49',
              desc: 'For agencies and multi-team orgs.',
              features: ['Unlimited repositories', 'All notification channels', 'Unlimited history + exports', 'Custom webhook support'],
              cta: 'Contact Us',
              primary: false,
            },
          ].map(plan => (
            <div key={plan.name} style={{
              background: plan.featured ? 'rgba(255,77,109,0.06)' : '#111118',
              border: `1px solid ${plan.featured ? '#ff4d6d' : '#1e1e2e'}`,
              borderRadius: '12px',
              padding: '2rem 1.5rem',
              position: 'relative',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: plan.featured ? '0 8px 30px rgba(255,77,109,0.1)' : 'none',
              transform: plan.featured ? 'scale(1.02)' : 'scale(1)',
            }}>
              {plan.featured && (
                <div style={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#ff4d6d',
                  color: 'white',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.8rem',
                  borderRadius: '999px',
                  fontFamily: 'Space Mono, monospace',
                  letterSpacing: '0.08em',
                }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                color: '#6b6b80',
                letterSpacing: '0.1em',
                marginBottom: '0.6rem',
              }}>
                {plan.name}
              </div>
              <div style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '2.4rem',
                fontWeight: 700,
                marginBottom: '0.2rem',
              }}>
                {plan.price}
                <span style={{ fontSize: '0.9rem', color: '#6b6b80', fontWeight: 400 }}>
                  {plan.price !== 'Free' ? '/mo' : ''}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#6b6b80', marginBottom: '1.5rem' }}>
                {plan.desc}
              </p>
              <ul style={{
                listStyle: 'none',
                marginBottom: '2rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.7rem',
                padding: 0,
              }}>
                {plan.features.map(f => (
                  <li key={f} style={{
                    fontSize: '0.85rem',
                    color: '#e8e8f0',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.5rem',
                    textAlign: 'left',
                  }}>
                    <span style={{ color: '#00d9ff', fontFamily: 'monospace', lineHeight: 1.4 }}>→</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/register')}
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  background: plan.primary ? '#ff4d6d' : 'transparent',
                  border: plan.primary ? 'none' : '1px solid #1e1e2e',
                  color: plan.primary ? 'white' : '#6b6b80',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  transition: 'background 0.2s',
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: isMobile ? '3rem 1.2rem' : '5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(255,77,109,0.08), rgba(0,217,255,0.05))',
        borderTop: '1px solid #1e1e2e',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <h2 style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: isMobile ? '1.5rem' : 'clamp(1.6rem, 3vw, 2.2rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
        }}>
          First 10 teams get<br /><span style={{ color: '#ff4d6d' }}>Team plan free</span> for 3 months.
        </h2>
        <p style={{
          color: '#6b6b80',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
          padding: '0 0.5rem',
        }}>
          We're in beta. Sign up now and get the full Team plan free while we build.
        </p>
        <button
          onClick={() => navigate('/register')}
          style={{
            background: '#ff4d6d',
            border: 'none',
            color: 'white',
            padding: '1rem 2.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 700,
            fontFamily: 'Space Mono, monospace',
            letterSpacing: '0.06em',
          }}
        >
          GET EARLY ACCESS →
        </button>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: isMobile ? '1.5rem 1.2rem' : '2rem 2.5rem',
        borderTop: '1px solid #1e1e2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        width: '100%',
        boxSizing: 'border-box',
        fontSize: isMobile ? '0.8rem' : '0.9rem',
      }}>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontWeight: 700,
          fontSize: isMobile ? '0.85rem' : '0.9rem',
        }}>
          Spec<span style={{ color: '#ff4d6d' }}>Watch</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {['GitHub', 'Docs', 'Twitter', 'Contact'].map(link => (
            <a
              key={link}
              href="#"
              style={{
                fontSize: '0.78rem',
                color: '#6b6b80',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {link}
            </a>
          ))}
        </div>
        <div style={{
          fontFamily: 'Space Mono, monospace',
          fontSize: '0.7rem',
          color: '#6b6b80',
          whiteSpace: 'nowrap',
        }}>
          Built with Spring Boot + React
        </div>
      </footer>
    </div>
  )
}