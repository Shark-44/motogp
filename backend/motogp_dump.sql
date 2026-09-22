-- MySQL dump 10.13  Distrib 8.0.34, for Win64 (x86_64)
--
-- Host: localhost    Database: motogp
-- ------------------------------------------------------
-- Server version	8.0.34

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `circuit`
--

DROP TABLE IF EXISTS `circuit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `circuit` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `longueurKm` double NOT NULL,
  `nombreVirages` int NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `circuit`
--

LOCK TABLES `circuit` WRITE;
/*!40000 ALTER TABLE `circuit` DISABLE KEYS */;
INSERT INTO `circuit` VALUES ('12a4713c-a69f-11f1-9a15-10e7c6aa2498','Circuit de Barcelona-Catalunya','Espagne',4.659999847412109,14,'/uploads/circuits/cat2-info.webp'),('14eb4102-a6a4-11f1-9a15-10e7c6aa2498','TT Circuit Assen','Pays-Bas',4.539999961853027,18,'/uploads/circuits/nld2-info.webp'),('21e3537e-a6a3-11f1-9a15-10e7c6aa2498','Balaton Park','Hungrie',4.079999923706055,17,'/uploads/circuits/hun2-info.webp'),('35649b49-a6aa-11f1-9a15-10e7c6aa2498','MotorLand Aragón','Espagne',5.079999923706055,17,'/uploads/circuits/ara2-info.webp'),('470f033d-a6ac-11f1-9a15-10e7c6aa2498','Petronas Sepang International Circuit','Malaisie',5.539999961853027,15,'/uploads/circuits/mal-i2nfo.webp'),('4774ee86-a6a5-11f1-9a15-10e7c6aa2498','Silverstone Circuit','Grande Bretagne',5.900000095367432,18,'/uploads/circuits/gbr-info3.webp'),('4de68333-a616-11f1-9a15-10e7c6aa2498','Circuito de Jerez - Ángel Nieto','Espagne',4.420000076293945,13,'/uploads/circuits/spa-i2nfo.webp'),('4fe6e3ad-a6ab-11f1-9a15-10e7c6aa2498','Mobility Resort Motegi','Japon',4.800000190734863,14,'/uploads/circuits/jpn.webp'),('72b63d92-a6ad-11f1-9a15-10e7c6aa2498','Circuit Ricardo Tormo','Espagne',4.010000228881836,14,'/uploads/circuits/v2al-info.webp'),('75ab3b62-a69f-11f1-9a15-10e7c6aa2498','Autodromo Internazionale del Mugello','Italie',5.25,15,'/uploads/circuits/ita2-info.webp'),('779456a6-a6a4-11f1-9a15-10e7c6aa2498','Sachsenring','Allemagne',3.569999933242798,13,'/uploads/circuits/ger2-info.webp'),('8bad32c7-a5d5-11f1-9a15-10e7c6aa2498','Autódromo Internacional de Goiânia – Ayrton Senna','Bresil',3.8399999141693115,14,'/uploads/circuits/bra2-info.webp'),('978131f6-a6a3-11f1-9a15-10e7c6aa2498','CREDITAS Autodrom Brno','République tchèque',5.400000095367432,14,'/uploads/circuits/cze2-info.webp'),('9a1b2496-a69e-11f1-9a15-10e7c6aa2498','Le Mans','France',4.190000057220459,14,'/uploads/circuits/fra2-info.webp'),('a21a9251-a6aa-11f1-9a15-10e7c6aa2498','Misano World Circuit Marco Simoncelli','Italie',4.230000019073486,17,'/uploads/circuits/rsm-info2.webp'),('a67563e7-a6ab-11f1-9a15-10e7c6aa2498','Pertamina Mandalika International Circuit','Indonésie',4.300000190734863,17,'/uploads/circuits/ina2-info.webp'),('a95c5d5e-a6ac-11f1-9a15-10e7c6aa2498','Lusail International Circuit','Qatar',5.380000114440918,16,'/uploads/circuits/qat-info2.webp'),('ebac078b-a615-11f1-9a15-10e7c6aa2498','Circuit Of The Americas','USA',5.510000228881836,20,'/uploads/circuits/usa-in2fo.webp'),('f483c082-a6ab-11f1-9a15-10e7c6aa2498','Phillip Island','Australie',4.449999809265137,12,'/uploads/circuits/aus2-info.webp'),('f6d83900-a5d4-11f1-9a15-10e7c6aa2498','Chang International Circuit','Thaïlande',4.550000190734863,12,'/uploads/circuits/tha-inf2o.webp'),('f792a475-a6aa-11f1-9a15-10e7c6aa2498','Red Bull Ring - Spielberg','Autriche',4.349999904632568,11,'/uploads/circuits/aut-info2.webp'),('f7a6cbc1-a6ac-11f1-9a15-10e7c6aa2498','Autódromo Internacional do Algarve','Portugal',4.590000152587891,15,'/uploads/circuits/por-info2.webp');
/*!40000 ALTER TABLE `circuit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `saison` int NOT NULL,
  `role` enum('officiel','remplacant','wildcard') COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateDebut` date DEFAULT NULL,
  `dateFin` date DEFAULT NULL,
  `piloteId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `equipeId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `Contract_piloteId_fkey` (`piloteId`),
  KEY `Contract_equipeId_fkey` (`equipeId`),
  CONSTRAINT `Contract_equipeId_fkey` FOREIGN KEY (`equipeId`) REFERENCES `team` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `Contract_piloteId_fkey` FOREIGN KEY (`piloteId`) REFERENCES `rider` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES ('4254e941-ac01-4b75-b20d-8438bbc302a4',2026,'officiel','2026-01-01','2026-12-31','feb589f9-a83e-11f1-9a15-10e7c6aa2498','b65a3d79-a9ce-11f1-9a15-10e7c6aa2498'),('447e1da1-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58690-a83e-11f1-9a15-10e7c6aa2498','b65a3d79-a9ce-11f1-9a15-10e7c6aa2498'),('447e9903-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb559c8-a83e-11f1-9a15-10e7c6aa2498','b65a6cbf-a9ce-11f1-9a15-10e7c6aa2498'),('447e9d17-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7490-a845-11f1-9a15-10e7c6aa2498','b65a6cbf-a9ce-11f1-9a15-10e7c6aa2498'),('447e9ed5-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58b9b-a83e-11f1-9a15-10e7c6aa2498','b65a6d31-a9ce-11f1-9a15-10e7c6aa2498'),('447ea03f-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58c03-a83e-11f1-9a15-10e7c6aa2498','b65a6d31-a9ce-11f1-9a15-10e7c6aa2498'),('447ea1d1-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58ab7-a83e-11f1-9a15-10e7c6aa2498','b65a6e03-a9ce-11f1-9a15-10e7c6aa2498'),('447ea42c-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58d56-a83e-11f1-9a15-10e7c6aa2498','b65a6e03-a9ce-11f1-9a15-10e7c6aa2498'),('447ea653-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7669-a845-11f1-9a15-10e7c6aa2498','b65a5e75-a9ce-11f1-9a15-10e7c6aa2498'),('447ea7a2-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7380-a845-11f1-9a15-10e7c6aa2498','b65a5e75-a9ce-11f1-9a15-10e7c6aa2498'),('447ea8fb-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7089-a845-11f1-9a15-10e7c6aa2498','b65a6b4f-a9ce-11f1-9a15-10e7c6aa2498'),('447eaaf9-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','261fd77f-a8f6-11f1-9a15-10e7c6aa2498','b65a6b4f-a9ce-11f1-9a15-10e7c6aa2498'),('447eae58-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7156-a845-11f1-9a15-10e7c6aa2498','b65a6c0b-a9ce-11f1-9a15-10e7c6aa2498'),('447eafe1-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d72e3-a845-11f1-9a15-10e7c6aa2498','b65a6c0b-a9ce-11f1-9a15-10e7c6aa2498'),('447eb154-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58c6b-a83e-11f1-9a15-10e7c6aa2498','b65a6d9f-a9ce-11f1-9a15-10e7c6aa2498'),('447eb2bb-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58cea-a83e-11f1-9a15-10e7c6aa2498','b65a6d9f-a9ce-11f1-9a15-10e7c6aa2498'),('447eb447-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d73f2-a845-11f1-9a15-10e7c6aa2498','b65a6e9d-a9ce-11f1-9a15-10e7c6aa2498'),('447eb5ac-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d7579-a845-11f1-9a15-10e7c6aa2498','b65a6f13-a9ce-11f1-9a15-10e7c6aa2498'),('447eb70d-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','cf9d75fd-a845-11f1-9a15-10e7c6aa2498','b65a6f13-a9ce-11f1-9a15-10e7c6aa2498'),('447eb879-aee8-11f1-8bb0-10e7c6aa2498',2026,'officiel','2026-01-01','2026-12-31','feb58b2c-a83e-11f1-9a15-10e7c6aa2498','b65a6f77-a9ce-11f1-9a15-10e7c6aa2498'),('447eb9d9-aee8-11f1-8bb0-10e7c6aa2498',2026,'wildcard','2026-01-01','2026-12-31','9e8a423c-a846-11f1-9a15-10e7c6aa2498','b65a6d31-a9ce-11f1-9a15-10e7c6aa2498'),('447ebb49-aee8-11f1-8bb0-10e7c6aa2498',2026,'wildcard','2026-01-01','2026-12-31','9e8b856f-a846-11f1-9a15-10e7c6aa2498','b65a3d79-a9ce-11f1-9a15-10e7c6aa2498');
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `raceevent`
--

DROP TABLE IF EXISTS `raceevent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raceevent` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `saison` int NOT NULL,
  `date` datetime(3) NOT NULL,
  `statut` enum('PLANIFIE','TERMINE','ANNULE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `circuitId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `RaceEvent_circuitId_fkey` (`circuitId`),
  CONSTRAINT `RaceEvent_circuitId_fkey` FOREIGN KEY (`circuitId`) REFERENCES `circuit` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `raceevent`
