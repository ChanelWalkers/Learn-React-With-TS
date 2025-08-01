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

    interface ICreateBook {
        __v?: number;
        createdAt?: Date;
        updatedAt?: Date;
        _id?: string;
        thumbnail: unknown;
        slider: unknown;
        mainText: string;
        author: string;
        price: number;
        quantity: number;
        category: string;
    }

    interface IUpdateBook {
        acknowledged: boolean;
        modifiedCount: number;
        upsertedId: number | null;
        upsertedCount: number;
        matchedCount: number;
    }

    interface IDeleteBook extends IDeleteUser {

    }

    interface ICart {
        _id: string | undefined;
        quantity: number;
        detail: IBook | null;
    }

    interface ICreateOrder {
        name: string;
        address: string;
        phone: string;
        totalPrice: number;
        type: string;
        detail: {
            bookName: string,
            quantity: number,
            _id: string,
        }[];
        paymentRef?: string;
    }

    interface IHistory extends ICreateOrder {
        userId: string;
        email: string;
        paymentStatus: string;
        paymentRef: string;
        __v: number;
        createdAt: Date;
        updatedAt: Date;
    }

    interface IChangePassword {
        email: string;
        oldpass: string;
        newpass: string;
    }

    interface IUpdateInfor {
        _id: string;
        fullName: string;
        phone: string;
        avatar: string;
    }

    interface IStatistic {
        countUser: number;
        countOrder: number;
        countBook: number;
    }

    interface IOrder {
        _id: string;
        name: string;
        address: string;
        totalPrice: number;
        createdAt: Date;
    }

}
