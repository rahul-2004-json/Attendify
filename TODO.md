# TODO

- Face recognition and sending the final attendance list
- Implement face recogintion with the help of cloudinary
- add toast notification on addStudent
- image on clicking cross button are not removed from state

- takeAttendance Page : move branch to top, batches below it, on selection of branch filter out the batches that can be selected
    e.g : Change batch from F to E when ece selected 
- Redux implementation to hold states

- Add a loader before preview detection page when a user uploads an image and bounding boxes are created 
 
uploadimage  
and create a cloudinary folder for images array

Backend /
Removing uploading images to clodinary from previewImages function

previewDetection 
Add functionality to retake image and call the detect faces again for that image only 

PreviewDetection Page
Show the bounding boxes on images in frontend 

AddStudent Page
Remove the student from the list if the last image is also deleted 

MarkAttendance Page 
modify the mark attendance function to accept image file, bounding boxes and best rotation angle as request from frontend 

Error Handling in AddStudent when images are not uploaded