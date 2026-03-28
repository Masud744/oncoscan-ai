import tensorflow as tf

# Load old model
model = tf.keras.models.load_model(
    "models/brain_tumor_model.h5",
    compile=False
)

# Save in new Keras format (.keras)
model.save("models/model_fixed.keras")

print("Model converted and saved as model_fixed.keras")