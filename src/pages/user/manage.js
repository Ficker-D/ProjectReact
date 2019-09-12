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
import {Table,Pagination, Button,Dialog,Form,Input,Message } from 'element-react';
import 'element-theme-default';

class UserManage extends Component {
  constructor(props) {
    super(props);
  
    this.state = {
      dialogVisible2: false,
      dialogVisible3: false,
      // 添加新用户的表单
      form: {
        name: '',
        email: '',
        password:''
      },
      // 编辑用户的表单
      form2: {
        id2:'',
        name2: '',
        email2: '',
        password2:''
      },
      rules: {
        name: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'));
            } else {
              callback();
            }
          } }
        ],
        name2: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入用户名'));
            } else {
              callback();
            }
          } }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入邮箱'));
            } else {
              callback();
            }
          } }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请输入密码'));
            } else {
              callback();
            }
          } }
        ],
      },
      columns: [
        {label: "用户Id",prop: "id",width:'100%'},
        {label: "用户名",prop: "username",width:'100%'},
        {label: "用户邮箱",prop: "email",width:'100%'},
        {label: "创建时间",prop: "created_at",width:'100%'},
        {label: "操作",width:'100%',render: (row, column, index)=>{
          return (
            <span>
             <Button plain={true} type="info" size="small" onClick={ this.editUser.bind(this,row)} >编辑</Button>
             <Button type="danger" size="small" onClick={ this.deleteUser.bind(this,row)}>删除</Button>
            </span>
          )
        }}
      ],
      open() {
        Message({
          message: '添加成功',
          type: 'success'
        });
      }
    }
  }
  //删除用户
  deleteUser(row) {
    // console.log(row);  //得到row是当前行用户的数据对象
    console.log(this.props.userList);
    let id=row.id;
    request.delete(`/api/v1/users/${id}`).then(response => {
      // console.log(response.data);
      this.props.getUserList();
    });
  }
  onChange(key, value) {
    this.setState({
      form: Object.assign({}, this.state.form, { [key]: value })
    });
  }
  onChange2(key, value) {
    this.setState({
      form2: Object.assign({}, this.state.form2, { [key]: value })
    });
  }
  //编辑用户
  editUser(row){
    console.log(row)
    let id=row.id;
    this.setState({
      // form: Object.assign({}, this.state.form, { name: row.username,email:row.email })
      form2: {
        id2:row.id,
        name2:row.username,
        email2:row.email,
        password2:'',
      },
      dialogVisible2: true,
    });

  }
  //表单提交时添加用户
  handleSubmit(e) {
    e.preventDefault();

    this.refs.form.validate((valid) => {
      if (valid) {
        // alert('submit!');
      } else {
        console.log('error submit!!');
        return false;
      }
    });
    this.setState({ dialogVisible3: false });

    // console.log(this.state.form.name)
    // console.log(this.state.form.email)
    request.post(`/api/v1/signup`,{
      username:this.state.form.name,
      email:this.state.form.email,
      password:this.state.form.password,
    })
    .then(response => {
      alert('添加成功!');
      this.props.getUserList();
      console.log(response);
    })
    .catch(error => {
      alert('添加失败!');
      console.log(error);
      //数据请求错误时刷新页面
      window.location.reload();
    });

  }
  //表单提交时修改用户
  handleSubmit2(e) {
    e.preventDefault();

    this.setState({ dialogVisible2: false });

    request.patch(`/api/v1/users/${this.state.form2.id2}`,{
      username:this.state.form2.name2,

    })
    .then(response => {
      alert('修改成功!');
      console.log(response);
      this.props.getUserList();
    })
    .catch(error => {
      alert('修改失败!');
      console.log(error);
      //数据请求错误时刷新页面
      window.location.reload();
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
            <Form ref="form" model={this.state.form} rules={this.state.rules} className="demo-ruleForm">
              <Form.Item label="用户名" prop="name" labelWidth="100">
                <Input value={this.state.form.name} onChange={this.onChange.bind(this, 'name')}></Input>
              </Form.Item>
              <Form.Item label="邮  箱" prop="email" labelWidth="100">
                <Input value={this.state.form.email} onChange={this.onChange.bind(this, 'email')}></Input>
              </Form.Item>
              <Form.Item label="密  码" prop="password" labelWidth="100">
                <Input value={this.state.form.password} onChange={this.onChange.bind(this, 'password')}></Input>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible3: false }) }>取 消</Button>
            <Button type="primary"  onClick={this.handleSubmit.bind(this)}>确 定</Button>
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

        <Dialog
          title="编辑用户"
          visible={ this.state.dialogVisible2 }
          onCancel={ () => this.setState({ dialogVisible2: false }) }
        >
          <Dialog.Body>
            <Form ref="form2" model={this.state.form2} rules={this.state.rules} className="demo-ruleForm">
              <Form.Item label="用户名" prop="name2" labelWidth="100">
                <Input value={this.state.form2.name2} onChange={this.onChange2.bind(this, 'name2')}></Input>
              </Form.Item>
              <Form.Item label="邮  箱" prop="email2" labelWidth="100">
                <Input value={this.state.form2.email2} disabled onChange={this.onChange2.bind(this, 'email2')}></Input>
              </Form.Item>
              <Form.Item label="密  码" prop="password2" labelWidth="100">
                <Input value={this.state.form2.password2} disabled onChange={this.onChange2.bind(this, 'password2')}></Input>
              </Form.Item>
            </Form>
          </Dialog.Body>

          <Dialog.Footer className="dialog-footer">
            <Button onClick={ () => this.setState({ dialogVisible2: false }) }>取 消</Button>
            <Button type="primary" onClick={this.handleSubmit2.bind(this)}>确 定</Button>
          </Dialog.Footer>
        </Dialog>
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

