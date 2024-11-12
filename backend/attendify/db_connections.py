import pymongo
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()


url = os.getenv('MONGODB_URI')
# url = "mongodb://localhost:27017/"
client = pymongo.MongoClient(url)

db = client['attendify_data']
students_collection = db['students']
images_collection = db['Images']
preview_images_collection = db['previewImages']