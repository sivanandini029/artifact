CREATE TABLE Users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(25) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    first_name VARCHAR(50) DEFAULT NULL,
    last_name VARCHAR(50) DEFAULT NULL,
    bio VARCHAR(255) DEFAULT NULL,
    website VARCHAR(255) DEFAULT NULL,
    dob VARCHAR(11) DEFAULT NULL,
    created BIGINT NOT NULL,
    updated BIGINT NOT NULL,
    status enum("ACTIVE", "DISABLED") DEFAULT "ACTIVE" NOT NULL
);

CREATE TABLE Articles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    owner_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    topic VARCHAR(50) NOT NULL,
    views BIGINT NOT NULL DEFAULT 0,
    created BIGINT NOT NULL,
    updated BIGINT NOT NULL,
    status enum("SAVED", "PUBLISHED", "DELETED") NOT NULL DEFAULT "SAVED",
    FOREIGN KEY(owner_id) references Users(id)
);

CREATE TABLE Comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created BIGINT NOT NULL,
    status enum("ACTIVE", "DELETED") NOT NULL DEFAULT "ACTIVE",
    FOREIGN KEY(article_id) references Articles(id),
    FOREIGN KEY(user_id) references Users(id)
);

CREATE TABLE Impressions (
    user_id INT NOT NULL,
    content_id INT NOT NULL,
    content_type enum("ARTICLE", "COMMENT") NOT NULL,
    FOREIGN KEY(user_id) references Users(id),
    PRIMARY KEY(user_id, content_id, content_type)
);