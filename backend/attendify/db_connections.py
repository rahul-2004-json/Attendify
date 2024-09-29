import pymongo

# url = "mongodb+srv://anand:anandpanda@cluster0.krt9qbo.mongodb.net/"
url = "mongodb://localhost:27017/"
client = pymongo.MongoClient(url)

db = client['attendify_data']
students_collection = db['students']
images_collection = db['Images']
preview_images_collection = db['previewImages']