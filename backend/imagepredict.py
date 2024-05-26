from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import numpy as np
import tensorflow as tf

app = Flask(__name__)
CORS(app)

# Load your trained model
model = tf.keras.models.load_model('../model/model_name.keras')

# Define your class labels
class_labels = ['Normal', 'Tumor']

# Function to preprocess image before feeding it to the model
def preprocess_image(image):
    image = image.resize((150, 150)) 
    image = np.array(image) / 255.0  # Normalize pixel values to [0, 1]
    return image

@app.route('/predictTumor', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'})

    image_file = request.files['image']
    image = Image.open(image_file)
    processed_image = preprocess_image(image)

    # Make prediction
    prediction = model.predict(np.expand_dims(processed_image, axis=0))
    
    print('Prediction scores:', prediction)

    # Get the predicted class label
    predicted_class_index = np.argmax(prediction)
    predicted_class = class_labels[predicted_class_index]

    return jsonify({'prediction': predicted_class})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port = 6000, debug=True)  # Run the Flask app