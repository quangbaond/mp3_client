import PropTypes from 'prop-types';
import classNames from 'classnames/bind';

import Button from '../../../components/Button';
import styles from './Sidebar.module.scss';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sidebarSlice } from '../../../redux/sliceReducer';
import { combinedStatusSelector } from '../../../redux/selector';
const cx = classNames.bind(styles);
function SidebarItem({ data, onClick, isActive, dataset, isTablet, isOpenSideBar }) {
    const dispatch = useDispatch();
    const { isLogin, dataUser } = useSelector(combinedStatusSelector);

    return (
        <>
            <li
                className={cx(
                    'sidebar_item',
                    isActive ? 'isActive' : '',
                    isOpenSideBar && 'poup_tablet_item',
                )}
                style={data.auth && !dataUser.accessToken ? { display: 'none' } : {}}
                onClick={() => {
                    if (data.to === '/withdraw') {
                        dispatch(sidebarSlice.actions.setWithDraw(true));
                    }
                    eval(onClick);
                }}
                data-index={dataset}
            >
                <Button typeSideBar Icons={data.icon} title={data.title} to={data.to}>
                    {(!isTablet || isOpenSideBar) && data.title}
                </Button>
            </li>
        </>

    );
}

export default SidebarItem;

SidebarItem.propTypes = {
    data: PropTypes.object,
    onClick: PropTypes.func,
    isActive: PropTypes.bool,
    dataset: PropTypes.number,
    isTablet: PropTypes.bool,
};
