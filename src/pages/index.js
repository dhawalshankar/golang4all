import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './index.module.css';

export default function Home() {
  return (
    <Layout
      title="GolangForAll"
      description="A community for people who learn, build, teach, and contribute with Go."
    >
      <main className={styles.homepage}>
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>
                <span className={styles.statusDot} />
                The Go community for everyone
              </p>
              <h1>
                Go further,
                <br />
                <span>together.</span>
              </h1>
              <p className={styles.heroDescription}>
                A community for people who learn, build, teach, and contribute
                with Go. Find your people, share what you know, and make
                something useful.
              </p>
              <div className={styles.heroActions}>
                <Link className={styles.primaryButton} to="/docs/intro">
                  Discover the community <span aria-hidden="true">→</span>
                </Link>
                <a
                  className={styles.secondaryButton}
                  href="https://whatsapp.com/channel/0029VbDoRp9JP214yrRcCS2I"
                >
                  Join us on WhatsApp
                </a>
              </div>
              <p className={styles.heroFootnote}>Learn. Build. Share. Meet.</p>
            </div>

            <div className={styles.heroArtwork} aria-label="Go developers around the world">
              <div className={styles.artworkGlow} />
              <div className={styles.artworkOrbit} />
              <div className={styles.artworkCard}>
                <span className={styles.artworkLabel}>A community in motion</span>
                <img src="/img/logo.png" alt="Gopher holding the world" />
                <div className={styles.artworkCaption}>
                  <span>Built around Go</span>
                  <span className={styles.artworkArrow} aria-hidden="true">↗</span>
                </div>
              </div>
              <span className={`${styles.artworkTag} ${styles.tagBuild}`}>BUILD</span>
              <span className={`${styles.artworkTag} ${styles.tagShare}`}>SHARE</span>
            </div>
          </div>
          <div className={styles.heroFooter} aria-hidden="true">
            <span>Curious minds</span>
            <span className={styles.footerLine} />
            <span>Good software</span>
            <span className={styles.footerLine} />
            <span>Stronger communities</span>
          </div>
        </section>

        <section className={styles.activities} aria-labelledby="activities-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionEyebrow}>What brings us together</p>
              <h2 id="activities-title">More than a language.</h2>
            </div>
            <p>
              Go is the starting point. The best part is what we learn and make
              with each other.
            </p>
          </div>

          <div className={styles.activityGrid}>
            <Link className={styles.activityCard} to="/docs/meetups">
              <span className={styles.cardNumber}>01 / MEET</span>
              <h3>Meetups &amp; conversations</h3>
              <p>
                Meet developers in your city, swap ideas, and make room for
                thoughtful conversations.
              </p>
              <span className={styles.cardLink}>Find a meetup <span aria-hidden="true">↗</span></span>
            </Link>
            <Link className={styles.activityCard} to="/docs/resources">
              <span className={styles.cardNumber}>02 / LEARN</span>
              <h3>Learn in the open</h3>
              <p>
                Explore useful resources and practical knowledge, wherever you
                are in your Go journey.
              </p>
              <span className={styles.cardLink}>Browse resources <span aria-hidden="true">↗</span></span>
            </Link>
            <Link className={styles.activityCard} to="/docs/contribute">
              <span className={styles.cardNumber}>03 / CONTRIBUTE</span>
              <h3>Build &amp; share</h3>
              <p>
                Bring a project, a lesson, or a question. There is always
                something worth sharing.
              </p>
              <span className={styles.cardLink}>Get involved <span aria-hidden="true">↗</span></span>
            </Link>
          </div>
        </section>

        <section className={styles.story}>
          <div className={styles.storyMarker}>
            <span className={styles.storyMarkerLine} />
            <span>OUR NORTH STAR</span>
          </div>
          <div className={styles.storyContent}>
            <h2>Open source is a team sport.</h2>
            <p>
              We believe the Go ecosystem grows when more people feel welcome
              to take part. GolangForAll brings developers together to learn
              from one another, share real experience, and build a community
              that reaches beyond any one project or city.
            </p>
            <Link className={styles.textLink} to="/about">
              Get to know GolangForAll <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className={styles.storyAside}>
            <span className={styles.quoteMark} aria-hidden="true">“</span>
            <p>Come learn something. Come share something. Come build something.</p>
            <span className={styles.quoteCredit}>The GolangForAll community</span>
          </div>
        </section>

        <section className={styles.communityCta}>
          <div>
            <p className={styles.sectionEyebrow}>There is a place for you here</p>
            <h2>Let’s build a bigger Go community.</h2>
            <p>
              Whether you are writing your first Go program or have years of
              experience, come be part of the conversation.
            </p>
          </div>
          <a
            className={styles.ctaButton}
            href="https://whatsapp.com/channel/0029VbDoRp9JP214yrRcCS2I"
          >
            Join the community <span aria-hidden="true">→</span>
          </a>
        </section>
      </main>
    </Layout>
  );
}