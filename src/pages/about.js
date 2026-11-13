import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './about.module.css';

export default function About() {
  return (
    <Layout title="About" description="About GolangForAll and how it started">
      <main className={styles.aboutPage}>
        <header className={styles.hero}>
          <p className={styles.eyebrow}>A community, built together</p>
          <h1>Go is the language.<br />People are the point.</h1>
          <p className={styles.lead}>
            GolangForAll brings together people who learn, build, teach, and
            contribute with Go. We are here to connect the people around the
            ecosystem—not to replace Go&apos;s official home at{' '}
            <a href="https://go.dev">go.dev</a>.
          </p>
        </header>

        <section className={styles.storySection}>
          <div className={styles.sectionLabel}>
            <span>01</span>
            <span>HOW IT STARTED</span>
          </div>
          <div className={styles.sectionBody}>
            <h2>Built from a love of building together.</h2>
            <p>
              I&apos;m Dhawal Shukla, a backend engineer working primarily with
              Go, Node.js, and Python. I&apos;ve shipped production platforms
              spanning real-time messaging, payment processing, polyglot
              databases, and AI-driven data pipelines—and along the way, Go
              became the language I trust most when correctness and concurrency
              matter.
            </p>
            <p>
              Most Go content online either stops at syntax or assumes you
              already know why the language is built the way it is.
              GolangForAll started as an attempt to close that gap, and grew
              into a place for developers to meet, share what they know, and
              learn from one another.
            </p>
            <a
              className={styles.founderLink}
              href="https://thewittyswan.space"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meet the founder <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>

        <section className={styles.storySection}>
          <div className={styles.sectionLabel}>
            <span>02</span>
            <span>WHERE IT&apos;S HEADED</span>
          </div>
          <div className={styles.sectionBody}>
            <h2>Make room for more people.</h2>
            <p>
              Right now that means meetups around NCR and Kanpur/Lucknow, a
              community WhatsApp group, and a blog open to anyone who wants to
              write about what they&apos;ve actually built.
            </p>
            <p>
              Want to speak, write, or host a meetup in your own city?{' '}
              <Link to="/docs/contribute">Find a way to contribute</Link>.
            </p>
            <p>
              Help support the work of growing this community:{' '}
              <a
                href="https://rzp.io/rzp/U6FewHU"
                target="_blank"
                rel="noopener noreferrer"
              >
                🍎 Buy me an apple
              </a>
              .
            </p>
            <div className={styles.profileLinks}>
              <a
                href="https://github.com/DhawalShankar"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
              <a
                href="https://www.linkedin.com/in/dhawalshukl/"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn <span aria-hidden="true">↗</span>
              </a>
              <a href="mailto:work.dshukla@gmail.com">Email <span aria-hidden="true">↗</span></a>
            </div>
          </div>
        </section>

        <aside className={styles.disclaimer}>
          <strong>A quick note</strong>
          <p>
            GolangForAll (golangforall.in) is an independent, community-run
            initiative. It is not affiliated with, endorsed by, or connected
            to golangforall.com or any similarly named platform, organization,
            or entity.
          </p>
        </aside>
      </main>
    </Layout>
  );
}
