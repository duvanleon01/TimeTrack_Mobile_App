-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 29-06-2025 a las 23:57:29
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `db_node_react`
--
CREATE DATABASE IF NOT EXISTS `db_node_react` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `db_node_react`;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `attendance_records`
--

DROP TABLE IF EXISTS `attendance_records`;
CREATE TABLE `attendance_records` (
  `id` bigint(20) NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `event_type` varchar(20) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp(),
  `duration_minutes` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `attendance_records`
--

INSERT INTO `attendance_records` (`id`, `user_id`, `event_type`, `timestamp`, `duration_minutes`, `created_at`, `updated_at`) VALUES
(19, 6, 'CLOCK_IN', '2025-06-28 23:38:04', 0, '2025-06-28 23:38:04', '2025-06-28 23:38:08'),
(20, 6, 'CLOCK_OUT', '2025-06-28 23:38:08', NULL, '2025-06-28 23:38:08', '2025-06-28 23:38:08'),
(21, 7, 'CLOCK_IN', '2025-06-29 18:42:25', 0, '2025-06-29 18:42:25', '2025-06-29 18:42:29'),
(22, 7, 'CLOCK_OUT', '2025-06-29 18:42:29', NULL, '2025-06-29 18:42:29', '2025-06-29 18:42:29'),
(23, 6, 'CLOCK_IN', '2025-06-29 21:14:10', 1, '2025-06-29 21:14:10', '2025-06-29 21:15:38'),
(24, 6, 'CLOCK_OUT', '2025-06-29 21:15:38', NULL, '2025-06-29 21:15:38', '2025-06-29 21:15:38');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL,
  `email` varchar(180) NOT NULL,
  `name` varchar(90) NOT NULL,
  `lastname` varchar(90) NOT NULL,
  `phone` varchar(90) NOT NULL,
  `rol` varchar(50) NOT NULL DEFAULT 'usuario',
  `image` varchar(255) DEFAULT NULL,
  `password` varchar(90) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id`, `email`, `name`, `lastname`, `phone`, `rol`, `image`, `password`, `created_at`, `updated_at`) VALUES
(6, 'duvanleon@gmail.com', 'Duvan', 'León', '300123456', 'administrador', NULL, '$2b$10$LNwCaQA0xGlx96ft1jAloe7MWosHNNXmLFbGrdZZ/YpPtWzusvqQ6', '2025-06-28 23:37:25', '2025-06-28 23:37:44'),
(7, 'prueba1@gmail.com', 'Prueba', '1', '3001234500', 'usuario', NULL, '$2b$10$KAd4gsdHuGe0BPbDLNgpM.KWPE1ND20uK./GFpaKD/3wYVwS09xya', '2025-06-28 23:38:49', '2025-06-29 19:54:39'),
(8, 'admin@gmail.com', 'Usuario', 'Administrador', '000000', 'administrador', NULL, '$2b$10$axF8B8H0pcJh65XgEwQAruhLgTHgw/MJxuYnPtf5GnLymb/lPpTVq', '2025-06-29 21:13:12', '2025-06-29 21:13:53');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `phone` (`phone`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `attendance_records`
--
ALTER TABLE `attendance_records`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `attendance_records`
--
ALTER TABLE `attendance_records`
  ADD CONSTRAINT `attendance_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
