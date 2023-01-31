import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx(styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title" style={{color: 'white', textShadow: '0 0 10px black'}}>{siteConfig.title}</h1>
        <p className="hero__subtitle" style={{color: 'white', textShadow: '0 0 7px black'}}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="blog/welcome">
            关于本站 - 1min 🐵
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      wrapperClassName={styles.layout}
      title={`${siteConfig.title}`}
      description="前端相关知识总结与笔记">
        <div className={styles.content}>
          <HomepageHeader/>
        </div>
    </Layout>
  );
}
