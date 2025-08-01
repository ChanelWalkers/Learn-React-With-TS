import { Row, Col, Rate, Divider, message, Breadcrumb } from 'antd';
import ImageGallery from 'react-image-gallery';
import { useEffect, useRef, useState } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { BsCartPlus } from 'react-icons/bs';
import 'styles/book.scss';
import ModalGallery from './modal.gallery';
import { useCurrentApp } from '../../context/app.context';
import { Link, useNavigate } from 'react-router-dom';

interface IProps {
    currentBook: IBook | null;
}


const BookDetail = (props: IProps) => {
    const { currentBook } = props;

    const { isAuthenticated } = useCurrentApp();

    const navigate = useNavigate();

    const [imageGallery, setImageGallery] = useState<{
        original: string;
        thumbnail: string;
        originalClass: string;
        thumbnailClass: string;
    }[]>([])

    const [isOpenModalGallery, setIsOpenModalGallery] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const [quantity, setQuantity] = useState<number>(1);

    const { setCarts } = useCurrentApp();

    const refGallery = useRef<ImageGallery>(null);


    const handleAddProduct = () => {
        if (currentBook && quantity >= currentBook.quantity) {
            message.error("It reached max quantity of this book");
            return;
        }
        setQuantity((cur) => cur + 1);
    }



    const handleSubProduct = () => {
        if (quantity <= 1) {
            message.error("Default quantity of this book at least 1");
            return;
        }
        setQuantity((cur) => cur - 1);
    }

    const handleAddCart = (isBuyNow = false) => {
        if (!isAuthenticated) {
            message.error("Vui lòng đăng nhập để thực hiện tính năng này!");
            return;
        }
        const data: ICart[] = [];
        const cartStorage = localStorage.getItem('carts');
        if (cartStorage && currentBook) {
            const carts = JSON.parse(cartStorage) as ICart[];
            const indexFound = carts.findIndex(c => c._id === currentBook._id);
            if (indexFound === -1) {
                carts.push({
                    _id: currentBook._id,
                    quantity: quantity,
                    detail: currentBook
                });
            } else {
                carts[indexFound].quantity = carts[indexFound].quantity + quantity;
            }
            setCarts(carts);
            localStorage.setItem('carts', JSON.stringify(carts));
        } else {
            data.push({
                _id: currentBook?._id,
                quantity: quantity,
                detail: currentBook
            });
            localStorage.setItem('carts', JSON.stringify(data));
        }
        if (isBuyNow) {
            navigate("/order");
        } else {
            message.success('Add product to cart successfully!');
        }
    }

    useEffect(() => {
        if (currentBook) {
            //build images 
            const images = [];
            if (currentBook.thumbnail) {
                images.push(
                    {
                        original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${currentBook.thumbnail}`,
                        originalClass: "original-image",
                        thumbnailClass: "thumbnail-image"
                    },
                )
            }
            if (currentBook.slider) {
                currentBook.slider?.map(item => {
                    images.push(
                        {
                            original: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            thumbnail: `${import.meta.env.VITE_BACKEND_URL}/images/book/${item}`,
                            originalClass: "original-image",
                            thumbnailClass: "thumbnail-image"
                        },
                    )
                })
            }
            setImageGallery(images)
        }
    }, [currentBook])

    const handleOnClickImage = () => {
        //get current index onClick
        setIsOpenModalGallery(true);
        setCurrentIndex(refGallery?.current?.getCurrentIndex() ?? 0)
    }


    return (
        <div style={{ background: '#efefef', padding: "20px 0" }}>
            <div className='view-detail-book' style={{ maxWidth: 1440, margin: '0 auto', minHeight: "calc(100vh - 150px)" }}>
                <Breadcrumb
                    separator=">"
                    items={[
                        {
                            title: <Link to={"/"}>Trang Chủ</Link>,
                        },

                        {
                            title: 'Xem chi tiết sách',
                        },
                    ]}
                />
                <div style={{ padding: "20px", background: '#fff', borderRadius: 5 }}>
                    <Row gutter={[20, 20]}>
                        <Col md={10} sm={0} xs={0}>
                            <ImageGallery
                                ref={refGallery}
                                items={imageGallery}
                                showPlayButton={false} //hide play button
                                showFullscreenButton={false} //hide fullscreen button
                                renderLeftNav={() => <></>} //left arrow === <> </>
                                renderRightNav={() => <></>}//right arrow === <> </>
                                slideOnThumbnailOver={true}  //onHover => auto scroll images
                                onClick={() => handleOnClickImage()}
                            />
                        </Col>
                        <Col md={14} sm={24}>
                            <Col md={0} sm={24} xs={24}>
                                <ImageGallery
                                    ref={refGallery}
                                    items={imageGallery}
                                    showPlayButton={false} //hide play button
                                    showFullscreenButton={false} //hide fullscreen button
                                    renderLeftNav={() => <></>} //left arrow === <> </>
                                    renderRightNav={() => <></>}//right arrow === <> </>
                                    showThumbnails={false}
                                />
                            </Col>
                            <Col span={24}>
                                <div className='author'>Tác giả: <a href='#'>{currentBook?.author}</a> </div>
                                <div className='title'>{currentBook?.mainText}</div>
                                <div className='rating'>
                                    <Rate value={5} disabled style={{ color: '#ffce3d', fontSize: 12 }} />
                                    <span className='sold'>
                                        <Divider type="vertical" />
                                        Đã bán {currentBook?.sold ?? 0}</span>
                                </div>
                                <div className='price'>
                                    <span className='currency'>
                                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(currentBook?.price ?? 0)}
                                    </span>
                                </div>
                                <div className='delivery'>
                                    <div>
                                        <span className='left'>Vận chuyển</span>
                                        <span className='right'>Miễn phí vận chuyển</span>
                                    </div>
                                </div>
                                <div className='quantity'>
                                    <span className='left'>Số lượng</span>
                                    <span className='right'>
                                        <button onClick={handleSubProduct} ><MinusOutlined /></button>
                                        <input style={{ width: '80px' }} type='number' min={1} value={quantity} max={currentBook?.quantity} onChange={(e) => setQuantity(+e.target.value)} defaultValue={quantity} />
                                        <button onClick={handleAddProduct}><PlusOutlined /></button>
                                    </span>
                                </div>
                                <div className='buy'>
                                    <button className='cart' onClick={() => handleAddCart()}>
                                        <BsCartPlus className='icon-cart' />
                                        <span>Thêm vào giỏ hàng</span>
                                    </button>
                                    <button onClick={() => handleAddCart(true)} className='now'>Mua ngay</button>
                                </div>
                            </Col>
                        </Col>
                    </Row>
                </div>
            </div>
            <ModalGallery
                isOpen={isOpenModalGallery}
                setIsOpen={setIsOpenModalGallery}
                currentIndex={currentIndex}
                items={imageGallery}
                title={currentBook?.mainText ?? ""}
            />
        </div>
    )
}

export default BookDetail;