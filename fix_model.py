import tensorflow as tf

# old model load
model = tf.keras.models.load_model("models/brain_tumor_model.h5", compile=False)

# save in new keras format
model.save("models/model_fixed.keras")

print("Model converted and saved as model_fixed.keras")