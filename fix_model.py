import tensorflow as tf

# Load model with tf.keras ONLY
model = tf.keras.models.load_model("models/brain_tumor_model.h5", compile=False)

# Save again using tf.keras
model.save("models/model_fixed.h5")

print("Model converted successfully")