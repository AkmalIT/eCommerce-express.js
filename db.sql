-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 05, 2023 at 11:26 AM
-- Server version: 5.7.24
-- PHP Version: 8.0.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: ecomm
--

-- --------------------------------------------------------

--
-- Table structure for table address
--

CREATE TABLE address (
  ID SERIAL PRIMARY KEY NOT NULL,
  userID integer DEFAULT NULL,
  region varchar(255) DEFAULT NULL,
  referencePoint varchar(255) DEFAULT NULL,
  street varchar(255) DEFAULT NULL,
  house varchar(255) DEFAULT NULL,
  room varchar(255) DEFAULT NULL,
  FOREIGN KEY (userID) REFERENCES userr(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table attribute
--

CREATE TABLE attribute (
  ID SERIAL PRIMARY KEY NOT NULL,
  name varchar(255) DEFAULT NULL
);

-- --------------------------------------------------------

--
-- Table structure for table attributevalue
--

CREATE TABLE attributevalue (
  ID SERIAL PRIMARY KEY NOT NULL,
  attributeID integer DEFAULT NULL,
  name varchar(255) DEFAULT NULL,
  FOREIGN KEY (attributeID) REFERENCES attribute(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table basket
--

CREATE TABLE basket (
  ID SERIAL PRIMARY KEY NOT NULL,
  productID integer DEFAULT NULL,
  userID integer DEFAULT NULL,
  count integer DEFAULT NULL,
  FOREIGN KEY (productID) REFERENCES product(ID),
  FOREIGN KEY (userID) REFERENCES userr(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table category
--

CREATE TABLE category (
  ID SERIAL PRIMARY KEY NOT NULL,
  nameUz varchar(255) DEFAULT NULL,
  nameRu varchar(255) DEFAULT NULL,
  parentCategoryID integer DEFAULT NULL,
  vievCount integer DEFAULT NULL,
  image varchar(255) DEFAULT NULL,
  desUz varchar(255) DEFAULT NULL,
  desRu varchar(255) DEFAULT NULL,
  FOREIGN KEY (parentCategoryID) REFERENCES category(ID)
);

--
-- Dumping data for table category
--

INSERT INTO category (ID, nameUz, nameRu, parentCategoryID, vievCount, image, desUz, desRu) VALUES
(20, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU' ),
(21, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(22, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(23, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(24, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(25, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(26, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(27, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(28, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(29, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(30, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(31, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(32, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(33, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(34, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(35, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(36, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(37, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(38, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(39, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(40, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(41, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(42, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(43, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(44, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(45, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(46, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(47, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(48, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(49, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(50, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(51, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(52, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(53, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(54, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(55, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(56, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(57, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(58, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(59, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(60, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(61, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(62, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(63, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(64, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(65, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(66, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(67, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(68, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(69, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(70, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(71, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(72, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(73, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(74, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(75, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(76, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(77, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(78, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(79, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(80, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(81, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(82, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(83, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(84, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(85, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(86, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(87, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(88, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(89, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(90, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(91, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(92, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(93, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(94, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(95, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(96, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(97, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(98, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(99, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(100, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(101, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(102, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(103, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(104, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(105, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(106, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(107, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(108, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(109, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(110, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(111, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(112, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(113, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(114, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(115, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(116, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(117, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU'),
(118, 'smert lenina', 'smert stalina', 23, 14, 'video.jpeg', 'videoUZ', 'videoRU');

-- --------------------------------------------------------

--
-- Table structure for table category_attribute
--

CREATE TABLE category_attribute (
  category_ID integer  NOT NULL,
  attribute_ID integer  NOT NULL,
  FOREIGN KEY (category_ID) REFERENCES category(ID),
  FOREIGN KEY (attribute_ID) REFERENCES attribute(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table category_product
--

CREATE TABLE category_product (
  category_ID integer NOT NULL,
  product_ID integer NOT NULL,
  FOREIGN KEY (category_ID) REFERENCES category(ID),
  FOREIGN KEY (product_ID) REFERENCES product(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table favorite
--

CREATE TABLE favorite (
  ID SERIAL PRIMARY KEY NOT NULL,
  userID integer DEFAULT NULL,
  productID integer DEFAULT NULL,
  FOREIGN KEY (productID) REFERENCES product(ID),
  FOREIGN KEY (userID) REFERENCES userr(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table order
--

CREATE TABLE orderr (
  ID SERIAL PRIMARY KEY NOT NULL,
  productID integer DEFAULT NULL,
  userID integer DEFAULT NULL,
  addressID integer DEFAULT NULL,
  deliveryTime varchar(255) DEFAULT '1day',
  orderStatus varchar(255) DEFAULT 'pending',
  deliveryPrice integer DEFAULT '15000',
  orderCount varchar(255) DEFAULT NULL,
  FOREIGN KEY (productID) REFERENCES product(ID),
  FOREIGN KEY (userID) REFERENCES userr(ID),
  FOREIGN KEY (addressID) REFERENCES address(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table product
--

CREATE TABLE product (
  ID SERIAL PRIMARY KEY NOT NULL,
  nameUz varchar(255) DEFAULT NULL,
  nameRu varchar(255) DEFAULT NULL,
  images text,
  categoryID integer  DEFAULT NULL,
  descShortUz varchar(255) DEFAULT NULL,
  descShortRu varchar(255) DEFAULT NULL,
  descRu text,
  descUz text,
  isPopular integer DEFAULT '0',
  vievCount integer  DEFAULT '0',
  price integer  DEFAULT '0',
  cartCount integer  DEFAULT '0',
  favoriteCount integer  DEFAULT '0',
  orderCount integer  DEFAULT '0',
  discount integer  DEFAULT NULL,
  FOREIGN KEY (categoryID) REFERENCES category(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table product_attribute
--

CREATE TABLE product_attribute (
  product_ID integer NOT NULL,
  attribute_ID integer NOT NULL,
  FOREIGN KEY (product_ID) REFERENCES product(ID),
  FOREIGN KEY (attribute_ID) REFERENCES attribute(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table review
--

CREATE TABLE review (
  ID SERIAL PRIMARY KEY NOT NULL,
  userID integer DEFAULT NULL,
  productID integer DEFAULT NULL,
  stars integer DEFAULT NULL,
  comment text,
  FOREIGN KEY (productID) REFERENCES product(ID),
  FOREIGN KEY (userID) REFERENCES userr(ID)
);

-- --------------------------------------------------------

--
-- Table structure for table user
--

CREATE TABLE userr (
  ID SERIAL PRIMARY KEY NOT NULL,
  name varchar(255) DEFAULT NULL,
  phone varchar(255)  UNIQUE DEFAULT NULL,
  otp varchar(255) DEFAULT NULL,
  image varchar(255) DEFAULT NULL,
  hashedPassword varchar(255) DEFAULT NULL,
  hashedRefreshtoken varchar(255) DEFAULT NULL
);


