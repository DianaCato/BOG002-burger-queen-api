CREATE DATABASE IF NOT EXISTS test;

USE test;

CREATE TABLE users (
    id INT(11) NOT NULL AUTO_INCREMENT,
    email VARCHAR(30) NOT NULL,
    password VARCHAR(60) NOT NULL,
    isAdmin TINYINT NULL DEFAULT 0,
    PRIMARY KEY (id)
);
CREATE TABLE products (
  id_product int(11) NOT NULL AUTO_INCREMENT,
  name varchar(45) NOT NULL,
  price int(11) NOT NULL,
  image varchar(45) NOT NULL,
  type varchar(45) NOT NULL,
  dateEntry date NOT NULL,
  PRIMARY KEY (id_product)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COMMENT='Table for register products'