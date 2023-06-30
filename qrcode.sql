-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 30 juin 2023 à 15:41
-- Version du serveur :  10.4.17-MariaDB
-- Version de PHP : 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `qrcode`
--

-- --------------------------------------------------------

--
-- Structure de la table `qr_data_main`
--

CREATE TABLE `qr_data_main` (
  `Nom` text NOT NULL,
  `Prenom` text NOT NULL,
  `quantité` int(11) NOT NULL,
  `date` date NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Structure de la table `qr_event`
--

CREATE TABLE `qr_event` (
  `eventName` text NOT NULL,
  `eventDesc` text NOT NULL,
  `eventDate` date NOT NULL,
  `eventPlace` text NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `qr_event`
--

INSERT INTO `qr_event` (`eventName`, `eventDesc`, `eventDate`, `eventPlace`, `id`) VALUES
('Evenement Test', 'Test de crea,modif,supp devenement', '2023-06-29', '50', 1);

-- --------------------------------------------------------

--
-- Structure de la table `qr_event_archive`
--

CREATE TABLE `qr_event_archive` (
  `eventName` text NOT NULL,
  `eventDesc` text NOT NULL,
  `eventDate` date NOT NULL,
  `eventPlace` text NOT NULL,
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `qr_event_archive`
--

INSERT INTO `qr_event_archive` (`eventName`, `eventDesc`, `eventDate`, `eventPlace`, `id`) VALUES
('Event Test Copy', 'Evenement de test pour la copy bdd', '2023-06-30', '10', 5),
('Evenement Test 3', 'Evenement de test sur lajout de donnée dans la bdd depuis la page admin', '2023-06-29', '10', 3),
('Test Supp ', 'test open supp page', '2023-06-30', '32', 6),
('Test Supp', 'test', '2023-06-30', '10', 7);

-- --------------------------------------------------------

--
-- Structure de la table `qr_inscription_data`
--

CREATE TABLE `qr_inscription_data` (
  `Nom` text NOT NULL,
  `Prenom` text NOT NULL,
  `idEvenement` text NOT NULL,
  `email` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `qr_inscription_data`
--

INSERT INTO `qr_inscription_data` (`Nom`, `Prenom`, `idEvenement`, `email`) VALUES
('test', 'test', 'test', 'test'),
('MEKKID', 'Yanis', '345', 'yanis.mekkid@icloud.com'),
('MEKKID', 'Yanis', '345', 'yanis.mekkid@icloud.com'),
('MEKKID2', 'Yanis2', '345', 'yanis.mekkid@icloud.com'),
('Mekkid', 'Yanis', '346', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '347', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '347', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '348', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '349', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '348', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '46', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '46', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '46', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '46', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '41', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '41', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '31', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '6', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '346', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '36', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '6', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '6', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'yanis.mekkid@icloud.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com'),
('Mekkid', 'Yanis', '1', 'sweetgamer54@gmail.com');

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `username` text NOT NULL,
  `password` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `user`
--

INSERT INTO `user` (`username`, `password`) VALUES
('yanis', 'test');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `qr_event`
--
ALTER TABLE `qr_event`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `qr_event`
--
ALTER TABLE `qr_event`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
