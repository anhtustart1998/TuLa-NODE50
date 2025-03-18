
-------------------------Create Tables Section--------------------------------------------------

-- TABLE user
CREATE TABLE `user` (
	`user_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`full_name` VARCHAR(255) NOT NULL UNIQUE,
	`email` VARCHAR(255) NOT NULL UNIQUE,
	`password` VARCHAR(255),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)


-- TABLE food_type
CREATE TABLE `food_type` (
	`type_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`type_name` VARCHAR(255),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)

-- Table restaurant
CREATE TABLE `restaurant` (
	`res_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`res_name` VARCHAR(255),
	`image` VARCHAR(255),
	`desc` VARCHAR(255),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)

-- TABLE food
CREATE TABLE `food` (
	`food_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`type_id` INT NOT NULL,
	FOREIGN KEY (`type_id`) REFERENCES `food_type` (`type_id`),
	`food_name` VARCHAR(255),
	`image` VARCHAR(255),
	`price` FLOAT,
	`desc` VARCHAR(255),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)

-- TABLE sub_food
CREATE TABLE `sub_food` (
	`sub_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`food_id` INT NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `food` (`food_id`),
	`sub_name` VARCHAR(255),
	`sub_price` FLOAT,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)


-- TABLE order
CREATE TABLE `order` (
	`order_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	`food_id` INT NOT NULL,
	FOREIGN KEY (`food_id`) REFERENCES `food` (`food_id`),
	`amount` INT,
	`code` VARCHAR(255),
	`arr_sub_id` VARCHAR(255),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)


-- TABLE rate_res
CREATE TABLE `rate_res` (
	`rate_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	`res_id` INT NOT NULL,
	FOREIGN KEY (`res_id`) REFERENCES `restaurant` (`res_id`),
	`amount` INT,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0,
	`comment` TEXT DEFAULT NULL,
	UNIQUE (`user_id`, `res_id`)
)


--Table like_res
CREATE TABLE `like_res` (
	`like_id` INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
	`user_id` INT NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`),
	`res_id` INT NOT NULL,
	FOREIGN KEY (`res_id`) REFERENCES `restaurant` (`res_id`),
	UNIQUE (`user_id`, `res_id`),
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deleted_at` TIMESTAMP NULL DEFAULT NULL,
	`updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	`is_deleted` BOOLEAN NOT NULL DEFAULT FALSE,
	`deleted_by` INT NOT NULL DEFAULT 0
)

DELETE FROM `like_res` WHERE `user_id` = 1 AND `res_id` = 3;


--------------------------------------------Insert Sample Data For DB Section-------------------------------------------------------------------------

INSERT INTO `user` (`full_name`, `email`, `password`) VALUES 
('John Smith', 'john.smith@email.com', 'password_1'),
('Emily Johnson', 'emily.johnson@email.com', 'password_2'),
('Michael Williams', 'michael.williams@email.com', 'password_3'),
('Sarah Brown', 'sarah.brown@email.com', 'password_4'),
('David Jones', 'david.jones@email.com', 'password_5'),
('Jessica Miller', 'jessica.miller@email.com', 'password_6'),
('Daniel Davis', 'daniel.davis@email.com', 'password_7'),
('Sophia Wilson', 'sophia.wilson@email.com', 'password_8'),
('Oliver Taylor', 'oliver.taylor@email.com', 'password_9'),
('Emma Martinez', 'emma.martinez@email.com', 'password_10')


INSERT INTO `food_type` (`type_name`) VALUES 
('Italian'),
('Asian'),
('American');


INSERT INTO `restaurant` (`res_name`, `image`, `desc`) VALUES
('Bella Italia', 'bella_italia.jpg', 'Authentic Italian cuisine in a cozy atmosphere'),
('Sushi Delight', 'sushi_delight.jpg', 'Fresh and creative Japanese dishes'),
('Burger Shack', 'burger_shack.jpg', 'Gourmet burgers and classic American comfort food'),
('Pasta Paradise', 'pasta_paradise.jpg', 'Homemade pasta and traditional Italian recipes'),
('Asian Fusion', 'asian_fusion.jpg', 'Creative blend of various Asian cuisines');


INSERT INTO `food` (`type_id`, `food_name`, `image`, `price`, `desc`) VALUES
(1, 'Margherita Pizza', 'margherita_pizza.jpg', 12.99, 'Classic pizza with tomato sauce, mozzarella, and basil'),
(1, 'Fettuccine Alfredo', 'fettuccine_alfredo.jpg', 14.50, 'Creamy pasta with parmesan cheese sauce'),
(1, 'Lasagna', 'lasagna.jpg', 16.75, 'Layered pasta with meat sauce and cheese'),
(2, 'California Roll', 'california_roll.jpg', 9.99, 'Sushi roll with crab, avocado, and cucumber'),
(2, 'Pad Thai', 'pad_thai.jpg', 13.25, 'Stir-fried rice noodles with egg, tofu, and peanuts'),
(2, 'Beef Teriyaki', 'beef_teriyaki.jpg', 15.50, 'Grilled beef with sweet teriyaki sauce'),
(2, 'Vegetable Fried Rice', 'fried_rice.jpg', 10.99, 'Rice stir-fried with mixed vegetables'),
(3, 'Classic Cheeseburger', 'cheeseburger.jpg', 11.50, 'Beef patty with cheese, lettuce, tomato, and special sauce'),
(3, 'Buffalo Wings', 'buffalo_wings.jpg', 12.75, 'Spicy chicken wings with blue cheese dip'),
(3, 'Mac and Cheese', 'mac_cheese.jpg', 9.50, 'Creamy macaroni and cheese comfort dish');


