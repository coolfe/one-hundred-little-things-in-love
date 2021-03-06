import React, { Component } from "react";
import { Icon, Popconfirm, Modal, Input } from "antd";
import list from "../../action/list";

class Main extends Component {
    state = {
        modalVisible: false,
        listTitle: ""
    };
    addAction() {
        if (!this.state.listTitle) return;
        const payload = {
            id:
                this.props.list.length > 0
                    ? this.props.list[this.props.list.length - 1].id + 1
                    : 1,
            title: this.state.listTitle,
            createTime: new Date(),
            time: "",
            endTime: ""
        };
        list.actions.add(payload).then(() => {
            this.props.get();
            this.setModalVisible(false);
            this.setState({
                listTitle: ""
            });
        });
    }
    setModalVisible(payload) {
        this.setState({
            modalVisible: payload
        });
    }
    setListTitle(e) {
        this.setState({
            listTitle: e.target.value
        });
    }
    removeAction(payload) {
        list.actions.remove(payload).then(() => {
            this.props.get();
        });
    }
    doneAction(payload) {
        list.actions.update(payload).then(() => {
            this.props.get();
        });
    }
    render() {
        return (
            <div className="main">
                <ul>
                    <li
                        className="item"
                        onClick={() => this.setModalVisible(true)}
                    >
                        <span>
                            <Icon type="plus" /> 新建小事
                        </span>
                    </li>
                    {this.props.list &&
                        this.props.list.map((i, index) => {
                            const isDone = i.endTime.length > 0;
                            return (
                                <li
                                    key={i.id}
                                    className={
                                        isDone > 0 ? "item isDone" : "item"
                                    }
                                >
                                    <p>
                                        {index + 1}、 一起{i.title}
                                    </p>
                                    <div className="item-ctr">
                                        <span
                                            onClick={() => {
                                                if (isDone) return;
                                                this.doneAction({
                                                    id: i.id,
                                                    title: i.title,
                                                    createTime: i.createTime,
                                                    endTime: new Date(),
                                                    time: new Date().toLocaleDateString()
                                                });
                                            }}
                                        >
                                            完成
                                        </span>
                                        <Popconfirm
                                            title="Are you sure delete this thing?"
                                            onConfirm={() => {
                                                this.removeAction({
                                                    id: i.id
                                                });
                                            }}
                                            okText="Yes"
                                            cancelText="No"
                                        >
                                            <span>删除</span>
                                        </Popconfirm>
                                    </div>
                                    {isDone ? (
                                        <div>
                                            <Icon
                                                type="smile"
                                                theme="twoTone"
                                                className="done"
                                            />
                                            <time>{i.time}</time>
                                        </div>
                                    ) : null}
                                </li>
                            );
                        })}
                </ul>
                <Modal
                    title="create"
                    centered
                    visible={this.state.modalVisible}
                    onOk={() => this.addAction()}
                    onCancel={() => this.setModalVisible(false)}
                >
                    <Input
                        ref={input => input && input.focus()}
                        value={this.state.listTitle}
                        onPressEnter={() => this.addAction()}
                        onChange={e => {
                            this.setListTitle(e);
                        }}
                    />
                </Modal>
            </div>
        );
    }
}

export default Main;
