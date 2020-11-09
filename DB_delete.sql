DELETE FROM readoo_db.user_reports_book WHERE userId > 0;

DELETE FROM readoo_db.user_reports_comment WHERE userId > 0;

DELETE FROM readoo_db.login_register WHERE userId > 0;
ALTER TABLE readoo_db.login_register AUTO_INCREMENT = 1;

DELETE FROM readoo_db.last_user_book WHERE userId > 0;

DELETE FROM readoo_db.user_likes_book where userId > 0;

DELETE FROM readoo_db.user_comments_book WHERE userId > 0;

DELETE FROM readoo_db.chat_message WHERE chatId > 0;

DELETE FROM readoo_db.chat_history WHERE chatId > 0;
ALTER TABLE readoo_db.chat_history AUTO_INCREMENT = 1;

DELETE FROM readoo_db.book WHERE bookId > 0;
ALTER TABLE readoo_db.book AUTO_INCREMENT = 1;

DELETE FROM readoo_db.genre WHERE genreId > 0;
ALTER TABLE readoo_db.genre AUTO_INCREMENT = 1;

DELETE FROM readoo_db.user_genre where userId > 0;

DELETE FROM readoo_db.app_user WHERE userId > 0;
ALTER TABLE readoo_db.app_user AUTO_INCREMENT = 1;