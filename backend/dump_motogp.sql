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
  `id` varchar(36) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `pays` varchar(255) NOT NULL,
  `longueurKm` float NOT NULL,
  `nombreVirages` int NOT NULL,
  `photo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `circuit`
--

LOCK TABLES `circuit` WRITE;
/*!40000 ALTER TABLE `circuit` DISABLE KEYS */;
INSERT INTO `circuit` VALUES ('12a4713c-a69f-11f1-9a15-10e7c6aa2498','Circuit de Barcelona-Catalunya','Espagne',4.66,14,'/uploads/circuits/cat2-info.webp'),('14eb4102-a6a4-11f1-9a15-10e7c6aa2498','TT Circuit Assen','Pays-Bas',4.54,18,'/uploads/circuits/nld2-info.webp'),('21e3537e-a6a3-11f1-9a15-10e7c6aa2498','Balaton Park','Hungrie',4.08,17,'/uploads/circuits/hun2-info.webp'),('35649b49-a6aa-11f1-9a15-10e7c6aa2498','MotorLand Aragón','Espagne',5.08,17,'/uploads/circuits/ara2-info.webp'),('470f033d-a6ac-11f1-9a15-10e7c6aa2498','Petronas Sepang International Circuit','Malaisie',5.54,15,'/uploads/circuits/mal-i2nfo.webp'),('4774ee86-a6a5-11f1-9a15-10e7c6aa2498','Silverstone Circuit','Grande Bretagne',5.9,18,'/uploads/circuits/gbr-info3.webp'),('4de68333-a616-11f1-9a15-10e7c6aa2498','Circuito de Jerez - Ángel Nieto','Espagne',4.42,13,'/uploads/circuits/spa-i2nfo.webp'),('4fe6e3ad-a6ab-11f1-9a15-10e7c6aa2498','Mobility Resort Motegi','Japon',4.8,14,'/uploads/circuits/jpn.webp'),('72b63d92-a6ad-11f1-9a15-10e7c6aa2498','Circuit Ricardo Tormo','Espagne',4.01,14,'/uploads/circuits/v2al-info.webp'),('75ab3b62-a69f-11f1-9a15-10e7c6aa2498','Autodromo Internazionale del Mugello','Italie',5.25,15,'/uploads/circuits/ita2-info.webp'),('779456a6-a6a4-11f1-9a15-10e7c6aa2498','Sachsenring','Allemagne',3.57,13,'/uploads/circuits/ger2-info.webp'),('8bad32c7-a5d5-11f1-9a15-10e7c6aa2498','Autódromo Internacional de Goiânia – Ayrton Senna','Bresil',3.84,14,'/uploads/circuits/bra2-info.webp'),('978131f6-a6a3-11f1-9a15-10e7c6aa2498','CREDITAS Autodrom Brno','République tchèque',5.4,14,'/uploads/circuits/cze2-info.webp'),('9a1b2496-a69e-11f1-9a15-10e7c6aa2498','Le Mans','France',4.19,14,'/uploads/circuits/fra2-info.webp'),('a21a9251-a6aa-11f1-9a15-10e7c6aa2498','Misano World Circuit Marco Simoncelli','Italie',4.23,17,'/uploads/circuits/rsm-info2.webp'),('a67563e7-a6ab-11f1-9a15-10e7c6aa2498','Pertamina Mandalika International Circuit','Indonésie',4.3,17,'/uploads/circuits/ina2-info.webp'),('a95c5d5e-a6ac-11f1-9a15-10e7c6aa2498','Lusail International Circuit','Qatar',5.38,16,'/uploads/circuits/qat-info2.webp'),('ebac078b-a615-11f1-9a15-10e7c6aa2498','Circuit Of The Americas','USA',5.51,20,'/uploads/circuits/usa-in2fo.webp'),('f483c082-a6ab-11f1-9a15-10e7c6aa2498','Phillip Island','Australie',4.45,12,'/uploads/circuits/aus2-info.webp'),('f6d83900-a5d4-11f1-9a15-10e7c6aa2498','Chang International Circuit','Thaïlande',4.55,12,'/uploads/circuits/tha-inf2o.webp'),('f792a475-a6aa-11f1-9a15-10e7c6aa2498','Red Bull Ring - Spielberg','Autriche',4.35,11,'/uploads/circuits/aut-info2.webp'),('f7a6cbc1-a6ac-11f1-9a15-10e7c6aa2498','Autódromo Internacional do Algarve','Portugal',4.59,15,'/uploads/circuits/por-info2.webp');
/*!40000 ALTER TABLE `circuit` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contract`
--

DROP TABLE IF EXISTS `contract`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contract` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `saison` int NOT NULL,
  `role` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `piloteId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `equipeId` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_contract_rider` (`piloteId`),
  KEY `fk_contract_team` (`equipeId`),
  CONSTRAINT `fk_contract_rider` FOREIGN KEY (`piloteId`) REFERENCES `rider` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contract_team` FOREIGN KEY (`equipeId`) REFERENCES `team` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contract`
--

LOCK TABLES `contract` WRITE;
/*!40000 ALTER TABLE `contract` DISABLE KEYS */;
INSERT INTO `contract` VALUES ('4254e941-ac01-4b75-b20d-8438bbc302a4',2026,'officiel','feb589f9-a83e-11f1-9a15-10e7c6aa2498','b65a3d79-a9ce-11f1-9a15-10e7c6aa2498');
/*!40000 ALTER TABLE `contract` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rider`
--

DROP TABLE IF EXISTS `rider`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rider` (
  `id` varchar(36) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `pays` varchar(255) NOT NULL,
  `dateAnniversaire` datetime(3) NOT NULL,
  `photo` varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
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
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
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

-- Dump completed on 2026-09-12 12:45:28
