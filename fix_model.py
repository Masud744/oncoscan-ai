import tensorflow as tf

model = tf.keras.models.load_model("models/brain_tumor_model.h5", compile=False)

model.save("models/model_fixed.h5")

print("Model re-saved successfully")