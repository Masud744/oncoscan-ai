import tensorflow as tf

# old model load
model = tf.keras.models.load_model("models/brain_tumor_model.h5", compile=False)

# save new compatible model
model.save("models/model_fixed.h5")

print("Model converted and saved as model_fixed.h5")