INSERT INTO `sub_food` (`food_id`, `sub_name`, `sub_price`) VALUES 
(1, 'Extra Cheese', 1.50),
(1, 'Mushrooms', 1.00),
(2, 'Grilled Chicken', 3.50),
(4, 'Avocado', 2.00),
(5, 'Shrimp', 4.00),
(8, 'Bacon', 2.50),
(8, 'Avocado', 1.75),
(9, 'Extra Sauce', 0.75);


INSERT INTO `order` (`user_id`, `food_id`, `amount`, `code`, `arr_sub_id`) VALUES 
(1, 3, 1, 'ORDER001', '[]'),
(2, 5, 2, 'ORDER002', '[5]'),
(3, 8, 1, 'ORDER003', '[6,7]'),
(4, 1, 1, 'ORDER004', '[1,2]'),
(5, 9, 2, 'ORDER005', '[8]'),
(6, 4, 3, 'ORDER006', '[4]'),
(7, 2, 1, 'ORDER007', '[3]'),
(8, 7, 2, 'ORDER008', '[]'),
(1, 1, 2, 'ORDER009', '[1]'),
(1, 4, 1, 'ORDER010', '[4]'),
(3, 5, 1, 'ORDER011', '[5]'),
(3, 2, 2, 'ORDER012', '[3]'),       
(3, 9, 4, 'ORDER013', '[8]'),
(5, 3, 1, 'ORDER014', '[]'),
(5, 7, 2, 'ORDER015', '[]'),
(5, 10, 3, 'ORDER016', '[]');  


INSERT INTO `rate_res` (`user_id`, `res_id`, `amount`) VALUES
(1, 4, 5),  
(2, 2, 4),  
(3, 3, 5),
(4, 1, 4), 
(5, 5, 3), 
(6, 2, 5),
(7, 3, 4),  
(8, 1, 4);  


INSERT INTO `like_res` (`user_id`, `res_id`) VALUES
(1, 4), 
(1, 1),  
(2, 2), 
(3, 3),  
(4, 1),
(5, 5),
(6, 2),  
(6, 5),  
(7, 3), 
(7, 1), 
(8, 1), 
(8, 4); 


------------------------------HOMEWORD SOLUTIONS---------------------------------------------------
-- Homework #1: Find top 5 users who likes the restaurants the most:
SELECT
  u.user_id,
  u.full_name,
  u.email,
  COUNT(lr.res_id) AS total_likes
FROM
  `user` u
  INNER JOIN `like_res` lr ON u.user_id = lr.user_id
WHERE
  lr.is_deleted = FALSE
GROUP BY
  u.user_id,
  u.full_name,
  u.email
ORDER BY
  total_likes DESC
LIMIT 5


-- Homework #2: Find top 2 restaurants which have the most likes
SELECT
  r.res_id,
  r.res_name,
  COUNT(lr.res_id) AS total_likes
FROM
  `restaurant` r
  INNER JOIN `like_res` lr ON r.res_id = lr.res_id
WHERE
  lr.is_deleted = FALSE
GROUP BY
  r.res_id,
  r.res_name
ORDER BY
  total_likes DESC
LIMIT 2


-- Homework #3: Find the user who places the highest number of orders
-- This to handle if there are users who place the same number of orders
WITH
  max_orders AS (
    SELECT
      COUNT(order_id) AS max_order_count
    FROM
      `order`
    GROUP BY
      user_id
    ORDER BY
      max_order_count DESC
    LIMIT
      1
  )
  
SELECT
  u.user_id,
  u.full_name,
  u.email,
  COUNT(o.user_id) AS total_orders
FROM
  `user` u
  INNER JOIN `order` o ON o.user_id = u.user_id
GROUP BY
  u.user_id,
  u.full_name,
  u.email
HAVING
  COUNT(o.order_id) = (
    SELECT
      max_order_count
    FROM
      max_orders
  )
ORDER BY
  u.full_name
  

-- Homework 4: Find the users who are not active in the system
SELECT
  u.user_id,
  u.full_name,
  u.email
FROM
  `user` u
WHERE
  NOT EXISTS (
    SELECT
      1
    FROM
      `order` o
    WHERE
      o.user_id = u.user_id
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      `like_res` lr
    WHERE
      lr.user_id = u.user_id
  )
  AND NOT EXISTS (
    SELECT
      1
    FROM
      `rate_res` rr
    WHERE
      rr.user_id = u.user_id
  )
ORDER BY
  u.full_name

















































