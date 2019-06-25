DROP TABLE IF EXISTS favorites;

CREATE TABLE favorites (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255),
  name VARCHAR(255),
  age VARCHAR(255),
  gender VARCHAR(255),
  size VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  description TEXT,
  image_url VARCHAR(255)
);

INSERT INTO favorites (type, name, age, gender, size, city, state, description, image_url)
VALUES('Cat','Merida','Young','Female','Medium','Orange','CA','Very sweet, she gets along with other dogs', 'https://dl5zpyw5k3jeb.cloudfront.net/photos/pets/45078342/1/?bust=1561486424');