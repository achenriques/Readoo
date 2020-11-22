-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema readoo_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema readoo_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `readoo_db` DEFAULT CHARACTER SET utf8 ;
USE `readoo_db` ;

-- -----------------------------------------------------
-- Table `readoo_db`.`app_user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`app_user` (
  `userId` INT(10) NOT NULL AUTO_INCREMENT,
  `userName` VARCHAR(20) NOT NULL,
  `userSurname` VARCHAR(45) NOT NULL,
  `userNick` VARCHAR(20) NOT NULL,
  `userPass` VARCHAR(100) NOT NULL,
  `userEmail` VARCHAR(50) NOT NULL,
  `userAboutMe` VARCHAR(140) NULL DEFAULT NULL,
  `userKarma` INT(10) UNSIGNED ZEROFILL NULL DEFAULT NULL,
  `userAvatarUrl` VARCHAR(50) NULL DEFAULT NULL,
  `userVisible` TINYINT(1) NOT NULL,
  `userLanguage` INT(10) NULL DEFAULT '0',
  PRIMARY KEY (`userId`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`genre` (
  `genreId` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
  `genre` VARCHAR(24) NOT NULL,
  PRIMARY KEY (`genreId`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`book` (
  `bookId` INT(10) NOT NULL AUTO_INCREMENT,
  `bookTitle` VARCHAR(45) NOT NULL,
  `bookAuthor` VARCHAR(45) NULL DEFAULT NULL,
  `bookDescription` VARCHAR(140) NULL DEFAULT NULL,
  `bookReview` VARCHAR(140) NULL DEFAULT NULL,
  `bookLikes` INT(10) UNSIGNED ZEROFILL NOT NULL,
  `bookDate` DATETIME NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `bookCoverUrl` VARCHAR(50) NULL DEFAULT NULL,
  `userId` INT(10) NOT NULL,
  `genreId` INT(10) UNSIGNED NOT NULL,
  `bookVisible` TINYINT(1) NOT NULL,
  PRIMARY KEY (`bookId`),
  INDEX `fk_book_genreId` (`genreId` ASC) VISIBLE,
  INDEX `fk_book_userId` (`userId` ASC) VISIBLE,
  CONSTRAINT `fk_book_genreId`
    FOREIGN KEY (`genreId`)
    REFERENCES `readoo_db`.`genre` (`genreId`),
  CONSTRAINT `fk_book_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`))
ENGINE = InnoDB
AUTO_INCREMENT = 11
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`last_user_book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`last_user_book` (
  `userId` INT(10) NOT NULL,
  `bookId` INT(10) NOT NULL,
  `lastUserBookDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `genreId` INT(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`userId`, `genreId`),
  INDEX `fk_last_user_book_bookId` (`bookId` ASC) VISIBLE,
  INDEX `fk_last_user_book_genreId_idx` (`genreId` ASC) VISIBLE,
  CONSTRAINT `fk_last_user_book_bookId`
    FOREIGN KEY (`bookId`)
    REFERENCES `readoo_db`.`book` (`bookId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_last_user_book_genreId`
    FOREIGN KEY (`genreId`)
    REFERENCES `readoo_db`.`genre` (`genreId`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_last_user_book_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`login_register`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`login_register` (
  `userId` INT(10) NOT NULL,
  `loginRegisterDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userId`, `loginRegisterDate`),
  CONSTRAINT `fk_login_register_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`user_comments_book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`user_comments_book` (
  `commentId` INT(20) NOT NULL AUTO_INCREMENT,
  `userId` INT(10) NOT NULL,
  `bookId` INT(10) NOT NULL,
  `commentDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `commentText` VARCHAR(140) NOT NULL,
  `commentFatherId` INT(20) NULL DEFAULT NULL,
  `commentVisible` TINYINT(4) NOT NULL,
  PRIMARY KEY (`commentId`),
  INDEX `fk_user_comments_book_userId` (`userId` ASC) VISIBLE,
  INDEX `fk_user_comments_book_bookId` (`bookId` ASC) VISIBLE,
  INDEX `fk_user_comments_book_commentFatherId` (`commentFatherId` ASC) VISIBLE,
  CONSTRAINT `fk_user_comments_book_bookId`
    FOREIGN KEY (`bookId`)
    REFERENCES `readoo_db`.`book` (`bookId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user_comments_book_commentFatherId`
    FOREIGN KEY (`commentFatherId`)
    REFERENCES `readoo_db`.`user_comments_book` (`commentId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user_comments_book_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
AUTO_INCREMENT = 73
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`user_genre`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`user_genre` (
  `userId` INT(10) NOT NULL,
  `genreId` INT(10) UNSIGNED ZEROFILL NOT NULL,
  PRIMARY KEY (`userId`, `genreId`),
  INDEX `fk_user_genre_genreId` (`genreId` ASC) VISIBLE,
  CONSTRAINT `fk_user_genre_genreId`
    FOREIGN KEY (`genreId`)
    REFERENCES `readoo_db`.`genre` (`genreId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user_genre_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`user_likes_book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`user_likes_book` (
  `userId` INT(10) NOT NULL,
  `bookId` INT(10) NOT NULL,
  `likeBoolean` TINYINT(1) NULL DEFAULT NULL,
  PRIMARY KEY (`userId`, `bookId`),
  INDEX `fk_user_likes_book_bookId` (`bookId` ASC) VISIBLE,
  CONSTRAINT `fk_user_likes_book_bookId`
    FOREIGN KEY (`bookId`)
    REFERENCES `readoo_db`.`book` (`bookId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user_likes_book_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`user_reports_book`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`user_reports_book` (
  `userId` INT(10) NOT NULL,
  `bookId` INT(10) NOT NULL,
  `reportText` VARCHAR(140) NOT NULL,
  PRIMARY KEY (`userId`, `bookId`),
  INDEX `fk_user_reports_book_bookId` (`bookId` ASC) VISIBLE,
  CONSTRAINT `fk_user_reports_book_bookId`
    FOREIGN KEY (`bookId`)
    REFERENCES `readoo_db`.`book` (`bookId`),
  CONSTRAINT `fk_user_reports_book_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`user_reports_comment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`user_reports_comment` (
  `userId` INT(10) NOT NULL,
  `commentId` INT(20) NOT NULL,
  `reportText` VARCHAR(140) NOT NULL,
  PRIMARY KEY (`userId`, `commentId`),
  INDEX `fk_user_reports_comment_commentId` (`commentId` ASC) VISIBLE,
  CONSTRAINT `fk_user_reports_comment_commentId`
    FOREIGN KEY (`commentId`)
    REFERENCES `readoo_db`.`user_comments_book` (`commentId`)
    ON DELETE CASCADE,
  CONSTRAINT `fk_user_reports_comment_userId`
    FOREIGN KEY (`userId`)
    REFERENCES `readoo_db`.`app_user` (`userId`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `readoo_db`.`chat_histroy`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`chat_histroy` (
  `chatId` BIGINT(20) NOT NULL DEFAULT 1,
  `userIdFrom` INT(10) NOT NULL,
  `userIdTo` INT(10) NOT NULL,
  `chatDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `chatVisible` CHAR(1) NULL DEFAULT 'B',
  PRIMARY KEY (`chatId`),
  INDEX `fk_chathistroy_appuser1_idx` (`userIdFrom` ASC) VISIBLE,
  INDEX `fk_chathistroy_appuser2_idx` (`userIdTo` ASC) VISIBLE,
  CONSTRAINT `fk_chathistroy_appuser1`
    FOREIGN KEY (`userIdFrom`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_chathistroy_appuser2`
    FOREIGN KEY (`userIdTo`)
    REFERENCES `readoo_db`.`app_user` (`userId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `readoo_db`.`chat_message`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `readoo_db`.`chat_message` (
  `chatId` BIGINT(20) NOT NULL,
  `messageDateTime` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `userId` VARCHAR(45) NOT NULL,
  `message` VARCHAR(45) NULL,
  INDEX `fk_chat_message_chat_histroy1_idx` (`chatId` ASC) VISIBLE,
  PRIMARY KEY (`chatId`, `messageDateTime`),
  CONSTRAINT `fk_chat_message_chat_histroy1`
    FOREIGN KEY (`chatId`)
    REFERENCES `readoo_db`.`chat_histroy` (`chatId`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- Necessary insertions --
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('lyric');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('drama');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('didactic');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('history');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('oratory');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('biography');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('autobiography');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('poetry');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('novel');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('fable');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('legend');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('tale');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('childish');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('theater');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('romantic');
INSERT INTO `readoo_db`.`genre` (`genre`) VALUES ('erotic');
