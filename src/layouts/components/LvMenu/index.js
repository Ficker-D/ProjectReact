// 对 antd 中的 menu 进行一层包装，并且实现权限验证
import { Menu, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';

const LvMenu = ({ menus, user, match }) => {
  // 处理左侧菜单是否可以看见
  const newMenus = menus.filter(menu => {
    // if (!menu.role) {
    //   // 说明不需要任何权限
    //   return true;
    // } else {
    //   return user.roles.includes(menu.role);
    // }
    return user.roles.includes(menu.role) || !menu.role;
  });

  return (
    <Menu theme="dark" mode="inline">
      {newMenus.map(item => {
        return (
          <Menu.Item
            key={item.id}
            className={match.path === item.href ? 'ant-menu-item-selected' : ''}
          >
            <Link to={item.href}>
              <Icon type={item.icon} />
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default connect(
  ({ global }) => ({
    menus: global.menus,
    user: global.user,
  }),
  null,
)(LvMenu);
