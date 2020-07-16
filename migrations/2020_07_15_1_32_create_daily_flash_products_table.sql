CREATE TABLE daily_products (
   id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
   product_id INT UNSIGNED NOT NULL,
   added_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   price SMALLINT NOT NULL,
   discount_price SMALLINT NOT NULL,
   CONSTRAINT fk_products FOREIGN KEY (product_id)
   REFERENCES products(id) ON DELETE CASCADE
);