import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './database/connect.js';
import user from './router/UserRouter.js';
import item from './router/ItemRouter.js';
import mealSchedule from './router/MealSchduleRouter.js';
import mealOrder from './router/MealOrderRouter.js';

dotenv.config();

/**app declaration */
const app = express();

/**app  middleware */
app.use(morgan('tiny'));
app.use(cors());
app.use(express.json());

/**routes */
app.use('/api/user', user);
app.use('/api/items', item);
app.use('/api/schedule', mealSchedule);
app.use('/api/order', mealOrder);
app.get('/', (req, res) => {
    try {
        res.json('Get req');
    } catch (error) {
        res.json(error);
    }
});

const port = process.env.PORT || 8000;

connectDB()
    .then(() => {
        try {
            app.listen(port, () => {
                console.log(`Server is connected at ${port}`);
            });
        } catch (error) {
            console.log("can't connect server");
        }
    })
    .catch((err) => {
        console.error('Error connecting to the database:', err);
    });
