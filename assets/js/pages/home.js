const homeCategoriesContainer = document.getElementById("home-categories-container");
const homeProductsContainer = document.getElementById("home-products-container");

function renderNoResponseCode() {
    return `<p>No categories available</p>`;
}

async function fetchCategories() {
    try {

        // Set loader to the screen
        const url = `api/v1/categories`;
        const filters = filterCriterias([]);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 50,
                currentPage: 1,
                filters: filters
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        setCategoriesToCache(categoriesKey, data.categories || []);  // Cache the fetched categories
        setRefreshCount(categoriesRefreshKey, 0);
        renderCategories(data.categories || []);

    } catch (error) {
        toasterNotification({ type: 'error', message: 'Request failed: ' + error.message });
        homeCategoriesContainer.innerHTML = renderNoResponseCode();
        console.error(error);
    }
}
async function fetchProducts() {
    try {

        // Set loader to the screen
        const url = `api/v1/products`;
        const filters = filterCriterias([]);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                limit: 50,
                currentPage: 1,
                filters: filters
            })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        setCategoriesToCache(productKey, data.products || []);  // Cache the fetched categories
        setRefreshCount(productsRefreshKey, 0);
        renderProducts(data.products || []);

    } catch (error) {
        toasterNotification({ type: 'error', message: 'Request failed: ' + error.message });
        homeProductsContainer.innerHTML = renderNoResponseCode();
        console.error(error);
    }
}

function renderCategories(categories) {
    if (categories && categories?.length > 0) {
        let content = '';
        categories.forEach(category => {
            content += `
            <div class="col-sm-6 col-lg-3 mb-3 mb-md-0 h-100 pb-4">
						<div class="card card-span h-100">
							<div class="position-relative"> <img class="img-fluid rounded-3 w-100" src="assets/img/gallery/discount-item-1.png" alt="..." />
							</div>
							<div class="card-body px-0">
								<h5 class="fw-bold text-1000 text-truncate">${category?.name}</h5>
							</div><a class="stretched-link" href="categories/${category?.slug}"></a>
						</div>
					</div>
            `;
        });
        homeCategoriesContainer.innerHTML = content;
    } else {
        homeCategoriesContainer.innerHTML = renderNoResponseCode();
    }

}

function renderProducts(products) {
    if (products && products?.length > 0) {
        let content = '';
        products.forEach(product => {
            content += `
            <div class="col-sm-6 col-md-3 col-xl-3 mb-5 h-100">
						<div class="card card-span h-100 rounded-3"><img class="img-fluid rounded-3 h-100" src="assets/img/gallery/cheese-burger.png" alt="...">
							<div class="card-body ps-0">
								<h5 class="fw-bold text-1000 text-truncate mb-1">${product?.name}r</h5>
								<div>
                                    <span class="text-primary"><small>${product?.short_description}</small></span>
                                </div>
							</div>
						</div>
						<div class="d-grid gap-2"><a class="btn btn-lg btn-danger" href="#!" role="button">Add To Cart</a></div>
					</div>
            `;
        });
        homeProductsContainer.innerHTML = content;
    } else {
        homeProductsContainer.innerHTML = renderNoResponseCode();
    }

}

// Global Variables
const categoriesRefreshKey = 'homePageCategoriesRefreshCount';
const productsRefreshKey = 'homePageProductsRefreshCount';
const categoriesKey = 'categoriesData';
const productKey = 'productData';
const categoryRefreshLimit = 5;
const productRefreshLimit = 3;

// Function to get the current refresh count from LocalStorage
function getRefreshCount(refreshKey) {
    return parseInt(localStorage.getItem(refreshKey)) || 0;
}

// Function to set the refresh count in LocalStorage
function setRefreshCount(refreshKey, count) {
    localStorage.setItem(refreshKey, count.toString());
}

// Function to get categories from cache (LocalStorage)
function getDataFromCache(categoriesKey) {
    const cachedCategories = localStorage.getItem(categoriesKey);
    return cachedCategories ? JSON.parse(cachedCategories) : null;
}

// Function to set categories to cache (LocalStorage)
function setCategoriesToCache(key, categories) {
    localStorage.setItem(key, JSON.stringify(categories));
}



// Function to load categories based on refresh count and cache status
function loadCategories() {
    let refreshCount = getRefreshCount(categoriesRefreshKey);
    const cachedCategories = getDataFromCache(categoriesKey);

    if (cachedCategories && refreshCount < categoryRefreshLimit) {
        // Use cached categories if available and refresh count is within limit
        renderCategories(cachedCategories);
    } else {
        fetchCategories();
    }

    // Increment and update the refresh count
    refreshCount++;
    setRefreshCount(categoriesRefreshKey, refreshCount);
}

// Function to load categories based on refresh count and cache status
function loadProducts() {
    let refreshCount = getRefreshCount(productsRefreshKey);
    const cachedProducts = getDataFromCache(productKey);

    if (cachedProducts && refreshCount < productRefreshLimit) {
        // Use cached categories if available and refresh count is within limit
        renderProducts(cachedProducts);
    } else {
        fetchProducts();
    }

    // Increment and update the refresh count
    refreshCount++;
    setRefreshCount(productsRefreshKey, refreshCount);
}

// DoM document loaded
document.addEventListener('DOMContentLoaded', function () {
    loadCategories();
    loadProducts();
});
