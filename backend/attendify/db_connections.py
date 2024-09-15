import pymongo

url = "mongodb://localhost:27017/"
client = pymongo.MongoClient(url)

db = client['attendify_data']
images_collection = db['Images']
students_collection = db['students']