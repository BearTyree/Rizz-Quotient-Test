# Rizz Quotient Test

## Overview
This is a website where users receive a "rizz quotient" based on their ability to answer questions rizzfully.
The website is made with cloudflare workers, D1, kv, and react.
The test is being created/edited/verified using R and the psych package.
The goal is to either prove or disprove the existence of an r factor (general rizz factor.)

## Scoring
The questions are scored on a scale from worst to best answer, with bad answers recieving negative points, and correct answers receiving points. The sum of all points acquired/lost on the test is the users raw score. This raw score is then compared to the mean and standard deviation of the norm group to get the number of standard deviations the user is above or below the norm.
The rizz quotient works on a normal scale where every standard deviation is 15 points above or below 100. For example, if a user gets a raw score of 12, and the mean of the norm group was 12, then the user would have a rizz quotient of 100. If the user gets a raw score of 15, and the mean of the norm group was 12, with a standard deviation of 3, then the user would have a rizz quotient of 115.
![image](https://github.com/user-attachments/assets/fd4397d6-27a3-49cc-9eb4-91fe71fe844f)
### Scoring Methods and Reliability
The current scoring method utilizes a hacky way of increasing the internal reliability. For each question, the total points a user receives for that question get multiplied by a weight. This weight is calculated by taking the reliability for that individual question and dividing it by the total reliability of the test. This increases reliability, however, this is hacky method of doing so.
Another method that can be enabled is to score each question by the norm, thus rewarding higher for getting a hard questions correct, but also taking more for getting an easy question wrong. This is a very hacky method that takes inspiration from Item Response Theory. The graph of raw scores calculated when using this method with the norm group are below:
![plot(2)](https://github.com/user-attachments/assets/afb6e7be-386a-46de-adbe-492ad21c8ecb)
The factor analysis using this method is below:
![plot(6)](https://github.com/user-attachments/assets/d706ac40-8430-462c-9e75-f55aeceaa70f)
Another method would be to put all scores on a min-max scale using the following formula:
`(optionPoints - minimumPointsInTheQuestion) / (maxPointsInTheQuestion - minimumPointsInTheQuestion)`
This yeilds the following score distribution graph in the norm group:
![plot(3)](https://github.com/user-attachments/assets/37fd177a-baeb-4fac-8048-54ef69cadf73)
This, however, is not the best idea as it introduces the influence of another factor, as well as lowers the influence of the general rizz factor:
![plot(5)](https://github.com/user-attachments/assets/a0b66b57-99bd-41b9-b97a-d2e6c8819445)


## Norming
The norm was created using a group of in person testers. Admins created testing sessions via the admin panel. (The Admin panel utilizes jwts and a d1 databases of hashed and salted passwords for authentication.) Testers were required to signup via the rizz quotient norming sign up page (only available when norming env set to true.) The admins were then able to print out a PDF containing a test ticket for each person signed up for a testing session. This PDF is automatically generated for each testing session via the admin panel. The testing tickets have a randomly generated, one time use, username and password that the testers put into the website to access the test. The data from all the testers were collected into the d1 database. This data is able to be viewed via the admin panel. In the admin panel, the internal reliability (as cronbachs alpha, not mcdonalds omega) is calculated. The admins then have the ability to disable certain questions and testers from being included in the calculations to look for faulty questions or outlieing testers. PDF score sheets for every tester in a certain testing session are accessible via the admin panel. These were printed and returned to testers once the norm had been created.
![image](https://github.com/user-attachments/assets/c9306ca7-1e8b-4d97-a28c-a48efdb79f33)
![image](https://github.com/user-attachments/assets/fbbde9b3-6dd0-4681-9091-79f99b6a12ac)
![image](https://github.com/user-attachments/assets/721e7c80-e5c1-483f-9139-a7b80c253643)
![image](https://github.com/user-attachments/assets/dd8013ef-5ad5-40e6-b975-6c6191e919f2)
![image](https://github.com/user-attachments/assets/e3debcbd-67d9-464c-b60f-80115fe724ec)
![image](https://github.com/user-attachments/assets/9fa93eef-4cb2-49a9-9021-2f84ee1ff82a)
![image](https://github.com/user-attachments/assets/4963d3f6-2009-4cc0-824d-0a88a7bbae63)
![image](https://github.com/user-attachments/assets/0395c5ec-77d8-45d4-b419-cceb9fa78d37)



