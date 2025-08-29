from io import BytesIO
from flask import Flask, request, jsonify
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load your trained model
model = load_model("model_inception.h5")


# Map model output to meaningful labels
class_map = {
    0: 'MildDemented',
    1: 'ModerateDemented',
    2: 'NonDemented',
    3: 'Normal',
    4: 'VeryMildDemented'
}

@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["file"]
    img = load_img(BytesIO(file.read()), target_size=(224, 224))
    img_array = img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)
    predicted_class_index = np.argmax(prediction)
    predicted_class = class_map[predicted_class_index]

    return jsonify({"prediction": predicted_class})

if __name__ == "__main__":
    app.run(debug=True)
