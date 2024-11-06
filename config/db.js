import mongoose from 'mongoose'

//connection string
mongoose.connect('mongodb+srv://umer:171175@cluster0.zbqcm.mongodb.net/chat?retryWrites=true&w=majority&appName=Cluster0')

export default mongoose