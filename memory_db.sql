-- phpMyAdmin SQL Dump
-- version 4.7.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 20, 2017 at 10:34 PM
-- Server version: 10.1.25-MariaDB
-- PHP Version: 7.1.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `memory_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `player_score`
--

CREATE TABLE `player_score` (
  `PLA_SCO_ID` int(11) NOT NULL COMMENT 'Generated primary key',
  `PLAYER_NAME` varchar(64) COLLATE cp1250_croatian_ci NOT NULL COMMENT 'Name of the player',
  `PLAYER_SCORE` int(11) NOT NULL COMMENT 'Score of the player',
  `PLAYER_TIME` time NOT NULL COMMENT 'Time of the player',
  `CREATED_AT` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Timestamp of record creation'
) ENGINE=InnoDB DEFAULT CHARSET=cp1250 COLLATE=cp1250_croatian_ci COMMENT='Table contains User''s scores.';

--
-- Indexes for dumped tables
--

--
-- Indexes for table `player_score`
--
ALTER TABLE `player_score`
  ADD PRIMARY KEY (`PLA_SCO_ID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `player_score`
--
ALTER TABLE `player_score`
  MODIFY `PLA_SCO_ID` int(11) NOT NULL AUTO_INCREMENT COMMENT 'Generated primary key';COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
