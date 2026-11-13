import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

export default function NotFound() {
  return (
    <Layout title="Page Not Found">
      <main className={styles.notFound}>
        <img src="/img/logo.png" alt="" />
        <p className={styles.eyebrow}>404 / PAGE NOT FOUND</p>
        <h1>This page took a wrong turn.</h1>
        <p className={styles.description}>
          The page you&apos;re looking for may have moved, or the link may be
          out of date.
        </p>
        <Link className={styles.homeLink} to="/">
          Return to GolangForAll <span aria-hidden="true">→</span>
        </Link>
      </main>
    </Layout>
  );
}
