import classNames from 'classnames/bind';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import isEmpty from 'validator/lib/isEmpty';

import { combinedStatusSelector } from '../../redux/selector';
import { loginSlice } from '../../redux/sliceReducer';
import { getUserLogin, setUserRegister } from '../../services/userApi';
import Button from '../Button';
import { Close, Loading } from '../Icons';
import styles from './Form.module.scss';
import { useResetIconStyle } from 'antd/es/theme/internal';

const cx = classNames.bind(styles);

function Form() {
    const dispatch = useDispatch();
    const btnEnterRef = useRef();
    const { isLogin } = useSelector(combinedStatusSelector);
    // form
    const [user, setUser] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [phone, setPhone] = useState('');

    //Login
    const [isLoginForm, setIsLogin] = useState(isLogin);
    const [validMsgError, setValidMsgError] = useState({});

    //loadingForm
    const [isLoadingForm, setLoadingForm] = useState(false);

    const onChangeForm = () => {
        setIsLogin(!isLoginForm);
        setValidMsgError(false);
        setUser('');
        setPhone('');
        setPassword('');
        setPasswordConfirm('');
    };
    const handleCloseForm = () => {
        dispatch(loginSlice.actions.setIsLogin(false));
    };

    const onTypeUser = (e) => {
        setUser(e.target.value);
        if (e.target.value) {
            setValidMsgError((prev) => {
                return { ...prev, user: '' };
            });
        }
    };
    const onTypePassWord = (e) => {
        setPassword(e.target.value);

        if (e.target.value) {
            setValidMsgError((prev) => {
                return { ...prev, password: '' };
            });
        }
    };
    const onTypeName = (e) => {
        setName(e.target.value);

        if (e.target.value) {
            setValidMsgError((prev) => {
                return { ...prev, name: '' };
            });
        }
    };

    const onTypePassWordConfirm = (e) => {
        setPasswordConfirm(e.target.value);
        if (e.target.value) {
            setValidMsgError((prev) => {
                return { ...prev, passwordconfirm: '' };
            });
        }
    };
    const onTypePhone = (e) => {
        setPhone(e.target.value);
        if (e.target.value) {
            setValidMsgError((prev) => {
                return { ...prev, phone: '' };
            });
        }
    };

    const validator = () => {
        const msg = {};

        if (isLoginForm) {
            if (isEmpty(user)) {
                msg.user = 'Vui lòng nhập tên tài khoản';
            }
            if (isEmpty(password)) {
                msg.password = 'Vui lòng nhập mật khẩu';
            } else {
                const regexPassword = new RegExp('^.{8,}$');
                if (!regexPassword.test(password))
                    msg.password = 'Mật khẩu phải lớn hơn 8 kí tự và có kiểu hoa và thường';
            }
        } else {
            if (isEmpty(password)) {
                msg.password = 'Vui lòng nhập mật khẩu';
            } else {
                const regexPassword = new RegExp('^.{8,}$');

                if (!regexPassword.test(password))
                    msg.password = 'Mật khẩu phải lớn hơn 8 kí tự và có kiểu hoa và thường';
            }

            if (isEmpty(passwordConfirm)) {
                msg.passwordconfirm = 'Vui lòng xác nhận mật khẩu';
            } else {
                if (passwordConfirm !== password) {
                    msg.passwordconfirm = 'Mật khẩu không chính xác';
                }
            }

            if (isEmpty(user?.trim())) {
                msg.user = 'Vui lòng nhập user';
            } else {
                const regexUser = new RegExp('^[a-z0-9_-]{8,20}$');
                if (!regexUser.test(user)) msg.user = 'User phải từ 8 - 20 kí tự';
            }

            if (isEmpty(phone)) {
                msg.phone = 'Vui lòng nhập số điện thoại';
            }

            if (isEmpty(name)) {
                msg.name = 'Vui lòng nhập họ và tên';
            }
        }

        setValidMsgError(msg);
        if (Object.keys(msg).length > 0) return false;

        if (isLoginForm) return true;
        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validator();
        if (!isValid) return;

        const fetchSubmit = async () => {
            setLoadingForm(true);
            try {
                await setUserRegister(user, passwordConfirm, phone, name);

                toast.success('Tạo tài khoản thành công !!!');
                setIsLogin(true);
            } catch (error) {
                if (error.response.status === 422) {
                    toast.info('Tài khoản đã tồn tại !!!');
                }
            }
            setLoadingForm(false);
        };
        fetchSubmit();
    };

    const handleLogin = (e) => {
        e.preventDefault();
        const isValid = validator();

        if (!isValid) return;

        const fetchLogin = async () => {
            setLoadingForm(true);
            try {
                const response = await getUserLogin(user, password);
                const data = await response.data;
                const { access_token } = data.jwt;
                const user = {
                    ...data,
                    accessToken: access_token,
                }
                dispatch(loginSlice.actions.setDataUser(user));
                dispatch(loginSlice.actions.setAccessToken(access_token));
                toast.success('Đăng nhập thành công !!!');
            } catch (err) {
                if (err.response.status === 422) {
                    toast.error('Sai tên đăng nhập hoặc mật khẩu !!!');
                }
            }
            setLoadingForm(false);
        };

        fetchLogin();
    };

    useEffect(() => {
        //enter to submit form
        const handlePressKeyEnter = (e) => {
            if (e.key === 'Enter') {
                btnEnterRef.current.click();
            }
        };
        window.addEventListener('keyenter', handlePressKeyEnter);

        return () => window.removeEventListener('keyenter', handlePressKeyEnter);
    }, []);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('container_section')}>
                <h3 className={cx('title_form')}>
                    {isLoginForm ? 'Đăng nhập' : 'Đăng Kí'}
                    <span className={cx('btn_close')} onClick={handleCloseForm}>
                        <Button Icons={Close} circle />
                    </span>
                </h3>
                <form
                    className={cx('form_container')}
                    onSubmit={(e) => (isLoginForm ? handleLogin(e) : handleSubmit(e))}
                >
                    {isLoginForm ? (
                        ///////////////
                        /* Form Login */
                        ///////////////
                        <div className={cx('form')}>
                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="user">
                                    Tên đăng nhập
                                </label>
                                <input
                                    className={cx(
                                        'input_form',
                                        validMsgError.user ? 'invalid' : '',
                                    )}
                                    value={user}
                                    placeholder="Nhập tên tài khoản"
                                    type="text"
                                    id="user"
                                    onChange={onTypeUser}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.user}{' '}
                                </span>
                            </div>

                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="password">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu..."
                                    className={cx(
                                        'input_form',
                                        validMsgError.password ? 'invalid' : '',
                                    )}
                                    value={password}
                                    onChange={onTypePassWord}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.password}{' '}
                                </span>
                            </div>
                        </div>
                    ) : (
                        //////////////////
                        /* Form Register */
                        //////////////////
                        <div className={cx('form')}>
                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="userName">
                                    Tên đăng nhập
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    placeholder="Tên đăng nhập"
                                    className={cx(
                                        'input_form',
                                        validMsgError.user ? 'invalid' : '',
                                    )}
                                    value={user}
                                    onChange={onTypeUser}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.user}{' '}
                                </span>
                            </div>
                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="name">
                                    Họ và tên
                                </label>
                                <input
                                    type="text"
                                    id="userName"
                                    placeholder="Họ và tên"
                                    className={cx(
                                        'input_form',
                                        validMsgError.name ? 'invalid' : '',
                                    )}
                                    value={name}
                                    onChange={onTypeName}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.name}{' '}
                                </span>
                            </div>

                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="password">
                                    Mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    placeholder="Mật khẩu..."
                                    className={cx(
                                        'input_form',
                                        validMsgError.password ? 'invalid' : '',
                                    )}
                                    value={password}
                                    onChange={onTypePassWord}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.password}
                                </span>
                            </div>

                            <div className={cx('form_input')}>
                                <label
                                    className={cx('form_label')}
                                    htmlFor="password_confirm"
                                >
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="password_confirm"
                                    placeholder="Xác nhận mật khẩu"
                                    className={cx(
                                        'input_form',
                                        validMsgError.passwordconfirm ? 'invalid' : '',
                                    )}
                                    value={passwordConfirm}
                                    onChange={onTypePassWordConfirm}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.passwordconfirm}
                                </span>
                            </div>

                            <div className={cx('form_input')}>
                                <label className={cx('form_label')} htmlFor="phone">
                                    Số điện thoại
                                </label>
                                <input
                                    className={cx(
                                        'input_form',
                                        validMsgError.phone ? 'invalid' : '',
                                    )}
                                    value={phone}
                                    placeholder="Nhập số điện thoại"
                                    type="text"
                                    id="phone"
                                    onChange={onTypePhone}
                                />

                                <span className={cx('messenger_error')}>
                                    {validMsgError.phone}
                                </span>
                            </div>
                        </div>
                    )}

                    <div className={cx('bottom_form')}>
                        <span className={cx('bottom_text')}>
                            {isLoginForm
                                ? 'Bạn không có tài khoản ?'
                                : 'Bạn đã có tài khoản ?'}
                        </span>
                        <span
                            className={cx('bottom_btn_register')}
                            onClick={onChangeForm}
                        >
                            {isLoginForm ? 'Đăng Ký' : 'Đăng Nhập'}
                        </span>
                    </div>

                    <button
                        type="submit"
                        ref={btnEnterRef}
                        className={cx('btn_form', isLoadingForm ? 'isLoading' : '')}
                    >
                        <span className={cx('loading_form')}>
                            {isLoadingForm && <Loading />}
                        </span>
                        <span>{isLoginForm ? 'Đăng nhập' : 'Đăng kí'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Form;
