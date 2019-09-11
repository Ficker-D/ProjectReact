/**
 * Routes:
 *  - ./src/routes/PrivateRoute.js
 *  - ./src/layouts/SimpleLayout.js
 */

import { connect } from 'dva';
import styles from './index.css';

const Index = () => {
  return (
    <div className={styles.normal}>
      <div className={styles.welcome} />
      <ul className={styles.list}>
        <li>
          To get started, edit <code>src/pages/index.js</code> and save to reload.
        </li>
        <li>
          <a href="https://umijs.org/guide/getting-started.html">Getting Started</a>
        </li>
      </ul>
    </div>
  );
};

export default connect(
  state => {
    console.log(state);
    return {};
  },
  null,
)(Index);
