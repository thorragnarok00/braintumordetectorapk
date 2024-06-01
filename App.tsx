import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchCamera, launchImageLibrary, ImagePickerResponse } from 'react-native-image-picker';

const App = () => {
  const [image, setImage] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);

  const pickImage = () => {
    const options = {
      mediaType: 'photo' as 'photo',
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const selectedImage = response.assets[0];
        setImage(selectedImage.uri || null);
        setPrediction(null);
      }
    });
  };

  const takePicture = () => {
    const options = {
      mediaType: 'photo' as 'photo',
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (!response.didCancel && response.assets && response.assets.length > 0) {
        const capturedImage = response.assets[0];
        setImage(capturedImage.uri || null);
        setPrediction(null);
      }
    });
  };

  const predictImage = async () => {
    if (image) {
      const formData = new FormData();
      formData.append('image', {
        uri: image,
        name: 'photo.jpg',
        type: 'image/jpg',
      });
  
      try {
        const response = await fetch('http://192.168.1.117:6000/predictTumor', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction);
        } else {
          console.error('Prediction failed:', response.status);
        }
      } catch (error) {
        console.error('Error predicting image:', error);
      }
    }
  };
  
  const clearImage = () => {
    setImage(null);
    setPrediction(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brain Tumor Detection</Text>
      <View style={styles.buttonContainer}>
        <Button title="Take Photo" onPress={takePicture} />
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Select Image" onPress={pickImage} color="#4CAF50" />
      </View>
      {image && <View style={styles.predictButtonContainer}>
        <Button title="Predict Image" onPress={predictImage} disabled={!image} color="#ffc107" />
      </View>}
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {prediction && <View style={styles.predictionContainer}>
        <Text style={styles.prediction}>Prediction: <Text style={styles.predictionText}>{prediction}</Text></Text>
      </View>}
      {image && <View style={styles.buttonContainer}>
        <Button title="Clear" onPress={clearImage} color="#ff6057" />
      </View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    width: 120,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginTop: 20,
    marginBottom: 20,
  },
  prediction: {
    fontSize: 20,
    textAlign: 'center',
  },
  predictionText: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  predictionContainer: {
    marginBottom: 10,
  },
  predictButtonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default App;