import tensorflow as tf

# Load old model
model = tf.keras.models.load_model("models/brain_tumor_model.h5", compile=False)

# Export SavedModel format (folder)
model.export("models/model_fixed")

print("Model exported in SavedModel format")