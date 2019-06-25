DROP TABLE IF EXISTS favorites;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  age INTEGER,
  city VARCHAR(255),
  description VARCHAR(2047),
  image_url VARCHAR(255)
);

INSERT INTO favorites (name, age, city, description, image_url)
VALUES('snuffles',3,'seattle','does not like living creatures, only eats caviar', 'https://placeimg.com/640/480/any');