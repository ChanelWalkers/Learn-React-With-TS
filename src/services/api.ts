import axios from 'services/axios.customize';

const loginAPI = (username: string, password: string) => {
    const URL_BACKEND = '/api/v1/auth/login';
    return axios.post<IBackendRes<ILogin>>(URL_BACKEND, { username, password });
}

const registerAPI = (fullName: string, email: string, password: string, phone: string) => {
    const URL_BACKEND = '/api/v1/user/register';
    const data = {
        fullName: fullName,
        email: email,
        password: password,
        phone: phone,
    }
    return axios.post<IBackendRes<IRegister>>(URL_BACKEND, data);
}

const fetchAccountAPI = () => {
    const URL_BACKEND = '/api/v1/auth/account';
    return axios.get<IBackendRes<IFetchAccount>>(URL_BACKEND, {
        headers: {
            delay: 1000
        }
    });
}

const logoutAPI = () => {
    const URL_BACKEND = "/api/v1/auth/logout";
    return axios.post<IBackendRes<IRegister>>(URL_BACKEND);
}

const getUsersAPI = (query?: string) => {
    const URL_BACKEND = `/api/v1/user?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IUserTable>>>(URL_BACKEND);
}

const createUserAPI = (data: ICreateUser) => {
    const URL_BACKEND = `/api/v1/user`;
    return axios.post<IBackendRes<ICreateUser>>(URL_BACKEND, data);
}

const createListUsersAPI = (data: ICreateUser[]) => {
    const URL_BACKEND = `/api/v1/user/bulk-create`;
    const payload = data.map(it => {
        const newData = { ...it };
        if (newData.password === undefined) {
            newData.password = '123456';
        }
        return newData;
    });
    return axios.post<IBackendRes<ICreateUser>>(URL_BACKEND, payload);
}

const updateUserAPI = (fullName: string, phone: string, _id: string) => {
    const URL_BACKEND = `/api/v1/user`;
    return axios.put<IBackendRes<IRegister>>(URL_BACKEND, { fullName, phone, _id });
}

const deleteUserAPI = (_id: string) => {
    const URL_BACKEND = `/api/v1/user/${_id}`;
    return axios.delete<IBackendRes<IDeleteUser>>(URL_BACKEND);
}

const getBookAPI = (query?: string) => {
    const URL_BACKEND = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBook>>>(URL_BACKEND);
}


export {
    loginAPI, registerAPI, fetchAccountAPI,
    logoutAPI, getUsersAPI, createUserAPI,
    createListUsersAPI, updateUserAPI,
    deleteUserAPI
};