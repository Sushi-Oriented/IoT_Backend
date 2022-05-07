-- phpMyAdmin SQL Dump
-- version 4.9.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 20, 2021 at 02:14 AM
-- Server version: 10.4.6-MariaDB
-- PHP Version: 7.3.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gpscollar`
--

-- --------------------------------------------------------

--
-- Table structure for table `accesstoken`
--

CREATE TABLE `accesstoken` (
  `id` varchar(255) NOT NULL,
  `ttl` int(11) DEFAULT NULL,
  `scopes` text DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `userId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `acl`
--

CREATE TABLE `acl` (
  `id` int(11) NOT NULL,
  `model` varchar(512) DEFAULT NULL,
  `property` varchar(512) DEFAULT NULL,
  `accessType` varchar(512) DEFAULT NULL,
  `permission` varchar(512) DEFAULT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `appuser`
--

CREATE TABLE `appuser` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `contact` varchar(512) DEFAULT NULL,
  `company` varchar(512) DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `createdBy` int(11) NOT NULL,
  `modifiedDate` datetime DEFAULT NULL,
  `modifiedBy` int(11) DEFAULT NULL,
  `lastLogin` datetime DEFAULT NULL,
  `realm` varchar(512) DEFAULT NULL,
  `username` varchar(512) DEFAULT NULL,
  `password` varchar(512) NOT NULL,
  `email` varchar(512) NOT NULL,
  `emailVerified` tinyint(1) DEFAULT NULL,
  `verificationToken` varchar(512) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `appuser`
--

INSERT INTO `appuser` (`id`, `name`, `contact`, `company`, `createdDate`, `createdBy`, `modifiedDate`, `modifiedBy`, `lastLogin`, `realm`, `username`, `password`, `email`, `emailVerified`, `verificationToken`) VALUES
(1, 'System Development', '123456789', NULL, '2021-09-20 00:12:43', 1, NULL, NULL, NULL, NULL, 'system-dev', '$2a$10$EYkgE/e8erNG3Cc44MWh7O7aUw8tC2EMryVziMbiRJtz8ObEBWUdy', 'system-dev@iot.com', NULL, NULL),
(2, 'Admin Development', '123456789', NULL, '2021-09-20 00:12:44', 1, NULL, NULL, NULL, NULL, 'admin-dev', '$2a$10$BauJTbOqnv/DFsTwhdk6q.B88tTXHATbcm6eKerI0E2SJa3I1TR3W', 'admin-dev@iot.com', NULL, NULL),
(3, 'Admin System', '123456789', NULL, '2021-09-20 00:12:44', 1, NULL, NULL, NULL, NULL, 'admin', '$2a$10$cbWpMJGaxi1RFsHK69wlHuQWy2FfLUjdTJTM/VflBc/MZ3T3LRRSK', 'admin-system@iot.com', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `collardevice`
--

CREATE TABLE `collardevice` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `device_id` varchar(512) NOT NULL,
  `api_key` varchar(512) NOT NULL,
  `createdDate` datetime DEFAULT NULL,
  `modifiedDate` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `collardevice`
--

INSERT INTO `collardevice` (`id`, `name`, `device_id`, `api_key`, `createdDate`, `modifiedDate`) VALUES
(1, 'Device01', 'GCI574210', 'DveHRK9MXOPjP7BMtBh7VtLNjqcyz3e6hoxgFMWBhv2PZECBOcWkv1ueOHkbToag', '2021-09-20 00:12:44', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `devicedata`
--

CREATE TABLE `devicedata` (
  `id` int(11) NOT NULL,
  `id_tx` int(11) DEFAULT NULL,
  `volatge_input_tx` double DEFAULT NULL,
  `power_solar_tx` double DEFAULT NULL,
  `power_piezo_tx` double DEFAULT NULL,
  `gps_date_tx` date DEFAULT NULL,
  `gps_time_tx` time DEFAULT NULL,
  `gps_latitude_tx` double DEFAULT NULL,
  `gps_longitude_tx` double DEFAULT NULL,
  `gps_altitude_tx` double DEFAULT NULL,
  `gps_speed_tx` double DEFAULT NULL,
  `sattelite` int(11) DEFAULT NULL,
  `direction` varchar(512) DEFAULT NULL,
  `rssi` double DEFAULT NULL,
  `snr` double DEFAULT NULL,
  `gps_date_rx` date DEFAULT NULL,
  `gps_time_rx` time DEFAULT NULL,
  `gps_latitude_rx` double DEFAULT NULL,
  `gps_longitude_rx` double DEFAULT NULL,
  `gps_altituder_rx` double DEFAULT NULL,
  `createdDate` datetime DEFAULT NULL,
  `collarDeviceId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` int(11) NOT NULL,
  `name` varchar(512) NOT NULL,
  `description` varchar(512) DEFAULT NULL,
  `created` datetime DEFAULT NULL,
  `modified` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `name`, `description`, `created`, `modified`) VALUES
(1, 'system', 'System Application', '2021-09-20 00:12:43', '2021-09-20 00:12:43'),
(2, 'admin', 'Admin System', '2021-09-20 00:12:43', '2021-09-20 00:12:43'),
(3, 'manager', 'Manager System', '2021-09-20 00:12:43', '2021-09-20 00:12:43'),
(4, 'normal', 'Normal User', '2021-09-20 00:12:43', '2021-09-20 00:12:43'),
(5, 'supervisor', 'Supervisor System', '2021-09-20 00:12:43', '2021-09-20 00:12:43');

-- --------------------------------------------------------

--
-- Table structure for table `rolemapping`
--

CREATE TABLE `rolemapping` (
  `id` int(11) NOT NULL,
  `principalType` varchar(512) DEFAULT NULL,
  `principalId` varchar(255) DEFAULT NULL,
  `roleId` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `rolemapping`
--

INSERT INTO `rolemapping` (`id`, `principalType`, `principalId`, `roleId`) VALUES
(1, 'USER', '1', 1),
(2, 'USER', '2', 2),
(3, 'USER', '3', 2);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accesstoken`
--
ALTER TABLE `accesstoken`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `acl`
--
ALTER TABLE `acl`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `appuser`
--
ALTER TABLE `appuser`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `collardevice`
--
ALTER TABLE `collardevice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `devicedata`
--
ALTER TABLE `devicedata`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `rolemapping`
--
ALTER TABLE `rolemapping`
  ADD PRIMARY KEY (`id`),
  ADD KEY `principalId` (`principalId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `acl`
--
ALTER TABLE `acl`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `appuser`
--
ALTER TABLE `appuser`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `collardevice`
--
ALTER TABLE `collardevice`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `devicedata`
--
ALTER TABLE `devicedata`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `rolemapping`
--
ALTER TABLE `rolemapping`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
