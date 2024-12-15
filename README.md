# Attendify
Attendify is an ML-driven attendance automation system aimed at simplifying and modernizing attendance tracking in educational institutions. By leveraging facial recognition technology, Attendify automates the process of marking attendance, eliminating manual effort and reducing errors. Teachers can upload images of students, and the system processes these images to detect and recognize faces, automatically updating the attendance records.

## Demo
https://github.com/user-attachments/assets/f370b136-36ff-48a2-a45b-af0110b20677

## Features

- **Automated Face Recognition**: Uses OpenCV and face_recognition libraries to detect and identify students' faces from uploaded images. This eliminates the need for manual attendance marking.
  
- **Efficient Image Management**: Integrated with Cloudinary for secure and scalable cloud storage, enabling seamless upload, retrieval, and processing of images.
  
- **API-Driven Architecture**: Provides secure API endpoints built with Django, allowing for image uploads, face detection, and attendance management. This modular approach ensures the backend can be easily integrated with other systems.
  
- **Responsive User Interface**: The frontend is built with React, providing a user-friendly interface that works across devices, allowing teachers to access attendance data and upload images from both mobile and desktop platforms.
  
- **Scalable Design**: Designed with scalability in mind to handle multiple classrooms, sessions, and large datasets efficiently.
  
- **Real-Time Attendance Updates**: Planned future feature to automate attendance uploads directly to the school's management system or portal.
  
## How the System Works

1. **Image Capture**  
   Teachers will capture images of students, row by row, using their mobile devices. Each image contains a group of students sitting in a single row (10-12 students).

2. **Face Detection and Preview**  
   The system detects the faces in each image and provides a preview for confirmation. Teachers can verify the detected faces before proceeding.

3. **Face Recognition and Attendance Generation**  
   The system matches the detected faces with the known faces of students in the database. Once matched, an attendance list is automatically generated.

4. **Manual Marking of Missed Students**  
   If some students were missed during face detection or recognition, teachers can manually mark their attendance.

5. **Future Scope**  
   The next step is automating the process by directly uploading attendance records to the faculty portal, streamlining the entire attendance management system.


## Technologies Used

- **Python**: Backend language for implementing core logic and APIs.
- **Django**: Web framework for building the backend and API.
- **React**: Library for building the frontend interface and creating an interactive user experience.
- **MongoDB**: NoSQL database for storing student data, face bounding box coordinates, and attendance records.
- **OpenCV**: Library for computer vision tasks, including face detection from images.
- **face_recognition**: Python library for detecting and identifying student faces.
- **Pillow**: Library for image processing.
- **NumPy**: Library for numerical operations.
- **Cloudinary**: Cloud service for secure and scalable image storage and management.
- **Tailwind CSS**: CSS framework for building a responsive frontend.

