-- phpMyAdmin SQL Dump
-- version 4.7.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation date: 29 June 2018, 10:55
-- Server version: 10.1.30-MariaDB
-- PHP version: 7.2.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mywallet`
--
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_polish_ci NOT NULL,
  `email` varchar(50) COLLATE utf8_polish_ci NOT NULL,
  `is_active` BOOLEAN NOT NULL DEFAULT FALSE, 
  `activation_hash` varchar(64) NULL DEFAULT NULL,
  `password_reset_hash` varchar(64) COLLATE utf8_polish_ci NULL,
  `password_reset_expires_at` datetime NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;


CREATE TABLE IF NOT EXISTS `remembered_logins` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `token_hash` varchar(100) COLLATE utf8_polish_ci NOT NULL,
  `expires_at` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `remembered_logins`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS `expenses_category_assigned_to_users` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `expenses_category_assigned_to_users`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS `expenses_category_default` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
INSERT INTO `expenses_category_default` (`id`, `name`) VALUES
(1, 'Transport'),
(2, 'Books'),
(3, 'Food'),
(4, 'Apartments'),
(5, 'Telecommunication'),
(6, 'Health'),
(7, 'Clothes'),
(8, 'Hygiene'),
(9, 'Kids'),
(10, 'Recreation'),
(11, 'Trip'),
(12, 'Savings'),
(13, 'For Retirement'),
(14, 'Debt Repayment'),
(15, 'Gift'),
(16, 'Another');
ALTER TABLE `expenses_category_default`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;


CREATE TABLE IF NOT EXISTS `payment_methods_assigned_to_users` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `payment_methods_assigned_to_users`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS `payment_methods_default` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY ,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
INSERT INTO `payment_methods_default` (`id`, `name`) VALUES
(1, 'Cash'),
(2, 'Debit Card'),
(3, 'Credit Card');
ALTER TABLE `payment_methods_default`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;


CREATE TABLE IF NOT EXISTS `expenses` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `expense_category_assigned_to_user_id` int(11) UNSIGNED NOT NULL,
  `payment_method_assigned_to_user_id` int(11) UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `date_of_expense` date NOT NULL,
  `expense_comment` varchar(100) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `expenses`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  ADD FOREIGN KEY (`expense_category_assigned_to_user_id`) REFERENCES `expenses_category_assigned_to_users`(`id`) ON DELETE CASCADE,
  ADD FOREIGN KEY (`payment_method_assigned_to_user_id`) REFERENCES `payment_methods_assigned_to_users`(`id`) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS `incomes_category_assigned_to_users` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `incomes_category_assigned_to_users`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE;


CREATE TABLE IF NOT EXISTS `incomes_category_default` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY,
  `name` varchar(50) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
INSERT INTO `incomes_category_default` (`id`, `name`) VALUES
(1, 'Salary'),
(2, 'Interest'),
(3, 'Allegro'),
(4, 'Another');
ALTER TABLE `incomes_category_default`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;


CREATE TABLE IF NOT EXISTS `incomes` (
  `id` int(11) UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
  `user_id` int(11) UNSIGNED NOT NULL,
  `income_category_assigned_to_user_id` int(11) UNSIGNED NOT NULL,
  `amount` decimal(8,2) NOT NULL DEFAULT '0.00',
  `date_of_income` date NOT NULL,
  `income_comment` varchar(100) COLLATE utf8_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;
ALTER TABLE `incomes`
  ADD FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  ADD FOREIGN KEY (`income_category_assigned_to_user_id`) REFERENCES `incomes_category_assigned_to_users`(`id`) ON DELETE CASCADE;


COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
