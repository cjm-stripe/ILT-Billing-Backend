import express from 'express';
import dotenv from 'dotenv';
import Stripe from 'stripe';
import cors from 'cors';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

import { encrypt } from './auth';

dotenv.config();
const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'stripe_test1',
    password: '667371',
    port: 5432,
});

app.use(cors());
app.use(express.json());

app.post('/create-customer', async (req, res) => {
    try {
        const { email, name, password } = req.body;

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const customer = await stripe.customers.create({
            email,
            name,
        });

        // Store the customer data in PostgreSQL
        const client = await pool.connect();
        const query = `
    INSERT INTO customers (stripe_customer_id, name, email, password)
    VALUES ($1, $2, $3, $4) RETURNING *;
    `;
        const values = [customer.id, name, email, hashedPassword];

        const result = await client.query(query, values);
        client.release();

        res.status(200).json({
            success: true,
            customer: customer,
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

app.post('/token', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve the user's data from the database
        const client = await pool.connect();
        const query = 'SELECT * FROM customers WHERE email = $1';
        const result = await client.query(query, [email]);
        client.release();

        if (result.rows.length === 0) {
            // User not found
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        const user = result.rows[0];

        // Compare the input password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // Password does not match
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        const jwt = await encrypt({ email: user.email, expiresAt: new Date() });
        // Authentication successful

        res.status(200).json({ success: true, token: jwt });
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
});

app.post('/sign-in', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Retrieve the user's data from the database
        const client = await pool.connect();
        const query = 'SELECT * FROM customers WHERE email = $1';
        const result = await client.query(query, [email]);
        client.release();

        if (result.rows.length === 0) {
            // User not found
            res.status(404).json({ success: false, error: 'User not found' });
            return;
        }

        const user = result.rows[0];

        // Compare the input password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            // Password does not match
            res.status(401).json({ success: false, error: 'Invalid credentials' });
            return;
        }

        // Authentication successful
        res.status(200).json({ success: true, customer: { id: user.id, email: user.email, name: user.name } });
        return;
    } catch (error) {
        res.status(500).json({ success: false, error: error });
        return;
    }
});

app.get('/get-products', async (req, res) => {
    try {
        // Fetch all products from Stripe
        const products = await stripe.products.list();
        res.status(200).json(products.data);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

// Endpoint to get all prices
app.get('/get-prices', async (req, res) => {
    try {
        // Fetch all prices from Stripe
        const prices = await stripe.prices.list({
            expand: ['data.product'], // Expands product information associated with each price
        });
        const sortedPrices = prices.data.sort((a, b) => (a.unit_amount ?? 0) - (b.unit_amount ?? 0));
        res.status(200).json(sortedPrices);
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
