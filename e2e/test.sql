CREATE DATABASE IF NOT EXISTS test;

USE test;

CREATE TABLE users (
    _id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(60) NOT NULL,
    isAdmin TINYINT NULL DEFAULT 0,
    PRIMARY KEY (_id)
);

CREATE TABLE products (
  _id int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  price double NOT NULL,
  imagen longtext,
  type varchar(45) DEFAULT NULL,
  dateEntry date NOT NULL,
  PRIMARY KEY (_id)
);

CREATE TABLE orders (
  _id INT NOT NULL AUTO_INCREMENT,
  userId INT NOT NULL,
  client VARCHAR(45) DEFAULT NULL,
  status VARCHAR(45) NOT NULL,
  dateEntry DATE NOT NULL,
  dateProcessed DATE DEFAULT NULL,
  PRIMARY KEY (_id),
  INDEX userId_idx (userId ASC),
  CONSTRAINT userId
    FOREIGN KEY (userId)
    REFERENCES test.users (_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE);

CREATE TABLE `products_in_order` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_order` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `id_order` (`id_order`),
  KEY `id_product` (`id_product`),
  CONSTRAINT `id_order` FOREIGN KEY (`id_order`) REFERENCES `orders` (`_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `id_product` FOREIGN KEY (`id_product`) REFERENCES `products` (`_id`) ON DELETE CASCADE ON UPDATE CASCADE
);

