import cv2

image_path = "ml_model/sample_images/rap_rotated.jpg"
cascade_path = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"

def detect_faces_haar(image_path, cascade_path):
    try:
        # loading Haar Cascade model
        face_cascade = cv2.CascadeClassifier(cascade_path)

        # Load the image
        image = cv2.imread(image_path)
        if image is None:
            print(f"Error loading image: {image_path}")
            return None

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        # Detect faces
        faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=7, minSize=(30, 30))

        # Draw rectangles around the faces
        for (x, y, w, h) in faces:
            x, y = max(x, 0), max(y, 0)
            x_end, y_end = min(x + w, image.shape[1]), min(y + h, image.shape[0])
            cv2.rectangle(image, (x, y), (x_end, y_end), (0, 255, 0), 2)

        # Save or display the result
        output_path = "detected_faces.jpg"
        cv2.imwrite(output_path, image)
        print(f"Faces detected and saved to {output_path}")

    except Exception as e:
        print(f"Error: {e}")
        return None

# make the program exportable
if __name__ == "__main__":
    detect_faces_haar(image_path, cascade_path)
