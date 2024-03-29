import * as httpRequest from '../untils/request';
import * as httpRequest2 from '../untils/request2';

export const getUserLogin = async (user_name, password) => {
    const result = await httpRequest2.post('/auth/login', {
        user_name: user_name,
        password: password,
    });
    return result;
};
export const setUserRegister = async (userName, passwordConfirm, phone, name) => {
    // const result = await httpRequest.post('/account/register/', {
    //     userName: userName,
    //     email: email,
    //     password: passwordConfirm,
    // });

    // console.log(result);

    const result = await httpRequest2.post('/auth/register', {
        phone: phone,
        password: passwordConfirm,
        user_name: userName,
        name: name,
    });

    return result;
};
export const getProfileUser = async (accessToken) => {
    const result = await httpRequest2.get('/profile', {
        headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
        },
    });
    console.log(result);
    return result;
};

export const createSongFavoriteUser = async (accessToken, _id) => {
    const result = await httpRequest.post(
        '/favorite/create/',
        { idMusic: _id, Response: { message: 'Create favorite success' } },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json',
            },
        },
    );
    return result;
};
export const removeSongFavoriteUser = async (accessToken, _id) => {
    const result = await httpRequest.post(
        '/favorite/create/',
        { idMusic: _id, Response: { message: '"Delete favorite success' } },
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-type': 'application/json',
            },
        },
    );
    return result;
};
export const getSongFavorite = async (accessToken, limit = 100) => {
    const result = await httpRequest.get('/favorite/get-authorization-token?_limit=20', {
        _limit: limit,
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return result;
};
