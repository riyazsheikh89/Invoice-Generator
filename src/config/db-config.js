import mongoose from 'mongoose';

const connectDatabase = async () => {
    mongoose.connect(process.env.MONGODB_URL);  // connection setup
    
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, "error connecting to db!"));
    db.once('open', function() {
        console.log('MongoDB connected successfully!');
    });
}

export default connectDatabase;