// 是我们的后台首页需要使用的。包括有公用的头部，公用的左侧等组件
import React from 'react';
import { connect } from 'dva';
import { Layout, Icon } from 'antd';
import LvMenu from './components/LvMenu';
import styles from './SimpleLayout.scss';

const { Header, Sider, Content } = Layout;

class SimpleLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
      <Layout className={styles.normal}>
        <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
          <div className={styles.logo} />
          <LvMenu match={this.props.match} />
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className={styles.trigger}
              type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={this.toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              overflow:'auto',
            }}
          >
            {this.props.children}
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default connect(
  ({ global }) => ({
    menus: global.menus,
    user: global.user,
  }),
  null,
)(SimpleLayout);