--

LOCK TABLES `raceevent` WRITE;
/*!40000 ALTER TABLE `raceevent` DISABLE KEYS */;
INSERT INTO `raceevent` VALUES ('0a8b81a3-bcae-4286-8594-82f651bac3fb','Grand Prix d\'Autriche',2026,'2026-08-16 00:00:00.000','TERMINE','f792a475-a6aa-11f1-9a15-10e7c6aa2498'),('0ebc8e81-ded5-4d11-8202-3358772b62d6','Grand Prix du Qatar',2026,'2026-04-12 00:00:00.000','TERMINE','a95c5d5e-a6ac-11f1-9a15-10e7c6aa2498'),('11b2fb15-b99d-4a27-9098-45cf0d2a9b0a','Grand Prix d\'Espagne',2026,'2026-04-26 00:00:00.000','TERMINE','4de68333-a616-11f1-9a15-10e7c6aa2498'),('1fa226e2-d17b-4b55-a655-6a17c6bf5d9c','Grand Prix de Valence',2026,'2026-11-15 00:00:00.000','PLANIFIE','72b63d92-a6ad-11f1-9a15-10e7c6aa2498'),('26efb712-1eef-47e9-93ec-d9a28f31e5c2','Grand Prix de Malaisie',2026,'2026-11-01 00:00:00.000','PLANIFIE','470f033d-a6ac-11f1-9a15-10e7c6aa2498'),('2ace4b53-8a21-46f9-8b7f-f2b0ad68bac1','Grand Prix de France',2026,'2026-05-10 00:00:00.000','TERMINE','9a1b2496-a69e-11f1-9a15-10e7c6aa2498'),('3472b4ec-3240-4d44-a885-5a6771b8a971','Grand Prix de San Misano',2026,'2026-09-13 00:00:00.000','TERMINE','a21a9251-a6aa-11f1-9a15-10e7c6aa2498'),('4d7e2f75-dbfd-4e94-8ee3-7c40239b7588','Grand Prix du Portugal',2026,'2026-11-08 00:00:00.000','PLANIFIE','f7a6cbc1-a6ac-11f1-9a15-10e7c6aa2498'),('6054e15a-de7a-47c6-9d71-dc23f35ea10b','Grand Prix de Hongrie',2026,'2026-08-23 00:00:00.000','TERMINE','21e3537e-a6a3-11f1-9a15-10e7c6aa2498'),('64f7fa47-7b38-43d1-8e2c-c78290249bfb','Grand Prix d\'Australie',2026,'2026-10-18 00:00:00.000','PLANIFIE','f483c082-a6ab-11f1-9a15-10e7c6aa2498'),('6c68f2e5-385a-4e65-a775-f7f3bc543c79','Grand Prix des Pays-Bas',2026,'2026-06-28 00:00:00.000','TERMINE','14eb4102-a6a4-11f1-9a15-10e7c6aa2498'),('6e9133d9-822b-454a-be6c-7d2d5b75af06','Grand Prix des Amériques',2026,'2026-03-29 00:00:00.000','TERMINE','ebac078b-a615-11f1-9a15-10e7c6aa2498'),('7597abac-9080-4b1e-9aa3-0d5774e4e866','Grand Prix de Catalogne',2026,'2026-09-06 00:00:00.000','TERMINE','12a4713c-a69f-11f1-9a15-10e7c6aa2498'),('851698be-1e58-43ac-b782-0360dba8a477','Grand Prix du Japon',2026,'2026-10-04 00:00:00.000','PLANIFIE','4fe6e3ad-a6ab-11f1-9a15-10e7c6aa2498'),('89a1fe44-af38-11f1-8bb0-10e7c6aa2498','Grand Prix de Thaïlande',2026,'2026-03-01 15:00:00.000','TERMINE','f6d83900-a5d4-11f1-9a15-10e7c6aa2498'),('98ae2ff4-55e4-4edd-ab23-a7ae7bd1aff1','Grand Prix de Grande-Bretagne',2026,'2026-08-02 00:00:00.000','TERMINE','4774ee86-a6a5-11f1-9a15-10e7c6aa2498'),('c02d1012-a468-4e2f-a840-9d6bfddda4e4','Grand Prix d\'Aragon',2026,'2026-06-07 00:00:00.000','TERMINE','35649b49-a6aa-11f1-9a15-10e7c6aa2498'),('d2de0263-88ed-4f5f-a22a-e0652fd7533c','Grand Prix d\'Indonésie',2026,'2026-09-27 00:00:00.000','PLANIFIE','a67563e7-a6ab-11f1-9a15-10e7c6aa2498'),('d8479096-b6a2-4ace-8f12-4d2b5349d9b1','Grand Prix d\'Allemagne',2026,'2026-07-12 00:00:00.000','TERMINE','779456a6-a6a4-11f1-9a15-10e7c6aa2498'),('e2f9fc74-c4ba-496d-bb1f-aa3ab328fc69','Grand Prix du Brezil',2026,'2026-03-22 00:00:00.000','TERMINE','8bad32c7-a5d5-11f1-9a15-10e7c6aa2498'),('ec93f6fe-9b4e-447a-afcc-1f0d73421618','Grand Prix de République tchèque',2026,'2026-07-19 00:00:00.000','TERMINE','978131f6-a6a3-11f1-9a15-10e7c6aa2498'),('fd750d7c-d4f6-40ea-9240-e5745d09f8ce','Grand Prix d\'Italie',2026,'2026-05-31 00:00:00.000','TERMINE','75ab3b62-a69f-11f1-9a15-10e7c6aa2498');
/*!40000 ALTER TABLE `raceevent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider`
--

DROP TABLE IF EXISTS `rider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prenom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `dateAnniversaire` datetime(3) NOT NULL,
  `photo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rider`
--

LOCK TABLES `rider` WRITE;
/*!40000 ALTER TABLE `rider` DISABLE KEYS */;
INSERT INTO `rider` VALUES ('261fd77f-a8f6-11f1-9a15-10e7c6aa2498','Ogura','Ai','Japon','2001-01-26 00:00:00.000','uploads/riders/Ai_Ogura.webp'),('7f152413-a900-11f1-9a15-10e7c6aa2498','Folger','Jonas','Allemagne','1993-08-13 00:00:00.000','uploads/riders/Jonas_Folger.webp'),('9e8a423c-a846-11f1-9a15-10e7c6aa2498','Pedrosa','Dani','Espagne','1985-09-29 00:00:00.000','uploads/riders/Dani_Pedrosa.webp'),('9e8b8422-a846-11f1-9a15-10e7c6aa2498','Espargaró','Pol','Espagne','1991-06-10 00:00:00.000','uploads/riders/Pol_Espargaró.webp'),('9e8b856f-a846-11f1-9a15-10e7c6aa2498','Pirro','Michele','Italie','1986-07-05 00:00:00.000','uploads/riders/Michele_Pirro.webp'),('9e8b85de-a846-11f1-9a15-10e7c6aa2498','Crutchlow','Cal','Royaume-Uni','1985-10-29 00:00:00.000','uploads/riders/Cal_Crutchlow.webp'),('9e8b868d-a846-11f1-9a15-10e7c6aa2498','Savadori','Lorenzo','Italie','1993-04-04 00:00:00.000','uploads/riders/Lorenzo_Savadori.webp'),('9e8b86ff-a846-11f1-9a15-10e7c6aa2498','Bradl','Stefan','Allemagne','1989-11-29 00:00:00.000','uploads/riders/Stefan_Bradl.webp'),('cf9d664a-a845-11f1-9a15-10e7c6aa2498','Espargaró','Aleix','Espagne','1989-07-30 00:00:00.000','uploads/riders/Aleix_Espargaró.webp'),('cf9d7089-a845-11f1-9a15-10e7c6aa2498','Marquez','Alex','Espagne','1996-04-23 00:00:00.000','uploads/riders/Alex_Marquez.webp'),('cf9d7156-a845-11f1-9a15-10e7c6aa2498','Di Giannantonio','Fabio','Italie','1998-10-10 00:00:00.000','uploads/riders/Fabio_Di_Giannantonio.webp'),('cf9d72e3-a845-11f1-9a15-10e7c6aa2498','Morbidelli','Franco','Italie','1994-12-04 00:00:00.000','uploads/riders/Franco_Morbidelli.webp'),('cf9d7380-a845-11f1-9a15-10e7c6aa2498','Oliveira','Miguel','Portugal','1995-01-04 00:00:00.000','uploads/riders/Miguel_Oliveira.webp'),('cf9d73f2-a845-11f1-9a15-10e7c6aa2498','Fernández','Raúl','Espagne','2000-10-23 00:00:00.000','uploads/riders/Raúl_Fernández.webp'),('cf9d7490-a845-11f1-9a15-10e7c6aa2498','Rins','Álex','Espagne','1995-12-08 00:00:00.000','uploads/riders/Álex_Rins.webp'),('cf9d7579-a845-11f1-9a15-10e7c6aa2498','Mir','Joan','Espagne','1997-09-01 00:00:00.000','uploads/riders/Joan_Mir.webp'),('cf9d75fd-a845-11f1-9a15-10e7c6aa2498','Marini','Luca','Italie','1997-08-10 00:00:00.000','uploads/riders/Luca_Marini.webp'),('cf9d7669-a845-11f1-9a15-10e7c6aa2498','Miller','Jack','Australie','1995-01-18 00:00:00.000','uploads/riders/Jack_Miller.webp'),('cf9d776d-a845-11f1-9a15-10e7c6aa2498','Fernández','Augusto','Espagne','1997-09-23 00:00:00.000','uploads/riders/Augusto_Fernández.webp'),('feb559c8-a83e-11f1-9a15-10e7c6aa2498','Quartararo','Fabio','France','1999-04-20 00:00:00.000','uploads/riders/Fabio_Quartararo.webp'),('feb58690-a83e-11f1-9a15-10e7c6aa2498','Bagnaia','Francesco','Italie','1997-01-14 00:00:00.000','uploads/riders/Francesco_Bagnaia.webp'),('feb589f9-a83e-11f1-9a15-10e7c6aa2498','Márquez','Marc','Espagne','1993-02-17 00:00:00.000','uploads/riders/Marc_Márquez.webp'),('feb58ab7-a83e-11f1-9a15-10e7c6aa2498','Martin','Jorge','Espagne','1998-01-29 00:00:00.000','uploads/riders/Jorge_Martin.webp'),('feb58b2c-a83e-11f1-9a15-10e7c6aa2498','Zarco','Johann','France','1990-07-16 00:00:00.000','uploads/riders/Johann_Zarco.webp'),('feb58b9b-a83e-11f1-9a15-10e7c6aa2498','Acosta','Pedro','Espagne','2004-05-25 00:00:00.000','uploads/riders/Pedro_Acosta.webp'),('feb58c03-a83e-11f1-9a15-10e7c6aa2498','Binder','Brad','Afrique du Sud','1995-08-11 00:00:00.000','uploads/riders/Brad_Binder.webp'),('feb58c6b-a83e-11f1-9a15-10e7c6aa2498','Vinales','Maverick','Espagne','1995-01-12 00:00:00.000','uploads/riders/Maverick_Vinales.webp'),('feb58cea-a83e-11f1-9a15-10e7c6aa2498','Bastianini','Enea','Italie','1997-12-30 00:00:00.000','uploads/riders/Enea_Bastianini.webp'),('feb58d56-a83e-11f1-9a15-10e7c6aa2498','Bezzecchi','Marco','Italie','1998-11-12 00:00:00.000','uploads/riders/Marco_Bezzecchi.webp');
/*!40000 ALTER TABLE `rider` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `team`
--

DROP TABLE IF EXISTS `team`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `team` (
  `id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nom` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pays` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `constructeur` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `estOfficielle` tinyint(1) NOT NULL DEFAULT '0',
  `logo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `team`
--

LOCK TABLES `team` WRITE;
/*!40000 ALTER TABLE `team` DISABLE KEYS */;
INSERT INTO `team` VALUES ('b65a3d79-a9ce-11f1-9a15-10e7c6aa2498','Ducati Lenovo Team','Italie','Ducati',1,'uploads/teams/Ducati_Lenovo.webp'),('b65a5e75-a9ce-11f1-9a15-10e7c6aa2498','Prima Pramac Racing','Italie','Yamaha',0,'uploads/teams/Prima_Pramac_Yamaha.webp'),('b65a6b4f-a9ce-11f1-9a15-10e7c6aa2498','Gresini Racing MotoGP','Italie','Ducati',0,'uploads/teams/Gresini_BK8.webp'),('b65a6c0b-a9ce-11f1-9a15-10e7c6aa2498','Pertamina Enduro VR46 Racing Team','Italie','Ducati',0,'uploads/teams/Pertamina_VR46.webp'),('b65a6cbf-a9ce-11f1-9a15-10e7c6aa2498','Monster Energy Yamaha MotoGP','Japon','Yamaha',1,'uploads/teams/Monster_Yamaha.webp'),('b65a6d31-a9ce-11f1-9a15-10e7c6aa2498','Red Bull KTM Factory Racing','Autriche','KTM',1,'uploads/teams/RedBull_KTM_Factory.webp'),('b65a6d9f-a9ce-11f1-9a15-10e7c6aa2498','Red Bull GASGAS Tech3','France','KTM',0,'uploads/teams/RedBull_KTM_Tech3.webp'),('b65a6e03-a9ce-11f1-9a15-10e7c6aa2498','Aprilia Racing','Italie','Aprilia',1,'uploads/teams/Aprilia_Racing.webp'),('b65a6e9d-a9ce-11f1-9a15-10e7c6aa2498','Trackhouse Racing','États-Unis','Aprilia',0,'uploads/teams/Trackhouse_Motogp.webp'),('b65a6f13-a9ce-11f1-9a15-10e7c6aa2498','Repsol Honda Team','Japon','Honda',1,'uploads/teams/Honda_HRC.webp'),('b65a6f77-a9ce-11f1-9a15-10e7c6aa2498','LCR Honda','Monaco','Honda',0,'uploads/teams/LCR_Honda.webp');
/*!40000 ALTER TABLE `team` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-22  8:16:21
