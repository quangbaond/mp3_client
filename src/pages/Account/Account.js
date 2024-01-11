import classNames from 'classnames/bind';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import styles from './Account.module.scss';
import { getSingerDataApi } from '../../services';
import HeaderPageSinger from './HeaderPageSinger/HeaderPageSinger';
import { loginSlice, sidebarSlice, statusSlice } from '../../redux/sliceReducer';
import ContentPageSinger from './ContentPageSinger/ContentPageSinger';
import { Card, Form, Input, Space, Table, Tag, Button, Row, Col, message } from 'antd';
import { combinedStatusSelector } from '../../redux/selector';
import './Account.css'
import { request } from '../../untils/request2';
import { toast } from 'react-toastify';

const columns = [
    {
        title: 'Ngân hàng',
        dataIndex: 'bank_branch',
        key: 'bank_branch',
        render: (text, record) => (
            <>
                <p> - Ngân hàng: {record.bank_branch}</p>
                <p> - Số tài khoản: {record.bank_account_number}</p>
                <p> - Chủ tài khoản: {record.bank_account_name}</p>
                <p> - Số điểm: {record.amount}</p>
            </>
        ),
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (
            <>
                {record.status === 'Đang chờ xử lý' ? <Tag color="red">Đang chờ xử lý</Tag> : record.status === 'Đã duyệt' ? <Tag color="green">Từ chối</Tag> : <Tag color="blue">Đã hủy</Tag>}
            </>
        ),
    },
];

const cx = classNames.bind(styles);
function AccountPage() {
    const { nickname } = useParams(); // getApi from
    const [dataSinger, setDataSinger] = useState([]);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { dataUser } = useSelector(combinedStatusSelector);
    const [form] = Form.useForm();
    const [withdrawList, setWithdrawList] = useState([]);

    useEffect(() => {
        if (!dataUser.data) return;
        form.setFieldsValue(dataUser.data);

        const fetch = async () => {
            try {
                const result = await request.get('/withdraws', {
                    headers: {
                        Authorization: `Bearer ${dataUser.accessToken}`,
                    },
                });

                if (result.status === 200) {
                    setWithdrawList(result.data.withDraws);
                }
            } catch (error) {
                if (error) {
                    message.error('Lỗi lấy dữ liệu');
                }
            }
        }

        const fetchWithdraw = async () => {
            try {
                const result = await request.get('/withdraws', {
                    headers: {
                        Authorization: `Bearer ${dataUser.accessToken}`,
                    },
                });

                if (result.status === 200) {
                    setWithdrawList(result.data.result);
                    console.log(result.data.result);
                }
            } catch (error) {
                if (error) {
                    message.error('Lỗi lấy dữ liệu');
                }
            }
        }
        fetch();
        fetchWithdraw();
    }, [dataUser.data]);

    const updateProfile = async (values) => {
        const { user_name, email } = values;
        const response = await request.post('/users', {
            user_name,
            email,
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${dataUser.accessToken}`,
            },
        });

        if (response.status === 200) {
            toast.success('Cập nhật thành công');
            dispatch(loginSlice.actions.setDataUser(response.data.result));
            return
        }

        toast.error('Cập nhật thất bại. Vu lòng thử lại sau!');
    }

    // useEffect(() => {
    //     dispatch(statusSlice.actions.isPageLoadingChange(true));
    //     const fetch = async () => {
    //         try {
    //             const result = await getSingerDataApi(nickname, 6);
    //             setDataSinger(result);
    //         } catch (error) {
    //             if (error) {
    //                 navigate('..');
    //             }
    //         }
    //         dispatch(statusSlice.actions.isPageLoadingChange(false));
    //     };
    //     fetch();
    // }, [nickname]);

    useEffect(() => {
        dispatch(sidebarSlice.actions.setIdSidebarActive(null)); // not active sidebar
    }, [dispatch]);

    return (
        <div className={cx('wrapper')}>
            <header className={cx('header_account_page')}>

                {/* <HeaderPageSinger data={dataSinger} /> */}

            </header>
            <div className={cx('content_account_page')} style={{ marginTop: '20px' }}>
                <Row gutter={10}>
                    <Col md={24} sm={24} xs={24}>
                        <Card title="Thông tin tài khoản"
                            actions={[<Button type="primary" onClick={() => form.submit()}>Cập nhật</Button>]}
                            style={{ marginBottom: '20px' }}
                        >
                            <Form form={form} layout='vertical' onFinish={updateProfile}>
                                <Row gutter={10}>
                                    <Col md={12} sm={24} xs={24}>
                                        <Form.Item label="Tên hiển thị:" name="user_name" rules={[
                                            {
                                                required: true,
                                                message: 'Tên hiển thị không được để trống!',
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} sm={24} xs={24}>
                                        <Form.Item label="Email:" name="email" rules={[
                                            {
                                                type: 'email',
                                                message: 'Email không hợp lệ!',
                                            },
                                            {
                                                required: true,
                                                message: 'Email không được để trống!',
                                            },
                                        ]}>
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} sm={24} xs={24}>
                                        <Form.Item label="Số dư:" name="balance">
                                            <Input disabled={true} />
                                        </Form.Item>
                                    </Col>
                                    <Col md={12} sm={24} xs={24}>
                                        <Form.Item label="Số điểm:" name="point" >
                                            <Input disabled={true} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Form>
                        </Card>
                    </Col>
                    <Col md={24} sm={24} xs={24} >
                        <Card title="Yêu cầu rút tiền" className={cx('card')}>
                            <Table scroll={{ x: 500, y: 500 }} columns={columns} dataSource={withdrawList} />
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
}

export default AccountPage;
