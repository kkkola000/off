const apiUrl = '/api/products';

// Загрузка данных
async function loadProducts() {
    try {
        const response = await fetch(apiUrl);
        const products = await response.json();
        renderProducts(products);
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
    }
}

// Отображение данных
function renderProducts(products) {
    const tableBody = document.querySelector('#productTable tbody');
    tableBody.innerHTML = '';

    products.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td contenteditable="true" data-id="${product.id}" data-field="name">${product.name}</td>
            <td contenteditable="true" data-id="${product.id}" data-field="rostov_stock">${product.rostov_stock}</td>
            <td contenteditable="true" data-id="${product.id}" data-field="moscow_stock">${product.moscow_stock}</td>
            <td>
                <button onclick="saveProduct(${product.id})">Сохранить</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Сохранение товара
async function saveProduct(id) {
    const row = document.querySelector(`[data-id="${id}"]`).parentElement;
    const name = row.querySelector('[data-field="name"]').textContent.trim();
    const rostov_stock = parseInt(row.querySelector('[data-field="rostov_stock"]').textContent.trim(), 10);
    const moscow_stock = parseInt(row.querySelector('[data-field="moscow_stock"]').textContent.trim(), 10);

    if (!name || isNaN(rostov_stock) || isNaN(moscow_stock)) {
        alert('Заполните все поля корректно!');
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rostov_stock, moscow_stock }),
        });
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        alert('Изменения сохранены!');
        loadProducts(); // Обновляем таблицу
    } catch (error) {
        console.error('Ошибка сохранения:', error);
    }
}

// Добавление нового товара
document.querySelector('#addProductForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.querySelector('#newName').value.trim();
    const rostov_stock = parseInt(document.querySelector('#newRostovStock').value, 10);
    const moscow_stock = parseInt(document.querySelector('#newMoscowStock').value, 10);

    if (!name || isNaN(rostov_stock) || isNaN(moscow_stock)) {
        alert('Заполните все поля корректно!');
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, rostov_stock, moscow_stock }),
        });
        const result = await response.json();
        if (result.error) {
            throw new Error(result.error);
        }
        alert('Товар добавлен!');
        loadProducts(); // Обновляем таблицу
        document.querySelector('#addProductForm').reset(); // Сбрасываем форму
    } catch (error) {
        console.error('Ошибка добавления товара:', error);
    }
});

// Инициализация
loadProducts();
