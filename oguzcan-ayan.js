(() => {
    const recommendedProductKey = 'recommendedProducts';
    const favouriteKey = 'favouriteProducts';
    const productApi = 'https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json';

    const ensureProductDetailExists = () => {
        let productDetail = document.querySelector('.product-detail');
        if (!productDetail) {
            productDetail = document.createElement('div');
            productDetail.className = 'product-detail';
            document.body.appendChild(productDetail);
        }
    };

    const init = async () => {

        ensureProductDetailExists();

        if (!document.querySelector('.product-detail'))
            return;

        let products = JSON.parse(localStorage.getItem(recommendedProductKey)) || await fetchProducts();
        buildHtml(products);
        buildCss();
        setEvents();
    };
    const fetchProducts = async () => {
        try {
            const response = await fetch(productApi);
            const products = await response.json();
            localStorage.setItem(recommendedProductKey, JSON.stringify(products));
            return products;

        } catch (error) {
            console.error('Error while fetching products', error);
            return [];
        }
    };

    const buildHtml = (products) => {
        const productDetail = document.querySelector('.product-detail');
        if (!productDetail) return;

        const productContainer = document.createElement('div');
        productContainer.className = 'recommended-products';
        productContainer.innerHTML = `
            <h1 class = "product-category-title">You Might Also Like</h1>
            <div class = "slider-wrapper">
                <button class="slider-prev-btn">&#9664;</button>
                <div class = "slider-track">${products.map(productCard).join('')}</div>
                <button class = "slider-next-btn">&#9658;</button>
            </div>`;

        productDetail.after(productContainer);
    };

    const productCard = (product) => {
        const favouriteItems = JSON.parse(localStorage.getItem(favouriteKey)) || '[]';
        const isFavourite = favouriteItems.includes(String(product.id)) ? 'favourited' : '';
        return `
            <div class = "product-card" data-id = "${product.id}" data-url = "${product.url}">
                <img class = "product-image" src = "${product.img}" alt = "${product.name}">
                <span class = "heart ${isFavourite}">&#9829;</span>
                <p>${product.name}</p>
                <p class = "product-price">${product.price} TRY</p>
            </div>
        `;
    };

    const buildCss = () => {
        const css = `
            .recommended-products {
                text-align: left;
                margin-top: 40px;
            }
            .product-category-title{
                margin-left: 50px;
            }
            .slider-wrapper{
                display: flex;
                align-items: center;
                overflow: hidden;
                position: relative;
            }
            .slider-track{
                display: flex;
                transition: transform 0.2s ease-in-out;
            }
            .product-card{
                min-width: 300px;
                padding: 5px;
                cursor: pointer;
                position: relative;
            }
            .product-image{
                width: 225px;
                height: 225px;
                
            }
            .product-price{
                font-size:20px;
                color: blue;
            }
            .heart{
                display: inline-block;
                cursor: pointer;
                color: gray;
                position: absolute;
                font-size: 24px;
                z-index: 2;
                right: 90px;
            }
            .heart.favourited{
                color: blue;
            }
            .slider-prev-btn{
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 1;
            }
            .slider-next-btn{
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 1;
                position: absolute;
                right: 5px;
            }
            
            @media (max-width: 1024px) {
                .product-card {
                min-width: 225px;
                }

                .product-image {
                width: 200px;
                height: 200px;
                }

                .heart{
                    right: 40px;
                }
            }

            @media (max-width: 768px) {

                .product-image {
                width: 175px;
                height: 175px;
                }

                 .heart{
                    right: 65px;
                }
            }

            @media (max-width: 480px) {

                .product-card {
                    min-width: 200px;
                }

                .product-image {
                    width: 150px;
                    height: 150px;
                }
            }
        `;
        const style = document.createElement('style');
        style.className = 'slider-style';
        style.innerHTML = css;
        document.head.appendChild(style);
    };

    const setEvents = () => {
        document.addEventListener('click', (e) => {

            if (e.target.classList.contains('slider-prev-btn')) {
                slideSlider(-1);
                return;
            } 
            if (e.target.classList.contains('slider-next-btn')) {
                slideSlider(1);
                return;
            }
    
            if (e.target.classList.contains('heart')) {
                e.stopPropagation();
                toggleFavouriteBtn(e.target.closest('.product-card').dataset.id, e.target);
                return;
            }
    
            const productCard = e.target.closest('.product-card');
            if (productCard) {
                const productUrl = productCard.dataset.url;
                window.open(productUrl, '_blank');
            }
        });
    };
    

    let currentIndex = 0;

    const slideSlider = (direction) => {
        const track = document.querySelector('.slider-track');
        const productCards = document.querySelectorAll('.product-card');

        if (!track || productCards.length === 0) return;

        const productCardWidth = productCards[0].offsetWidth;
        const totalProducts = productCards.length;
        const visibleProducts = 6; // Number of products

        currentIndex += direction;


        if (currentIndex > totalProducts - visibleProducts) {
            currentIndex = totalProducts - visibleProducts;
        }

        if (currentIndex < 0) {
            currentIndex = 0;
        }

        const newTranslateValue = -currentIndex * productCardWidth;
        track.style.transform = `translateX(${newTranslateValue}px)`;
    };



    const toggleFavouriteBtn = (id, element) => {
        let favouriteProduct = JSON.parse(localStorage.getItem(favouriteKey) || '[]').map(String);

        if (favouriteProduct.includes(String(id))) {
            favouriteProduct = favouriteProduct.filter(favId => favId !== String(id));       
        } else {
            favouriteProduct.push(String(id));
        }
        localStorage.setItem(favouriteKey, JSON.stringify(favouriteProduct));

        element.classList.toggle('favourited');
    };
        init();
   
        return 'Code run successfully.';
})();