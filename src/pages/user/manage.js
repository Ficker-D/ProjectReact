/**
 * Routes:
 *  - ./src/routes/PrivateRoute.js
 *  - ./src/layouts/SimpleLayout.js
 */

import React, { Component } from 'react';
import { connect } from 'dva';
import { relative } from 'path';
import request from '../../utils/request';
import ReactDOM from 'react-dom';
import {Table,Pagination, Button,Dialog,Form,Input,Select } from 'element-react';
import 'element-theme-default';

// const columns = [
//   { title: '用户Id', dataIndex: 'id' },
//   { title: '用户名', dataIndex: 'username' },
//   { title: '用户邮箱', dataIndex: 'email' },
//   { title: '创建时间', dataIndex: 'created_at' },
//   { title: '操作',render: (text, record) => (
//     <span>
//       <a>修改</a>
//       <Divider type="vertical" />
//       <a >删除</a>
//     </span>
//   ), },
// ];

class UserManage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      form: {
        name: '',
        region: ''
      },
      columns: [
        {label: "用户Id",prop: "id",width:'100%'},
        {label: "用户名",prop: "username",width:'100%'},
        {label: "用户邮箱",prop: "email",width:'100%'},
        {label: "创建时间",prop: "created_at",width:'100%'},
        {label: "操作",width:'100%',render: (row, column, index)=>{
          return (
            <span>
             <Button plain={true} type="info" size="small">编辑</Button>
             <Button type="danger" size="small" onClick={ this.deleteUser.bind(this,row)}>删除
             </Button>
            </span>
          )
        }}
      ],
      // onClick={this.deleteRow.bind(this, index)}
    }
  }
  deleteRow(index) {
    const { data } = this.state;
    data.splice(index, 1);
    this.setState({
      data: [...data]
    })
  }
  deleteUser(row) {
    console.log(row);
    console.log(this.props.userList);
    let id=row.id;
    request.delete(`/api/v1/users/${id}`).then(response => {
      // console.log(response.data);
      this.props.getUserList();
      // this.props.userList.splice(id, 1);
    });
  }

  render() {
    return (
      <div>
        <h1>用户管理页面</h1>
        <Button type="primary" style={{bottom: '-52px',position:' relative'}} onClick={ () => this.setState({ dialogVisible3: true }) } >添加用户</Button>
        <Dialog
          title="添加用户"
          visible={ this.state.dialogVisible3 }
          onCancel={ () => this.setState({ dialogVisible3: false }) }
        >
          <Dialog.Body>
            <Form model={this.state.form}>
              <Form.Item label="用户名" labelWidth="100">
                <Input value={this.state.form.name}></Input>
              </Form.Item>
              <Form.Item label="邮  箱" labelWidth="100">
                <Input value={this.state.form.name}></Input>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible3: false }) }>取 消</Button>
            <Button type="primary" onClick={ () => this.setState({ dialogVisible3: false }) }>确 定</Button>
          </Dialog.Footer>
        </Dialog>

        <div className="block" style={{float:'right',margin:'25px 0 15px'}}>
          <Pagination layout="prev, pager, next" 
          total={this.props.total} 
          onCurrentChange={this.props.getUserList}
          />
        </div>
        <Table
          style={{width: '100%'}}
          columns={this.state.columns}
          data={this.props.userList}
          highlightCurrentRow={true}
        />


      </div>
    );
  }

  componentDidMount() {
    this.props.getUserList();
  }
};

export default connect(
  ({ userManage }) => {
    return {
      userList: userManage.userList,
      total: userManage.total,
    };
  },
  dispatch => {
    return {
      /**
       * 获取用户列表或分页切换时
       * @param {Number} page 页码
       * @param {Number} pageSize 每页显示的条数
       */
      getUserList(page, pageSize) {
        dispatch({
          type: 'userManage/getUserList',
          page,
          pageSize,
        });
      },
    };
  },
)(UserManage);

