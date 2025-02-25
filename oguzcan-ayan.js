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
        const favouriteItems = JSON.parse(localStorage.getItem(favouriteKey)) || [];
        const isFavourite = favouriteItems.includes(product.id) ? 'favourited' : '';
        return `
            <div class = "product-card" data-id = "${product.id}">
                <span class = "heart ${isFavourite}">&#9825;</span>
                <img class = "product-image" src = "${product.img}" alt = "${product.name}">
                <p>${product.name}</p>
                <p class = "product-price">${product.price}</p>
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
            }
            .slider-track{
                display: flex;
                transition: transform 0.2s ease-in-out;
            }
            .product-card{
                min-width: 300px;
                padding: 10px;
                cursor: pointer;
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
                cursor: pointer;
                color: gray;
            }
            .heart.favourited{
                color: blue;
            }
            .slider-prev-btn, .slider-next-btn{
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                z-index: 1;
            }
            
            @media (max-width: 768px) {
                .product-card{
                    min-width: 350px;
                    padding: 5px;
                }
                .product-image{
                width: 250px;
                height: 250px;
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
                slideSlider(1);
            } else if (e.target.classList.contains('slider-next-btn')) {
                slideSlider(-1);
            }
        });
        document.addEventListener('click', (e) => {
            if (e.target.closest('.product-card')) {
                const productId = e.target.closest('.product-card').dataset.id;
                window.open(`/product/${productId}`, '_blank');
            }
            if (e.target.classList.contains('heart')) {
                e.stopPropagation();
                toggleFavouriteBtn(e.target.closest('.product-card').dataset.id, e.target);
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
        const visibleProducts = 6; 

        currentIndex += direction;

        // Return to the beginning after the last item
        if (currentIndex >= totalProducts) {
            currentIndex = 0;
        }

        // When you come the last item, turn the first item
        if (currentIndex < 0) {
            currentIndex = totalProducts - 1;
        }

        const newTranslateValue = -currentIndex * productCardWidth;
        track.style.transform = `translateX(${newTranslateValue}px)`;
    };


    const toggleFavouriteBtn = (id, element) => {
        let favouriteProduct = getLocalStorage(favouriteKey).map(String);

        if (favouriteProduct.includes(String(id))) {
            favouriteProduct = favouriteProduct.filter(favId => favId !== String(id));
            element.classList.remove('favourited');
        } else {
            favouriteProduct.push(String(id));
            element.classList.add('favourited');
        }
        localStorage.setItem(favouriteKey, JSON.stringify(favouriteProduct));
    };


    document.addEventListener("DOMContentLoaded", () => {
        init();
    });

})();