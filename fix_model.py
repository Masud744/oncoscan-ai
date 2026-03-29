import tensorflow as tf
from tensorflow import keras

print("Loading original model...")
model = keras.models.load_model("models/brain_tumor_model.h5", compile=False)

print("Saving fixed H5 model...")
model.save("models/model_fixed.h5")

print("Saving Keras format model...")
model.save("models/model_fixed.keras")

print("Done! Model converted successfully.")