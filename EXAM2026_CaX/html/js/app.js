const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const resetBtn = document.getElementById("resetBtn");
const totalProduct = document.getElementById("totalProduct");

const productNameInput = document.getElementById("productName");
const productCategoryInput = document.getElementById("productCategory");
const productPriceInput = document.getElementById("productPrice");
const productStatusInput = document.getElementById("productStatus");

const nameError = document.getElementById("nameError");
const categoryError = document.getElementById("categoryError");
const priceError = document.getElementById("priceError");

const STORAGE_KEY = "exam2026_products";

function loadProductsFromStorage() {
    const savedProducts = localStorage.getItem(STORAGE_KEY);

    if (savedProducts === null) {
        saveProductsToStorage();
        return;
    }

    const productList = JSON.parse(savedProducts);
    products.splice(0, products.length, ...productList);
}

function saveProductsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

function formatMoney(value) {
    return Number(value).toLocaleString("vi-VN") + " đ";
}

function createStatusBadge(status) {
    if (status === "Còn hàng") {
        return '<span class="badge badge-success">Còn hàng</span>';
    }

    return '<span class="badge badge-danger">Hết hàng</span>';
}

function renderProductTable() {
    productTableBody.innerHTML = "";

    if (products.length === 0) {
        productTableBody.innerHTML = `
            <tr>
                <td colspan="5" class="empty-row">Chưa có sản phẩm nào trong danh sách.</td>
            </tr>
        `;
        totalProduct.textContent = 0;
        return;
    }

    products.forEach(function(product, index) {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${formatMoney(product.price)}</td>
            <td>${createStatusBadge(product.status)}</td>
        `;

        productTableBody.appendChild(row);
    });

    totalProduct.textContent = products.length;
}

function validateForm() {
    let isValid = true;

    nameError.textContent = "";
    categoryError.textContent = "";
    priceError.textContent = "";

    const productName = productNameInput.value.trim();
    const productCategory = productCategoryInput.value;
    const productPrice = Number(productPriceInput.value);

    if (productName === "") {
        nameError.textContent = "Vui lòng nhập tên sản phẩm.";
        isValid = false;
    }

    if (productCategory === "") {
        categoryError.textContent = "Vui lòng chọn danh mục.";
        isValid = false;
    }

    if (productPriceInput.value === "" || productPrice <= 0) {
        priceError.textContent = "Giá sản phẩm phải lớn hơn 0.";
        isValid = false;
    }

    return isValid;
}

function createNewProductId() {
    if (products.length === 0) {
        return 1;
    }

    const maxId = Math.max(...products.map(function(product) {
        return product.id;
    }));

    return maxId + 1;
}

function addProduct() {
    const newProduct = {
        id: createNewProductId(),
        name: productNameInput.value.trim(),
        category: productCategoryInput.value,
        price: Number(productPriceInput.value),
        status: productStatusInput.value
    };

    products.push(newProduct);
    saveProductsToStorage();
    renderProductTable();
    clearForm();
}

function clearForm() {
    productForm.reset();
    nameError.textContent = "";
    categoryError.textContent = "";
    priceError.textContent = "";
}

productForm.addEventListener("submit", function(event) {
    event.preventDefault();

    if (validateForm()) {
        addProduct();
    }
});

resetBtn.addEventListener("click", function() {
    clearForm();
});

loadProductsFromStorage();
renderProductTable();
