import createInstanceAxios from 'services/axios.customize';

const axios = createInstanceAxios(import.meta.env.VITE_BACKEND_URL);

const axiosPayment = createInstanceAxios(import.meta.env.VITE_BACKEND_PAYMENT_URL)

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

const getBooksAPI = (query?: string) => {
    const URL_BACKEND = `/api/v1/book?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IBook>>>(URL_BACKEND, {
        headers: {
            delay: 1500,
        }
    });
}

const getCategoryAPI = () => {
    const URL_BACKEND = `/api/v1/database/category`;
    return axios.get<IBackendRes<string[]>>(URL_BACKEND);
}

const callUploadFileImgAPI = (fileImg: any, type: "book" | "avatar") => {
    const URL_BACKEND = "/api/v1/file/upload";
    const bodyFormData = new FormData();
    bodyFormData.append('fileImg', fileImg);
    return axios.post<IBackendRes<{ "fileUploaded": string }>>(URL_BACKEND, bodyFormData, {
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": `${type}`,
        }
    });
}

const updateUserInforAPI = (data: IUpdateInfor) => {
    const URL_BACKEND = "/api/v1/user";
    return axios.put<IBackendRes<IUpdateBook>>(URL_BACKEND, data);
}

const createBookAPI = (data: ICreateBook) => {
    const URL_BACKEND = "/api/v1/book";
    return axios.post<IBackendRes<ICreateBook>>(URL_BACKEND, data);
}

const updateBookAPI = (data: ICreateBook, id: string | undefined) => {
    const URL_BACKEND = `/api/v1/book/${id}`;
    return axios.put<IBackendRes<IUpdateBook>>(URL_BACKEND, data);
}

const deleteBookAPI = (id: string) => {
    const URL_BACKEND = `/api/v1/book/${id}`;
    return axios.delete<IBackendRes<IDeleteBook>>(URL_BACKEND);
}

const getBookById = (id: string) => {
    const URL_BACKEND = `/api/v1/book/${id}`;
    return axios.get<IBackendRes<IBook>>(URL_BACKEND, {
        headers: {
            delay: 3000
        }
    });
}

const createOrderAPI = (data: ICreateOrder) => {
    const URL_BACKEND = `/api/v1/order`;
    return axios.post<IBackendRes<string>>(URL_BACKEND, data, {
        headers: {
            delay: 1000,
        }
    });
};

const getOrderHistoryAPI = () => {
    const URL_BACKEND = `/api/v1/history`;
    return axios.get<IBackendRes<IHistory[]>>(URL_BACKEND, {
        headers: {
            delay: 1500,
        }
    });
}

const changePasswordAPI = (data: IChangePassword) => {
    const URL_BACKEND = `/api/v1/user/change-password`;
    return axios.post<IBackendRes<string>>(URL_BACKEND, data);
}

const dashBoardAPI = () => {
    const URL_BACKEND = `/api/v1/database/dashboard`;
    return axios.get<IBackendRes<IStatistic>>(URL_BACKEND);
}

const getOrderAPI = (query: string) => {
    const URL_BACKEND = `/api/v1/order?${query}`;
    return axios.get<IBackendRes<IModelPaginate<IOrder>>>(URL_BACKEND);
};

const getVNPayUrlAPI = (amount: number, locale: string, paymentRef: string) => {
    const URL_BACKEND = "/vnpay/payment-url";
    return axiosPayment.post<IBackendRes<{ url: string }>>(URL_BACKEND, { amount, locale, paymentRef });
}

const updatePaymentOrderAPI = (paymentStatus: string, paymentRef: string) => {
    const URL_BACKEND = "/api/v1/order/update-payment-status";
    return axios.post<IBackendRes<ILogin>>(URL_BACKEND, { paymentStatus, paymentRef }, {
        headers: {
            delay: 1000
        }
    });
}

const refreshTokenAPI = () => {
    const URL_BACKEND = "/api/v1/auth/refresh";
    return axios.get<IBackendRes<ILogin>>(URL_BACKEND);
}

export const loginWithGoogleAPI = (type: string, email: string) => {
    const URL_BACKEND = "/api/v1/auth/social-media";
    return axios.post<IBackendRes<ILogin>>(URL_BACKEND, { type, email });
};

export {
    loginAPI, registerAPI, fetchAccountAPI,
    logoutAPI, getUsersAPI, createUserAPI,
    createListUsersAPI, updateUserAPI,
    deleteUserAPI, getBooksAPI, getCategoryAPI,
    callUploadFileImgAPI, createBookAPI,
    updateBookAPI, deleteBookAPI,
    getBookById, createOrderAPI,
    getOrderHistoryAPI, changePasswordAPI,
    updateUserInforAPI, dashBoardAPI,
    getOrderAPI, getVNPayUrlAPI,
    updatePaymentOrderAPI, refreshTokenAPI
};