export { };

declare global {
    interface IBackendRes<T> {
        error?: string | string[];
        message: string;
        statusCode: number | string;
        data?: T;
    }

    interface IModelPaginate<T> {
        meta: {
            current: number;
            pageSize: number;
            pages: number;
            total: number;
        },
        result: T[]
    }

    interface ILogin {
        access_token: string;
        user: {
            email: string;
            phone: string;
            fullName: string;
            role: string;
            avatar: string;
            id: string;
        }
    }

    interface IRegister {
        _id: string,
        email: string,
        fullName: string,
    }

    interface IUser {
        email: string;
        phone: string;
        fullName: string;
        role: string;
        avatar: string;
        id: string;

    }

    interface IBook {
        _id: string;
        thumbnail: string;
        slider: string[];
        mainText: string;
        author: string;
        sold: number;
        price: number;
        quantity: number;
        category: string;
        createdAt: Date;
        updatedAt: Date;
        __v: number;
    }

    interface IFetchAccount {
        user: IUser;
    }


    interface ICreateUser {
        fullName: string;
        email: string;
        phone: string;
        password: string;
        countSuccess?: number;
        countError?: number;
        detail?: string | IError[];
    }

    interface IDeleteUser {
        deletedCount: number,
        acknowledged: boolean,
    }

    interface IError {
        err: IErrorDetail,
        index: 0;
    }

    interface IErrorDetail {
        index: number;
        code: number;
        errmsg: string;
        op: IUserTable;
    }

    interface IUserTable extends IUser {
        isActive?: boolean;
        __v: number;
        type: string;
        createdAt: Date;
        updatedAt: Date;
        _id: string;
    }
}
