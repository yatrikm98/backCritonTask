const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
        host: 'localhost',
        // port: 3000,
        user: 'postgres',
        password: 'test',
        database: 'criton1'
    }
});

const app = express();
app.use(bodyParser.json())
app.use(cors())


app.get('/', (req, res) => {
    db.select('*').from('users').then(data => {
        res.send(data)
    });
    // res.json('This is working')
})

app.post('/register', (req, res) => {
    const { id, text, contact, userName, email } = req.body
    console.log(id)
    console.log(text)
    console.log(contact)
    console.log(userName)
    console.log(email)
    db('users')
        .returning('*')
        .insert({
            id,
            text,
            contact,
            username: userName,
            email
        })
        .then(response => {
            res.json(response);
        })

})


app.put('/updateuser', (req, res) => {
    const { id,
        text,
        contact,
        userName,
        email } = req.body
    console.log('Update', id)
    console.log('Update', text)
    console.log('Update', contact)
    console.log('Update', userName)
    console.log('Update', email)

    const userId = id;
    const updatedData = {
        text,
        contact,
        email,
        userame: user
    };
    knex('users')
        .where({ id: userId })
        .update(updatedData)
        .then(() => {
            res.json('Success');
        })
        .catch((error) => {
            console.error('Error updating user:', error);
        })
})
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    return knex('users')
        .where('id', id)
        .del()
        .returning('*')
        .then((deleted) => {
            console.log(deleted);
            return knex('users')
                .where('id', id)
                .del()
                .returning('*');
        })
        .then((article) => {
            console.log(article);
            return res.status(204).send('article deleted');
        })
        .catch(err => next(err));
})

app.listen(3000, () => {
    console.log('App is running on port 3000')
})