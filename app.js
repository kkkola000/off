const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Подключение базы данных
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');
});

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Получение всех продуктов
app.get('/api/products', (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Обновление продукта
app.put('/api/products/:id', (req, res) => {
    const { id } = req.params;
    const { name, rostov_stock, moscow_stock } = req.body;

    db.run(
        `UPDATE products 
         SET name = ?, rostov_stock = ?, moscow_stock = ? 
         WHERE id = ?`,
        [name, rostov_stock, moscow_stock, id],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ message: 'Product updated', changes: this.changes });
        }
    );
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
