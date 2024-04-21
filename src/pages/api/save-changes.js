
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));

await redisClient.connect();

// Save changes to Redis
export async function saveChanges(selectedServices, uid) {
    console.log(selectedServices)
    redisClient.set(`selectedServices_${uid}`, selectedServices);
}



export default async function handler(req, res) {
    saveChanges(req.body.selectedServices, req.body.user.id)

console.log(req.body.selectedServices)
return res.status(200).json({
    status: 'success',
    message: 'Changes saved successfully'
})

}
