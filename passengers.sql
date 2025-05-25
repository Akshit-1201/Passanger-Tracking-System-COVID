CREATE TABLE Passengers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    passportNumber VARCHAR(50),
    temperature FLOAT,
    hasOverseasHistory BOOLEAN,
    airport VARCHAR(100)
);