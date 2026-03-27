import os
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

IMG_SIZE = 224

def load_dataset(dataset_path):
    data = []
    labels = []

    for category in os.listdir(dataset_path):
        category_path = os.path.join(dataset_path, category)
        label = 1 if category == "tumor" else 0

        for img in os.listdir(category_path):
            img_path = os.path.join(category_path, img)
            image = cv2.imread(img_path)
            image = cv2.resize(image, (IMG_SIZE, IMG_SIZE))
            image = image / 255.0

            data.append(image)
            labels.append(label)

            # Augmentation - flip
            flipped = cv2.flip(image, 1)
            data.append(flipped)
            labels.append(label)

    data = np.array(data)
    labels = np.array(labels)

    return train_test_split(data, labels, test_size=0.2, random_state=42)