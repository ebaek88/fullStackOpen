CREATE TABLE blogs 
(
  id SERIAL PRIMARY KEY, 
  author text, 
  url text NOT NULL, 
  title text NOT NULL, 
  likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('author0', 'https://google.com', 'blog0');

insert into blogs (author, url, title) values ('author1', 'https://naver.com', 'blog1');