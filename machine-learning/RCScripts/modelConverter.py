import tensorflowjs as tfjs
import tensorflow as tf
import tensorflow_hub as hub

model_dir = r''
save_dir = r''

model = tf.keras.models.load_model(model_dir) #custom_objects={'KerasLayer':hub.KerasLayer})
print(model.summary())


tfjs.converters.convert_tf_saved_model(model, save_dir)

