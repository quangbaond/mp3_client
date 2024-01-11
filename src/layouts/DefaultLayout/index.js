import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/Sidebar';
import styles from './DefaultLayout.module.scss';
import Header from '../../layouts/components/Header';
import { loginSlice, sidebarSlice } from '../../redux/sliceReducer';
import { combinedStatusSelector } from '../../redux/selector';
import { Form, Input, Modal, Select, InputNumber } from 'antd';
import { request } from '../../untils/request2';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const ref = useRef();
    const wrapperRef = useRef();
    const [isScroll, setScroll] = useState();
    const params = useParams();
    const dispatch = useDispatch();
    const { isWithDraw, dataUser } = useSelector(combinedStatusSelector);
    const [form] = Form.useForm();
    const banks = ['Vietinbank', 'Vietcombank', 'BIDV', 'Agribank', 'Techcombank', 'VPBank', 'MBBank', 'Sacombank', 'ACB', 'HDBank', 'TPBank', 'OceanBank', 'SHB', 'VIB', 'SeABank', 'BacABank', 'NamABank', 'Eximbank', 'GPBank', 'PG Bank', 'VietABank', 'BVB', 'NCB', 'OCB', 'VRB', 'SCB', 'KienLongBank', 'BaoVietBank', 'VietCapitalBank', 'VietBank', 'BacA Bank']

    const bankArray = banks.map((bank, index) => {
        return {
            value: bank,
            label: bank,
        }
    });

    const withdraw = async (values) => {
        if (dataUser.data.balance < values.amount) {
            Modal.error({
                title: 'Số dư không đủ',
                content: 'Vui lòng nạp thêm tiền để thực hiện giao dịch',
            });
            return;
        }

        const response = await request.post('/withdraws', values, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${dataUser.accessToken}`,
            },
        });

        if (response.status === 200) {
            Modal.success({
                title: 'Rút tiền thành công',
                content: 'Vui lòng chờ xác nhận từ admin',
            });
            dispatch(sidebarSlice.actions.setWithDraw(false));
            dispatch(loginSlice.actions.setBalance(dataUser.data.balance - values.amount));
            return;
        }
    };

    useEffect(() => {
        const instance = ref.current;

        const handleScroll = () => {
            setScroll(instance.scrollTop);
        };
        instance.addEventListener('scroll', handleScroll);

        return () => instance.removeEventListener('scroll', handleScroll);
    }, []);
    useEffect(() => {
        const instance = ref.current;
        if (params) {
            instance.scrollTo(0, 0);
        }
    }, [params]);
    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <div className={cx('sidbar')}>
                <Sidebar />
            </div>
            <div className={cx('main_page')} ref={ref}>
                <div className={cx('header')}>
                    <Header isScrollHeader={isScroll} />
                </div>
                <div className={cx('content')}>{children}</div>
            </div>
            <Modal title="Rút tiền" centered open={isWithDraw} onOk={() => form.submit()} onCancel={() => {
                dispatch(sidebarSlice.actions.setWithDraw(false));
            }} okText="Tạo yêu cầu" cancelText="Hủy">
                <Form form={form} layout='vertical' onFinish={withdraw}>
                    <Form.Item label="Số tiền" name="amount" rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số tiền',
                        },
                        {
                            type: 'number',
                            message: 'Vui lòng nhập số',
                        }
                    ]}>
                        <InputNumber style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item label="Ngân hàng" name="bank_branch" rules={[
                        {
                            required: true,
                            message: 'Vui lòng chọn ngân hàng',
                        },
                    ]}>
                        <Select
                            defaultValue="Vietinbank"
                            initValue="Vietinbank"
                            showSearch={true}
                            allowClear
                            options={bankArray}
                            defaultActiveFirstOption={true}
                        />
                    </Form.Item>
                    <Form.Item label="Số tài khoản" name="bank_account_number" required rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập số tài khoản',
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Tên tài khoản" name="bank_account_name" rules={[
                        {
                            required: true,
                            message: 'Vui lòng nhập tên tài khoản',
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}

export default DefaultLayout;
DefaultLayout.propTypes = {
    children: PropTypes.node,
};
