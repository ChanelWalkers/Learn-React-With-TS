import BookDetail from "@/components/client/book/book.detail";
import BookLoader from "@/components/client/book/book.loader";
import { getBookById } from "@/services/api";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const BookPage = () => {
    const { id } = useParams();

    const [currentBook, setCurrentBook] = useState<IBook | null>(null);
    const [isLoadingBook, setIsLoadingBook] = useState<boolean>(false);
    useEffect(() => {
        if (id) {
            setIsLoadingBook(true);
            const fetBookById = async (id: string) => {
                const res = await getBookById(id);
                if (res && res.data) {
                    setCurrentBook(res.data);
                }
                setIsLoadingBook(false);
            }
            fetBookById(id);
        }
    }, [id]);

    return (
        <div>
            {isLoadingBook ? <BookLoader /> :
                <BookDetail
                    currentBook={currentBook}
                />
            }
        </div>
    )
}

export default BookPage;