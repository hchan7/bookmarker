const express = require('express');
app = express();
const {Client} = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://postgres:code@localhost:5432/bookmarker');

const port = process.env.PORT || 3000;

app.get(`/`, (req, res) => {

    res.send(`hello world`)
})

app.listen(port, async()=> {
    try {
        await client.connect();
        const SQL = `
            DROP TABLE IF EXISTS category CASCADE;
            DROP TABLE IF EXISTS bookmark;
            
            CREATE TABLE category (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(100)
            );
            
            CREATE TABLE bookmark (
                                      id SERIAL PRIMARY KEY,
                                      name VARCHAR(100),
                                      url VARCHAR(512),
                                      category_id INTEGER REFERENCES category (id)
            );
            
            
            
            INSERT INTO category(name) VALUES ('coding');
            INSERT INTO category(name) VALUES ('search');
            INSERT INTO category(name) VALUES ('jobs');
            
            INSERT INTO bookmark(name, url, category_id) VALUES ('Google',
                                                                 'https://www.google.com/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'search'));
            INSERT INTO bookmark(name, url, category_id) VALUES ('Stack Overflow',
                                                                 'https://stackoverflow.com/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'coding'));
            INSERT INTO bookmark(name, url, category_id) VALUES ('Bing',
                                                                 'https://www.bing.com/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'search'));
            INSERT INTO bookmark(name, url, category_id) VALUES ('LinkedIn',
                                                                 'https://www.linkedin.com/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'jobs'));
            INSERT INTO bookmark(name, url, category_id) VALUES ('Indeed',
                                                                 'https://www.indeed.com/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'jobs'));
            INSERT INTO bookmark(name, url, category_id) VALUES ('MDN',
                                                                 'https://developer.mozilla.org/en-US/',
                                                                 (SELECT id
                                                                  FROM category c
                                                                  WHERE c.name = 'coding'));
                    `;
        await client.query(SQL);

        console.log(`Listening on port ${port}`);
    }
   catch(err) {
        next(err);
   }
})